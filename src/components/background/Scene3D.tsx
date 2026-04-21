
"use client";

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, extend, ThreeElement } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Stars, 
  Environment,
  shaderMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { useInteraction } from '@/context/InteractionContext';
import { cn } from '@/lib/utils';

// --- ASTRO-PHYSICS DATA ---
const PLANET_DATA = [
  { name: 'Inner Strength', color: '#ff22aa', a: 4.2, b: 3.8, baseSpeed: 0.8, size: 0.12, tilt: 0.2, spin: 0.02 },
  { name: 'Discipline', color: '#7c3aed', a: 6.5, b: 5.8, baseSpeed: 0.5, size: 0.18, tilt: 0.4, spin: 0.01 },
  { name: 'Clarity', color: '#22d3ee', a: 9.0, b: 8.2, baseSpeed: 0.35, size: 0.15, tilt: 0.1, spin: 0.015 },
  { name: 'Fortitude', color: '#f59e0b', a: 12.5, b: 11.0, baseSpeed: 0.2, size: 0.25, tilt: 0.3, spin: 0.005 },
  { name: 'Persistence', color: '#ef4444', a: 16.0, b: 14.5, baseSpeed: 0.12, size: 0.3, tilt: 0.5, spin: 0.003 },
];

// --- SHADER DEFINITION: LIVING ENERGY CORE ---
const LivingCoreMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color('#a855f7'),
    uColorB: new THREE.Color('#ec4899'),
    uIntensity: 0,
    uMode: 0,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uIntensity;

  // Simplex 3D Noise 
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Organic pulsing distortion
    float noise = snoise(vec3(position * 0.5 + uTime * 0.2));
    float pulse = snoise(vec3(position * 2.0 + uTime)) * uIntensity * 0.2;
    vec3 newPos = position + normal * (noise * 0.15 + pulse);
    vPosition = newPos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;
  uniform float uMode;

  void main() {
    vec3 viewDirection = normalize(-vPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDirection), 3.0);
    
    // Gradient mix based on position and time
    float mixVal = sin(vPosition.y + uTime * 0.5) * 0.5 + 0.5;
    vec3 baseColor = mix(uColorA, uColorB, mixVal);
    
    // Additive glow
    vec3 finalColor = baseColor + (fresnel * baseColor * 2.0);
    if(uMode > 2.5) { // Risk Mode
        finalColor = mix(finalColor, vec3(1.0, 0.1, 0.1), 0.5);
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

extend({ LivingCoreMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    livingCoreMaterial: ThreeElement<typeof LivingCoreMaterial>;
  }
}

// --- COMPONENTS ---

function EnergyCore({ intensity, mode }: { intensity: number, mode: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<any>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.uTime = t;
      matRef.current.uIntensity = intensity;
      matRef.current.uMode = mode === 'risk' ? 3 : mode === 'focus' ? 2 : 1;
    }
    meshRef.current.rotation.y = t * 0.1;
  });

  return (
    <group>
      <pointLight intensity={50 + intensity * 50} distance={20} color="#a855f7" />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <livingCoreMaterial ref={matRef} />
      </mesh>
      {/* Volumetric Atmosphere */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#ec4899" 
          transparent 
          opacity={0.1} 
          emissive="#ec4899" 
          emissiveIntensity={2} 
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
    const t = state.clock.getElapsedTime();
    
    // Elliptical Orbit Physics
    // Speed increases as it gets closer (Kepler-ish approximation)
    const currentDist = Math.sqrt(
      Math.pow(data.a * Math.cos(angleRef.current), 2) + 
      Math.pow(data.b * Math.sin(angleRef.current), 2)
    );
    
    const speedFactor = (data.baseSpeed * 5.0) / currentDist;
    const scrollBoost = Math.abs(scrollVelocity) * 2.0;
    
    angleRef.current += delta * (speedFactor + scrollBoost);

    const x = Math.cos(angleRef.current) * data.a;
    const z = Math.sin(angleRef.current) * data.b;
    const y = Math.sin(angleRef.current * 0.5) * (data.a * 0.1); // 3D path variation

    groupRef.current.position.set(x, y, z);
    meshRef.current.rotation.y += data.spin;
    meshRef.current.rotation.x += data.spin * 0.5;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} rotation={[data.tilt, 0, 0]}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.color} 
          emissiveIntensity={1.5} 
          roughness={0.2}
          metalness={0.8}
        />
        <pointLight intensity={2} distance={3} color={data.color} />
      </mesh>
      {/* Orbital Trail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.a - 0.01, data.a + 0.01, 128]} />
        <meshBasicMaterial color="white" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function StarField({ scrollVelocity }: { scrollVelocity: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => {
    ref.current.rotation.y += 0.0005 + Math.abs(scrollVelocity) * 0.01;
  });
  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    const { mouse, camera } = state;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 3, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 3, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return <PerspectiveCamera makeDefault fov={55} position={[0, 0, 15]} />;
}

export default function Scene3D({ isBlurred }: { isBlurred?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { intensity, mode } = useInteraction();
  const [scroll, setScroll] = useState({ velocity: 0 });
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentY = window.scrollY;
      const vel = (currentY - lastScrollY.current) * 0.05;
      setScroll({ velocity: vel });
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Friction effect
  useEffect(() => {
    const timer = setInterval(() => {
      setScroll(s => ({ velocity: s.velocity * 0.9 }));
    }, 16);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#05070a]" />;

  return (
    <div className={cn(
      "fixed inset-0 -z-10 pointer-events-none bg-[#05070a] transition-all duration-1000",
      isBlurred ? 'opacity-30' : 'opacity-100'
    )}>
      {/* Subtle Vignette Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      
      <Canvas 
        gl={{ antialias: true, stencil: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <CameraRig />
        <ambientLight intensity={0.2} />
        
        <Suspense fallback={null}>
          <EnergyCore intensity={intensity} mode={mode} />
          
          {PLANET_DATA.map((p) => (
            <Planet key={p.name} data={p} scrollVelocity={scroll.velocity} />
          ))}

          <StarField scrollVelocity={scroll.velocity} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
