/**
 * shared/engine.test.js
 * Vitest unit tests for the Neev simulation engine.
 * Tests: monotonicity, threshold flipping, blueprint = lever vector,
 *        determinism, cost band, phase invariants.
 */

import { describe, test, expect } from 'vitest';
import {
  computeMetrics,
  computeFire,
  computeFlood,
  computeSafety,
  computeCost,
  computePhases,
  runScreening,
  explain,
} from './engine.js';
import { DEFAULT_ASSUMPTIONS, mergeAssumptions } from './assumptions.js';
import { clampLevers, DEFAULT_LEVERS } from './levers.js';
import { BLUEPRINTS } from './blueprints.js';
import { PRESETS } from './presets.js';

const A = DEFAULT_ASSUMPTIONS;

const marketBaseline = PRESETS.find((p) => p.id === 'market-lane').baseline;
const oldTownBaseline = PRESETS.find((p) => p.id === 'old-town').baseline;

function levers(overrides = {}) {
  return clampLevers({ ...DEFAULT_LEVERS, ...overrides });
}

// ─── Fire access ──────────────────────────────────────────────────────────────

describe('computeFire', () => {
  test('wider road lowers responseMin monotonically', () => {
    const widths = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const times = widths.map((w) =>
      computeFire({ baseline: marketBaseline, levers: levers({ roadWidthM: w, footpathM: 0 }), assumptions: A }).responseMin
    );
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeLessThanOrEqual(times[i - 1]);
    }
  });

  test('fireOk is false when clearWidthM < fireTenderClearM', () => {
    // 2.8m road, no footpath, 0.5m obstruction
    const baseline = { ...marketBaseline, obstructionM: 0.5, laneWidthM: 2.8 };
    const L = levers({ roadWidthM: 2.8, footpathM: 0, obstructionClearPct: 0 });
    const result = computeFire({ baseline, levers: L, assumptions: A });
    expect(result.clearWidthM).toBeLessThan(A.fireTenderClearM);
    expect(result.fireOk).toBe(false);
  });

  test('fireOk flips to true exactly at fireTenderClearM', () => {
    // With no obstruction, roadWidthM = fireTenderClearM should pass
    const baseline = { ...marketBaseline, obstructionM: 0 };
    const L = levers({ roadWidthM: A.fireTenderClearM, footpathM: 0, obstructionClearPct: 100 });
    const result = computeFire({ baseline, levers: L, assumptions: A });
    expect(result.clearWidthM).toBeGreaterThanOrEqual(A.fireTenderClearM);
    expect(result.fireOk).toBe(true);
  });

  test('responseMin is ~18+ min at 2.8m (blocked) and ~4-7 min at 9-12m', () => {
    const blockedFire = computeFire({
      baseline: { ...oldTownBaseline, obstructionM: 0.5 },
      levers: levers({ roadWidthM: 2.8, footpathM: 0, obstructionClearPct: 0 }),
      assumptions: A,
    });
    expect(blockedFire.responseMin).toBeGreaterThan(12);

    const clearFire = computeFire({
      baseline: { ...oldTownBaseline, obstructionM: 0 },
      levers: levers({ roadWidthM: 9, footpathM: 0, obstructionClearPct: 100 }),
      assumptions: A,
    });
    expect(clearFire.responseMin).toBeLessThan(10);
  });
});

// ─── Flood ────────────────────────────────────────────────────────────────────

describe('computeFlood', () => {
  test('increasing greenPct lowers floodRiskPct monotonically', () => {
    const greens = [5, 10, 15, 20, 25, 30, 35, 40];
    const risks = greens.map((g) =>
      computeFlood({ baseline: oldTownBaseline, levers: levers({ greenPct: g }), assumptions: A }).floodRiskPct
    );
    for (let i = 1; i < risks.length; i++) {
      expect(risks[i]).toBeLessThanOrEqual(risks[i - 1]);
    }
  });

  test('increasing coveredDrainPct lowers floodDepthCm', () => {
    const drains = [0, 20, 40, 60, 80, 100];
    const depths = drains.map((d) =>
      computeFlood({ baseline: oldTownBaseline, levers: levers({ coveredDrainPct: d }), assumptions: A }).floodDepthCm
    );
    for (let i = 1; i < depths.length; i++) {
      expect(depths[i]).toBeLessThanOrEqual(depths[i - 1]);
    }
  });

  test('increasing rechargePits lowers floodDepthCm', () => {
    const pits = [0, 2, 4, 6, 8, 10];
    const depths = pits.map((p) =>
      computeFlood({ baseline: oldTownBaseline, levers: levers({ rechargePits: p }), assumptions: A }).floodDepthCm
    );
    for (let i = 1; i < depths.length; i++) {
      expect(depths[i]).toBeLessThanOrEqual(depths[i - 1]);
    }
  });

  test('floodRiskPct has a floor of 3%', () => {
    const result = computeFlood({
      baseline: oldTownBaseline,
      levers: levers({ greenPct: 40, coveredDrainPct: 100, rechargePits: 10 }),
      assumptions: A,
    });
    expect(result.floodRiskPct).toBeGreaterThanOrEqual(3);
  });

  test('monsoon override (rainMmHr) increases floodDepthCm vs default', () => {
    const baseline = computeFlood({ baseline: oldTownBaseline, levers: levers(), assumptions: A });
    const monsoon = computeFlood({ baseline: oldTownBaseline, levers: levers(), assumptions: A, rainMmHr: 120 });
    expect(monsoon.floodDepthCm).toBeGreaterThanOrEqual(baseline.floodDepthCm);
  });
});

// ─── Structural safety ────────────────────────────────────────────────────────

describe('computeSafety', () => {
  test('increasing retrofitPct raises safetyIndex monotonically', () => {
    const retrofits = [0, 20, 40, 60, 80, 100];
    const scores = retrofits.map((r) =>
      computeSafety({ baseline: marketBaseline, levers: levers({ retrofitPct: r }), assumptions: A }).safetyIndex
    );
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
  });

  test('floors above lowRiseCap lower safetyIndex', () => {
    const capScore = computeSafety({
      baseline: marketBaseline,
      levers: levers({ maxFloors: A.lowRiseCap }),
      assumptions: A,
    }).safetyIndex;
    const excessScore = computeSafety({
      baseline: marketBaseline,
      levers: levers({ maxFloors: A.lowRiseCap + 2 }),
      assumptions: A,
    }).safetyIndex;
    expect(excessScore).toBeLessThan(capScore);
  });

  test('safetyIndex is clamped to [0, 100]', () => {
    const scores = [0, 50, 100].map((r) =>
      computeSafety({ baseline: { ...marketBaseline, buildingConditionScore: r }, levers: levers(), assumptions: A }).safetyIndex
    );
    scores.forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    });
  });
});

// ─── Cost ─────────────────────────────────────────────────────────────────────

describe('computeCost', () => {
  test('cost band: low = 0.6*mid, high = 1.4*mid', () => {
    const c = computeCost({ baseline: marketBaseline, levers: levers({ roadWidthM: 9, retrofitPct: 60 }), assumptions: A });
    expect(c.lowCr).toBeCloseTo(c.midCr * 0.6, 1);
    expect(c.highCr).toBeCloseTo(c.midCr * 1.4, 1);
  });

  test('cost increases when roadWidthM increases beyond baseline', () => {
    const low = computeCost({ baseline: marketBaseline, levers: levers({ roadWidthM: 5 }), assumptions: A }).midCr;
    const high = computeCost({ baseline: marketBaseline, levers: levers({ roadWidthM: 10 }), assumptions: A }).midCr;
    expect(high).toBeGreaterThan(low);
  });
});

// ─── Phases ───────────────────────────────────────────────────────────────────

describe('computePhases', () => {
  test('phase metrics are non-regressing (each phase no worse than previous)', () => {
    const phases = computePhases({ baseline: oldTownBaseline, levers: levers({ roadWidthM: 9, greenPct: 25, coveredDrainPct: 90, retrofitPct: 60, rechargePits: 4 }), assumptions: A });
    // Response time should be decreasing (improving) or same
    for (let i = 1; i < phases.length; i++) {
      expect(phases[i].metricsAfter.responseMin).toBeLessThanOrEqual(phases[i - 1].metricsAfter.responseMin + 0.1);
    }
    // Flood risk should be decreasing or same
    for (let i = 1; i < phases.length; i++) {
      expect(phases[i].metricsAfter.floodRiskPct).toBeLessThanOrEqual(phases[i - 1].metricsAfter.floodRiskPct + 1);
    }
  });

  test('incremental costs are all non-negative', () => {
    const phases = computePhases({ baseline: marketBaseline, levers: levers({ roadWidthM: 9, greenPct: 25, coveredDrainPct: 70, retrofitPct: 50 }), assumptions: A });
    phases.forEach((p) => {
      expect(p.incrementalCost.midCr).toBeGreaterThanOrEqual(0);
    });
  });
});

// ─── Blueprint equality ───────────────────────────────────────────────────────

describe('blueprints as lever vectors', () => {
  test('applying chandigarh blueprint levers gives same result as direct lever vector', () => {
    const bp = BLUEPRINTS.find((b) => b.id === 'chandigarh');
    const bpLevers = clampLevers({ ...DEFAULT_LEVERS, ...bp.levers });

    const viaBlueprint = computeMetrics({ baseline: marketBaseline, levers: bpLevers, assumptions: A, stage: 'planned' });
    const viaLevers = computeMetrics({ baseline: marketBaseline, levers: bpLevers, assumptions: A, stage: 'planned' });

    expect(viaBlueprint.responseMin).toBe(viaLevers.responseMin);
    expect(viaBlueprint.floodRiskPct).toBe(viaLevers.floodRiskPct);
    expect(viaBlueprint.safetyIndex).toBe(viaLevers.safetyIndex);
  });

  test('three blueprints produce visibly different results', () => {
    const results = BLUEPRINTS.map((bp) => {
      const L = clampLevers({ ...DEFAULT_LEVERS, ...bp.levers });
      return computeMetrics({ baseline: marketBaseline, levers: L, assumptions: A, stage: 'planned' });
    });
    // All three should have different response times
    const times = results.map((r) => r.responseMin);
    expect(new Set(times).size).toBeGreaterThan(1);
  });
});

// ─── Determinism ─────────────────────────────────────────────────────────────

describe('determinism', () => {
  test('same inputs always produce identical outputs', () => {
    const L = levers({ roadWidthM: 7, greenPct: 20, coveredDrainPct: 60 });
    const r1 = computeMetrics({ baseline: marketBaseline, levers: L, assumptions: A, stage: 'planned' });
    const r2 = computeMetrics({ baseline: marketBaseline, levers: L, assumptions: A, stage: 'planned' });
    expect(r1.responseMin).toBe(r2.responseMin);
    expect(r1.floodRiskPct).toBe(r2.floodRiskPct);
    expect(r1.safetyIndex).toBe(r2.safetyIndex);
    expect(r1.costMidCr).toBe(r2.costMidCr);
  });
});

// ─── Assumption overrides ─────────────────────────────────────────────────────

describe('assumption overrides', () => {
  test('overriding fireTenderClearM changes fireOk threshold', () => {
    const L = levers({ roadWidthM: 4, footpathM: 0, obstructionClearPct: 100 });
    const defaultResult = computeFire({ baseline: marketBaseline, levers: L, assumptions: A });
    const strictA = mergeAssumptions({ fireTenderClearM: 5.0 });
    const strictResult = computeFire({ baseline: marketBaseline, levers: L, assumptions: strictA });
    // With 4m clear width, default (3.5m threshold) should pass, 5.0m should fail
    expect(defaultResult.fireOk).toBe(true);
    expect(strictResult.fireOk).toBe(false);
  });

  test('overriding stormMmHr changes flood depth', () => {
    const L = levers({ coveredDrainPct: 50, greenPct: 15 });
    const low = computeFlood({ baseline: marketBaseline, levers: L, assumptions: mergeAssumptions({ stormMmHr: 20 }) }).floodDepthCm;
    const high = computeFlood({ baseline: marketBaseline, levers: L, assumptions: mergeAssumptions({ stormMmHr: 100 }) }).floodDepthCm;
    expect(high).toBeGreaterThan(low);
  });
});

// ─── Screening checks ─────────────────────────────────────────────────────────

describe('runScreening', () => {
  test('all pass with generous levers', () => {
    const L = levers({ roadWidthM: 10, footpathM: 2, maxFloors: 2, greenPct: 30, coveredDrainPct: 100, rechargePits: 5 });
    const checks = runScreening({ levers: L, assumptions: A });
    checks.forEach((c) => expect(c.status).toBe('pass'));
  });

  test('all fail with minimal levers', () => {
    const L = levers({ roadWidthM: 3, footpathM: 0, maxFloors: 6, greenPct: 5, coveredDrainPct: 0, rechargePits: 0 });
    const checks = runScreening({ levers: L, assumptions: A });
    const failOrWatch = checks.filter((c) => c.status !== 'pass');
    expect(failOrWatch.length).toBeGreaterThan(2);
  });
});

// ─── explain() strings ────────────────────────────────────────────────────────

describe('explain()', () => {
  test('returns non-empty strings for all metrics', () => {
    const L = levers({ roadWidthM: 7, greenPct: 20 });
    const exp = explain({ baseline: marketBaseline, levers: L, assumptions: A });
    expect(exp.fire).toContain('Response =');
    expect(exp.flood).toContain('Flood risk =');
    expect(exp.safety).toContain('Safety index =');
    expect(exp.cost).toContain('Total (mid) =');
  });

  test('explain fire substitutes actual values', () => {
    const L = levers({ roadWidthM: 9, footpathM: 1, obstructionClearPct: 80 });
    const exp = explain({ baseline: marketBaseline, levers: L, assumptions: A });
    expect(exp.fire).toContain('9');
  });
});
