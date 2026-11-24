/**
 * src/components/plainland/PlainLandStudio.jsx
 * Interactive Plain Land (Greenfield) Construction Studio Toolbar & Controls.
 * Allows users to toggle 6 buildable infrastructure structures, adjust site area (acres),
 * mandatory green canopy %, and solar rooftop coverage %.
 */

import React from 'react';
import {
  Car, GitMerge, Building2, Home, Trees, HeartPulse,
  Sliders, Maximize2, Sun, Sparkles, CheckSquare, Square
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
    <div className="bg-white border-r border-line p-4 overflow-y-auto space-y-5 font-ui select-none h-full">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-2xs font-mono uppercase tracking-widest text-emerald-600 font-semibold">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          {t('plain_studio_title')}
        </div>
        <h2 className="text-sm font-semibold font-heading text-ink mt-0.5 tracking-tight">
          {t('plain_select_structures')}
        </h2>
        <p className="text-2xs text-muted mt-0.5">
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
              className={`w-full text-left p-3 rounded border transition-all text-xs flex items-start gap-3 shadow-sm ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/20'
                  : 'bg-paper hover:bg-slate-50 border-line text-slate-700'
              }`}
            >
              <div className={`p-2 rounded shrink-0 mt-0.5 ${
                isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold truncate ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {name}
                  </span>
                  <span className="font-mono text-[10px] text-muted shrink-0 ml-1">
                    Base: Rs. {item.baseCostCr} Cr
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                  {desc}
                </p>

                {/* Specs pill preview */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.specs.slice(0, 2).map((sp, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 text-slate-600"
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
      <div className="pt-3 border-t border-line space-y-4">
        <div className="flex items-center gap-1.5 text-2xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
          <Sliders className="w-3.5 h-3.5" /> Project Scale Parameters
        </div>

        {/* 1. Area (Acres) Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-slate-400" /> {t('plain_area_acres')}
            </span>
            <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
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
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>1 Acre</span>
            <span>20 Acres</span>
            <span>40 Acres</span>
          </div>
        </div>

        {/* 2. Green Canopy % Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium flex items-center gap-1">
              <Trees className="w-3 h-3 text-emerald-500" /> {t('plain_green_pct')}
            </span>
            <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
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
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>5% (Min)</span>
            <span>25% (Standard)</span>
            <span>50% (Eco Forest)</span>
          </div>
        </div>

        {/* 3. Solar Rooftop % Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" /> {t('plain_solar_pct')}
            </span>
            <span className="font-mono font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
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
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>10%</span>
            <span>50% (Grid-Neutral)</span>
            <span>100% (Net Positive)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
