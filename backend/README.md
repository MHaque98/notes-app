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

### Build

```bash
sam build
```

### Test Locally

Start the local API Gateway:

```bash
sam local start-api
```

The API will be available at `http://localhost:3000`

### Debug Locally

Start with debugging enabled:

```bash
sam local start-api --debug
```

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


