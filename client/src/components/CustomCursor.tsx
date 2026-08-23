import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type RealmType = 'code' | 'music' | 'visuals';

export interface CustomCursorProps {
  realm?: RealmType;
}

export default function CustomCursor({ realm = 'code' }: CustomCursorProps) {
  const [isMobile, setIsMobile] = useState(true); // default true to prevent hydration mismatch, or run check immediately
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const trail = useRef(Array.from({ length: 6 }, () => ({ x: 0, y: 0 })));

  const [hoverState, setHoverState] = useState<'default' | 'button' | 'image'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    let rafId: number;
    let initialized = false;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      if (!initialized) {
        initialized = true;
        setIsVisible(true);
        ring.current = { x: e.clientX, y: e.clientY };
        trail.current = trail.current.map(() => ({ x: e.clientX, y: e.clientY }));
      }
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isButtonOrLink = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') || 
        target.closest('[role="link"]');
        
      const isImage = 
        target.closest('img') || 
        target.tagName?.toLowerCase() === 'img';

      if (isButtonOrLink) {
        setHoverState('button');
      } else if (isImage) {
        setHoverState('image');
      } else {
        setHoverState('default');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => {
      if (initialized) setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      // Lerp ring (0.15 factor as requested)
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      // Lerp trail
      let target = { ...mouse.current };
      for (let i = 0; i < trail.current.length; i++) {
        // slightly faster lerp for trail elements to keep them close
        trail.current[i].x += (target.x - trail.current[i].x) * 0.35;
        trail.current[i].y += (target.y - trail.current[i].y) * 0.35;
        
        if (trailRefs.current[i]) {
          trailRefs.current[i]!.style.transform = `translate3d(${trail.current[i].x}px, ${trail.current[i].y}px, 0)`;
        }
        target = { ...trail.current[i] };
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const realmColors = {
    code: '#a855f7',
    music: '#06b6d4',
    visuals: '#ea580c'
  };

  const currentColor = realmColors[realm] || realmColors.code;

  return (
    <>
      {/* Trail Dots */}
      {trail.current.map((_, i) => {
        // 6 dots decreasing size (6px -> 2px) and opacity (0.5 -> 0.1)
        const size = 6 - (i * 0.8);
        const opacity = 0.5 - (i * 0.08);
        
        return (
          <div
            key={i}
            ref={(el) => (trailRefs.current[i] = el)}
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{ willChange: 'transform' }}
          >
            <div
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
              style={{
                width: size,
                height: size,
                backgroundColor: currentColor,
                opacity: (hoverState === 'image' || !isVisible) ? 0 : opacity,
              }}
            />
          </div>
        );
      })}

      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      >
        <div
          className={cn(
            "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ease-out",
            hoverState === 'button' ? 'w-12 h-12 border-[3px] rounded-full' : 
            hoverState === 'image' ? 'w-8 h-8 rounded-none border-0' : 
            'w-8 h-8 border rounded-full',
            isClicking ? 'scale-[0.8]' : 'scale-100',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{ borderColor: hoverState !== 'image' ? currentColor : 'transparent' }}
        >
          {/* Image Crosshair Lines */}
          <div className={cn(
            "absolute w-full h-full transition-opacity duration-300", 
            hoverState === 'image' ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-2 transition-colors duration-300" style={{ backgroundColor: currentColor }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-2 transition-colors duration-300" style={{ backgroundColor: currentColor }} />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-2 transition-colors duration-300" style={{ backgroundColor: currentColor }} />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-2 transition-colors duration-300" style={{ backgroundColor: currentColor }} />
          </div>
        </div>
      </div>

      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ willChange: 'transform' }}
      >
        <div
          className={cn(
            "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
            hoverState === 'button' ? 'w-1 h-1' : 'w-2 h-2',
            (hoverState === 'image' || !isVisible) ? 'opacity-0' : 'opacity-100'
          )}
          style={{ backgroundColor: currentColor }}
        />
      </div>
    </>
  );
}
