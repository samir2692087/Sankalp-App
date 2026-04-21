
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

// --- SHADER DEFINITION: CINEMATIC ENERGY ---

const EnergyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#7c3aed'),
    uIntensity: 0,
    uMode: 0, // 0: calm, 1: focus, 2: risk
    uScrollVelocity: 0,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uScrollVelocity;

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
    
    // Organic deformation with scroll reaction
    float noise = snoise(vec3(position * 0.4 + uTime * 0.15));
    float interactionEffect = uIntensity * snoise(vec3(position * 1.5 + uTime * 1.5)) * 0.4;
    float scrollEffect = abs(uScrollVelocity) * snoise(vec3(position * 0.8)) * 0.1;
    
    vec3 newPos = position + normal * (noise * 0.15 + interactionEffect + scrollEffect);
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
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uMode;

  void main() {
    // Plasma color logic
    float pulse = sin(uTime * 0.4) * 0.1 + 0.9;
    
    // RIM / FRESNEL LIGHTING (For Sharp Edges)
    vec3 viewDirection = normalize(-vPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDirection), 3.0);
    fresnel = smoothstep(0.1, 0.9, fresnel); // Sharpen the glow
    
    // Internal "hot" spots
    float glow = pow(0.5 + 0.5 * sin(vPosition.x * 1.5 + uTime), 3.0);
    
    vec3 finalColor = uColor;
    if(uMode > 1.5) { // Risk Mode
        finalColor = mix(uColor, vec3(1.0, 0.05, 0.05), glow * (1.2 + uIntensity));
    } else if(uMode > 0.5) { // Focus Mode
        finalColor = mix(uColor, vec3(0.3, 0.7, 1.0), glow);
    } else {
        finalColor = mix(uColor, vec3(0.7, 0.3, 1.0), glow);
    }

    // Alpha blending with sharp edge falloff
    float alpha = mix(0.6, 0.95, fresnel) + uIntensity * 0.4;
    
    // Additive glow highlights
    vec3 emissive = finalColor * (1.2 + uIntensity * 2.5 + fresnel * 1.5);
    
    gl_FragColor = vec4(emissive, alpha);
  }
  `
);

extend({ EnergyMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    energyMaterial: ThreeElement<typeof EnergyMaterial>;
  }
}

// --- COMPONENTS ---

function EnergyCore({ intensity = 0, mode = 'calm', scrollVelocity = 0, scrollY = 0 }: { intensity?: number, mode?: string, scrollVelocity?: number, scrollY?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<any>(null!);
  
  const coreColor = useMemo(() => {
    if (mode === 'risk') return new THREE.Color('#ff2222');
    if (mode === 'focus') return new THREE.Color('#4338ca');
    return new THREE.Color('#6d28d9');
  }, [mode]);

  const modeVal = useMemo(() => {
    if (mode === 'risk') return 2;
    if (mode === 'focus') return 1;
    return 0;
  }, [mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!matRef.current) return;
    
    matRef.current.uTime = t;
    matRef.current.uIntensity = THREE.MathUtils.lerp(matRef.current.uIntensity, intensity, 0.08);
    matRef.current.uColor.lerp(coreColor, 0.04);
    matRef.current.uMode = modeVal;
    matRef.current.uScrollVelocity = scrollVelocity;

    // PHYSICS DRIVEN MOTION
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -scrollY * 0.005, 0.05);
    meshRef.current.rotation.y = t * 0.1 + scrollVelocity * 0.5;
    meshRef.current.rotation.z = t * 0.05 + scrollVelocity * 0.2;
    
    const targetScale = 1 + Math.abs(scrollVelocity) * 0.2;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05));
  });

  return (
    <group position={[0, 0, -5]}>
      {/* LAYERED LIGHTING FOR DEPTH (FAKE BLOOM) */}
      <pointLight color={coreColor} intensity={30 + intensity * 60} distance={12} position={[2, 2, 2]} />
      <pointLight color={mode === 'risk' ? '#ff0000' : '#4f46e5'} intensity={15} distance={20} position={[-5, -2, -2]} />
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 96, 96]} />
        <energyMaterial 
          ref={matRef} 
          transparent 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* VOLUMETRIC ATMOSPHERE LAYER */}
      <mesh scale={1.15}>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshStandardMaterial
          color={coreColor}
          transparent
          opacity={0.08 + intensity * 0.15}
          emissive={coreColor}
          emissiveIntensity={1.5 + intensity * 8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function NeuralParticles({ intensity = 0, scrollY = 0, scrollVelocity = 0 }: { intensity?: number, scrollY?: number, scrollVelocity?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 2500;
  
  const { positions, initialPositions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25 - 12;
      
      initial[i * 3] = pos[i * 3];
      initial[i * 3 + 1] = pos[i * 3 + 1];
      initial[i * 3 + 2] = pos[i * 3 + 2];

      color.setHSL(Math.random() * 0.2 + 0.6, 0.8, 0.6);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return { positions: pos, initialPositions: initial, colors: cols };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;
    
    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // PARALLAX + VELOCITY REACTION
      const speedFactor = 1 + Math.abs(scrollVelocity) * 2;
      array[ix] = initialPositions[ix] + Math.sin(t * 0.15 + initialPositions[iz]) * 0.4;
      array[iy] = initialPositions[iy] + Math.cos(t * 0.12 + initialPositions[ix]) * 0.4 - (scrollY * 0.012); // Fast Parallax
      
      // Interaction reaction
      if (intensity > 0.05) {
        array[ix] += (Math.random() - 0.5) * intensity * 0.6;
        array[iy] += (Math.random() - 0.5) * intensity * 0.6;
      }
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.008;
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        vertexColors
        size={0.07}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4 + intensity * 0.4}
      />
    </points>
  );
}

function CameraRig({ scrollY = 0 }: { scrollY?: number }) {
  useFrame((state) => {
    const { mouse, camera } = state;
    // SMOOTH CAMERA LERP
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, (mouse.y * 2.5) - (scrollY * 0.001), 0.04);
    camera.lookAt(0, -scrollY * 0.002, -5);
  });
  return <PerspectiveCamera makeDefault fov={40} position={[0, 0, 12]} />;
}

export default function Scene3D({ isBlurred }: { isBlurred?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { intensity, mode } = useInteraction();
  
  // SCROLL PHYSICS STATE
  const [scroll, setScroll] = useState({ y: 0, velocity: 0 });
  const scrollRef = useRef({ lastY: 0, currentY: 0 });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - scrollRef.current.lastY;
      scrollRef.current.currentY = currentY;
      scrollRef.current.lastY = currentY;
      setScroll({ y: currentY, velocity: diff * 0.1 });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Velocity Damping
  useEffect(() => {
    const damp = setInterval(() => {
      setScroll(prev => ({ ...prev, velocity: prev.velocity * 0.9 }));
    }, 16);
    return () => clearInterval(damp);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#05070a]" />;

  return (
    <div className={cn(
      "fixed inset-0 -z-10 pointer-events-none bg-[#05070a] transition-all duration-1000",
      isBlurred ? 'blur-3xl scale-110' : ''
    )}>
      {/* VIGNETTE & GRAIN OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <Canvas 
        gl={{ antialias: true, stencil: false, alpha: false, powerPreference: 'high-performance' }} 
        dpr={[1, 2]}
      >
        <CameraRig scrollY={scroll.y} />
        <ambientLight intensity={0.15} />
        
        <Suspense fallback={null}>
          <EnergyCore 
            intensity={intensity} 
            mode={mode} 
            scrollY={scroll.y} 
            scrollVelocity={scroll.velocity} 
          />
          <NeuralParticles 
            intensity={intensity} 
            scrollY={scroll.y} 
            scrollVelocity={scroll.velocity} 
          />
          
          {/* SLOWEST PARALLAX LAYER: BACKGROUND STARS */}
          <group position={[0, scroll.y * 0.001, 0]}>
            <Stars radius={120} depth={60} count={4000} factor={6} saturation={0.5} fade speed={1.5} />
          </group>
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

