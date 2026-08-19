import axios, { type AxiosInstance } from 'axios';
import type { Upload } from '../types/api';

export class ApiService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });
  }

  async getHealth(): Promise<string> {
    const response = await this.client.get<string>('/');
    return response.data;
  }

  async listUploads(): Promise<Upload[]> {
    const response = await this.client.get<Upload[]>('/uploads');
    if (response.status !== 200) {
      throw new Error('Failed to list uploads');
    }
    return response.data;
  }

  async uploadCsv(file: File): Promise<Upload> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post<Upload>('/uploads', formData);
    return response.data;
  }
}

export const apiService = new ApiService();
