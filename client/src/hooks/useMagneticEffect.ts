import { RefObject, useEffect } from 'react';
import useReducedMotion from './useReducedMotion';

interface MagneticEffectConfig {
  strength?: number;
  radius?: number;
}

export default function useMagneticEffect(
  ref: RefObject<HTMLElement | null>,
  config: MagneticEffectConfig = {}
) {
  const { strength = 0.3, radius = 100 } = config;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const element = ref.current;
    
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - elemCenterX;
      const distanceY = e.clientY - elemCenterY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      
      if (distance < radius) {
        isHovering = true;
        targetX = distanceX * strength;
        targetY = distanceY * strength;
      } else {
        isHovering = false;
        targetX = 0;
        targetY = 0;
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
    };
    
    const animate = () => {
      const ease = isHovering ? 0.1 : 0.05;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      
      element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
      element.style.transform = '';
    };
  }, [ref, strength, radius, prefersReducedMotion]);
}
