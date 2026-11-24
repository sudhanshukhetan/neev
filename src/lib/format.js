/**
 * client/src/lib/format.js
 * Formatting utilities for Neev UI numbers.
 * Uses JetBrains Mono (applied via CSS class).
 */

/** Format cost as "₹ 12.4 Cr" with ±40% band */
export function formatCost(mid, { low, high, short = false } = {}) {
  const fmtCr = (v) => v == null ? '—' : `${v.toFixed(1)}`;
  if (short) return `₹\u00A0${fmtCr(mid)}\u00A0Cr`;
  if (low != null && high != null) {
    return `Rs. ${fmtCr(mid)} Cr  (${fmtCr(low)} to ${fmtCr(high)})`;
  }
  return `Rs. ${fmtCr(mid)} Cr`;
}

/** Render rupee symbol (fallback for PDF where Devanagari glyphs are not embedded) */
export function formatCostPDF(mid, low, high) {
  if (mid == null) return '—';
  const f = (v) => v.toFixed(1);
  return `Rs. ${f(mid)} Cr (${f(low)} to ${f(high)})`;
}

export function formatPct(v) {
  if (v == null) return '—';
  return `${Math.round(v)}%`;
}

export function formatM(v) {
  if (v == null) return '—';
  return `${Number(v).toFixed(1)} m`;
}

export function formatMin(v) {
  if (v == null) return '—';
  return `${Number(v).toFixed(1)} min`;
}

export function formatScore(v) {
  if (v == null) return '—';
  return `${Math.round(v)} / 100`;
}

export function formatCm(v) {
  if (v == null) return '—';
  return `${Number(v).toFixed(1)} cm`;
}

/** Compute delta string with sign, e.g. "−3.2 min" or "+12%" */
export function formatDelta(before, after, unit = '', lowerIsBetter = true) {
  if (before == null || after == null) return '';
  const diff = after - before;
  const sign = diff < 0 ? '−' : diff > 0 ? '+' : '±';
  const better = (lowerIsBetter ? diff < 0 : diff > 0);
  return { text: `${sign}${Math.abs(diff).toFixed(1)} ${unit}`.trim(), better, diff };
}

/** Severity label for a screening status */
export function statusLabel(status, t) {
  return t(`severity_${status}`);
}

/** Format a band for display */
export function formatBand(low, mid, high) {
  if (mid == null) return '—';
  if (low != null && high != null) {
    return `Rs. ${mid.toFixed(1)} (${low.toFixed(1)}–${high.toFixed(1)}) Cr`;
  }
  return `Rs. ${mid.toFixed(1)} Cr`;
}
