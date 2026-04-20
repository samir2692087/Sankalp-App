"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { AppTheme } from '@/lib/types';

interface SceneProps {
  streak: number;
  theme: AppTheme;
}

function EnergyCore({ streak, theme }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const themeColor = useMemo(() => {
    switch (theme) {
      case 'purple': return '#a855f7';
      case 'amoled': return '#ffffff';
      case 'light': return '#3b82f6';
      default: return '#7c3aed';
    }
  }, [theme]);

  const intensity = Math.min(0.2 + streak * 0.05, 1.5);
  const speed = Math.min(0.5 + streak * 0.05, 2.5);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.rotation.z = t * 0.05;
      const pulse = 1 + Math.sin(t * speed) * 0.03;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0, -2.5]}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <MeshDistortMaterial
          color={themeColor}
          speed={speed}
          distort={0.3}
          radius={1}
          emissive={themeColor}
          emissiveIntensity={intensity}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function NeuralParticles({ streak, theme }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = Math.min(150 + streak * 5, 500); // Optimized count
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const color = useMemo(() => {
    switch (theme) {
      case 'purple': return '#d8b4fe';
      case 'amoled': return '#ffffff';
      case 'light': return '#93c5fd';
      default: return '#c4b5fd';
    }
  }, [theme]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.03;
    pointsRef.current.rotation.x = t * 0.01;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3}
      />
    </Points>
  );
}

function Scene({ streak, theme }: SceneProps) {
  const ambientIntensity = theme === 'amoled' ? 0.05 : 0.15;
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <EnergyCore streak={streak} theme={theme} />
      <NeuralParticles streak={streak} theme={theme} />
    </>
  );
}

export default function Scene3D({ streak, theme }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-background" />;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-background transition-colors duration-700">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 70 }} 
        gl={{ antialias: true, alpha: true, stencil: false }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene streak={streak} theme={theme} />
      </Canvas>
    </div>
  );
}