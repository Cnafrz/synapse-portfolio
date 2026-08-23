import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

export function useKeyboardShortcuts() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  
  const konamiIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }

      // Shift+D
      if (e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDevMode((prev) => {
          const next = !prev;
          console.log(`Developer Mode: ${next ? 'ON' : 'OFF'}`);
          return next;
        });
      }

      // Shift+M
      if (e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setAudioMuted((prev) => {
          const next = !prev;
          console.log(`Audio: ${next ? 'Muted' : 'Unmuted'}`);
          return next;
        });
      }

      // Shift+V
      if (e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        console.log('Cycling visual themes...');
      }

      // Konami Code
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#a855f7', '#06b6d4', '#ea580c']
          });
          alert('🎉 You found the secret!');
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    commandPaletteOpen,
    setCommandPaletteOpen,
    devMode,
    audioMuted
  };
}
