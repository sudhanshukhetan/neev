/**
 * shared/greenfieldEngine.js
 * Pure calculation engine for Plain Land (Greenfield) Construction Studio.
 * Based on CPWD / MoHUA DSR 2023 infrastructure & structural cost norms.
 */

export const INFRASTRUCTURE_TYPES = [
  {
    id: 'highway',
    name: 'Express Highway',
    nameHi: 'एक्सप्रेस हाईवे',
    category: 'transport',
    description: '4/6-lane asphalt carriageway with concrete median divider, LED streetlamps, and roadside storm drainage channels.',
    descriptionHi: '4/6-लेन डामर सड़क, कंक्रीट डिवाइडर, एलईडी स्ट्रीटलाइट्स और तूफानी जल निकासी चैनल।',
    baseCostCr: 14.5,
    costPerAcreCr: 1.8,
    baseMonths: 14,
    monthsPerAcre: 0.25,
    commutersPerAcre: 6000,
    familiesPerAcre: 0,
    nbcBaseScore: 92,
    ecoBaseScore: 78,
    specs: ['4-6 Lanes (3.75m/lane)', 'Crash Barrier Medians', 'LED Solar Streetlighting', 'Reinforced RCC Culverts'],
  },
  {
    id: 'overbridge',
    name: 'Overbridge / Flyover',
    nameHi: 'फ्लाईओवर / ओवरब्रिज',
    category: 'transport',
    description: 'Elevated pre-stressed concrete flyover deck with cylindrical support piers, approach ramps, and 5.5m underpass clearance.',
    descriptionHi: 'पिलर-सपोर्टेड एलिवेटेड कंक्रीट फ्लाईओवर डेक, रैंप और 5.5 मीटर अंडरपास क्लीयरेंस।',
    baseCostCr: 26.0,
    costPerAcreCr: 2.2,
    baseMonths: 18,
    monthsPerAcre: 0.3,
    commutersPerAcre: 8500,
    familiesPerAcre: 0,
    nbcBaseScore: 95,
    ecoBaseScore: 74,
    specs: ['Grade-Separated Deck', '5.5m Clearance Envelope', 'Seismic Dampers', 'Anti-Skid Wearing Coat'],
  },
  {
    id: 'society',
    name: 'Planned Residential Society',
    nameHi: 'नियोजित आवासीय सोसाइटी',
    category: 'housing',
    description: 'Seismic Zone IV/V compliant modern apartment blocks with central landscaped podium, rooftop solar array, and rainwater harvesting pits.',
    descriptionHi: 'भूकंप-रोधी आधुनिक अपार्टमेंट टावर्स, सेंट्रल पार्क, छत पर सोलर पैनल और वर्षा जल संचयन गड्ढे।',
    baseCostCr: 32.0,
    costPerAcreCr: 6.5,
    baseMonths: 22,
    monthsPerAcre: 0.5,
    commutersPerAcre: 1200,
    familiesPerAcre: 180,
    nbcBaseScore: 94,
    ecoBaseScore: 88,
    specs: ['Earthquake-Resistant RCC Frame', 'Dual Plumbing System', 'Rooftop Solar PV Grid', 'Underground Percolation Pits'],
  },
  {
    id: 'house',
    name: 'Modern Independent House Cluster',
    nameHi: 'आधुनिक स्वतंत्र आवास समूह',
    category: 'housing',
    description: 'NBC-compliant independent courtyard (aangan) homes with permeable pavers, thermal mass insulation, and solar rooftop.',
    descriptionHi: 'एनबीसी-अनुरूप आंगन शैली के आधुनिक पक्के घर, पारगम्य फुटपाथ और सोलर छत।',
    baseCostCr: 6.8,
    costPerAcreCr: 1.4,
    baseMonths: 10,
    monthsPerAcre: 0.2,
    commutersPerAcre: 300,
    familiesPerAcre: 35,
    nbcBaseScore: 90,
    ecoBaseScore: 84,
    specs: ['Isolated Footing Foundation', 'Permeable Paver Driveways', 'Aangan Ventilation', 'Solar Net Metering'],
  },
  {
    id: 'park',
    name: 'Community Park & Recharge Zone',
    nameHi: 'सामुदायिक पार्क एवं जल संचयन क्षेत्र',
    category: 'civic',
    description: 'Urban forest with indigenous shade trees (Neem, Gulmohar), walking trail, children play equipment, and percolation retention pond.',
    descriptionHi: 'घने छायादार पेड़, वॉकिंग ट्रैक, बच्चों का खेल क्षेत्र और भूजल पुनर्भरण तलाब।',
    baseCostCr: 2.4,
    costPerAcreCr: 0.6,
    baseMonths: 6,
    monthsPerAcre: 0.15,
    commutersPerAcre: 1500,
    familiesPerAcre: 0,
    nbcBaseScore: 88,
    ecoBaseScore: 98,
    specs: ['Percolation Wetland Basin', 'Native Shaded Tree Canopy', 'Solar Pathway Lights', 'Porous Jogging Track'],
  },
  {
    id: 'health_hub',
    name: 'Primary Health & Civic Hub',
    nameHi: 'प्राथमिक स्वास्थ्य एवं नागरिक केंद्र',
    category: 'civic',
    description: 'Universal-accessible community clinic, diagnostic lab, 24/7 emergency ambulance bay with direct street egress, and solar battery backup.',
    descriptionHi: 'सुलभ प्राथमिक स्वास्थ्य क्लिनिक, आपातकालीन एम्बुलेंस बे और सौर ऊर्जा बैकअप।',
    baseCostCr: 8.5,
    costPerAcreCr: 1.2,
    baseMonths: 12,
    monthsPerAcre: 0.2,
    commutersPerAcre: 2200,
    familiesPerAcre: 0,
    nbcBaseScore: 96,
    ecoBaseScore: 86,
    specs: ['Universal Wheelchair Access', 'Dedicated Ambulance Bay (4.2m)', 'Negative Pressure Ward', 'Rooftop Solar + DG Set'],
  },
];

export const INFRASTRUCTURE_MAP = Object.fromEntries(
  INFRASTRUCTURE_TYPES.map(t => [t.id, t])
);

/**
 * Computes plain land project metrics based on selected infrastructure, acreage, green cover %, and solar %.
 */
export function computeGreenfieldProject({
  selectedIds = ['society', 'park'],
  areaAcres = 5,
  greenPct = 25,
  solarPct = 50,
} = {}) {
  const safeAcres = Math.max(0.5, Math.min(100, Number(areaAcres) || 5));
  const safeGreen = Math.max(5, Math.min(60, Number(greenPct) || 25));
  const safeSolar = Math.max(10, Math.min(100, Number(solarPct) || 50));

  const activeTypes = (selectedIds.length > 0 ? selectedIds : ['society', 'park'])
    .map(id => INFRASTRUCTURE_MAP[id])
    .filter(Boolean);

  if (activeTypes.length === 0) {
    activeTypes.push(INFRASTRUCTURE_MAP.society);
  }

  // Cost aggregation
  let totalCostCr = 0;
  let maxMonths = 0;
  let totalFamilies = 0;
  let totalCommuters = 0;
  let sumNbc = 0;
  let sumEco = 0;

  activeTypes.forEach(t => {
    const itemCost = t.baseCostCr + (t.costPerAcreCr * safeAcres);
    totalCostCr += itemCost;

    const itemMonths = t.baseMonths + (t.monthsPerAcre * safeAcres);
    if (itemMonths > maxMonths) maxMonths = itemMonths;

    totalFamilies += Math.round(t.familiesPerAcre * safeAcres);
    totalCommuters += Math.round(t.commutersPerAcre * (safeAcres / 2));

    sumNbc += t.nbcBaseScore;
    sumEco += t.ecoBaseScore;
  });

  // Green canopy & solar bonus on Eco score
  const avgNbc = Math.round(sumNbc / activeTypes.length);
  let computedEco = Math.round(sumEco / activeTypes.length);
  if (safeGreen > 20) computedEco += Math.min(8, Math.round((safeGreen - 20) * 0.4));
  if (safeSolar > 40) computedEco += Math.min(6, Math.round((safeSolar - 40) * 0.2));
  computedEco = Math.min(100, Math.max(60, computedEco));

  // Cost bounds ±20%
  const costMinCr = Number((totalCostCr * 0.85).toFixed(2));
  const costMaxCr = Number((totalCostCr * 1.2).toFixed(2));
  const finalCostCr = Number(totalCostCr.toFixed(2));
  const finalMonths = Math.round(maxMonths);

  // Phased Milestone Schedule
  const phases = [
    {
      phase: 1,
      title: 'Land Grading, Stormwater Sump & Grounding',
      titleHi: 'भूमि समतलीकरण, जल निकासी और आधार कार्य',
      durationMonths: Math.max(2, Math.round(finalMonths * 0.2)),
      pctBudget: 18,
      costCr: Number((finalCostCr * 0.18).toFixed(2)),
      deliverables: ['Topographic contour grading', 'Percolation retention basin excavation', 'Underground storm trunk lines'],
    },
    {
      phase: 2,
      title: 'Civil Structural Framework & Main Carriageways',
      titleHi: 'मुख्य संरचनात्मक ढांचा और सड़कें',
      durationMonths: Math.max(4, Math.round(finalMonths * 0.45)),
      pctBudget: 50,
      costCr: Number((finalCostCr * 0.50).toFixed(2)),
      deliverables: ['RCC foundations & superstructure pillars', 'Asphalt carriageway & concrete curb stones', 'NBC fire clearance corridors'],
    },
    {
      phase: 3,
      title: 'Underground Utilities, Solar PV & Safety Grids',
      titleHi: 'भूमिगत उपयोगिताएं, सोलर ग्रिड और सुरक्षा प्रणाली',
      durationMonths: Math.max(2, Math.round(finalMonths * 0.25)),
      pctBudget: 22,
      costCr: Number((finalCostCr * 0.22).toFixed(2)),
      deliverables: ['Underground 11kV electrical ducting & fiber', 'Rooftop solar PV installation', 'Hydrant network with 4.5 bar pressure'],
    },
    {
      phase: 4,
      title: 'Landscaping, Quality Audit & Municipal Handover',
      titleHi: 'हरित भूनिर्माण, गुणवत्ता ऑडिट और नगर निकाय को सुपुर्दगी',
      durationMonths: Math.max(1, Math.round(finalMonths * 0.1)),
      pctBudget: 10,
      costCr: Number((finalCostCr * 0.10).toFixed(2)),
      deliverables: ['Tree canopy plantation & walking trails', 'NBC Part 4 Fire Clearance Certificate', 'Municipal occupancy readiness handover'],
    },
  ];

  return {
    areaAcres: safeAcres,
    greenPct: safeGreen,
    solarPct: safeSolar,
    selectedStructures: activeTypes,
    cost: {
      estimateCr: finalCostCr,
      minCr: costMinCr,
      maxCr: costMaxCr,
      formatted: `Rs. ${finalCostCr} Cr`,
      rangeFormatted: `Rs. ${costMinCr} – ${costMaxCr} Cr`,
    },
    timeline: {
      months: finalMonths,
      formatted: `${finalMonths} Months`,
    },
    socialImpact: {
      familiesHoused: totalFamilies,
      commutersServedDaily: totalCommuters,
      civicCoverageResidents: Math.round(totalFamilies * 4.2 + (totalCommuters * 0.4)),
    },
    scores: {
      nbcSafetyScore: avgNbc,
      sustainabilityScore: computedEco,
    },
    phases,
  };
}
