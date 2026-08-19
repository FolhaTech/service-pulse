import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../shared/services/api';
import type { AuditRow } from '../../../shared/types/api';

export function useAuditRecords() {
  return useQuery<AuditRow[]>({
    queryKey: ['analytics', 'audit'],
    queryFn: () => apiService.getAuditRecords(),
  });
}
