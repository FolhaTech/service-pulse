export type MetricTone = 'default' | 'positive' | 'critical';

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone?: MetricTone;
}

export type RatingLevel = 'Ótima' | 'Boa' | 'Regular' | 'Ruim';

export interface RatingSlice {
  level: RatingLevel;
  count: number;
  color: 'primary' | 'info' | 'warning' | 'error';
}

export interface AgentPerformance {
  initials: string;
  name: string;
  surveys: number;
  answered: number;
  responseRate: string;
  excellent: number;
  good: number;
  regular: number;
  poor: number;
  score: string;
}

export type AuditSeverity = 'Atenção' | 'Crítico';

export interface AuditRecord {
  initials: string;
  agent: string;
  rating: 'Regular' | 'Ruim';
  quantity: number;
  percentage: string;
  severity: AuditSeverity;
}
