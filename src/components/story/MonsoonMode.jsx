import React, { useState, useEffect, useRef } from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { computeFlood } from '@shared/engine.js';

export default function MonsoonMode() {
  const t = useT();
  const baseline = useNeevStore((s) => s.baseline);
  const levers = useNeevStore((s) => s.levers);
  const assumptions = useNeevStore((s) => s.assumptions);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rainfall, setRainfall] = useState(60);
  const [hour, setHour] = useState(0); // 0..3 hours simulated
  const timerRef = useRef(null);

  if (!baseline) return null;

  // Flood for planned state at current rainfall
  const plannedFlood = computeFlood({ baseline, levers, assumptions, rainMmHr: rainfall });

  // Current state flood
  const currentLevers = {
    roadWidthM: baseline.laneWidthM, footpathM: 0, greenPct: baseline.greenPct,
    maxFloors: baseline.floorsAvg, coveredDrainPct: 0, rechargePits: 0,
    obstructionClearPct: 0, undergroundUtilPct: 0, retrofitPct: 0,
  };
  const currentFlood = computeFlood({ baseline, levers: currentLevers, assumptions, rainMmHr: rainfall });

  // Depth at current hour (rise during storm, then drain)
  const getDepth = (flood, h) => {
    if (h <= 1) return flood.floodDepthCm * h; // fills over 1 hour
    return flood.floodDepthCm * Math.max(0, 1 - (h - 1) / flood.hoursToDrain);
  };

  const currentDepth = getDepth(currentFlood, hour);
  const plannedDepth = getDepth(plannedFlood, hour);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setHour((h) => {
          if (h >= 3) { setPlaying(false); return 3; }
          return Math.min(h + 0.05, 3);
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  const reset = () => { setPlaying(false); setHour(0); };

  const MAX_DEPTH_CM = assumptions.depthCapCm || 60;
  const GAUGE_H = 100; // px

  const renderGauge = (depth, label, color) => {
    const fillH = Math.min((depth / MAX_DEPTH_CM) * GAUGE_H, GAUGE_H);
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="font-mono text-xs text-slate-300">{label}</div>
        <div className="relative border border-white/20 bg-black/40 rounded" style={{ width: 32, height: GAUGE_H }}>
          {/* Sill at 30cm */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-red-500 opacity-80"
            style={{ bottom: (30 / MAX_DEPTH_CM) * GAUGE_H }}
          />
          {/* Water fill */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all rounded-b"
            style={{ height: fillH, background: color, opacity: 0.8 }}
          />
        </div>
        <div className="font-mono text-xs font-semibold" style={{ color }}>{depth.toFixed(0)} cm</div>
        {depth > 30 && <div className="font-mono text-[10px] text-red-400 font-bold">⚠ Sill Breach</div>}
      </div>
    );
  };

  return (
    <div className="relative">
      {!active ? (
        <button
          onClick={() => setActive(true)}
          className="px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5"
        >
          <span>🌧 {t('monsoon_btn')}</span>
        </button>
      ) : (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 hud-panel p-3 w-80 text-white shadow-2xl border border-white/20">
      <div className="flex items-center gap-3 mb-2">
        <span className="label-mono flex-1">🌧 {t('monsoon_btn')}</span>
        <button onClick={() => { setActive(false); reset(); }} className="font-mono text-xs text-muted">×</button>
      </div>

      {/* Rainfall slider */}
      <div className="mb-2">
        <div className="label-mono mb-1">{t('monsoon_rainfall_label')}</div>
        <div className="flex items-center gap-2">
          <input
            type="range" min={20} max={120} step={5} value={rainfall}
            onChange={(e) => setRainfall(Number(e.target.value))}
            className="flex-1"
            aria-label={t('monsoon_rainfall_label')}
            aria-valuetext={`${rainfall} ${t('monsoon_rainfall_unit')}`}
          />
          <span className="font-mono text-xs text-ink w-16">{rainfall} {t('monsoon_rainfall_unit')}</span>
        </div>
      </div>

      {/* Gauges */}
      <div className="flex gap-6 justify-center mb-2">
        {renderGauge(currentDepth, 'Current', '#DC2626')}
        {renderGauge(plannedDepth, 'Planned', '#059669')}
      </div>

      {/* Stats */}
      <div className="font-mono text-xs text-muted mb-2">
        {t('monsoon_hours_drain')}: {plannedFlood.hoursToDrain.toFixed(1)} hr |
        Peak {t('monsoon_peak_depth')}: {plannedFlood.floodDepthCm.toFixed(0)} cm
      </div>

      {/* Timeline */}
      <div className="label-mono mb-1">Hour: {hour.toFixed(1)} / 3.0</div>
      <div className="bg-line h-1.5 mb-2" style={{ borderRadius: 1 }}>
        <div className="bg-terracotta h-full" style={{ width: `${(hour / 3) * 100}%`, borderRadius: 1 }} />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex-1 bg-ink text-white font-mono text-xs py-1.5"
          style={{ borderRadius: 1 }}
        >
          {playing ? t('monsoon_pause') : t('monsoon_play')}
        </button>
        <button
          onClick={reset}
          className="font-mono text-xs text-muted px-2 border border-line"
          style={{ borderRadius: 1 }}
        >
          ↺
        </button>
      </div>
        </div>
      )}
    </div>
  );
}
