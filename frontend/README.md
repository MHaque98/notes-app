# Notes App - Frontend

React + Vite frontend application for the Notes App.

## Setup

Install dependencies:

```bash
npm install
```

## Development

### Local Development with Backend

To run the frontend connected to the local SAM backend:

1. **Start the backend** (from the `backend/` directory):
   ```bash
   cd ../backend
   ./scripts/start-local.sh
   ```
   This starts DynamoDB Local and SAM Local API Gateway on port 3000.

2. **Start the frontend** (from the `frontend/` directory):
   ```bash
   npm run dev
   ```

The frontend is configured to automatically proxy API requests to the local backend:
- Frontend runs on `http://localhost:5173` (Vite default)
- API requests to `/api/*` are proxied to `http://localhost:3000` (SAM Local API Gateway)
- The API service uses `/api` as the base URL by default

### Development with MSW (Mock Service Worker)

If you want to develop without the backend, MSW is configured to mock API responses. The mocks are automatically used when the backend is not available.

### Environment Variables

You can configure the API endpoint using environment variables:

- `VITE_API_URL`: Override the API base URL (defaults to `/api` which uses the Vite proxy)

Example `.env.local`:
```bash
# Use direct connection to SAM Local (bypassing Vite proxy)
VITE_API_URL=http://localhost:3000
```

## Build

Build for production:

```bash
npm run build
```

## Testing

Run tests:

```bash
npm test
```

## Project Structure

```
frontend/
├── src/
│   ├── components/    # React components
│   ├── services/      # API service layer
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── mocks/         # MSW handlers
│   ├── App.jsx        # Main app component
│   ├── main.jsx       # App entry point
│   └── index.css      # Global styles with Tailwind
├── public/            # Static assets
├── tests/             # Test files
└── vite.config.js     # Vite configuration
```

