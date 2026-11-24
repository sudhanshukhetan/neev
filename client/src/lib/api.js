/**
 * client/src/lib/api.js
 * Resilient API client for Neev.
 */

const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

async function request(path, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, { ...options, signal: controller.signal });
    clearTimeout(tid);
    if (!res.ok) {
      let body;
      try { body = await res.json(); } catch { body = { error: res.statusText }; }
      const err = new Error(body.error || `HTTP ${res.status}`);
      err.code = body.code;
      err.status = res.status;
      throw err;
    }
    return res.json();
  } catch (e) {
    clearTimeout(tid);
    throw e;
  }
}

export async function fetchHealth() {
  return request('/health');
}

export async function fetchPresets() {
  return request('/presets');
}

export async function fetchAuditPreset(presetId) {
  return request('/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ presetId }),
  });
}

export async function fetchAuditPhoto(file) {
  const form = new FormData();
  form.append('image', file);
  return request('/audit', { method: 'POST', body: form });
}

export async function fetchSimulate(baseline, levers, assumptions) {
  return request('/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baseline, levers, assumptions }),
  });
}
