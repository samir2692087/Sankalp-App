
"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { AppTheme } from '@/lib/types';
import { useInteraction } from '@/context/InteractionContext';

interface SceneProps {
  streak: number;
  theme: AppTheme;
  riskLevel?: string;
  isBlurred?: boolean;
}

function EnergyCore({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const { intensity, mode } = useInteraction();
  
  const themeColor = useMemo(() => {
    if (mode === 'risk') return '#ff3e3e';
    if (mode === 'focus') return '#6366f1';
    if (riskLevel === 'CRITICAL') return '#ff1e1e';
    switch (theme) {
      case 'purple': return '#a855f7';
      case 'amoled': return '#ffffff';
      case 'light': return '#3b82f6';
      default: return '#8b5cf6';
    }
  }, [theme, riskLevel, mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { mouse } = state;

    if (meshRef.current) {
      // Rotation physics with inertia
      const speedFactor = mode === 'risk' ? (2.5 + intensity * 10) : (1.2 + intensity * 4);
      meshRef.current.rotation.y += (0.004 + (streak * 0.0001)) * speedFactor;
      meshRef.current.rotation.z += (0.002 + (streak * 0.00005)) * speedFactor;
      
      // Magnetic response to mouse position
      const targetX = mouse.x * (0.8 + intensity);
      const targetY = mouse.y * (0.8 + intensity);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);

      // Organic pulse scale
      const pulseFreq = mode === 'risk' ? 8 : 1.5 + (streak * 0.01);
      const breathing = 1 + Math.sin(t * pulseFreq) * (mode === 'focus' ? 0.02 : 0.06);
      const interactionScale = 1 + (intensity * (mode === 'risk' ? 0.6 : 0.3));
      const finalScale = breathing * interactionScale;
      
      meshRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.1);
    }
    
    if (lightRef.current) {
      const baseIntensity = isBlurred ? 0.8 : Math.min(2 + streak * 0.2, 5);
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        (baseIntensity + intensity * 12) + Math.sin(t * 15) * (intensity * 2),
        0.1
      );
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 2]} color={themeColor} intensity={0} distance={15} />
      <Float speed={isBlurred ? 0.5 : mode === 'risk' ? 10 : 3} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <sphereGeometry args={[1.8, 64, 64]} />
          <MeshDistortMaterial
            color={themeColor}
            speed={isBlurred ? 0.2 : (1.5 + streak * 0.1) * (1 + intensity * 3)}
            distort={isBlurred ? 0.1 : (mode === 'focus' ? 0.25 : 0.45 + (streak * 0.015)) + (intensity * 0.5)}
            radius={1}
            emissive={themeColor}
            emissiveIntensity={isBlurred ? 0.1 : 0.6 + intensity * 2}
            transparent
            opacity={0.85}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </Float>
    </group>
  );
}

function NeuralParticles({ streak, theme, mode, isBlurred }: { streak: number; theme: AppTheme; mode: string; isBlurred?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const { intensity } = useInteraction();
  
  // Create layered particles with different behaviors
  const count = Math.min(600 + streak * 20, 1500);
  
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 25 - 5;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      initial[i * 3] = x;
      initial[i * 3 + 1] = y;
      initial[i * 3 + 2] = z;
    }
    return [pos, initial];
  }, [count]);

  const particleColor = useMemo(() => {
    if (mode === 'risk') return '#ff8080';
    if (mode === 'focus') return '#a5b4fc';
    switch (theme) {
      case 'purple': return '#f0abfc';
      case 'amoled': return '#ffffff';
      default: return '#c4b5fd';
    }
  }, [theme, mode]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const { mouse } = state;
    const posAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Drift physics with noise
      const noise = Math.sin(t * 0.2 + initialPositions[ix]) * 0.5;
      posAttr.array[ix] = initialPositions[ix] + noise + (mouse.x * intensity * 5);
      posAttr.array[iy] = initialPositions[iy] + Math.cos(t * 0.2 + initialPositions[iy]) * 0.5 + (mouse.y * intensity * 5);
      
      // Reactive scattering on intensity pulse
      if (intensity > 0.1) {
        const dist = Math.sqrt(Math.pow(posAttr.array[ix], 2) + Math.pow(posAttr.array[iy], 2));
        const force = intensity * 2 / (dist + 1);
        posAttr.array[ix] += (posAttr.array[ix] / dist) * force;
        posAttr.array[iy] += (posAttr.array[iy] / dist) * force;
      }
    }
    posAttr.needsUpdate = true;
    
    // Slow global rotation
    pointsRef.current.rotation.y += 0.0002 * (1 + intensity * 5);
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={particleColor}
        size={isBlurred ? 0.2 : (0.1 + streak * 0.0006) + intensity * 0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isBlurred ? 0.1 : (mode === 'focus' ? 0.3 : 0.5) + intensity * 0.5}
      />
    </Points>
  );
}

function CinematicCamera({ isBlurred, mode }: { isBlurred?: boolean; mode: string }) {
  const { intensity } = useInteraction();
  
  useFrame((state) => {
    const { mouse } = state;
    // Dolly zoom based on focus/risk state
    const targetZ = isBlurred ? 8 : mode === 'focus' ? 4.5 : 5.5 - (intensity * 0.8);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    // Smooth camera parallax
    const targetX = mouse.x * 1.5;
    const targetY = mouse.y * 1.5;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.03);
    
    state.camera.lookAt(0, 0, -3);
  });

  return <PerspectiveCamera makeDefault fov={55} />;
}

export default function Scene3D(props: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const { mode } = useInteraction();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#05070a]" />;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#05070a]">
      <Canvas 
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <CinematicCamera isBlurred={props.isBlurred} mode={mode} />
        <ambientLight intensity={0.2 + (mode === 'risk' ? 0.3 : 0)} />
        <EnergyCore {...props} />
        <NeuralParticles {...props} mode={mode} />
      </Canvas>
    </div>
  );
}
