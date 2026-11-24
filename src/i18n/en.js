/**
 * client/src/i18n/en.js
 * English translation dictionary — flat key/value map.
 */

const en = {
  // ── App & Meta ──
  app_name: 'Neev',
  app_tagline: 'Neev: pre-feasibility for the lane you actually live on.',
  app_description: 'NBC 2016 safety screening, fire access simulation, and monsoon flood modelling for Indian urban redevelopment.',
  disclaimer: 'Pre-feasibility screening for discussion. Not a statutory approval, structural certification, or engineering design. Verify with NBC 2016, state bye-laws, and a licensed engineer.',

  // ── Hero ──
  hero_title: 'Building Safer Foundations for Bharat',
  hero_subtitle: 'Lane-level pre-feasibility simulation for Indian municipalities. Screen roads, drains, and structures before committing to redevelopment budgets.',
  hero_cta: 'Start Simulating',
  hero_note: 'No login required. Free screening tool.',

  // ── Navbar ──
  nav_logo_alt: 'Neev — Foundation Grid Logo',
  nav_2d_label: 'Low-Bandwidth 2D Blueprint',
  nav_3d_label: '3D View',
  nav_pdf: 'Export Municipal DPR (PDF)',
  nav_pdf_disabled_tooltip: 'Run a site audit first to unlock PDF export.',
  nav_lang_en: 'EN',
  nav_lang_hi: 'हिंदी',

  // ── Sheet metadata ──
  sheet_no: 'NEEV-01',
  sheet_scale: '1:500',
  sheet_rev: 'Rev 1.0',

  // ── Site Panel ──
  site_panel_title: 'Site Input',
  site_upload_label: 'Upload Site Photo',
  site_upload_hint: 'Drag and drop, or click to select. JPEG/PNG/WebP, max 5 MB.',
  site_upload_capture: 'Take Photo',
  site_upload_remove: 'Remove',
  site_upload_preview_alt: 'Site photo preview',
  site_upload_error_type: 'Only JPEG, PNG, and WebP images are accepted.',
  site_upload_error_size: 'File exceeds 5 MB limit. Please choose a smaller file.',
  site_presets_title: 'Or choose a preset site',
  site_preset_select: 'Select Site',

  // ── Baseline Form ──
  baseline_title: 'Site Baseline',
  baseline_source_preset: 'Preset',
  baseline_source_photo: 'AI-estimated, please confirm',
  baseline_source_manual: 'Manually set',
  baseline_source_engine: 'Deterministic estimate',
  baseline_low_confidence: 'Low confidence — verify on site',
  baseline_field_laneWidth: 'Lane width',
  baseline_field_obstruction: 'Obstruction in carriageway',
  baseline_field_drain: 'Drain condition',
  baseline_field_green: 'Green cover',
  baseline_field_floors: 'Average floors',
  baseline_field_wires: 'Overhead wires visible',
  baseline_field_condition: 'Building condition score',
  baseline_note: 'A single photo cannot measure width precisely. Correct these values for your site.',

  // ── Audit Panel ──
  audit_panel_title: 'NBC Safety Screening',
  audit_loading: 'Analysing site…',
  audit_hazard_road: 'Road Width & Emergency Access',
  audit_hazard_road_note: 'NBC min 6m right-of-way for fire tender access (Part 4)',
  audit_hazard_structural: 'Structural / Seismic Score',
  audit_hazard_structural_note: 'IS 1893 Zone IV seismic risk; condition score 0–100',
  audit_hazard_flood: 'Stormwater & Monsoon Flood Risk',
  audit_hazard_flood_note: 'Design storm 60 mm/hr; estimated ponding depth',
  audit_hazard_green: 'Green Cover & Heat-Island Index',
  audit_hazard_green_note: 'Proxy: paved fraction vs green area; impacts urban temperature',
  audit_violations_title: 'Screening Flags',
  audit_no_violations: 'No screening flags.',
  audit_empty: 'Select a preset or upload a photo to begin screening.',

  // ── Severity ──
  severity_critical: 'Critical',
  severity_high: 'High',
  severity_moderate: 'Moderate',
  severity_pass: 'Pass',
  severity_watch: 'Watch',
  severity_fail: 'Fail',

  // ── Levers ──
  lever_panel_title: 'Intervention Levers',
  lever_group_streets: 'Streets',
  lever_group_water: 'Water & Drainage',
  lever_group_buildings: 'Buildings',
  lever_group_utilities: 'Utilities',
  lever_roadWidth: 'Road Width (Right-of-Way)',
  lever_roadWidth_note: 'Total right-of-way including footpaths. NBC Part 3.',
  lever_footpath: 'Footpath Width (each side)',
  lever_footpath_note: 'Dedicated pedestrian footpath on each side of carriageway.',
  lever_obstructionClear: 'Obstruction Cleared',
  lever_obstructionClear_note: 'Vendors, parked vehicles, and encroachments relocated to marked zones.',
  lever_coveredDrain: 'Drain Covered & Desilted',
  lever_coveredDrain_note: 'Length of storm drain that is covered, cleaned, and maintained.',
  lever_rechargePits: 'Recharge Pits (per 100m)',
  lever_rechargePits_note: 'Rainwater recharge pits: 1m dia, 3m deep, gravel-filled.',
  lever_greenPct: 'Green Cover',
  lever_greenPct_note: 'Trees, grass, and planted surfaces as % of lane area.',
  lever_maxFloors: 'Max Floors / FAR Cap',
  lever_maxFloors_note: 'Maximum permissible floor count. IS 1893 Zone IV seismic cap.',
  lever_retrofitPct: 'Seismic Retrofit',
  lever_retrofitPct_note: '% of buildings receiving IS 1893 Zone IV seismic strengthening.',
  lever_undergroundUtil: 'Utilities Undergrounded',
  lever_undergroundUtil_note: '% of overhead electric/telecom cables moved underground.',
  lever_baseline_tick: 'Baseline',
  lever_reset: 'Reset to baseline',

  // ── Blueprint Selector ──
  blueprint_title: 'City Blueprint Preset',
  blueprint_modified_chip: 'Preset: {name} (modified)',
  blueprint_reset: 'Reset to current state',
  blueprint_chandigarh: 'Chandigarh Sector Grid',
  blueprint_jaipur: 'Jaipur Heritage-Commercial',
  blueprint_ahmedabad: 'Ahmedabad Smart-Transit',

  // ── State Toggle ──
  state_current: 'Current State (Unplanned)',
  state_planned: 'Redesigned State (Planned)',

  // ── Screening Checks ──
  screening_title: 'Screening Checks',
  screening_disclaimer: 'Screening assumption: verify against NBC 2016 and local bye-laws. Not a statutory compliance determination.',
  screening_fire: 'Fire-tender clear width',
  screening_footpath: 'Footpath width',
  screening_floors: 'Floor count (low-rise cap)',
  screening_green: 'Green cover',
  screening_drain: 'Covered/maintained drain',
  screening_recharge: 'Rainwater recharge pits',
  screening_basis: 'Basis',

  // ── Impact Panel ──
  impact_title: 'Before / After Impact',
  impact_before: 'Before',
  impact_after: 'After',
  impact_delta: 'Change',
  impact_response_time: 'Emergency Response Time',
  impact_response_unit: 'min',
  impact_flood_risk: 'Flood Risk',
  impact_flood_unit: '%',
  impact_flood_depth: 'Peak Flood Depth',
  impact_flood_depth_unit: 'cm',
  impact_safety: 'Structural Safety Index',
  impact_safety_unit: '/ 100',
  impact_heat: 'Heat Island Index',
  impact_heat_unit: '',
  impact_cost: 'Retrofitting Cost (±40%)',
  impact_cost_unit: '₹ Cr',
  impact_how_calculated: 'How is this calculated?',

  // ── Phase Plan ──
  phase_title: 'Phased Implementation Plan',
  phase_p1: 'Phase 1 — Quick Wins',
  phase_p2: 'Phase 2 — Services & Green',
  phase_p3: 'Phase 3 — Heavy Works',
  phase_months: 'Months {from}–{to}',
  phase_cost_range: '₹ {low}–{high} Cr',
  phase_story: 'Phase 1 alone cuts flood depth by {pct}% for ₹ {cost} Cr, before any demolition.',
  phase_levers_label: 'Interventions in this phase',

  // ── Fire Dispatch ──
  fire_dispatch_btn: 'Dispatch Fire Tender',
  fire_dispatch_blocked: 'BLOCKED — {clearM} m clear, {neededM} m needed',
  fire_dispatch_clear: 'Tender reached in {min} min',
  fire_dispatch_speed: '{speed} km/h',
  fire_dispatch_clock: '{min} min elapsed',
  fire_dispatch_before_after: 'Before: {before} min  →  After: {after} min',

  // ── Monsoon Mode ──
  monsoon_btn: 'Monsoon Mode',
  monsoon_rainfall_label: 'Rainfall intensity',
  monsoon_rainfall_unit: 'mm/hr',
  monsoon_play: 'Play Storm',
  monsoon_pause: 'Pause',
  monsoon_peak_depth: 'Peak depth',
  monsoon_hours_drain: 'Hours to drain',
  monsoon_ground_floors: 'Ground floors affected',
  monsoon_gauge_label: 'Flood depth gauge (cm)',
  monsoon_sill_label: 'Door sill (30 cm)',

  // ── Assumptions Drawer ──
  assumptions_title: 'Engineering Assumptions',
  assumptions_edited: 'Edited',
  assumptions_default: 'Default',
  assumptions_reset_all: 'Reset all to defaults',
  assumptions_source: 'Source / Basis',

  // ── PDF ──
  pdf_generating: 'Generating DPR…',
  pdf_disclaimer_full: 'PRE-FEASIBILITY SCREENING DOCUMENT\nThis report is a pre-feasibility screening tool for preliminary discussion only. It is NOT a statutory approval, planning clearance, structural certification, or engineering design. All cost estimates carry a ±40% uncertainty band. Formulas and assumptions are listed in the appendix. Verify all findings against NBC 2016, state bye-laws, relevant IS codes, and with a licensed engineer/town planner before any investment or regulatory submission.',

  // ── Empty states ──
  empty_stage: 'Select a site to begin',
  empty_stage_sub: 'Choose a preset or upload a photo',
  empty_impact: 'Run an audit to see before/after impact',

  // ── Toast ──
  toast_webgl_fallback: '3D unavailable — switched to 2D Blueprint Mode.',
  toast_dismiss: 'Dismiss',
  toast_audit_ok: 'Site baseline loaded.',
  toast_pdf_ok: 'DPR PDF downloaded.',

  // ── Interactive Map & Plain Land Studio ──
  nav_mode_map: 'World Map',
  nav_mode_urban: 'Urban Studio',
  nav_mode_plain: 'Plain Land Studio',
  map_search_placeholder: 'Search any city, village, landmark, or coordinates…',
  map_layer_satellite: 'ESRI Satellite',
  map_layer_street: 'Street Map',
  intel_title: 'Real-Time Area Intelligence',
  intel_coordinates: 'Coordinates',
  intel_weather: 'Live Weather',
  intel_aqi: 'Air Quality (AQI)',
  intel_land_classification: 'Land Classification',
  intel_dense_urban: 'Dense Urban Area',
  intel_plain_land: 'Plain / Open Land',
  intel_civic_flaws: 'Detected Civic Bottlenecks',
  intel_cta_urban: 'Launch 3D Redevelopment Simulator',
  intel_cta_plain: 'Build on this Plain Land Plot',
  plain_studio_title: 'Plain Land Construction Studio',
  plain_studio_subtitle: 'Click & build critical infrastructure on virgin land plots',
  plain_select_structures: 'Buildable Infrastructure Types',
  plain_area_acres: 'Plot Area (Acres)',
  plain_green_pct: 'Mandatory Green Canopy (%)',
  plain_solar_pct: 'Rooftop Solar PV Grid (%)',
  plain_est_cost: 'Est. Construction Cost',
  plain_est_timeline: 'Project Timeline',
  plain_families_housed: 'Families Housed',
  plain_commuters_served: 'Daily Commuters Served',
  plain_nbc_score: 'NBC Structural Safety',
  plain_eco_score: 'Eco Sustainability',
  cam_isometric: 'Isometric',
  cam_street: 'Street View',
  cam_top: 'Top-Down Blueprint',
};

export default en;
