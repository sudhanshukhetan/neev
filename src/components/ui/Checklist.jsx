import React from 'react';

export default function Checklist({ items }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-1.5 px-3 border-b border-line text-xs font-mono">
          <span className="text-ink">{item.label}</span>
          <span className={`px-2 py-0.5 rounded-sm uppercase text-2xs ${
            item.status === 'pass' ? 'bg-emerald-50 text-emerald' : item.status === 'watch' ? 'bg-amber-50 text-amber' : 'bg-crimson-50 text-crimson'
          }`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}
