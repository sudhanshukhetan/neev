/**
 * src/components/map/AreaIntelDrawer.jsx
 * Floating glassmorphic Area Intelligence Drawer displayed upon clicking any map location.
 * Analyzes land-use, live weather & AQI, detected civic flaws, and offers 1-click
 * transition into the 3D Urban Retrofitting Simulator or Greenfield Construction Studio.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, CloudRain, Wind, Thermometer, AlertTriangle,
  Building2, Shovel, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Trees
} from 'lucide-react';
import { useNeevStore } from '../../store/useNeevStore.js';
import useT from '../../i18n/useT.js';
import { PRESETS } from '@shared/presets.js';

export default function AreaIntelDrawer() {
  const t = useT();
  const {
    intelDrawerOpen,
    setIntelDrawerOpen,
    locationIntel,
    intelLoading,
    selectedCoordinates,
    setAppMode,
    setBaseline,
    setActivePreset,
  } = useNeevStore();

  if (!intelDrawerOpen) return null;

  const loc = locationIntel?.location || {};
  const weather = locationIntel?.weather || {};
  const aqi = locationIntel?.aqi || {};
  const isUrban = loc.isUrban ?? true;

  // Handler to launch Urban Simulator with context from this location
  const handleLaunchUrban = () => {
    // Seed baseline with location data
    const matchedPreset = PRESETS[0]; // Tier-2 market or closest
    setBaseline({
      ...matchedPreset.baseline,
      localityName: `${loc.locality || 'Site'}, ${loc.city || 'District'}`,
      coordinates: selectedCoordinates,
    });
    setActivePreset(matchedPreset);
    setIntelDrawerOpen(false);
    setAppMode('urban');
  };

  // Handler to launch Plain Land Builder
  const handleLaunchPlainLand = () => {
    setIntelDrawerOpen(false);
    setAppMode('plain');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.98 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[480px] z-[1050] max-h-[85vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-lg shadow-2xl p-5 text-slate-100 font-ui"
      >
        {/* Header with Coordinates & Close */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono font-semibold rounded border ${
                isUrban
                  ? 'bg-orange-950/80 text-orange-400 border-orange-800/80'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
              }`}>
                {isUrban ? t('intel_dense_urban') : t('intel_plain_land')}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedCoordinates.lat.toFixed(4)}°N, {selectedCoordinates.lon.toFixed(4)}°E
              </span>
            </div>
            <h3 className="text-base font-semibold font-heading text-white tracking-tight truncate">
              {loc.locality || 'Inspected Plot'}, {loc.city || 'Regional Center'}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {loc.displayName || `${loc.state || 'State'}, ${loc.country || 'India'}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIntelDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {intelLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-400">Querying real-time area intelligence…</span>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {/* Real-time Environmental Grid: Weather & AQI */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* Weather Card */}
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-orange-400" /> Weather</span>
                  <span className="text-[10px] text-slate-500">Live</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-heading text-white">{weather.temperatureC ?? 28}°C</span>
                  <span className="text-[11px] text-slate-300">{weather.humidityPct ?? 52}% RH</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1">
                  <span>Precipitation: {weather.precipitationMm ?? 0} mm</span>
                  <span className={`font-semibold ${weather.monsoonFloodRisk === 'HIGH' ? 'text-rose-400' : 'text-slate-400'}`}>
                    Risk: {weather.monsoonFloodRisk ?? 'LOW'}
                  </span>
                </div>
              </div>

              {/* AQI Card */}
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-cyan-400" /> Air Quality</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold text-white" style={{ backgroundColor: aqi.color || '#D97706' }}>
                    {aqi.status || 'Moderate'}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-heading text-white">PM2.5: {aqi.pm25 ?? 45}</span>
                  <span className="text-[11px] text-slate-400">PM10: {aqi.pm10 ?? 85}</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-400 border-t border-slate-800/80 pt-1">
                  <span>Est. Density: {loc.estimatedPopulationDensity || '12,500 / km²'}</span>
                </div>
              </div>
            </div>

            {/* Detected Civic Bottlenecks OR Greenfield Opportunities */}
            {isUrban ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Detected Civic Bottlenecks
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">NBC 2016 Review</span>
                </div>
                <div className="space-y-1.5">
                  {(loc.civicFlaws && loc.civicFlaws.length > 0 ? loc.civicFlaws : [
                    { title: 'Sub-standard Carriageway Width', desc: 'Average lane width < 4.5m with roadside obstructions limiting emergency vehicle access.' },
                    { title: 'Drainage Overburden Risk', desc: 'Uncovered or desilt-deficit stormwater drainage subject to waterlogging during heavy monsoon rains.' },
                  ]).slice(0, 3).map((flaw, i) => (
                    <div key={i} className="text-xs p-2 rounded bg-slate-950/60 border border-slate-800/80">
                      <div className="font-medium text-slate-200">{flaw.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{flaw.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5" /> Greenfield Development Opportunity
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  Virgin open plot suitable for planned multi-lane express highways, grade-separated flyovers, modern seismic-compliant housing societies, and rainwater recharge zones.
                </p>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {isUrban ? (
                <>
                  <button
                    type="button"
                    onClick={handleLaunchUrban}
                    className="flex-1 py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs rounded flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    {t('intel_cta_urban')}
                  </button>
                  <button
                    type="button"
                    onClick={handleLaunchPlainLand}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Shovel className="w-3.5 h-3.5" /> Plain Land Builder
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleLaunchPlainLand}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <Shovel className="w-4 h-4" />
                    {t('intel_cta_plain')}
                  </button>
                  <button
                    type="button"
                    onClick={handleLaunchUrban}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" /> Urban Retrofit
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
