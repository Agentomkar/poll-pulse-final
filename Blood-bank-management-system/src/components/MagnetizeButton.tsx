"use client";

import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeContext";
import { Heart } from "lucide-react";

interface MagnetizeButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  particleCount?: number;
  attractRadius?: number;
  href?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

function MagnetizeButton({
  className,
  particleCount = 8, // Reduced from 12
  attractRadius = 50,
  href,
  ...props
}: MagnetizeButtonProps) {
  const { theme } = useTheme();
  const [isAttracting, setIsAttracting] = React.useState(false);
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const particlesControl = useAnimation();
  const buttonRef = React.useRef<HTMLElement | null>(null);
  const currentPos = React.useRef({ x: 0, y: 0 });
  const targetPos = React.useRef({ x: 0, y: 0 });
  const rafId = React.useRef<number | null>(null);
  const cachedRect = React.useRef({ centerX: 0, centerY: 0, width: 0, height: 0 });
  const lastRectUpdateTime = React.useRef(0);

  React.useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  // Memoized rect update with debouncing
  const updateCachedRect = React.useCallback(() => {
    const now = Date.now();
    // Only update rect every 100ms to avoid frequent layout recalculations
    if (now - lastRectUpdateTime.current < 100) return;

    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    cachedRect.current = {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
    lastRectUpdateTime.current = now;
  }, []);

  const updatePosition = React.useCallback(() => {
    const current = currentPos.current;
    const target = targetPos.current;
    const nextX = current.x + (target.x - current.x) * 0.18;
    const nextY = current.y + (target.y - current.y) * 0.18;

    currentPos.current = { x: nextX, y: nextY };

    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    }

    if (Math.abs(nextX - target.x) > 0.4 || Math.abs(nextY - target.y) > 0.4) {
      rafId.current = requestAnimationFrame(updatePosition);
    } else {
      rafId.current = null;
    }
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!buttonRef.current) return;
      
      // Use cached rect to avoid layout thrashing
      const rect = cachedRect.current;
      if (rect.centerX === 0) {
        updateCachedRect();
        return; // Skip this frame if we just updated
      }

      const strength = Math.min(0.28, attractRadius / 180);

      targetPos.current = {
        x: (e.clientX - rect.centerX) * strength,
        y: (e.clientY - rect.centerY) * strength,
      };

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updatePosition);
      }
    },
    [attractRadius, updatePosition, updateCachedRect]
  );

  const handleMouseLeave = React.useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    targetPos.current = { x: 0, y: 0 };
    currentPos.current = { x: 0, y: 0 };

    if (buttonRef.current) {
      buttonRef.current.style.transition = "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
      buttonRef.current.style.transform = "translate3d(0, 0, 0)";
    }

    setIsAttracting(false);
  }, []);

  const handleInteractionStart = React.useCallback(async () => {
    setIsAttracting(true);
    updateCachedRect();
    if (buttonRef.current) {
      buttonRef.current.style.transition = "transform 0.15s ease-out";
    }
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    });
  }, [particlesControl, updateCachedRect]);

  const handleInteractionEnd = React.useCallback(async () => {
    setIsAttracting(false);
    if (buttonRef.current) {
      buttonRef.current.style.transition = "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
      buttonRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    await particlesControl.start((custom) => ({
      x: particles[custom as number]?.x ?? 0,
      y: particles[custom as number]?.y ?? 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }));
  }, [particlesControl, particles]);

  const themeClasses =
    theme === "dark"
      ? "bg-crimson-500 text-white shadow-[0_18px_60px_rgba(220,20,60,0.22)] hover:bg-crimson-400"
      : "bg-white text-crimson-700 shadow-[0_18px_60px_rgba(0,0,0,0.08)] hover:bg-slate-100";

  const sharedClasses = cn(
    "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all duration-300",
    themeClasses,
    className
  );

  const content = (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          custom={index}
          initial={{ x: particle.x, y: particle.y }}
          animate={particlesControl}
          className={cn(
            "absolute rounded-full bg-white/80 dark:bg-white/70",
            "w-1.5 h-1.5",
            isAttracting ? "opacity-100" : "opacity-40"
          )}
          style={{ willChange: "transform" }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Heart
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            isAttracting && "scale-110"
          )}
        />
        Donate Now
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={sharedClasses}
        onMouseEnter={handleInteractionStart}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        style={{ willChange: "transform" }}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button"
      className={sharedClasses}
      onMouseEnter={handleInteractionStart}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      style={{ willChange: "transform" }}
      {...props}
    >
      {content}
    </button>
  );
}

export default MagnetizeButton;
