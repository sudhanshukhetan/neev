import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { formatPct, formatM, formatScore } from '../../lib/format.js';
import Skeleton from '../ui/Skeleton.jsx';

function SeveritySquare({ status }) {
  const cls = {
    critical: 'bg-crimson',
    high: 'bg-terracotta',
    moderate: 'bg-amber',
    pass: 'bg-emerald',
    watch: 'bg-amber',
    fail: 'bg-crimson',
  };
  return <span className={`inline-block w-2 h-2 rounded-sm flex-shrink-0 ${cls[status] || 'bg-muted'}`} />;
}

function getRoadSeverity(clearWidthM) {
  if (clearWidthM < 3.5) return 'critical';
  if (clearWidthM < 6) return 'high';
  return 'moderate';
}

function getSafetySeverity(score) {
  if (score < 40) return 'critical';
  if (score < 60) return 'high';
  return 'moderate';
}

function getFloodSeverity(pct) {
  if (pct > 70) return 'critical';
  if (pct > 40) return 'high';
  return 'moderate';
}

function getHeatSeverity(idx) {
  if (idx > 70) return 'high';
  return 'moderate';
}

export default function AuditPanel() {
  const t = useT();
  const isAuditing = useNeevStore((s) => s.isAuditing);
  const current = useNeevStore((s) => s.current);
  const baseline = useNeevStore((s) => s.baseline);

  if (isAuditing) {
    return (
      <div className="p-4">
        <div className="label-mono mb-3">{t('audit_loading')}</div>
        <Skeleton lines={6} />
      </div>
    );
  }

  if (!baseline || !current) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 border-b border-line pb-2">
          <span className="label-mono">{t('audit_panel_title')}</span>
        </div>
        <div className="font-mono text-xs text-muted opacity-60 italic py-4 text-center">
          {t('audit_empty')}
        </div>
      </div>
    );
  }

  const { clearWidthM, floodRiskPct, safetyIndex, heatIndex } = current;

  const hazards = [
    {
      label: t('audit_hazard_road'),
      value: formatM(clearWidthM),
      note: t('audit_hazard_road_note'),
      severity: getRoadSeverity(clearWidthM),
    },
    {
      label: t('audit_hazard_structural'),
      value: formatScore(safetyIndex),
      note: t('audit_hazard_structural_note'),
      severity: getSafetySeverity(safetyIndex),
    },
    {
      label: t('audit_hazard_flood'),
      value: formatPct(floodRiskPct),
      note: t('audit_hazard_flood_note'),
      severity: getFloodSeverity(floodRiskPct),
    },
    {
      label: t('audit_hazard_green'),
      value: heatIndex,
      note: t('audit_hazard_green_note'),
      severity: getHeatSeverity(heatIndex),
    },
  ];

  return (
    <div>
      <div className="flex items-center px-4 py-2 border-b border-line">
        <span className="label-mono">{t('audit_panel_title')}</span>
      </div>

      {/* Ruled hazard table */}
      <table className="ruled-table w-full">
        <thead>
          <tr>
            <th className="text-left w-1/2">Hazard</th>
            <th className="text-right w-1/4">Value</th>
            <th className="text-right w-1/4">Status</th>
          </tr>
        </thead>
        <tbody>
          {hazards.map((h) => (
            <tr key={h.label} className="border-b border-line last:border-b-0 group">
              <td className="px-3 py-2">
                <div className="font-ui text-xs text-ink font-500">{h.label}</div>
                <div className="font-mono text-xs text-muted opacity-70 mt-0.5 leading-snug hidden group-hover:block">
                  {h.note}
                </div>
              </td>
              <td className="px-3 py-2 text-right">
                <span className="font-mono text-sm text-ink">{h.value}</span>
              </td>
              <td className="px-3 py-2 text-right">
                <span className="flex items-center justify-end gap-1.5">
                  <SeveritySquare status={h.severity} />
                  <span className="font-mono text-xs" style={{
                    color: h.severity === 'critical' ? 'var(--crimson)' : h.severity === 'high' ? 'var(--terracotta)' : 'var(--amber)'
                  }}>
                    {t(`severity_${h.severity}`)}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
