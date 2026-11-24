import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Flood Plane for Story Moment B (Monsoon Mode).
 * Rises vertically based on water depth in cm.
 */
export default function FloodPlane3D({ depthCm = 0 }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;
    // 1 cm = 0.02 Three.js world units
    const height = Math.max(0.001, (depthCm / 100) * 2);
    meshRef.current.position.y = height / 2;
  });

  if (depthCm <= 0) return null;

  return (
    <mesh ref={meshRef} position={[0, 0.05, 0]}>
      <boxGeometry args={[40, 0.1, 20]} />
      <meshLambertMaterial color="#38BDF8" transparent opacity={0.55} />
    </mesh>
  );
}
