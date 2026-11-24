import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Building2, Shovel, ArrowRight, Sparkles } from 'lucide-react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';

export default function Hero({ onStart }) {
  const t = useT();
  const setAppMode = useNeevStore((s) => s.setAppMode);

  return (
    <section className="relative border-b border-line bg-paper overflow-hidden select-none font-ui" style={{ minHeight: 340 }}>
      {/* Drawing sheet border accents */}
      <div className="absolute inset-4 border border-line pointer-events-none" />
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-muted pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-muted pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-muted pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-muted pointer-events-none" />

      <div className="max-w-5xl mx-auto px-8 py-12 relative z-10">
        {/* Sheet metadata tag */}
        <div className="flex items-center gap-6 mb-6">
          <span className="label-mono text-muted">{t('sheet_no')}</span>
          <span className="label-mono text-muted">{t('sheet_scale')}</span>
          <span className="label-mono text-muted">{t('sheet_rev')}</span>
          <span className="label-mono text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> TRACK 5: SMARTER CITIES & CIVIC INFRASTRUCTURE
          </span>
        </div>

        {/* Logo + Title */}
        <div className="flex items-start gap-6 mb-6">
          <svg width="52" height="52" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={t('nav_logo_alt')} className="flex-shrink-0 mt-1">
            <rect x="1" y="1" width="54" height="54" stroke="#E2E8F0" strokeWidth="1" />
            {[14, 28, 42].map(x => (
              <line key={`v${x}`} x1={x} y1="1" x2={x} y2="55" stroke="#E2E8F0" strokeWidth="0.5" />
            ))}
            {[14, 28, 42].map(y => (
              <line key={`h${y}`} x1="1" y1={y} x2="55" y2={y} stroke="#E2E8F0" strokeWidth="0.5" />
            ))}
            <rect x="14" y="28" width="14" height="14" fill="#EA580C" opacity="0.9" />
            <rect x="28" y="28" width="14" height="14" fill="#EA580C" opacity="0.6" />
            <rect x="14" y="42" width="28" height="12" fill="#EA580C" opacity="0.4" />
          </svg>

          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold tracking-tighter text-ink leading-none mb-2">
              Neev <span className="text-xl lg:text-2xl text-muted font-normal tracking-normal">("नींव")</span>
            </h1>
            <p className="font-heading text-lg lg:text-xl font-normal text-muted tracking-tight">
              {t('hero_title')}
            </p>
          </div>
        </div>

        <p className="font-ui text-sm lg:text-base text-slate-700 max-w-2xl mb-2 leading-relaxed">
          {t('hero_subtitle')}
        </p>

        {/* Tagline */}
        <p className="font-mono text-xs text-muted mb-8 italic">
          "{t('app_tagline')}"
        </p>

        {/* 3 Unified CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAppMode('map');
              onStart();
            }}
            className="bg-slate-900 text-white font-medium px-6 py-2.5 text-xs rounded hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Interactive World Map</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              setAppMode('urban');
              onStart();
            }}
            className="bg-orange-600 text-white font-medium px-6 py-2.5 text-xs rounded hover:bg-orange-500 transition-all flex items-center gap-2 shadow-lg"
          >
            <Building2 className="w-4 h-4" />
            <span>Urban Redevelopment</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAppMode('plain');
              onStart();
            }}
            className="bg-emerald-600 text-white font-medium px-6 py-2.5 text-xs rounded hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg"
          >
            <Shovel className="w-4 h-4" />
            <span>Plain Land Builder</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-4 border-t border-line">
          <p className="font-mono text-[11px] text-muted opacity-75 leading-relaxed max-w-3xl">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}
