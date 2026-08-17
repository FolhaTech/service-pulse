import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type KpiTone = 'default' | 'positive' | 'critical';

export interface KpiCardProps {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: KpiTone;
}

export function KpiCard({ label, value, detail, icon, tone = 'default' }: KpiCardProps) {
  const isCritical = tone === 'critical';
  const isPositive = tone === 'positive';

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isCritical && { bgcolor: 'error.light' }),
        ...(isPositive && { bgcolor: 'success.light' }),
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 2 },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              mb: 1,
              ...(isCritical
                ? { bgcolor: 'error.main', color: 'error.contrastText' }
                : { bgcolor: 'primary.main', color: 'primary.contrastText' }),
            }}
          >
            {icon}
          </Box>
        )}

        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            ...(isCritical && { color: 'error.main' }),
            ...(!isCritical && { color: 'primary.main' }),
          }}
        >
          {value}
        </Typography>

        {detail && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
            {detail}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
