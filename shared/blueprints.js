/**
 * shared/blueprints.js
 * Three city blueprints — each is a preset lever vector.
 * Selecting a blueprint animates all nine sliders to these values.
 * The user can then modify any lever; the chip changes to "Preset: X (modified)".
 */

export const BLUEPRINTS = [
  {
    id: 'chandigarh',
    name: 'Chandigarh Sector Grid',
    icon: 'grid',
    tagline: 'Orthogonal planning with green belts & underground services',
    features: [
      'Right-of-way widened to 12m with 2m footpaths',
      'Dedicated green belt (35% cover)',
      'Underground utilities — no hanging wires',
      'Full covered + desilted storm drains',
      'Low-rise cap (G+2) for seismic safety',
      '4 recharge pits per 100m stretch',
    ],
    levers: {
      roadWidthM: 12,
      footpathM: 2,
      greenPct: 35,
      maxFloors: 3,
      coveredDrainPct: 100,
      rechargePits: 4,
      obstructionClearPct: 90,
      undergroundUtilPct: 100,
      retrofitPct: 60,
    },
  },
  {
    id: 'jaipur',
    name: 'Jaipur Heritage-Commercial',
    icon: 'arch',
    tagline: 'Pedestrian-first with shaded walkways & vendor zones',
    features: [
      '9m carriageway with 2.5m continuous footpaths',
      'Vendor relocation to marked zones (100% obstruction cleared)',
      'Uniform plinth line & shaded canopy walkways',
      '15% green cover in tree pits and planter zones',
      '70% drain covered and desilted',
      'Heritage-compatible seismic retrofit (70%)',
    ],
    levers: {
      roadWidthM: 9,
      footpathM: 2.5,
      greenPct: 15,
      maxFloors: 4,
      coveredDrainPct: 70,
      rechargePits: 2,
      obstructionClearPct: 100,
      undergroundUtilPct: 60,
      retrofitPct: 70,
    },
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad Smart-Transit',
    icon: 'bus',
    tagline: 'BRT/EV lane, percolation pits & rooftop solar',
    features: [
      '10m road with dedicated BRT/EV lane',
      '8 percolation/recharge pits per 100m stretch',
      '90% covered + maintained drain — zero clogging',
      'Mixed-use G+4 corridor with open ground floor',
      '25% green cover via tree-lined footpaths',
      'Partial utility undergrounding (50%)',
    ],
    levers: {
      roadWidthM: 10,
      footpathM: 1.5,
      greenPct: 25,
      maxFloors: 5,
      coveredDrainPct: 90,
      rechargePits: 8,
      obstructionClearPct: 80,
      undergroundUtilPct: 50,
      retrofitPct: 50,
    },
  },
];

export const BLUEPRINT_MAP = Object.fromEntries(BLUEPRINTS.map((b) => [b.id, b]));
