"use client";

import { useEffect, useRef, useState } from "react";

interface Trail {
  x: number;
  y: number;
  id: number;
  opacity: number;
  scale: number;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const trailId = useRef(0);
  const mousePos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    // Hide on mobile/touch
    if ("ontouchstart" in window) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      return;
    }

    const updateCursor = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(updateCursor);
    };

    rafId.current = requestAnimationFrame(updateCursor);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Add trail particles (throttled)
      const now = Date.now();
      if (now - lastTrailTime.current > 40) {
        lastTrailTime.current = now;
        trailId.current += 1;
        setTrails((prev) => [
          ...prev.slice(-12),
          {
            x: e.clientX,
            y: e.clientY,
            id: trailId.current,
            opacity: 1,
            scale: 1,
          },
        ]);
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, input, textarea, select, [role='button'], [data-magnetic]"
      );
      setIsPointer(!!interactive);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  // Fade out trails
  useEffect(() => {
    if (trails.length === 0) return;
    const timer = setInterval(() => {
      setTrails((prev) =>
        prev
          .map((t) => ({ ...t, opacity: t.opacity - 0.08, scale: t.scale - 0.05 }))
          .filter((t) => t.opacity > 0)
      );
    }, 30);
    return () => clearInterval(timer);
  }, [trails.length]);

  return (
    <div ref={cursorRef} className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Trail particles */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none"
          style={{
            left: trail.x,
            top: trail.y,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: `rgba(220, 20, 60, ${trail.opacity * 0.5})`,
            transform: `translate(-50%, -50%) scale(${trail.scale})`,
            boxShadow: `0 0 ${6 * trail.opacity}px rgba(220, 20, 60, ${trail.opacity * 0.3})`,
          }}
        />
      ))}

      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 will-change-transform"
        style={{
          width: isClicking ? 4 : 8,
          height: isClicking ? 4 : 8,
          borderRadius: "50%",
          background: isPointer
            ? "rgba(220, 20, 60, 1)"
            : "rgba(255, 255, 255, 0.9)",
          transform: "translate(-100px, -100px)",
          transition: "width 0.2s, height 0.2s, background 0.2s",
          marginLeft: isClicking ? -2 : -4,
          marginTop: isClicking ? -2 : -4,
          opacity: isHidden ? 0 : 1,
          mixBlendMode: isPointer ? "normal" : "difference",
        }}
      />

      {/* Outer ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 will-change-transform"
        style={{
          width: isPointer ? 50 : isClicking ? 28 : 36,
          height: isPointer ? 50 : isClicking ? 28 : 36,
          borderRadius: "50%",
          border: `1.5px solid ${
            isPointer
              ? "rgba(220, 20, 60, 0.6)"
              : "rgba(255, 255, 255, 0.15)"
          }`,
          transform: "translate(-100px, -100px)",
          transition: "width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, opacity 0.3s",
          marginLeft: isPointer ? -25 : isClicking ? -14 : -18,
          marginTop: isPointer ? -25 : isClicking ? -14 : -18,
          opacity: isHidden ? 0 : 1,
          background: isPointer
            ? "rgba(220, 20, 60, 0.06)"
            : "transparent",
        }}
      />
    </div>
  );
}
