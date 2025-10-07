import axios, { AxiosResponse } from 'axios';
import { Job, Candidate, GreenhouseApiResponse } from '../types/greenhouse';

interface LinkHeader {
  url: string;
  rel: string;
}

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

      // Parse Link header from Greenhouse API response
      const linkHeader = response.headers.link;
      let hasNextPage = false;
      let hasPrevPage = false;
      let total = response.data.length;

      if (linkHeader) {
        // Parse Link header to determine pagination state
        const links: LinkHeader[] = linkHeader.split(',').map((link: string) => {
          const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
          return match ? { url: match[1], rel: match[2] } : null;
        }).filter(Boolean) as LinkHeader[];

        hasNextPage = links.some(link => link.rel === 'next');
        hasPrevPage = links.some(link => link.rel === 'prev');
        
        // Try to extract total from 'last' link
        const lastLink = links.find(link => link.rel === 'last');
        if (lastLink) {
          const lastPageMatch = lastLink.url.match(/page=(\d+)/);
          if (lastPageMatch) {
            total = parseInt(lastPageMatch[1]) * perPage;
          }
        }
      } else {
        // Fallback: if no Link header, estimate based on current page
        hasNextPage = response.data.length === perPage;
        hasPrevPage = page > 1;
        if (hasNextPage) {
          total = (page * perPage) + 1; // Estimate total
        }
      }

      return {
        jobs: response.data,
        meta: {
          total,
          page,
          per_page: perPage,
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage,
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

      // Parse Link header from Greenhouse API response
      const linkHeader = response.headers.link;
      let hasNextPage = false;
      let hasPrevPage = false;
      let total = response.data.length;

      if (linkHeader) {
        // Parse Link header to determine pagination state
        const links: LinkHeader[] = linkHeader.split(',').map((link: string) => {
          const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
          return match ? { url: match[1], rel: match[2] } : null;
        }).filter(Boolean) as LinkHeader[];

        hasNextPage = links.some(link => link.rel === 'next');
        hasPrevPage = links.some(link => link.rel === 'prev');
        
        // Try to extract total from 'last' link
        const lastLink = links.find(link => link.rel === 'last');
        if (lastLink) {
          const lastPageMatch = lastLink.url.match(/page=(\d+)/);
          if (lastPageMatch) {
            total = parseInt(lastPageMatch[1]) * perPage;
          }
        }
      } else {
        // Fallback: if no Link header, estimate based on current page
        hasNextPage = response.data.length === perPage;
        hasPrevPage = page > 1;
        if (hasNextPage) {
          total = (page * perPage) + 1; // Estimate total
        }
      }

      return {
        candidates: response.data,
        meta: {
          total,
          page,
          per_page: perPage,
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage,
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

      // Parse Link header from Greenhouse API response
      const linkHeader = response.headers.link;
      let hasNextPage = false;
      let hasPrevPage = false;
      let total = response.data.length;

      if (linkHeader) {
        // Parse Link header to determine pagination state
        const links: LinkHeader[] = linkHeader.split(',').map((link: string) => {
          const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
          return match ? { url: match[1], rel: match[2] } : null;
        }).filter(Boolean) as LinkHeader[];

        hasNextPage = links.some(link => link.rel === 'next');
        hasPrevPage = links.some(link => link.rel === 'prev');
        
        // Try to extract total from 'last' link
        const lastLink = links.find(link => link.rel === 'last');
        if (lastLink) {
          const lastPageMatch = lastLink.url.match(/page=(\d+)/);
          if (lastPageMatch) {
            total = parseInt(lastPageMatch[1]) * perPage;
          }
        }
      } else {
        // Fallback: if no Link header, estimate based on current page
        hasNextPage = response.data.length === perPage;
        hasPrevPage = page > 1;
        if (hasNextPage) {
          total = (page * perPage) + 1; // Estimate total
        }
      }

      return {
        candidates: response.data,
        meta: {
          total,
          page,
          per_page: perPage,
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage,
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
