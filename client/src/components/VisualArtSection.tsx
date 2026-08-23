import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle, SlidersHorizontal } from 'lucide-react';

// Types
type ArtPiece = {
  id: string;
  title: string;
  category: 'touchdesigner' | 'ai' | 'generative';
  description: string;
  prompt?: string;
};

// Data
const artPieces: ArtPiece[] = [
  { 
    id: '1', 
    title: 'Synaptic Flow', 
    category: 'touchdesigner', 
    description: 'Real-time audio-reactive particle system' 
  },
  { 
    id: '2', 
    title: 'Digital Consciousness', 
    category: 'ai', 
    description: 'AI portrait series exploring human/machine boundary', 
    prompt: '"A surreal portrait where human features dissolve into circuit patterns, cyberpunk aesthetic, deep purple and cyan lighting"' 
  },
  { 
    id: '3', 
    title: 'Recursive Geometry', 
    category: 'generative', 
    description: 'Recursive algorithms creating infinite geometric patterns' 
  },
  { 
    id: '4', 
    title: 'Neural Landscapes', 
    category: 'ai', 
    description: 'AI landscapes blending natural and digital elements', 
    prompt: '"Vast alien landscape with crystalline structures, bioluminescent flora, volumetric fog, octane render, 8K"' 
  },
  { 
    id: '5', 
    title: 'Frequency Mesh', 
    category: 'touchdesigner', 
    description: 'Interactive mesh deformation driven by frequency analysis' 
  },
  { 
    id: '6', 
    title: 'Fractal Bloom', 
    category: 'generative', 
    description: 'Evolving fractal patterns that bloom and decay' 
  },
];

const categories = ['All', 'TouchDesigner', 'AI Art', 'Generative'];

export default function VisualArtSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPiece, setSelectedPiece] = useState<ArtPiece | null>(null);
  
  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filtered pieces
  const filteredPieces = activeFilter === 'All' 
    ? artPieces 
    : artPieces.filter(p => {
        if (activeFilter === 'TouchDesigner') return p.category === 'touchdesigner';
        if (activeFilter === 'AI Art') return p.category === 'ai';
        if (activeFilter === 'Generative') return p.category === 'generative';
        return true;
      });

  // Generative Art Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = Array.from({ length: 100 }).map((_, i) => ({
      angle: (Math.PI * 2 / 100) * i,
      baseRadius: 30 + Math.random() * 120,
      hueOffset: i * 3.6,
      speed: 0.005 + Math.random() * 0.015
    }));
    
    const render = () => {
      time += 0.02;
      
      // Trail effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      particles.forEach(p => {
        p.angle += p.speed;
        // Radii oscillate with sin(time)
        const radius = p.baseRadius + Math.sin(time * 0.5 + p.hueOffset) * 50;
        
        const x = centerX + Math.cos(p.angle) * radius;
        const y = centerY + Math.sin(p.angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        // Color cycling through HSL
        ctx.fillStyle = `hsl(${(time * 20 + p.hueOffset) % 360}, 80%, 60%)`;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="visual-art" className="min-h-screen py-24 px-4 bg-[#0a0a0a] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="font-mono text-[#ea580c] tracking-widest text-sm mb-4">
            // VISUAL.frequency
          </div>
          <h2 className="font-mono text-3xl md:text-5xl font-bold text-glow-orange">
            Visual Frequency
          </h2>
          <p className="mt-4 text-gray-400 font-sans max-w-2xl text-lg">
            Exploring the intersection of code, algorithms, and human expression by Cena.
          </p>
        </motion.div>

        {/* Living Artwork */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl border border-white/10 overflow-hidden mb-16 bg-[#0a0a0a]"
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
            <span className="text-[#ea580c] text-xs font-mono font-medium tracking-wide">
              LIVE — Generative Art
            </span>
          </div>
          <div className="w-full h-[300px] md:h-[400px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full font-mono text-sm transition-all duration-300 border ${
                activeFilter === cat 
                  ? 'border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]' 
                  : 'border-white/10 bg-transparent text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPieces.map((piece) => (
              <motion.div
                key={piece.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative rounded-xl border border-white/10 bg-[#1a1a1a]/80 overflow-hidden cursor-pointer aspect-square"
                onClick={() => setSelectedPiece(piece)}
              >
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
                  <span className="text-xs font-mono text-gray-300 uppercase">
                    {piece.category}
                  </span>
                </div>

                {/* Gradient Placeholder Area */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.02]">
                  <Circle className="w-24 h-24 text-white/5" strokeWidth={1} />
                </div>

                {/* Hover Reveal Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 border group-hover:border-[#ea580c]/50 rounded-xl">
                  <h3 className="font-mono text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {piece.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-sans translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 line-clamp-2">
                    {piece.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24"
        >
          <div className="mb-8">
            <h3 className="font-mono text-2xl md:text-3xl font-bold text-glow-orange mb-2">
              Prompt → Creation
            </h3>
            <p className="font-mono text-gray-400 text-sm tracking-wide">
              // DRAG TO REVEAL THE TRANSFORMATION
            </p>
          </div>

          <div 
            ref={sliderRef}
            className="relative h-[300px] md:h-[400px] rounded-2xl border border-white/20 overflow-hidden cursor-ew-resize select-none bg-[#111]"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* Before (Left side - Prompt) */}
            <div className="absolute inset-0 p-8 md:p-12 flex items-center bg-[#0d0d0d]">
              <div className="max-w-md">
                <div className="font-mono text-xs text-[#06b6d4] mb-4">// INPUT SEQUENCE</div>
                <p className="font-sans text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                  "A surreal portrait where human features dissolve into circuit patterns, cyberpunk aesthetic, deep purple and cyan lighting"
                </p>
              </div>
            </div>

            {/* After (Right side - Result) */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-cyan-900/30 to-[#0a0a0a] flex items-center justify-center border-l border-white/10"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.4)_0%,transparent_70%)]" />
              <Circle className="w-32 h-32 text-white/10" strokeWidth={0.5} />
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/50"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-[#0a0a0a] border border-white/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm pointer-events-none">
                <SlidersHorizontal className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPiece && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedPiece(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-[#111] rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPiece(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 min-h-[300px] md:min-h-[500px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                <Circle className="w-48 h-48 text-white/5" strokeWidth={0.5} />
                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md">
                  <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                    {selectedPiece.category}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-[#111] border-t border-white/10 overflow-y-auto">
                <h2 className="font-mono text-2xl md:text-3xl font-bold text-white mb-4">
                  {selectedPiece.title}
                </h2>
                <p className="font-sans text-gray-300 text-lg mb-6 leading-relaxed">
                  {selectedPiece.description}
                </p>
                
                {selectedPiece.category === 'ai' && selectedPiece.prompt && (
                  <div className="mt-6">
                    <div className="font-mono text-xs text-[#06b6d4] mb-2 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                      Prompt Sequence
                    </div>
                    <div className="p-4 rounded-lg bg-[#0a0a0a] border border-white/5 font-mono text-sm text-gray-400 leading-relaxed">
                      {selectedPiece.prompt}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
