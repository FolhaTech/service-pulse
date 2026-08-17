import BarChart from '@mui/icons-material/BarChart';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { RatingSlice } from '../types/analytics';

export interface RatingDistributionProps {
  slices: RatingSlice[];
}

export function RatingDistribution({ slices }: RatingDistributionProps) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart color="action" />
          Distribuição das Avaliações
        </Typography>
        <Stack spacing={2.5} sx={{ mt: 3 }}>
          {slices.map((slice) => {
            const percent = total > 0 ? (slice.count / total) * 100 : 0;
            return (
              <Box key={slice.level}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {slice.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {slice.count} · {percent.toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={percent}
                  color={slice.color}
                  sx={{ height: 10, borderRadius: 5, bgcolor: 'grey.200' }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
