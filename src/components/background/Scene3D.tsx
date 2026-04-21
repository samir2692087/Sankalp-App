
"use client";

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PointMaterial, 
  MeshDistortMaterial, 
  PerspectiveCamera, 
  Stars, 
  Environment 
} from '@react-three/drei';
import * as THREE from 'three';
import { useInteraction } from '@/context/InteractionContext';
import { cn } from '@/lib/utils';

interface SceneProps {
  streak: number;
  theme: string;
  riskLevel?: string;
  isBlurred?: boolean;
}

function EnergyCore({ intensity = 0, mode = 'calm' }: { intensity?: number, mode?: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const secondaryLightRef = useRef<THREE.PointLight>(null!);
  
  const coreColor = useMemo(() => {
    if (mode === 'risk') return '#ff1e1e';
    if (mode === 'focus') return '#6366f1';
    return '#7c3aed';
  }, [mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current || !glowRef.current) return;
    
    const safeIntensity = typeof intensity === 'number' && !isNaN(intensity) ? intensity : 0;
    
    // Core Rotation & Pulsing
    meshRef.current.rotation.y = t * 0.1 * (1 + safeIntensity * 2);
    meshRef.current.rotation.z = t * 0.05;
    
    const pulse = 1 + Math.sin(t * 2) * 0.05 + safeIntensity * 0.1;
    meshRef.current.scale.set(pulse, pulse, pulse);
    
    // Glow Layer Scaling
    const glowPulse = 1.2 + Math.sin(t * 1.5) * 0.1 + safeIntensity * 0.15;
    glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
    glowRef.current.rotation.x = -t * 0.05;

    // Layered Lighting Simulation (Fake Bloom)
    if (lightRef.current) {
      lightRef.current.intensity = (40 + safeIntensity * 100) * (mode === 'risk' ? 1.5 : 1);
    }
    if (secondaryLightRef.current) {
      secondaryLightRef.current.intensity = (20 + safeIntensity * 60) * (mode === 'risk' ? 1.2 : 1);
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Primary Light Source */}
      <pointLight ref={lightRef} color={coreColor} intensity={50} distance={15} decay={2} />
      
      {/* Secondary Soft Fill Light for Bloom Effect */}
      <pointLight ref={secondaryLightRef} color={coreColor} intensity={25} distance={30} decay={1} />

      {/* Main Distorted Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color={coreColor}
          speed={2}
          distort={0.4 + (intensity || 0) * 0.3}
          radius={1}
          emissive={coreColor}
          emissiveIntensity={2 + (intensity || 0) * 5}
        />
      </mesh>

      {/* Volumetric Glow Layer (Fake Bloom) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshStandardMaterial
          color={coreColor}
          transparent
          opacity={0.15 + (intensity || 0) * 0.1}
          emissive={coreColor}
          emissiveIntensity={5 + (intensity || 0) * 10}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function NeuralParticles({ intensity = 0 }: { intensity?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 2000;
  
  const { positions, initialPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
      initial[i * 3] = pos[i * 3];
      initial[i * 3 + 1] = pos[i * 3 + 1];
      initial[i * 3 + 2] = pos[i * 3 + 2];
    }
    return { positions: pos, initialPositions: initial };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const points = pointsRef.current;
    if (!points || !points.geometry) return;
    
    const posAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr || !posAttr.array || !initialPositions) return;
    
    const array = posAttr.array as Float32Array;
    const safeIntensity = typeof intensity === 'number' && !isNaN(intensity) ? intensity : 0;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      array[ix] = initialPositions[ix] + Math.sin(t * 0.5 + initialPositions[iz]) * 0.5;
      array[iy] = initialPositions[iy] + Math.cos(t * 0.3 + initialPositions[ix]) * 0.5;
      
      if (safeIntensity > 0.1) {
        array[ix] += (Math.random() - 0.5) * safeIntensity * 1.5;
        array[iy] += (Math.random() - 0.5) * safeIntensity * 1.5;
      }
    }
    posAttr.needsUpdate = true;
    points.rotation.y = t * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#22d3ee"
        size={0.07}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4 + (intensity || 0) * 0.5}
      />
    </points>
  );
}

function CameraRig() {
  useFrame((state) => {
    const { mouse, camera } = state;
    if (!camera) return;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 3, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 3, 0.02);
    camera.lookAt(0, 0, -5);
  });
  return <PerspectiveCamera makeDefault fov={50} position={[0, 0, 10]} />;
}

export default function Scene3D({ isBlurred }: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const interaction = useInteraction();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const intensity = typeof interaction?.intensity === 'number' ? interaction.intensity : 0;
  const mode = interaction?.mode ?? 'calm';

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#05070a]" />;

  return (
    <div className={cn(
      "fixed inset-0 -z-10 pointer-events-none bg-[#05070a] transition-all duration-1000",
      isBlurred ? 'blur-2xl scale-110' : ''
    )}>
      {/* Cinematic Vignette Overlay (Stable CSS-based) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      
      {/* Static Noise Grain (Stable CSS-based) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <Canvas gl={{ antialias: true, stencil: false, alpha: false }} dpr={[1, 2]}>
        <CameraRig />
        <ambientLight intensity={0.2} />
        
        <Suspense fallback={null}>
          <EnergyCore intensity={intensity} mode={mode} />
          <NeuralParticles intensity={intensity} />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
