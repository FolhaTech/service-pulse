export interface OverviewResult {
  surveysSent: number;
  surveysAnswered: number;
  surveysUnanswered: number;
  responseRate: number;
  satisfactionIndex: number;
  pctPositive: number;
  averageScore: number;
  criticalCount: number;
}

export interface AgentPerformanceRow {
  id: string;
  name: string;
  surveys: number;
  answered: number;
  responseRate: number;
  excellent: number;
  good: number;
  regular: number;
  poor: number;
  averageScore: number;
}

export interface DistributionRow {
  level: 'Ótima' | 'Boa' | 'Regular' | 'Ruim';
  count: number;
}

export interface AuditRow {
  agentId: string;
  agentName: string;
  rating: 'Regular' | 'Ruim';
  quantity: number;
  percentage: number;
  severity: 'Atenção' | 'Crítico';
}
