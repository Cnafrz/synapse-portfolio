import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Dodecahedron, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' '));
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let iteration = 0;
          
          const interval = setInterval(() => {
            setDisplayText((prev) => {
              return text
                .split('')
                .map((char, index) => {
                  if (index < iteration) {
                    return text[index];
                  }
                  if (char === ' ') return ' ';
                  return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            });
            
            if (iteration >= text.length) {
              clearInterval(interval);
            }
            
            iteration += 1/3; 
          }, 20);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [text]);

  return <div ref={containerRef}>{displayText}</div>;
};

const Sculpture = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Torus args={[1, 0.3, 16, 100]}>
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.6} />
      </Torus>
      <Dodecahedron args={[0.7]} position={[0.5, 0.5, 0]}>
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.6} />
      </Dodecahedron>
      <Icosahedron args={[0.5]} position={[-0.5, -0.3, 0.5]}>
        <meshBasicMaterial color="#ea580c" wireframe transparent opacity={0.6} />
      </Icosahedron>
      
      <pointLight position={[2, 2, 2]} color="#a855f7" intensity={1} />
      <pointLight position={[-2, -2, -2]} color="#06b6d4" intensity={1} />
      <pointLight position={[0, 0, 3]} color="#ea580c" intensity={1} />
    </group>
  );
};

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const spectrums = [
    { label: 'Code', percentage: 90, color: '#a855f7', glow: 'shadow-[0_0_10px_#a855f7]' },
    { label: 'Music', percentage: 85, color: '#06b6d4', glow: 'shadow-[0_0_10px_#06b6d4]' },
    { label: 'Visuals', percentage: 80, color: '#ea580c', glow: 'shadow-[0_0_10px_#ea580c]' },
  ];

  return (
    <section id="about" className="min-h-screen py-24 px-4 relative flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="font-mono text-[#a855f7] text-sm">
            // ABOUT.frequency
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="font-mono text-3xl md:text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
          >
            Where Logic Meets Resonance
          </motion.h2>
          
          <motion.div variants={itemVariants} className="text-gray-300 text-lg leading-relaxed font-sans">
            <ScrambleText text="I exist at the intersection where logic meets resonance—where code compiles into sound, and sound renders into light. Every project is a frequency; every frequency tells a story." />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-8 space-y-6">
            <div className="font-mono text-gray-400 text-sm mb-4">
              // SPECTRUM.overlap
            </div>
            
            {spectrums.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-gray-200">{item.label}</span>
                  <span className="text-gray-400">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden relative">
                  <motion.div
                    className={`absolute top-0 left-0 h-full rounded-full ${item.glow}`}
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="h-[400px] lg:h-[500px] rounded-2xl border border-[#2a2a2a] bg-black/30 overflow-hidden relative"
        >
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[#a855f7] font-mono">Loading...</div>}>
            <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
              <Sculpture />
            </Canvas>
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
