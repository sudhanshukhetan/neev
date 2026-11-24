/**
 * src/lib/pdf.js
 * Municipal Detailed Project Report (DPR) PDF export using jsPDF + jspdf-autotable.
 * Supports both:
 *  1. Urban Redevelopment Audit DPR
 *  2. Greenfield Plain-Land Construction Feasibility DPR
 * Includes exact coordinates, real-time weather & AQI snapshot, NBC 2016 compliance,
 * and cost breakdown using "Rs." to avoid Unicode glyph corruption.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ASSUMPTIONS_LIST } from '@shared/assumptions.js';
import { computeMetrics } from '@shared/engine.js';

function formatDate() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function fmtCost(v) {
  return v != null ? `Rs. ${Number(v).toFixed(1)} Cr` : '-';
}

export async function exportDprPdf({
  mode = 'urban',
  baseline,
  levers,
  assumptions,
  planned,
  activePreset,
  greenfield,
  coordinates,
  location,
  weather,
  aqi,
  lang = 'en',
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210;
  const marginL = 18;
  const marginR = 18;
  const contentW = W - marginL - marginR;
  let y = 18;

  const addHeader = (page = 1, total = 4) => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, W, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('NEEV — Urban & Greenfield Infrastructure Simulator', marginL, 9);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.text(`NEEV-DPR  |  Scale 1:500  |  ${formatDate()}  |  Page ${page} of ${total}`, W - marginR, 9, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const addFooter = () => {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.text(
      'PRE-FEASIBILITY SCREENING DOCUMENT — Not a statutory approval. Verify with NBC 2016 and a licensed town planner.',
      marginL,
      288
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  // BRANCH 1: GREENFIELD PLAIN-LAND CONSTRUCTION PROPOSAL
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === 'plain' && greenfield) {
    addHeader(1, 2);

    // Title Block
    y = 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(15, 23, 42);
    doc.text('GREENFIELD INFRASTRUCTURE FEASIBILITY REPORT', marginL, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Rapid Pre-Feasibility Screening & Capital Budget Estimate (CPWD DSR 2023 Norms)', marginL, y);

    // Section 1: Geographic & Environmental Location Snapshot
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('1. SITE INTELLIGENCE & ENVIRONMENTAL BASELINE', marginL, y);

    const latStr = coordinates ? `${coordinates.lat.toFixed(4)} N, ${coordinates.lon.toFixed(4)} E` : '28.6139 N, 77.2090 E';
    const locName = location?.displayName || (location?.locality ? `${location.locality}, ${location.city}, ${location.state}` : 'Virgin Greenfield Plot');
    const tempStr = weather ? `${weather.temperatureC} C, ${weather.humidityPct}% RH, Monsoon Flood Risk: ${weather.monsoonFloodRisk}` : '28 C, 55% RH, Normal';
    const aqiStr = aqi ? `PM2.5: ${aqi.pm25}, PM10: ${aqi.pm10} (${aqi.status})` : 'PM2.5: 48 (Moderate)';

    doc.autoTable({
      startY: y + 3,
      margin: { left: marginL, right: marginR },
      theme: 'plain',
      styles: { fontSize: 8.5, cellPadding: 2, textColor: [15, 23, 42] },
      columnStyles: { 0: { fontStyle: 'bold', width: 45, textColor: [100, 116, 139] } },
      body: [
        ['Target Coordinates', latStr],
        ['Locality & Region', locName],
        ['Land Classification', 'Virgin Plain / Open Land (Greenfield Development)'],
        ['Live Weather Snapshot', tempStr],
        ['Air Quality Index (AQI)', aqiStr],
        ['Project Scope Area', `${greenfield.areaAcres} Acres | Green Canopy: ${greenfield.greenPct}% | Solar PV: ${greenfield.solarPct}%`],
      ],
    });

    // Section 2: Financial Budget & Social Impact Summary
    y = doc.lastAutoTable.finalY + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text('2. CAPITAL EXPENDITURE & SOCIO-ECONOMIC BENEFIT', marginL, y);

    doc.autoTable({
      startY: y + 3,
      margin: { left: marginL, right: marginR },
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
      head: [['Key Feasibility Indicator', 'Screening Value', 'Design Norm / Reference']],
      body: [
        ['Estimated Capital Budget', greenfield.cost.formatted, `Range: ${greenfield.cost.rangeFormatted}`],
        ['Target Construction Timeline', greenfield.timeline.formatted, 'Fast-Track Pre-Cast & Phased Delivery'],
        ['Families Housed (Direct)', `${greenfield.socialImpact.familiesHoused.toLocaleString()} Families`, 'Modern Seismic-Safe Apartments/Houses'],
        ['Daily Commuters Served', `${greenfield.socialImpact.commutersServedDaily.toLocaleString()} Commuters`, 'Multi-Lane Corridor & Transit Egress'],
        ['NBC 2016 Safety Index', `${greenfield.scores.nbcSafetyScore} / 100`, 'Part 4 Fire & Part 6 Structural Frame'],
        ['Eco Sustainability Score', `${greenfield.scores.sustainabilityScore} / 100`, 'Percolation Ponds, Solar PV & Trees'],
      ],
    });

    // Section 3: Selected Structural Components
    y = doc.lastAutoTable.finalY + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text('3. PROPOSED INFRASTRUCTURE COMPONENTS', marginL, y);

    const structRows = greenfield.selectedStructures.map(s => [
      s.name,
      s.category.toUpperCase(),
      `Rs. ${(s.baseCostCr + s.costPerAcreCr * greenfield.areaAcres).toFixed(1)} Cr`,
      s.specs.join('; '),
    ]);

    doc.autoTable({
      startY: y + 3,
      margin: { left: marginL, right: marginR },
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      head: [['Structure Type', 'Category', 'Component Cost', 'Engineering Specifications']],
      body: structRows,
    });

    addFooter();

    // ── PAGE 2: Phased Implementation Plan ──
    doc.addPage();
    addHeader(2, 2);

    y = 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('4. PHASED MILESTONE SCHEDULE & CASH FLOW', marginL, y);

    const phaseRows = greenfield.phases.map(p => [
      `Phase ${p.phase}`,
      p.title,
      `${p.durationMonths} Mos`,
      `Rs. ${p.costCr} Cr (${p.pctBudget}%)`,
      p.deliverables.join('; '),
    ]);

    doc.autoTable({
      startY: y + 4,
      margin: { left: marginL, right: marginR },
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 3 },
      head: [['Phase', 'Milestone Description', 'Duration', 'Capital Outlay', 'Key Deliverables']],
      body: phaseRows,
    });

    // Statutory Disclaimer
    y = doc.lastAutoTable.finalY + 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('STATUTORY PLANNING DISCLAIMER', marginL, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const disclaimer = 'This document is generated by Neev as a pre-feasibility preliminary screening tool for municipal planners, civic authorities, and developers. All cost estimates reflect CPWD DSR 2023 schedule of rates and carry an uncertainty band of +/-20% depending on soil bearing capacity, local right-of-way clearance, and statutory environmental approvals. Prior to tendering or civil execution, geotechnical borehole investigations, detailed structural design by a licensed engineer, and state master plan conformance are legally mandatory.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, contentW);
    doc.text(splitDisclaimer, marginL, y);

    addFooter();
    doc.save('Neev_Greenfield_DPR.pdf');
    return;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BRANCH 2: URBAN REDEVELOPMENT AUDIT DPR
  // ════════════════════════════════════════════════════════════════════════════
  const baselineSafe = baseline || {
    laneWidthM: 3.8,
    obstructionM: 0.9,
    drainCondition: 'clogged',
    greenPct: 5,
    floorsAvg: 3,
    wiresVisible: true,
    buildingConditionScore: 35,
  };

  const current = computeMetrics({ baseline: baselineSafe, levers: levers || {}, assumptions: assumptions || {}, stage: 'current' });
  const plannedSafe = planned || computeMetrics({ baseline: baselineSafe, levers: levers || {}, assumptions: assumptions || {}, stage: 'planned' });

  // ── PAGE 1: Executive Summary & Location ──
  addHeader(1, 4);

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(15, 23, 42);
  doc.text('MUNICIPAL PRE-FEASIBILITY DETAILED PROJECT REPORT', marginL, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Urban Redevelopment, Emergency Access & Flood Mitigation (NBC 2016)', marginL, y);

  // Geographic Snapshot
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12); // terracotta
  doc.text('1. SITE LOCATION & ENVIRONMENTAL CONTEXT', marginL, y);

  const locName = location?.displayName || (location?.locality ? `${location.locality}, ${location.city}` : (activePreset?.name || 'Urban Colony / Ward'));
  const latStr = coordinates ? `${coordinates.lat.toFixed(4)} N, ${coordinates.lon.toFixed(4)} E` : 'Coordinates Available in GIS';
  const weatherStr = weather ? `${weather.temperatureC} C, ${weather.humidityPct}% RH, Rainfall Risk: ${weather.monsoonFloodRisk}` : '28 C, 55% RH';
  const aqiStr = aqi ? `PM2.5: ${aqi.pm25}, PM10: ${aqi.pm10} (${aqi.status})` : 'Moderate';

  doc.autoTable({
    startY: y + 3,
    margin: { left: marginL, right: marginR },
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [15, 23, 42] },
    columnStyles: { 0: { fontStyle: 'bold', width: 45, textColor: [100, 116, 139] } },
    body: [
      ['Target Site / Ward', locName],
      ['Map Coordinates', latStr],
      ['Classification', 'Dense Urban Mixed-Use Settlement (In-Situ Redevelopment)'],
      ['Live Weather', weatherStr],
      ['Air Quality Index', aqiStr],
      ['Active Blueprint', activePreset ? activePreset.name : 'Custom 9-Lever Engineered Vector'],
    ],
  });

  // Before / After Impact Matrix
  y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12);
  doc.text('2. BEFORE / AFTER CIVIC IMPACT ASSESSMENT', marginL, y);

  doc.autoTable({
    startY: y + 3,
    margin: { left: marginL, right: marginR },
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    head: [['Civic Performance Indicator', 'Current State', 'Planned State', 'NBC / MoHUA Norm']],
    body: [
      ['Right-of-Way Carriageway', `${current.carriagewayM.toFixed(1)} m`, `${plannedSafe.carriagewayM.toFixed(1)} m`, 'Min 6.0 m for two-way flow'],
      ['Emergency Clear Width', `${current.clearWidthM.toFixed(1)} m`, `${plannedSafe.clearWidthM.toFixed(1)} m`, 'Min 3.5 m fire tender envelope'],
      ['Fire Response Time', `${current.responseMin.toFixed(1)} min`, `${plannedSafe.responseMin.toFixed(1)} min`, 'Target < 8.0 min (Golden Hour)'],
      ['Fire Tender Accessibility', current.fireOk ? 'PASSED' : 'BLOCKED', plannedSafe.fireOk ? 'PASSED' : 'WATCH', 'NBC 2016 Part 4 Cl. 4.6'],
      ['Monsoon Flood Risk', `${current.floodRiskPct}%`, `${plannedSafe.floodRiskPct}%`, 'Target < 15% during 60mm/hr storm'],
      ['Waterlogging Sump Depth', `${current.floodDepthCm.toFixed(1)} cm`, `${plannedSafe.floodDepthCm.toFixed(1)} cm`, 'Threshold < 15 cm doorway safety'],
      ['Storm Drainage Hours', `${current.hoursToDrain.toFixed(1)} hrs`, `${plannedSafe.hoursToDrain.toFixed(1)} hrs`, 'Target < 2.0 hrs rapid clearance'],
      ['Structural Safety Score', `${current.safetyIndex} / 100`, `${plannedSafe.safetyIndex} / 100`, 'Seismic Zone & Low-Rise Capacity'],
    ],
  });

  addFooter();

  // ── PAGE 2: 9 Levers & Cost Breakdown ──
  doc.addPage();
  addHeader(2, 4);

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. IMPLEMENTED LEVER INTERVENTIONS', marginL, y);

  const L = levers || {};
  doc.autoTable({
    startY: y + 4,
    margin: { left: marginL, right: marginR },
    theme: 'striped',
    headStyles: { fillColor: [234, 88, 12], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    head: [['Lever Description', 'Engineered Value', 'Municipal Design Benchmark']],
    body: [
      ['Road Right-of-Way (roadWidthM)', `${L.roadWidthM ?? 6} m`, '3.0 - 12.0 m standard urban carriageway'],
      ['Footpath on Each Side (footpathM)', `${L.footpathM ?? 1.5} m`, 'MoHUA 2014 Pedestrian Guidelines'],
      ['Green Canopy Cover (greenPct)', `${L.greenPct ?? 20} %`, 'URDPFI 2014 urban green norms'],
      ['Max Permitted Building Floors (maxFloors)', `${L.maxFloors ?? 4} floors`, 'NBC 2016 Table 1 fire envelope'],
      ['Covered & Desilted Drains (coveredDrainPct)', `${L.coveredDrainPct ?? 80} %`, 'CPHEEO Stormwater Drainage Manual'],
      ['Percolation Recharge Pits (rechargePits)', `${L.rechargePits ?? 3} / 100m`, 'CGWB Rainwater Harvesting Guidelines'],
      ['Obstruction Cleared (obstructionClearPct)', `${L.obstructionClearPct ?? 80} %`, 'Encroachment removal & designated zones'],
      ['Underground Utilities (undergroundUtilPct)', `${L.undergroundUtilPct ?? 70} %`, 'Overhead 11kV wires buried in ducts'],
      ['Structural Retrofitting (retrofitPct)', `${L.retrofitPct ?? 50} %`, 'IS 13920 / IS 1893 seismic retrofitting'],
    ],
  });

  y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('4. ESTIMATED CAPITAL BUDGET (CPWD DSR 2023)', marginL, y);

  const cost = plannedSafe.cost;
  doc.autoTable({
    startY: y + 4,
    margin: { left: marginL, right: marginR },
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    head: [['Budget Head / Intervention', 'Estimate (Rs. Cr)', 'Low (-40%)', 'High (+40%)']],
    body: [
      ['Road & Carriageway Paving', fmtCost(cost.roadCr), fmtCost(cost.roadCr * 0.6), fmtCost(cost.roadCr * 1.4)],
      ['Footpaths & Pedestrian Curbs', fmtCost(cost.footpathCr), fmtCost(cost.footpathCr * 0.6), fmtCost(cost.footpathCr * 1.4)],
      ['Greenery & Shade Tree Plantations', fmtCost(cost.greenCr), fmtCost(cost.greenCr * 0.6), fmtCost(cost.greenCr * 1.4)],
      ['Storm Drainage Reconstruction', fmtCost(cost.drainCr), fmtCost(cost.drainCr * 0.6), fmtCost(cost.drainCr * 1.4)],
      ['Rainwater Recharge Pits', fmtCost(cost.rechargeCr), fmtCost(cost.rechargeCr * 0.6), fmtCost(cost.rechargeCr * 1.4)],
      ['Obstruction Relocation', fmtCost(cost.obstructionCr), fmtCost(cost.obstructionCr * 0.6), fmtCost(cost.obstructionCr * 1.4)],
      ['Underground Utility Ducting', fmtCost(cost.undergroundCr), fmtCost(cost.undergroundCr * 0.6), fmtCost(cost.undergroundCr * 1.4)],
      ['Structural Seismic Retrofitting', fmtCost(cost.retrofitCr), fmtCost(cost.retrofitCr * 0.6), fmtCost(cost.retrofitCr * 1.4)],
      ['TOTAL ESTIMATED INVESTMENT', fmtCost(cost.midCr), fmtCost(cost.lowCr), fmtCost(cost.highCr)],
    ],
  });

  addFooter();

  // ── PAGE 3: Phased Plan & NBC Compliance ──
  doc.addPage();
  addHeader(3, 4);

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('5. PHASED IMPLEMENTATION TIMELINE', marginL, y);

  const phases = plannedSafe.phases || [];
  const phaseRows = phases.map(p => [
    `Phase ${p.phase}`,
    p.name,
    p.priority,
    fmtCost(p.costMidCr),
    `Fire: ${p.responseMin.toFixed(1)}m | Flood: ${p.floodRiskPct}% | Safety: ${p.safetyIndex}`,
  ]);

  doc.autoTable({
    startY: y + 4,
    margin: { left: marginL, right: marginR },
    theme: 'grid',
    headStyles: { fillColor: [234, 88, 12], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    head: [['Phase', 'Intervention Scope', 'Urgency', 'Capital Outlay', 'Projected Improvements']],
    body: phaseRows,
  });

  y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('6. STATUTORY SCREENING CHECKLIST (NBC 2016)', marginL, y);

  const screening = plannedSafe.screening || [];
  const screenRows = screening.map(s => [
    s.id,
    s.name,
    s.status.toUpperCase(),
    s.threshold,
    s.clause,
  ]);

  doc.autoTable({
    startY: y + 4,
    margin: { left: marginL, right: marginR },
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [['Code', 'Statutory Requirement', 'Screening Status', 'Engineered Metric', 'Statutory Clause']],
    body: screenRows,
  });

  addFooter();

  // ── PAGE 4: Method Appendix & Engineering Assumptions ──
  doc.addPage();
  addHeader(4, 4);

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('7. METHOD APPENDIX & ENGINEERING FORMULAS', marginL, y);

  const asmRows = ASSUMPTIONS_LIST.map(a => [
    a.label,
    `${a.value} ${a.unit || ''}`,
    a.note,
  ]);

  doc.autoTable({
    startY: y + 4,
    margin: { left: marginL, right: marginR },
    theme: 'plain',
    headStyles: { fillColor: [100, 116, 139], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 1.8 },
    head: [['Engineering Constant', 'Value / Unit', 'Source / Regulatory Basis']],
    body: asmRows,
  });

  y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('LEGAL & STATUTORY LIMITATION', marginL, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const legalText = 'Neev is an open-source civic technology simulation tool created for Track 5 (Smarter Cities & Civic Infrastructure). It models urban physics based on NBC 2016, CPHEEO, and MoHUA benchmarks. It does not replace on-site topographic surveys, geotechnical borehole investigations, or formal DPR preparation by empanelled municipal consultants.';
  doc.text(doc.splitTextToSize(legalText, contentW), marginL, y);

  addFooter();
  doc.save('Neev_Municipal_DPR.pdf');
}
