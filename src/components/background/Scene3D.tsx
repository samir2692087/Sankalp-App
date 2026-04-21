
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
import { 
  EffectComposer, 
  Bloom, 
  Noise, 
  Vignette, 
  ChromaticAberration 
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { useInteraction } from '@/context/InteractionContext';

interface SceneProps {
  streak: number;
  theme: string;
  riskLevel?: string;
  isBlurred?: boolean;
}

function EnergyCore({ intensity, mode }: { intensity: number, mode: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  
  const coreColor = useMemo(() => {
    if (mode === 'risk') return '#ff1e1e';
    if (mode === 'focus') return '#6366f1';
    return '#7c3aed';
  }, [mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    
    const safeIntensity = typeof intensity === 'number' && !isNaN(intensity) ? intensity : 0;
    meshRef.current.rotation.y = t * 0.1 * (1 + safeIntensity * 2);
    meshRef.current.rotation.z = t * 0.05;
    const pulse = 1 + Math.sin(t * 2) * 0.05 + safeIntensity * 0.2;
    meshRef.current.scale.set(pulse, pulse, pulse);

    if (lightRef.current) {
      lightRef.current.intensity = (50 + safeIntensity * 200) * (mode === 'risk' ? 1.5 : 1);
    }
  });

  return (
    <group position={[0, 0, -5]}>
      <pointLight ref={lightRef} color={coreColor} intensity={50} distance={20} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color={coreColor}
          speed={2}
          distort={0.4 + (intensity || 0) * 0.5}
          radius={1}
          emissive={coreColor}
          emissiveIntensity={1 + (intensity || 0) * 4}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function NeuralParticles({ intensity }: { intensity: number }) {
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
      
      array[ix] = initialPositions[ix] + Math.sin(t * 0.5 + initialPositions[i * 3 + 2]) * 0.5;
      array[iy] = initialPositions[iy] + Math.cos(t * 0.3 + initialPositions[ix]) * 0.5;
      
      if (safeIntensity > 0.1) {
        array[ix] += (Math.random() - 0.5) * safeIntensity * 2;
        array[iy] += (Math.random() - 0.5) * safeIntensity * 2;
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
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3 + (intensity || 0) * 0.7}
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

function PostProcessingStack({ intensity = 0, mode = 'calm' }: { intensity?: number, mode?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const chromaticOffset = useMemo(() => {
    const val = mode === 'risk' ? 0.008 : 0;
    return new THREE.Vector2(val, val);
  }, [mode]);

  if (!mounted) return null;

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.2 + (intensity ?? 0) * 4} 
        radius={0.5} 
      />
      <Noise opacity={0.04} />
      <Vignette offset={0.1} darkness={1.2} />
      <ChromaticAberration offset={chromaticOffset} />
    </EffectComposer>
  );
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
    <div className={`fixed inset-0 -z-10 pointer-events-none bg-[#05070a] transition-all duration-1000 ${isBlurred ? 'blur-2xl scale-110' : ''}`}>
      <Canvas gl={{ antialias: true, stencil: true }}>
        <CameraRig />
        <ambientLight intensity={0.1} />
        
        <Suspense fallback={null}>
          <EnergyCore intensity={intensity} mode={mode} />
          <NeuralParticles intensity={intensity} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
          {/* Moving post-processing inside Suspense boundary to synchronize with the scene context */}
          <PostProcessingStack intensity={intensity} mode={mode} />
        </Suspense>
      </Canvas>
    </div>
  );
}
