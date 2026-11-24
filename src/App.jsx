import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNeevStore } from './store/useNeevStore.js';
import { useT } from './i18n/useT.js';
import Navbar from './components/layout/Navbar.jsx';
import Hero from './components/layout/Hero.jsx';
import WorldMap from './components/map/WorldMap.jsx';

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
import FireDispatch from './components/story/FireDispatch.jsx';
import MonsoonMode from './components/story/MonsoonMode.jsx';

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

const URBAN_TABS = ['audit', 'levers', 'impact'];
const PLAIN_TABS = ['structures', 'metrics'];

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

  const [activeTab, setActiveTab] = useState('audit');
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false); // Map is default primary hero!
  const studioRef = React.useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceNoWebGL = params.get('forceNoWebGL') === '1';
    const webgl = detectWebGL(forceNoWebGL);
    setWebGLAvailable(webgl);
    if (!webgl) {
      setMode('2d');
    }
  }, [setMode]);

  const scrollToStudio = () => {
    setHeroVisible(false);
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const show3D = mode === '3d' && webGLAvailable;

  return (
    <div className="min-h-screen blueprint-grid flex flex-col font-ui select-none overflow-x-hidden">
      {/* ── Top Unified Navbar ── */}
      <Navbar webGLAvailable={webGLAvailable} />

      {/* ── Optional Collapsible Architectural Hero ── */}
      <AnimatePresence>
        {heroVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Hero onStart={scrollToStudio} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT AREA ── */}
      <main ref={studioRef} className="flex-1 relative overflow-hidden">
        {/* MODE 1: INTERACTIVE WORLD MAP & DISCOVERY CANVAS */}
        {appMode === 'map' && (
          <div className="w-full h-full">
            <WorldMap />
          </div>
        )}

        {/* MODE 2: GREENFIELD PLAIN-LAND CONSTRUCTION STUDIO */}
        {appMode === 'plain' && (
          <div className="w-full h-[calc(100vh-48px)]">
            {/* Desktop 3-column layout */}
            <div className="hidden lg:grid grid-cols-[380px_1fr_420px] h-full">
              {/* Left Panel: Click & Build Toolbar */}
              <div className="overflow-y-auto">
                <PlainLandStudio />
              </div>

              {/* Center 3D Stage */}
              <div className="relative overflow-hidden bg-slate-900 border-r border-line">
                <div className="w-full h-full">
                  {show3D ? (
                    <SceneErrorBoundary>
                      <Suspense fallback={<SceneFallback />}>
                        <Scene3D />
                      </Suspense>
                    </SceneErrorBoundary>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs">
                      2D Layout Mode active
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Feasibility Metrics & Budget */}
              <div className="overflow-y-auto">
                <PlainLandMetrics />
              </div>
            </div>

            {/* Mobile / Tablet Plain Land Layout */}
            <div className="lg:hidden flex flex-col h-full overflow-y-auto">
              <div className="relative bg-slate-950 shrink-0" style={{ height: '45vw', minHeight: 220, maxHeight: 360 }}>
                {show3D ? (
                  <SceneErrorBoundary>
                    <Suspense fallback={<SceneFallback />}>
                      <Scene3D />
                    </Suspense>
                  </SceneErrorBoundary>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                    2D Mode
                  </div>
                )}
              </div>

              {/* Mobile Tab Selector */}
              <div className="sticky top-0 z-20 flex border-y border-line bg-card">
                <button
                  type="button"
                  onClick={() => setActiveTab('structures')}
                  className={`flex-1 py-2.5 text-xs font-mono text-center border-r border-line ${
                    activeTab === 'structures' ? 'text-emerald-700 font-bold border-b-2 border-b-emerald-600 bg-emerald-50/50' : 'text-muted'
                  }`}
                >
                  Structures & Sliders
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('metrics')}
                  className={`flex-1 py-2.5 text-xs font-mono text-center ${
                    activeTab === 'metrics' ? 'text-emerald-700 font-bold border-b-2 border-b-emerald-600 bg-emerald-50/50' : 'text-muted'
                  }`}
                >
                  Budget & Timeline
                </button>
              </div>

              <div className="p-2 pb-16">
                {activeTab === 'structures' ? <PlainLandStudio /> : <PlainLandMetrics />}
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: URBAN REDEVELOPMENT & RETROFITTING STUDIO */}
        {appMode === 'urban' && (
          <div className="w-full h-[calc(100vh-48px)]">
            {/* Desktop 3-column layout */}
            <div className="hidden lg:grid studio-layout h-full">
              {/* Left panel: Site + Audit */}
              <div className="flex flex-col border-r border-line overflow-y-auto bg-card">
                <div className="title-block flex-shrink-0">
                  <span className="title-block-cell font-mono text-xs">{t('sheet_no')}</span>
                  <span className="title-block-cell font-mono text-xs">{t('sheet_scale')}</span>
                  <span className="title-block-cell font-mono text-xs">{t('sheet_rev')}</span>
                  <span className="title-block-cell font-mono text-xs flex-1">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SitePanel />
                  <div className="border-t border-line" />
                  <AuditPanel />
                </div>
              </div>

              {/* Center: 3D Scene + Levers */}
              <div className="flex flex-col overflow-hidden border-r border-line">
                {/* State controls & blueprints */}
                <div className="flex items-center gap-4 px-4 py-2 border-b border-line bg-card flex-shrink-0">
                  <StateToggle />
                  <div className="flex-1" />
                  <BlueprintSelector />
                </div>

                {/* 3D / 2D Viewport */}
                <div className="flex-1 relative overflow-hidden bg-paper">
                  {show3D ? (
                    <SceneErrorBoundary>
                      <Suspense fallback={<SceneFallback />}>
                        <Scene3D />
                      </Suspense>
                    </SceneErrorBoundary>
                  ) : (
                    <Scene2D />
                  )}

                  {/* Story buttons */}
                  {hasAudit && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                      <FireDispatch />
                      <MonsoonMode />
                    </div>
                  )}
                </div>

                {/* Lever panel */}
                <div className="border-t border-line flex-shrink-0 bg-card max-h-56 overflow-y-auto">
                  <LeverPanel />
                </div>
              </div>

              {/* Right panel: Impact + Phases + Screening */}
              <div className="flex flex-col overflow-y-auto bg-card">
                <div className="border-b border-line flex-shrink-0 p-3">
                  <span className="label-mono">{t('impact_title')}</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ImpactPanel />
                  <div className="border-t border-line" />
                  <PhasePlan />
                  <div className="border-t border-line" />
                  <ScreeningChecks />
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Urban Layout */}
            <div className="lg:hidden flex flex-col h-full overflow-y-auto">
              <div className="relative bg-paper shrink-0" style={{ height: '50vw', minHeight: 220, maxHeight: 380 }}>
                {show3D ? (
                  <SceneErrorBoundary>
                    <Suspense fallback={<SceneFallback />}>
                      <Scene3D />
                    </Suspense>
                  </SceneErrorBoundary>
                ) : (
                  <Scene2D />
                )}
              </div>

              <div className="border-y border-line bg-card px-4 py-2 flex gap-3 items-center flex-wrap">
                <StateToggle />
                <div className="flex-1" />
                <BlueprintSelector compact />
              </div>

              <div className="border-b border-line bg-card">
                <LeverPanel compact />
              </div>

              {hasAudit && (
                <div className="flex gap-2 px-4 py-2 border-b border-line bg-paper">
                  <FireDispatch />
                  <MonsoonMode />
                </div>
              )}

              <div className="sticky top-0 z-20 flex border-t border-line bg-card">
                {URBAN_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-mono text-center border-r last:border-r-0 border-line transition-colors ${
                      activeTab === tab ? 'text-terracotta bg-paper border-b-2 border-b-terracotta font-bold' : 'text-muted hover:text-ink'
                    }`}
                    style={{ minHeight: 44 }}
                  >
                    {tab === 'audit' && t('audit_panel_title')}
                    {tab === 'levers' && t('lever_panel_title')}
                    {tab === 'impact' && t('impact_title')}
                  </button>
                ))}
              </div>

              <div className="bg-card p-2 pb-16">
                {activeTab === 'audit' && (
                  <div>
                    <SitePanel />
                    <div className="border-t border-line" />
                    <AuditPanel />
                  </div>
                )}
                {activeTab === 'levers' && <LeverPanel />}
                {activeTab === 'impact' && (
                  <div>
                    <ImpactPanel />
                    <div className="border-t border-line" />
                    <PhasePlan />
                    <div className="border-t border-line" />
                    <ScreeningChecks />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Assumptions Drawer */}
      <AssumptionsDrawer open={assumptionsOpen} />

      {/* Toast Notification */}
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
    <div className="w-full h-full flex items-center justify-center bg-paper">
      <div className="text-center">
        <div className="skeleton-block w-32 mx-auto mb-3" />
        <div className="label-mono">Rendering 3D Scene…</div>
      </div>
    </div>
  );
}
