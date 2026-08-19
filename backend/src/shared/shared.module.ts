import { Global, Module } from '@nestjs/common';
import CsvParserService from './services/csv-parser.service';
import { MetricsService } from './services/metrics.service';

@Global()
@Module({
  providers: [CsvParserService, MetricsService],
  exports: [CsvParserService, MetricsService],
})
export class SharedModule {}
