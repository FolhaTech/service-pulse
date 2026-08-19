import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../shared/services/api';

export function useUploadCsv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiService.uploadCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
  });
}
