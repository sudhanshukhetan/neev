/**
 * src/components/scene/Highway3D.jsx
 * Procedural 4/6-lane Express Highway model with asphalt carriageway,
 * white/yellow lane markings, concrete crash barrier median, and LED streetlamps.
 */

import React, { useMemo } from 'react';

export default function Highway3D({ position = [0, 0, 0] }) {
  // Roadway dimensions
  const roadWidth = 14;
  const roadLength = 50;

  // Generate street lamps along both edges
  const streetLamps = useMemo(() => {
    const lamps = [];
    for (let z = -20; z <= 20; z += 10) {
      // Left side
      lamps.push([-roadWidth / 2 - 0.6, z, false]);
      // Right side
      lamps.push([roadWidth / 2 + 0.6, z, true]);
    }
    return lamps;
  }, []);

  return (
    <group position={position}>
      {/* 1. Main Asphalt Carriageway */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[roadWidth, 0.16, roadLength]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>

      {/* 2. Concrete Center Divider (Median) */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, roadLength]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.6} />
      </mesh>

      {/* 3. Outer Concrete Curbs / Crash Barriers */}
      <mesh position={[-roadWidth / 2 + 0.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, roadLength]} />
        <meshStandardMaterial color="#64748B" roughness={0.7} />
      </mesh>
      <mesh position={[roadWidth / 2 - 0.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, roadLength]} />
        <meshStandardMaterial color="#64748B" roughness={0.7} />
      </mesh>

      {/* 4. Lane Markings (White dashed stripes) */}
      {[-3.5, 3.5].map((x) => (
        <group key={x}>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[x, 0.17, -22.5 + i * 5]}>
              <planeGeometry args={[0.22, 2.5]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 5. Yellow Shoulder Solid Lines */}
      {[-5.8, 5.8].map((x) => (
        <mesh key={x} position={[x, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, roadLength]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
      ))}

      {/* 6. LED Streetlamps */}
      {streetLamps.map(([x, z, flip], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Vertical Pole */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 5, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Horizontal Arm */}
          <mesh position={[flip ? -0.6 : 0.6, 4.9, 0]} rotation={[0, 0, flip ? 0.3 : -0.3]}>
            <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Lamp Head */}
          <mesh position={[flip ? -1.1 : 1.1, 4.7, 0]}>
            <boxGeometry args={[0.35, 0.12, 0.25]} />
            <meshStandardMaterial color="#F8FAFC" emissive="#FDE68A" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
