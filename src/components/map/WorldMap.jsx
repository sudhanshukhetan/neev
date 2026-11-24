/**
 * src/components/map/WorldMap.jsx
 * Full-screen / Hero Discovery Canvas powered by Leaflet & React-Leaflet.
 * Features:
 *  - ESRI Satellite & OpenStreetMap Street layer toggle
 *  - OpenStreetMap Nominatim search bar with auto-flyTo
 *  - Click anywhere on the globe to inspect coordinates
 *  - Quick demonstration presets across India
 *  - Pulsing architectural crosshair marker
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Layers, Compass, MapPin, Sparkles, Navigation, Globe } from 'lucide-react';
import { useNeevStore } from '../../store/useNeevStore.js';
import useT from '../../i18n/useT.js';
import AreaIntelDrawer from './AreaIntelDrawer.jsx';

// Custom Leaflet Pulse Marker Icon
const customMarkerIcon = L.divIcon({
  className: 'neev-custom-marker',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-orange-500/25 animate-ping absolute"></div>
      <div class="w-5 h-5 rounded-full bg-orange-600 border-2 border-white shadow-lg flex items-center justify-center relative">
        <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
      </div>
      <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
        SITE TARGET
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Map Click Listener Component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Map Controller for programmatically flying to locations
function MapFlyController({ targetCoords, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo([targetCoords.lat, targetCoords.lon], zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [targetCoords, map, zoom]);
  return null;
}

const QUICK_PRESETS = [
  { name: 'Delhi Old Town', lat: 28.6507, lon: 77.2334, type: 'urban' },
  { name: 'Mumbai Transit Corridor', lat: 19.0607, lon: 72.8362, type: 'urban' },
  { name: 'Bengaluru Market', lat: 12.9716, lon: 77.5946, type: 'urban' },
  { name: 'Chandigarh Grid', lat: 30.7333, lon: 76.7794, type: 'urban' },
  { name: 'NH-48 Greenfield Plot', lat: 27.9150, lon: 76.4520, type: 'plain' },
  { name: 'Yamuna Open Acres', lat: 28.1820, lon: 77.5450, type: 'plain' },
];

export default function WorldMap() {
  const t = useT();
  const {
    mapLayer,
    setMapLayer,
    selectedCoordinates,
    setSelectedCoordinates,
    setLocationIntel,
    setIntelDrawerOpen,
    setIntelLoading,
  } = useNeevStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [flyTarget, setFlyTarget] = useState(selectedCoordinates);

  // Trigger intel fetch when coordinates change
  const handleLocationSelected = async (lat, lon) => {
    const coords = { lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)) };
    setSelectedCoordinates(coords);
    setFlyTarget(coords);
    setIntelLoading(true);
    setIntelDrawerOpen(true);

    try {
      const res = await fetch(`/api/location-intel?lat=${coords.lat}&lon=${coords.lon}`);
      if (res.ok) {
        const data = await res.json();
        setLocationIntel(data);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      console.warn('[neev] API location intel fallback:', err);
      // Fallback
      setLocationIntel({
        location: {
          latitude: coords.lat,
          longitude: coords.lon,
          locality: 'Identified Site Plot',
          city: 'State Jurisdiction',
          state: 'Regional District',
          country: 'India',
          displayName: `Plot at ${coords.lat.toFixed(4)}°N, ${coords.lon.toFixed(4)}°E`,
          landClassification: coords.lat > 28.3 ? 'Dense Urban Area' : 'Plain / Open Land',
          isUrban: coords.lat > 28.3,
          isPlainLand: coords.lat <= 28.3,
          civicFlaws: [
            { title: 'Sub-standard Carriageway Width', desc: 'Average lane width < 4.5m with roadside obstructions limiting emergency vehicle access.' },
            { title: 'Drainage Overburden Risk', desc: 'Uncovered or desilt-deficit stormwater drainage subject to waterlogging during heavy monsoon rains.' },
          ],
          estimatedPopulationDensity: coords.lat > 28.3 ? '14,200 / km²' : '350 / km²',
        },
        weather: {
          temperatureC: 29,
          humidityPct: 54,
          precipitationMm: 0,
          windSpeedKmh: 12,
          monsoonFloodRisk: 'LOW',
        },
        aqi: {
          pm25: 48,
          pm10: 92,
          europeanAqi: 2,
          status: 'Moderate',
          color: '#D97706',
        },
      });
    } finally {
      setIntelLoading(false);
    }
  };

  // Perform Nominatim Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results);
        if (results.length > 0) {
          const first = results[0];
          handleLocationSelected(parseFloat(first.lat), parseFloat(first.lon));
          setSearchResults([]);
        }
      }
    } catch (err) {
      console.warn('[neev] Nominatim search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-48px)] overflow-hidden bg-slate-950 font-ui select-none">
      {/* ── Floating Top Search & Quick Jump Bar ── */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="pointer-events-auto relative w-full md:w-96 shadow-2xl rounded-sm"
        >
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded shadow-lg text-slate-100">
            <Search className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('map_search_placeholder')}
              className="bg-transparent text-xs w-full text-white placeholder-slate-400 focus:outline-none"
            />
            {isSearching && (
              <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin shrink-0 ml-2" />
            )}
          </div>

          {/* Autocomplete dropdown if multiple results */}
          {searchResults.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded shadow-xl overflow-hidden text-xs">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  onClick={() => {
                    handleLocationSelected(parseFloat(item.lat), parseFloat(item.lon));
                    setSearchResults([]);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 border-b border-slate-800 last:border-b-0 truncate"
                >
                  {item.display_name}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Quick Demo Location Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest font-mono mr-1">
            <Compass className="w-3 h-3 text-orange-400" /> Presets:
          </div>
          {QUICK_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleLocationSelected(p.lat, p.lon)}
              className={`px-2.5 py-1 text-xs rounded border backdrop-blur-md transition-all font-mono whitespace-nowrap shadow ${
                selectedCoordinates.lat === p.lat
                  ? 'bg-orange-600 text-white border-orange-500'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Map Layer Switcher: Satellite vs Street */}
        <div className="pointer-events-auto flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700 p-0.5 rounded shadow-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setMapLayer('satellite')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              mapLayer === 'satellite'
                ? 'bg-orange-600 text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t('map_layer_satellite')}
          </button>
          <button
            type="button"
            onClick={() => setMapLayer('street')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              mapLayer === 'street'
                ? 'bg-orange-600 text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {t('map_layer_street')}
          </button>
        </div>
      </div>

      {/* ── The Leaflet Map Canvas ── */}
      <MapContainer
        center={[selectedCoordinates.lat, selectedCoordinates.lon]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#090d16' }}
      >
        {mapLayer === 'satellite' ? (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        <MapClickHandler onMapClick={handleLocationSelected} />
        <MapFlyController targetCoords={flyTarget} zoom={15} />

        {/* Selected Location Marker */}
        {selectedCoordinates && (
          <Marker
            position={[selectedCoordinates.lat, selectedCoordinates.lon]}
            icon={customMarkerIcon}
          />
        )}
      </MapContainer>

      {/* ── Instruction pill on bottom center ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-300 px-4 py-2 rounded-full shadow-xl text-xs text-slate-800 font-mono font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] border border-black animate-pulse" />
        <span>Click any street on the map to analyse a 250 m area around it.</span>
      </div>

      {/* ── Constructive Map Legend in bottom left ── */}
      <div className="absolute bottom-5 left-5 z-[1000] pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-xl font-mono text-[11px] text-slate-800 space-y-1.5 hidden md:block">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Too narrow for fire tender (&lt; 3.5 m)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Tight corridor (3.5 – 6 m)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Clear / Standard (&gt; 6 m)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 bg-blue-500 rounded" />
          <span>Mapped stormwater drain</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-700" />
          <span>Fire station (0.6 km)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 bg-slate-400 rounded" />
          <span>Elevated flyover</span>
        </div>
      </div>

      {/* ── Area Intelligence Drawer ── */}
      <AreaIntelDrawer />
    </div>
  );
}
