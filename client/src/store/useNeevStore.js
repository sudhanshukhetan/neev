/**
 * client/src/store/useNeevStore.js
 * Single source of truth for Neev.
 * Uses Zustand for lightweight, subscription-based state.
 * Falls back to a manual context+useReducer-compatible API.
 */

import { create } from 'zustand';
import { DEFAULT_LEVERS, clampLevers } from '@shared/levers.js';
import { DEFAULT_ASSUMPTIONS, mergeAssumptions } from '@shared/assumptions.js';
import { computeMetrics, computePhases, runScreening } from '@shared/engine.js';

const LANG_STORAGE_KEY = 'neev_lang';
const ASSUMPTIONS_STORAGE_KEY = 'neev_assumptions';

function loadLang() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  } catch {
    return 'en';
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {}
}

function loadAssumptions() {
  try {
    const raw = localStorage.getItem(ASSUMPTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAssumptions(overrides) {
  try {
    localStorage.setItem(ASSUMPTIONS_STORAGE_KEY, JSON.stringify(overrides));
  } catch {}
}

/** Recompute derived metrics from baseline + levers + assumptions */
function deriveMetrics(baseline, levers, assumptions) {
  if (!baseline) return { current: null, planned: null, phases: null };
  try {
    const current = computeMetrics({ baseline, levers, assumptions, stage: 'current' });
    const planned = computeMetrics({ baseline, levers, assumptions, stage: 'planned' });
    const phases = computePhases({ baseline, levers, assumptions });
    return { current, planned, phases };
  } catch (e) {
    console.error('[neev] Engine error:', e);
    return { current: null, planned: null, phases: null };
  }
}

export const useNeevStore = create((set, get) => {
  const assumptionOverrides = loadAssumptions();
  const assumptions = mergeAssumptions(assumptionOverrides);

  return {
    // ── Language ──
    lang: loadLang(),
    setLang: (lang) => {
      saveLang(lang);
      try { document.documentElement.lang = lang; } catch {}
      set({ lang });
    },

    // ── Render mode ──
    mode: '3d', // '3d' | '2d'
    setMode: (mode) => set({ mode }),

    // ── Stage ──
    stage: 'planned', // 'current' | 'planned'
    setStage: (stage) => {
      set({ stage });
    },

    // ── Baseline (from preset or photo) ──
    baseline: null,
    setBaseline: (baseline) => {
      const { levers, assumptions } = get();
      const metrics = deriveMetrics(baseline, levers, assumptions);
      set({ baseline, ...metrics, hasAudit: true });
    },

    // ── Preset ──
    activePreset: null,
    setActivePreset: (preset) => {
      set({ activePreset: preset });
    },

    // ── Audit status ──
    isAuditing: false,
    setIsAuditing: (v) => set({ isAuditing: v }),
    hasAudit: false,
    auditError: null,
    setAuditError: (e) => set({ auditError: e }),

    // ── Levers ──
    levers: clampLevers(DEFAULT_LEVERS),
    setLever: (id, value) => {
      const { levers, baseline, assumptions } = get();
      const next = clampLevers({ ...levers, [id]: value });
      const metrics = deriveMetrics(baseline, next, assumptions);
      set({ levers: next, ...metrics, blueprintModified: true });
    },
    setLevers: (newLevers) => {
      const { baseline, assumptions } = get();
      const next = clampLevers(newLevers);
      const metrics = deriveMetrics(baseline, next, assumptions);
      set({ levers: next, ...metrics });
    },
    resetLeversToBaseline: () => {
      const { baseline, assumptions } = get();
      if (!baseline) return;
      const baselineLevers = {
        roadWidthM: baseline.laneWidthM,
        footpathM: 0,
        greenPct: baseline.greenPct,
        maxFloors: baseline.floorsAvg,
        coveredDrainPct: baseline.drainCondition === 'covered' ? 80 : baseline.drainCondition === 'open' ? 20 : 0,
        rechargePits: 0,
        obstructionClearPct: 0,
        undergroundUtilPct: baseline.wiresVisible ? 0 : 60,
        retrofitPct: 0,
      };
      const next = clampLevers(baselineLevers);
      const metrics = deriveMetrics(baseline, next, assumptions);
      set({ levers: next, ...metrics, activeBlueprint: null, blueprintModified: false });
    },

    // ── Blueprint ──
    activeBlueprint: null,
    blueprintModified: false,
    setBlueprint: (blueprint) => {
      const { baseline, assumptions } = get();
      if (!blueprint) {
        set({ activeBlueprint: null, blueprintModified: false });
        return;
      }
      const next = clampLevers({ ...DEFAULT_LEVERS, ...blueprint.levers });
      const metrics = deriveMetrics(baseline, next, assumptions);
      set({ activeBlueprint: blueprint.id, blueprintModified: false, levers: next, ...metrics });
    },

    // ── Assumptions ──
    assumptions,
    assumptionOverrides,
    setAssumption: (id, value) => {
      const { assumptionOverrides, baseline, levers } = get();
      const next = { ...assumptionOverrides, [id]: value };
      saveAssumptions(next);
      const nextAssumptions = mergeAssumptions(next);
      const metrics = deriveMetrics(baseline, levers, nextAssumptions);
      set({ assumptionOverrides: next, assumptions: nextAssumptions, ...metrics });
    },
    resetAssumptions: () => {
      const { baseline, levers } = get();
      saveAssumptions({});
      const nextAssumptions = mergeAssumptions({});
      const metrics = deriveMetrics(baseline, levers, nextAssumptions);
      set({ assumptionOverrides: {}, assumptions: nextAssumptions, ...metrics });
    },

    // ── Computed metrics (derived) ──
    current: null,  // computeMetrics stage='current'
    planned: null,  // computeMetrics stage='planned'
    phases: null,   // computePhases result

    // ── Monsoon mode ──
    monsoonActive: false,
    setMonsoonActive: (v) => set({ monsoonActive: v }),
    monsoonRainMmHr: 60,
    setMonsoonRain: (v) => set({ monsoonRainMmHr: v }),

    // ── Fire dispatch ──
    fireDispatchActive: false,
    setFireDispatchActive: (v) => set({ fireDispatchActive: v }),

    // ── Toast ──
    toast: null,
    showToast: (msg) => {
      set({ toast: msg });
      setTimeout(() => set({ toast: null }), 4000);
    },
    dismissToast: () => set({ toast: null }),

    // ── Assumptions drawer ──
    assumptionsOpen: false,
    setAssumptionsOpen: (v) => set({ assumptionsOpen: v }),
  };
});
