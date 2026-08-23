import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  User, 
  Briefcase, 
  Music, 
  MonitorPlay, 
  Moon, 
  VolumeX, 
  Maximize,
  Code,
  PartyPopper,
  Radio
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onClose]);

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-2xl overflow-hidden"
          >
            <Command className="w-full bg-transparent text-white" label="Command Menu">
              <Command.Input 
                autoFocus
                placeholder="Search commands, projects, or type a frequency..."
                className="w-full bg-transparent border-b border-[#2a2a2a] px-4 py-4 text-white placeholder-gray-500 outline-none font-sans"
              />
              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#2a2a2a]">
                <Command.Empty className="py-6 text-center text-gray-500">
                  No frequencies found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-2 py-1 text-xs text-gray-500 font-mono uppercase tracking-wider">
                  <Command.Item 
                    onSelect={() => handleSelect(() => scrollTo('about'))}
                    className="flex items-center gap-3 px-4 py-2 mt-1 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <User className="w-4 h-4" /> About
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => scrollTo('projects'))}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" /> Projects
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => scrollTo('music'))}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <Music className="w-4 h-4" /> Music
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => scrollTo('visuals'))}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <MonitorPlay className="w-4 h-4" /> Visuals
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Actions" className="px-2 py-1 mt-2 text-xs text-gray-500 font-mono uppercase tracking-wider">
                  <Command.Item 
                    onSelect={() => handleSelect(() => console.log('Theme Toggled'))}
                    className="flex items-center gap-3 px-4 py-2 mt-1 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <Moon className="w-4 h-4" /> Toggle Theme
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => console.log('Audio Muted'))}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <VolumeX className="w-4 h-4" /> Mute Audio
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                      } else {
                        document.exitFullscreen().catch(() => {});
                      }
                    })}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <Maximize className="w-4 h-4" /> Full Screen
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Easter Eggs" className="px-2 py-1 mt-2 text-xs text-gray-500 font-mono uppercase tracking-wider">
                  <Command.Item 
                    onSelect={() => handleSelect(() => console.log('Matrix Mode Activated'))}
                    className="flex items-center gap-3 px-4 py-2 mt-1 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <Code className="w-4 h-4 text-green-500" /> Matrix Mode
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }))}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <PartyPopper className="w-4 h-4 text-[#ea580c]" /> Party Mode
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => handleSelect(() => alert('Welcome to Cena\'s secret frequency! 🎵'))}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer text-sm text-gray-200 transition-colors"
                  >
                    <Radio className="w-4 h-4 text-[#a855f7]" /> About Frequency
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
