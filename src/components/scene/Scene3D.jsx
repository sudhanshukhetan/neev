/**
 * src/components/scene/Scene3D.jsx
 * Unified Three.js 3D viewport for both Urban Redevelopment Simulation
 * and Greenfield Plain-Land Construction Studio.
 * Features:
 *  - Directional sunlight with soft shadow maps and Sky dome
 *  - Procedural procedural models for Highway, Overbridge, Societies, Houses, Parks, and Health Hub
 *  - Smooth camera presets: Isometric, Street-Level, Top-Down Blueprint
 */

import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNeevStore } from '../../store/useNeevStore.js';
import Buildings from './Buildings.jsx';
import Roads from './Roads.jsx';
import Trees from './Trees.jsx';
import Lighting from './Lighting.jsx';
import FireTender3D from './FireTender3D.jsx';
import FloodPlane3D from './FloodPlane3D.jsx';

// Greenfield Plain Land 3D Models
import Highway3D from './Highway3D.jsx';
import Overbridge3D from './Overbridge3D.jsx';
import ResidentialSociety3D from './ResidentialSociety3D.jsx';
import IndependentHouse3D from './IndependentHouse3D.jsx';
import CommunityPark3D from './CommunityPark3D.jsx';
import CivicHealthHub3D from './CivicHealthHub3D.jsx';

// Camera Controller for smooth preset switching
function CameraPresetController({ preset = 'isometric' }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (preset === 'street') {
      camera.position.set(0, 2.8, 16);
      camera.lookAt(0, 2, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 52, 0.001);
      camera.lookAt(0, 0, 0);
    } else {
      // Default: Isometric
      camera.position.set(24, 20, 24);
      camera.lookAt(0, 1.5, 0);
    }
  }, [preset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      minPolarAngle={preset === 'top' ? 0 : Math.PI / 10}
      maxPolarAngle={preset === 'top' ? Math.PI : Math.PI / 2.05}
      minDistance={6}
      maxDistance={75}
      dampingFactor={0.08}
      enableDamping
    />
  );
}

// Urban Redevelopment Scene Content
function UrbanScene({ baseline, levers, stage, monsoonActive, monsoonRainMmHr, fireDispatchActive }) {
  const { invalidate } = useThree();
  useEffect(() => { invalidate(); }, [baseline, levers, stage, monsoonActive, monsoonRainMmHr, fireDispatchActive, invalidate]);

  return (
    <group>
      <Roads baseline={baseline} levers={levers} stage={stage} />
      <Buildings baseline={baseline} levers={levers} stage={stage} />
      <Trees levers={levers} stage={stage} />

      {/* Story Simulation Overlays */}
      {fireDispatchActive && <FireTender3D baseline={baseline} levers={levers} stage={stage} />}
      {monsoonActive && <FloodPlane3D baseline={baseline} levers={levers} rainMmHr={monsoonRainMmHr} />}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Greenfield Plain Land Scene Content
function PlainLandScene({ plainLand }) {
  const { invalidate } = useThree();
  useEffect(() => { invalidate(); }, [plainLand, invalidate]);

  const ids = plainLand.selectedIds || [];
  const hasHighway = ids.includes('highway');
  const hasBridge = ids.includes('overbridge');
  const hasSociety = ids.includes('society');
  const hasHouse = ids.includes('house');
  const hasPark = ids.includes('park');
  const hasHealthHub = ids.includes('health_hub');

  return (
    <group>
      {/* Virgin Greenfield Topography */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#E7ECE6" roughness={0.9} />
      </mesh>

      {/* 1. Express Highway along the spine */}
      {hasHighway && <Highway3D position={[hasSociety ? -16 : 0, 0, 0]} />}

      {/* 2. Overbridge / Flyover */}
      {hasBridge && <Overbridge3D position={[hasSociety ? -16 : 0, 0, 0]} />}

      {/* 3. Planned Residential Society */}
      {hasSociety && <ResidentialSociety3D position={[hasHighway ? 10 : 0, 0, -8]} />}

      {/* 4. Independent Courtyard House Cluster */}
      {hasHouse && <IndependentHouse3D position={[hasHighway ? 10 : 0, 0, 14]} />}

      {/* 5. Community Park & Recharge Pond */}
      {hasPark && <CommunityPark3D position={[hasSociety ? 12 : -14, 0, 0]} />}

      {/* 6. Primary Health & Civic Hub */}
      {hasHealthHub && <CivicHealthHub3D position={[hasSociety ? -8 : 14, 0, 12]} />}
    </group>
  );
}

export default function Scene3D() {
  const {
    appMode,
    baseline,
    levers,
    stage,
    monsoonActive,
    monsoonRainMmHr,
    fireDispatchActive,
    plainLand,
    cameraPreset,
    setCameraPreset,
  } = useNeevStore();

  const isUrban = appMode === 'urban';

  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={[1, 1.75]}
        frameloop="demand"
        shadows
        camera={{ position: [24, 20, 24], fov: 42 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#F8FAFC' }}
      >
        <color attach="background" args={['#F8FAFC']} />
        <fog attach="fog" args={['#F8FAFC', 50, 110]} />
        <Lighting />

        {isUrban ? (
          <UrbanScene
            baseline={baseline}
            levers={levers}
            stage={stage}
            monsoonActive={monsoonActive}
            monsoonRainMmHr={monsoonRainMmHr}
            fireDispatchActive={fireDispatchActive}
          />
        ) : (
          <PlainLandScene plainLand={plainLand} />
        )}

        <CameraPresetController preset={cameraPreset} />
      </Canvas>
    </div>
  );
}
