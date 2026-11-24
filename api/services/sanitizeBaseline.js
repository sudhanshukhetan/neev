/**
 * api/services/sanitizeBaseline.js
 * Strips Gemini response fences, extracts JSON, coerces types, clamps ranges.
 * Any parse failure returns the deterministic fallback.
 */

import { deterministicBaseline } from './deterministicBaseline.js';

const DRAIN_CONDITIONS = ['none', 'open', 'clogged', 'covered'];

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function coerceNumber(v, fallback) {
  const n = parseFloat(v);
  return isFinite(n) ? n : fallback;
}

function coerceDrain(v) {
  if (DRAIN_CONDITIONS.includes(v)) return v;
  return 'open';
}

export function sanitizeBaseline(raw, imageBuffer) {
  try {
    let parsed;

    if (typeof raw === 'object' && raw !== null) {
      parsed = raw;
    } else {
      let text = String(raw);
      text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON object found in response');
      parsed = JSON.parse(match[0]);
    }

    const rawConf = parsed.confidence || {};
    const confKeys = ['laneWidthM', 'obstructionM', 'drainCondition', 'greenPct', 'floorsAvg', 'wiresVisible', 'buildingConditionScore'];
    const confidence = {};
    for (const k of confKeys) {
      const c = coerceNumber(rawConf[k], 0.5);
      confidence[k] = clamp(c, 0, 1);
    }

    return {
      laneWidthM: clamp(coerceNumber(parsed.laneWidthM, 4), 1, 20),
      obstructionM: clamp(coerceNumber(parsed.obstructionM, 0.5), 0, 5),
      drainCondition: coerceDrain(parsed.drainCondition),
      greenPct: clamp(coerceNumber(parsed.greenPct, 5), 0, 100),
      floorsAvg: clamp(Math.round(coerceNumber(parsed.floorsAvg, 3)), 1, 8),
      wiresVisible: Boolean(parsed.wiresVisible),
      buildingConditionScore: clamp(Math.round(coerceNumber(parsed.buildingConditionScore, 40)), 0, 100),
      source: 'photo-estimate',
      confidence,
    };
  } catch {
    return imageBuffer ? deterministicBaseline(imageBuffer) : deterministicBaseline(Buffer.alloc(16));
  }
}
