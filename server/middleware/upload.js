import multer from 'multer';

/** Allowed MIME types */
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/** Magic byte signatures for validation */
export const MAGIC_BYTES = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header (WebP)
};

function checkMagicBytes(buffer, mime) {
  const signature = MAGIC_BYTES[mime];
  if (!signature) return false;
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }
  return true;
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    cb(Object.assign(new Error('Only JPEG, PNG, and WebP images are allowed.'), { code: 'INVALID_MIME' }));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

/** Express middleware that validates magic bytes after multer runs */
export function validateMagicBytes(req, res, next) {
  if (!req.file) return next();
  if (!checkMagicBytes(req.file.buffer, req.file.mimetype)) {
    return res.status(400).json({
      error: 'File content does not match the declared image type.',
      code: 'INVALID_MAGIC_BYTES',
    });
  }
  next();
}
