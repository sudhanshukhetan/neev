import React from 'react';

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[15, 25, 15]}
        intensity={0.8}
        color="#FFFEF0"
      />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.2}
        color="#D0E8FF"
      />
    </>
  );
}
