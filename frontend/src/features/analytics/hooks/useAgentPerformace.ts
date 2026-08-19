import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../shared/services/api';
import type { AgentPerformanceRow } from '../../../shared/types/api';

export function useAgentPerformance() {
  return useQuery<AgentPerformanceRow[]>({
    queryKey: ['analytics', 'agents'],
    queryFn: () => apiService.getAgentPerformance(),
  });
}
