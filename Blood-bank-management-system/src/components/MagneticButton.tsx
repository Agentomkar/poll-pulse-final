"use client";

import { useRef, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const cachedRect = useRef({ centerX: 0, centerY: 0 });
  const animationFrameId = useRef<number | null>(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const updateCachedRect = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    cachedRect.current = {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  };

  const animate = () => {
    if (!ref.current) return;

    const current = currentPosition.current;
    const target = targetPosition.current;

    // Smooth interpolation
    current.x += (target.x - current.x) * 0.2;
    current.y += (target.y - current.y) * 0.2;

    // Apply transform using will-change for GPU acceleration
    ref.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

    // Continue animation if not close enough to target
    const threshold = 0.5;
    if (
      Math.abs(current.x - target.x) > threshold ||
      Math.abs(current.y - target.y) > threshold
    ) {
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      animationFrameId.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    // Update cached rect on first move in hover state
    if (!cachedRect.current.centerX) {
      updateCachedRect();
    }

    const deltaX = (e.clientX - cachedRect.current.centerX) * strength;
    const deltaY = (e.clientY - cachedRect.current.centerY) * strength;
    
    targetPosition.current = { x: deltaX, y: deltaY };

    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
    if (ref.current) {
      ref.current.style.transition = "transform 0.15s ease-out";
    }
    updateCachedRect();
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    targetPosition.current = { x: 0, y: 0 };
    currentPosition.current = { x: 0, y: 0 };

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    if (ref.current) {
      ref.current.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      ref.current.style.transform = "translate3d(0, 0, 0)";
    }
  };

  const sharedProps = {
    ref: ref as React.RefObject<HTMLElement>,
    className,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    style: {
      willChange: "transform" as const,
      transform: "translate3d(0, 0, 0)",
    },
    "data-magnetic": true,
  };

  if (href) {
    return (
      <a
        {...(sharedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
    >
      {children}
    </button>
  );
}
