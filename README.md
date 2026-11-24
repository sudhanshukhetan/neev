# Neev (नींव) v2.0
> **Urban Redevelopment & Greenfield Infrastructure Pre-Feasibility Simulator for India & the World**  
> *Track 5: Smarter Cities & Civic Infrastructure*

```
+---------------------------------------------------------------------------------+
|                               NEEV v2.0 ARCHITECTURE                            |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  [ UNIFIED SINGLE-REPOSITORY WEB APP (Vite + React 18 + Tailwind + Three.js) ]  |
|  - Architectural Discovery Canvas: Interactive Leaflet Map with ESRI Satellite  |
|  - Real-Time Environmental Engine: OpenStreetMap Nominatim + Open-Meteo Weather |
|  - Plain-Land (Greenfield) Construction Studio: 6 Buildable Infrastructure Types|
|  - Urban In-Situ Redevelopment Studio: 9 Levers + Chandigarh/Jaipur/Ahmedabad   |
|  - Upgraded Three.js 3D Graphics: Directional Soft Shadows, Sky Dome & Presets  |
|  - 4-Page Municipal DPR Export: jsPDF with Real-Time Coordinates, Weather & AQI |
|                                     |                                           |
|                 +-------------------+-------------------+                       |
|                 |                                       |                       |
|        [ Local Sync Evaluation ]             [ Vercel Serverless Functions ]    |
|        - Pure ES-Module Engine               - Zero CORS / Zero Extra Hosting   |
|        - 60fps immediate response            - /api/health                      |
|                 |                            - /api/location-intel              |
|                 v                            - /api/simulate                    |
|  +--------------------------------+          - /api/audit (Gemini Vision + Fall)|
|  |   shared/engine.js             |          - /api/presets                     |
|  |   shared/greenfieldEngine.js   |   +---------------------------------------+ |
|  |   - computeMetrics()           |   |   Deployment: 1-Click Vercel Deploy   | |
|  |   - computeGreenfieldProject() |   |   - vercel.json SPA + /api rewrites   | |
|  |   - computeFire() / Flood()    |   |   - Node.js Serverless runtime        | |
|  |   - runScreening() (NBC 2016)  |   +---------------------------------------+ |
|  +--------------------------------+                                             |
+---------------------------------------------------------------------------------+
```

---

## 1. Overview & Core Features

Neev ("नींव" - Foundation) is a unified, production-grade civic pre-feasibility simulator empowering urban local bodies (ULBs), municipal commissioners, town planners, and citizens to model civic infrastructure and estimate budgets before civil execution.

### Key Capabilities

1. **Interactive World Map & Real-Time Intelligence:**
   - Explore any location in India or across the globe via Leaflet with an instant toggle between **ESRI Satellite** and **OpenStreetMap Street** imagery.
   - Search any city, village, or coordinates using OpenStreetMap Nominatim.
   - Click anywhere to fetch live **temperature, humidity, monsoon precipitation risk, wind speed**, and **Air Quality Index (AQI: PM2.5 / PM10)** via Open-Meteo.
   - Automated land-use classification badge (`Dense Urban Area` vs. `Plain / Open Land`).

2. **Plain-Land (Greenfield) Construction Studio:**
   - 6 buildable critical infrastructure components:
     1. **Express Highway**: 4/6-lane asphalt, concrete median barrier, LED streetlamps, and stormwater drainage.
     2. **Overbridge / Flyover**: Elevated pre-stressed concrete deck, cylindrical support piers, approach ramps, and 5.5m clearance.
     3. **Planned Residential Society**: Modern seismic-safe towers, central landscaped park, rooftop solar PV array, and recharge pits.
     4. **Modern Independent House Cluster**: NBC-compliant courtyard (aangan) homes with permeable pavers and solar roof.
     5. **Community Park & Recharge Zone**: Urban forest with native shade trees, perimeter walking track, and sunken percolation pond.
     6. **Primary Health & Civic Hub**: Universal-accessible clinic, 24/7 ambulance bay portico, and solar battery backup.
   - Combine multiple structures on virgin land, scale plot acreage (1–40 acres), mandatory green canopy %, and solar rooftop coverage %.
   - Live calculations for capital budget (`Rs. Cr`), completion timeline (`Months`), families housed, daily commuters served, and NBC / Eco scores.

3. **Urban In-Situ Redevelopment Simulator:**
   - 9 explainable civic levers for congested brownfield lanes: right-of-way carriageway, footpaths, green cover, max floors, covered drains, recharge pits, obstruction clearance, underground utilities, and seismic retrofitting.
   - Three historical city blueprint vectors: **Chandigarh** (Broad Sector Grid), **Jaipur** (Walled Heritage City), and **Ahmedabad** (Dense Heritage Pol Enclave).
   - Live Story Simulations: **Fire Tender Emergency Clearance** (pinch-point bottleneck detection) and **Monsoon Flood Simulation** (20–120 mm/hr storm simulation with doorway depth gauge).

4. **Upgraded Three.js 3D Graphics:**
   - Realistic directional sunlight with soft shadow maps (`castShadow` / `receiveShadow`).
   - Atmospheric Sky dome scattering (`<Sky />`), hemisphere lighting, and subtle terrain materials.
   - Smooth camera presets: `Isometric View`, `Street-Level View`, and `Top-Down Blueprint`.
   - 2D SVG Blueprint drafting sheet fallback with React Error Boundary for low-bandwidth devices.

5. **Upgraded Municipal DPR PDF Export (`jspdf`):**
   - 4-page formal municipal report with exact coordinates, geographic snapshot, live weather & AQI, Before/After performance metrics, NBC 2016 screening checks, CPWD DSR 2023 cost breakdown, and phased milestone Gantt schedule.
   - Uses `Rs.` currency formatting throughout to ensure clean, artifact-free text rendering.

6. **Unified 1-Click Vercel Architecture:**
   - Single root Vite + React monorepo containing frontend and serverless functions in `/api`.
   - Zero CORS issues, zero separate backend servers, and zero port conflicts.

---

## 2. Quickstart & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/sudhanshukhetan/neev.git
cd neev

# Install all dependencies
npm install

# Start unified local development server (serves frontend & /api serverless endpoints)
npm run dev

# Open http://localhost:5173
```

### Production Build & Tests
```bash
# Run 29 unit tests (monotonicity, thresholds, determinism, greenfield calculations)
npm test

# Build production bundle for Vercel
npm run build
```

---

## 3. Vercel Deployment

1. Push to your GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite** (auto-detected via `vercel.json`).
4. Optional Environment Variables:
   - `GEMINI_API_KEY`: Google Gemini API key for photo baseline pre-filling (falls back gracefully to deterministic verified engine if omitted).
5. Deploy! Vercel serves the static SPA frontend and deploys `/api/*.js` as serverless functions with zero additional configuration.

---

## 4. Statutory Disclaimer

> **PRE-FEASIBILITY SCREENING DOCUMENT**  
> *This application is a pre-feasibility screening tool for preliminary discussion and civic planning. It is NOT a statutory approval, planning clearance, structural certification, or engineering design. All cost estimates carry an uncertainty band based on CPWD DSR 2023 schedule of rates. Always verify findings against NBC 2016, state municipal bye-laws, and with a licensed civil engineer/town planner before committing capital or regulatory submissions.*
