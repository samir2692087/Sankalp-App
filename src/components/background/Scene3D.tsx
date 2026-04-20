
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
  
  // Theme-based colors
  const color = useMemo(() => {
    switch (theme) {
      case 'purple': return '#a855f7';
      case 'amoled': return '#ffffff';
      case 'light': return '#3b82f6';
      default: return '#8b5cf6';
    }
  }, [theme]);

  // Intensity increases with streak
  const intensity = Math.min(0.5 + streak * 0.1, 3.5);
  const speed = Math.min(1 + streak * 0.1, 4);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.z = t * 0.1;
      // Subtle pulse
      const pulse = 1 + Math.sin(t * speed) * 0.05;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, -2]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={0.4}
          radius={1}
          emissive={color}
          emissiveIntensity={intensity}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function NeuralParticles({ streak, theme }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = Math.min(200 + streak * 10, 1000);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const color = useMemo(() => {
    switch (theme) {
      case 'purple': return '#d8b4fe';
      case 'amoled': return '#ffffff';
      case 'light': return '#60a5fa';
      default: return '#c084fc';
    }
  }, [theme]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.05;
    pointsRef.current.rotation.x = t * 0.02;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

function Scene({ streak, theme }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
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

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#050505]" />;

  return (
    <div className="fixed inset-0 -z-10 bg-[#050505] pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene streak={streak} theme={theme} />
      </Canvas>
    </div>
  );
}
