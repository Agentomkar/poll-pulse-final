"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8, // Reduced from 1.2 for snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Using optimized easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let lastTime = Date.now();
    let frameCount = 0;

    function raf(time: number) {
      // Use delta time for consistent animation across different frame rates
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      
      // Skip frames if rendering too fast (cap at 120fps for smoothness)
      frameCount++;
      if (frameCount % 1 === 0) {
        lenis.raf(time);
      }
      
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
