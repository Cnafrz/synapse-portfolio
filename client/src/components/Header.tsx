import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Music', id: 'music' },
  { label: 'Visuals', id: 'visual-art' }
];

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    let iterations = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setDisplayText(prev => 
        prev.split('').map((letter, index) => {
          if (index < iterations) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      if (iterations >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      
      iterations += 1 / 3;
    }, 30);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {displayText}
    </span>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
      
      // Update active section
      const sections = ['hero', ...NAV_LINKS.map(link => link.id)];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out border-b",
        isHidden ? "-translate-y-full" : "translate-y-0",
        isScrolled 
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-[#2a2a2a]/50 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => scrollToSection('hero')}
          className="font-mono text-2xl font-bold tracking-tighter text-white hover:text-purple-400 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        >
          CENA
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                "relative font-mono text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors py-1",
                activeSection === link.id && "text-white"
              )}
            >
              <ScrambleText text={link.label} />
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeSectionIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => scrollToSection('footer')}
            className="hidden md:inline-flex items-center justify-center font-mono text-sm uppercase px-5 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all"
          >
            Resonate With Me
          </button>
          
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0a0a0a] border-b border-[#2a2a2a] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left font-mono text-sm uppercase tracking-wider text-gray-300 py-2 border-b border-[#2a2a2a]/30"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.1 }}
                onClick={() => scrollToSection('footer')}
                className="font-mono text-sm uppercase py-3 mt-4 text-center rounded border border-purple-500 text-purple-400 bg-purple-500/5"
              >
                Resonate With Me
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
