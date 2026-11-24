import React, { useMemo } from 'react';
import { useNeevStore } from '../../store/useNeevStore.js';
import { useT } from '../../i18n/useT.js';

/**
 * Scene2D — SVG top-down street plan driven by levers + baseline.
 * Features: road ribbon, footpaths, buildings, trees, dimension lines,
 * blueprint-specific overlays, north arrow, scale bar.
 */

const W = 800;
const H = 520;
const ROAD_Y_CENTER = H / 2;
const LANE_LENGTH = W - 80; // margin each side

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export default function Scene2D() {
  const t = useT();
  const baseline = useNeevStore((s) => s.baseline);
  const levers = useNeevStore((s) => s.levers);
  const stage = useNeevStore((s) => s.stage);
  const activeBlueprint = useNeevStore((s) => s.activeBlueprint);

  // Pick active state values
  const activeLevers = useMemo(() => {
    if (stage === 'current' && baseline) {
      return {
        roadWidthM: baseline.laneWidthM,
        footpathM: 0,
        greenPct: baseline.greenPct,
        maxFloors: baseline.floorsAvg,
        coveredDrainPct: baseline.drainCondition === 'covered' ? 80 : baseline.drainCondition === 'open' ? 20 : 0,
        rechargePits: 0,
        obstructionClearPct: 0,
        undergroundUtilPct: baseline.wiresVisible ? 0 : 60,
        retrofitPct: 0,
      };
    }
    return levers;
  }, [stage, baseline, levers]);

  if (!baseline) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-paper relative">
        {/* Survey grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sg" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F172A" strokeWidth="0.5"/>
            </pattern>
            <pattern id="sg2" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#0F172A" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sg)"/>
          <rect width="100%" height="100%" fill="url(#sg2)"/>
        </svg>
        <div className="relative z-10 text-center">
          <div className="font-heading text-2xl font-300 text-ink opacity-30 mb-2">{t('empty_stage')}</div>
          <div className="font-mono text-xs text-muted opacity-50">{t('empty_stage_sub')}</div>
        </div>
      </div>
    );
  }

  // Scale: pixels per metre (road width)
  const SCALE_PX_PER_M = 12; // 1m = 12px
  const roadWidthPx = clamp(activeLevers.roadWidthM * SCALE_PX_PER_M, 20, 200);
  const footpathPx = clamp(activeLevers.footpathM * SCALE_PX_PER_M, 0, 60);
  const totalWidthPx = roadWidthPx + 2 * footpathPx;

  const roadTop = ROAD_Y_CENTER - roadWidthPx / 2;
  const roadBottom = ROAD_Y_CENTER + roadWidthPx / 2;
  const topFootpathTop = roadTop - footpathPx;
  const bottomFootpathBottom = roadBottom + footpathPx;

  // Buildings
  const numBuildings = Math.ceil((LANE_LENGTH / 100) * 10);
  const buildingSpacing = LANE_LENGTH / numBuildings;
  const buildingWidth = Math.min(buildingSpacing * 0.65, 48);
  const buildingDepth = clamp(30 + activeLevers.maxFloors * 8, 30, 90);

  // Trees
  const numTrees = Math.round((activeLevers.greenPct / 100) * 30);
  const treeSpacing = LANE_LENGTH / Math.max(numTrees, 1);

  const isCurrentBadState = stage === 'current';
  const hasWires = baseline.wiresVisible && activeLevers.undergroundUtilPct < 80;
  const hasObstruction = baseline.obstructionM * (1 - activeLevers.obstructionClearPct / 100) > 0.3;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: '#F8FAFC' }}
      role="img"
      aria-label="2D street blueprint plan"
    >
      {/* Background paper */}
      <rect width={W} height={H} fill="#F8FAFC"/>

      {/* Blueprint grid */}
      <defs>
        <pattern id="minorGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(15,23,42,0.04)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="majorGrid" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(15,23,42,0.07)" strokeWidth="1"/>
        </pattern>
        {/* Hatch pattern for existing structures */}
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5E1" strokeWidth="1.5"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#minorGrid)"/>
      <rect width={W} height={H} fill="url(#majorGrid)"/>

      {/* Drawing border */}
      <rect x="2" y="2" width={W-4} height={H-4} fill="none" stroke="#E2E8F0" strokeWidth="1"/>
      {/* Corner ticks */}
      {[[2,2,'h','v'],[W-2,2,'h-','v'],[2,H-2,'h','v-'],[W-2,H-2,'h-','v-']].map(([x,y,h,v], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x+(h==='h'?8:-8)} y2={y} stroke="#CBD5E1" strokeWidth="1"/>
          <line x1={x} y1={y} x2={x} y2={y+(v==='v'?8:-8)} stroke="#CBD5E1" strokeWidth="1"/>
        </g>
      ))}

      {/* Top footpath */}
      {footpathPx > 0 && (
        <rect
          x={40} y={topFootpathTop}
          width={LANE_LENGTH} height={footpathPx}
          fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5"
        />
      )}

      {/* Road surface */}
      <rect
        x={40} y={roadTop}
        width={LANE_LENGTH} height={roadWidthPx}
        fill="#D1D5DB"
      />

      {/* Centre line */}
      <line
        x1={40} y1={ROAD_Y_CENTER} x2={40 + LANE_LENGTH} y2={ROAD_Y_CENTER}
        stroke="white" strokeWidth="1" strokeDasharray="16 10"
      />

      {/* Bottom footpath */}
      {footpathPx > 0 && (
        <rect
          x={40} y={roadBottom}
          width={LANE_LENGTH} height={footpathPx}
          fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5"
        />
      )}

      {/* Obstruction blocks (vendor/parked) */}
      {hasObstruction && Array.from({ length: 5 }).map((_, i) => {
        const x = 60 + i * 130;
        return (
          <rect
            key={i}
            x={x} y={roadTop + 4}
            width={18} height={12}
            fill="#B45309" opacity={0.6}
            stroke="#92400E" strokeWidth="0.5"
          />
        );
      })}

      {/* Recharge pits */}
      {activeLevers.rechargePits > 0 && Array.from({ length: Math.min(activeLevers.rechargePits * 3, 10) }).map((_, i) => {
        const x = 70 + i * (LANE_LENGTH / 10);
        return (
          <circle
            key={i}
            cx={x} cy={roadTop - 10}
            r={5}
            fill="#059669" opacity={0.4}
            stroke="#059669" strokeWidth="1"
          />
        );
      })}

      {/* Ahmedabad BRT lane */}
      {activeBlueprint === 'ahmedabad' && stage === 'planned' && (
        <rect
          x={40} y={ROAD_Y_CENTER - 2}
          width={LANE_LENGTH} height={4}
          fill="#059669" opacity={0.5}
        />
      )}

      {/* Jaipur vendor zones */}
      {activeBlueprint === 'jaipur' && stage === 'planned' && (
        <>
          {[150, 350, 550].map((x) => (
            <rect key={x} x={x} y={topFootpathTop + 2} width={40} height={footpathPx - 4}
              fill="#D97706" opacity={0.3} stroke="#D97706" strokeWidth="0.5"/>
          ))}
        </>
      )}

      {/* Overhead wires */}
      {hasWires && (
        <g opacity={0.5}>
          {[0.25, 0.4, 0.55].map((frac, i) => (
            <path
              key={i}
              d={`M 40 ${roadTop - 25 + i*4} Q ${40+LANE_LENGTH/2} ${roadTop - 30 + i*4} ${40+LANE_LENGTH} ${roadTop - 25 + i*4}`}
              fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="4 4"
            />
          ))}
        </g>
      )}

      {/* Buildings — Top side */}
      {Array.from({ length: Math.min(numBuildings, 15) }).map((_, i) => {
        const x = 40 + i * buildingSpacing + (buildingSpacing - buildingWidth) / 2;
        const demolished = isCurrentBadState && i % 5 === 0;
        return (
          <g key={`bt${i}`}>
            <rect
              x={x} y={topFootpathTop - buildingDepth - 4}
              width={buildingWidth} height={buildingDepth}
              fill={demolished ? 'none' : (isCurrentBadState ? 'url(#hatch)' : '#F1F5F9')}
              stroke={demolished ? '#CBD5E1' : '#94A3B8'}
              strokeWidth="1"
              strokeDasharray={demolished ? '4 2' : 'none'}
            />
            {/* Floor count label */}
            <text
              x={x + buildingWidth/2}
              y={topFootpathTop - buildingDepth/2 - 4}
              textAnchor="middle"
              className="dim-text"
              fontSize="8"
              fill="#94A3B8"
            >
              {activeLevers.maxFloors}F
            </text>
          </g>
        );
      })}

      {/* Buildings — Bottom side */}
      {Array.from({ length: Math.min(numBuildings, 15) }).map((_, i) => {
        const x = 40 + i * buildingSpacing + (buildingSpacing - buildingWidth) / 2;
        return (
          <rect
            key={`bb${i}`}
            x={x} y={bottomFootpathBottom + 4}
            width={buildingWidth} height={buildingDepth}
            fill={isCurrentBadState ? 'url(#hatch)' : '#F1F5F9'}
            stroke="#94A3B8" strokeWidth="1"
          />
        );
      })}

      {/* Trees */}
      {numTrees > 0 && Array.from({ length: Math.min(numTrees, 20) }).map((_, i) => {
        const x = 40 + i * (LANE_LENGTH / numTrees) + treeSpacing / 2;
        return (
          <g key={`tree${i}`}>
            <circle cx={x} cy={topFootpathTop - 6} r={4} fill="#059669" opacity={0.7}/>
            <circle cx={x} cy={bottomFootpathBottom + 6} r={4} fill="#059669" opacity={0.7}/>
          </g>
        );
      })}

      {/* ── Dimension lines ── */}
      {/* Road width dimension */}
      <g opacity={0.75}>
        {/* Arrow line */}
        <line x1={28} y1={roadTop} x2={28} y2={roadBottom} stroke="#0F172A" strokeWidth="0.5"/>
        {/* Arrowheads */}
        <polygon points={`28,${roadTop} 25,${roadTop+5} 31,${roadTop+5}`} fill="#0F172A" opacity={0.6}/>
        <polygon points={`28,${roadBottom} 25,${roadBottom-5} 31,${roadBottom-5}`} fill="#0F172A" opacity={0.6}/>
        {/* Tick marks */}
        <line x1={23} y1={roadTop} x2={33} y2={roadTop} stroke="#0F172A" strokeWidth="0.5"/>
        <line x1={23} y1={roadBottom} x2={33} y2={roadBottom} stroke="#0F172A" strokeWidth="0.5"/>
        {/* Label */}
        <text
          x={18} y={ROAD_Y_CENTER + 4}
          textAnchor="middle"
          transform={`rotate(-90 18 ${ROAD_Y_CENTER})`}
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
          fill="#0F172A" opacity="0.7"
        >
          {activeLevers.roadWidthM.toFixed(1)} m
        </text>
      </g>

      {/* Total width dimension (with footpaths) */}
      {footpathPx > 0 && (
        <g opacity={0.5}>
          <line x1={14} y1={topFootpathTop} x2={14} y2={bottomFootpathBottom} stroke="#0F172A" strokeWidth="0.5"/>
          <line x1={9} y1={topFootpathTop} x2={19} y2={topFootpathTop} stroke="#0F172A" strokeWidth="0.5"/>
          <line x1={9} y1={bottomFootpathBottom} x2={19} y2={bottomFootpathBottom} stroke="#0F172A" strokeWidth="0.5"/>
          <text x={8} y={ROAD_Y_CENTER + 4}
            textAnchor="middle" transform={`rotate(-90 8 ${ROAD_Y_CENTER})`}
            fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#64748B">
            {(activeLevers.roadWidthM + 2 * activeLevers.footpathM).toFixed(1)} m total
          </text>
        </g>
      )}

      {/* ── Section marker A-A ── */}
      <g opacity={0.5}>
        <line x1={W/2} y1={2} x2={W/2} y2={22} stroke="#0F172A" strokeWidth="0.5" strokeDasharray="4 3"/>
        <line x1={W/2} y1={H-22} x2={W/2} y2={H-2} stroke="#0F172A" strokeWidth="0.5" strokeDasharray="4 3"/>
        <circle cx={W/2} cy={12} r={8} fill="none" stroke="#0F172A" strokeWidth="0.5"/>
        <text x={W/2} y={16} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#0F172A" opacity="0.7">A</text>
        <circle cx={W/2} cy={H-12} r={8} fill="none" stroke="#0F172A" strokeWidth="0.5"/>
        <text x={W/2} y={H-8} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#0F172A" opacity="0.7">A</text>
      </g>

      {/* ── North arrow ── */}
      <g transform={`translate(${W-50}, 40)`} opacity={0.6}>
        <circle cx={0} cy={0} r={16} fill="none" stroke="#0F172A" strokeWidth="0.5"/>
        <polygon points="0,-12 3,4 0,0 -3,4" fill="#0F172A"/>
        <text x={0} y={-15} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#0F172A">N</text>
      </g>

      {/* ── Scale bar ── */}
      <g transform={`translate(${W-200}, ${H-30})`} opacity={0.65}>
        <rect x={0} y={0} width={60} height={4} fill="#0F172A"/>
        <rect x={60} y={0} width={60} height={4} fill="none" stroke="#0F172A" strokeWidth="0.5"/>
        <text x={0} y={12} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#0F172A">0</text>
        <text x={56} y={12} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#0F172A">5m</text>
        <text x={116} y={12} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#0F172A">10m</text>
        <text x={0} y={22} fontSize="7" fontFamily="JetBrains Mono, monospace" fill="#64748B">1:500</text>
      </g>

      {/* ── Title block strip ── */}
      <g opacity={0.6}>
        <rect x={40} y={H-24} width={160} height={20} fill="none" stroke="#E2E8F0" strokeWidth="0.5"/>
        <text x={48} y={H-10} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#64748B">
          NEEV-01 · {stage === 'current' ? 'CURRENT STATE' : 'PLANNED STATE'}
        </text>
      </g>
    </svg>
  );
}
