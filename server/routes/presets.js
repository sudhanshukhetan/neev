import express from 'express';
import { PRESETS } from '../../shared/presets.js';

const router = express.Router();

router.get('/presets', (_req, res) => {
  res.json({ presets: PRESETS });
});

export default router;
