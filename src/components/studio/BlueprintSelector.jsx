import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { BLUEPRINTS } from '@shared/blueprints.js';

const BLUEPRINT_ICONS = {
  chandigarh: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="1" width="8" height="8" stroke="#0F172A" strokeWidth="1"/>
      <rect x="11" y="1" width="8" height="8" stroke="#0F172A" strokeWidth="1"/>
      <rect x="1" y="11" width="8" height="8" stroke="#0F172A" strokeWidth="1"/>
      <rect x="11" y="11" width="8" height="8" stroke="#0F172A" strokeWidth="1"/>
    </svg>
  ),
  jaipur: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 1 L19 10 L10 19 L1 10 Z" stroke="#0F172A" strokeWidth="1" fill="none"/>
      <path d="M10 5 L15 10 L10 15 L5 10 Z" stroke="#0F172A" strokeWidth="0.5" fill="none"/>
    </svg>
  ),
  ahmedabad: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="8" width="18" height="4" stroke="#0F172A" strokeWidth="1"/>
      <circle cx="4" cy="10" r="2" stroke="#0F172A" strokeWidth="1"/>
      <circle cx="16" cy="10" r="2" stroke="#0F172A" strokeWidth="1"/>
      <path d="M4 1 L4 7 M16 1 L16 7 M4 13 L4 19 M16 13 L16 19" stroke="#0F172A" strokeWidth="0.5" strokeDasharray="2 2"/>
    </svg>
  ),
};

export default function BlueprintSelector({ compact = false }) {
  const t = useT();
  const activeBlueprint = useNeevStore((s) => s.activeBlueprint);
  const blueprintModified = useNeevStore((s) => s.blueprintModified);
  const setBlueprint = useNeevStore((s) => s.setBlueprint);
  const baseline = useNeevStore((s) => s.baseline);

  if (compact) {
    return (
      <select
        value={activeBlueprint || ''}
        onChange={(e) => {
          const bp = BLUEPRINTS.find((b) => b.id === e.target.value);
          setBlueprint(bp || null);
        }}
        className="font-mono text-xs border border-line px-2 py-1 bg-paper"
        style={{ borderRadius: 1 }}
        aria-label={t('blueprint_title')}
      >
        <option value="">{t('blueprint_title')}</option>
        {BLUEPRINTS.map((bp) => (
          <option key={bp.id} value={bp.id}>{bp.name}</option>
        ))}
      </select>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="label-mono mb-3">{t('blueprint_title')}</div>

      {/* Modified chip */}
      {activeBlueprint && blueprintModified && (
        <div className="mb-2 font-mono text-xs text-terracotta border border-terracotta px-2 py-0.5 inline-block" style={{ borderRadius: 1 }}>
          {t('blueprint_modified_chip', { name: BLUEPRINTS.find((b) => b.id === activeBlueprint)?.name })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {BLUEPRINTS.map((bp) => (
          <button
            key={bp.id}
            onClick={() => setBlueprint(bp)}
            className={`text-left border p-2 transition-colors ${
              activeBlueprint === bp.id
                ? 'border-terracotta bg-terracotta-50'
                : 'border-line hover:border-ink'
            }`}
            style={{ borderRadius: 2 }}
          >
            <div className="mb-1">{BLUEPRINT_ICONS[bp.id]}</div>
            <div className="font-heading text-xs font-600 text-ink leading-tight mb-1">{bp.name}</div>
            <div className="font-mono text-xs text-muted leading-snug">{bp.tagline}</div>
          </button>
        ))}
      </div>

      {activeBlueprint && (
        <button
          onClick={() => { setBlueprint(null); useNeevStore.getState().resetLeversToBaseline(); }}
          className="mt-2 font-mono text-xs text-muted underline hover:text-ink transition-colors"
        >
          {t('blueprint_reset')}
        </button>
      )}
    </div>
  );
}
