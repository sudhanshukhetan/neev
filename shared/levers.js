/**
 * shared/levers.js
 * The 9 levers that drive every Neev simulation.
 * Grouped for the LeverPanel UI.
 * No I/O, no side effects.
 */

export const LEVER_GROUPS = {
  streets: ['roadWidthM', 'footpathM', 'obstructionClearPct'],
  water: ['coveredDrainPct', 'rechargePits', 'greenPct'],
  buildings: ['maxFloors', 'retrofitPct'],
  utilities: ['undergroundUtilPct'],
};

export const LEVERS = [
  // ── Streets ─────────────────────────────────────────────────────────────────
  {
    id: 'roadWidthM',
    group: 'streets',
    min: 3,
    max: 12,
    step: 0.5,
    unit: 'm',
    defaultValue: 3,
    labelKey: 'lever_roadWidth',
    noteKey: 'lever_roadWidth_note',
  },
  {
    id: 'footpathM',
    group: 'streets',
    min: 0,
    max: 2.5,
    step: 0.25,
    unit: 'm',
    defaultValue: 0,
    labelKey: 'lever_footpath',
    noteKey: 'lever_footpath_note',
  },
  {
    id: 'obstructionClearPct',
    group: 'streets',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    defaultValue: 0,
    labelKey: 'lever_obstructionClear',
    noteKey: 'lever_obstructionClear_note',
  },
  // ── Water ────────────────────────────────────────────────────────────────────
  {
    id: 'coveredDrainPct',
    group: 'water',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    defaultValue: 0,
    labelKey: 'lever_coveredDrain',
    noteKey: 'lever_coveredDrain_note',
  },
  {
    id: 'rechargePits',
    group: 'water',
    min: 0,
    max: 10,
    step: 1,
    unit: '/100m',
    defaultValue: 0,
    labelKey: 'lever_rechargePits',
    noteKey: 'lever_rechargePits_note',
  },
  {
    id: 'greenPct',
    group: 'water',
    min: 5,
    max: 40,
    step: 1,
    unit: '%',
    defaultValue: 5,
    labelKey: 'lever_greenPct',
    noteKey: 'lever_greenPct_note',
  },
  // ── Buildings ─────────────────────────────────────────────────────────────────
  {
    id: 'maxFloors',
    group: 'buildings',
    min: 2,
    max: 6,
    step: 1,
    unit: 'fl',
    defaultValue: 4,
    labelKey: 'lever_maxFloors',
    noteKey: 'lever_maxFloors_note',
  },
  {
    id: 'retrofitPct',
    group: 'buildings',
    min: 0,
    max: 100,
    step: 10,
    unit: '%',
    defaultValue: 0,
    labelKey: 'lever_retrofitPct',
    noteKey: 'lever_retrofitPct_note',
  },
  // ── Utilities ────────────────────────────────────────────────────────────────
  {
    id: 'undergroundUtilPct',
    group: 'utilities',
    min: 0,
    max: 100,
    step: 10,
    unit: '%',
    defaultValue: 0,
    labelKey: 'lever_undergroundUtil',
    noteKey: 'lever_undergroundUtil_note',
  },
];

/** Default lever values (matches worst-case baseline) */
export const DEFAULT_LEVERS = Object.fromEntries(
  LEVERS.map((l) => [l.id, l.defaultValue])
);

/** Clamp a lever object to its defined range */
export function clampLevers(levers) {
  const out = {};
  for (const lever of LEVERS) {
    const raw = levers[lever.id];
    const v = typeof raw === 'number' && isFinite(raw) ? raw : lever.defaultValue;
    out[lever.id] = Math.min(lever.max, Math.max(lever.min, v));
  }
  return out;
}
