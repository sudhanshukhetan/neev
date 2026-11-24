import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { ASSUMPTIONS_LIST, DEFAULT_ASSUMPTIONS } from '@shared/assumptions.js';

export default function AssumptionsDrawer({ open }) {
  const t = useT();
  const assumptionOverrides = useNeevStore((s) => s.assumptionOverrides);
  const setAssumption = useNeevStore((s) => s.setAssumption);
  const resetAssumptions = useNeevStore((s) => s.resetAssumptions);
  const setAssumptionsOpen = useNeevStore((s) => s.setAssumptionsOpen);
  const assumptions = useNeevStore((s) => s.assumptions);

  if (!open) return null;

  const hasOverrides = Object.keys(assumptionOverrides).length > 0;

  return (
    <div className="fixed inset-0 z-40 flex" aria-modal="true" role="dialog" aria-label={t('assumptions_title')}>
      {/* Backdrop */}
      <div className="flex-1 bg-ink opacity-30" onClick={() => setAssumptionsOpen(false)} />

      {/* Drawer */}
      <div className="bg-card border-l border-line w-full max-w-lg overflow-y-auto flex flex-col shadow-none">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-line flex-shrink-0">
          <span className="label-mono flex-1">{t('assumptions_title')}</span>
          {hasOverrides && (
            <button
              onClick={resetAssumptions}
              className="font-mono text-xs text-crimson underline mr-4"
            >
              {t('assumptions_reset_all')}
            </button>
          )}
          <button
            onClick={() => setAssumptionsOpen(false)}
            className="font-mono text-sm text-muted hover:text-ink"
            aria-label="Close assumptions drawer"
          >
            ×
          </button>
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-3 bg-paper border-b border-line">
          <p className="font-mono text-xs text-muted opacity-70 italic leading-relaxed">
            {t('screening_disclaimer')}
          </p>
        </div>

        {/* Table */}
        <table className="ruled-table flex-1 text-xs">
          <thead>
            <tr>
              <th>Assumption</th>
              <th className="text-right">Value</th>
              <th className="text-right">Default</th>
              <th className="text-right">Unit</th>
            </tr>
          </thead>
          <tbody>
            {ASSUMPTIONS_LIST.map((a) => {
              const isEdited = a.id in assumptionOverrides;
              const currentVal = assumptions[a.id];
              return (
                <tr key={a.id} className={`border-b border-line last:border-b-0 group ${isEdited ? 'bg-amber-50' : ''}`}>
                  <td className="px-3 py-2">
                    <div className="font-mono text-xs text-ink">{a.label}</div>
                    <div className="font-mono text-xs text-muted opacity-60 hidden group-hover:block leading-snug">{a.note}</div>
                    {isEdited && <span className="font-mono text-xs text-amber">{t('assumptions_edited')} *</span>}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {a.editable ? (
                      <input
                        type="number"
                        min={a.min}
                        max={a.max}
                        step={Math.abs(a.max - a.min) > 10 ? 1 : 0.1}
                        value={currentVal}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (isFinite(v)) setAssumption(a.id, v);
                        }}
                        className={`font-mono text-xs w-16 text-right border-b border-line bg-transparent outline-none focus:border-terracotta ${isEdited ? 'text-amber' : 'text-ink'}`}
                        aria-label={a.label}
                      />
                    ) : (
                      <span className="font-mono text-xs text-muted">{currentVal}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-muted">
                    {DEFAULT_ASSUMPTIONS[a.id]}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-muted">
                    {a.unit || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
