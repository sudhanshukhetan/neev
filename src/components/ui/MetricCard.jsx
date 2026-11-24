import React from 'react';
import { formatDelta } from '../../lib/format.js';

export default function MetricCard({ label, before, after, unit, lowerIsBetter = true, note }) {
  const delta = formatDelta(before, after, unit, lowerIsBetter);

  return (
    <div className="p-4 border-b border-line bg-card">
      <div className="label-mono mb-2">{label}</div>
      <div className="flex items-baseline gap-3">
        <div className="font-mono text-sm text-muted">
          {before ?? '—'} {unit}
        </div>
        <div className="text-muted font-mono">→</div>
        <div className="font-mono text-2xl font-700 text-ink" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {after ?? '—'} <span className="text-sm font-normal text-muted">{unit}</span>
        </div>
        {delta && (
          <div
            className={`font-mono text-xs px-2 py-0.5 ml-auto ${
              delta.better ? 'bg-emerald-50 text-emerald' : 'bg-crimson-50 text-crimson'
            }`}
            style={{ borderRadius: 1 }}
          >
            {delta.text}
          </div>
        )}
      </div>
      {note && <div className="font-mono text-xs text-muted mt-1 opacity-70">{note}</div>}
    </div>
  );
}
