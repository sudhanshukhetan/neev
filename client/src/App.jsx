import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNeevStore } from './store/useNeevStore.js';
import { useT } from './i18n/useT.js';
import Navbar from './components/layout/Navbar.jsx';
import Hero from './components/layout/Hero.jsx';
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

// Lazy-load 3D scene so the 2D path never downloads three.js
const Scene3D = lazy(() => import('./components/scene/Scene3D.jsx'));

// Detect WebGL support
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

// Active tab for tablet/mobile
const TABS = ['audit', 'levers', 'impact'];

export default function App() {
  const t = useT();
  const mode = useNeevStore((s) => s.mode);
  const toast = useNeevStore((s) => s.toast);
  const dismissToast = useNeevStore((s) => s.dismissToast);
  const setMode = useNeevStore((s) => s.setMode);
  const hasAudit = useNeevStore((s) => s.hasAudit);
  const assumptionsOpen = useNeevStore((s) => s.assumptionsOpen);
  const [activeTab, setActiveTab] = useState('audit');
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [heroVisible, setHeroVisible] = useState(true);
  const studioRef = React.useRef(null);

  useEffect(() => {
    // Check for ?forceNoWebGL=1 dev flag
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
    <div className="min-h-screen blueprint-grid">
      {/* Navbar */}
      <Navbar webGLAvailable={webGLAvailable} />

      {/* Hero */}
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

      {/* Studio */}
      <div ref={studioRef} id="studio" className="relative">
        {/* Desktop 3-column layout */}
        <div className="hidden lg:grid studio-layout min-h-[calc(100vh-44px)]">
          {/* Left panel: Site + Audit */}
          <div className="flex flex-col border-r border-line overflow-y-auto bg-card">
            {/* Title block */}
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

          {/* Center: Scene + controls */}
          <div className="flex flex-col overflow-hidden border-r border-line">
            {/* Stage controls */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-line bg-card flex-shrink-0">
              <StateToggle />
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => useNeevStore.getState().setAssumptionsOpen(true)}
                  className="label-mono text-muted hover:text-ink transition-colors px-2 py-1 border border-line"
                >
                  Assumptions ↗
                </button>
              </div>
            </div>

            {/* Blueprint selector */}
            <div className="border-b border-line flex-shrink-0 bg-paper">
              <BlueprintSelector />
            </div>

            {/* Scene */}
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

              {/* Story buttons — drafting-style tabs on the scene */}
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

        {/* Mobile/Tablet layout */}
        <div className="lg:hidden flex flex-col">
          {/* Scene */}
          <div className="relative bg-paper" style={{ height: '55vw', minHeight: 220, maxHeight: 400 }}>
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

          {/* State Toggle + Blueprint */}
          <div className="border-y border-line bg-card px-4 py-2 flex gap-3 items-center flex-wrap">
            <StateToggle />
            <div className="flex-1" />
            <BlueprintSelector compact />
          </div>

          {/* Lever panel */}
          <div className="border-b border-line bg-card">
            <LeverPanel compact />
          </div>

          {/* Story buttons */}
          {hasAudit && (
            <div className="flex gap-2 px-4 py-2 border-b border-line bg-paper">
              <FireDispatch />
              <MonsoonMode />
            </div>
          )}

          {/* Tab bar */}
          <div className="sticky bottom-0 z-20 flex border-t border-line bg-card">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 label-mono text-center border-r last:border-r-0 border-line transition-colors ${
                  activeTab === tab ? 'text-terracotta bg-paper border-b-2 border-b-terracotta' : 'text-muted hover:text-ink'
                }`}
                style={{ minHeight: 44 }}
              >
                {tab === 'audit' && t('audit_panel_title')}
                {tab === 'levers' && t('lever_panel_title')}
                {tab === 'impact' && t('impact_title')}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-card">
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

      {/* Assumptions Drawer */}
      <AssumptionsDrawer open={assumptionsOpen} />

      {/* Toast */}
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
        <div className="label-mono">Loading 3D scene…</div>
      </div>
    </div>
  );
}
