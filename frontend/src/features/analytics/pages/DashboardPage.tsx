import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Send from '@mui/icons-material/Send';
import Star from '@mui/icons-material/Star';
import ThumbUp from '@mui/icons-material/ThumbUp';
import Warning from '@mui/icons-material/Warning';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { AppShell } from '../../../shared/components/layout';
import { KpiCard, PageHeader } from '../../../shared/components/ui';
import { AgentPerformanceTable } from '../components/AgentPerformanceTable';
import { AttentionPanel } from '../components/AttentionPanel';
import { EvolutionChart } from '../components/EvolutionChart';
import { RatingDistribution } from '../components/RatingDistribution';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import type { AgentPerformance, DashboardMetric, RatingSlice } from '../types/analytics';

const metrics: DashboardMetric[] = [
  { label: 'Pesquisas Enviadas', value: '1.248', detail: 'Total no período' },
  {
    label: 'Respondidas',
    value: '936',
    detail: '75,0% de taxa de resposta',
    tone: 'positive',
  },
  { label: 'Não Respondidas', value: '312', detail: '25,0% do total enviado' },
  { label: 'Satisfação Positiva', value: '82,4%', detail: 'Avaliações Ótima + Boa' },
  { label: 'Índice Médio', value: '4,2 / 5', detail: 'Base nas respostas' },
  { label: 'Avaliações Críticas', value: '68', detail: 'Regular ou Ruim', tone: 'critical' },
];

const metricIcons: Record<string, React.ReactNode> = {
  'Pesquisas Enviadas': <Send />,
  Respondidas: <MarkEmailRead />,
  'Não Respondidas': <HourglassEmpty />,
  'Satisfação Positiva': <ThumbUp />,
  'Índice Médio': <Star />,
  'Avaliações Críticas': <Warning />,
};

const distribution: RatingSlice[] = [
  { level: 'Ótima', count: 520, color: 'primary' },
  { level: 'Boa', count: 348, color: 'info' },
  { level: 'Regular', count: 52, color: 'warning' },
  { level: 'Ruim', count: 16, color: 'error' },
];

const agents: AgentPerformance[] = [
  {
    initials: 'AS',
    name: 'Ana Silva',
    surveys: 245,
    answered: 198,
    responseRate: '80%',
    excellent: 120,
    good: 60,
    regular: 15,
    poor: 3,
    score: '4.6',
  },
  {
    initials: 'CO',
    name: 'Carlos Oliveira',
    surveys: 180,
    answered: 140,
    responseRate: '77%',
    excellent: 40,
    good: 60,
    regular: 30,
    poor: 10,
    score: '3.2',
  },
  {
    initials: 'FR',
    name: 'Fernanda Rocha',
    surveys: 310,
    answered: 220,
    responseRate: '71%',
    excellent: 140,
    good: 70,
    regular: 8,
    poor: 2,
    score: '4.8',
  },
  {
    initials: 'MS',
    name: 'Mariana Santos',
    surveys: 150,
    answered: 120,
    responseRate: '80%',
    excellent: 30,
    good: 50,
    regular: 25,
    poor: 15,
    score: '2.9',
  },
  {
    initials: 'RP',
    name: 'Ricardo Pereira',
    surveys: 363,
    answered: 258,
    responseRate: '71%',
    excellent: 190,
    good: 58,
    regular: 10,
    poor: 0,
    score: '4.7',
  },
];

export function DashboardPage() {
  const { filters, setPeriod, setAgent } = useDashboardFilters();

  return (
    <AppShell title="Avaliações">
      <Stack spacing={4}>
        <PageHeader
          title="Saúde dos Atendimentos"
          subtitle="Acompanhe a qualidade dos atendimentos da Assistência Jurídica com base nas avaliações recebidas."
          actions={
            <Stack direction="row" spacing={1}>
              <Select
                size="small"
                value={filters.period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="30">Últimos 30 dias</MenuItem>
                <MenuItem value="month">Este mês</MenuItem>
              </Select>
              <Select size="small" value={filters.agent} onChange={(e) => setAgent(e.target.value)}>
                <MenuItem value="all">Todos Atendentes</MenuItem>
              </Select>
            </Stack>
          }
        />

        <Grid container spacing={2}>
          {metrics.map((metric) => (
            <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 4 }}>
              <KpiCard {...metric} icon={metricIcons[metric.label]} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RatingDistribution slices={distribution} />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <EvolutionChart />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <AgentPerformanceTable agents={agents} />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <AttentionPanel agents={agents} />
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}
