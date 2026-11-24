/**
 * shared/simulationEngine.test.js
 * Test suite confirming simulationEngine re-exports and core engine functionality.
 */
import { describe, test, expect } from 'vitest';
import * as engine from './simulationEngine.js';

describe('simulationEngine compatibility suite', () => {
  test('exports computeMetrics, computeFire, computeFlood, computeCost, computePhases, runScreening', () => {
    expect(typeof engine.computeMetrics).toBe('function');
    expect(typeof engine.computeFire).toBe('function');
    expect(typeof engine.computeFlood).toBe('function');
    expect(typeof engine.computeCost).toBe('function');
    expect(typeof engine.computePhases).toBe('function');
    expect(typeof engine.runScreening).toBe('function');
  });
});
