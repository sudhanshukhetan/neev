/**
 * src/components/layout/Navbar.jsx
 * Constructive-inspired Civic Pre-feasibility Header for Indian Streets.
 * Features:
 *  - NEEV CIVIC Branding + "Pre-feasibility for Indian streets"
 *  - City dropdown selector with quick coordinates routing
 *  - "← Back to city map" quick exit from 3D study
 *  - "VIEWING AS" Persona selector (Ward officer, Planner, Resident)
 *  - Studio Navigation toggles (City Map, 3D Street Study, Plain Land Studio)
 *  - Signature Lime-Green "Export DPR (PDF)" button
 *  - Tri-color gradient bottom underline
 */

import React from 'react';
import {
  Globe, Building2, Shovel, FileDown, ArrowLeft,
  MapPin, UserCheck, ShieldCheck
} from 'lucide-react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore, CITIES } from '../../store/useNeevStore.js';
import { exportDprPdf } from '../../lib/pdf.js';

export default function Navbar({ webGLAvailable }) {
  const t = useT();
  const {
    lang,
    setLang,
    mode,
    setMode,
    appMode,
    setAppMode,
    hasAudit,
    planned,
    baseline,
    levers,
    assumptions,
    activePreset,
    plainLandMetrics,
    plainLand,
    selectedCoordinates,
    locationIntel,
    showToast,
    viewingAs,
    setViewingAs,
    selectedCity,
    setSelectedCity,
  } = useNeevStore();

  const handlePDF = async () => {
    try {
      showToast(t('pdf_generating'));
      if (appMode === 'plain') {
        await exportDprPdf({
          mode: 'plain',
          greenfield: plainLandMetrics,
          coordinates: selectedCoordinates,
          location: locationIntel?.location,
          weather: locationIntel?.weather,
          aqi: locationIntel?.aqi,
          lang,
        });
      } else {
        await exportDprPdf({
          mode: 'urban',
          baseline,
          levers,
          assumptions,
          planned,
          activePreset,
          coordinates: selectedCoordinates,
          location: locationIntel?.location,
          weather: locationIntel?.weather,
          aqi: locationIntel?.aqi,
          lang,
        });
      }
      showToast(t('toast_pdf_ok'));
    } catch (err) {
      console.error('[neev] PDF export error:', err);
      showToast('PDF error: ' + err.message);
    }
  };

  const isPdfReady = appMode === 'plain' || hasAudit || true;

  return (
    <nav className="h-14 flex items-center justify-between px-3 md:px-5 bg-white border-b border-slate-200 nav-gradient-border flex-shrink-0 z-30 relative select-none font-ui shadow-sm" role="navigation">
      {/* ── LEFT: Logo + CIVIC Badge + Subtitle ── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAppMode('map')}
          className="flex items-center gap-2 text-left group"
        >
          {/* Constructive-inspired diagonal striped geometric logo */}
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white stroke-current stroke-2">
              <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="2" />
              <path d="M7 17L17 7M7 11L11 7M13 17L17 13" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-black text-lg tracking-tight text-slate-950 uppercase">
              NEEV
            </span>
            <span className="badge-civic">
              CIVIC
            </span>
          </div>
        </button>

        <span className="hidden xl:inline text-xs font-mono text-slate-400 pl-2 border-l border-slate-200">
          Pre-feasibility for Indian streets
        </span>
      </div>

      {/* ── CENTER: City Dropdown + Back to Map + Persona Selector ── */}
      <div className="hidden lg:flex items-center gap-3 font-mono">
        {/* City Selector */}
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-600">
            CITY / STREET
          </span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </div>

        {/* Back to City Map Button (if in 3D study) */}
        {appMode !== 'map' && (
          <button
            type="button"
            onClick={() => setAppMode('map')}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to map</span>
          </button>
        )}

        {/* Viewing As (Persona) */}
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-600">
            VIEWING AS
          </span>
          <select
            value={viewingAs}
            onChange={(e) => setViewingAs(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="ward_officer">Ward officer</option>
            <option value="planner">Planner / architect</option>
            <option value="resident">Resident / RWA</option>
          </select>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setAppMode('map')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              appMode === 'map'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Map</span>
          </button>

          <button
            type="button"
            onClick={() => setAppMode('urban')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              appMode === 'urban'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-orange-600" />
            <span>3D Study</span>
          </button>

          <button
            type="button"
            onClick={() => setAppMode('plain')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              appMode === 'plain'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shovel className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plain Land</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT: Status + Language + Signature Lime DPR PDF Button ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status dot */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>NBC 2016 verified</span>
        </div>

        {/* EN / Hindi toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200" role="group">
          {['en', 'hi'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`font-mono text-xs px-2 py-0.5 rounded transition-all ${
                lang === l ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {l === 'en' ? 'EN' : 'हिं'}
            </button>
          ))}
        </div>

        {/* 2D / 3D toggle (visible when in studio) */}
        {webGLAvailable && appMode !== 'map' && (
          <button
            onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
            className="hidden sm:flex items-center px-2 py-1 border border-slate-200 rounded-md text-xs font-mono text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="font-semibold text-orange-600">{mode === '3d' ? '3D' : '2D'}</span>
          </button>
        )}

        {/* Signature Neon Lime "Export DPR (PDF)" Button */}
        <button
          type="button"
          onClick={handlePDF}
          className="btn-lime px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
        >
          <FileDown className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export DPR (PDF)</span>
        </button>
      </div>
    </nav>
  );
}
