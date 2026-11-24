import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNeevStore } from '../../store/useNeevStore.js';
import Buildings from './Buildings.jsx';
import Roads from './Roads.jsx';
import Trees from './Trees.jsx';
import Lighting from './Lighting.jsx';

function Scene({ baseline, levers, stage }) {
  const { invalidate } = useThree();

  // Invalidate on any change
  useEffect(() => { invalidate(); }, [baseline, levers, stage, invalidate]);

  return (
    <>
      <Lighting />
      <Roads baseline={baseline} levers={levers} stage={stage} />
      <Buildings baseline={baseline} levers={levers} stage={stage} />
      <Trees levers={levers} stage={stage} />
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
        <planeGeometry args={[60, 60]} />
        <meshLambertMaterial color="#F5F0E8" />
      </mesh>
    </>
  );
}

export default function Scene3D() {
  const baseline = useNeevStore((s) => s.baseline);
  const levers = useNeevStore((s) => s.levers);
  const stage = useNeevStore((s) => s.stage);

  if (!baseline) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-paper">
        <div className="font-mono text-xs text-muted opacity-50">Select a site to load the 3D scene</div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      shadows={false}
      camera={{ position: [0, 20, 25], fov: 45 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: false }}
      style={{ background: '#F8FAFC' }}
    >
      <color attach="background" args={['#F8FAFC']} />
      <fog attach="fog" args={['#F8FAFC', 40, 80]} />
      <Scene baseline={baseline} levers={levers} stage={stage} />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={45}
        dampingFactor={0.1}
        enableDamping
      />
    </Canvas>
  );
}
