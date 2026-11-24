import express from 'express';
import { upload, MAGIC_BYTES } from '../middleware/upload.js';
import { getBaseline } from '../services/baselineFromPhoto.js';
import { PRESET_MAP } from '../../shared/presets.js';

const router = express.Router();

router.post('/audit', (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return next(err);

    try {
      // Case 1: JSON body with presetId (no file)
      if (!req.file && req.body?.presetId) {
        const preset = PRESET_MAP[req.body.presetId];
        if (!preset) {
          return res.status(400).json({ error: 'Unknown presetId', code: 'INVALID_PRESET_ID' });
        }
        return res.json({ baseline: preset.baseline, preset: { id: preset.id, name: preset.name, ward: preset.ward, description: preset.description } });
      }

      // Case 2: Uploaded image
      if (req.file) {
        // Magic-byte check is done in middleware; here we call AI or fallback
        const baseline = await getBaseline(req.file.buffer);
        return res.json({ baseline });
      }

      return res.status(400).json({ error: 'Provide either an image file or a presetId', code: 'MISSING_INPUT' });
    } catch (e) {
      next(e);
    }
  });
});

export default router;
