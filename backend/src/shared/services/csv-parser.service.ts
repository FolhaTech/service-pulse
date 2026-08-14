import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';

@Injectable()
export class CsvParserService {
  async parse(buffer: Buffer): Promise<Record<string, string>[]> {
    const content = this.decode(buffer);

    const normalizeHeader = (header: string): string =>
      header
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const parser = parse(content, {
      columns: (header: string[]) => header.map(normalizeHeader),
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
      bom: true,
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
}
