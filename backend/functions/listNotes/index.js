const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, error } = require('../../shared/response');

/**
 * Lambda function to list all notes
 * GET /notes
 */
exports.handler = async () => {
    try {
        // Get table name from environment
        const tableName = process.env.NOTES_TABLE_NAME;
        if (!tableName) {
            return error(500, 'Table name not configured');
        }

        // Scan DynamoDB table to get all notes
        const result = await docClient.send(
            new ScanCommand({
                TableName: tableName,
            })
        );

        // Sort notes by createdAt (newest first)
        const notes = (result.Items || []).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return success(200, notes);
    } catch (err) {
        console.error('Error listing notes:', err);
        return error(500, 'Internal server error');
    }
};

