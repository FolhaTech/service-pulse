import type {
  AgentPerformanceRow,
  AuditRow,
  DistributionRow,
} from '../../../shared/types/api';
import type { AgentPerformance, AuditRecord, RatingSlice } from '../types/analytics';

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';

const RATING_COLOR: Record<RatingSlice['level'], RatingSlice['color']> = {
  Ótima: 'primary',
  Boa: 'info',
  Regular: 'warning',
  Ruim: 'error',
};

export const mapAgent = (row: AgentPerformanceRow): AgentPerformance => ({
  initials: getInitials(row.name),
  name: row.name,
  surveys: row.surveys,
  answered: row.answered,
  responseRate: `${row.responseRate}%`,
  excellent: row.excellent,
  good: row.good,
  regular: row.regular,
  poor: row.poor,
  score: String(row.averageScore),
});

export const mapDistribution = (rows: DistributionRow[]): RatingSlice[] =>
  rows.map((row) => ({ level: row.level, count: row.count, color: RATING_COLOR[row.level] }));

export const mapAudit = (row: AuditRow): AuditRecord => ({
  initials: getInitials(row.agentName),
  agent: row.agentName,
  rating: row.rating,
  quantity: row.quantity,
  percentage: `${row.percentage.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`,
  severity: row.severity,
});
