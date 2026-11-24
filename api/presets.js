/**
 * api/presets.js
 * Vercel Serverless Function: Returns locality baseline presets
 */

import { PRESETS } from '../shared/presets.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(PRESETS);
}
