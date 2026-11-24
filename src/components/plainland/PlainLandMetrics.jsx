/**
 * src/components/plainland/PlainLandMetrics.jsx
 * Live Calculation & Phased Milestone Output Panel for the Greenfield Plain-Land Studio.
 * Displays budget in Rs. Cr, timeline in months, families benefited, commuters served,
 * NBC safety rating, and 4-phase implementation schedule.
 */

import React from 'react';
import {
  Coins, Calendar, Users, ShieldCheck, Leaf,
  FileDown, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';
import { useNeevStore } from '../../store/useNeevStore.js';
import useT from '../../i18n/useT.js';
import { exportDprPdf } from '../../lib/pdf.js';

export default function PlainLandMetrics() {
  const t = useT();
  const {
    plainLandMetrics,
    plainLand,
    lang,
    showToast,
    selectedCoordinates,
    locationIntel,
  } = useNeevStore();

  const m = plainLandMetrics;
  if (!m) return null;

  const handleDownloadPdf = async () => {
    try {
      showToast('Generating Greenfield DPR PDF…');
      await exportDprPdf({
        mode: 'plain',
        greenfield: m,
        coordinates: selectedCoordinates,
        location: locationIntel?.location,
        weather: locationIntel?.weather,
        aqi: locationIntel?.aqi,
        lang,
      });
      showToast('Greenfield DPR PDF downloaded.');
    } catch (err) {
      console.error('[neev] PDF export error:', err);
      showToast('PDF generation failed: ' + err.message);
    }
  };

  return (
    <div className="bg-white border-l border-line p-4 overflow-y-auto space-y-5 font-ui select-none h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div>
          <div className="text-2xs font-mono uppercase tracking-widest text-emerald-600 font-semibold">
            {t('sheet_no')} • {t('sheet_scale')}
          </div>
          <h2 className="text-sm font-semibold font-heading text-ink mt-0.5 tracking-tight">
            Greenfield Feasibility Summary
          </h2>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>DPR PDF</span>
        </button>
      </div>

      {/* 4 Big Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 font-mono">
        {/* Cost Card */}
        <div className="p-3 rounded bg-paper border border-line">
          <div className="text-[10px] text-muted uppercase tracking-wider flex items-center gap-1">
            <Coins className="w-3 h-3 text-emerald-600" /> {t('plain_est_cost')}
          </div>
          <div className="text-lg font-bold font-heading text-emerald-700 mt-1">
            {m.cost.formatted}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Range: {m.cost.rangeFormatted}
          </div>
        </div>

        {/* Timeline Card */}
        <div className="p-3 rounded bg-paper border border-line">
          <div className="text-[10px] text-muted uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-600" /> {t('plain_est_timeline')}
          </div>
          <div className="text-lg font-bold font-heading text-ink mt-1">
            {m.timeline.formatted}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            4-Phase Delivery
          </div>
        </div>

        {/* Social Impact: Families & Commuters */}
        <div className="p-3 rounded bg-paper border border-line">
          <div className="text-[10px] text-muted uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3 text-indigo-600" /> Beneficiaries
          </div>
          <div className="text-sm font-bold font-heading text-ink mt-1">
            {m.socialImpact.familiesHoused.toLocaleString()} Families
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            +{m.socialImpact.commutersServedDaily.toLocaleString()} daily commuters
          </div>
        </div>

        {/* Scores Card: NBC & Sustainability */}
        <div className="p-3 rounded bg-paper border border-line flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> NBC Safety
            </span>
            <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-1 rounded">
              {m.scores.nbcSafetyScore}/100
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-line">
            <span className="text-[10px] text-muted uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3 h-3 text-teal-600" /> Eco Rating
            </span>
            <span className="font-bold text-xs text-teal-700 bg-teal-50 px-1 rounded">
              {m.scores.sustainabilityScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Selected Structures List */}
      <div className="space-y-2">
        <div className="text-2xs font-mono uppercase tracking-widest text-muted font-semibold">
          Active Structural Components ({m.selectedStructures.length})
        </div>
        <div className="space-y-1.5">
          {m.selectedStructures.map((s) => (
            <div
              key={s.id}
              className="p-2 rounded bg-paper border border-line text-xs flex items-center justify-between"
            >
              <div className="font-medium text-slate-800">
                {lang === 'hi' ? s.nameHi : s.name}
              </div>
              <div className="font-mono text-[11px] text-emerald-700 font-semibold">
                Rs. {(s.baseCostCr + s.costPerAcreCr * m.areaAcres).toFixed(1)} Cr
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phased Construction Gantt & Deliverables */}
      <div className="space-y-2 pt-2 border-t border-line">
        <div className="text-2xs font-mono uppercase tracking-widest text-muted font-semibold flex items-center justify-between">
          <span>Phased Implementation Plan</span>
          <span>Budget Split</span>
        </div>

        <div className="space-y-2">
          {m.phases.map((ph) => (
            <div key={ph.phase} className="p-2.5 rounded bg-paper border border-line text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Phase {ph.phase}: {lang === 'hi' ? ph.titleHi : ph.title}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-700">
                  Rs. {ph.costCr} Cr ({ph.pctBudget}%)
                </span>
              </div>
              <div className="text-[10px] font-mono text-muted">
                Duration: {ph.durationMonths} Months
              </div>
              <ul className="text-[10px] text-slate-600 space-y-0.5 pt-0.5 list-disc list-inside">
                {ph.deliverables.map((d, idx) => (
                  <li key={idx} className="truncate">{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
