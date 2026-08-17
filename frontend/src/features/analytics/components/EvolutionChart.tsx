import Timeline from '@mui/icons-material/Timeline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function EvolutionChart() {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline color="action" />
          Evolução das Avaliações
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'primary.main' }} />
            <Typography variant="caption">Positivas</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'error.main' }} />
            <Typography variant="caption">Críticas</Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            height: 220,
            mt: 2,
            bgcolor: 'grey.50',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Typography color="text.secondary">Gráfico aguardando dados da integração</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
