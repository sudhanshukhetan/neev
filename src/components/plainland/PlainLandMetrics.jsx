/**
 * src/components/plainland/PlainLandMetrics.jsx
 * Live Calculation & Phased Milestone Output Panel for the Greenfield Plain-Land Studio.
 * Displays budget in Rs. Cr, timeline in months, families benefited, commuters served,
 * NBC safety rating, and 4-phase implementation schedule.
 * Styled in Constructive-inspired obsidian glass HUD aesthetic.
 */

import React from 'react';
import {
  Coins, Calendar, Users, ShieldCheck, Leaf,
  FileDown, ChevronRight, Sparkles, Building2
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
    <div className="p-4 overflow-y-auto space-y-5 font-ui select-none h-full text-slate-100 hud-scroll">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="text-2xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            FEASIBILITY HUD
          </div>
          <h2 className="text-base font-semibold font-heading text-white mt-0.5 tracking-tight">
            Greenfield Analysis
          </h2>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg glow-emerald transition-all"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>DPR PDF</span>
        </button>
      </div>

      {/* 4 Big Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 font-mono">
        {/* Cost Card */}
        <div className="hud-card p-3 border-emerald-500/30 bg-emerald-950/30 glow-emerald">
          <div className="text-[10px] text-emerald-300 uppercase tracking-wider flex items-center gap-1 font-semibold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" /> {t('plain_est_cost')}
          </div>
          <div className="text-lg font-bold font-heading text-white mt-1">
            {m.cost.formatted}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {m.cost.rangeFormatted}
          </div>
        </div>

        {/* Timeline Card */}
        <div className="hud-card p-3 border-cyan-500/30 bg-cyan-950/30 glow-cyan">
          <div className="text-[10px] text-cyan-300 uppercase tracking-wider flex items-center gap-1 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {t('plain_est_timeline')}
          </div>
          <div className="text-lg font-bold font-heading text-white mt-1">
            {m.timeline.formatted}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            4-Phase Delivery
          </div>
        </div>

        {/* Social Impact: Families & Commuters */}
        <div className="hud-card p-3 border-amber-500/30 bg-amber-950/30 glow-amber">
          <div className="text-[10px] text-amber-300 uppercase tracking-wider flex items-center gap-1 font-semibold">
            <Users className="w-3.5 h-3.5 text-amber-400" /> Beneficiaries
          </div>
          <div className="text-sm font-bold font-heading text-white mt-1">
            {m.socialImpact.familiesHoused.toLocaleString()} Families
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            +{m.socialImpact.commutersServedDaily.toLocaleString()} daily commuters
          </div>
        </div>

        {/* Scores Card: NBC & Sustainability */}
        <div className="hud-card p-3 border-white/10 bg-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> NBC Safety
            </span>
            <span className="font-bold text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.2 rounded">
              {m.scores.nbcSafetyScore}/100
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-teal-400" /> Eco Rating
            </span>
            <span className="font-bold text-xs text-teal-300 bg-teal-950/80 border border-teal-500/40 px-1.5 py-0.2 rounded">
              {m.scores.sustainabilityScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Selected Structures List */}
      <div className="space-y-2">
        <div className="text-2xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-cyan-400" />
          Active Structural Components ({m.selectedStructures.length})
        </div>
        <div className="space-y-1.5">
          {m.selectedStructures.map((s) => (
            <div
              key={s.id}
              className="p-2.5 rounded-lg hud-card text-xs flex items-center justify-between"
            >
              <div className="font-medium text-slate-200">
                {lang === 'hi' ? s.nameHi : s.name}
              </div>
              <div className="font-mono text-[11px] text-emerald-400 font-semibold">
                Rs. {(s.baseCostCr + s.costPerAcreCr * m.areaAcres).toFixed(1)} Cr
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phased Construction Gantt & Deliverables */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="text-2xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center justify-between">
          <span>Phased Implementation Plan</span>
          <span className="text-emerald-400">Budget Split</span>
        </div>

        <div className="space-y-2">
          {m.phases.map((ph) => (
            <div key={ph.phase} className="p-3 rounded-xl hud-card text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">
                  Phase {ph.phase}: {lang === 'hi' ? ph.titleHi : ph.title}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-400">
                  Rs. {ph.costCr} Cr ({ph.pctBudget}%)
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Duration: {ph.durationMonths} Months
              </div>
              <ul className="text-[10px] text-slate-300 space-y-0.5 pt-0.5 list-disc list-inside">
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
