import React, { useMemo } from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { LEVERS, LEVER_GROUPS } from '@shared/levers.js';

const GROUP_LABELS = {
  streets: 'lever_group_streets',
  water: 'lever_group_water',
  buildings: 'lever_group_buildings',
  utilities: 'lever_group_utilities',
};

function LeverSlider({ lever }) {
  const t = useT();
  const value = useNeevStore((s) => s.levers[lever.id]);
  const setLever = useNeevStore((s) => s.setLever);
  const baseline = useNeevStore((s) => s.baseline);

  // Baseline implied value for this lever
  const baselineValue = useMemo(() => {
    if (!baseline) return lever.min;
    const map = {
      roadWidthM: baseline.laneWidthM,
      footpathM: 0,
      greenPct: baseline.greenPct,
      maxFloors: baseline.floorsAvg,
      coveredDrainPct: baseline.drainCondition === 'covered' ? 80 : baseline.drainCondition === 'open' ? 20 : 0,
      rechargePits: 0,
      obstructionClearPct: 0,
      undergroundUtilPct: baseline.wiresVisible ? 0 : 60,
      retrofitPct: 0,
    };
    return map[lever.id] ?? lever.min;
  }, [baseline, lever.id, lever.min]);

  const pct = ((value - lever.min) / (lever.max - lever.min)) * 100;
  const baselinePct = ((baselineValue - lever.min) / (lever.max - lever.min)) * 100;
  const delta = value - baselineValue;
  const deltaSign = delta > 0 ? '+' : '';

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-line last:border-b-0 group">
      <div className="flex-shrink-0 w-28">
        <div className="font-mono text-xs text-ink leading-tight">{t(lever.labelKey)}</div>
        {delta !== 0 && (
          <div className={`font-mono text-xs ${delta > 0 ? 'text-emerald' : 'text-crimson'}`}>
            {deltaSign}{delta.toFixed(lever.step < 1 ? 1 : 0)} {lever.unit}
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {/* Baseline tick */}
        {baseline && (
          <div
            className="absolute top-0 bottom-0 w-px bg-terracotta opacity-60 pointer-events-none"
            style={{ left: `${baselinePct}%` }}
            title={`${t('lever_baseline_tick')}: ${baselineValue} ${lever.unit}`}
          />
        )}
        <input
          type="range"
          min={lever.min}
          max={lever.max}
          step={lever.step}
          value={value}
          onChange={(e) => setLever(lever.id, parseFloat(e.target.value))}
          aria-label={t(lever.labelKey)}
          aria-valuetext={`${value} ${lever.unit}`}
          aria-valuemin={lever.min}
          aria-valuemax={lever.max}
          className="w-full"
        />
      </div>

      <div className="flex-shrink-0 w-14 text-right">
        <span className="font-mono text-xs text-ink">{value}</span>
        <span className="font-mono text-xs text-muted"> {lever.unit}</span>
      </div>
    </div>
  );
}

export default function LeverPanel({ compact = false }) {
  const t = useT();
  const baseline = useNeevStore((s) => s.baseline);
  const resetLeversToBaseline = useNeevStore((s) => s.resetLeversToBaseline);

  if (!baseline) {
    return (
      <div className="p-4 font-mono text-xs text-muted opacity-60 italic text-center">
        {t('audit_empty')}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center px-4 py-2 border-b border-line">
        <span className="label-mono flex-1">{t('lever_panel_title')}</span>
        <button
          onClick={resetLeversToBaseline}
          className="font-mono text-xs text-muted hover:text-ink underline transition-colors"
        >
          {t('lever_reset')}
        </button>
      </div>

      {Object.entries(LEVER_GROUPS).map(([groupId, leverIds]) => (
        <div key={groupId}>
          <div className="px-4 py-1.5 bg-paper border-b border-line">
            <span className="label-mono text-muted">{t(GROUP_LABELS[groupId])}</span>
          </div>
          {leverIds.map((id) => {
            const lever = LEVERS.find((l) => l.id === id);
            if (!lever) return null;
            return <LeverSlider key={id} lever={lever} />;
          })}
        </div>
      ))}
    </div>
  );
}
