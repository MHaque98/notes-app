/**
 * Input validation utilities
 */

/**
 * Validate note creation/update request
 * @param {object} body - Request body
 * @returns {object} { valid: boolean, error?: string }
 */
function validateNoteRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  // At least title or content must be provided
  if (!body.title && !body.content) {
    return { valid: false, error: 'Title or content is required' };
  }

  // If provided, title and content should be strings
  if (body.title !== undefined && typeof body.title !== 'string') {
    return { valid: false, error: 'Title must be a string' };
  }

  if (body.content !== undefined && typeof body.content !== 'string') {
    return { valid: false, error: 'Content must be a string' };
  }

  return { valid: true };
}

/**
 * Validate note ID from path parameters
 * @param {object} pathParameters - API Gateway path parameters
 * @returns {object} { valid: boolean, id?: string, error?: string }
 */
function validateNoteId(pathParameters) {
  if (!pathParameters || !pathParameters.id) {
    return { valid: false, error: 'Note ID is required' };
  }

  const id = pathParameters.id;
  if (typeof id !== 'string' || id.trim() === '') {
    return { valid: false, error: 'Note ID must be a non-empty string' };
  }

  return { valid: true, id: id.trim() };
}

module.exports = { validateNoteRequest, validateNoteId };

