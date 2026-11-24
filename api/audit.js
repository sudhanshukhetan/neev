/**
 * api/audit.js
 * Vercel Serverless Function: Image audit with Gemini Vision + Deterministic Fallback
 */

import { getBaseline } from './services/baselineFromPhoto.js';
import { PRESET_MAP } from '../shared/presets.js';
import { defaultBaseline, deterministicBaseline } from './services/deterministicBaseline.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const body = req.body || {};

    // 1. Preset ID lookup
    if (body.presetId && PRESET_MAP[body.presetId]) {
      const preset = PRESET_MAP[body.presetId];
      return res.status(200).json({
        baseline: preset.baseline,
        preset: {
          id: preset.id,
          name: preset.name,
          ward: preset.ward,
          description: preset.description,
        },
      });
    }

    // 2. Base64 Image audit
    if (body.imageBase64) {
      let base64Data = body.imageBase64;
      let mimeType = body.mimeType || 'image/jpeg';

      if (base64Data.startsWith('data:')) {
        const parts = base64Data.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mimeType = mimeMatch[1];
        base64Data = parts[1];
      }

      const buffer = Buffer.from(base64Data, 'base64');
      const baseline = await getBaseline(buffer, mimeType);
      return res.status(200).json({ baseline });
    }

    // 3. Fallback: Default verified baseline
    return res.status(200).json({ baseline: defaultBaseline() });
  } catch (err) {
    console.warn('[neev] Audit handler caught error, providing deterministic fallback:', err.message);
    return res.status(200).json({ baseline: defaultBaseline() });
  }
}
