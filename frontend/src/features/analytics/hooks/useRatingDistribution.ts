import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../shared/services/api';
import type { DistributionRow } from '../../../shared/types/api';

export function useRatingDistribution() {
  return useQuery<DistributionRow[]>({
    queryKey: ['analytics', 'distribution'],
    queryFn: () => apiService.getDistribution(),
  });
}
