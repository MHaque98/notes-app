const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, error } = require('../../shared/response');
const { validateNoteRequest } = require('../../shared/validation');

const { v4: uuidv4 } = require('uuid');

/**
 * Lambda function to create a new note
 * POST /notes
 */
exports.handler = async (event) => {
    try {
        // Parse request body
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (e) {
            return error(400, 'Invalid JSON in request body');
        }

        // Validate request
        const validation = validateNoteRequest(body);
        if (!validation.valid) {
            return error(400, validation.error);
        }

        // Get table name from environment
        const tableName = process.env.NOTES_TABLE_NAME;
        if (!tableName) {
            return error(500, 'Table name not configured');
        }

        // Create note object
        const now = new Date().toISOString();
        const note = {
            id: uuidv4(),
            title: body.title || '',
            content: body.content || '',
            createdAt: now,
            updatedAt: now,
        };

        // Save to DynamoDB
        await docClient.send(
            new PutCommand({
                TableName: tableName,
                Item: note,
            })
        );

        return success(201, note);
    } catch (err) {
        console.error('Error creating note:', err);
        return error(500, 'Internal server error');
    }
};

