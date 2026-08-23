import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default function useScrollTrigger() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return { lenis: lenisRef };
}

interface ScrollAnimationProps {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
}

export function useGSAPScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  animation: ScrollAnimationProps,
  triggerOptions: ScrollTrigger.Vars
) {
  useEffect(() => {
    if (!ref.current) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    
    const tween = gsap.fromTo(
      el,
      animation.from || {},
      {
        ...animation.to,
        scrollTrigger: {
          trigger: el,
          ...triggerOptions,
        },
      }
    );

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
    };
  }, [ref, animation, triggerOptions]);
}
