const { DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, error } = require('../../shared/response');
const { validateNoteId } = require('../../shared/validation');

/**
 * Lambda function to delete a note
 * DELETE /notes/{id}
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

    // Check if note exists
    const getResult = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!getResult.Item) {
      return error(404, 'Note not found');
    }

    // Delete note from DynamoDB
    await docClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    return success(200, { message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    return error(500, 'Internal server error');
  }
};

