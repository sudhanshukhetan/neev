import React from 'react';

export default function Skeleton({ lines = 4 }) {
  return (
    <div className="py-2 px-4 space-y-3" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: `${60 + (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}
