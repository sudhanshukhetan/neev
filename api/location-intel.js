/**
 * api/location-intel.js
 * Vercel Serverless Function: Real-time area intelligence for any clicked map coordinate
 * Combines reverse geocoding, land-use classification, weather, and air quality (AQI).
 */

import { fetchLocationIntel } from './services/locationService.js';
import { fetchWeatherAndAqi } from './services/weatherAqiService.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const lat = req.query?.lat || req.body?.lat;
  const lon = req.query?.lon || req.body?.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordinates (lat, lon) are required', code: 'MISSING_COORDINATES' });
  }

  try {
    const [location, environmental] = await Promise.all([
      fetchLocationIntel(lat, lon),
      fetchWeatherAndAqi(lat, lon),
    ]);

    return res.status(200).json({
      success: true,
      location,
      weather: environmental.weather,
      aqi: environmental.aqi,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[neev] Location intel failed:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve location intelligence', details: err.message });
  }
}
