import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRealm } from '@/contexts/RealmContext';
import * as THREE from 'three';

// --- 3D Components ---

function HeroSphere({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      // Smoothly rotate towards mouse
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mousePos.y * 0.5, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mousePos.x * 0.5, 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.5, 128, 128]}>
        <MeshDistortMaterial 
          color="#a855f7" 
          distort={0.4} 
          speed={2} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </Sphere>
    </Float>
  );
}

// --- Main Component ---

export default function HeroSection() {
  const { setRealm } = useRealm();
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);

  // Mouse tracking for 3D sphere
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    setMousePos({ x, y });
  };

  // Periodic Glitch Effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const realms = [
    { id: 'code', icon: '⟨/⟩', color: 'border-purple-500', textCol: 'text-purple-400', shadow: 'rgba(168, 85, 247, 0.5)' },
    { id: 'sound', icon: '♪', color: 'border-cyan-500', textCol: 'text-cyan-400', shadow: 'rgba(6, 182, 212, 0.5)' },
    { id: 'visuals', icon: '◉', color: 'border-orange-500', textCol: 'text-orange-400', shadow: 'rgba(234, 88, 12, 0.5)' },
  ];

  return (
    <section 
      id="hero" 
      className="relative min-h-screen overflow-hidden bg-black text-white"
      onPointerMove={handlePointerMove}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={1} />
            <pointLight position={[10, -10, -10]} color="#06b6d4" intensity={1} />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade={true} />
            <HeroSphere mousePos={mousePos} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pointer-events-none">
        
        {/* Scanline Overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 2px,
              #ffffff 2px,
              #ffffff 4px
            )`
          }}
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 max-w-4xl mx-auto z-10 pointer-events-auto"
        >
          {/* Name Reveal */}
          <motion.h1 
            variants={itemVariants}
            className="font-mono font-bold text-7xl md:text-8xl lg:text-9xl text-white tracking-tighter"
            style={{
              textShadow: isGlitching 
                ? '3px 0 #a855f7, -3px 0 #06b6d4' 
                : '0 0 20px rgba(168, 85, 247, 0.5)',
              transform: isGlitching ? 'translate(-2px, 2px)' : 'none'
            }}
          >
            CENA
          </motion.h1>

          {/* Subtitle */}
          <motion.h2 
            variants={itemVariants}
            className="text-xl md:text-2xl font-sans text-gray-400 font-light tracking-wide"
          >
            Creative Technologist
          </motion.h2>

          {/* Tagline */}
          <motion.p 
            variants={itemVariants}
            className="font-mono text-sm md:text-base text-gray-500 max-w-md mx-auto"
          >
            Three frequencies. One signal. Code, sound, and visuals converging.
          </motion.p>

          {/* Realm Portals */}
          <motion.div variants={itemVariants} className="flex gap-8 mt-12">
            {realms.map((realm) => (
              <motion.button
                key={realm.id}
                onClick={() => setRealm(realm.id as any)}
                whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${realm.shadow}` }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-2 ${realm.color} bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:bg-black/50`}
              >
                <span className={`text-3xl font-mono ${realm.textCol}`}>{realm.icon}</span>
                <span className="text-xs uppercase tracking-widest text-gray-300">{realm.id}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Audio Visualizer Hint */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-end gap-1 h-12 opacity-30 z-10 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-purple-500"
            animate={{
              height: [
                10 + Math.abs(Math.sin(i * 0.5)) * 20,
                10 + Math.abs(Math.sin(i * 0.5 + Math.PI)) * 20,
                10 + Math.abs(Math.sin(i * 0.5)) * 20,
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
