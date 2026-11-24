import multer from 'multer';

/**
 * Crash-proof centralized error handler.
 * Never leaks stack traces to the client.
 */
export function errorHandler(err, req, res, _next) {
  // Multer errors
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File exceeds the 5 MB size limit.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field. Use the "image" field.',
    };
    return res.status(400).json({
      error: messages[err.code] || err.message,
      code: err.code,
    });
  }

  // Custom upload errors
  if (err.code === 'INVALID_MIME' || err.code === 'INVALID_MAGIC_BYTES') {
    return res.status(400).json({ error: err.message, code: err.code });
  }

  // Malformed JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body.', code: 'MALFORMED_JSON' });
  }

  // Unknown errors — log internally, never expose stack
  console.error('[neev] Error:', err.message);
  return res.status(500).json({ error: 'An unexpected error occurred.', code: 'INTERNAL_ERROR' });
}
