/**
 * src/components/studio/BottomDock.jsx
 * Floating Centered Command Dock (Constructive-style HUD dock).
 * Provides one-touch access to:
 *  - 3D Camera Angles (Isometric, Street Eye-Level, Top Blueprint)
 *  - State Switch (Current Baseline vs Planned Redevelopment)
 *  - Quick Blueprints (Chandigarh, Jaipur, Ahmedabad)
 *  - Disaster Simulations (🚒 Fire Dispatch, 🌧️ Monsoon Flood)
 *  - HUD visibility toggle & Quick City Jumps in Map mode
 */

import React from 'react';
import {
  Box, Eye, Layers, Flame, CloudRain, Sparkles,
  MapPin, EyeOff, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { useNeevStore } from '../../store/useNeevStore.js';
import { useT } from '../../i18n/useT.js';
import { BLUEPRINTS } from '@shared/blueprints.js';
import FireDispatch from '../story/FireDispatch.jsx';
import MonsoonMode from '../story/MonsoonMode.jsx';

export default function BottomDock({
  hudVisible = true,
  onToggleHud,
}) {
  const t = useT();
  const {
    appMode,
    mode,
    setMode,
    cameraPreset,
    setCameraPreset,
    stage,
    setStage,
    activeBlueprint,
    setBlueprint,
    hasAudit,
    plainLand,
    setSelectedCoordinates,
  } = useNeevStore();

  const isUrban = appMode === 'urban';
  const isPlain = appMode === 'plain';
  const isMap = appMode === 'map';

  // Major Indian cities for 1-click Map jump
  const MAP_JUMPS = [
    { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
    { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
    { name: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 select-none pointer-events-auto">
      <div className="hud-dock px-3 py-2 flex items-center gap-2 sm:gap-3 text-xs font-mono text-slate-200">
        {/* ── CAMERA PRESETS (When in 3D Mode) ── */}
        {!isMap && (
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('3d');
                setCameraPreset('isometric');
              }}
              title="Isometric 3D Perspective"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[11px] ${
                mode === '3d' && cameraPreset === 'isometric'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md glow-orange'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Iso</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('3d');
                setCameraPreset('street');
              }}
              title="Street Eye-Level View"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[11px] ${
                mode === '3d' && cameraPreset === 'street'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-md glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Street</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('3d');
                setCameraPreset('top');
              }}
              title="Top Blueprint Orthographic"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[11px] ${
                mode === '3d' && cameraPreset === 'top'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-md glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plan</span>
            </button>
          </div>
        )}

        {/* ── MAP JUMP PRESETS (When in Map Mode) ── */}
        {isMap && (
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <span className="text-[10px] text-slate-400 px-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Quick Jump:</span>
            </span>
            {MAP_JUMPS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedCoordinates({ lat: c.lat, lon: c.lon })}
                className="px-2.5 py-1 rounded-full text-[11px] text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Vertical divider */}
        <div className="w-px h-5 bg-white/15" />

        {/* ── URBAN CONTROLS: State Toggle & Blueprints ── */}
        {isUrban && (
          <>
            {/* Stage toggle: Current vs Planned */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => setStage('current')}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 ${
                  stage === 'current'
                    ? 'bg-slate-700 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${stage === 'current' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{t('state_current')}</span>
              </button>

              <button
                type="button"
                onClick={() => setStage('planned')}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 ${
                  stage === 'planned'
                    ? 'bg-orange-600 text-white font-semibold shadow glow-orange'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${stage === 'planned' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{t('state_planned')}</span>
              </button>
            </div>

            {/* Quick Blueprint Buttons */}
            <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
              {BLUEPRINTS.map((bp) => {
                const isActive = activeBlueprint === bp.id;
                return (
                  <button
                    key={bp.id}
                    type="button"
                    onClick={() => setBlueprint(bp)}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                      isActive
                        ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {bp.name}
                  </button>
                );
              })}
            </div>

            {/* Disaster triggers */}
            {hasAudit && (
              <div className="flex items-center gap-1.5">
                <FireDispatch />
                <MonsoonMode />
              </div>
            )}
          </>
        )}

        {/* ── PLAIN LAND CONTROLS ── */}
        {isPlain && (
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{plainLand.selectedIds.length} Structures</span>
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 text-[10px]">
              {plainLand.areaAcres} Acres Plot
            </span>
          </div>
        )}

        {/* ── HUD TOGGLE BUTTON (hide/show panels) ── */}
        {onToggleHud && (
          <>
            <div className="w-px h-5 bg-white/15" />
            <button
              type="button"
              onClick={onToggleHud}
              title={hudVisible ? 'Hide HUD Panels (Full 3D View)' : 'Show HUD Panels'}
              className={`p-1.5 rounded-full border transition-all ${
                hudVisible
                  ? 'bg-white/10 border-white/20 text-slate-200 hover:text-white hover:bg-white/20'
                  : 'bg-orange-600 text-white border-orange-500 shadow-md glow-orange'
              }`}
            >
              {hudVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
