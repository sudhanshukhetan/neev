/**
 * shared/presets.js
 * Three authentic Indian locality presets.
 * Each has a full baseline (source: 'preset') and a friendly display name.
 * Used by the Site Panel's preset cards.
 */

export const PRESETS = [
  {
    id: 'market-lane',
    name: 'Congested Tier-2 Market Lane',
    ward: 'Ward 14-B, Meerut (Uttar Pradesh)',
    description:
      'A dense commercial lane with vegetable vendors, hanging electrical wires, and parked tempo-trucks blocking the ambulance route. Last monsoon saw knee-deep water for 6 hours.',
    thumbnail: null,
    baseline: {
      laneWidthM: 4.2,
      obstructionM: 1.6,
      drainCondition: 'clogged',
      greenPct: 4,
      floorsAvg: 3,
      wiresVisible: true,
      buildingConditionScore: 38,
      source: 'preset',
      confidence: {
        laneWidthM: 1,
        obstructionM: 1,
        drainCondition: 1,
        greenPct: 1,
        floorsAvg: 1,
        wiresVisible: 1,
        buildingConditionScore: 1,
      },
    },
  },
  {
    id: 'urban-fringe',
    name: 'Unplanned Urban-Fringe Colony',
    ward: 'Sector 42-A Extension, Faridabad (Haryana)',
    description:
      'An informal colony on the city periphery with illegal G+3 and G+4 construction on plots zoned for G+1. No proper drainage. The colony sits in IS 1893 Seismic Zone IV.',
    thumbnail: null,
    baseline: {
      laneWidthM: 5.0,
      obstructionM: 0.8,
      drainCondition: 'open',
      greenPct: 4,
      floorsAvg: 4,
      wiresVisible: true,
      buildingConditionScore: 30,
      source: 'preset',
      confidence: {
        laneWidthM: 1,
        obstructionM: 1,
        drainCondition: 1,
        greenPct: 1,
        floorsAvg: 1,
        wiresVisible: 1,
        buildingConditionScore: 1,
      },
    },
  },
  {
    id: 'old-town',
    name: 'Flood-Prone Old Town Cluster',
    ward: 'Mutt Mohalla, Aurangabad (Maharashtra)',
    description:
      'Pre-independence walled-city lane. Crumbling lime-mortar facades, completely clogged storm drains, narrow 2.8m passage that stops any vehicle larger than an autorickshaw. 82% monsoon flood-risk index.',
    thumbnail: null,
    baseline: {
      laneWidthM: 2.8,
      obstructionM: 0.5,
      drainCondition: 'clogged',
      greenPct: 3,
      floorsAvg: 3,
      wiresVisible: true,
      buildingConditionScore: 22,
      source: 'preset',
      confidence: {
        laneWidthM: 1,
        obstructionM: 1,
        drainCondition: 1,
        greenPct: 1,
        floorsAvg: 1,
        wiresVisible: 1,
        buildingConditionScore: 1,
      },
    },
  },
];

export const PRESET_MAP = Object.fromEntries(PRESETS.map((p) => [p.id, p]));
