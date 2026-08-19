import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../shared/services/api';
import type { OverviewResult } from '../../../shared/types/api';

export function useDashboardOverview() {
  return useQuery<OverviewResult>({
    queryKey: ['analytics', 'overview'],
    queryFn: () => apiService.getOverview(),
  });
}
