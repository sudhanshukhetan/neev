/**
 * client/src/lib/pdf.js
 * Municipal DPR PDF export using jsPDF + jspdf-autotable.
 * A4 format, English only (note re: Devanagari glyph absence).
 * Uses "Rs." as rupee fallback since Devanagari font is not embedded.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ASSUMPTIONS_LIST, DEFAULT_ASSUMPTIONS } from '@shared/assumptions.js';
import { computeMetrics } from '@shared/engine.js';

function formatDate() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function fmtCost(v) {
  return v != null ? `Rs. ${Number(v).toFixed(1)} Cr` : '-';
}

export async function generateDPR({ baseline, levers, assumptions, planned, activePreset }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210;
  const marginL = 18;
  const marginR = 18;
  const contentW = W - marginL - marginR;
  let y = 18;

  const addHeader = (page = 1) => {
    // Header band
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('NEEV — Urban Pre-Feasibility Simulator', marginL, 9);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.text(`NEEV-01  |  1:500  |  ${formatDate()}  |  Page ${page}`, W - marginR, 9, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const addFooter = () => {
    doc.setTextColor(100, 116, 139);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text(
      'PRE-FEASIBILITY SCREENING — NOT A STATUTORY APPROVAL, STRUCTURAL CERTIFICATION, OR ENGINEERING DESIGN.',
      W / 2, 290, { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  const title = (txt, size = 13) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.setTextColor(15, 23, 42);
    doc.text(txt, marginL, y);
    y += 6;
  };

  const body = (txt, size = 9) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(txt, contentW);
    doc.text(lines, marginL, y);
    y += lines.length * 4.5 + 1;
  };

  const rule = () => {
    doc.setDrawColor(226, 232, 240);
    doc.line(marginL, y, W - marginR, y);
    y += 4;
  };

  // ── Page 1: Cover ──────────────────────────────────────────────────────────
  addHeader(1);
  y = 22;

  title('MUNICIPAL PRE-FEASIBILITY REPORT', 16);
  body('Urban Redevelopment & Civic Infrastructure Screening', 10);
  rule();

  if (activePreset) {
    title('Site', 11);
    body(`${activePreset.name}`);
    body(`Ward / Location: ${activePreset.ward || '—'}`);
    if (activePreset.description) body(activePreset.description);
    rule();
  }

  title('Site Baseline', 11);
  if (baseline) {
    doc.autoTable({
      startY: y,
      margin: { left: marginL, right: marginR },
      head: [['Parameter', 'Value', 'Source', 'Confidence']],
      body: [
        ['Lane Width', `${baseline.laneWidthM} m`, baseline.source, `${Math.round((baseline.confidence?.laneWidthM || 0.5) * 100)}%`],
        ['Obstruction in Carriageway', `${baseline.obstructionM} m`, baseline.source, `${Math.round((baseline.confidence?.obstructionM || 0.5) * 100)}%`],
        ['Drain Condition', baseline.drainCondition, baseline.source, `${Math.round((baseline.confidence?.drainCondition || 0.5) * 100)}%`],
        ['Green Cover', `${baseline.greenPct}%`, baseline.source, `${Math.round((baseline.confidence?.greenPct || 0.5) * 100)}%`],
        ['Average Floors', baseline.floorsAvg, baseline.source, `${Math.round((baseline.confidence?.floorsAvg || 0.5) * 100)}%`],
        ['Overhead Wires', baseline.wiresVisible ? 'Visible' : 'None', baseline.source, `${Math.round((baseline.confidence?.wiresVisible || 0.5) * 100)}%`],
        ['Building Condition Score', `${baseline.buildingConditionScore} / 100`, baseline.source, `${Math.round((baseline.confidence?.buildingConditionScore || 0.5) * 100)}%`],
      ],
      styles: { font: 'courier', fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  rule();
  title('Intervention Levers (Planned State)', 11);
  doc.autoTable({
    startY: y,
    margin: { left: marginL, right: marginR },
    head: [['Lever', 'Value', 'Unit']],
    body: [
      ['Road Width (RoW)', levers.roadWidthM, 'm'],
      ['Footpath Width (each side)', levers.footpathM, 'm'],
      ['Obstruction Cleared', levers.obstructionClearPct, '%'],
      ['Covered & Maintained Drain', levers.coveredDrainPct, '%'],
      ['Recharge Pits', levers.rechargePits, '/100m'],
      ['Green Cover', levers.greenPct, '%'],
      ['Max Floors / FAR Cap', levers.maxFloors, 'fl'],
      ['Seismic Retrofit', levers.retrofitPct, '%'],
      ['Utilities Undergrounded', levers.undergroundUtilPct, '%'],
    ],
    styles: { font: 'courier', fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });
  y = doc.lastAutoTable.finalY + 6;

  addFooter();

  // ── Page 2: Before/After Metrics ───────────────────────────────────────────
  doc.addPage();
  addHeader(2);
  y = 22;

  title('Before / After Impact', 13);
  rule();

  if (planned) {
    const current = useNeevStoreBefore(baseline, levers, assumptions);
    doc.autoTable({
      startY: y,
      margin: { left: marginL, right: marginR },
      head: [['Metric', 'Before (Current)', 'After (Planned)', 'Change']],
      body: [
        ['Emergency Response Time', `${current?.responseMin ?? '-'} min`, `${planned.responseMin} min`,
          delta(current?.responseMin, planned.responseMin, true) + ' min'],
        ['Flood Risk', `${current?.floodRiskPct ?? '-'}%`, `${planned.floodRiskPct}%`,
          delta(current?.floodRiskPct, planned.floodRiskPct, true) + '%'],
        ['Flood Depth (Peak)', `${current?.floodDepthCm ?? '-'} cm`, `${planned.floodDepthCm} cm`,
          delta(current?.floodDepthCm, planned.floodDepthCm, true) + ' cm'],
        ['Structural Safety Index', `${current?.safetyIndex ?? '-'} / 100`, `${planned.safetyIndex} / 100`,
          delta(current?.safetyIndex, planned.safetyIndex, false) + ' pts'],
        ['Heat Island Index', `${current?.heatIndex ?? '-'}`, `${planned.heatIndex}`,
          delta(current?.heatIndex, planned.heatIndex, true)],
        ['Cost (Mid, +/-40%)', '—', fmtCost(planned.costMidCr), `(${fmtCost(planned.costLowCr)} to ${fmtCost(planned.costHighCr)})`],
      ],
      styles: { font: 'courier', fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  rule();
  title('Screening Checks', 11);

  if (planned?.screening) {
    doc.autoTable({
      startY: y,
      margin: { left: marginL, right: marginR },
      head: [['Check', 'Value', 'Threshold', 'Status', 'Basis']],
      body: planned.screening.map((c) => [
        c.label,
        `${typeof c.value === 'number' ? c.value.toFixed(1) : c.value} ${c.unit}`,
        `${typeof c.threshold === 'number' ? c.threshold.toFixed(1) : c.threshold} ${c.unit}`,
        c.status.toUpperCase(),
        c.basis,
      ]),
      styles: { font: 'courier', fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 4: { cellWidth: 50 } },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  addFooter();

  // ── Page 3: Method & Assumptions ──────────────────────────────────────────
  doc.addPage();
  addHeader(3);
  y = 22;

  title('Method & Assumptions', 13);
  body('All formulas are listed below with the specific assumption values used. Assumptions marked with (*) were modified from the default.', 8);
  rule();

  // Key formulas
  title('Key Formulas', 10);
  const formulas = [
    ['Fire Response', 'clearWidth = roadWidth - 2*footpath - obstruction*(1-obstructionClearPct/100)'],
    ['', 'speed = vMin + (vMax-vMin) * smoothstep(clearWidth, wLow, wHigh)'],
    ['', 'responseMin = (distanceKm/speed)*60 + dispatchMin [+ blockedDelayMin if blocked]'],
    ['Flood Depth', 'runoffC = cBase - cGreen*greenPct - cRecharge*rechargePits (clamp cMin..0.95)'],
    ['', 'drainCapacity = drainCapBase * blend(drainFactor, drainCovered, coveredDrainPct/100)'],
    ['', 'floodDepth = kPond * max(0, inflow-drainCapacity) * stormHours / pondAreaFactor'],
    ['Safety Index', 'safety = conditionScore + retrofitGain*(retrofitPct/100) - floorPenalty*excessFloors + roadBonus'],
    ['Cost (±40%)', 'midCr = sum of unit rates * quantities | low=0.6*mid | high=1.4*mid'],
  ];

  doc.autoTable({
    startY: y,
    margin: { left: marginL, right: marginR },
    head: [['Component', 'Formula']],
    body: formulas,
    styles: { font: 'courier', fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
  });
  y = doc.lastAutoTable.finalY + 6;

  rule();
  title('Assumption Values', 10);

  // Figure out overrides
  const overrideIds = new Set(
    ASSUMPTIONS_LIST
      .filter((a) => assumptions[a.id] !== DEFAULT_ASSUMPTIONS[a.id])
      .map((a) => a.id)
  );

  doc.autoTable({
    startY: y,
    margin: { left: marginL, right: marginR },
    head: [['Assumption', 'Value', 'Unit', 'Default', 'Modified']],
    body: ASSUMPTIONS_LIST.map((a) => [
      a.label,
      assumptions[a.id],
      a.unit || '-',
      DEFAULT_ASSUMPTIONS[a.id],
      overrideIds.has(a.id) ? '*' : '',
    ]),
    styles: { font: 'courier', fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  addFooter();

  // ── Page 4: Disclaimer ────────────────────────────────────────────────────
  doc.addPage();
  addHeader(4);
  y = 22;

  title('Important Disclaimer', 13);
  rule();
  body(`
PRE-FEASIBILITY SCREENING DOCUMENT

This report has been generated by Neev, an Urban Redevelopment Pre-Feasibility Simulator, for preliminary discussion purposes only.

This document IS NOT:
- A statutory planning approval or clearance
- A structural engineering certification
- An NBC 2016 compliance certificate
- A formal engineering design

This document IS:
- A screening tool based on simplified formulas and estimated inputs
- Subject to +-40% cost uncertainty bands
- Dependent on baseline inputs that must be verified on-site

ACTIONS REQUIRED BEFORE ANY INVESTMENT OR REGULATORY SUBMISSION:
1. Verify all baseline inputs (road width, obstruction, drain condition, floor count, building condition) through direct site survey.
2. Obtain structural assessment from a licensed structural engineer.
3. Cross-check all screening results against NBC 2016, applicable state bye-laws, and IS codes.
4. Engage a licensed town planner / urban designer for formal DPR preparation.
5. Submit for formal planning approval through the appropriate Urban Local Body.

COST ESTIMATES:
All costs carry a +-40% uncertainty band. They do not include land acquisition, displacement/rehabilitation, or regulatory compliance costs. Obtain detailed estimates from licensed quantity surveyors.

NOTE ON LANGUAGE:
This report is in English. Currency is expressed as "Rs." (rupees) since the Devanagari font is not embedded. Numbers are in Indian notation (Crore = 10 million).

Generated: ${formatDate()}
Neev v1.0.0 | Pre-feasibility Screening Tool | India
  `.trim());

  addFooter();

  doc.save('Neev_Municipal_DPR.pdf');
}

// Helper to compute "current" metrics for PDF
function useNeevStoreBefore(baseline, levers, assumptions) {
  if (!baseline) return null;
  try {
    return computeMetrics({ baseline, levers, assumptions, stage: 'current' });
  } catch {
    return null;
  }
}

function delta(before, after, lowerIsBetter = true) {
  if (before == null || after == null) return '';
  const d = after - before;
  const sign = d < 0 ? '-' : '+';
  return `${sign}${Math.abs(d).toFixed(1)}`;
}
