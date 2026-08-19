import { Global, Module } from '@nestjs/common';
import CsvParserService from './csv-parser.service';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  providers: [CsvParserService, MetricsService],
  exports: [CsvParserService, MetricsService],
})
export class SharedModule {}
