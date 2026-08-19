import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Send from '@mui/icons-material/Send';
import Star from '@mui/icons-material/Star';
import ThumbUp from '@mui/icons-material/ThumbUp';
import Warning from '@mui/icons-material/Warning';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';
import { AppShell, KpiCard, PageHeader } from '../../../shared/components';
import { AgentPerformanceTable } from '../components/AgentPerformanceTable';
import { EvolutionChart } from '../components/EvolutionChart';
import { RatingDistribution } from '../components/RatingDistribution';
import { useDashboardFilters } from '../hooks';
import { useAgentPerformance } from '../hooks/useAgentPerformace';
import { useDashboardOverview } from '../hooks/useDashboardOverview';
import { useRatingDistribution } from '../hooks/useRatingDistribution';
import type { DashboardMetric } from '../types';
import { mapAgent, mapDistribution } from '../utils/mapper';

const metricIcons: Record<string, ReactNode> = {
  'Pesquisas Enviadas': <Send />,
  Respondidas: <MarkEmailRead />,
  'Não Respondidas': <HourglassEmpty />,
  'Satisfação Positiva': <ThumbUp />,
  'Índice Médio': <Star />,
  'Avaliações Críticas': <Warning />,
};

export function DashboardPage() {
  const { filters, setPeriod, setAgent } = useDashboardFilters();
  const overview = useDashboardOverview();
  const agents = useAgentPerformance();
  const distribution = useRatingDistribution();

  const isLoading = overview.isPending || agents.isPending || distribution.isPending;

  const metrics: DashboardMetric[] = overview.data
    ? [
        {
          label: 'Pesquisas Enviadas',
          value: String(overview.data.surveysSent),
          detail: 'Total no período',
        },
        {
          label: 'Respondidas',
          value: String(overview.data.surveysAnswered),
          detail: `${overview.data.responseRate}% de taxa de resposta`,
          tone: 'positive',
        },
        {
          label: 'Não Respondidas',
          value: String(overview.data.surveysUnanswered),
          detail: 'Do total enviado',
        },
        {
          label: 'Satisfação Positiva',
          value: `${overview.data.pctPositive}%`,
          detail: 'Avaliações Ótima + Boa',
        },
        {
          label: 'Índice Médio',
          value: `${overview.data.averageScore} / 5`,
          detail: 'Base nas respostas',
        },
        {
          label: 'Avaliações Críticas',
          value: String(overview.data.criticalCount),
          detail: 'Regular ou Ruim',
          tone: 'critical',
        },
      ]
    : [];

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

        {isLoading && (
          <Stack sx={{ alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && (
          <>
            <Grid container spacing={2}>
              {metrics.map((metric) => (
                <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <KpiCard {...metric} icon={metricIcons[metric.label]} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 4 }}>
                <RatingDistribution slices={mapDistribution(distribution.data ?? [])} />
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <EvolutionChart />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 9 }}>
                <AgentPerformanceTable agents={(agents.data ?? []).map(mapAgent)} />
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </AppShell>
  );
}
