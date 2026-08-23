import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import MusicSection from '@/components/MusicSection';
import VisualArtSection from '@/components/VisualArtSection';
import FooterSection from '@/components/FooterSection';
import CommandPalette from '@/components/CommandPalette';
import useScrollTrigger from '@/hooks/useScrollTrigger';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRealm } from '@/contexts/RealmContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { realm } = useRealm();
  const { commandPaletteOpen, setCommandPaletteOpen } = useKeyboardShortcuts();
  
  // Initialize GSAP ScrollTrigger + Lenis smooth scrolling
  useScrollTrigger();

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <>
          <CustomCursor realm={realm} />
          <ParticleBackground />
          <Header />
          
          <main>
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <MusicSection />
            <VisualArtSection />
          </main>
          
          <FooterSection />
          
          <CommandPalette 
            open={commandPaletteOpen} 
            onClose={() => setCommandPaletteOpen(false)} 
          />

          {/* SVG Noise Filter for CSS noise overlay */}
          <svg className="absolute w-0 h-0" aria-hidden="true">
            <filter id="noise-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </svg>
        </>
      )}
    </>
  );
}
