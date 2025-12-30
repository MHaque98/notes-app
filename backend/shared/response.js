/**
 * Response helper functions for Lambda functions
 */

/**
 * Create a success response
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body
 * @returns {object} API Gateway response
 */
function success(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

/**
 * Create an error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {object} API Gateway response
 */
function error(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify({ error: message }),
  };
}

module.exports = { success, error };

