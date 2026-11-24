import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';

export default function Navbar({ webGLAvailable }) {
  const t = useT();
  const lang = useNeevStore((s) => s.lang);
  const setLang = useNeevStore((s) => s.setLang);
  const mode = useNeevStore((s) => s.mode);
  const setMode = useNeevStore((s) => s.setMode);
  const hasAudit = useNeevStore((s) => s.hasAudit);
  const planned = useNeevStore((s) => s.planned);
  const baseline = useNeevStore((s) => s.baseline);
  const levers = useNeevStore((s) => s.levers);
  const assumptions = useNeevStore((s) => s.assumptions);

  const handlePDF = async () => {
    if (!hasAudit) return;
    useNeevStore.getState().showToast(t('pdf_generating'));
    const { generateDPR } = await import('../../lib/pdf.js');
    await generateDPR({ baseline, levers, assumptions, planned, activePreset: useNeevStore.getState().activePreset });
    useNeevStore.getState().showToast(t('toast_pdf_ok'));
  };

  return (
    <nav className="h-11 flex items-stretch border-b border-line bg-card flex-shrink-0 z-30 relative" role="navigation">
      {/* Logo */}
      <div className="flex items-center px-4 border-r border-line gap-2 flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="19" height="19" stroke="#E2E8F0"/>
          {[5, 10, 15].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="20" stroke="#E2E8F0" strokeWidth="0.5"/>)}
          {[5, 10, 15].map(y => <line key={`h${y}`} x1="0" y1={y} x2="20" y2={y} stroke="#E2E8F0" strokeWidth="0.5"/>)}
          <rect x="5" y="10" width="5" height="5" fill="#EA580C" opacity="0.9"/>
          <rect x="10" y="10" width="5" height="5" fill="#EA580C" opacity="0.5"/>
          <rect x="5" y="15" width="10" height="4" fill="#EA580C" opacity="0.3"/>
        </svg>
        <span className="font-heading font-600 text-sm tracking-tight text-ink">Neev</span>
      </div>

      {/* Sheet metadata cells */}
      <div className="hidden md:flex items-stretch border-r border-line">
        <span className="title-block-cell flex items-center">{t('sheet_no')}</span>
      </div>
      <div className="hidden md:flex items-stretch border-r border-line">
        <span className="title-block-cell flex items-center">{t('sheet_scale')}</span>
      </div>
      <div className="hidden md:flex items-stretch border-r border-line">
        <span className="title-block-cell flex items-center">{t('sheet_rev')}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-stretch gap-0">
        {/* EN/हिंदी toggle */}
        <div className="flex items-center px-3 border-l border-line gap-1" role="group" aria-label="Language">
          {['en', 'hi'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`font-mono text-xs px-2 py-1 transition-colors ${
                lang === l ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
              style={{ borderRadius: 1, minHeight: 28 }}
              aria-pressed={lang === l}
            >
              {l === 'en' ? 'EN' : 'हिं'}
            </button>
          ))}
        </div>

        {/* 2D/3D mode toggle */}
        {webGLAvailable && (
          <button
            onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
            className="flex items-center px-3 border-l border-line label-mono text-muted hover:text-ink transition-colors gap-2"
            style={{ minHeight: 44 }}
            aria-pressed={mode === '2d'}
          >
            {mode === '3d' ? (
              <>
                <span className="text-muted">2D</span>
                <span className="text-xs opacity-50 hidden lg:inline">{t('nav_2d_label')}</span>
              </>
            ) : (
              <>
                <span className="text-terracotta">3D</span>
                <span className="text-xs opacity-50 hidden lg:inline">{t('nav_3d_label')}</span>
              </>
            )}
          </button>
        )}

        {/* Export DPR PDF button */}
        <div className="flex items-center px-2 border-l border-line">
          {hasAudit ? (
            <button
              onClick={handlePDF}
              className="bg-terracotta text-white font-heading font-500 text-xs px-4 py-1.5 hover:bg-terracotta-700 transition-colors"
              style={{ borderRadius: 2 }}
            >
              {t('nav_pdf')}
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="bg-line text-muted font-heading font-500 text-xs px-4 py-1.5 cursor-not-allowed"
                style={{ borderRadius: 2 }}
                aria-disabled="true"
              >
                {t('nav_pdf')}
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-ink text-white font-mono text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50" style={{ borderRadius: 2 }}>
                {t('nav_pdf_disabled_tooltip')}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
