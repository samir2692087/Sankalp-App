"use client";

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Stars, 
  Environment,
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';
import { useInteraction } from '@/context/InteractionContext';
import { cn } from '@/lib/utils';
import { AppTheme } from '@/lib/types';

// --- ASTRONOMICAL DATA (Scaled for visual clarity) ---
const PLANET_DATA = [
  { name: 'Mercury', color: '#A5A5A5', a: 4.5, b: 4.2, baseSpeed: 1.6, size: 0.1, tilt: 0.03, spin: 0.04 },
  { name: 'Venus', color: '#E3BB76', a: 6.5, b: 6.0, baseSpeed: 1.1, size: 0.2, tilt: 0.47, spin: 0.005 },
  { name: 'Earth', color: '#2271B3', a: 9.0, b: 8.5, baseSpeed: 0.8, size: 0.22, tilt: 0.41, spin: 0.02 },
  { name: 'Mars', color: '#E27B58', a: 11.5, b: 10.8, baseSpeed: 0.6, size: 0.18, tilt: 0.44, spin: 0.018 },
  { name: 'Jupiter', color: '#D39C7E', a: 16.0, b: 15.0, baseSpeed: 0.3, size: 0.5, tilt: 0.05, spin: 0.045 },
];

// --- COMPONENTS ---

function Sun({ theme }: { theme: AppTheme }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const sunColor = theme === 'purple' ? '#a855f7' : '#ffcc33';
  const emissiveColor = theme === 'purple' ? '#d8b4fe' : '#ffaa00';
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <group>
      {/* The Sun: Central Light and Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial 
          emissive={emissiveColor} 
          emissiveIntensity={theme === 'light' ? 1 : 2} 
          color={sunColor} 
        />
      </mesh>
      <pointLight intensity={theme === 'light' ? 50 : 150} distance={100} color={sunColor} decay={2} />
      
      {/* Subtle Corona / Atmosphere */}
      <mesh scale={1.15}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial 
          color={emissiveColor} 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Planet({ data, scrollVelocity }: { data: typeof PLANET_DATA[0], scrollVelocity: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    // Angular velocity physics: closer planets move faster
    const scrollBoost = Math.abs(scrollVelocity) * 1.5;
    angleRef.current += delta * (data.baseSpeed * 0.5 + scrollBoost);

    const x = Math.cos(angleRef.current) * data.a;
    const z = Math.sin(angleRef.current) * data.b;
    
    groupRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y += data.spin;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} rotation={[data.tilt, 0, 0]}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial 
          color={data.color} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Orbital Path Visualizer */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.a - 0.02, data.a + 0.02, 128]} />
        <meshBasicMaterial color="white" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function StarField({ scrollVelocity, theme }: { scrollVelocity: number, theme: AppTheme }) {
  const ref = useRef<THREE.Group>(null!);
  const starOpacity = theme === 'light' ? 0.1 : 1;

  useFrame(() => {
    ref.current.rotation.y += 0.0002 + Math.abs(scrollVelocity) * 0.002;
  });
  return (
    <group ref={ref}>
      <Stars 
        radius={100} 
        depth={50} 
        count={theme === 'amoled' ? 4000 : 3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
    </group>
  );
}

export default function Scene3D({ isBlurred, theme }: { isBlurred?: boolean, theme: AppTheme }) {
  const [mounted, setMounted] = useState(false);
  const [scroll, setScroll] = useState({ velocity: 0 });
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentY = window.scrollY;
      const vel = (currentY - lastScrollY.current) * 0.02;
      setScroll({ velocity: vel });
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Friction effect for scroll velocity
  useEffect(() => {
    const timer = setInterval(() => {
      setScroll(s => ({ velocity: s.velocity * 0.92 }));
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const getBgColor = () => {
    switch(theme) {
      case 'light': return '#f8fafc';
      case 'purple': return '#0f0714';
      case 'amoled': return '#000000';
      default: return '#020205';
    }
  };

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#020205]" />;

  return (
    <div className={cn(
      "fixed inset-0 -z-10 transition-all duration-1000",
      isBlurred ? 'opacity-40 blur-sm' : 'opacity-100'
    )} style={{ backgroundColor: getBgColor() }}>
      {/* Vignette Overlay for depth */}
      <div className={cn(
        "absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000",
        theme === 'light' ? 'opacity-20' : 'opacity-100'
      )} style={{ background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${theme === 'amoled' ? 0.8 : 0.6}) 100%)` }} />
      
      <Canvas 
        gl={{ antialias: true, stencil: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        className="cursor-move"
      >
        <PerspectiveCamera makeDefault fov={50} position={[0, 15, 30]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={10} 
          maxDistance={60}
          maxPolarAngle={Math.PI / 1.8}
        />
        
        <ambientLight intensity={theme === 'light' ? 0.5 : 0.1} />
        
        <Suspense fallback={null}>
          <Sun theme={theme} />
          
          {PLANET_DATA.map((p) => (
            <Planet key={p.name} data={p} scrollVelocity={scroll.velocity} />
          ))}

          <StarField scrollVelocity={scroll.velocity} theme={theme} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
