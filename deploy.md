# Deployment Instructions

## Backend Deployment (Render.com)

1. **Create New Service**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**
   - Name: `jobharvester-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables**
   ```
   GREENHOUSE_API_KEY=08c74138d0466463988a945a8becdeaa-9
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Note your backend URL (e.g., https://jobharvester-backend.onrender.com)

## Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Settings**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Note your frontend URL (e.g., https://jobharvester.vercel.app)

## Testing Deployment

1. **Check Backend**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Enter API key: `08c74138d0466463988a945a8becdeaa-9`
   - Browse jobs and candidates

## Troubleshooting

### Backend Problems
- **Service not starting**: Check Render logs, verify environment variables
- **Build failures**: Ensure all dependencies are in `dependencies` (not `devDependencies`)
- **CORS errors**: Verify `FRONTEND_URL` matches your Vercel URL exactly

### Frontend Problems
- **Build fails**: Check Vercel logs, verify root directory is `frontend`
- **API errors**: Ensure `REACT_APP_API_URL` is just the base URL (no `/api/greenhouse`)
- **CORS errors**: Verify `FRONTEND_URL` in backend matches your Vercel URL exactly

### "Could not find index.html" Error
- Root Directory must be `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

### NPM Warnings
Deprecation warnings during build are normal and don't affect deployment. The build will succeed despite these messages.

## Deployment URLs

After successful deployment, you'll have:
- **Backend**: `https://your-app-name.onrender.com`
- **Frontend**: `https://your-app-name.vercel.app`

Make sure to update the frontend's `REACT_APP_API_URL` environment variable with your actual Render.com backend URL.
