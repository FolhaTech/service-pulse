import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';

const normalizeHeader = (header: string): string =>
  header
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

@Injectable()
export class CsvParserService {
  async parse(buffer: Buffer): Promise<Record<string, string>[]> {
    const content = this.decode(buffer);

    const fromLine = this.findHeaderLine(content);

    const parser = parse(content, {
      columns: (header: string[]) => header.map(normalizeHeader),
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      bom: true,
      from_line: fromLine,
      delimiter: ';',
    });

    const records: Record<string, string>[] = [];
    for await (const record of parser) {
      records.push(record);
    }
    return records;
  }

  private decode(buffer: Buffer): string {
    const utf8 = buffer.toString('utf-8');
    if (utf8.includes('\uFFFD')) {
      return buffer.toString('latin1');
    }
    return utf8;
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
