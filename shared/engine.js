/**
 * shared/engine.js
 * Pure, synchronous, deterministic simulation engine for Neev.
 *
 * Rules:
 *  - No I/O, no randomness, no Date.now()
 *  - All constants come from the `assumptions` parameter
 *  - Every formula is documented and exported as an explain() string
 *  - Functions are small and independently testable
 */

// ─── Utilities ────────────────────────────────────────────────────────────────

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Smooth monotonic ramp from 0 (at lo) to 1 (at hi).
 * Uses smoothstep for C1-continuous transitions.
 */
function smoothstep(x, lo, hi) {
  if (hi <= lo) return x >= hi ? 1 : 0;
  const t = clamp((x - lo) / (hi - lo), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

// ─── Fire-Tender Access ───────────────────────────────────────────────────────

/**
 * computeFire({ baseline, levers, assumptions })
 * Returns fire-tender access metrics.
 *
 * clearWidthM = carriageway − remaining obstruction
 * carriageway = roadWidthM − 2 × footpathM
 */
export function computeFire({ baseline, levers, assumptions: A }) {
  const carriagewayM = clamp(levers.roadWidthM - 2 * levers.footpathM, 0, levers.roadWidthM);
  const remainingObstructionM =
    baseline.obstructionM * (1 - levers.obstructionClearPct / 100);
  const clearWidthM = clamp(carriagewayM - remainingObstructionM, 0, carriagewayM);

  const fireOk = clearWidthM >= A.fireTenderClearM;
  const speedKmh =
    A.vMin + (A.vMax - A.vMin) * smoothstep(clearWidthM, A.wLow, A.wHigh);
  const travelMin = (A.distanceKm / speedKmh) * 60;
  const responseMin = travelMin + A.dispatchMin + (fireOk ? 0 : A.blockedDelayMin);

  return {
    carriagewayM,
    remainingObstructionM,
    clearWidthM,
    fireOk,
    speedKmh,
    responseMin: Math.round(responseMin * 10) / 10,
    pinchPointLabel: fireOk
      ? null
      : `${clearWidthM.toFixed(1)} m clear — ${A.fireTenderClearM} m needed`,
  };
}

/** Explain fire response calculation in plain text with substituted values */
export function explainFire({ baseline, levers, assumptions: A }) {
  const { carriagewayM, remainingObstructionM, clearWidthM, fireOk, speedKmh, responseMin } =
    computeFire({ baseline, levers, assumptions: A });
  const travelMin = (A.distanceKm / speedKmh) * 60;
  const blockedPart = fireOk ? '' : ` + ${A.blockedDelayMin} min blocked delay`;
  return (
    `Carriageway = ${levers.roadWidthM} m road − 2 × ${levers.footpathM} m footpath = ${carriagewayM.toFixed(1)} m\n` +
    `Obstruction = ${baseline.obstructionM} m × (1 − ${levers.obstructionClearPct}%) = ${remainingObstructionM.toFixed(2)} m\n` +
    `Clear width = ${carriagewayM.toFixed(1)} − ${remainingObstructionM.toFixed(2)} = ${clearWidthM.toFixed(2)} m\n` +
    `Speed = ${speedKmh.toFixed(1)} km/h (smoothstep ${A.vMin}–${A.vMax} km/h over ${A.wLow}–${A.wHigh} m)\n` +
    `Travel = ${A.distanceKm} km ÷ ${speedKmh.toFixed(1)} km/h × 60 = ${travelMin.toFixed(1)} min\n` +
    `Response = ${travelMin.toFixed(1)} + ${A.dispatchMin} dispatch${blockedPart} = ${responseMin} min`
  );
}

// ─── Flood / Stormwater ───────────────────────────────────────────────────────

/**
 * computeFlood({ baseline, levers, assumptions, rainMmHr? })
 * rainMmHr overrides A.stormMmHr for Monsoon Mode live slider.
 */
export function computeFlood({ baseline, levers, assumptions: A, rainMmHr }) {
  const storm = rainMmHr != null ? clamp(rainMmHr, 20, 120) : A.stormMmHr;

  // Runoff coefficient
  const runoffC = clamp(
    A.cBase - A.cGreen * levers.greenPct - A.cRecharge * levers.rechargePits,
    A.cMin,
    0.95
  );

  // Drain capacity blended by coveredDrainPct
  const drainFactorMap = {
    none: 0,
    open: A.drainOpen,
    clogged: A.drainClogged,
    covered: A.drainCovered,
  };
  const baseDrainFactor = drainFactorMap[baseline.drainCondition] ?? A.drainOpen;
  const blendedFactor = lerp(baseDrainFactor, A.drainCovered, levers.coveredDrainPct / 100);
  const drainCapacity = A.drainCapBase * blendedFactor;

  // Inflow vs capacity
  const inflow = storm * A.catchmentHa * runoffC;
  const excess = Math.max(0, inflow - drainCapacity);
  const pondAreaFactor = clamp(levers.roadWidthM / 6, 0.5, 2.0); // wider road = more collection area
  const floodDepthCm = (A.kPond * excess * A.stormHours) / pondAreaFactor;
  const floodRiskPct = clamp(100 * smoothstep(floodDepthCm, 0, A.depthCapCm), 3, 100);
  const hoursToDrain = floodDepthCm * A.drainHrPerCm;

  return {
    runoffC: Math.round(runoffC * 1000) / 1000,
    drainCapacity: Math.round(drainCapacity * 100) / 100,
    inflow: Math.round(inflow * 100) / 100,
    excess: Math.round(excess * 100) / 100,
    floodDepthCm: Math.round(floodDepthCm * 10) / 10,
    floodRiskPct: Math.round(floodRiskPct),
    hoursToDrain: Math.round(hoursToDrain * 10) / 10,
    groundFloorsAffected: floodDepthCm > 30 ? 'Yes (depth > 30 cm)' : 'No',
  };
}

export function explainFlood({ baseline, levers, assumptions: A, rainMmHr }) {
  const f = computeFlood({ baseline, levers, assumptions: A, rainMmHr });
  const storm = rainMmHr != null ? rainMmHr : A.stormMmHr;
  return (
    `Runoff C = ${A.cBase} − ${A.cGreen}×${levers.greenPct}% − ${A.cRecharge}×${levers.rechargePits} pits = ${f.runoffC} (floor ${A.cMin})\n` +
    `Drain capacity = ${A.drainCapBase} × blend(${baseline.drainCondition}, ${levers.coveredDrainPct}% covered) = ${f.drainCapacity} mm-ha/hr\n` +
    `Inflow = ${storm} mm/hr × ${A.catchmentHa} ha × ${f.runoffC} = ${f.inflow} mm-ha/hr\n` +
    `Excess = max(0, ${f.inflow} − ${f.drainCapacity}) = ${f.excess} mm-ha/hr\n` +
    `Depth = ${A.kPond} × ${f.excess} × ${A.stormHours} hr ÷ pondFactor = ${f.floodDepthCm} cm\n` +
    `Flood risk = smoothstep(${f.floodDepthCm} cm, 0, ${A.depthCapCm} cm) × 100% = ${f.floodRiskPct}%`
  );
}

// ─── Structural Safety ────────────────────────────────────────────────────────

export function computeSafety({ baseline, levers, assumptions: A }) {
  const carriagewayM = clamp(levers.roadWidthM - 2 * levers.footpathM, 0, levers.roadWidthM);
  const retrofitBonus = (A.retrofitGain * levers.retrofitPct) / 100;
  const floorPenalty = A.floorPenalty * Math.max(0, levers.maxFloors - A.lowRiseCap);
  const roadBonus = A.roadSafetyBonus * smoothstep(carriagewayM, 3, 9);
  const safetyIndex = clamp(
    baseline.buildingConditionScore + retrofitBonus - floorPenalty + roadBonus,
    0,
    100
  );
  return {
    safetyIndex: Math.round(safetyIndex),
    retrofitBonus: Math.round(retrofitBonus),
    floorPenalty: Math.round(floorPenalty),
    roadBonus: Math.round(roadBonus * 10) / 10,
  };
}

export function explainSafety({ baseline, levers, assumptions: A }) {
  const s = computeSafety({ baseline, levers, assumptions: A });
  const carriagewayM = clamp(levers.roadWidthM - 2 * levers.footpathM, 0, levers.roadWidthM);
  return (
    `Base condition score = ${baseline.buildingConditionScore} (site-assessed)\n` +
    `Retrofit bonus = ${A.retrofitGain} × ${levers.retrofitPct}% ÷ 100 = +${s.retrofitBonus} pts\n` +
    `Floor penalty = ${A.floorPenalty} × max(0, ${levers.maxFloors} − ${A.lowRiseCap}) = −${s.floorPenalty} pts\n` +
    `Road access bonus = ${A.roadSafetyBonus} × smoothstep(${carriagewayM.toFixed(1)} m, 3–9 m) = +${s.roadBonus} pts\n` +
    `Safety index = clamp(${baseline.buildingConditionScore} + ${s.retrofitBonus} − ${s.floorPenalty} + ${s.roadBonus}, 0–100) = ${s.safetyIndex}`
  );
}

// ─── Heat Island Proxy ────────────────────────────────────────────────────────

export function computeHeat({ levers }) {
  // Simple linear proxy: more green = less heat island
  const pavedFraction = clamp((100 - levers.greenPct) / 100, 0.3, 1.0);
  const heatIndex = Math.round(clamp(45 + 30 * pavedFraction - 0.3 * levers.greenPct, 10, 100));
  return { heatIndex };
}

// ─── Cost Estimate ────────────────────────────────────────────────────────────

/**
 * computeCost({ baseline, levers, assumptions })
 * Returns midpoint estimate + ±40% band.
 * All unit rates are in `assumptions`.
 */
export function computeCost({ baseline, levers, assumptions: A }) {
  const L = A.laneLength;
  const nBuildings = Math.round((A.buildingsPerHundredM * L) / 100);

  // Road widening: cost proportional to widening vs baseline
  const wideningM = Math.max(0, levers.roadWidthM - baseline.laneWidthM);
  const costRoad = (A.costRoadWideningCrPer100m * wideningM * L) / 100;

  // Drain covering
  const costDrain = A.costDrainCrPer100m * levers.coveredDrainPct * (L / 100);

  // Seismic retrofit
  const costRetrofit = A.costRetrofitCrPerBuilding * nBuildings * (levers.retrofitPct / 100);

  // Green infrastructure
  const greenDelta = Math.max(0, levers.greenPct - baseline.greenPct);
  const costGreen = A.costTreePitCrPer100m * greenDelta * (L / 100);

  // Recharge pits
  const costRecharge = A.costRechargePitCr * levers.rechargePits * (L / 100);

  // Utility undergrounding
  const costUtil = A.costUndergroundUtilCrPer100m * levers.undergroundUtilPct * (L / 100);

  const midCr = Math.round((costRoad + costDrain + costRetrofit + costGreen + costRecharge + costUtil) * 100) / 100;
  const lowCr = Math.round(midCr * 0.6 * 100) / 100;
  const highCr = Math.round(midCr * 1.4 * 100) / 100;

  return {
    midCr,
    lowCr,
    highCr,
    breakdown: {
      roadWidening: Math.round(costRoad * 100) / 100,
      drainCovering: Math.round(costDrain * 100) / 100,
      seismicRetrofit: Math.round(costRetrofit * 100) / 100,
      greenInfra: Math.round(costGreen * 100) / 100,
      rechargePits: Math.round(costRecharge * 100) / 100,
      utilityUnderground: Math.round(costUtil * 100) / 100,
    },
  };
}

export function explainCost({ baseline, levers, assumptions: A }) {
  const c = computeCost({ baseline, levers, assumptions: A });
  return (
    `Lane length = ${A.laneLength} m\n` +
    `Road widening = ${(levers.roadWidthM - baseline.laneWidthM).toFixed(1)} m × ₹${A.costRoadWideningCrPer100m} Cr/100m/m = ₹${c.breakdown.roadWidening} Cr\n` +
    `Drain covering = ${levers.coveredDrainPct}% × ₹${A.costDrainCrPer100m} Cr/%/100m = ₹${c.breakdown.drainCovering} Cr\n` +
    `Seismic retrofit = ${Math.round((A.buildingsPerHundredM * A.laneLength) / 100)} bldgs × ${levers.retrofitPct}% × ₹${A.costRetrofitCrPerBuilding} Cr = ₹${c.breakdown.seismicRetrofit} Cr\n` +
    `Green infra = ${Math.max(0, levers.greenPct - baseline.greenPct)}% delta × ₹${A.costTreePitCrPer100m} Cr/%/100m = ₹${c.breakdown.greenInfra} Cr\n` +
    `Recharge pits = ${levers.rechargePits}/100m × ₹${A.costRechargePitCr} Cr × ${(A.laneLength / 100).toFixed(0)} = ₹${c.breakdown.rechargePits} Cr\n` +
    `Utilities = ${levers.undergroundUtilPct}% × ₹${A.costUndergroundUtilCrPer100m} Cr/%/100m = ₹${c.breakdown.utilityUnderground} Cr\n` +
    `Total (mid) = ₹${c.midCr} Cr  |  Low (−40%) = ₹${c.lowCr} Cr  |  High (+40%) = ₹${c.highCr} Cr`
  );
}

// ─── Phased Plan ─────────────────────────────────────────────────────────────

const PHASE_DEFINITIONS = [
  {
    id: 'p1',
    name: 'Quick Wins',
    months: [0, 6],
    leverMods: ['obstructionClearPct', 'footpathM', 'coveredDrainPct'],
  },
  {
    id: 'p2',
    name: 'Services & Green',
    months: [6, 18],
    leverMods: ['greenPct', 'rechargePits', 'undergroundUtilPct'],
  },
  {
    id: 'p3',
    name: 'Heavy Works',
    months: [12, 36],
    leverMods: ['roadWidthM', 'retrofitPct', 'maxFloors'],
  },
];

/** Build cumulative lever vectors for each phase */
function phaseLeverVectors(baseline, levers) {
  // current state = baseline-implied (no intervention)
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

  // Build cumulative phases
  const phases = [];
  let cumulative = { ...baselineLevers };

  for (const phase of PHASE_DEFINITIONS) {
    const phaseLevers = { ...cumulative };
    for (const lev of phase.leverMods) {
      phaseLevers[lev] = levers[lev];
    }
    phases.push({ ...phase, levers: phaseLevers });
    cumulative = phaseLevers;
  }
  return { baselineLevers, phases };
}

export function computePhases({ baseline, levers, assumptions: A }) {
  const { baselineLevers, phases } = phaseLeverVectors(baseline, levers);

  const results = phases.map((phase) => {
    const fire = computeFire({ baseline, levers: phase.levers, assumptions: A });
    const flood = computeFlood({ baseline, levers: phase.levers, assumptions: A });
    const safety = computeSafety({ baseline, levers: phase.levers, assumptions: A });
    const heat = computeHeat({ levers: phase.levers });
    const cost = computeCost({ baseline, levers: phase.levers, assumptions: A });

    // Phase-incremental cost (cost above previous cumulative)
    return {
      id: phase.id,
      name: phase.name,
      months: phase.months,
      leverMods: phase.leverMods,
      metricsAfter: {
        responseMin: fire.responseMin,
        floodRiskPct: flood.floodRiskPct,
        floodDepthCm: flood.floodDepthCm,
        safetyIndex: safety.safetyIndex,
        heatIndex: heat.heatIndex,
      },
      cumulativeCost: cost,
    };
  });

  // Compute incremental cost per phase
  let prevMid = 0;
  for (const r of results) {
    const incMid = Math.max(0, r.cumulativeCost.midCr - prevMid);
    r.incrementalCost = {
      midCr: Math.round(incMid * 100) / 100,
      lowCr: Math.round(incMid * 0.6 * 100) / 100,
      highCr: Math.round(incMid * 1.4 * 100) / 100,
    };
    prevMid = r.cumulativeCost.midCr;
  }

  return results;
}

// ─── Screening Checks ─────────────────────────────────────────────────────────

/**
 * runScreening({ baseline, levers, assumptions })
 * Returns array of { id, label, value, threshold, status, basis }
 * status: 'pass' | 'watch' | 'fail'
 * Labels: "Screening: pass" NOT "NBC compliant"
 */
export function runScreening({ levers, assumptions: A }) {
  const { carriagewayM, clearWidthM, fireOk } = computeFire({
    baseline: { obstructionM: 0 }, // obstruction already applied via levers
    levers,
    assumptions: A,
  });

  const checks = [
    {
      id: 'fireTenderWidth',
      label: 'Fire-tender clear width',
      value: clearWidthM,
      threshold: A.fireTenderClearM,
      unit: 'm',
      pass: clearWidthM >= A.fireTenderClearM,
      basis: 'Screening assumption. Verify: NBC 2016 Part 4, Cl. 4.2',
    },
    {
      id: 'footpathWidth',
      label: 'Footpath width (each side)',
      value: levers.footpathM,
      threshold: A.footpathMinM,
      unit: 'm',
      pass: levers.footpathM >= A.footpathMinM,
      basis: 'Screening assumption. NBC 2016 Part 3 recommends ≥1.5m on arterials',
    },
    {
      id: 'lowRiseCap',
      label: 'Floor count (low-rise cap)',
      value: levers.maxFloors,
      threshold: A.lowRiseCap,
      unit: 'fl',
      pass: levers.maxFloors <= A.lowRiseCap,
      basis: 'Screening assumption. Verify: local FAR bye-laws and IS 1893 Zone IV seismic limits',
    },
    {
      id: 'greenCover',
      label: 'Green cover',
      value: levers.greenPct,
      threshold: A.greenMinPct,
      unit: '%',
      pass: levers.greenPct >= A.greenMinPct,
      basis: 'Screening assumption. Local development plans and NBC Part 3 vary',
    },
    {
      id: 'drainCoverage',
      label: 'Covered / maintained drain',
      value: levers.coveredDrainPct,
      threshold: A.drainMinPct,
      unit: '%',
      pass: levers.coveredDrainPct >= A.drainMinPct,
      basis: 'Screening assumption. Storm-water management guidelines',
    },
    {
      id: 'rechargeMin',
      label: 'Rainwater recharge pits',
      value: levers.rechargePits,
      threshold: A.rechargeMin,
      unit: '/100m',
      pass: levers.rechargePits >= A.rechargeMin,
      basis: 'Screening assumption. Verify: local SWM guidelines',
    },
  ];

  return checks.map((c) => ({
    id: c.id,
    label: c.label,
    value: c.value,
    threshold: c.threshold,
    unit: c.unit,
    status: c.pass ? 'pass' : c.value >= c.threshold * 0.7 ? 'watch' : 'fail',
    basis: c.basis,
  }));
}

// ─── Master computeMetrics ────────────────────────────────────────────────────

/**
 * computeMetrics({ baseline, levers, assumptions, stage })
 * stage: 'current' | 'planned'
 * For 'current', uses baseline-implied levers (no intervention).
 * For 'planned', uses the levers as provided.
 *
 * Returns the full result object used by the UI.
 */
export function computeMetrics({ baseline, levers, assumptions: A, stage = 'planned' }) {
  let activeLevers = levers;

  if (stage === 'current') {
    // Current state = baseline conditions, no improvements
    activeLevers = {
      roadWidthM: baseline.laneWidthM,
      footpathM: 0,
      greenPct: baseline.greenPct,
      maxFloors: baseline.floorsAvg,
      coveredDrainPct:
        baseline.drainCondition === 'covered' ? 80 : baseline.drainCondition === 'open' ? 20 : 0,
      rechargePits: 0,
      obstructionClearPct: 0,
      undergroundUtilPct: baseline.wiresVisible ? 0 : 60,
      retrofitPct: 0,
    };
  }

  const fire = computeFire({ baseline, levers: activeLevers, assumptions: A });
  const flood = computeFlood({ baseline, levers: activeLevers, assumptions: A });
  const safety = computeSafety({ baseline, levers: activeLevers, assumptions: A });
  const heat = computeHeat({ levers: activeLevers });
  const cost = computeCost({ baseline, levers: activeLevers, assumptions: A });
  const screening = runScreening({ levers: activeLevers, assumptions: A });

  return {
    stage,
    fire,
    flood,
    safety,
    heat,
    cost,
    screening,
    // Convenience top-level fields for the UI
    responseMin: fire.responseMin,
    fireOk: fire.fireOk,
    clearWidthM: fire.clearWidthM,
    floodRiskPct: flood.floodRiskPct,
    floodDepthCm: flood.floodDepthCm,
    hoursToDrain: flood.hoursToDrain,
    safetyIndex: safety.safetyIndex,
    heatIndex: heat.heatIndex,
    costMidCr: cost.midCr,
    costLowCr: cost.lowCr,
    costHighCr: cost.highCr,
  };
}

/** Master explain() — returns an object with explanation strings for each metric */
export function explain({ baseline, levers, assumptions: A }) {
  return {
    fire: explainFire({ baseline, levers, assumptions: A }),
    flood: explainFlood({ baseline, levers, assumptions: A }),
    safety: explainSafety({ baseline, levers, assumptions: A }),
    cost: explainCost({ baseline, levers, assumptions: A }),
  };
}
