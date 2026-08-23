import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const FooterSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-[#0a0a0a] text-white py-16 px-4 border-t border-[#2a2a2a]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Column 1: Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <h2 className="font-mono text-2xl font-bold drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] text-white">
              CENA
            </h2>
            <p className="font-mono text-gray-400 text-sm leading-relaxed max-w-xs">
              Three frequencies. One signal. Code, sound, and visuals converging.
            </p>
          </motion.div>

          {/* Column 2: Navigate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-mono text-gray-500 text-sm font-semibold tracking-wider">
              // NAVIGATE
            </h3>
            <ul className="flex flex-col gap-3 items-start">
              {[
                { label: 'Code Frequency', id: 'projects' },
                { label: 'Sound Frequency', id: 'music' },
                { label: 'Visual Frequency', id: 'visual-art' },
                { label: 'About', id: 'about' }
              ].map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className="font-mono text-sm text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-mono text-gray-500 text-sm font-semibold tracking-wider">
              // RESONATE WITH ME
            </h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <Youtube size={18} />
              </a>
            </div>
            <p className="font-mono text-xs text-gray-600 mt-2">
              Hint: Use Ctrl+K for command menu or Shift+D for dev mode.
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8 border-t border-[#2a2a2a] flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="font-mono text-xs text-gray-400">
            © 2026 CENA — All frequencies reserved.
          </p>
          <p className="font-mono text-xs text-gray-600">
            Built with React, Three.js, and creative energy ⚡
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
