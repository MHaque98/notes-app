const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, error } = require('../../shared/response');
const { validateNoteId } = require('../../shared/validation');

/**
 * Lambda function to get a single note by ID
 * GET /notes/{id}
 */
exports.handler = async (event) => {
  try {
    // Validate note ID
    const validation = validateNoteId(event.pathParameters);
    if (!validation.valid) {
      return error(400, validation.error);
    }

    const { id } = validation;

    // Get table name from environment
    const tableName = process.env.NOTES_TABLE_NAME;
    if (!tableName) {
      return error(500, 'Table name not configured');
    }

    // Get note from DynamoDB
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    // Check if note exists
    if (!result.Item) {
      return error(404, 'Note not found');
    }

    return success(200, result.Item);
  } catch (err) {
    console.error('Error getting note:', err);
    return error(500, 'Internal server error');
  }
};

