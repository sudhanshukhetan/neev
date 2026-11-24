/**
 * src/App.jsx
 * Unified Full-Bleed Spatial Digital Twin Studio (Constructive-style HUD Interface).
 * Integrates:
 *  - 100% full-bleed Three.js 3D Viewport / Leaflet World Map discovery canvas
 *  - Floating collapsible obsidian glass HUD Inspector (Left)
 *  - Floating collapsible obsidian glass KPI Feasibility Dock (Right)
 *  - Centered floating bottom Command Dock (Camera, Stage, Disasters, Blueprints)
 *  - Seamless transitions between World Map, Greenfield Plain Land Studio, and Urban Retrofitting
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Sliders, MapPin, TrendingUp,
  ShieldCheck, Layers, Building2, Sparkles, X, Minimize2, Maximize2
} from 'lucide-react';
import { useNeevStore } from './store/useNeevStore.js';
import { useT } from './i18n/useT.js';
import Navbar from './components/layout/Navbar.jsx';
import Hero from './components/layout/Hero.jsx';
import WorldMap from './components/map/WorldMap.jsx';
import BottomDock from './components/studio/BottomDock.jsx';
import ConstructiveStudyHUD from './components/studio/ConstructiveStudyHUD.jsx';

// Urban Studio Components
import SitePanel from './components/studio/SitePanel.jsx';
import AuditPanel from './components/studio/AuditPanel.jsx';
import LeverPanel from './components/studio/LeverPanel.jsx';
import BlueprintSelector from './components/studio/BlueprintSelector.jsx';
import StateToggle from './components/studio/StateToggle.jsx';
import ImpactPanel from './components/studio/ImpactPanel.jsx';
import ScreeningChecks from './components/studio/ScreeningChecks.jsx';
import PhasePlan from './components/studio/PhasePlan.jsx';
import Scene2D from './components/scene/Scene2D.jsx';
import SceneErrorBoundary from './components/scene/SceneErrorBoundary.jsx';
import AssumptionsDrawer from './components/studio/AssumptionsDrawer.jsx';

// Greenfield Plain-Land Studio Components
import PlainLandStudio from './components/plainland/PlainLandStudio.jsx';
import PlainLandMetrics from './components/plainland/PlainLandMetrics.jsx';

// Lazy-load 3D scene
const Scene3D = lazy(() => import('./components/scene/Scene3D.jsx'));

function detectWebGL(forceDisable = false) {
  if (forceDisable) return false;
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!ctx;
  } catch {
    return false;
  }
}

export default function App() {
  const t = useT();
  const {
    mode,
    setMode,
    appMode,
    setAppMode,
    toast,
    dismissToast,
    hasAudit,
    assumptionsOpen,
  } = useNeevStore();

  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  // HUD State: Collapsible Drawers & Visibility
  const [hudVisible, setHudVisible] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // Tab selections
  const [urbanLeftTab, setUrbanLeftTab] = useState('levers'); // 'levers' | 'site'
  const [urbanRightTab, setUrbanRightTab] = useState('impact'); // 'impact' | 'phases'
  const [mobileTab, setMobileTab] = useState('left'); // 'left' | 'right' for mobile

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceNoWebGL = params.get('forceNoWebGL') === '1';
    const webgl = detectWebGL(forceNoWebGL);
    setWebGLAvailable(webgl);
    if (!webgl) {
      setMode('2d');
    }
  }, [setMode]);

  // If no audit yet, start on site tab in urban mode
  useEffect(() => {
    if (appMode === 'urban' && !hasAudit) {
      setUrbanLeftTab('site');
    }
  }, [appMode, hasAudit]);

  const show3D = mode === '3d' && webGLAvailable;

  return (
    <div className="h-screen w-screen flex flex-col font-ui select-none overflow-hidden bg-slate-950 text-slate-100">
      {/* ── Top Unified Navbar ── */}
      <Navbar webGLAvailable={webGLAvailable} />

      {/* ── Optional Collapsible Architectural Hero ── */}
      <AnimatePresence>
        {heroVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="z-40 relative"
          >
            <Hero onStart={() => setHeroVisible(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN FULL-BLEED VIEWPORT CONTAINER ── */}
      <main className="flex-1 relative overflow-hidden w-full h-[calc(100vh-48px)]">
        {/* ── FULL-BLEED BACKGROUND CANVAS (3D SCENE OR WORLD MAP) ── */}
        <div className="absolute inset-0 w-full h-full z-0">
          {appMode === 'map' ? (
            <WorldMap />
          ) : show3D ? (
            <SceneErrorBoundary>
              <Suspense fallback={<SceneFallback />}>
                <Scene3D />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <Scene2D />
            </div>
          )}
        </div>

        {/* ── CONSTRUCTIVE CIVIC 3D STREET STUDY HUD (When Urban Mode Active) ── */}
        {appMode === 'urban' && hudVisible && (
          <ConstructiveStudyHUD />
        )}

        {/* ── DESKTOP FLOATING HUD PANELS (When Plain Land Mode Active) ── */}
        {appMode === 'plain' && (
          <>
            {/* ── 1. LEFT HUD PANEL (Greenfield Structures & Sliders) ── */}
            <AnimatePresence>
              {hudVisible && leftOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                  className="hidden lg:flex absolute top-4 left-4 bottom-20 w-[420px] max-w-[calc(100vw-32px)] z-20 pointer-events-auto hud-panel flex-col overflow-hidden"
                >
                  <div className="hud-panel-header px-4 py-2.5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="font-heading font-semibold text-xs tracking-wide text-white uppercase">
                        Greenfield Structures
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLeftOpen(false)}
                      title="Collapse Left Panel"
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto hud-scroll">
                    <PlainLandStudio />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left Panel Collapsed Floating Trigger */}
            {hudVisible && !leftOpen && (
              <button
                type="button"
                onClick={() => setLeftOpen(true)}
                title="Expand Structures"
                className="hidden lg:flex absolute top-5 left-4 z-20 px-3 py-2 rounded-full hud-dock text-xs font-mono text-slate-200 hover:text-white items-center gap-2 shadow-2xl border border-white/20 hover:scale-105 transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Structures</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            {/* ── 2. RIGHT HUD PANEL (Feasibility KPIs & Budget) ── */}
            <AnimatePresence>
              {hudVisible && rightOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                  className="hidden lg:flex absolute top-4 right-4 bottom-20 w-[440px] max-w-[calc(100vw-32px)] z-20 pointer-events-auto hud-panel flex-col overflow-hidden"
                >
                  <div className="hud-panel-header px-4 py-2.5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="font-heading font-semibold text-xs tracking-wide text-white uppercase">
                        Feasibility & Budget
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRightOpen(false)}
                      title="Collapse Right Panel"
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto hud-scroll">
                    <PlainLandMetrics />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Panel Collapsed Floating Trigger */}
            {hudVisible && !rightOpen && (
              <button
                type="button"
                onClick={() => setRightOpen(true)}
                title="Expand Feasibility KPIs"
                className="hidden lg:flex absolute top-5 right-4 z-20 px-3 py-2 rounded-full hud-dock text-xs font-mono text-slate-200 hover:text-white items-center gap-2 shadow-2xl border border-white/20 hover:scale-105 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Budget & Feasibility</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
          </>
        )}

        {/* ── MOBILE / TABLET SLIDING DRAWER (< 1024px) ── */}
        {appMode !== 'map' && (
          <div className="lg:hidden absolute bottom-16 left-2 right-2 max-h-[46vh] z-20 hud-panel flex flex-col overflow-hidden shadow-2xl">
            {/* Mobile Tab Switcher */}
            <div className="hud-panel-header flex items-center border-b border-white/10">
              <button
                type="button"
                onClick={() => setMobileTab('left')}
                className={`flex-1 py-2 text-xs font-mono text-center transition-colors ${
                  mobileTab === 'left'
                    ? 'text-white font-bold bg-white/10 border-b-2 border-orange-500'
                    : 'text-slate-400'
                }`}
              >
                {appMode === 'plain' ? 'Structures & Sliders' : 'Site & Levers'}
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('right')}
                className={`flex-1 py-2 text-xs font-mono text-center transition-colors ${
                  mobileTab === 'right'
                    ? 'text-white font-bold bg-white/10 border-b-2 border-emerald-500'
                    : 'text-slate-400'
                }`}
              >
                {appMode === 'plain' ? 'Feasibility & Cost' : 'Impact & NBC'}
              </button>
            </div>

            {/* Mobile Drawer Body */}
            <div className="flex-1 overflow-y-auto p-2 hud-scroll">
              {mobileTab === 'left' ? (
                appMode === 'plain' ? <PlainLandStudio /> : (
                  <div>
                    <StateToggle />
                    <div className="my-2 border-t border-white/10" />
                    <BlueprintSelector compact={false} />
                    <div className="my-2 border-t border-white/10" />
                    <LeverPanel />
                  </div>
                )
              ) : (
                appMode === 'plain' ? <PlainLandMetrics /> : (
                  <div>
                    <ImpactPanel />
                    <div className="my-2 border-t border-white/10" />
                    <PhasePlan />
                    <div className="my-2 border-t border-white/10" />
                    <ScreeningChecks />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ── FLOATING CENTERED COMMAND DOCK (Shown for Plain Land & Map modes) ── */}
        {appMode !== 'urban' && (
          <BottomDock
            hudVisible={hudVisible}
            onToggleHud={() => setHudVisible(!hudVisible)}
          />
        )}
      </main>

      {/* ── Assumptions Drawer ── */}
      <AssumptionsDrawer open={assumptionsOpen} />

      {/* ── Toast Notifications ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="toast"
          >
            <span>{toast}</span>
            <button
              type="button"
              onClick={dismissToast}
              className="ml-3 underline text-xs opacity-70 hover:opacity-100"
            >
              {t('toast_dismiss')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-300">
      <div className="text-center font-mono text-xs">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <div className="tracking-widest uppercase">Rendering 3D Digital Twin…</div>
      </div>
    </div>
  );
}
