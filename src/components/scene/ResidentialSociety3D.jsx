/**
 * src/components/scene/ResidentialSociety3D.jsx
 * Procedural Planned Residential Society 3D model:
 *  - Modern multi-story apartment towers with balconies
 *  - Blue rooftop solar PV array
 *  - Central landscaped courtyard & perimeter access driveways
 */

import React from 'react';

export default function ResidentialSociety3D({ position = [0, 0, 0] }) {
  // 4 modern residential towers surrounding a central green podium
  const towers = [
    { x: -9, z: -8, floors: 5, w: 7, d: 6 },
    { x: 9, z: -8, floors: 6, w: 7, d: 6 },
    { x: -9, z: 8, floors: 4, w: 7, d: 6 },
    { x: 9, z: 8, floors: 5, w: 7, d: 6 },
  ];

  return (
    <group position={position}>
      {/* 1. Base Boundary Plot & Paved Walkway */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[30, 0.1, 28]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>

      {/* 2. Central Landscaped Podium (Park) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[11, 0.15, 12]} />
        <meshStandardMaterial color="#86EFAC" roughness={0.8} />
      </mesh>
      {/* Central Garden Pavilion */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[1.8, 2, 2.2, 8]} />
        <meshStandardMaterial color="#EA580C" roughness={0.6} />
      </mesh>

      {/* 3. The 4 Apartment Towers */}
      {towers.map((tw, idx) => {
        const height = tw.floors * 2.8;
        return (
          <group key={idx} position={[tw.x, 0, tw.z]}>
            {/* Main Tower Mass */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[tw.w, height, tw.d]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
            </mesh>

            {/* Balconies on Front Face */}
            {Array.from({ length: tw.floors }).map((_, f) => (
              <mesh key={f} position={[0, (f + 0.5) * 2.8, tw.d / 2 + 0.35]} castShadow>
                <boxGeometry args={[tw.w - 1.2, 0.85, 0.7]} />
                <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
              </mesh>
            ))}

            {/* Rooftop Solar PV Panels (Blue angled slabs) */}
            <mesh
              position={[0, height + 0.45, 0]}
              rotation={[0.15, 0, 0]}
              castShadow
            >
              <boxGeometry args={[tw.w - 1.2, 0.12, tw.d - 1.2]} />
              <meshStandardMaterial
                color="#1D4ED8"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Overhead Water Tank */}
            <mesh position={[tw.w / 2 - 1.2, height + 0.9, tw.d / 2 - 1.2]} castShadow>
              <cylinderGeometry args={[0.7, 0.7, 1.4, 12]} />
              <meshStandardMaterial color="#0284C7" roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
