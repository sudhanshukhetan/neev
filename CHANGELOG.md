# Changelog

## [2.0.0] - 2026-11-24

### Added
- **Unified Single-Repository Architecture**: Merged `/client` and `/server` into a single root Vite + React app configured for 1-click Vercel deployment with serverless functions in `/api` and zero CORS issues.
- **Interactive World Map**: Integrated Leaflet with ESRI Satellite and OpenStreetMap Street layer toggle, full-text search via OpenStreetMap Nominatim, and auto-flyTo navigation.
- **Real-Time Environmental & Location Engine**: `/api/location-intel` fetching live weather (temperature, humidity, precipitation, wind), European Air Quality Index (PM2.5/PM10), and automated land-use classification (`Dense Urban Area` vs. `Plain / Open Land`).
- **Plain-Land (Greenfield) Construction Studio**: Interactive toolbar to click & build 6 infrastructure types (Express Highway, Overbridge/Flyover, Residential Society, Modern Courtyard House, Community Park & Recharge Pond, Primary Health & Civic Hub) with live CPWD DSR 2023 budget calculation, timeline, commuters/families served, and NBC / Eco scores.
- **Upgraded Three.js 3D Graphics**: Atmospheric Sky dome scattering, directional sunlight with soft shadow maps, ambient hemisphere lighting, and procedural 3D models for all 6 infrastructure structures with smooth camera presets (`Isometric`, `Street View`, `Top-Down Blueprint`).
- **Upgraded Municipal DPR PDF Export**: 4-page formal municipal report with exact coordinates, geographic snapshot, live weather & AQI, Before/After performance metrics, NBC 2016 screening checks, CPWD DSR 2023 cost breakdown, and phased milestone Gantt schedule.

## [1.0.0] - 2026-11-24

### Added
- **Neev v2**: Lever-based, explainable urban redevelopment & pre-feasibility simulator for India.
- **Nine Primary Levers**: Road width, footpath width, green cover, max floors, covered drains, recharge pits, obstruction clearance, underground utilities, and seismic retrofit.
- **Shared Pure Simulation Engine**: Deterministic synchronous formulas for emergency response time, design-storm flood depth, structural safety index, and phased retrofitting costs with ±40% bands.
- **Story Moment A**: Fire-tender emergency dispatch simulation with real-time clearance pinch point detection.
- **Story Moment B**: Monsoon flood simulation with 20–120 mm/hr design storms, 3-hour rainfall playback, and door-sill threshold tracking.
- **Dual Visualisation**: 3D instanced WebGL stage with demand frameloop & automatic 2D SVG blueprint fallback on WebGL context loss.
- **Municipal DPR Export**: 4-page A4 PDF report with site baseline, intervention lever vectors, Before/After impact comparison, screening checklist, and full Method & Assumptions appendix.
- **Full Bilingual Support**: Authentic English and natural Hindi phrasing with live toggle.
