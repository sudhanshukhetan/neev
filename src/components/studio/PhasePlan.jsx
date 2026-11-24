import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';

export default function PhasePlan() {
  const t = useT();
  const phases = useNeevStore((s) => s.phases);
  const hasAudit = useNeevStore((s) => s.hasAudit);

  if (!hasAudit || !phases) return null;

  const PHASE_LABELS = { p1: t('phase_p1'), p2: t('phase_p2'), p3: t('phase_p3') };
  const PHASE_COLORS = { p1: 'bg-emerald', p2: 'bg-terracotta', p3: 'bg-amber' };

  // Story headline: Phase 1 flood reduction
  const p1Phase = phases.find((p) => p.id === 'p1');
  const currentPhaseMetrics = phases[0]?.metricsAfter;
  const p3Phase = phases.find((p) => p.id === 'p3');

  const p1FloodReduction = p1Phase && p3Phase
    ? Math.round(((p3Phase.metricsAfter.floodRiskPct - p1Phase.metricsAfter.floodRiskPct) / p3Phase.metricsAfter.floodRiskPct) * 100 * -1)
    : null;

  return (
    <div>
      <div className="flex items-center px-4 py-2 border-b border-line">
        <span className="label-mono">{t('phase_title')}</span>
      </div>

      {/* Story headline */}
      {p1Phase && p1FloodReduction != null && (
        <div className="px-4 py-3 border-b border-line bg-paper">
          <p className="font-mono text-xs text-ink leading-relaxed">
            {t('phase_story', {
              pct: Math.abs(p1FloodReduction),
              cost: p1Phase.incrementalCost?.midCr?.toFixed(1) || '—',
            })}
          </p>
        </div>
      )}

      {/* Phase Gantt */}
      <div className="px-4 py-3 space-y-4">
        {phases.map((phase, idx) => {
          const cost = phase.incrementalCost;
          const metrics = phase.metricsAfter;
          return (
            <div key={phase.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${PHASE_COLORS[phase.id] || 'bg-muted'}`} />
                <span className="font-heading text-xs font-600 text-ink">{PHASE_LABELS[phase.id] || phase.name}</span>
                <span className="font-mono text-xs text-muted ml-auto">
                  {t('phase_months', { from: phase.months[0], to: phase.months[1] })}
                </span>
              </div>

              {/* Gantt bar */}
              <div className="relative h-4 bg-line overflow-hidden mb-1" style={{ borderRadius: 1 }}>
                <div
                  className={`absolute top-0 bottom-0 ${PHASE_COLORS[phase.id] || 'bg-muted'} opacity-70`}
                  style={{
                    left: `${(phase.months[0] / 36) * 100}%`,
                    width: `${((phase.months[1] - phase.months[0]) / 36) * 100}%`,
                  }}
                />
              </div>

              {/* Cost */}
              {cost && (
                <div className="font-mono text-xs text-ink mb-1">
                  Rs. {cost.midCr.toFixed(1)} Cr ({cost.lowCr.toFixed(1)}–{cost.highCr.toFixed(1)}) ±40%
                </div>
              )}

              {/* Key metrics after phase */}
              {metrics && (
                <div className="flex gap-3 flex-wrap">
                  <span className="font-mono text-xs text-muted">
                    Response: <span className="text-ink">{metrics.responseMin} min</span>
                  </span>
                  <span className="font-mono text-xs text-muted">
                    Flood: <span className="text-ink">{metrics.floodRiskPct}%</span>
                  </span>
                  <span className="font-mono text-xs text-muted">
                    Safety: <span className="text-ink">{metrics.safetyIndex}/100</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline scale */}
      <div className="px-4 pb-2 flex justify-between">
        <span className="font-mono text-xs text-muted">Month 0</span>
        <span className="font-mono text-xs text-muted">Month 18</span>
        <span className="font-mono text-xs text-muted">Month 36</span>
      </div>
    </div>
  );
}
