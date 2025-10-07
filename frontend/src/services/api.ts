import axios from 'axios';
import { Job, Candidate, ApiResponse } from '../types/greenhouse';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/greenhouse';

class ApiService {
  private apiKey: string | null = null;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('greenhouse_api_key', apiKey);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('greenhouse_api_key');
    }
    return this.apiKey;
  }

  private getHeaders() {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not set');
    }
    return {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-key`, {
        apiKey,
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  async getJobs(page: number = 1, perPage: number = 2): Promise<ApiResponse<Job>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`, {
        headers: this.getHeaders(),
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch jobs');
    }
  }

  async getJobById(jobId: number): Promise<Job> {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || `Failed to fetch job ${jobId}`);
    }
  }

  async getCandidatesForJob(jobId: number, page: number = 1, perPage: number = 2): Promise<ApiResponse<Candidate>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}/candidates`, {
        headers: this.getHeaders(),
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || `Failed to fetch candidates for job ${jobId}`);
    }
  }
}

export const apiService = new ApiService();
