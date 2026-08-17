import FilterList from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface FilterBarProps {
  children: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' } }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <FilterList color="action" />
          <Typography variant="overline">Filtros</Typography>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}
