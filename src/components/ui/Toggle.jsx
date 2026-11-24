import React from 'react';

export default function Toggle({ options, value, onChange, ariaLabel }) {
  return (
    <div className="inline-flex border border-line" style={{ borderRadius: 2 }} role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`font-mono text-xs px-3 py-1.5 transition-colors ${
            value === opt.value ? 'bg-ink text-white' : 'text-muted hover:text-ink bg-paper'
          }`}
          style={{ borderRadius: 1, minHeight: 32 }}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
