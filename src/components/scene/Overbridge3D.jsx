/**
 * src/components/scene/Overbridge3D.jsx
 * Procedural Overbridge / Flyover 3D model with elevated concrete deck,
 * cylindrical support piers, approach ramps, and 5.5m traffic clearance envelope.
 */

import React from 'react';

export default function Overbridge3D({ position = [0, 0, 0] }) {
  const bridgeWidth = 9;
  const bridgeHeight = 5.5;
  const spanLength = 26;
  const rampLength = 14;

  return (
    <group position={position}>
      {/* 1. Main Elevated Span Deck */}
      <mesh position={[0, bridgeHeight, 0]} castShadow receiveShadow>
        <boxGeometry args={[bridgeWidth, 0.8, spanLength]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
      </mesh>

      {/* Asphalt Wearing Layer on Elevated Deck */}
      <mesh position={[0, bridgeHeight + 0.42, 0]} receiveShadow>
        <boxGeometry args={[bridgeWidth - 0.6, 0.05, spanLength]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Parapet Guardrails */}
      {[-bridgeWidth / 2 + 0.2, bridgeWidth / 2 - 0.2].map((x) => (
        <mesh key={x} position={[x, bridgeHeight + 0.8, 0]} castShadow>
          <boxGeometry args={[0.3, 0.9, spanLength]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
        </mesh>
      ))}

      {/* 2. Cylindrical Concrete Piers (Pillars) */}
      {[-8, 0, 8].map((z) => (
        <group key={z} position={[0, bridgeHeight / 2, z]}>
          {/* Main Round Column */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 1.1, bridgeHeight, 16]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.7} />
          </mesh>
          {/* Pier Cap (Crossbeam support) */}
          <mesh position={[0, bridgeHeight / 2 - 0.3, 0]} castShadow>
            <boxGeometry args={[bridgeWidth - 1, 0.7, 2]} />
            <meshStandardMaterial color="#64748B" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* 3. North Approach Ramp (Sloping down to ground) */}
      <group position={[0, bridgeHeight / 2, spanLength / 2 + rampLength / 2]} rotation={[-0.28, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[bridgeWidth, 0.6, rampLength]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[bridgeWidth - 0.6, 0.05, rampLength]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>

      {/* 4. South Approach Ramp */}
      <group position={[0, bridgeHeight / 2, -spanLength / 2 - rampLength / 2]} rotation={[0.28, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[bridgeWidth, 0.6, rampLength]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[bridgeWidth - 0.6, 0.05, rampLength]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
