import Campaign from '@mui/icons-material/Campaign';
import Mail from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { AgentPerformance } from '../types/analytics';

export interface AttentionPanelProps {
  agents: AgentPerformance[];
  threshold?: number;
}

export function AttentionPanel({ agents, threshold = 4 }: AttentionPanelProps) {
  const atRisk = agents.filter((agent) => Number(agent.score) < threshold);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography
          variant="h6"
          color="error.main"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Campaign />
          Atenção Necessária
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {atRisk.map((agent) => (
            <Box
              key={agent.name}
              sx={{ p: 1.5, border: 1, borderColor: 'error.light', borderRadius: 2 }}
            >
              <Typography sx={{ fontWeight: 600 }}>{agent.name}</Typography>
              <Typography variant="body2" color="error.main">
                Índice: {agent.score} / 5
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                Alta concentração de avaliações que precisam de análise.
              </Typography>
              <Button size="small" fullWidth sx={{ mt: 1.5 }} variant="outlined" color="error">
                Analisar casos
              </Button>
            </Box>
          ))}
        </Stack>

        <Button fullWidth variant="contained" startIcon={<Mail />} sx={{ mt: 2 }}>
          Configurar alertas
        </Button>
      </CardContent>
    </Card>
  );
}
