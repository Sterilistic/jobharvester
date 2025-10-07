import axios, { AxiosResponse } from 'axios';
import { Job, Candidate, GreenhouseApiResponse } from '../types/greenhouse';

export class GreenhouseService {
  private baseURL = 'https://harvest.greenhouse.io/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  async getJobs(page: number = 1, perPage: number = 10): Promise<GreenhouseApiResponse<Job>> {
    try {
      const response: AxiosResponse<Job[]> = await axios.get(
        `${this.baseURL}/jobs`,
        {
          headers: this.getAuthHeaders(),
          params: {
            page,
            per_page: perPage,
          },
        }
      );

      // For Greenhouse API, we need to estimate total count
      // If we get a full page, there might be more data
      let total = response.data.length;
      let hasNextPage = false;
      
      if (response.data.length === perPage) {
        // Check if there's a next page by requesting one more item
        try {
          const nextPageResponse = await axios.get(
            `${this.baseURL}/jobs`,
            {
              headers: this.getAuthHeaders(),
              params: {
                page: page + 1,
                per_page: 1,
              },
            }
          );
          hasNextPage = nextPageResponse.data.length > 0;
          if (hasNextPage) {
            total = (page * perPage) + 1; // Estimate total
          }
        } catch (e) {
          // If we can't check next page, assume current page is full
          hasNextPage = true;
          total = (page * perPage) + 1;
        }
      }

      return {
        jobs: response.data,
        meta: {
          total,
          page,
          per_page: perPage,
          has_next_page: hasNextPage,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch jobs: ${error.response?.data?.message || error.message}`);
    }
  }

  async getJobById(jobId: number): Promise<Job> {
    try {
      const response: AxiosResponse<Job> = await axios.get(
        `${this.baseURL}/jobs/${jobId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch job ${jobId}: ${error.response?.data?.message || error.message}`);
    }
  }

  async getCandidatesForJob(jobId: number, page: number = 1, perPage: number = 10): Promise<GreenhouseApiResponse<Candidate>> {
    try {
      const response: AxiosResponse<Candidate[]> = await axios.get(
        `${this.baseURL}/candidates`,
        {
          headers: this.getAuthHeaders(),
          params: {
            job_id: jobId,
            page,
            per_page: perPage,
          },
        }
      );

      // Check if there's a next page
      let hasNextPage = false;
      if (response.data.length === perPage) {
        try {
          const nextPageResponse = await axios.get(
            `${this.baseURL}/candidates`,
            {
              headers: this.getAuthHeaders(),
              params: {
                job_id: jobId,
                page: page + 1,
                per_page: 1,
              },
            }
          );
          hasNextPage = nextPageResponse.data.length > 0;
        } catch (e) {
          hasNextPage = true;
        }
      }

      return {
        candidates: response.data,
        meta: {
          total: response.data.length,
          page,
          per_page: perPage,
          has_next_page: hasNextPage,
          has_prev_page: page > 1,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch candidates for job ${jobId}: ${error.response?.data?.message || error.message}`);
    }
  }

  async getAllCandidates(page: number = 1, perPage: number = 2): Promise<GreenhouseApiResponse<Candidate>> {
    try {
      const response: AxiosResponse<Candidate[]> = await axios.get(
        `${this.baseURL}/candidates`,
        {
          headers: this.getAuthHeaders(),
          params: {
            page,
            per_page: perPage,
          },
        }
      );

      return {
        candidates: response.data,
        meta: {
          total: response.data.length,
          page,
          per_page: perPage,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch candidates: ${error.response?.data?.message || error.message}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/jobs`, {
        headers: this.getAuthHeaders(),
        params: { per_page: 1 },
      });
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
