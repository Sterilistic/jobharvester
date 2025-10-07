import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { greenhouseRouter } from './routes/greenhouse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://jobharvester.vercel.app',
        'https://jobharvester.vercel.app',
        'https://jobharvester-frontend.vercel.app'
      ]
    : true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());

// API Key middleware for backend protection
const validateBackendApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const backendApiKey = req.headers['x-backend-api-key'] as string;
  const expectedKey = process.env.BACKEND_API_KEY;
  
  // Debug: Log what we're receiving
  console.log('Backend received headers:', {
    'x-backend-api-key': backendApiKey,
    'expected-key': expectedKey,
    'match': backendApiKey === expectedKey
  });
  
  if (!expectedKey) {
    return res.status(500).json({ error: 'Backend API key not configured' });
  }
  
  if (!backendApiKey || backendApiKey !== expectedKey) {
    return res.status(401).json({ error: 'Invalid backend API key' });
  }
  
  next();
};

// Routes (protected with backend API key)
app.use('/api/greenhouse', validateBackendApiKey, greenhouseRouter);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
