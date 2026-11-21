import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** One Lenis instance for the public site, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const instance = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Scroll to top (or the hash target) on route change, then refresh triggers.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const target = hash ? document.querySelector(hash) : 0;
    if (lenis) lenis.scrollTo(target || 0, { immediate: !hash, offset: -90 });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
