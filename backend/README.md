# Notes App Backend

AWS Serverless backend for the Notes App using AWS SAM (Serverless Application Model).

## Architecture

- **API Gateway**: REST API endpoint
- **Lambda Functions**: Serverless functions for CRUD operations
- **DynamoDB**: NoSQL database for storing notes

## Prerequisites

- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- Node.js 20.x (for Lambda runtime)

## Project Structure

```
backend/
├── template.yaml          # SAM template defining all AWS resources
├── samconfig.toml         # SAM CLI configuration
├── functions/             # Lambda function code
│   ├── createNote/
│   ├── getNote/
│   ├── listNotes/
│   ├── updateNote/
│   └── deleteNote/
└── shared/                # Shared utilities for Lambda functions
```

## API Endpoints

- `GET /notes` - List all notes
- `GET /notes/{id}` - Get a single note
- `POST /notes` - Create a new note
- `PUT /notes/{id}` - Update an existing note
- `DELETE /notes/{id}` - Delete a note

## Local Development

### Prerequisites for Local Development

- Docker (for DynamoDB Local)
- AWS CLI (for creating local DynamoDB table)
- AWS SAM CLI installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))

### Quick Start (Recommended)

The easiest way to start local development is using the provided script:

```bash
./scripts/start-local.sh
```

This script will:
1. Start DynamoDB Local using Docker Compose (automatically detects `docker compose` v2 or `docker-compose` v1)
2. Create the Notes table if it doesn't exist
3. Build the SAM application
4. Start SAM Local API Gateway on port 3000

The API will be available at `http://localhost:3000` and will automatically connect to DynamoDB Local at `http://localhost:8000`.

**Note:** Lambda functions run in Docker containers and use `host.docker.internal:8000` to access DynamoDB Local on the host machine. This works on macOS and Windows. On Linux, if `host.docker.internal` doesn't work, you may need to:
- Use your host machine's IP address instead
- Or run SAM Local with `--docker-network host` flag
- Or update `env.json` to use the appropriate endpoint

### Manual Setup

If you prefer to set up manually:

**Step 1: Start DynamoDB Local**

**Option 1: Using Docker Compose (recommended)**
```bash
# Use 'docker compose' (v2) or 'docker-compose' (v1)
docker compose up -d
# OR
docker-compose up -d

./scripts/setup-local-dynamodb.sh  # Creates the table
```

**Option 2: Using the setup script**
```bash
./scripts/setup-local-dynamodb.sh
```

**Option 3: Manual setup**
```bash
# Start DynamoDB Local in Docker
docker run -d --name dynamodb-local -p 8000:8000 amazon/dynamodb-local:latest

# Create the Notes table
aws dynamodb create-table \
    --endpoint-url http://localhost:8000 \
    --region local \
    --table-name Notes \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=createdAt,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        "IndexName=CreatedAtIndex,KeySchema=[{AttributeName=createdAt,KeyType=HASH},{AttributeName=id,KeyType=RANGE}],Projection={ProjectionType=ALL}" \
    --billing-mode PAY_PER_REQUEST
```

**Step 2: Build SAM Application**

```bash
sam build
```

**Step 3: Start Local API Gateway**

```bash
sam local start-api --port 3000
```

The API will be available at `http://localhost:3000` and will automatically connect to DynamoDB Local at `http://localhost:8000`.

**Stop Local Services:**

```bash
# Stop SAM Local API (Ctrl+C in the terminal)

# Stop DynamoDB Local
docker compose down
# OR (if using docker-compose v1)
docker-compose down
# OR (if using docker run)
docker stop dynamodb-local && docker rm dynamodb-local
```

### Connecting Frontend

The frontend is configured to connect to the local backend automatically:

1. **Start the backend** using `./scripts/start-local.sh` or `sam local start-api`
2. **Start the frontend** from the `frontend/` directory:
   ```bash
   cd ../frontend
   npm run dev
   ```

The frontend Vite dev server is configured with a proxy that forwards `/api/*` requests to `http://localhost:3000`. The frontend API service uses `/api` as the base URL by default, which will be proxied to the SAM Local API Gateway.

### Debug Locally

Start with debugging enabled:

```bash
sam local start-api --port 3000 --debug
```

This will enable debugging on port 5858. You can attach a debugger to this port.

## Deployment

### Validate Template

```bash
sam validate
```

### Deploy to AWS

```bash
sam deploy
```

This will:
1. Build the Lambda functions
2. Package and upload to S3
3. Deploy the CloudFormation stack
4. Output the API Gateway URL

### Get API Endpoint

After deployment, the API Gateway URL will be displayed in the outputs. You can also retrieve it with:

```bash
aws cloudformation describe-stacks \
  --stack-name notes-app-backend \
  --query 'Stacks[0].Outputs[?OutputKey==`NotesApiUrl`].OutputValue' \
  --output text
```

## DynamoDB Table

The `Notes` table is created automatically with:
- **Partition Key**: `id` (String)
- **Billing Mode**: Pay-per-request (on-demand)
- **Attributes**: `id`, `title`, `content`, `createdAt`, `updatedAt`

## Environment Variables

Lambda functions have access to:
- `NOTES_TABLE_NAME`: The DynamoDB table name

## Next Steps

1. Implement Lambda functions in `functions/` directories
2. Add shared utilities in `shared/` directory
3. Test locally with `sam local start-api`
4. Deploy to AWS with `sam deploy`


