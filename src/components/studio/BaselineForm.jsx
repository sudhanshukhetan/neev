import React, { useState } from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';

const DRAIN_OPTIONS = ['none', 'open', 'clogged', 'covered'];

function ConfidenceChip({ confidence, source, t }) {
  if (source === 'preset') return <span className="font-mono text-xs text-muted px-1 border border-line">{t('baseline_source_preset')}</span>;
  if (source === 'verified-engine') return <span className="font-mono text-xs text-muted px-1 border border-line">{t('baseline_source_engine')}</span>;
  if (confidence == null) return null;
  const low = confidence < 0.6;
  return (
    <span className={`font-mono text-xs px-1 border ${low ? 'border-amber text-amber' : 'border-muted text-muted'}`}>
      {low ? t('baseline_low_confidence') : t('baseline_source_photo')}
    </span>
  );
}

export default function BaselineForm() {
  const t = useT();
  const baseline = useNeevStore((s) => s.baseline);
  const setBaseline = useNeevStore((s) => s.setBaseline);
  const [editing, setEditing] = useState({});

  if (!baseline) return null;

  const update = (field, value) => {
    const updated = { ...baseline, [field]: value, source: 'manual', confidence: { ...baseline.confidence, [field]: 1.0 } };
    setBaseline(updated);
    setEditing((p) => ({ ...p, [field]: false }));
  };

  const Field = ({ field, label, type = 'number', min, max, step, options }) => {
    const [local, setLocal] = useState(baseline[field]);
    const conf = baseline.confidence?.[field];
    const src = baseline.source;
    return (
      <tr className="border-b border-line last:border-b-0">
        <td className="px-3 py-2">
          <span className="font-mono text-xs text-muted">{label}</span>
        </td>
        <td className="px-3 py-2 font-mono text-xs text-ink">
          {type === 'boolean' ? (
            <input
              type="checkbox"
              checked={!!baseline[field]}
              onChange={(e) => update(field, e.target.checked)}
              className="accent-terracotta w-4 h-4"
              aria-label={label}
            />
          ) : type === 'select' ? (
            <select
              value={baseline[field]}
              onChange={(e) => update(field, e.target.value)}
              className="font-mono text-xs border border-line px-1 py-0.5 bg-paper"
              style={{ borderRadius: 1 }}
              aria-label={label}
            >
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              type="number"
              value={local}
              min={min}
              max={max}
              step={step || 0.1}
              onChange={(e) => setLocal(e.target.value)}
              onBlur={() => {
                const v = parseFloat(local);
                if (isFinite(v)) update(field, Math.min(max || 999, Math.max(min || 0, v)));
              }}
              className="font-mono text-xs border-b border-line bg-transparent w-16 outline-none focus:border-terracotta"
              aria-label={label}
            />
          )}
        </td>
        <td className="px-3 py-2">
          <ConfidenceChip confidence={conf} source={src} t={t} />
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="flex items-center px-4 py-2 border-b border-line">
        <span className="label-mono">{t('baseline_title')}</span>
      </div>
      <div className="font-mono text-xs text-muted px-4 py-2 italic border-b border-line">
        {t('baseline_note')}
      </div>
      <table className="ruled-table w-full text-xs">
        <tbody>
          <Field field="laneWidthM" label={t('baseline_field_laneWidth')} min={1} max={20} step={0.1} />
          <Field field="obstructionM" label={t('baseline_field_obstruction')} min={0} max={5} step={0.1} />
          <Field field="drainCondition" label={t('baseline_field_drain')} type="select" options={DRAIN_OPTIONS} />
          <Field field="greenPct" label={t('baseline_field_green')} min={0} max={100} step={1} />
          <Field field="floorsAvg" label={t('baseline_field_floors')} min={1} max={8} step={1} />
          <Field field="wiresVisible" label={t('baseline_field_wires')} type="boolean" />
          <Field field="buildingConditionScore" label={t('baseline_field_condition')} min={0} max={100} step={1} />
        </tbody>
      </table>
    </div>
  );
}
