import React, { useState, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ProjectModal, { Project } from './ProjectModal';

const projects: Project[] = [
  {
    id: '1',
    title: 'Neural Synth Engine',
    category: 'dev',
    description: 'AI-powered synthesizer built with React, WebAudio API, and TensorFlow.js. Generates unique soundscapes from neural network outputs.',
    tags: ['React', 'TypeScript', 'WebAudio', 'TensorFlow.js']
  },
  {
    id: '2',
    title: 'Chromatic Decay',
    category: 'music',
    description: 'Progressive metal EP blending djent-style guitar with electronic atmospheres. Recorded, mixed, and mastered in-house.',
    tags: ['Progressive Metal', 'Production', 'Guitar', 'Mixing']
  },
  {
    id: '3',
    title: 'Reactive Topology',
    category: 'visual',
    description: 'TouchDesigner installation creating real-time generative visuals that respond to audio frequency analysis.',
    tags: ['TouchDesigner', 'GLSL', 'Audio-Reactive', 'Installation']
  },
  {
    id: '4',
    title: 'Void Commerce',
    category: 'dev',
    description: 'Full-stack e-commerce platform with immersive 3D product visualization and AR try-on features.',
    tags: ['Next.js', 'Three.js', 'Stripe', 'PostgreSQL']
  },
  {
    id: '5',
    title: 'Frequency Shift',
    category: 'music',
    description: 'Electronic/ambient album exploring the spaces between digital and analog sound.',
    tags: ['Electronic', 'Ambient', 'Max/MSP', 'Sound Design']
  },
  {
    id: '6',
    title: 'Neural Portraits',
    category: 'visual',
    description: 'AI art series using Stable Diffusion and custom LoRA models to create surreal portraits.',
    tags: ['AI Art', 'Stable Diffusion', 'LoRA', 'Digital Art']
  }
];

const categories = [
  { id: 'all', label: 'All Frequencies', color: '#a855f7' },
  { id: 'dev', label: 'Code', color: '#a855f7' },
  { id: 'music', label: 'Music', color: '#06b6d4' },
  { id: 'visual', label: 'Visuals', color: '#ea580c' },
] as const;

type FilterType = typeof categories[number]['id'];

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dev': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'music': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'visual': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getHoverBorderColor = (category: string) => {
    switch (category) {
      case 'dev': return 'hover:border-purple-500/50';
      case 'music': return 'hover:border-cyan-500/50';
      case 'visual': return 'hover:border-orange-500/50';
      default: return 'hover:border-white/50';
    }
  };

  const getGradient = (category: string) => {
    switch (category) {
      case 'dev': return 'from-purple-900/30 to-black';
      case 'music': return 'from-cyan-900/30 to-black';
      case 'visual': return 'from-orange-900/30 to-black';
      default: return 'from-zinc-900/30 to-black';
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'dev': return '⟨/⟩';
      case 'music': return '♪';
      case 'visual': return '◉';
      default: return '•';
    }
  };

  const getCTA = (category: string) => {
    switch (category) {
      case 'dev': return 'Enter Experience';
      case 'music': return 'Listen Now';
      case 'visual': return 'View Artwork';
      default: return 'View Project';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative h-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]/80 backdrop-blur-sm overflow-hidden cursor-pointer transition-colors duration-300 flex flex-col",
          getHoverBorderColor(project.category)
        )}
      >
        <div className={cn("relative w-full aspect-video flex items-center justify-center bg-gradient-to-br", getGradient(project.category))}>
          <span className="text-6xl opacity-30 font-light">{getIcon(project.category)}</span>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]"
              >
                <span className={cn(
                  "px-6 py-3 rounded-full font-bold text-sm tracking-wider uppercase border",
                  project.category === 'dev' ? 'text-purple-400 border-purple-500/50 bg-purple-500/10' :
                  project.category === 'music' ? 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10' :
                  'text-orange-400 border-orange-500/50 bg-orange-500/10'
                )}>
                  {getCTA(project.category)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-['Space_Mono'] text-xl font-bold text-white mb-3">
            {project.title}
          </h3>
          <p className="text-zinc-400 text-sm mb-6 flex-grow">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map(tag => (
              <span 
                key={tag}
                className={cn(
                  "px-2 py-1 text-xs rounded-md border",
                  getCategoryColor(project.category)
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="min-h-screen py-24 px-4 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-['Courier_Prime'] text-purple-500 mb-4 tracking-widest uppercase text-sm">
            // PROJECTS.manifest
          </p>
          <h2 className="font-['Space_Mono'] text-3xl md:text-5xl font-bold text-white mb-12">
            <span className="drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Signal Output</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as FilterType)}
                className="relative px-6 py-2 rounded-full font-mono text-sm transition-colors overflow-hidden border border-[#2a2a2a]"
                style={{
                  color: filter === cat.id ? '#000' : '#fff',
                }}
              >
                <span className="relative z-10 font-bold">{cat.label}</span>
                {filter === cat.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 z-0"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 15px ${cat.color}` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
      />
    </section>
  );
}
