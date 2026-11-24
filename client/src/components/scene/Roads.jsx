import React, { useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Roads({ baseline, levers, stage }) {
  const { invalidate } = useThree();

  const roadWidth = levers.roadWidthM;
  const footpathWidth = levers.footpathM;

  // Road geometry
  const roadGeo = useMemo(() => new THREE.PlaneGeometry(40, roadWidth), [roadWidth]);
  const roadMat = useMemo(() => new THREE.MeshLambertMaterial({ color: '#9CA3AF' }), []);

  // Centre line geo
  const lineGeo = useMemo(() => new THREE.PlaneGeometry(40, 0.08), []);
  const lineMat = useMemo(() => new THREE.MeshLambertMaterial({ color: '#FFFFFF' }), []);

  // Footpath geo
  const footpathGeo = useMemo(() => new THREE.PlaneGeometry(40, footpathWidth), [footpathWidth]);
  const footpathMat = useMemo(() => new THREE.MeshLambertMaterial({ color: '#E5E7EB' }), []);

  useEffect(() => {
    return () => {
      roadGeo.dispose(); roadMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      footpathGeo.dispose(); footpathMat.dispose();
    };
  }, [roadGeo, roadMat, lineGeo, lineMat, footpathGeo, footpathMat]);

  useEffect(() => { invalidate(); }, [roadWidth, footpathWidth, invalidate]);

  const halfRoad = roadWidth / 2;
  const halfFoot = footpathWidth / 2;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      {/* Road */}
      <mesh geometry={roadGeo} material={roadMat} />

      {/* Centre line */}
      <mesh geometry={lineGeo} material={lineMat} position={[0, 0, 0.001]} />

      {/* Footpaths */}
      {footpathWidth > 0 && (
        <>
          <mesh position={[0, -(halfRoad + halfFoot), 0.001]}>
            <planeGeometry args={[40, footpathWidth]} />
            <meshLambertMaterial color="#E5E7EB" />
          </mesh>
          <mesh position={[0, (halfRoad + halfFoot), 0.001]}>
            <planeGeometry args={[40, footpathWidth]} />
            <meshLambertMaterial color="#E5E7EB" />
          </mesh>
        </>
      )}

      {/* Ahmedabad BRT lane */}
      {stage === 'planned' && levers.rechargePits >= 6 && (
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[40, 0.6]} />
          <meshLambertMaterial color="#059669" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}
