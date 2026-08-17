import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

export interface StatusBadgeProps {
  label: string;
  color?: ChipProps['color'];
  variant?: ChipProps['variant'];
}

export function StatusBadge({ label, color = 'default', variant = 'filled' }: StatusBadgeProps) {
  return <Chip size="small" label={label} color={color} variant={variant} />;
}
