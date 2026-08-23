import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRealm } from '@/contexts/RealmContext';

const particleVertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  uniform vec3 uRealmColor;
  uniform float uRealmInfluence;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.1, dist);
    
    vec3 finalColor = mix(vColor, uRealmColor, uRealmInfluence);
    
    gl_FragColor = vec4(finalColor, alpha * 0.8);
  }
`;

const lineVertexShader = `
  attribute vec3 color;
  attribute float opacity;
  varying vec3 vColor;
  varying float vOpacity;
  void main() {
    vColor = color;
    vOpacity = opacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  uniform vec3 uRealmColor;
  uniform float uRealmInfluence;
  void main() {
    vec3 finalColor = mix(vColor, uRealmColor, uRealmInfluence);
    gl_FragColor = vec4(finalColor, vOpacity * 0.3);
  }
`;

const Particles = ({ count, prefersReducedMotion }: { count: number, prefersReducedMotion: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const { realm, getRealmColor } = useRealm();
  const { viewport, size } = useThree();
  
  const particleMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null);
  
  const targetRealmColor = useMemo(() => new THREE.Color(getRealmColor(realm)), [realm, getRealmColor]);

  const mouse = useRef({ x: 0, y: 0, active: false });
  const scrollRef = useRef({ y: 0, v: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.active = true;
    };
    const onMouseLeave = () => { mouse.current.active = false; };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    
    let lastY = window.scrollY;
    let lastTime = performance.now();
    
    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dt = Math.max(1, t - lastTime);
      const v = (y - lastY) / dt;
      
      scrollRef.current.v = v;
      scrollRef.current.y = y;
      lastY = y;
      lastTime = t;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const particleData = useMemo(() => {
    return Array.from({ length: count }, () => {
      const rColor = Math.random();
      let color = new THREE.Color('#a855f7');
      if (rColor < 0.33) color = new THREE.Color('#a855f7'); // purple
      else if (rColor < 0.66) color = new THREE.Color('#06b6d4'); // blue
      else color = new THREE.Color('#ea580c'); // orange

      return {
        nx: (Math.random() - 0.5), 
        ny: (Math.random() - 0.5),
        nz: (Math.random() - 0.5) * 5,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: (Math.random() * 0.2 + 0.1),
        speedY: (Math.random() * 0.2 + 0.1),
        size: Math.random() * 3 + 1,
        color,
        vx: 0,
        vy: 0,
        currentX: (Math.random() - 0.5) * 10,
        currentY: (Math.random() - 0.5) * 10,
      };
    });
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);
  const sizes = useMemo(() => new Float32Array(count), [count]);

  const maxLines = count * 3; 
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineOpacities = useMemo(() => new Float32Array(maxLines * 2), [maxLines]);

  useFrame((state) => {
    scrollRef.current.v *= 0.95;
    const driftMultiplier = prefersReducedMotion ? 0.2 : (1 + Math.abs(scrollRef.current.v) * 2);

    if (particleMaterialRef.current) {
      particleMaterialRef.current.uniforms.uRealmColor.value.lerp(targetRealmColor, 0.05);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.uRealmColor.value.lerp(targetRealmColor, 0.05);
    }

    const time = state.clock.elapsedTime;
    const repelDistBase = 150;
    const repelDist = repelDistBase * (viewport.width / size.width);
    const connectDistBase = 100;
    const connectDist = connectDistBase * (viewport.width / size.width);
    
    const mouseX = mouse.current.x * (viewport.width / 2);
    const mouseY = mouse.current.y * (viewport.height / 2);

    for (let i = 0; i < count; i++) {
      const p = particleData[i];
      
      const organicX = prefersReducedMotion ? 0 : Math.sin(time * p.speedX + p.phaseX) * 0.5;
      const organicY = prefersReducedMotion ? 0 : Math.cos(time * p.speedY + p.phaseY) * 0.5;
      
      let targetX = p.nx * viewport.width + organicX;
      let targetY = p.ny * viewport.height + organicY;
      
      if (mouse.current.active && !prefersReducedMotion) {
        const dx = targetX - mouseX;
        const dy = targetY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < repelDist) {
          const force = (repelDist - dist) / repelDist;
          targetX += (dx / dist) * force * 2;
          targetY += (dy / dist) * force * 2;
        }
      }
      
      p.vx = (targetX - p.currentX) * 0.05;
      p.vy = (targetY - p.currentY) * 0.05;
      
      p.currentX += p.vx * driftMultiplier;
      p.currentY += p.vy * driftMultiplier;
      
      positions[i * 3] = p.currentX;
      positions[i * 3 + 1] = p.currentY;
      positions[i * 3 + 2] = p.nz;
      
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
      
      sizes[i] = p.size;
    }
    
    let lineCount = 0;
    if (!prefersReducedMotion) {
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          if (lineCount >= maxLines) break;
          
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectDist) {
            const opacity = 1.0 - (dist / connectDist);
            
            linePositions[lineCount * 6] = positions[i * 3];
            linePositions[lineCount * 6 + 1] = positions[i * 3 + 1];
            linePositions[lineCount * 6 + 2] = positions[i * 3 + 2];
            linePositions[lineCount * 6 + 3] = positions[j * 3];
            linePositions[lineCount * 6 + 4] = positions[j * 3 + 1];
            linePositions[lineCount * 6 + 5] = positions[j * 3 + 2];
            
            lineColors[lineCount * 6] = colors[i * 3];
            lineColors[lineCount * 6 + 1] = colors[i * 3 + 1];
            lineColors[lineCount * 6 + 2] = colors[i * 3 + 2];
            lineColors[lineCount * 6 + 3] = colors[j * 3];
            lineColors[lineCount * 6 + 4] = colors[j * 3 + 1];
            lineColors[lineCount * 6 + 5] = colors[j * 3 + 2];
            
            lineOpacities[lineCount * 2] = opacity;
            lineOpacities[lineCount * 2 + 1] = opacity;
            
            lineCount++;
          }
        }
      }
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }
    
    if (linesRef.current) {
      linesRef.current.geometry.setDrawRange(0, lineCount * 2);
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.color.needsUpdate = true;
      linesRef.current.geometry.attributes.opacity.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMaterialRef}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uRealmColor: { value: new THREE.Color(getRealmColor(realm)) },
            uRealmInfluence: { value: 0.4 }
          }}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={maxLines * 2} array={linePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={maxLines * 2} array={lineColors} itemSize={3} />
          <bufferAttribute attach="attributes-opacity" count={maxLines * 2} array={lineOpacities} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={lineMaterialRef}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uRealmColor: { value: new THREE.Color(getRealmColor(realm)) },
            uRealmInfluence: { value: 0.4 }
          }}
        />
      </lineSegments>
    </group>
  );
};

export default function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onChange);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  const count = isMobile ? 100 : 300;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Particles count={count} prefersReducedMotion={prefersReducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
}
