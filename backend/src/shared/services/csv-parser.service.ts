import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';

const normalizeHeader = (header: string): string =>
  header
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const MKTZAP_COLUMNS = [
  'data',
  'hora',
  'enviado_em',
  'respondido_em',
  'protocolo',
  'nome_cliente',
  'canal',
  'contato',
  'responsavel',
  'nota',
];

@Injectable()
class CsvParserService {
  async parse(buffer: Buffer): Promise<Record<string, string>[]> {
    const content = this.decode(buffer);
    const lines = content.split(/\r?\n/);
    const delimiter = this.detectDelimiter(content);
    if (this.isMktzap(lines)) {
      return this.parseMktzap(lines.slice(2).join('\n'), delimiter);
    }

    const fromLine = this.findHeaderLine(content);
    const parser = parse(content, {
      columns: (header: string[]) => header.map(normalizeHeader),
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      bom: true,
      from_line: fromLine,
      delimiter,
    });

    const records: Record<string, string>[] = [];
    for await (const record of parser) {
      records.push(record);
    }
    return records;
  }

  private async parseMktzap(content: string, delimiter: string): Promise<Record<string, string>[]> {
    const parser = parse(content, {
      delimiter,
      columns: MKTZAP_COLUMNS,
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      bom: true,
      skip_records_with_error: true,
      quote: null,
    });

    const records: Record<string, string>[] = [];
    for await (const record of parser) {
      records.push(record);
    }
    return records;
  }

  private isMktzap(lines: string[]): boolean {
    const header = lines[1]?.toLowerCase() ?? '';
    return header.startsWith('data;do;contato') || header.startsWith('data;do;');
  }

  private decode(buffer: Buffer): string {
    const utf8 = buffer.toString('utf-8');
    if (utf8.includes('\uFFFD')) {
      return buffer.toString('latin1');
    }
    return utf8;
  }

  private detectDelimiter(content: string): string {
    const line = content
      .split(/\r?\n/)
      .find((l) => l.includes('Protocolo') || l.includes('protocolo'));
    const sample = line ?? content;
    const semicolons = (sample.match(/;/g) ?? []).length;
    const commas = (sample.match(/,/g) ?? []).length;
    return semicolons >= commas ? ';' : ',';
  }

  private findHeaderLine(content: string): number {
    const lines = content.split(/\r?\n/);
    const headerIndicators = ['protocolo', 'status', 'nota', 'atendente', 'responsavel'];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (headerIndicators.some((indicator) => line.includes(indicator))) {
        return i + 1;
      }
    }
    return 1;
  }
}

export default CsvParserService;
