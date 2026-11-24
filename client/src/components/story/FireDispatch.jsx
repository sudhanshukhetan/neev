import React, { useState, useRef, useEffect } from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { computeFire } from '@shared/engine.js';

export default function FireDispatch() {
  const t = useT();
  const baseline = useNeevStore((s) => s.baseline);
  const levers = useNeevStore((s) => s.levers);
  const assumptions = useNeevStore((s) => s.assumptions);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [blocked, setBlocked] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);

  if (!baseline) return null;

  const currentFire = computeFire({ baseline, levers: {
    roadWidthM: baseline.laneWidthM, footpathM: 0, obstructionClearPct: 0,
    ...Object.fromEntries(['greenPct','maxFloors','coveredDrainPct','rechargePits','undergroundUtilPct','retrofitPct'].map(k => [k, levers[k]]))
  }, assumptions });

  const plannedFire = computeFire({ baseline, levers, assumptions });

  const handleDispatch = () => {
    // Check prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setActive(true);
    setProgress(0);

    if (reduced) {
      // Jump to end state
      setProgress(plannedFire.fireOk ? 1 : currentFire.clearWidthM / (currentFire.clearWidthM + 1));
      setBlocked(!plannedFire.fireOk);
      return;
    }

    const duration = Math.min(plannedFire.responseMin * 500, 6000); // max 6s animation
    startRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      // Check if blocked
      if (!plannedFire.fireOk && p > 0.5) {
        setBlocked(true);
        setProgress(0.5);
        return;
      }

      if (p < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  const reset = () => {
    setActive(false);
    setProgress(0);
    setBlocked(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  return (
    <div className="bg-card border border-line" style={{ borderRadius: 2 }}>
      {!active ? (
        <button
          onClick={handleDispatch}
          className="px-4 py-2 font-mono text-xs text-ink hover:bg-paper transition-colors"
          style={{ minHeight: 36 }}
        >
          🚒 {t('fire_dispatch_btn')}
        </button>
      ) : (
        <div className="p-3 w-72">
          {/* Tender animation (top-down SVG) */}
          <div className="relative h-8 bg-paper border border-line mb-2" style={{ borderRadius: 1 }}>
            {/* Road strip */}
            <div className="absolute inset-y-0 left-0 right-0 bg-gray-200" style={{ top: '30%', bottom: '30%' }} />

            {/* Obstruction if blocked */}
            {!plannedFire.fireOk && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-crimson opacity-80"
                style={{ left: '50%' }}
              />
            )}

            {/* Fire tender rect */}
            <div
              className={`absolute top-1 bottom-1 w-6 transition-all ${blocked ? 'bg-crimson' : 'bg-terracotta'}`}
              style={{
                left: `${progress * 85}%`,
                borderRadius: 1,
                transition: blocked ? 'none' : undefined,
              }}
            />
          </div>

          {blocked ? (
            <div className="font-mono text-xs text-crimson font-600">
              {t('fire_dispatch_blocked', { clearM: currentFire.clearWidthM.toFixed(1), neededM: assumptions.fireTenderClearM.toFixed(1) })}
            </div>
          ) : progress >= 1 ? (
            <div className="font-mono text-xs text-emerald font-600">
              {t('fire_dispatch_clear', { min: plannedFire.responseMin.toFixed(1) })}
            </div>
          ) : (
            <div className="font-mono text-xs text-muted">
              {t('fire_dispatch_speed', { speed: plannedFire.speedKmh.toFixed(0) })}
            </div>
          )}

          {/* Before/after comparison */}
          <div className="font-mono text-xs text-muted mt-1">
            {t('fire_dispatch_before_after', { before: currentFire.responseMin.toFixed(1), after: plannedFire.responseMin.toFixed(1) })}
          </div>

          <button onClick={reset} className="mt-2 font-mono text-xs text-muted underline">
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
