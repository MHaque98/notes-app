# Notes App

A full-stack notes application built with React (frontend) and AWS Serverless (backend).

## Architecture

```
┌─────────────┐
│   React UI  │ (Vite + Tailwind)
│  (Frontend) │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│ API Gateway │ (SAM Local / AWS)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Lambda    │ (Node.js functions)
│  Functions  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  DynamoDB   │ (Notes storage)
└─────────────┘
```

## Project Structure

```
notes-app/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   └── mocks/         # MSW handlers
│   └── vite.config.ts     # Vite config with API proxy
├── backend/           # AWS Lambda functions
│   ├── functions/     # Lambda function code
│   ├── shared/        # Shared utilities
│   ├── template.yaml  # SAM template
│   └── scripts/       # Development scripts
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js 20.x
- Docker (for local DynamoDB)
- AWS CLI (for local DynamoDB table creation)
- AWS SAM CLI ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))

### Local Development

1. **Start the backend** (from `backend/` directory):
   ```bash
   cd backend
   ./scripts/start-local.sh
   ```
   This will:
   - Start DynamoDB Local on port 8000
   - Create the Notes table
   - Build and start SAM Local API Gateway on port 3000

2. **Start the frontend** (from `frontend/` directory, in a new terminal):
   ```bash
   cd frontend
   npm install  # First time only
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` and will automatically connect to the backend API.

### API Endpoints

- `GET /notes` - List all notes
- `GET /notes/{id}` - Get a single note
- `POST /notes` - Create a new note
- `PUT /notes/{id}` - Update an existing note
- `DELETE /notes/{id}` - Delete a note

## Development

### Frontend Development

See [frontend/README.md](./frontend/README.md) for detailed frontend development instructions.

### Backend Development

See [backend/README.md](./backend/README.md) for detailed backend development instructions.

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

The backend Lambda functions can be tested locally using SAM CLI:

```bash
cd backend
sam build
sam local invoke CreateNoteFunction --event events/create-note.json
```

## Deployment

### Deploy Backend

```bash
cd backend
sam build
sam deploy
```

After deployment, note the API Gateway URL from the output.

### Deploy Frontend

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist/` directory to your hosting service (S3 + CloudFront, Vercel, Netlify, etc.)

3. Set the `VITE_API_URL` environment variable to your deployed API Gateway URL.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Query
- **Backend**: AWS Lambda, API Gateway, DynamoDB
- **Infrastructure**: AWS SAM (Serverless Application Model)
- **Local Development**: SAM CLI, DynamoDB Local, Docker

## License

MIT

