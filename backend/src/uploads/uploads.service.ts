import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, ResponseStatus, Upload, UploadStatus } from 'src/generated/prisma/client';
import { CsvParserService } from 'src/shared/services/csv-parser.service';

const FIELD_ALIASES: Record<string, string[]> = {
  protocol: ['protocolo', 'protocol'],
  contactName: ['contato', 'nome do contato', 'nome'],
  phone: ['telefone', 'celular', 'fone'],
  responsibleName: ['responsavel', 'atendente', 'operador'],
  channelName: ['canal'],
  surveyName: ['pesquisa', 'nome da pesquisa'],
  contactedAt: ['data do contato', 'data de contato', 'data contato'],
  sentAt: ['data do envio', 'data de envio', 'data envio'],
  answeredAt: ['data da resposta', 'data de resposta', 'data resposta'],
  status: ['status', 'situacao'],
  score: ['nota', 'score'],
  scoreLabel: ['rotulo', 'classificacao', 'avaliacao'],
};

const STATUS_MAP: Record<string, ResponseStatus> = {
  enviada: ResponseStatus.SENT,
  enviado: ResponseStatus.SENT,
  respondida: ResponseStatus.ANSWERED,
  respondido: ResponseStatus.ANSWERED,
  'nao respondida': ResponseStatus.UNANSWERED,
  'nao respondido': ResponseStatus.UNANSWERED,
};

interface LookupCaches {
  responsibleIds: Map<string, string>;
  channelIds: Map<string, string>;
  surveyIds: Map<string, string>;
  contactIds: Map<string, string>;
}

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly csvParser: CsvParserService,
  ) {}
  async processCsv(file: Express.Multer.File): Promise<Upload> {
    if (!file || !file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('Envie um arquivo CSV válido');
    }

    const upload = await this.prisma.upload.create({
      data: { filename: file.originalname, status: UploadStatus.PROCESSING },
    });

    try {
      const records = await this.csvParser.parse(file.buffer);

      if (records.length === 0) {
        throw new BadRequestException('O CSV está vazio ou sem dados');
      }

      const caches: LookupCaches = {
        responsibleIds: new Map(),
        channelIds: new Map(),
        surveyIds: new Map(),
        contactIds: new Map(),
      };

      let skipped = 0;
      const rows: Prisma.SurveyResponseCreateManyInput[] = [];

      for (const record of records) {
        const protocol = this.pick(record, FIELD_ALIASES.protocol);
        if (!protocol) {
          skipped++;
          continue;
        }

        rows.push(await this.mapRow(record, protocol, caches));
      }

      if (rows.length > 0) {
        await this.prisma.surveyResponse.createMany({ data: rows });
      }

      return this.prisma.upload.update({
        where: { id: upload.id },
        data: { status: UploadStatus.COMPLETED, rowCount: rows.length, skipped },
      });
    } catch (error) {
      await this.prisma.upload
        .update({ where: { id: upload.id }, data: { status: UploadStatus.FAILED } })
        .catch(() => undefined);
      throw error;
    }
  }

  private async mapRow(
    record: Record<string, string>,
    protocol: string,
    caches: LookupCaches,
  ): Promise<Prisma.SurveyResponseCreateManyInput> {
    const responsibleName = this.pick(record, FIELD_ALIASES.responsibleName) || 'Desconhecido';
    const channelName = this.pick(record, FIELD_ALIASES.channelName) || 'Sem canal';
    const surveyName = this.pick(record, FIELD_ALIASES.surveyName) || 'Sem pesquisa';
    const contactName = this.pick(record, FIELD_ALIASES.contactName) || 'Contato desconhecido';
    const phone = this.pick(record, FIELD_ALIASES.phone);

    const [responsibleId, channelId, surveyId, contactId] = await Promise.all([
      this.getOrCreateResponsible(responsibleName, caches.responsibleIds),
      this.getOrCreateChannel(channelName, caches.channelIds),
      this.getOrCreateSurvey(surveyName, caches.surveyIds),
      this.getOrCreateContact(contactName, phone, caches.contactIds),
    ]);

    return {
      protocol,
      contactId,
      responsibleId,
      channelId,
      surveyId,
      contactedAt: this.parseDate(this.pick(record, FIELD_ALIASES.contactedAt)) ?? new Date(),
      sentAt: this.parseDate(this.pick(record, FIELD_ALIASES.sentAt)),
      answeredAt: this.parseDate(this.pick(record, FIELD_ALIASES.answeredAt)),
      status: this.parseStatus(this.pick(record, FIELD_ALIASES.status)),
      score: this.parseScore(this.pick(record, FIELD_ALIASES.score)),
      scoreLabel: this.pick(record, FIELD_ALIASES.scoreLabel) ?? null,
    };
  }

  private async getOrCreateResponsible(name: string, cache: Map<string, string>): Promise<string> {
    return this.getOrCreateUnique(name, cache, (key) =>
      this.prisma.responsible.upsert({
        where: { name: key },
        create: { name: key },
        update: {},
      }),
    );
  }

  private async getOrCreateChannel(name: string, cache: Map<string, string>): Promise<string> {
    return this.getOrCreateUnique(name, cache, (key) =>
      this.prisma.channel.upsert({
        where: { name: key },
        create: { name: key },
        update: {},
      }),
    );
  }

  private async getOrCreateSurvey(name: string, cache: Map<string, string>): Promise<string> {
    return this.getOrCreateUnique(name, cache, async (key) => {
      const existing = await this.prisma.survey.findFirst({ where: { name: key } });
      return existing ?? this.prisma.survey.create({ data: { name: key } });
    });
  }

  private async getOrCreateContact(
    name: string,
    phone: string | undefined,
    cache: Map<string, string>,
  ): Promise<string> {
    const key = name.trim();
    const cached = cache.get(key);
    if (cached) return cached;

    const existing = await this.prisma.contact.findFirst({ where: { name: key } });
    const contact =
      existing ??
      (await this.prisma.contact.create({
        data: { name: key, phone: phone ?? null },
      }));

    cache.set(key, contact.id);
    return contact.id;
  }

  private async getOrCreateUnique(
    name: string,
    cache: Map<string, string>,
    findOrCreate: (key: string) => Promise<{ id: string }>,
  ): Promise<string> {
    const key = name.trim();
    const cached = cache.get(key);
    if (cached) return cached;

    const entity = await findOrCreate(key);
    cache.set(key, entity.id);
    return entity.id;
  }

  private pick(record: Record<string, string>, aliases: string[]): string | undefined {
    for (const alias of aliases) {
      const value = record[alias];
      if (value !== undefined && value !== '') return value;
    }
    return undefined;
  }

  private parseScore(value: string | undefined): number | null {
    const digits = (value ?? '').replace(/\D/g, '');
    if (!digits) return null;
    const parsed = Number.parseInt(digits, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private parseStatus(value: string | undefined): ResponseStatus {
    const normalized = (value ?? '').trim().toLowerCase();
    return STATUS_MAP[normalized] ?? ResponseStatus.UNANSWERED;
  }
  private parseDate(value: string | undefined): Date | null {
    if (!value) return null;
    const trimmed = value.trim();

    const br = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (br) {
      const [, d, m, y, h = '0', min = '0'] = br;
      return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min));
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  async listUploads(): Promise<Upload[]> {
    return this.prisma.upload.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
  }
}
