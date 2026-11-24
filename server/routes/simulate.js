import express from 'express';
import { computeMetrics, computePhases, runScreening } from '../../shared/engine.js';
import { clampLevers } from '../../shared/levers.js';
import { mergeAssumptions } from '../../shared/assumptions.js';

const router = express.Router();

router.post('/simulate', (req, res, next) => {
  try {
    const { baseline, levers: rawLevers, assumptions: rawAssumptions } = req.body;

    if (!baseline || typeof baseline !== 'object') {
      return res.status(400).json({ error: 'baseline is required', code: 'MISSING_BASELINE' });
    }

    // Clamp levers and merge assumptions
    const levers = clampLevers(rawLevers || {});
    const assumptions = mergeAssumptions(rawAssumptions || {});

    const current = computeMetrics({ baseline, levers, assumptions, stage: 'current' });
    const planned = computeMetrics({ baseline, levers, assumptions, stage: 'planned' });
    const phases = computePhases({ baseline, levers, assumptions });
    const screening = runScreening({ levers, assumptions });

    res.json({ current, planned, phases, screening });
  } catch (e) {
    next(e);
  }
});

export default router;
