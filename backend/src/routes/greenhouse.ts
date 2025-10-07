import express from 'express';
import { GreenhouseService } from '../services/greenhouseService';

const router = express.Router();

// Middleware to validate API key
const validateApiKey = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  try {
    const greenhouseService = new GreenhouseService(apiKey);
    const isValid = await greenhouseService.validateApiKey();
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    req.greenhouseService = greenhouseService;
    next();
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
};

// Extend Express Request type to include greenhouseService
declare global {
  namespace Express {
    interface Request {
      greenhouseService: GreenhouseService;
    }
  }
}

// Get all jobs
router.get('/jobs', validateApiKey, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 50;
    
    const result = await req.greenhouseService.getJobs(page, perPage);
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job by ID
router.get('/jobs/:id', validateApiKey, async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }
    
    const job = await req.greenhouseService.getJobById(jobId);
    res.json(job);
  } catch (error: any) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get candidates for a specific job
router.get('/jobs/:id/candidates', validateApiKey, async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 50;
    
    if (isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }
    
    const result = await req.greenhouseService.getCandidatesForJob(jobId, page, perPage);
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching candidates for job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all candidates
router.get('/candidates', validateApiKey, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 50;
    
    const result = await req.greenhouseService.getAllCandidates(page, perPage);
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Validate API key endpoint
router.post('/validate-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    const greenhouseService = new GreenhouseService(apiKey);
    const isValid = await greenhouseService.validateApiKey();
    
    res.json({ valid: isValid });
  } catch (error: any) {
    console.error('Error validating API key:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as greenhouseRouter };
