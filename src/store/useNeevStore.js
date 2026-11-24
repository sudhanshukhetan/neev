/**
 * src/store/useNeevStore.js
 * Single source of truth for Neev.
 * Unifies Interactive World Map Discovery, Urban Redevelopment Studio,
 * and Greenfield Plain-Land Construction Studio.
 */

import { create } from 'zustand';
import { DEFAULT_LEVERS, clampLevers } from '@shared/levers.js';
import { DEFAULT_ASSUMPTIONS, mergeAssumptions } from '@shared/assumptions.js';
import { computeMetrics, computePhases, runScreening } from '@shared/engine.js';
import { computeGreenfieldProject } from '@shared/greenfieldEngine.js';

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

const DEFAULT_PLAIN_LAND = {
  selectedIds: ['society', 'park'],
  areaAcres: 5,
  greenPct: 25,
  solarPct: 50,
};

export const CITIES = [
  { name: 'Chandni Chowk', city: 'Old Delhi', lat: 28.6562, lon: 77.2300, desc: 'Narrow commercial heritage lane with 2.9m clear width' },
  { name: 'Connaught Place', city: 'New Delhi', lat: 28.6315, lon: 77.2167, desc: 'Historic radial commercial business district' },
  { name: 'Karol Bagh', city: 'Central Delhi', lat: 28.6514, lon: 77.1907, desc: 'High-density mixed market corridor' },
  { name: 'Faridabad', city: 'Haryana', lat: 28.4089, lon: 77.3178, desc: 'Informal urban-fringe colony in Seismic Zone IV' },
  { name: 'Dharavi', city: 'Mumbai', lat: 19.0434, lon: 72.8567, desc: 'Ultra-dense in-situ artisan cluster with narrow passages' },
  { name: 'Bengaluru Market', city: 'Bengaluru', lat: 12.9698, lon: 77.5753, desc: 'Chikpete wholesale market corridor' },
  { name: 'Chandigarh Sector', city: 'Chandigarh', lat: 30.7415, lon: 76.7681, desc: 'Le Corbusier planned grid sector' },
  { name: 'Jaipur Heritage', city: 'Jaipur', lat: 26.9239, lon: 75.8267, desc: 'Walled pink city bazaar with high vendor density' },
  { name: 'Ahmedabad Smart-Transit', city: 'Ahmedabad', lat: 23.0225, lon: 72.5714, desc: 'Dedicated BRTS corridor with recharge pits' },
];

export const useNeevStore = create((set, get) => {
  const assumptionOverrides = loadAssumptions();
  const assumptions = mergeAssumptions(assumptionOverrides);
  const initialPlainMetrics = computeGreenfieldProject(DEFAULT_PLAIN_LAND);

  return {
    // ── Language ──
    lang: loadLang(),
    setLang: (lang) => {
      saveLang(lang);
      try { document.documentElement.lang = lang; } catch {}
      set({ lang });
    },

    // ── Primary App Navigation Mode: 'map' | 'urban' | 'plain' ──
    appMode: 'map',
    setAppMode: (appMode) => set({ appMode }),

    // ── Constructive Civic City & Persona Controls ──
    viewingAs: 'ward_officer', // 'ward_officer' | 'planner' | 'resident'
    setViewingAs: (viewingAs) => set({ viewingAs }),
    selectedCity: 'Chandni Chowk',
    setSelectedCity: (cityName) => {
      const c = CITIES.find((item) => item.name === cityName);
      if (c) {
        set({
          selectedCity: c.name,
          selectedCoordinates: { lat: c.lat, lon: c.lon },
        });
      } else {
        set({ selectedCity: cityName });
      }
    },

    // ── Scenario Stress Test ('normal' | 'monsoon' | 'fire') ──
    scenario: 'normal',
    setScenario: (scenario) => {
      set({
        scenario,
        monsoonActive: scenario === 'monsoon',
        fireDispatchActive: scenario === 'fire',
      });
    },

    // ── 3D Viewport Camera Preset: 'isometric' | 'street' | 'top' ──
    cameraPreset: 'isometric',
    setCameraPreset: (cameraPreset) => set({ cameraPreset }),

    // ── 3D / 2D Render toggle ──
    mode: '3d', // '3d' | '2d'
    setMode: (mode) => set({ mode }),

    // ── Urban Stage: 'current' | 'planned' ──
    stage: 'planned',
    setStage: (stage) => set({ stage }),

    // ── World Map & Location Intelligence ──
    mapLayer: 'satellite', // 'satellite' | 'street'
    setMapLayer: (mapLayer) => set({ mapLayer }),
    selectedCoordinates: { lat: 28.6139, lon: 77.2090 }, // New Delhi
    setSelectedCoordinates: (coords) => set({ selectedCoordinates: coords }),
    locationIntel: null,
    setLocationIntel: (locationIntel) => set({ locationIntel }),
    intelDrawerOpen: false,
    setIntelDrawerOpen: (intelDrawerOpen) => set({ intelDrawerOpen }),
    intelLoading: false,
    setIntelLoading: (intelLoading) => set({ intelLoading }),

    // ── Greenfield Plain Land Construction Studio ──
    plainLand: DEFAULT_PLAIN_LAND,
    plainLandMetrics: initialPlainMetrics,
    toggleStructure: (structureId) => {
      const { plainLand } = get();
      const exists = plainLand.selectedIds.includes(structureId);
      const nextIds = exists
        ? plainLand.selectedIds.filter(id => id !== structureId)
        : [...plainLand.selectedIds, structureId];

      // Ensure at least one structure is selected
      const finalIds = nextIds.length > 0 ? nextIds : [structureId];
      const nextPlainLand = { ...plainLand, selectedIds: finalIds };
      const nextMetrics = computeGreenfieldProject(nextPlainLand);
      set({ plainLand: nextPlainLand, plainLandMetrics: nextMetrics });
    },
    setPlainLandArea: (areaAcres) => {
      const { plainLand } = get();
      const nextPlainLand = { ...plainLand, areaAcres: Number(areaAcres) || 5 };
      const nextMetrics = computeGreenfieldProject(nextPlainLand);
      set({ plainLand: nextPlainLand, plainLandMetrics: nextMetrics });
    },
    setPlainLandGreenPct: (greenPct) => {
      const { plainLand } = get();
      const nextPlainLand = { ...plainLand, greenPct: Number(greenPct) || 25 };
      const nextMetrics = computeGreenfieldProject(nextPlainLand);
      set({ plainLand: nextPlainLand, plainLandMetrics: nextMetrics });
    },
    setPlainLandSolarPct: (solarPct) => {
      const { plainLand } = get();
      const nextPlainLand = { ...plainLand, solarPct: Number(solarPct) || 50 };
      const nextMetrics = computeGreenfieldProject(nextPlainLand);
      set({ plainLand: nextPlainLand, plainLandMetrics: nextMetrics });
    },

    // ── Baseline (from preset, photo, or map) ──
    baseline: null,
    setBaseline: (baseline) => {
      const { levers, assumptions } = get();
      const metrics = deriveMetrics(baseline, levers, assumptions);
      set({ baseline, ...metrics, hasAudit: true });
    },

    // ── Preset ──
    activePreset: null,
    setActivePreset: (preset) => set({ activePreset: preset }),

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

    // ── Computed metrics ──
    current: null,
    planned: null,
    phases: null,

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
