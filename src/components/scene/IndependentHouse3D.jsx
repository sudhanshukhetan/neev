/**
 * src/components/scene/IndependentHouse3D.jsx
 * Modern Indian Courtyard (Aangan) House Cluster:
 *  - 2-story contemporary home with boundary wall and gate
 *  - Central courtyard ventilation cutout
 *  - Shaded rooftop terrace with solar PV panels
 */

import React from 'react';

export default function IndependentHouse3D({ position = [0, 0, 0] }) {
  // 3 independent houses in a planned enclave
  const houses = [
    { x: -8, z: 0, rot: 0 },
    { x: 0, z: 0, rot: 0 },
    { x: 8, z: 0, rot: 0 },
  ];

  return (
    <group position={position}>
      {houses.map((h, i) => (
        <group key={i} position={[h.x, 0, h.z]}>
          {/* Plot Boundary Wall */}
          <mesh position={[0, 0.6, 0]} receiveShadow>
            <boxGeometry args={[6.8, 1.2, 7.8]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
          </mesh>

          {/* Ground Floor Living Core */}
          <mesh position={[0, 1.7, -0.5]} castShadow receiveShadow>
            <boxGeometry args={[5.2, 3.2, 5.2]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.6} />
          </mesh>

          {/* First Floor (Setback with terrace) */}
          <mesh position={[0.4, 4.4, -0.8]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 2.6, 4.2]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
          </mesh>

          {/* Rooftop Solar Water Heater / Solar Panels */}
          <mesh position={[0.4, 6.0, -0.8]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[2.5, 0.1, 2.5]} />
            <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Front Courtyard (Aangan) Tree */}
          <group position={[-1.8, 0, 2.4]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, 2.4, 8]} />
              <meshStandardMaterial color="#78350F" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.8, 0]} castShadow>
              <sphereGeometry args={[1.2, 12, 12]} />
              <meshStandardMaterial color="#15803D" roughness={0.7} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
