import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../shared/services/api';
import type { Upload } from '../../../shared/types/api';

export function useUploads() {
  return useQuery<Upload[]>({
    queryKey: ['uploads'],
    queryFn: async () => apiService.listUploads(),
  });
}
