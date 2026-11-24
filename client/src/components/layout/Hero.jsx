import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useT } from '../../i18n/useT.js';

export default function Hero({ onStart }) {
  const t = useT();

  return (
    <section className="relative border-b border-line bg-paper overflow-hidden" style={{ minHeight: 320 }}>
      {/* Background micro-grid is provided by body .blueprint-grid */}

      {/* Drawing sheet border */}
      <div className="absolute inset-4 border border-line pointer-events-none" />
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-muted pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-muted pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-muted pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-muted pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 py-16 relative z-10">
        {/* Sheet label */}
        <div className="flex items-center gap-6 mb-8">
          <span className="label-mono text-muted">{t('sheet_no')}</span>
          <span className="label-mono text-muted">{t('sheet_scale')}</span>
          <span className="label-mono text-muted">{t('sheet_rev')}</span>
        </div>

        {/* Logo + Title */}
        <div className="flex items-start gap-8 mb-8">
          {/* Foundation Grid SVG Logo */}
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={t('nav_logo_alt')} className="flex-shrink-0 mt-1">
            <rect x="1" y="1" width="54" height="54" stroke="#E2E8F0" strokeWidth="1"/>
            {/* Grid lines */}
            {[14, 28, 42].map(x => (
              <line key={`v${x}`} x1={x} y1="1" x2={x} y2="55" stroke="#E2E8F0" strokeWidth="0.5"/>
            ))}
            {[14, 28, 42].map(y => (
              <line key={`h${y}`} x1="1" y1={y} x2="55" y2={y} stroke="#E2E8F0" strokeWidth="0.5"/>
            ))}
            {/* Foundation blocks */}
            <rect x="14" y="28" width="14" height="14" fill="#EA580C" opacity="0.9"/>
            <rect x="28" y="28" width="14" height="14" fill="#EA580C" opacity="0.6"/>
            <rect x="14" y="42" width="28" height="12" fill="#EA580C" opacity="0.4"/>
            {/* Tick marks */}
            <rect x="1" y="1" width="4" height="1" fill="#0F172A"/>
            <rect x="1" y="1" width="1" height="4" fill="#0F172A"/>
            <rect x="51" y="1" width="4" height="1" fill="#0F172A"/>
            <rect x="55" y="1" width="1" height="4" fill="#0F172A"/>
          </svg>

          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-700 tracking-tighter text-ink leading-none mb-3">
              Neev
            </h1>
            <p className="font-heading text-xl lg:text-2xl font-400 text-muted tracking-tight">
              {t('hero_title')}
            </p>
          </div>
        </div>

        <p className="font-ui text-base text-ink opacity-75 max-w-xl mb-2 leading-relaxed">
          {t('hero_subtitle')}
        </p>

        {/* The tagline */}
        <p className="font-mono text-sm text-muted mb-10 italic">
          "{t('app_tagline')}"
        </p>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <button
            onClick={onStart}
            className="bg-terracotta text-white font-heading font-500 px-8 py-3 text-sm tracking-tight hover:bg-terracotta-700 transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            style={{ borderRadius: 2 }}
          >
            {t('hero_cta')} →
          </button>
          <span className="label-mono text-muted">{t('hero_note')}</span>
        </div>

        {/* Disclaimer strip */}
        <div className="mt-10 pt-4 border-t border-line">
          <p className="font-mono text-xs text-muted opacity-70 leading-relaxed max-w-2xl">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}
