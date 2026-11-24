/**
 * scripts/test_api.js
 * Comprehensive validation of all Vercel Serverless Functions in /api
 */

import healthHandler from '../api/health.js';
import presetsHandler from '../api/presets.js';
import simulateHandler from '../api/simulate.js';
import locationHandler from '../api/location-intel.js';
import auditHandler from '../api/audit.js';

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end(str) {
      this.body = str;
      return this;
    },
  };
  return res;
}

async function runTests() {
  console.log('Testing /api endpoints...');

  // 1. /api/health
  const res1 = mockRes();
  await healthHandler({}, res1);
  if (res1.statusCode !== 200 || res1.body.status !== 'ok') {
    throw new Error('/api/health failed: ' + JSON.stringify(res1.body));
  }
  console.log('✓ /api/health passed:', res1.body.status, '| AI mode:', res1.body.aiMode);

  // 2. /api/presets
  const res2 = mockRes();
  await presetsHandler({}, res2);
  if (res2.statusCode !== 200 || !Array.isArray(res2.body) || res2.body.length < 3) {
    throw new Error('/api/presets failed');
  }
  console.log('✓ /api/presets passed:', res2.body.length, 'presets returned');

  // 3. /api/simulate (Greenfield mode)
  const res3 = mockRes();
  await simulateHandler({
    method: 'POST',
    body: {
      mode: 'plain',
      selectedIds: ['highway', 'society'],
      areaAcres: 8,
      greenPct: 30,
    },
  }, res3);
  if (res3.statusCode !== 200 || !res3.body.greenfield) {
    throw new Error('/api/simulate plain mode failed: ' + JSON.stringify(res3.body));
  }
  console.log('✓ /api/simulate (greenfield) passed: Cost:', res3.body.greenfield.cost.formatted);

  // 4. /api/simulate (Urban mode)
  const res4 = mockRes();
  await simulateHandler({
    method: 'POST',
    body: {
      mode: 'urban',
      baseline: res2.body[0].baseline,
      levers: { roadWidthM: 9 },
    },
  }, res4);
  if (res4.statusCode !== 200 || !res4.body.planned) {
    throw new Error('/api/simulate urban mode failed: ' + JSON.stringify(res4.body));
  }
  console.log('✓ /api/simulate (urban) passed: Planned response:', res4.body.planned.responseMin, 'min');

  // 5. /api/location-intel
  const res5 = mockRes();
  await locationHandler({
    query: { lat: 28.6139, lon: 77.2090 },
  }, res5);
  if (res5.statusCode !== 200 || !res5.body.location || !res5.body.weather || !res5.body.aqi) {
    throw new Error('/api/location-intel failed: ' + JSON.stringify(res5.body));
  }
  console.log('✓ /api/location-intel passed: Locality:', res5.body.location.locality, '| Temp:', res5.body.weather.temperatureC, 'C | AQI:', res5.body.aqi.status);

  // 6. /api/audit (preset lookup)
  const res6 = mockRes();
  await auditHandler({
    method: 'POST',
    body: { presetId: 'tier2-market' },
  }, res6);
  if (res6.statusCode !== 200 || !res6.body.baseline) {
    throw new Error('/api/audit preset failed: ' + JSON.stringify(res6.body));
  }
  console.log('✓ /api/audit passed: Baseline laneWidthM:', res6.body.baseline.laneWidthM, 'm');

  console.log('\nALL 6 API SERVERLESS FUNCTION TESTS PASSED CLEANLY!\n');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
