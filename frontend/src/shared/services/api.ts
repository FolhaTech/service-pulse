import axios, { type AxiosInstance } from 'axios';
import type {
  AgentPerformanceRow,
  AuditRow,
  DistributionRow,
  OverviewResult,
  Upload,
} from '../types/api';

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

  async getOverview(): Promise<OverviewResult> {
    const response = await this.client.get<OverviewResult>('/analytics/overview');
    return response.data;
  }

  async getAgentPerformance(): Promise<AgentPerformanceRow[]> {
    const response = await this.client.get<AgentPerformanceRow[]>('/analytics/agents');
    return response.data;
  }

  async getDistribution(): Promise<DistributionRow[]> {
    const response = await this.client.get<DistributionRow[]>('/analytics/distribution');
    return response.data;
  }

  async getAuditRecords(): Promise<AuditRow[]> {
    const response = await this.client.get<AuditRow[]>('/analytics/audit');
    return response.data;
  }
}

export const apiService = new ApiService();
