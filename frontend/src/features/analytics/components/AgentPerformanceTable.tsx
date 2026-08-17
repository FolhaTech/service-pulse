import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { DataTable } from '../../../shared/components/ui';
import type { DataTableColumn } from '../../../shared/components/ui';
import type { AgentPerformance } from '../types/analytics';

export interface AgentPerformanceTableProps {
  agents: AgentPerformance[];
}

const columns: DataTableColumn<AgentPerformance>[] = [
  {
    id: 'name',
    label: 'Atendente',
    render: (agent) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>
          {agent.initials}
        </Avatar>
        {agent.name}
      </Box>
    ),
  },
  { id: 'surveys', label: 'Pesquisas', align: 'right', render: (agent) => agent.surveys },
  { id: 'answered', label: 'Resp.', align: 'right', render: (agent) => agent.answered },
  { id: 'rate', label: 'Taxa', align: 'right', render: (agent) => agent.responseRate },
  { id: 'excellent', label: 'Ótimas', align: 'right', render: (agent) => agent.excellent },
  { id: 'good', label: 'Boas', align: 'right', render: (agent) => agent.good },
  { id: 'regular', label: 'Reg.', align: 'right', render: (agent) => agent.regular },
  { id: 'poor', label: 'Ruins', align: 'right', render: (agent) => agent.poor },
  {
    id: 'score',
    label: 'Índice',
    align: 'right',
    render: (agent) => (
      <Chip
        size="small"
        label={agent.score}
        color={Number(agent.score) < 4 ? 'error' : 'success'}
        variant="outlined"
      />
    ),
  },
];

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  return (
    <DataTable columns={columns} rows={agents} getRowKey={(agent) => agent.name} minWidth={820} />
  );
}
