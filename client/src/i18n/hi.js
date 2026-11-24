/**
 * client/src/i18n/hi.js
 * Hindi translation dictionary — naturally written, not word-for-word.
 * Keys match en.js exactly.
 */

const hi = {
  // ── App & Meta ──
  app_name: 'नींव',
  app_tagline: 'नींव: आपकी गली की ज़मीनी हकीक़त के लिए पूर्व-타당성 जाँच।',
  app_description: 'NBC 2016 सुरक्षा जाँच, फायर टेंडर पहुँच, और मानसून बाढ़ सिमुलेशन — भारतीय नगर पुनर्विकास के लिए।',
  disclaimer: 'यह एक प्रारंभिक जाँच-रिपोर्ट है, चर्चा के लिए। यह कोई वैधानिक अनुमति, संरचनात्मक प्रमाणपत्र या इंजीनियरिंग डिज़ाइन नहीं है। किसी भी निर्णय से पहले NBC 2016, राज्य विनियम, और लाइसेंसी इंजीनियर से सत्यापन करें।',

  // ── Hero ──
  hero_title: 'भारत के लिए सुरक्षित नींव बनाना',
  hero_subtitle: 'भारतीय नगर-पालिकाओं के लिए गली-स्तर पर पूर्व-타당성 सिमुलेशन। बजट तय करने से पहले सड़क, नाले और इमारतें जाँचें।',
  hero_cta: 'सिमुलेशन शुरू करें',
  hero_note: 'लॉगिन की ज़रूरत नहीं। मुफ़्त जाँच उपकरण।',

  // ── Navbar ──
  nav_logo_alt: 'नींव — फाउंडेशन ग्रिड लोगो',
  nav_2d_label: 'कम बैंडविड्थ 2D ब्लूप्रिंट',
  nav_3d_label: '3D दृश्य',
  nav_pdf: 'DPR रिपोर्ट निर्यात करें (PDF)',
  nav_pdf_disabled_tooltip: 'PDF निर्यात के लिए पहले साइट जाँच करें।',
  nav_lang_en: 'EN',
  nav_lang_hi: 'हिंदी',

  // ── Sheet metadata ──
  sheet_no: 'NEEV-01',
  sheet_scale: '1:500',
  sheet_rev: 'संस्करण 1.0',

  // ── Site Panel ──
  site_panel_title: 'साइट इनपुट',
  site_upload_label: 'साइट फ़ोटो अपलोड करें',
  site_upload_hint: 'खींचें और छोड़ें, या क्लिक करें। JPEG/PNG/WebP, अधिकतम 5 MB।',
  site_upload_capture: 'फ़ोटो लें',
  site_upload_remove: 'हटाएं',
  site_upload_preview_alt: 'साइट फ़ोटो पूर्वावलोकन',
  site_upload_error_type: 'केवल JPEG, PNG और WebP चित्र स्वीकार किए जाते हैं।',
  site_upload_error_size: 'फ़ाइल 5 MB से बड़ी है। कृपया छोटी फ़ाइल चुनें।',
  site_presets_title: 'या एक प्रीसेट साइट चुनें',
  site_preset_select: 'साइट चुनें',

  // ── Baseline Form ──
  baseline_title: 'साइट आधार-रेखा',
  baseline_source_preset: 'प्रीसेट',
  baseline_source_photo: 'AI-अनुमानित, कृपया सत्यापित करें',
  baseline_source_manual: 'मैन्युअल रूप से सेट',
  baseline_source_engine: 'निर्धारक अनुमान',
  baseline_low_confidence: 'कम विश्वसनीयता — साइट पर जाँचें',
  baseline_field_laneWidth: 'लेन चौड़ाई',
  baseline_field_obstruction: 'कैरिजवे में बाधा',
  baseline_field_drain: 'नाले की स्थिति',
  baseline_field_green: 'हरित आवरण',
  baseline_field_floors: 'औसत मंजिलें',
  baseline_field_wires: 'ओवरहेड तार दिखते हैं',
  baseline_field_condition: 'भवन स्थिति स्कोर',
  baseline_note: 'एक फ़ोटो से सटीक चौड़ाई नापना संभव नहीं। कृपया अपनी साइट के अनुसार ये मान ठीक करें।',

  // ── Audit Panel ──
  audit_panel_title: 'NBC सुरक्षा जाँच',
  audit_loading: 'साइट का विश्लेषण हो रहा है…',
  audit_hazard_road: 'सड़क चौड़ाई एवं आपातकालीन पहुँच',
  audit_hazard_road_note: 'NBC न्यूनतम 6m का रास्ता — फायर टेंडर हेतु (भाग 4)',
  audit_hazard_structural: 'संरचनात्मक / भूकंपीय स्कोर',
  audit_hazard_structural_note: 'IS 1893 जोन IV; स्कोर 0–100',
  audit_hazard_flood: 'वर्षाजल निकासी एवं मानसून बाढ़ जोखिम',
  audit_hazard_flood_note: 'डिज़ाइन तूफान 60 mm/hr; अनुमानित जलभराव गहराई',
  audit_hazard_green: 'हरित आवरण एवं ऊष्मा-द्वीप सूचकांक',
  audit_hazard_green_note: 'पक्की सतह बनाम हरियाली का प्रॉक्सी — शहरी तापमान पर असर',
  audit_violations_title: 'जाँच संकेत',
  audit_no_violations: 'कोई जाँच संकेत नहीं।',
  audit_empty: 'स्क्रीनिंग शुरू करने के लिए कोई प्रीसेट चुनें या फ़ोटो अपलोड करें।',

  // ── Severity ──
  severity_critical: 'गंभीर',
  severity_high: 'अधिक',
  severity_moderate: 'मध्यम',
  severity_pass: 'उत्तीर्ण',
  severity_watch: 'निगरानी',
  severity_fail: 'अनुत्तीर्ण',

  // ── Levers ──
  lever_panel_title: 'हस्तक्षेप लीवर',
  lever_group_streets: 'सड़कें',
  lever_group_water: 'जल एवं निकासी',
  lever_group_buildings: 'इमारतें',
  lever_group_utilities: 'सेवाएँ',
  lever_roadWidth: 'सड़क चौड़ाई (राइट-ऑफ-वे)',
  lever_roadWidth_note: 'फुटपाथ सहित कुल राइट-ऑफ-वे। NBC भाग 3।',
  lever_footpath: 'फुटपाथ चौड़ाई (प्रत्येक तरफ)',
  lever_footpath_note: 'कैरिजवे के दोनों ओर समर्पित पैदल पथ।',
  lever_obstructionClear: 'बाधाएँ हटाई गईं',
  lever_obstructionClear_note: 'दुकानदार, पार्क वाहन और अतिक्रमण चिह्नित क्षेत्रों में स्थानांतरित।',
  lever_coveredDrain: 'नाला ढका एवं साफ किया गया',
  lever_coveredDrain_note: 'तूफानी नाले की वह लंबाई जो ढकी, सफाई की गई और रखरखाव में है।',
  lever_rechargePits: 'रिचार्ज पिट (प्रति 100m)',
  lever_rechargePits_note: 'वर्षाजल संरक्षण पिट: 1m व्यास, 3m गहरा, बजरी भरा।',
  lever_greenPct: 'हरित आवरण',
  lever_greenPct_note: 'पेड़, घास और पौधारोपण — लेन क्षेत्र का प्रतिशत।',
  lever_maxFloors: 'अधिकतम मंजिलें / FAR सीमा',
  lever_maxFloors_note: 'अधिकतम अनुमेय मंजिल संख्या। IS 1893 जोन IV भूकंपीय सीमा।',
  lever_retrofitPct: 'भूकंप-प्रतिरोधी नवीनीकरण',
  lever_retrofitPct_note: 'IS 1893 जोन IV सुदृढ़ीकरण प्राप्त करने वाली इमारतों का %।',
  lever_undergroundUtil: 'सेवाएँ भूमिगत की गईं',
  lever_undergroundUtil_note: 'ओवरहेड बिजली/टेलीकॉम केबल भूमिगत किए गए %।',
  lever_baseline_tick: 'आधार-रेखा',
  lever_reset: 'आधार-रेखा पर वापस जाएं',

  // ── Blueprint Selector ──
  blueprint_title: 'नगर ब्लूप्रिंट प्रीसेट',
  blueprint_modified_chip: 'प्रीसेट: {name} (संशोधित)',
  blueprint_reset: 'वर्तमान स्थिति पर वापस जाएं',
  blueprint_chandigarh: 'चंडीगढ़ सेक्टर ग्रिड',
  blueprint_jaipur: 'जयपुर हेरिटेज-कमर्शियल',
  blueprint_ahmedabad: 'अहमदाबाद स्मार्ट-ट्रांजिट',

  // ── State Toggle ──
  state_current: 'वर्तमान स्थिति (अनियोजित)',
  state_planned: 'पुनर्नियोजित स्थिति (नियोजित)',

  // ── Screening Checks ──
  screening_title: 'जाँच मानदंड',
  screening_disclaimer: 'जाँच अनुमान: NBC 2016 और स्थानीय उपविधियों के विरुद्ध सत्यापित करें। यह वैधानिक अनुपालन निर्धारण नहीं है।',
  screening_fire: 'फायर टेंडर की स्वतंत्र चौड़ाई',
  screening_footpath: 'फुटपाथ चौड़ाई',
  screening_floors: 'मंजिल संख्या (कम ऊंचाई सीमा)',
  screening_green: 'हरित आवरण',
  screening_drain: 'ढका/रखरखाव किया हुआ नाला',
  screening_recharge: 'वर्षाजल रिचार्ज पिट',
  screening_basis: 'आधार',

  // ── Impact Panel ──
  impact_title: 'पहले / बाद का प्रभाव',
  impact_before: 'पहले',
  impact_after: 'बाद',
  impact_delta: 'परिवर्तन',
  impact_response_time: 'आपातकालीन प्रतिक्रिया समय',
  impact_response_unit: 'मिनट',
  impact_flood_risk: 'बाढ़ जोखिम',
  impact_flood_unit: '%',
  impact_flood_depth: 'अधिकतम बाढ़ गहराई',
  impact_flood_depth_unit: 'cm',
  impact_safety: 'संरचनात्मक सुरक्षा सूचकांक',
  impact_safety_unit: '/ 100',
  impact_heat: 'ऊष्मा-द्वीप सूचकांक',
  impact_heat_unit: '',
  impact_cost: 'नवीनीकरण लागत (±40%)',
  impact_cost_unit: '₹ करोड़',
  impact_how_calculated: 'यह कैसे गणना होती है?',

  // ── Phase Plan ──
  phase_title: 'चरणबद्ध कार्यान्वयन योजना',
  phase_p1: 'चरण 1 — त्वरित सुधार',
  phase_p2: 'चरण 2 — सेवाएँ एवं हरियाली',
  phase_p3: 'चरण 3 — भारी निर्माण',
  phase_months: 'माह {from}–{to}',
  phase_cost_range: '₹ {low}–{high} करोड़',
  phase_story: 'केवल चरण 1 से बाढ़ गहराई {pct}% कम होगी — ₹ {cost} करोड़ में, बिना किसी तोड़-फोड़ के।',
  phase_levers_label: 'इस चरण में हस्तक्षेप',

  // ── Fire Dispatch ──
  fire_dispatch_btn: 'फायर टेंडर भेजें',
  fire_dispatch_blocked: 'अवरुद्ध — {clearM} m खाली, {neededM} m चाहिए',
  fire_dispatch_clear: 'टेंडर {min} मिनट में पहुंचा',
  fire_dispatch_speed: '{speed} km/h',
  fire_dispatch_clock: '{min} मिनट बीते',
  fire_dispatch_before_after: 'पहले: {before} मिनट → बाद: {after} मिनट',

  // ── Monsoon Mode ──
  monsoon_btn: 'मानसून मोड',
  monsoon_rainfall_label: 'वर्षा तीव्रता',
  monsoon_rainfall_unit: 'mm/hr',
  monsoon_play: 'तूफान चलाएं',
  monsoon_pause: 'रोकें',
  monsoon_peak_depth: 'अधिकतम गहराई',
  monsoon_hours_drain: 'निकासी में घंटे',
  monsoon_ground_floors: 'भूतल प्रभावित',
  monsoon_gauge_label: 'बाढ़ गहराई (cm)',
  monsoon_sill_label: 'दरवाज़ा सिल (30 cm)',

  // ── Assumptions Drawer ──
  assumptions_title: 'इंजीनियरिंग मान्यताएँ',
  assumptions_edited: 'संपादित',
  assumptions_default: 'डिफ़ॉल्ट',
  assumptions_reset_all: 'सभी डिफ़ॉल्ट पर रीसेट करें',
  assumptions_source: 'स्रोत / आधार',

  // ── PDF ──
  pdf_generating: 'DPR तैयार हो रहा है…',
  pdf_disclaimer_full: 'पूर्व-타당성 जाँच दस्तावेज़\nयह रिपोर्ट केवल प्रारंभिक चर्चा के लिए है। यह कोई वैधानिक अनुमति, योजना मंज़ूरी, संरचनात्मक प्रमाणपत्र या इंजीनियरिंग डिज़ाइन नहीं है। लागत अनुमानों में ±40% की अनिश्चितता है। किसी भी निवेश या विनियामक प्रस्तुति से पहले NBC 2016, राज्य उपविधियों और लाइसेंसी इंजीनियर/नगर-योजनाकार से सत्यापन अनिवार्य है।',

  // ── Empty states ──
  empty_stage: 'शुरू करने के लिए साइट चुनें',
  empty_stage_sub: 'कोई प्रीसेट चुनें या फ़ोटो अपलोड करें',
  empty_impact: 'पहले/बाद का प्रभाव देखने के लिए जाँच करें',

  // ── Toast ──
  toast_webgl_fallback: '3D उपलब्ध नहीं — 2D ब्लूप्रिंट मोड में स्विच किया गया।',
  toast_dismiss: 'बंद करें',
  toast_audit_ok: 'साइट बेसलाइन लोड हुई।',
  toast_pdf_ok: 'DPR PDF डाउनलोड हुई।',
};

export default hi;
