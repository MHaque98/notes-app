const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Check if running locally (SAM Local sets AWS_SAM_LOCAL)
const isLocal = process.env.AWS_SAM_LOCAL === 'true' || process.env.IS_OFFLINE === 'true';

// Configure DynamoDB client
const clientConfig = {};

// Use local DynamoDB endpoint when running locally
if (isLocal) {
    // Default endpoint: use host.docker.internal for SAM Local (runs in Docker)
    // This allows Lambda containers to access DynamoDB Local on the host machine
    // On Linux, you may need to use the host's IP address instead
    const defaultEndpoint = process.env.DYNAMODB_ENDPOINT || 'http://host.docker.internal:8000';
    clientConfig.endpoint = defaultEndpoint;
    clientConfig.region = 'local';
    clientConfig.credentials = {
        accessKeyId: 'local',
        secretAccessKey: 'local',
    };
}

// Create DynamoDB client
const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };

