export type UploadStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Upload {
  id: string;
  filename: string;
  uploadedAt: string;
  rowCount: number;
  skipped: number;
  status: UploadStatus;
}
