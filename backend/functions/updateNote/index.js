const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, error } = require('../../shared/response');
const { validateNoteRequest, validateNoteId } = require('../../shared/validation');

/**
 * Lambda function to update an existing note
 * PUT /notes/{id}
 */
exports.handler = async (event) => {
  try {
    // Validate note ID
    const idValidation = validateNoteId(event.pathParameters);
    if (!idValidation.valid) {
      return error(400, idValidation.error);
    }

    const { id } = idValidation;

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

    // Build update expression
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (body.title !== undefined) {
      updateExpressions.push('#title = :title');
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeValues[':title'] = body.title;
    }

    if (body.content !== undefined) {
      updateExpressions.push('#content = :content');
      expressionAttributeNames['#content'] = 'content';
      expressionAttributeValues[':content'] = body.content;
    }

    // Always update updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    // Update note in DynamoDB
    const updateResult = await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return success(200, updateResult.Attributes);
  } catch (err) {
    console.error('Error updating note:', err);
    return error(500, 'Internal server error');
  }
};

