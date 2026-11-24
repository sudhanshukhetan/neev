import React from 'react';

export default function Badge({ severity = 'moderate', children, icon = true }) {
  const styles = {
    critical: 'bg-crimson text-white border-crimson',
    high: 'bg-terracotta text-white border-terracotta',
    moderate: 'bg-amber text-white border-amber',
    pass: 'bg-emerald text-white border-emerald',
    watch: 'bg-amber text-white border-amber',
    fail: 'bg-crimson text-white border-crimson',
  };

  const icons = {
    critical: '■',
    high: '▲',
    moderate: '◆',
    pass: '✓',
    watch: '!',
    fail: '✕',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs px-2 py-0.5 border ${styles[severity] || styles.moderate}`}
      style={{ borderRadius: 1 }}
    >
      {icon && <span className="text-xs">{icons[severity]}</span>}
      <span className="uppercase tracking-wide">{children}</span>
    </span>
  );
}
