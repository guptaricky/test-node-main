const STATUS_CODES = {
    STATUS_CONTINUE: 100, // Request received, continuing process.
    STATUS_SWITCHING_PROTOCOLS: 101, // Switching protocols.
    STATUS_PROCESSING: 102, // Processing WebDAV
    
    STATUS_OK: 200, // Request succeeded.
    STATUS_CREATED: 201, // Resource created.
    STATUS_ACCEPTED: 202, // Request accepted, processing pending.
    STATUS_NON_AUTHORITATIVE_INFORMATION: 203, // Returned meta information not from the origin server.
    STATUS_NO_CONTENT: 204, // Request succeeded, no content.
    STATUS_RESET_CONTENT: 205, // Reset content (client should reset document view).
    STATUS_PARTIAL_CONTENT: 206, // Partial resource returned.

    STATUS_MULTIPLE_CHOICES: 300, // Multiple options for the resource.
    STATUS_MOVED_PERMANENTLY: 301, // Resource moved permanently.
    STATUS_FOUND: 302, // Resource found, but temporarily at a different URI.
    STATUS_SEE_OTHER: 303, // Redirect to another URI using a GET request.
    STATUS_NOT_MODIFIED: 304, // Resource not modified.
    STATUS_TEMPORARY_REDIRECT: 307, // Request should be repeated at another URI.
    STATUS_PERMANENT_REDIRECT: 308, // Resource permanently redirected to a different URI.

    STATUS_BAD_REQUEST: 400, // Invalid request syntax.
    STATUS_UNAUTHORIZED: 401, // Authentication required.
    STATUS_PAYMENT_REQUIRED: 402, // Payment required (reserved for future use).
    STATUS_FORBIDDEN: 403, // Server understands request, but refuses it.
    STATUS_NOT_FOUND: 404, // Resource not found.
    STATUS_METHOD_NOT_ALLOWED: 405, // Method not allowed for the resource.
    STATUS_NOT_ACCEPTABLE: 406, // Requested resource not acceptable.
    STATUS_PROXY_AUTHENTICATION_REQUIRED: 407, // Proxy authentication required.
    STATUS_REQUEST_TIMEOUT: 408, // Request timed out.
    STATUS_CONFLICT: 409, // Conflict with current state of the resource.
    STATUS_GONE: 410, // Resource no longer available.
    STATUS_LENGTH_REQUIRED: 411, // Content-Length header required.
    STATUS_PRECONDITION_FAILED: 412, // Precondition in request headers failed.
    STATUS_PAYLOAD_TOO_LARGE: 413, // Request entity too large.
    STATUS_URI_TOO_LONG: 414, // Request URI too long.
    STATUS_UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported media type in request.
    STATUS_RANGE_NOT_SATISFIABLE: 416, // Requested range not satisfiable.
    STATUS_EXPECTATION_FAILED: 417, // Expectation given in request could not be met.
    STATUS_IM_A_TEAPOT: 418, // I'm a teapot (Easter egg in HTTP spec).
    STATUS_UNPROCESSABLE_ENTITY: 422, // Semantic errors in the request.
    STATUS_TOO_MANY_REQUESTS: 429, // Too many requests.

    STATUS_INTERNAL_SERVER_ERROR: 500, // Generic server error.
    STATUS_NOT_IMPLEMENTED: 501, // Server does not support the functionality.
    STATUS_BAD_GATEWAY: 502, // Invalid response from upstream server.
    STATUS_SERVICE_UNAVAILABLE: 503, // Server unavailable due to overload or maintenance.
    STATUS_GATEWAY_TIMEOUT: 504, // Upstream server timed out.
    STATUS_HTTP_VERSION_NOT_SUPPORTED: 505, // HTTP version not supported by the server.
    STATUS_VARIANT_ALSO_NEGOTIATES: 506, // Transparent content negotiation for the request.
    STATUS_INSUFFICIENT_STORAGE: 507, // Insufficient storage space to complete the request.

}

module.exports = Object.assign({}, STATUS_CODES);

