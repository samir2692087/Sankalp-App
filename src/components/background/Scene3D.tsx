
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

  // Physics-based inertia and damping simulation
  const targetIntensity = isBlurred ? 0.5 : Math.min(1.5 + streak * 0.15, 4);
  const targetSpeed = isBlurred ? 0.1 : Math.min(1.2 + streak * 0.1, 4.5);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotation with inertia
      meshRef.current.rotation.y += (0.005 + (streak * 0.0001)) * (isBlurred ? 0.2 : 1);
      meshRef.current.rotation.z += (0.002 + (streak * 0.00005)) * (isBlurred ? 0.1 : 1);
      
      // Breathing physics
      const breathing = 1 + Math.sin(t * (isBlurred ? 0.5 : 1.5 + streak * 0.02)) * 0.05;
      meshRef.current.scale.lerp(new THREE.Vector3(breathing, breathing, breathing), 0.1);
    }
    
    if (lightRef.current) {
      // Light intensity pulsing with spring-like damping
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity + Math.sin(t * 2) * 0.2,
        0.05
      );
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 2]} color={themeColor} intensity={0} />
      <Float speed={isBlurred ? 0.5 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <MeshDistortMaterial
            color={themeColor}
            speed={targetSpeed}
            distort={isBlurred ? 0.05 : 0.4 + (streak * 0.01)}
            radius={1}
            emissive={themeColor}
            emissiveIntensity={isBlurred ? 0.1 : 0.4}
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      {/* Halo Layer */}
      <mesh position={[0, 0, -3.1]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color={themeColor} transparent opacity={isBlurred ? 0.05 : 0.08} />
      </mesh>
    </group>
  );
}

function NeuralParticles({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = Math.min(400 + streak * 15, 1200);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
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
    const driftSpeed = isBlurred ? 0.005 : 0.03 + (streak * 0.001);
    
    pointsRef.current.rotation.y += driftSpeed * 0.1;
    
    const positionsAttr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Brownian-like jitter motion
      positionsAttr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.001;
      positionsAttr[i * 3] += Math.cos(t * 0.3 + i) * 0.0005;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={isBlurred ? 0.15 : 0.08 + streak * 0.0005}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isBlurred ? 0.15 : 0.4}
      />
    </Points>
  );
}

function Scene({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const { camera } = (window as any).THREE_STATE || { camera: { position: { z: 5 } } };
  
  useFrame((state) => {
    // Camera Dolly Physics: Depth reactive to app state
    const targetZ = isBlurred ? 7 : 5;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.lookAt(0, 0, -3);
  });

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

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#05070a]" />;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#05070a]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 55 }} 
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene streak={streak} theme={theme} riskLevel={riskLevel} isBlurred={isBlurred} />
      </Canvas>
    </div>
  );
}
