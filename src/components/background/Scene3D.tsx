"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { AppTheme } from '@/lib/types';

interface SceneProps {
  streak: number;
  theme: AppTheme;
  riskLevel?: string;
  isBlurred?: boolean;
}

function EnergyCore({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  
  const themeColor = useMemo(() => {
    if (riskLevel === 'CRITICAL') return '#ef4444';
    if (riskLevel === 'ELEVATED') return '#f59e0b';
    switch (theme) {
      case 'purple': return '#a855f7';
      case 'amoled': return '#ffffff';
      case 'light': return '#3b82f6';
      default: return '#7c3aed';
    }
  }, [theme, riskLevel]);

  const baseIntensity = isBlurred ? 4 : Math.min(0.5 + streak * 0.1, 2.5);
  const baseSpeed = isBlurred ? 0.2 : Math.min(0.8 + streak * 0.08, 3.5);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * (isBlurred ? 0.05 : 0.2);
      meshRef.current.rotation.z = t * (isBlurred ? 0.02 : 0.1);
      const breathing = 1 + Math.sin(t * (isBlurred ? 0.5 : 1.5)) * 0.05;
      meshRef.current.scale.set(breathing, breathing, breathing);
    }
    if (lightRef.current) {
      lightRef.current.intensity = baseIntensity + Math.sin(t * 3) * 0.2;
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 2]} color={themeColor} intensity={baseIntensity} />
      <Float speed={isBlurred ? 0.5 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color={themeColor}
            speed={baseSpeed}
            distort={isBlurred ? 0.1 : 0.4}
            radius={1}
            emissive={themeColor}
            emissiveIntensity={baseIntensity * 0.5}
            transparent
            opacity={0.7}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <mesh position={[0, 0, -3]}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color={themeColor} transparent opacity={isBlurred ? 0.1 : 0.05} />
      </mesh>
    </group>
  );
}

function NeuralParticles({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = Math.min(200 + streak * 10, 800);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return p;
  }, [count]);

  const color = useMemo(() => {
    if (riskLevel === 'CRITICAL') return '#fca5a5';
    switch (theme) {
      case 'purple': return '#d8b4fe';
      case 'amoled': return '#ffffff';
      case 'light': return '#93c5fd';
      default: return '#c4b5fd';
    }
  }, [theme, riskLevel]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * (isBlurred ? 0.01 : 0.05);
    pointsRef.current.rotation.z = t * (isBlurred ? 0.005 : 0.02);
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(t + i) * (isBlurred ? 0.0005 : 0.002);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={isBlurred ? 0.15 : 0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isBlurred ? 0.2 : 0.4}
      />
    </Points>
  );
}

function Scene({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <EnergyCore streak={streak} theme={theme} riskLevel={riskLevel} isBlurred={isBlurred} />
      <NeuralParticles streak={streak} theme={theme} riskLevel={riskLevel} isBlurred={isBlurred} />
    </>
  );
}

export default function Scene3D({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-background" />;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-background transition-all duration-1000">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }} 
        gl={{ antialias: true, alpha: true, stencil: false }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene streak={streak} theme={theme} riskLevel={riskLevel} isBlurred={isBlurred} />
      </Canvas>
    </div>
  );
}
