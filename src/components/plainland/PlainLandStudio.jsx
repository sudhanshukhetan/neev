/**
 * src/components/plainland/PlainLandStudio.jsx
 * Interactive Plain Land (Greenfield) Construction Studio Toolbar & Controls.
 * Allows users to toggle 6 buildable infrastructure structures, adjust site area (acres),
 * mandatory green canopy %, and solar rooftop coverage %.
 * Styled in Constructive-inspired obsidian glass HUD aesthetic.
 */

import React from 'react';
import {
  Car, GitMerge, Building2, Home, Trees, HeartPulse,
  Sliders, Maximize2, Sun, Sparkles
} from 'lucide-react';
import { useNeevStore } from '../../store/useNeevStore.js';
import useT from '../../i18n/useT.js';
import { INFRASTRUCTURE_TYPES } from '@shared/greenfieldEngine.js';

const ICON_MAP = {
  highway: Car,
  overbridge: GitMerge,
  society: Building2,
  house: Home,
  park: Trees,
  health_hub: HeartPulse,
};

export default function PlainLandStudio() {
  const t = useT();
  const {
    plainLand,
    toggleStructure,
    setPlainLandArea,
    setPlainLandGreenPct,
    setPlainLandSolarPct,
    lang,
  } = useNeevStore();

  return (
    <div className="p-4 overflow-y-auto space-y-5 font-ui select-none h-full text-slate-100 hud-scroll">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-2xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          {t('plain_studio_title')}
        </div>
        <h2 className="text-base font-semibold font-heading text-white mt-1 tracking-tight">
          {t('plain_select_structures')}
        </h2>
        <p className="text-2xs text-slate-400 mt-0.5 leading-relaxed">
          {t('plain_studio_subtitle')}
        </p>
      </div>

      {/* 6 Click & Build Infrastructure Cards */}
      <div className="space-y-2">
        {INFRASTRUCTURE_TYPES.map((item) => {
          const isSelected = plainLand.selectedIds.includes(item.id);
          const Icon = ICON_MAP[item.id] || Building2;
          const name = lang === 'hi' ? item.nameHi : item.name;
          const desc = lang === 'hi' ? item.descriptionHi : item.description;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleStructure(item.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                isSelected
                  ? 'bg-emerald-950/70 border-emerald-500/80 ring-1 ring-emerald-500/40 text-emerald-50 shadow-lg glow-emerald'
                  : 'hud-card text-slate-300 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                isSelected ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'bg-white/10 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {name}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 shrink-0 ml-1">
                    Rs. {item.baseCostCr} Cr
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {desc}
                </p>

                {/* Specs pill preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.specs.slice(0, 2).map((sp, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-slate-300"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sliders: Area (Acres), Green Canopy %, Solar Rooftop % */}
      <div className="pt-3 border-t border-white/10 space-y-4">
        <div className="flex items-center gap-1.5 text-2xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Project Scale Parameters
        </div>

        {/* 1. Area (Acres) Slider */}
        <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> {t('plain_area_acres')}
            </span>
            <span className="font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {plainLand.areaAcres} Acres
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={plainLand.areaAcres}
            onChange={(e) => setPlainLandArea(e.target.value)}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>1 Acre</span>
            <span>20 Acres</span>
            <span>40 Acres</span>
          </div>
        </div>

        {/* 2. Green Canopy % Slider */}
        <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-emerald-400" /> {t('plain_green_pct')}
            </span>
            <span className="font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {plainLand.greenPct}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={plainLand.greenPct}
            onChange={(e) => setPlainLandGreenPct(e.target.value)}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>5% (Min)</span>
            <span>25% (Standard)</span>
            <span>50% (Eco Forest)</span>
          </div>
        </div>

        {/* 3. Solar Rooftop % Slider */}
        <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> {t('plain_solar_pct')}
            </span>
            <span className="font-mono font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              {plainLand.solarPct}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={plainLand.solarPct}
            onChange={(e) => setPlainLandSolarPct(e.target.value)}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>10%</span>
            <span>50% (Grid-Neutral)</span>
            <span>100% (Net Positive)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
