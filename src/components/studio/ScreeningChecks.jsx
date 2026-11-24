import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';

function StatusSquare({ status }) {
  const colors = { pass: 'bg-emerald', watch: 'bg-amber', fail: 'bg-crimson' };
  return <span className={`inline-block w-2 h-2 rounded-sm flex-shrink-0 ${colors[status] || 'bg-muted'}`} />;
}

export default function ScreeningChecks() {
  const t = useT();
  const planned = useNeevStore((s) => s.planned);
  const hasAudit = useNeevStore((s) => s.hasAudit);

  if (!hasAudit || !planned) return null;

  const checks = planned.screening || [];

  return (
    <div>
      <div className="flex items-center px-4 py-2 border-b border-line">
        <span className="label-mono flex-1">{t('screening_title')}</span>
      </div>

      <table className="ruled-table w-full text-xs">
        <thead>
          <tr>
            <th>Check</th>
            <th className="text-right">Value</th>
            <th className="text-right">Threshold</th>
            <th className="text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.id} className="border-b border-line last:border-b-0 group">
              <td className="px-3 py-2">
                <div className="font-mono text-xs text-ink">{c.label}</div>
                <div className="font-mono text-xs text-muted opacity-60 hidden group-hover:block">{c.basis}</div>
              </td>
              <td className="px-3 py-2 text-right font-mono text-xs text-ink">
                {typeof c.value === 'number' ? c.value.toFixed(1) : c.value} {c.unit}
              </td>
              <td className="px-3 py-2 text-right font-mono text-xs text-muted">
                {typeof c.threshold === 'number' ? c.threshold.toFixed(1) : c.threshold} {c.unit}
              </td>
              <td className="px-3 py-2 text-right">
                <span className="flex items-center justify-end gap-1">
                  <StatusSquare status={c.status} />
                  <span className={`font-mono text-xs ${
                    c.status === 'pass' ? 'text-emerald' : c.status === 'watch' ? 'text-amber' : 'text-crimson'
                  }`}>
                    {t(`severity_${c.status}`)}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Disclaimer */}
      <div className="px-4 py-3 border-t border-line">
        <p className="font-mono text-xs text-muted opacity-70 leading-relaxed italic">
          {t('screening_disclaimer')}
        </p>
      </div>
    </div>
  );
}
