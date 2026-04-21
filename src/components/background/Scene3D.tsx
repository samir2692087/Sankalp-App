
"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
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
import { AppTheme } from '@/lib/types';
import { useInteraction } from '@/context/InteractionContext';

interface SceneProps {
  streak: number;
  theme: AppTheme;
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
    
    const safeIntensity = intensity || 0;
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
  
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
    }
    return [pos, new Float32Array(pos)];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const points = pointsRef.current;
    if (!points || !points.geometry) return;
    
    const posAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr || !posAttr.array || posAttr.array.length === 0) return;
    
    const array = posAttr.array as Float32Array;
    const safeIntensity = intensity || 0;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      if (array[ix] !== undefined) {
        array[ix] = initialPositions[ix] + Math.sin(t * 0.5 + initialPositions[iz]) * 0.5;
        array[iy] = initialPositions[iy] + Math.cos(t * 0.3 + initialPositions[ix]) * 0.5;
        
        if (safeIntensity > 0.1) {
          array[ix] += (Math.random() - 0.5) * safeIntensity * 2;
          array[iy] += (Math.random() - 0.5) * safeIntensity * 2;
        }
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

export default function Scene3D({ isBlurred }: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const interaction = useInteraction();
  const mode = interaction?.mode || 'calm';
  const intensity = interaction?.intensity || 0;

  // Stable effect parameters to avoid EffectComposer aggregation crashes in Fiber 9
  const zeroOffset = useMemo(() => new THREE.Vector2(0, 0), []);
  const riskOffset = useMemo(() => new THREE.Vector2(0.008, 0.008), []);
  
  const currentOffset = useMemo(() => {
    return mode === 'risk' ? riskOffset : zeroOffset;
  }, [mode, riskOffset, zeroOffset]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#05070a]" />;

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none bg-[#05070a] transition-all duration-1000 ${isBlurred ? 'blur-2xl scale-110' : ''}`}>
      <Canvas gl={{ antialias: true, stencil: false }}>
        <CameraRig />
        <ambientLight intensity={0.1} />
        
        <EnergyCore intensity={intensity} mode={mode} />
        <NeuralParticles intensity={intensity} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Stable Effects Stack: No conditional children to prevent aggregation length errors in Fiber 9 */}
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.2 + (intensity || 0) * 4} 
            radius={0.5} 
          />
          <Noise opacity={0.04} />
          <Vignette offset={0.1} darkness={1.2} />
          <ChromaticAberration offset={currentOffset} />
        </EffectComposer>
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
