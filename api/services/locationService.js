/**
 * api/services/locationService.js
 * Reverse geocoding and land-use classification using OpenStreetMap Nominatim
 * with deterministic offline fallback based on coordinates.
 */

export async function fetchLocationIntel(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Valid lat and lon are required');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=16`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Neev-Civic-Infrastructure-Simulator/2.0 (contact: sudhanshu@neev.civic)',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return parseNominatimData(data, latitude, longitude);
    }
  } catch (err) {
    console.warn('[neev] Nominatim reverse geocode failed or timed out:', err.message);
  }

  // Robust deterministic fallback
  return fallbackLocationIntel(latitude, longitude);
}

function parseNominatimData(data, lat, lon) {
  const addr = data.address || {};
  const locality = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.road || addr.village || 'Municipal Sector';
  const city = addr.city || addr.town || addr.municipality || addr.county || 'Metro Region';
  const state = addr.state || addr.state_district || 'State';
  const country = addr.country || 'India';
  const displayName = data.display_name || `${locality}, ${city}, ${state}`;

  // Land classification logic
  const type = (data.type || '').toLowerCase();
  const cls = (data.class || '').toLowerCase();
  const addressType = (data.addresstype || '').toLowerCase();

  const isUrban = [
    'residential', 'commercial', 'city', 'town', 'suburb', 'neighbourhood',
    'building', 'apartments', 'retail', 'highway', 'marketplace'
  ].some(k => type.includes(k) || cls.includes(k) || addressType.includes(k));

  const isPlainLand = [
    'farmland', 'farm', 'grass', 'meadow', 'barren', 'scrub', 'heath',
    'sand', 'wood', 'nature_reserve', 'village', 'allotments', 'recreation_ground'
  ].some(k => type.includes(k) || cls.includes(k)) || (!isUrban && Math.abs(lat) > 0);

  const landClassification = isPlainLand && !isUrban
    ? 'Plain / Open Land'
    : 'Dense Urban Area';

  const flaws = isUrban ? [
    { title: 'Sub-standard Carriageway Width', desc: 'Average lane width < 4.5m with roadside obstructions limiting emergency vehicle access.' },
    { title: 'Drainage Overburden Risk', desc: 'Uncovered or desilt-deficit stormwater drainage subject to waterlogging during heavy monsoon rains.' },
    { title: 'Overhead Cabling Hazard', desc: 'Hanging 11kV distribution wires create electrical hazard and obstruct fire ladders.' },
    { title: 'Green Space Deficit', desc: 'Paved impervious footprint > 75% causing micro-urban heat island effect.' },
  ] : [];

  return {
    latitude: lat,
    longitude: lon,
    locality,
    city,
    state,
    country,
    displayName,
    landClassification,
    isUrban,
    isPlainLand: !isUrban,
    civicFlaws: flaws,
    estimatedPopulationDensity: isUrban ? '14,500 / km²' : '320 / km²',
  };
}

function fallbackLocationIntel(lat, lon) {
  // Plausible deterministic lookup for common Indian regions
  let locality = 'Ward 14 / Urban Colony';
  let city = 'Delhi NCR';
  let state = 'Delhi';
  let country = 'India';
  let isUrban = true;

  if (lat > 28 && lat < 29 && lon > 76 && lon < 78) {
    locality = 'Connaught Outer / Paharganj';
    city = 'New Delhi';
    state = 'Delhi';
  } else if (lat > 18.8 && lat < 19.3 && lon > 72.7 && lon < 73.1) {
    locality = 'Dharavi / Kurla West';
    city = 'Mumbai';
    state = 'Maharashtra';
  } else if (lat > 12.8 && lat < 13.1 && lon > 77.4 && lon < 77.8) {
    locality = 'Indiranagar / Ulsoor';
    city = 'Bengaluru';
    state = 'Karnataka';
  } else if (lat > 30.6 && lat < 30.8 && lon > 76.7 && lon < 76.9) {
    locality = 'Sector 17 / Sector 22';
    city = 'Chandigarh';
    state = 'Punjab & Haryana';
  } else if (lat > 26.8 && lat < 27.0 && lon > 75.7 && lon < 76.0) {
    locality = 'Johari Bazaar / Walled City';
    city = 'Jaipur';
    state = 'Rajasthan';
  } else if (lat > 22.9 && lat < 23.2 && lon > 72.5 && lon < 72.7) {
    locality = 'Pol Heritage Enclave';
    city = 'Ahmedabad';
    state = 'Gujarat';
  } else {
    // If coordinate has fractional suffix > .5, treat as greenfield plain land
    const frac = Math.abs(lat * 10 - Math.floor(lat * 10));
    isUrban = frac < 0.65;
    locality = isUrban ? 'Municipal Redevelopment Sector' : 'Greenfield Plot / NH Corridor';
    city = 'Regional District';
    state = 'State Jurisdiction';
  }

  const landClassification = isUrban ? 'Dense Urban Area' : 'Plain / Open Land';

  return {
    latitude: lat,
    longitude: lon,
    locality,
    city,
    state,
    country,
    displayName: `${locality}, ${city}, ${state}, ${country}`,
    landClassification,
    isUrban,
    isPlainLand: !isUrban,
    civicFlaws: isUrban ? [
      { title: 'Sub-standard Carriageway Width', desc: 'Average lane width < 4.5m with roadside obstructions limiting emergency vehicle access.' },
      { title: 'Drainage Overburden Risk', desc: 'Uncovered or desilt-deficit stormwater drainage subject to waterlogging during heavy monsoon rains.' },
      { title: 'Overhead Cabling Hazard', desc: 'Hanging 11kV distribution wires create electrical hazard and obstruct fire ladders.' },
      { title: 'Green Space Deficit', desc: 'Paved impervious footprint > 75% causing micro-urban heat island effect.' },
    ] : [],
    estimatedPopulationDensity: isUrban ? '12,800 / km²' : '280 / km²',
  };
}
