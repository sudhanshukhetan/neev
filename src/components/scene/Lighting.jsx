import React from 'react';
import { Sky } from '@react-three/drei';

export default function Lighting() {
  return (
    <>
      {/* Sky dome with realistic atmospheric scattering */}
      <Sky
        distance={450000}
        sunPosition={[60, 45, 80]}
        inclination={0.6}
        azimuth={0.25}
        turbidity={7}
        rayleigh={4}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Hemisphere light mimicking sky and ground reflections */}
      <hemisphereLight
        skyColor="#BAE6FD"
        groundColor="#FEF3C7"
        intensity={0.65}
      />

      {/* Main directional sun with soft shadows */}
      <directionalLight
        position={[35, 50, 35]}
        intensity={1.2}
        color="#FFFDF0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0005}
      />

      {/* Fill directional light from opposing angle */}
      <directionalLight
        position={[-25, 20, -25]}
        intensity={0.35}
        color="#93C5FD"
      />
    </>
  );
}
