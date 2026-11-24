/**
 * src/components/scene/CivicHealthHub3D.jsx
 * Primary Health & Civic Hub 3D model:
 *  - 2-story clinic building with Red Cross sign
 *  - Covered ambulance bay with direct street clearance
 *  - Rooftop solar array and emergency backup power portico
 */

import React from 'react';

export default function CivicHealthHub3D({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* 1. Ground Paved Base */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[18, 0.12, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
      </mesh>

      {/* 2. Main Clinic Building */}
      <mesh position={[-2, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 6.4, 12]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
      </mesh>

      {/* Decorative Red Accent Band */}
      <mesh position={[-2, 6.2, 0]} castShadow>
        <boxGeometry args={[10.2, 0.4, 12.2]} />
        <meshStandardMaterial color="#DC2626" roughness={0.5} />
      </mesh>

      {/* Red Cross Emblem on Front Facade */}
      <group position={[-2, 4.5, 6.12]}>
        <mesh>
          <boxGeometry args={[0.4, 1.4, 0.1]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        <mesh>
          <boxGeometry args={[1.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      </group>

      {/* 3. Covered Ambulance Bay Portico (East Wing) */}
      <group position={[6, 0, 0]}>
        {/* Canopy Roof */}
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.5, 0.4, 10]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
        {/* Support Pillars */}
        {[[-2.5, -4], [-2.5, 4], [2.5, -4], [2.5, 4]].map(([x, z], i) => (
          <mesh key={i} position={[x, 2, z]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial color="#64748B" roughness={0.6} />
          </mesh>
        ))}

        {/* Dedicated Ambulance Vehicle Parking Bay */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.05, 7.5]} />
          <meshStandardMaterial color="#1E293B" roughness={0.9} />
        </mesh>
      </group>

      {/* 4. Rooftop Solar Array */}
      <mesh position={[-2, 6.8, 0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[7.5, 0.1, 8.5]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
