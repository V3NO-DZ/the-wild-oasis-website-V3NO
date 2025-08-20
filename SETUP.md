# Frontend-Backend Connection Setup

## Environment Configuration

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# NextAuth Configuration
AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
DATABASE_URL="your_database_url_here"

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Server Port
PORT=4000
```

## Running the Application

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev  # or npm start
```

The backend will run on `http://localhost:4000`

### 2. Start the Frontend

```bash
# In a new terminal
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Architecture Overview

### NextAuth Placement

- **NextAuth stays in the frontend** - This is the correct approach
- NextAuth handles OAuth flows, session management, and client-side authentication
- The frontend communicates with the backend API for data operations

### API Communication

- Frontend uses the `apiClient` in `frontend/src/app/lib/api.ts`
- All data operations go through the backend API endpoints
- The `data-service.ts` has been updated to use the API client instead of direct database calls

### Key Files

- `frontend/src/app/lib/api.ts` - API client for backend communication
- `frontend/src/app/lib/data-service.ts` - Updated to use API client
- `frontend/src/app/lib/auth.ts` - NextAuth configuration (stays in frontend)
- `backend/index.ts` - Express server with API routes

## Testing the Connection

1. Start both servers
2. Visit `http://localhost:3000` in your browser
3. Check the browser's Network tab to see API calls to `http://localhost:4000/api`
4. Test the health endpoint: `http://localhost:4000/api/health`

## Troubleshooting

### CORS Issues

If you see CORS errors, make sure:

- Backend CORS_ORIGIN includes `http://localhost:3000`
- Frontend is making requests to the correct backend URL

### API Connection Issues

- Verify both servers are running
- Check the `NEXT_PUBLIC_API_URL` environment variable
- Test the backend health endpoint directly

### NextAuth Issues

- Ensure all NextAuth environment variables are set
- Verify Google OAuth credentials are correct
- Check that `NEXTAUTH_URL` matches your frontend URL
