"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  scale?: number;
  rotate?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 60,
  duration = 1.2,
  scale = 1,
  rotate = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      scale: scale !== 1 ? scale : undefined,
      rotate: rotate || undefined,
      duration,
      delay,
      ease: "power3.out",
    };

    // Use Intersection Observer for scroll triggering
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(el, fromVars, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotate: 0,
              duration,
              delay,
              ease: "power3.out",
            });
            if (once) observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    // Set initial state
    gsap.set(el, {
      opacity: 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      scale: scale !== 1 ? scale : 1,
      rotate: rotate || 0,
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, direction, distance, duration, scale, rotate, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
