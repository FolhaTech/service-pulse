import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  AgentPerformanceRow,
  AuditRow,
  DistributionRow,
  OverviewResult,
} from './types/analytics.types';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'General indicators (dashboard KPIs)' })
  @ApiResponse({ status: 200, type: Object })
  getOverview(): Promise<OverviewResult> {
    return this.analyticsService.getOverview();
  }

  @Get('agents')
  @ApiOperation({ summary: 'Performance by agent' })
  getAgents(): Promise<AgentPerformanceRow[]> {
    return this.analyticsService.getAgentsPerformance();
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Distribution of ratings' })
  getDistribution(): Promise<DistributionRow[]> {
    return this.analyticsService.getDistribution();
  }

  @Get('audit')
  @ApiOperation({ summary: 'Audit records (Good/Poor per representative)' })
  getAudit(): Promise<AuditRow[]> {
    return this.analyticsService.getAuditRecords();
  }
}
