"use client";

import React from "react";

interface MenuBarProps {
  active?: "dashboard" | "notifications" | "settings" | "help" | "security";
  onSelect?: (key: "dashboard" | "notifications" | "settings" | "help" | "security") => void;
  className?: string;
}

const icons = {
  dashboard: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 9.5L12 4l9 5.5v7.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  ),
  notifications: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  settings: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  help: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="1"/>
    </svg>
  ),
  security: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, active, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = hovered || !!active;

  const handleMobileTooltip = (e: React.MouseEvent) => {
    if (window.innerWidth < 640) {
      e.preventDefault();
      setShowTooltip(true);
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1200);
    }
    onClick?.();
  };

  React.useEffect(() => () => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      className={`flex items-center rounded-xl border transition-colors focus:outline-none relative overflow-visible
        ${
          active
            ? "border-crimson-500/40 bg-crimson-500/10 text-white font-semibold"
            : "border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]"
        }
        w-11 sm:w-auto
        px-0 sm:px-4
        justify-center sm:justify-start
      `}
      style={{
        minWidth: 44,
        minHeight: 44,
        paddingTop: 8,
        paddingBottom: 8,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleMobileTooltip}
    >
      {/* Tooltip for mobile view */}
      <span
        className={`sm:hidden absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs rounded px-2 py-1 shadow transition-opacity duration-200 pointer-events-none z-20 border border-[var(--border-color)]
          ${showTooltip ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
      <span className="flex items-center justify-center w-11 h-11">
        {icon}
      </span>
      <span
        className={`text-sm transition-all duration-300 whitespace-nowrap pointer-events-none ml-2
          hidden sm:inline
          ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
        style={{
          transition: "opacity 0.3s, width 0.35s cubic-bezier(0.4,0,0.2,1), margin 0.3s",
          width: isExpanded ? "auto" : 0,
          overflow: "hidden",
        }}
      >
        {label}
      </span>
    </button>
  );
};

export const MenuBar = ({ active = "dashboard", onSelect, className }: MenuBarProps) => {
  return (
    <nav
      className={`flex items-center gap-2 bg-[var(--bg-secondary)] p-2 rounded-2xl border border-[var(--border-color)] w-fit mx-auto transition-all duration-300 ${className ?? ""}`}
    >
      <IconButton
        icon={icons.dashboard}
        label="Dashboard"
        active={active === "dashboard"}
        onClick={() => onSelect?.("dashboard")}
      />
      <div className="w-px h-6 bg-[var(--border-color)] mx-2" />
      <IconButton
        icon={icons.notifications}
        label="Notifications"
        active={active === "notifications"}
        onClick={() => onSelect?.("notifications")}
      />
      <IconButton
        icon={icons.settings}
        label="Settings"
        active={active === "settings"}
        onClick={() => onSelect?.("settings")}
      />
      <IconButton
        icon={icons.help}
        label="Help"
        active={active === "help"}
        onClick={() => onSelect?.("help")}
      />
      <IconButton
        icon={icons.security}
        label="Security"
        active={active === "security"}
        onClick={() => onSelect?.("security")}
      />
    </nav>
  );
};