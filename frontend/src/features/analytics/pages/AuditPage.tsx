import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { AppShell } from '../../../shared/components/layout';
import { DataTable, FilterBar, PageHeader, StatusBadge } from '../../../shared/components/ui';
import type { DataTableColumn } from '../../../shared/components/ui';
import type { AuditRecord } from '../types/analytics';

const records: AuditRecord[] = [
  {
    initials: 'MS',
    agent: 'Mariana Santos',
    rating: 'Regular',
    quantity: 6,
    percentage: '10,5%',
    severity: 'Atenção',
  },
  {
    initials: 'CO',
    agent: 'Carlos Oliveira',
    rating: 'Ruim',
    quantity: 4,
    percentage: '8,7%',
    severity: 'Crítico',
  },
  {
    initials: 'AL',
    agent: 'Ana Lima',
    rating: 'Ruim',
    quantity: 7,
    percentage: '14,2%',
    severity: 'Crítico',
  },
  {
    initials: 'FP',
    agent: 'Fernando Costa',
    rating: 'Regular',
    quantity: 3,
    percentage: '5,1%',
    severity: 'Atenção',
  },
];

const columns: DataTableColumn<AuditRecord>[] = [
  {
    id: 'agent',
    label: 'Atendente',
    render: (record) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography component="span" sx={{ fontWeight: 700 }}>
          {record.initials}
        </Typography>
        {record.agent}
      </Box>
    ),
  },
  { id: 'rating', label: 'Avaliação', render: (record) => record.rating },
  { id: 'quantity', label: 'Quantidade', render: (record) => record.quantity },
  { id: 'percentage', label: 'Percentual', render: (record) => record.percentage },
  {
    id: 'severity',
    label: 'Status',
    render: (record) => (
      <StatusBadge
        label={record.severity}
        color={record.severity === 'Crítico' ? 'error' : 'warning'}
      />
    ),
  },
  {
    id: 'action',
    label: 'Ação',
    render: () => (
      <Button size="small" variant="outlined">
        Ver detalhes
      </Button>
    ),
  },
];

export function AuditPage() {
  return (
    <AppShell title="Auditoria">
      <PageHeader
        title="Auditoria de avaliações"
        subtitle="Identifique avaliações que podem exigir análise do time responsável."
      />

      <FilterBar>
        <Select size="small" defaultValue="all">
          <MenuItem value="all">Atendente (Todos)</MenuItem>
        </Select>
        <Select size="small" defaultValue="focus">
          <MenuItem value="focus">Classificação (Regular/Ruim)</MenuItem>
          <MenuItem value="regular">Regular</MenuItem>
          <MenuItem value="poor">Ruim</MenuItem>
        </Select>
        <Select size="small" defaultValue="all">
          <MenuItem value="all">Severidade (Todas)</MenuItem>
          <MenuItem value="attention">Atenção</MenuItem>
          <MenuItem value="critical">Crítico</MenuItem>
        </Select>
        <Box sx={{ flexGrow: 1 }} />
        <Select size="small" defaultValue="30">
          <MenuItem value="30">Últimos 30 dias</MenuItem>
          <MenuItem value="7">Últimos 7 dias</MenuItem>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={records}
        getRowKey={(record) => `${record.agent}-${record.rating}`}
        minWidth={760}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Exibindo 4 de 24 registros críticos/atenção.
      </Typography>
    </AppShell>
  );
}
