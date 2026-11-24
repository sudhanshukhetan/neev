import React from 'react';

export default function Slider({ label, value, min, max, step = 1, unit = '', onChange, ariaLabel }) {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-1">
        <label className="font-mono text-xs text-ink">{label}</label>
        <span className="font-mono text-xs text-muted font-500">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={ariaLabel || label}
        aria-valuetext={`${value} ${unit}`}
        aria-valuemin={min}
        aria-valuemax={max}
        className="w-full"
      />
    </div>
  );
}
