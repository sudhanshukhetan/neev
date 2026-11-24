import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { formatMin, formatPct, formatScore, formatCm, formatDelta, formatBand } from '../../lib/format.js';
import { explain } from '@shared/engine.js';

function ExplainPopover({ baseline, levers, assumptions, field }) {
  const [open, setOpen] = useState(false);
  const t = useT();

  const explanations = baseline && levers ? explain({ baseline, levers, assumptions }) : null;
  const text = explanations?.[field];

  if (!text) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="font-mono text-xs text-muted underline hover:text-ink transition-colors"
        aria-expanded={open}
      >
        {t('impact_how_calculated')}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-50 bg-ink text-white font-mono text-xs p-3 w-80 whitespace-pre-wrap leading-relaxed"
            style={{ borderRadius: 2 }}
          >
            {text}
            <button
              onClick={() => setOpen(false)}
              className="block mt-2 text-xs opacity-60 hover:opacity-100"
            >
              Close ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricRow({ label, before, after, unit, lowerIsBetter = true, explain: explainField, big = false }) {
  const delta = formatDelta(before, after, unit, lowerIsBetter);
  const baseline = useNeevStore((s) => s.baseline);
  const levers = useNeevStore((s) => s.levers);
  const assumptions = useNeevStore((s) => s.assumptions);

  return (
    <div className={`border-b border-line px-4 ${big ? 'py-4' : 'py-3'}`}>
      <div className="label-mono mb-1">{label}</div>
      <div className="flex items-end gap-4">
        <div>
          <div className="font-mono text-xs text-muted mb-0.5">Before</div>
          <div className={`font-mono ${big ? 'text-5xl font-600 text-ink' : 'text-xl font-600 text-muted'}`}
               style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {before ?? '—'}
          </div>
          {unit && <div className="font-mono text-xs text-muted">{unit}</div>}
        </div>
        <div className="text-muted text-xl font-mono">→</div>
        <div>
          <div className="font-mono text-xs text-muted mb-0.5">After</div>
          <div className={`font-mono ${big ? 'text-5xl font-700 text-ink' : 'text-2xl font-700 text-ink'}`}
               style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {after ?? '—'}
          </div>
          {unit && <div className="font-mono text-xs text-muted">{unit}</div>}
        </div>
        {delta && (
          <div className={`font-mono text-sm px-1.5 py-0.5 ml-auto self-start ${
            delta.better ? 'bg-emerald-50 text-emerald' : 'bg-crimson-50 text-crimson'
          }`} style={{ borderRadius: 1 }}>
            {delta.text}
          </div>
        )}
      </div>
      {explainField && (
        <div className="mt-1">
          <ExplainPopover baseline={baseline} levers={levers} assumptions={assumptions} field={explainField} />
        </div>
      )}
    </div>
  );
}

export default function ImpactPanel() {
  const t = useT();
  const current = useNeevStore((s) => s.current);
  const planned = useNeevStore((s) => s.planned);
  const hasAudit = useNeevStore((s) => s.hasAudit);

  if (!hasAudit || !current || !planned) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-32">
        <div className="font-mono text-xs text-muted opacity-60 italic text-center">{t('empty_impact')}</div>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      {/* Hero metric: Response Time */}
      <MetricRow
        label={t('impact_response_time')}
        before={current.responseMin}
        after={planned.responseMin}
        unit={t('impact_response_unit')}
        lowerIsBetter
        explain="fire"
        big
      />

      <MetricRow
        label={t('impact_flood_risk')}
        before={current.floodRiskPct}
        after={planned.floodRiskPct}
        unit={t('impact_flood_unit')}
        lowerIsBetter
        explain="flood"
      />

      <MetricRow
        label={t('impact_flood_depth')}
        before={current.floodDepthCm}
        after={planned.floodDepthCm}
        unit={t('impact_flood_depth_unit')}
        lowerIsBetter
        explain="flood"
      />

      <MetricRow
        label={t('impact_safety')}
        before={current.safetyIndex}
        after={planned.safetyIndex}
        unit={t('impact_safety_unit')}
        lowerIsBetter={false}
        explain="safety"
      />

      {/* Cost */}
      <div className="border-b border-line px-4 py-3">
        <div className="label-mono mb-1">{t('impact_cost')}</div>
        <div className="font-mono text-lg font-600 text-ink" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {planned.costMidCr != null
            ? `Rs. ${planned.costMidCr.toFixed(1)} Cr`
            : '—'}
        </div>
        {planned.costLowCr != null && planned.costHighCr != null && (
          <div className="font-mono text-xs text-muted">
            ({planned.costLowCr.toFixed(1)} to {planned.costHighCr.toFixed(1)}) Cr ±40%
          </div>
        )}
        <ExplainPopover
          baseline={useNeevStore.getState().baseline}
          levers={useNeevStore.getState().levers}
          assumptions={useNeevStore.getState().assumptions}
          field="cost"
        />
      </div>
    </div>
  );
}
