import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Fire Tender model for Story Moment A.
 * 2.5m wide red utility truck that drives down the carriageway.
 */
export default function FireTender3D({ progress = 0, isBlocked = false }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    // Drive from x = -18 to x = +18
    const startX = -18;
    const endX = 18;
    const currentX = startX + progress * (endX - startX);
    groupRef.current.position.set(currentX, 0.8, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 1.4, 2.4]} />
        <meshLambertMaterial color={isBlocked ? '#DC2626' : '#EA580C'} />
      </mesh>
      {/* Cabin */}
      <mesh position={[1.2, 0.6, 0]}>
        <boxGeometry args={[1.6, 0.8, 2.2]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      {/* Emergency Beacon */}
      <mesh position={[1.2, 1.1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
        <meshBasicMaterial color="#DC2626" />
      </mesh>
    </group>
  );
}
