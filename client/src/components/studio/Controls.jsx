import React from 'react';
import StateToggle from './StateToggle.jsx';
import BlueprintSelector from './BlueprintSelector.jsx';
import { useNeevStore } from '../../store/useNeevStore.js';

export default function Controls() {
  const setAssumptionsOpen = useNeevStore((s) => s.setAssumptionsOpen);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-card border-b border-line">
      <StateToggle />
      <div className="flex-1" />
      <BlueprintSelector compact />
      <button
        onClick={() => setAssumptionsOpen(true)}
        className="label-mono text-muted hover:text-ink px-2 py-1 border border-line"
      >
        Assumptions ↗
      </button>
    </div>
  );
}
