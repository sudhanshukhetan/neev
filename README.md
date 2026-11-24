# Neev (नींव)
> **Urban Redevelopment & Pre-Feasibility Simulator for India**  
> *Track 5: Smarter Cities & Civic Infrastructure*

```
+---------------------------------------------------------------------------------+
|                               NEEV ARCHITECTURE                                 |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  [ BROWSER CLIENT (React 18 + Vite + Tailwind + Three.js) ]                     |
|  - Drafting-Sheet UI: Sheet NEEV-01, Scale 1:500, Rev 1.0                       |
|  - Left Panel: Site Input (Upload/Camera/Presets) & Ruled Hazard Table          |
|  - Center Stage (~70%): 3D Instanced WebGL Canvas / 2D SVG Blueprint Plan       |
|  - Stage Stories: Fire-Tender Dispatch (Clearance Pinch) & Monsoon Mode         |
|  - Controls: 9 Levers (Streets, Water, Buildings, Utilities) + Blueprint Presets|
|  - Right Panel: Before/After Metrics, Ruled Gantt Phase Plan, Screening Checks  |
|  - Transparency: Editable Assumptions Drawer & Formula Explanation Popovers    |
|                                     |                                           |
|                 +-------------------+-------------------+                       |
|                 |                                       |                       |
|        [ Local Evaluation ]                    [ Network API ]                  |
|        - Pure sync engine                      - Debounced authoritative call   |
|        - 60fps immediate response              - Photo baseline extraction      |
|                 |                                       |                       |
|                 v                                       v                       |
|  +--------------------------------+   +---------------------------------------+ |
|  |   shared/engine.js             |   |   Node 20 Express Server (/api)       | |
|  |   - computeMetrics()           |   |   - POST /api/audit (Photo/Preset)    | |
|  |   - computeFire()              |   |   - POST /api/simulate (Authoritative)| |
|  |   - computeFlood()             |   |   - GET  /api/health & /api/presets   | |
|  |   - computeCost() (+/-40% band)|   |   - Multer 5MB + magic-byte check     | |
|  |   - computePhases()            |   |   - Gemini Vision with 8s abort & det | |
|  |   - runScreening()             |   +---------------------------------------+ |
|  +--------------------------------+                                             |
+---------------------------------------------------------------------------------+
```

---

## 1. Overview & Core Principles

Neev ("नींव" - Foundation) is a pre-feasibility screening simulator designed for municipal commissioners, urban local bodies (ULBs), and citizens across India.

### Key Principles
1. **Explainable by Design:** Every number on screen traces to a lever, a confirmed site baseline, or a named engineering assumption. No magic constants.
2. **Blueprints as Lever Vectors:** Chandigarh, Jaipur, and Ahmedabad are preset vectors of the 9 levers. Selecting a blueprint sets the levers; the user can adjust any parameter.
3. **Honest AI Role:** Gemini Vision estimates visual baseline features (`laneWidthM`, `obstructionM`, `drainCondition`, etc.) with per-field confidence chips. The procedural 2D/3D geometry is generated from the baseline and levers.
4. **Pre-Feasibility Screening Disclaimer:**
   > *"Pre-feasibility screening for discussion. Not a statutory approval, structural certification, or engineering design. Verify with NBC 2016, state bye-laws, and a licensed engineer."*

---

## 2. The Nine Levers (`shared/levers.js`)

| Lever | Range | Step | Unit | Group | Description |
|---|---|---|---|---|---|
| `roadWidthM` | 3 – 12 | 0.5 | m | Streets | Right-of-way width |
| `footpathM` | 0 – 2.5 | 0.25 | m | Streets | Dedicated pedestrian path (each side) |
| `obstructionClearPct` | 0 – 100 | 5 | % | Streets | Vendors/parked vehicles moved to marked zones |
| `coveredDrainPct` | 0 – 100 | 5 | % | Water | Length of drain covered, desilted & maintained |
| `rechargePits` | 0 – 10 | 1 | /100m | Water | Rainwater percolation pits |
| `greenPct` | 5 – 40 | 1 | % | Water | Vegetative cover & tree canopies |
| `maxFloors` | 2 – 6 | 1 | fl | Buildings | Floor count cap (seismic safety) |
| `retrofitPct` | 0 – 100 | 10 | % | Buildings | Buildings seismically retrofitted (IS 1893 Zone IV) |
| `undergroundUtilPct`| 0 – 100 | 10 | % | Utilities | Overhead electrical/telecom cables undergrounded |

---

## 3. Mathematical Models & Formulas (`shared/engine.js`)

### Fire Tender Access
$$\text{Carriageway} = \text{roadWidthM} - 2 \times \text{footpathM}$$
$$\text{Clear Width} = \text{Carriageway} - \text{obstructionM} \times (1 - \text{obstructionClearPct}/100)$$
$$\text{Speed} = v_{\min} + (v_{\max} - v_{\min}) \times \text{smoothstep}(\text{Clear Width}, w_{\text{low}}, w_{\text{high}})$$
$$\text{Response Time} = \frac{\text{Distance}}{\text{Speed}} \times 60 + \text{Dispatch Time} + (\text{Blocked Delay if clear} < 3.5\text{m})$$

### Stormwater & Flood Modelling
$$\text{Runoff } C = \text{clamp}(c_{\text{base}} - c_{\text{green}} \times \text{greenPct} - c_{\text{recharge}} \times \text{rechargePits}, c_{\min}, 0.95)$$
$$\text{Inflow} = \text{Rainfall} \times \text{Catchment Area} \times C$$
$$\text{Drain Capacity} = \text{Base Capacity} \times \text{blend}(\text{Drain Condition}, \text{Covered Factor}, \text{coveredDrainPct}/100)$$
$$\text{Ponding Depth (cm)} = \frac{k_{\text{pond}} \times \max(0, \text{Inflow} - \text{Capacity}) \times \text{Duration}}{\text{Pond Area Factor}}$$

### Cost Estimation (±40% Band)
Cost is computed as a deterministic midpoint sum across road widening, drain desilting, seismic retrofitting, green infrastructure, recharge pits, and utility undergrounding. All outputs display the midpoint alongside the range:
$$\text{Low} = 0.6 \times \text{Midpoint}, \quad \text{High} = 1.4 \times \text{Midpoint}$$

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Environment Variables (`server/.env`)
```bash
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_PRIMARY_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
```

### Installation
```bash
npm install
```

### Running Locally
```bash
# Start both client (Vite on :5173) and server (Express on :5000) concurrently:
npm run dev
```

### Testing & Verification
```bash
# Run unit test suite (vitest):
npm test

# Build client for production:
npm run build

# Run linting check:
npm run lint
```

---

## 5. Key Story Moments & Interactive Modes

1. **Fire Tender Dispatch (`FireDispatch.jsx` / `FireTender3D.jsx`):**
   - Click "Dispatch Fire Tender".
   - Current State: Vehicle stops at the pinch point where clear width < 3.5m, showing `BLOCKED`, the crimson pinch dimension, and stalled timer.
   - Planned State: Vehicle navigates the widened carriageway, showing exact elapsed response time in minutes.
2. **Monsoon Mode (`MonsoonMode.jsx` / `FloodPlane3D.jsx`):**
   - Live rainfall intensity slider (20 to 120 mm/hr).
   - Animated 3-hour storm timeline.
   - Dual depth gauges comparing Current vs Planned ponding with a 30cm door-sill threshold indicator.
3. **Municipal DPR Export (`lib/pdf.js`):**
   - Generates an A4 PDF complete with site baseline, lever values, Before/After impact metrics, screening checklist, cost breakdown, and the full "Method & Assumptions" appendix.
