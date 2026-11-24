import React, { useRef, useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Trees({ levers }) {
  const meshRef = useRef();
  const { invalidate } = useThree();
  const count = 30;

  const geo = useMemo(() => new THREE.ConeGeometry(0.6, 1.8, 6), []);
  const mat = useMemo(() => new THREE.MeshLambertMaterial({ color: '#059669' }), []);
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.1, 0.4, 4), []);
  const trunkMat = useMemo(() => new THREE.MeshLambertMaterial({ color: '#78350F' }), []);

  useEffect(() => {
    return () => {
      geo.dispose(); mat.dispose();
      trunkGeo.dispose(); trunkMat.dispose();
    };
  }, [geo, mat, trunkGeo, trunkMat]);

  useEffect(() => {
    if (!meshRef.current) return;
    const greenPct = levers?.greenPct || 15;
    const roadW = levers?.roadWidthM || 7;
    const numTrees = Math.round((greenPct / 100) * count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      if (i < numTrees) {
        const x = -18 + (i % 10) * 4;
        const side = i < 10 ? -(roadW / 2 + 1.5) : (roadW / 2 + 1.5);
        dummy.position.set(x, 1, side);
        dummy.scale.set(1, 1, 1);
      } else {
        dummy.scale.set(0, 0, 0); // hide unused instances
      }
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    invalidate();
  }, [levers?.greenPct, levers?.roadWidthM, invalidate]);

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, count]} position={[0, 0, 0]} />
  );
}
