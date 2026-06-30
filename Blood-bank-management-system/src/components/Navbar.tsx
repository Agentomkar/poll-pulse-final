"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Droplets,
  Phone,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  ChevronDown,
  Activity,
  Users,
  Building2,
  BarChart3,
  Zap,
  Shield,
  BookOpen,
  ArrowRight,
  Compass,
  Heart,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useAudio, soundEngine } from "./AudioController";
import MagneticButton from "./MagneticButton";
import MagnetizeButton from "./MagnetizeButton";
import { ExpandableTabs } from "./ExpandableTabs";

const navLinks = [
  { href: "#inventory", label: "Inventory", icon: Compass },
  { href: "#donate", label: "Donate", icon: Heart },
  { href: "#emergency", label: "Emergency", icon: AlertCircle },
  { href: "#dashboard", label: "Dashboard", icon: TrendingUp },
  { href: "#features", label: "Features", icon: BookOpen },
  { href: "#contact", label: "Contact", icon: Users },
];

const expandableTabs = navLinks.map((link) => ({
  title: link.label,
  icon: link.icon,
  href: link.href,
}));

const megaMenuItems = [
  {
    icon: Activity,
    title: "Blood Tracking",
    desc: "Real-time unit tracking from donor to patient",
    href: "#inventory",
    color: "text-crimson-400",
    bg: "bg-crimson-600/10",
  },
  {
    icon: Users,
    title: "Donor Management",
    desc: "Register and manage donor database",
    href: "#donate",
    color: "text-blue-400",
    bg: "bg-blue-600/10",
  },
  {
    icon: Zap,
    title: "Emergency Requests",
    desc: "Coordinate urgent blood requests",
    href: "#emergency",
    color: "text-amber-400",
    bg: "bg-amber-600/10",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Comprehensive inventory analytics",
    href: "#dashboard",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10",
  },
  {
    icon: Shield,
    title: "Compliance",
    desc: "FDA & HIPAA compliance tools",
    href: "#features",
    color: "text-purple-400",
    bg: "bg-purple-600/10",
  },
  {
    icon: Building2,
    title: "Hospital Network",
    desc: "120+ partner hospitals connected",
    href: "#dashboard",
    color: "text-cyan-400",
    bg: "bg-cyan-600/10",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { enabled: audioEnabled, toggle: toggleAudio } = useAudio();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 2.8, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group" data-magnetic>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center group-hover:shadow-lg group-hover:shadow-crimson-600/30 transition-all duration-300 group-hover:scale-110">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-crimson-500 rounded-full animate-pulse-glow" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Life<span className="text-crimson-500">Stream</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-4">
              <ExpandableTabs
                tabs={expandableTabs}
                className="bg-black/20 border-white/10"
                activeColor="text-crimson-400"
              />
            </div>

            {/* Right Controls */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Audio Toggle */}
              <MagneticButton
                strength={0.2}
                onClick={toggleAudio}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors relative group"
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-crimson-400 transition-colors" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[var(--text-muted)] group-hover:text-crimson-400 transition-colors" />
                )}
              </MagneticButton>

              {/* Theme Toggle */}
              <MagneticButton
                strength={0.2}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors group"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-amber-400 transition-colors" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-crimson-400 transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </MagneticButton>

              {/* Emergency */}
              <a
                href="tel:+1800BLOOD"
                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-crimson-400 transition-colors rounded-lg"
                data-magnetic
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Emergency</span>
              </a>

              {/* CTA */}
              <MagnetizeButton
                href="#donate"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              />
            </div>

            {/* Mobile Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--overlay-bg)] backdrop-blur-xl pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-2xl font-display font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-3 border-b border-[var(--border-color)]"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile Audio Toggle */}
              <button
                onClick={toggleAudio}
                className="flex items-center gap-3 text-lg text-[var(--text-secondary)] py-3 border-b border-[var(--border-color)]"
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                Sound Effects: {audioEnabled ? "On" : "Off"}
              </button>

              <MagnetizeButton
                href="#donate"
                onClick={() => setMobileOpen(false)}
                className="mt-6 px-6 py-4 rounded-xl text-center text-lg font-semibold"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
