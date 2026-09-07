import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect user prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Social-Feed Physics Engine (Instagram / Pinterest / Facebook kinetic inertia)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15, // Effortless glide
      touchMultiplier: 2.0,  // Dynamic mobile flick momentum
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // 120 FPS Velocity Guard: Disables expensive hover repaints during flick scrolling
    let scrollTimeout;
    lenis.on('scroll', (e) => {
      if (Math.abs(e.velocity) > 0.8) {
        document.body.classList.add('is-scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          document.body.classList.remove('is-scrolling');
        }, 120);
      }
    });

    let rfId;
    function raf(time) {
      lenis.raf(time);
      rfId = requestAnimationFrame(raf);
    }
    rfId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rfId);
      clearTimeout(scrollTimeout);
      document.body.classList.remove('is-scrolling');
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, []);

  // Instant scroll-to-top on route navigation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return children;
}
