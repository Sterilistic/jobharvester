# JobHarvester

A full-stack application that integrates with the Greenhouse Harvest API to display job listings and candidate information.

## Features

- **Authentication**: Backend API key protection with CORS restrictions
- **Job Management**: Browse and view job listings with pagination
- **Candidate Tracking**: View candidates for each job with pagination
- **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- **Production Ready**: Deployed on Vercel (frontend) and Render.com (backend)

## Architecture

### Frontend (React + TypeScript)
- **Page 1**: API key input form with validation
- **Page 2**: Jobs list with clickable job cards
- **Job Details**: Individual job view with description and candidates
- **Routing**: React Router for navigation between pages
- **State Management**: Local state with React hooks
- **API Integration**: Axios for HTTP requests to backend

### Backend (Node.js + TypeScript)
- **Express Server**: RESTful API with proper error handling
- **Greenhouse Integration**: Proxy service for Greenhouse Harvest API
- **Authentication**: API key validation and forwarding
- **Pagination**: Support for paginated responses
- **Error Handling**: Comprehensive error handling for API failures
- **CORS**: Configured for frontend communication

## Setup Instructions

### Prerequisites
- Node.js (>= 18.0.0)
- npm or yarn
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   GREENHOUSE_API_KEY=<API KEY>
   BACKEND_API_KEY=<GENERATED_SECURE_KEY>
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Update `.env` with your backend URL:
   ```
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_BACKEND_API_KEY=<SAME_AS_BACKEND>
   ```

5. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Deployment

### Backend Deployment (Render.com)

1. Create a new Render.com service:
   - Connect your GitHub repository
   - Choose "Web Service"
   - Set root directory to `backend`

2. Configure environment variables:
   ```
   GREENHOUSE_API_KEY=<API KEY>
   BACKEND_API_KEY=<GENERATED_SECURE_KEY>
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

3. Set build and start commands:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. Deploy to Render.com:
   - Render will automatically build and deploy from your GitHub repository

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel:
   - Import project from GitHub
   - Set root directory to `frontend`

2. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   REACT_APP_BACKEND_API_KEY=<SAME_AS_BACKEND>
   ```

3. Deploy to Vercel:
   - Vercel will automatically build and deploy
   - Get your frontend URL from the Vercel dashboard

## API Endpoints

### Backend API Routes

- `GET /health` - Health check endpoint
- `POST /api/greenhouse/validate-key` - Validate API key
- `GET /api/greenhouse/jobs` - Get all jobs (with pagination)
- `GET /api/greenhouse/jobs/:id` - Get job by ID
- `GET /api/greenhouse/jobs/:id/candidates` - Get candidates for a job
- `GET /api/greenhouse/candidates` - Get all candidates

### Request Headers

All API requests require:
- `x-api-key`: Greenhouse API key
- `x-backend-api-key`: Backend API key for security

## Design Decisions

### Backend Architecture
- **Proxy Pattern**: The backend acts as a proxy to the Greenhouse API to avoid CORS issues and provide a clean interface
- **Authentication Middleware**: Centralized API key validation to ensure security
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **TypeScript**: Full type safety for better development experience and fewer runtime errors

### Frontend Architecture
- **Component-Based**: Modular React components for maintainability
- **TypeScript**: Type safety for better development experience
- **React Router**: Client-side routing for smooth navigation
- **Responsive Design**: Mobile-friendly interface with clean, modern styling
- **State Management**: Local state management with React hooks for simplicity

### Security Features
- **Backend API Key Protection**: All routes protected with `x-backend-api-key` header
- **CORS Restrictions**: Only allows requests from configured frontend URLs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Environment Variables**: All sensitive data stored securely
- **Helmet Security**: Security headers for production



## Project Structure

```
jobharvester/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   └── greenhouse.ts
│   │   ├── services/
│   │   │   └── greenhouseService.ts
│   │   └── types/
│   │       └── greenhouse.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Procfile
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (ShadCN components)
│   │   │   ├── ApiKeyForm.tsx
│   │   │   ├── JobsList.tsx
│   │   │   ├── JobDetails.tsx
│   │   │   └── Pagination.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── greenhouse.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   └── env.example
└── README.md
```

## License

This project is for demonstration purposes.