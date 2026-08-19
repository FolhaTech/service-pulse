import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MetricsService } from 'src/shared/services/metrics.service';
import {
  AgentPerformanceRow,
  AuditRow,
  DistributionRow,
  OverviewResult,
} from './types/analytics.types';

const classify = (score: number | null, label: string | null) => {
  if (label) {
    const normalized = label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes('otim')) return 'Ótima';
    if (normalized.includes('boa')) return 'Boa';
    if (normalized.includes('regul')) return 'Regular';
    if (normalized.includes('ruim')) return 'Ruim';
  }
  if (score === null) return 'Sem avaliação';
  if (score >= 5) return 'Ótima';
  if (score === 4) return 'Boa';
  if (score === 3) return 'Regular';
  return 'Ruim';
};

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async getOverview(): Promise<OverviewResult> {
    const [sent, answered, unanswered, rated] = await Promise.all([
      this.prisma.surveyResponse.count({ where: { status: 'SENT' } }),
      this.prisma.surveyResponse.count({ where: { status: 'ANSWERED' } }),
      this.prisma.surveyResponse.count({ where: { status: 'UNANSWERED' } }),
      this.prisma.surveyResponse.findMany({
        where: { status: 'ANSWERED' },
        select: { score: true, scoreLabel: true },
      }),
    ]);

    const counts = {
      surveysSent: sent,
      surveysAnswered: answered,
      surveysUnanswered: unanswered,
      ratingGreat: 0,
      ratingGood: 0,
      ratingRegular: 0,
      ratingBad: 0,
    };

    for (const r of rated) {
      const level = classify(r.score, r.scoreLabel);
      if (level === 'Ótima') counts.ratingGreat++;
      else if (level === 'Boa') counts.ratingGood++;
      else if (level === 'Regular') counts.ratingRegular++;
      else if (level === 'Ruim') counts.ratingBad++;
    }

    const { responseRate, satisfactionIndex, pctPositive } = this.metrics.calculate(counts);

    const scores = rated.map((r) => r.score).filter((s): s is number => s !== null);
    const averageScore =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : 0;

    return {
      surveysSent: sent,
      surveysAnswered: answered,
      surveysUnanswered: unanswered,
      responseRate,
      satisfactionIndex,
      pctPositive,
      averageScore,
      criticalCount: counts.ratingRegular + counts.ratingBad,
    };
  }

  async getDistribution(): Promise<DistributionRow[]> {
    const rated = await this.prisma.surveyResponse.findMany({
      where: { status: 'ANSWERED' },
      select: { score: true, scoreLabel: true },
    });

    const acc: Record<string, number> = { Ótima: 0, Boa: 0, Regular: 0, Ruim: 0 };
    for (const r of rated) {
      const level = classify(r.score, r.scoreLabel);
      if (level in acc) acc[level]++;
    }

    return (['Ótima', 'Boa', 'Regular', 'Ruim'] as const).map((level) => ({
      level,
      count: acc[level],
    }));
  }

  async getAgentsPerformance(): Promise<AgentPerformanceRow[]> {
    const responses = await this.prisma.surveyResponse.findMany({
      select: {
        responsible: { select: { id: true, name: true } },
        status: true,
        score: true,
        scoreLabel: true,
      },
    });

    const byAgent = new Map<string, AgentPerformanceRow>();

    for (const r of responses) {
      const agentId = r.responsible.id;
      const agentName = r.responsible.name;
      let row = byAgent.get(agentId);
      if (!row) {
        row = {
          id: agentId,
          name: agentName,
          surveys: 0,
          answered: 0,
          responseRate: 0,
          excellent: 0,
          good: 0,
          regular: 0,
          poor: 0,
          averageScore: 0,
        };
        byAgent.set(agentId, row);
      }

      row.surveys++;
      if (r.status === 'ANSWERED') {
        row.answered++;
        const level = classify(r.score, r.scoreLabel);
        if (level === 'Ótima') row.excellent++;
        else if (level === 'Boa') row.good++;
        else if (level === 'Regular') row.regular++;
        else if (level === 'Ruim') row.poor++;
      }
    }

    const rows = [...byAgent.values()];
    for (const row of rows) {
      row.responseRate = row.surveys > 0 ? Math.round((row.answered / row.surveys) * 100) : 0;
      const scores = responses
        .filter((r) => r.responsible.id === row.id && r.score !== null)
        .map((r) => r.score as number);
      row.averageScore =
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0;
    }

    return rows.sort((a, b) => b.averageScore - a.averageScore);
  }

  async getAuditRecords(): Promise<AuditRow[]> {
    const responses = await this.prisma.surveyResponse.findMany({
      where: { status: 'ANSWERED' },
      select: {
        responsible: { select: { id: true, name: true } },
        score: true,
        scoreLabel: true,
      },
    });

    const acc = new Map<
      string,
      { agentId: string; agentName: string; regular: number; bad: number }
    >();
    for (const r of responses) {
      const level = classify(r.score, r.scoreLabel);
      if (level !== 'Regular' && level !== 'Ruim') continue;
      const entry = acc.get(r.responsible.id) ?? {
        agentId: r.responsible.id,
        agentName: r.responsible.name,
        regular: 0,
        bad: 0,
      };
      if (level === 'Regular') entry.regular++;
      else entry.bad++;
      acc.set(r.responsible.id, entry);
    }

    const totalCritical = [...acc.values()].reduce((s, e) => s + e.regular + e.bad, 0);

    return [...acc.values()]
      .flatMap((entry) => {
        const rows: AuditRow[] = [];
        if (entry.regular > 0) {
          rows.push({
            agentId: entry.agentId,
            agentName: entry.agentName,
            rating: 'Regular',
            quantity: entry.regular,
            percentage:
              totalCritical > 0 ? Math.round((entry.regular / totalCritical) * 1000) / 10 : 0,
            severity: 'Atenção',
          });
        }
        if (entry.bad > 0) {
          rows.push({
            agentId: entry.agentId,
            agentName: entry.agentName,
            rating: 'Ruim',
            quantity: entry.bad,
            percentage: totalCritical > 0 ? Math.round((entry.bad / totalCritical) * 1000) / 10 : 0,
            severity: 'Crítico',
          });
        }
        return rows;
      })
      .sort((a, b) => b.quantity - a.quantity);
  }
}
