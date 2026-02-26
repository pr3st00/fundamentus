function buildErrorResponse(message, errorMessage) {
  return {
    message: message,
    error: errorMessage,
  }
};

function buildMissingParameterResponse(parameterName) {
  return buildErrorResponse("Missing required query parameter",
    "The " + parameterName + " parameter is required.");
}

module.exports = { buildErrorResponse, buildMissingParameterResponse };