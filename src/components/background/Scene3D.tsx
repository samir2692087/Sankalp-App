
"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
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
    if (mode === 'risk') return '#ff1e1e';
    if (mode === 'focus') return '#3b82f6';
    if (riskLevel === 'CRITICAL') return '#ff1e1e';
    switch (theme) {
      case 'purple': return '#d946ef';
      case 'amoled': return '#ffffff';
      case 'light': return '#3b82f6';
      default: return '#8b5cf6';
    }
  }, [theme, riskLevel, mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { mouse } = state;

    if (meshRef.current) {
      // Rotation influenced by mode and interaction intensity
      const speedFactor = mode === 'risk' ? (2 + intensity * 8) : (1 + intensity * 5);
      meshRef.current.rotation.y += (0.005 + (streak * 0.0001)) * speedFactor * (isBlurred ? 0.2 : 1);
      meshRef.current.rotation.z += (0.002 + (streak * 0.00005)) * speedFactor * (isBlurred ? 0.1 : 1);
      
      // Magnetic reaction to mouse
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * (0.5 + intensity), 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * (0.5 + intensity), 0.05);

      // Breathing physics with interaction distortion
      const breathingBase = mode === 'focus' ? 1.02 : 1.05;
      const breathing = 1 + Math.sin(t * (isBlurred ? 0.5 : mode === 'risk' ? 4 : 1.5 + streak * 0.02)) * (mode === 'focus' ? 0.01 : 0.05);
      const pulseScale = breathing + intensity * (mode === 'risk' ? 0.4 : 0.2);
      meshRef.current.scale.lerp(new THREE.Vector3(pulseScale, pulseScale, pulseScale), 0.1);
    }
    
    if (lightRef.current) {
      const baseIntensity = isBlurred ? 0.5 : Math.min(1.5 + streak * 0.15, 4);
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        (baseIntensity + intensity * 6) + Math.sin(t * (mode === 'risk' ? 10 : 2)) * 0.2,
        0.05
      );
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 2]} color={themeColor} intensity={0} />
      <Float speed={isBlurred ? 0.5 : mode === 'risk' ? 8 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <MeshDistortMaterial
            color={themeColor}
            speed={isBlurred ? 0.1 : Math.min(1.2 + streak * 0.1, 4.5) * (1 + intensity * (mode === 'risk' ? 3 : 1))}
            distort={isBlurred ? 0.05 : (mode === 'focus' ? 0.2 : 0.4 + (streak * 0.01)) + intensity * 0.3}
            radius={1}
            emissive={themeColor}
            emissiveIntensity={isBlurred ? 0.1 : 0.4 + intensity}
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function NeuralParticles({ streak, theme, riskLevel, isBlurred }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const { intensity, mode } = useInteraction();
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
    if (mode === 'risk') return '#ff8a8a';
    if (mode === 'focus') return '#bfdbfe';
    switch (theme) {
      case 'purple': return '#f5d0fe';
      case 'amoled': return '#ffffff';
      case 'light': return '#bfdbfe';
      default: return '#ddd6fe';
    }
  }, [theme, riskLevel, mode]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const { mouse } = state;
    
    // Magnetic drift influenced by intensity
    pointsRef.current.rotation.y += (mode === 'focus' ? 0.0005 : 0.001) * (1 + intensity * 10);
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * (0.2 + intensity), 0.02);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.y * (0.2 + intensity), 0.02);
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={isBlurred ? 0.15 : (0.08 + streak * 0.0005) + intensity * 0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isBlurred ? 0.15 : (mode === 'focus' ? 0.2 : 0.4) + intensity * 0.4}
      />
    </Points>
  );
}

function Scene(props: SceneProps) {
  const { intensity, mode } = useInteraction();
  useFrame((state) => {
    const targetZ = props.isBlurred ? 7 : mode === 'focus' ? 4 : 5 - (intensity * 0.5);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.lookAt(0, 0, -3);
  });

  return (
    <>
      <ambientLight intensity={0.2 + intensity * 0.3} />
      <EnergyCore {...props} />
      <NeuralParticles {...props} />
    </>
  );
}

export default function Scene3D(props: SceneProps) {
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
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
