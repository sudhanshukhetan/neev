/**
 * api/simulate.js
 * Vercel Serverless Function: Authoritative simulation engine for both
 * Urban Redevelopment and Greenfield Plain Land Construction.
 */

import { computeMetrics, computePhases, runScreening } from '../shared/engine.js';
import { clampLevers } from '../shared/levers.js';
import { mergeAssumptions } from '../shared/assumptions.js';
import { computeGreenfieldProject } from '../shared/greenfieldEngine.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const body = req.body || {};

    // Branch A: Greenfield Plain Land Construction Simulation
    if (body.mode === 'plain' || body.selectedStructures || body.areaAcres !== undefined) {
      const greenfield = computeGreenfieldProject({
        selectedIds: body.selectedIds || body.selectedStructures,
        areaAcres: body.areaAcres,
        greenPct: body.greenPct,
        solarPct: body.solarPct,
      });

      return res.status(200).json({
        mode: 'plain',
        greenfield,
      });
    }

    // Branch B: Urban Redevelopment Simulation
    const { baseline, levers: rawLevers, assumptions: rawAssumptions } = body;

    if (!baseline || typeof baseline !== 'object') {
      return res.status(400).json({ error: 'baseline is required for urban simulation', code: 'MISSING_BASELINE' });
    }

    const levers = clampLevers(rawLevers || {});
    const assumptions = mergeAssumptions(rawAssumptions || {});

    const current = computeMetrics({ baseline, levers, assumptions, stage: 'current' });
    const planned = computeMetrics({ baseline, levers, assumptions, stage: 'planned' });
    const phases = computePhases({ baseline, levers, assumptions });
    const screening = runScreening({ levers, assumptions });

    return res.status(200).json({
      mode: 'urban',
      current,
      planned,
      phases,
      screening,
    });
  } catch (err) {
    console.error('[neev] Simulation error:', err);
    return res.status(500).json({ error: 'Simulation computation failed', details: err.message });
  }
}
