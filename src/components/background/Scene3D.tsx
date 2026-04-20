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
    if (riskLevel === 'CRITICAL') return '#ff1e1e';
    if (riskLevel === 'ELEVATED') return '#ff9900';
    switch (theme) {
      case 'purple': return '#d946ef';
      case 'amoled': return '#ffffff';
      case 'light': return '#3b82f6';
      default: return '#8b5cf6';
    }
  }, [theme, riskLevel]);

  // Streak affects core behavior: more energetic as it grows
  const baseIntensity = isBlurred ? 5 : Math.min(1.5 + streak * 0.15, 4);
  const baseSpeed = isBlurred ? 0.3 : Math.min(1.2 + streak * 0.1, 4.5);
  const distortion = Math.min(0.3 + streak * 0.02, 0.7);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * (isBlurred ? 0.05 : 0.3 + streak * 0.01);
      meshRef.current.rotation.z = t * (isBlurred ? 0.02 : 0.15 + streak * 0.005);
      const breathing = 1 + Math.sin(t * (isBlurred ? 0.8 : 2 + streak * 0.05)) * 0.08;
      meshRef.current.scale.set(breathing, breathing, breathing);
    }
    if (lightRef.current) {
      lightRef.current.intensity = baseIntensity + Math.sin(t * (3 + streak * 0.1)) * 0.5;
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 2]} color={themeColor} intensity={baseIntensity} />
      <Float speed={isBlurred ? 1 : 3} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <MeshDistortMaterial
            color={themeColor}
            speed={baseSpeed}
            distort={isBlurred ? 0.1 : distortion}
            radius={1}
            emissive={themeColor}
            emissiveIntensity={baseIntensity * 0.6}
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      {/* Outer Glow Halo */}
      <mesh position={[0, 0, -3.1]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color={themeColor} transparent opacity={isBlurred ? 0.15 : 0.1} />
      </mesh>
    </group>
  );
}

function NeuralParticles({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  // More particles for higher streaks
  const count = Math.min(400 + streak * 15, 1200);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 28;
      p[i * 3 + 1] = (Math.random() - 0.5) * 28;
      p[i * 3 + 2] = (Math.random() - 0.5) * 18 - 5;
    }
    return p;
  }, [count]);

  const color = useMemo(() => {
    if (riskLevel === 'CRITICAL') return '#ff8a8a';
    switch (theme) {
      case 'purple': return '#f5d0fe';
      case 'amoled': return '#ffffff';
      case 'light': return '#bfdbfe';
      default: return '#ddd6fe';
    }
  }, [theme, riskLevel]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const speedMultiplier = isBlurred ? 0.01 : 0.08 + streak * 0.002;
    pointsRef.current.rotation.y = t * speedMultiplier;
    pointsRef.current.rotation.z = t * (speedMultiplier / 2);
    
    const positionsAttr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positionsAttr[i * 3 + 1] += Math.sin(t * 1.5 + i) * (isBlurred ? 0.0008 : 0.003 + streak * 0.0001);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={isBlurred ? 0.18 : 0.1 + streak * 0.001}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isBlurred ? 0.25 : 0.5}
      />
    </Points>
  );
}

function Scene({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
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
        camera={{ position: [0, 0, 5], fov: 55 }} 
        gl={{ antialias: true, alpha: true, stencil: false }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene streak={streak} theme={theme} riskLevel={riskLevel} isBlurred={isBlurred} />
      </Canvas>
    </div>
  );
}