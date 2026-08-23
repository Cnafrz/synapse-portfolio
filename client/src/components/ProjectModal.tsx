import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Project {
  id: string;
  title: string;
  category: 'dev' | 'music' | 'visual';
  description: string;
  tags: string[];
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'dev': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
    case 'music': return 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10';
    case 'visual': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    default: return 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10';
  }
};

const getCategoryGradient = (category: string) => {
  switch (category) {
    case 'dev': return 'from-purple-900/40 to-black';
    case 'music': return 'from-cyan-900/40 to-black';
    case 'visual': return 'from-orange-900/40 to-black';
    default: return 'from-zinc-900/40 to-black';
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

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
            >
              <X size={24} />
            </button>

            <div className={cn("w-full aspect-video flex items-center justify-center bg-gradient-to-br", getCategoryGradient(project.category))}>
               <span className="text-8xl opacity-50">{getIcon(project.category)}</span>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={cn("px-3 py-1 text-xs font-mono rounded-full border uppercase tracking-wider", getCategoryColor(project.category))}>
                  {project.category}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold font-['Space_Mono'] text-white mb-6">
                {project.title}
              </h2>
              
              <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                {project.description}
              </p>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Tech Stack / Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 text-sm rounded-md bg-white/5 border border-white/10 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <button className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all",
                  project.category === 'dev' ? 'bg-purple-600 hover:bg-purple-500 text-white' :
                  project.category === 'music' ? 'bg-cyan-600 hover:bg-cyan-500 text-white' :
                  'bg-orange-600 hover:bg-orange-500 text-white'
                )}>
                  <ExternalLink size={20} />
                  <span>Live Demo</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-white/10 hover:bg-white/20 text-white transition-all">
                  <Github size={20} />
                  <span>Source Code</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
