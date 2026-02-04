# HRMS Lite Deployment Guide

## Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main_prod:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     ```
     MONGODB_URI=<your_mongodb_connection_string>
     PORT=10000
     ```

## Backend Features (FastAPI)

- **Pydantic Models**: Automatic request/response validation
- **MongoDB Integration**: Using pymongo for database operations
- **CORS Support**: Configured for frontend communication
- **Production Ready**: Static file serving for React build
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Unique Constraints**: Employee ID and email uniqueness enforced
- **Attendance Tracking**: Compound indexes for efficient attendance queries

## Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Import your GitHub repository
3. Set the following configuration:
   - **Framework**: React
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

## MongoDB Atlas Setup

1. Create a free cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address (or 0.0.0.0/0 for testing)
4. Get your connection string and add it to Render environment variables

## Local Testing Before Deployment

1. Test the FastAPI backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. Test the frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Create production build:
   ```bash
   cd frontend
   npm run build
   ```

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite?retryWrites=true&w=majority
PORT=5000
```

### Frontend

Set `REACT_APP_API_URL` environment variable to your backend URL in Vercel.

## Post-Deployment Verification

1. Check backend health: `GET https://your-backend-url/api/employees`
2. Test employee creation through the deployed frontend
3. Verify attendance marking functionality
4. Check MongoDB Atlas for data persistence

## FastAPI Features

- **Pydantic Models**: Automatic request/response validation
- **MongoDB Integration**: Using pymongo for database operations
- **CORS Support**: Configured for frontend communication
- **Production Ready**: Static file serving for React build
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
