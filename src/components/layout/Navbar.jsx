import React from 'react';
import { Globe, Building2, Shovel, FileDown } from 'lucide-react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
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

  const isPdfReady = appMode === 'plain' || hasAudit;

  return (
    <nav className="h-12 flex items-stretch border-b border-line bg-card flex-shrink-0 z-30 relative select-none font-ui" role="navigation">
      {/* Brand & Sheet Number */}
      <div className="flex items-center px-4 border-r border-line gap-2.5 flex-shrink-0">
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="19" height="19" stroke="#E2E8F0" />
          {[5, 10, 15].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="20" stroke="#E2E8F0" strokeWidth="0.5" />
          ))}
          {[5, 10, 15].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="20" y2={y} stroke="#E2E8F0" strokeWidth="0.5" />
          ))}
          <rect x="5" y="10" width="5" height="5" fill="#EA580C" opacity="0.9" />
          <rect x="10" y="10" width="5" height="5" fill="#EA580C" opacity="0.5" />
          <rect x="5" y="15" width="10" height="4" fill="#EA580C" opacity="0.3" />
        </svg>
        <span className="font-heading font-bold text-base tracking-tight text-ink">Neev</span>
        <span className="hidden sm:inline text-[10px] font-mono text-muted px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
          v2.0
        </span>
      </div>

      {/* Main Navigation Mode Switcher: Map vs Urban vs Plain Land */}
      <div className="flex items-center px-2 gap-1 border-r border-line">
        <button
          type="button"
          onClick={() => setAppMode('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            appMode === 'map'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-ink hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('nav_mode_map')}</span>
        </button>

        <button
          type="button"
          onClick={() => setAppMode('urban')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            appMode === 'urban'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-ink hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('nav_mode_urban')}</span>
        </button>

        <button
          type="button"
          onClick={() => setAppMode('plain')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            appMode === 'plain'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-ink hover:bg-slate-100'
          }`}
        >
          <Shovel className="w-3.5 h-3.5" />
          <span>{t('nav_mode_plain')}</span>
        </button>
      </div>

      {/* Sheet metadata cells */}
      <div className="hidden xl:flex items-stretch border-r border-line">
        <span className="title-block-cell flex items-center text-xs font-mono text-muted px-3">
          {t('sheet_no')}
        </span>
      </div>
      <div className="hidden xl:flex items-stretch border-r border-line">
        <span className="title-block-cell flex items-center text-xs font-mono text-muted px-3">
          {t('sheet_scale')}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Controls */}
      <div className="flex items-stretch gap-0">
        {/* EN / हिंदी toggle */}
        <div className="flex items-center px-2 border-l border-line gap-1" role="group" aria-label="Language">
          {['en', 'hi'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`font-mono text-xs px-2 py-1 rounded transition-colors ${
                lang === l ? 'bg-ink text-white font-semibold' : 'text-muted hover:text-ink hover:bg-slate-100'
              }`}
              style={{ minHeight: 28 }}
              aria-pressed={lang === l}
            >
              {l === 'en' ? 'EN' : 'हिं'}
            </button>
          ))}
        </div>

        {/* 2D / 3D toggle (visible when in studio) */}
        {webGLAvailable && appMode !== 'map' && (
          <button
            onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
            className="flex items-center px-3 border-l border-line text-xs font-mono text-muted hover:text-ink transition-colors gap-1.5"
            style={{ minHeight: 44 }}
            aria-pressed={mode === '2d'}
          >
            {mode === '3d' ? (
              <>
                <span className="font-semibold text-terracotta">3D</span>
                <span className="opacity-50 hidden lg:inline">View</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-slate-700">2D</span>
                <span className="opacity-50 hidden lg:inline">Blueprint</span>
              </>
            )}
          </button>
        )}

        {/* Export DPR PDF button */}
        <div className="flex items-center px-3 border-l border-line">
          {isPdfReady ? (
            <button
              onClick={handlePDF}
              className="bg-terracotta text-white font-medium text-xs px-3.5 py-1.5 rounded hover:bg-terracotta-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t('nav_pdf')}</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="bg-line text-muted font-medium text-xs px-3.5 py-1.5 rounded cursor-not-allowed flex items-center gap-1.5 opacity-60"
                aria-disabled="true"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{t('nav_pdf')}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-ink text-white font-mono text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                {t('nav_pdf_disabled_tooltip')}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
