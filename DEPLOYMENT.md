# HRMS Lite Deployment Guide

## Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - **Build Command**: `npm install`
   - **Start Command**: `node server-prod.js`
   - **Environment Variables**:
     ```
     MONGODB_URI=<your_mongodb_connection_string>
     NODE_ENV=production
     PORT=10000
     ```

## Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Import your GitHub repository
3. Set the following configuration:
   - **Framework**: React
   - **Build Command**: `npm run build` (from frontend directory)
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm install`

## MongoDB Atlas Setup

1. Create a free cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address (or 0.0.0.0/0 for testing)
4. Get your connection string and add it to Render environment variables

## Local Testing Before Deployment

1. Test the API:

   ```bash
   npm run dev
   node test-api.js
   ```

2. Test the frontend:

   ```bash
   cd frontend
   npm start
   ```

3. Create production build:
   ```bash
   npm run build
   ```

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
```

### Frontend

Set `REACT_APP_API_URL` environment variable to your backend URL in Vercel.

## Post-Deployment Verification

1. Check backend health: `GET https://your-backend-url/api/employees`
2. Test employee creation through the deployed frontend
3. Verify attendance marking functionality
4. Check MongoDB Atlas for data persistence
