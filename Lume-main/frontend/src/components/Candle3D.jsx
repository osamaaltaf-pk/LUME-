import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Candle3D = ({ shape = 'classic', color, size, position = [0, 0, 0] }) => {
  const meshRef = useRef();
  const flameRef = useRef();
  const lightRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);

  // Mouse/touch interaction
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    // Rotate based on mouse movement
    setRotation(prev => [
      prev[0] + e.movementY * 0.01,
      prev[1] + e.movementX * 0.01,
      prev[2]
    ]);
  };

  useFrame((state, delta) => {
    // Auto-rotation
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y += delta * 0.2;
    }

    // Flame Animation - Simple sine wave flicker
    if (flameRef.current && lightRef.current) {
      const time = state.clock.elapsedTime;
      const flicker = Math.sin(time * 10) * 0.1 + Math.cos(time * 20) * 0.05;

      // Scale flame to pulse
      const scaleBase = 1 + flicker * 0.3;
      flameRef.current.scale.set(scaleBase, scaleBase * 1.5 + flicker * 0.5, scaleBase); // Elongate Y

      // Vary light intensity
      lightRef.current.intensity = 0.8 + flicker * 0.3;

      // Slight jitter in position
      flameRef.current.position.x = Math.sin(time * 15) * 0.01;
      flameRef.current.position.z = Math.cos(time * 12) * 0.01;
    }
  });

  const getScale = () => {
    switch (size) {
      case 'small': return 0.7;
      case 'medium': return 1;
      case 'large': return 1.3;
      case 'x-large': return 1.6;
      default: return 1;
    }
  };

  const scaleVal = getScale();
  const scale = [scaleVal, scaleVal, scaleVal];

  const renderShape = () => {
    switch (shape) {
      case 'geometric':
        return (
          <group>
            {/* Stacked Octahedrons - Thicker */}
            <mesh position={[0, -0.7, 0]}>
              <octahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
              <octahedronGeometry args={[0.6, 0]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.9, 0]}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case 'bubble':
        return (
          <group position={[0, -0.2, 0]}>
            {/* 2x2x2 Sphere Cube */}
            {[
              [-0.25, -0.25, -0.25], [0.25, -0.25, -0.25],
              [-0.25, 0.25, -0.25], [0.25, 0.25, -0.25],
              [-0.25, -0.25, 0.25], [0.25, -0.25, 0.25],
              [-0.25, 0.25, 0.25], [0.25, 0.25, 0.25]
            ].map((pos, i) => (
              <mesh key={i} position={pos}>
                <sphereGeometry args={[0.26, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
      case 'rose-ball':
        return (
          <group position={[0, -0.2, 0]}>
            {/* Uses a simpler geometry representation to prevent lag if needed, but current rose logic seems ok.
                 Optimization: Reduce segments if laggy. Current args=[0.08, 0.06, 50, 5, 2, 3] is okay. 
             */}
            <mesh>
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {Array.from({ length: 100 }).map((_, i) => {
              const phi = Math.acos(-1 + (2 * i) / 100);
              const theta = Math.sqrt(100 * Math.PI) * phi;
              const r = 0.62 + Math.random() * 0.05;

              const x = r * Math.cos(theta) * Math.sin(phi);
              const y = r * Math.sin(theta) * Math.sin(phi);
              const z = r * Math.cos(phi);

              return (
                <mesh
                  key={i}
                  position={[x, y, z]}
                  rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
                >
                  <torusKnotGeometry args={[0.08, 0.06, 30, 4, 2, 3]} /> {/* Reduced segments slightly for perf */}
                  <meshStandardMaterial color={color} />
                </mesh>
              );
            })}
          </group>
        );
      case 'classic':
      default:
        return (
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  // Wick position adjustments based on shape
  const getWickPosition = () => {
    switch (shape) {
      case 'geometric': return [0, 1.25, 0];
      case 'bubble': return [0, 0.55, 0];
      case 'rose-ball': return [0, 0.9, 0];
      default: return [0, 1.1, 0];
    }
  };

  const wickPos = getWickPosition();
  // Flame is relative to wick, but we animate it separately inside the group
  // We attach the flame mesh AT the wick position + offset
  const flameBasePos = [wickPos[0], wickPos[1] + 0.15, wickPos[2]];

  return (
    <group
      ref={meshRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      {renderShape()}

      {/* Wick */}
      <mesh position={wickPos}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Animated Flame Group */}
      <group position={flameBasePos}>
        <mesh ref={flameRef}>
          {/* Cone/Sphere hybrid for flame shape */}
          <dodecahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
        </mesh>
        <pointLight ref={lightRef} color="#ffaa00" distance={3} decay={2} />
      </group>
    </group>
  );
};

export default Candle3D;