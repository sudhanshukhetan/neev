import React from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';

export default function StateToggle() {
  const t = useT();
  const stage = useNeevStore((s) => s.stage);
  const setStage = useNeevStore((s) => s.setStage);

  return (
    <div
      className="flex border border-line"
      role="group"
      aria-label="Current vs Planned state"
      style={{ borderRadius: 2 }}
    >
      {['current', 'planned'].map((s) => (
        <button
          key={s}
          onClick={() => setStage(s)}
          className={`font-mono text-xs px-3 py-1.5 transition-colors ${
            stage === s ? 'bg-ink text-white' : 'text-muted hover:text-ink bg-paper'
          }`}
          style={{ borderRadius: 1, minHeight: 32 }}
          aria-pressed={stage === s}
        >
          {s === 'current' ? t('state_current') : t('state_planned')}
        </button>
      ))}
    </div>
  );
}
