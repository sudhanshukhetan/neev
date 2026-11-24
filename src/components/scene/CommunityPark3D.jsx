/**
 * src/components/scene/CommunityPark3D.jsx
 * Community Park & Groundwater Recharge Zone:
 *  - Sunken rainwater retention / percolation pond
 *  - Shaded perimeter walking trail
 *  - Dense native trees (Neem, Gulmohar, Peepal)
 */

import React from 'react';

export default function CommunityPark3D({ position = [0, 0, 0] }) {
  // Tree coordinates scattered through park
  const parkTrees = [
    [-6, -6], [-7, 2], [-5, 7],
    [6, -7], [7, 1], [5, 6],
    [-2, 7], [2, 7],
  ];

  return (
    <group position={position}>
      {/* 1. Lush Green Lawn Base */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[20, 0.16, 20]} />
        <meshStandardMaterial color="#4ADE80" roughness={0.8} />
      </mesh>

      {/* 2. Perimeter Porous Walking Track */}
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <ringGeometry args={[8.2, 9.6, 32]} />
        <meshStandardMaterial color="#FDBA74" roughness={0.9} />
      </mesh>

      {/* 3. Central Sunken Percolation Pond (Water Recharge Sump) */}
      <group position={[0, 0, 0]}>
        {/* Pond Basin Depression */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <cylinderGeometry args={[4.2, 4.6, 0.25, 24]} />
          <meshStandardMaterial color="#0284C7" roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Stone retaining edge */}
        <mesh position={[0, 0.26, 0]}>
          <ringGeometry args={[4.2, 4.7, 24]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.8} />
        </mesh>
      </group>

      {/* 4. Trees */}
      {parkTrees.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.22, 2.8, 8]} />
            <meshStandardMaterial color="#593006" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.4, 0]} castShadow>
            <sphereGeometry args={[1.5, 12, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#15803D' : '#16A34A'} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
