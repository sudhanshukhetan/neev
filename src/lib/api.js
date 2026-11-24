/**
 * src/lib/api.js
 * Resilient API client for Neev.
 * Works seamlessly with Vercel Serverless Functions and local Vite development.
 */

const BASE = '/api';

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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await request('/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
          }),
        });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export async function fetchSimulate(payload) {
  return request('/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchLocationIntel(lat, lon) {
  return request(`/location-intel?lat=${lat}&lon=${lon}`);
}
