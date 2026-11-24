import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BUILDING_COLOR_CURRENT = '#D1D5DB';
const BUILDING_COLOR_PLANNED = '#F1F5F9';
const EDGE_COLOR = '#94A3B8';

export default function Buildings({ baseline, levers, stage }) {
  const meshRef = useRef();
  const edgeRef = useRef();
  const { invalidate } = useThree();

  const count = 20; // 10 each side

  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);
  const mat = useMemo(() => new THREE.MeshLambertMaterial({
    color: stage === 'current' ? BUILDING_COLOR_CURRENT : BUILDING_COLOR_PLANNED,
  }), [stage]);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: EDGE_COLOR }), []);

  // Cleanup on unmount and when blueprint changes
  useEffect(() => {
    return () => {
      geo.dispose();
      edgeGeo.dispose();
      mat.dispose();
      edgeMat.dispose();
    };
  }, [geo, edgeGeo, mat, edgeMat]);

  useMemo(() => {
    if (!meshRef.current || !edgeRef.current) return;
    const roadW = levers.roadWidthM;
    const floors = Math.max(1, levers.maxFloors);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < 10; i++) {
      const x = -18 + i * 4;
      const floorH = floors * 1.5;

      // Top side buildings
      dummy.position.set(x, floorH / 2, -(roadW / 2 + 2.5));
      dummy.scale.set(2.5, floorH, 3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      edgeRef.current.setMatrixAt(i, dummy.matrix);

      // Bottom side buildings
      dummy.position.set(x, floorH / 2, roadW / 2 + 2.5);
      dummy.scale.set(2.5, floorH, 3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i + 10, dummy.matrix);
      edgeRef.current.setMatrixAt(i + 10, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    edgeRef.current.instanceMatrix.needsUpdate = true;
    invalidate();
  }, [levers.roadWidthM, levers.maxFloors, invalidate]);

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geo, mat, count]} />
      <instancedMesh ref={edgeRef} args={[edgeGeo, edgeMat, count]} />
    </group>
  );
}
