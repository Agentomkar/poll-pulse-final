"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  Droplets,
  ArrowRight,
  Activity,
  Users,
  Building2,
  Shield,
  Zap,
  Waves,
  Radio,
  Sparkles,
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import BloodWaveVisual from "./BloodWaveVisual";

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function BloodDropParticles() {
  const drops = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: parseFloat((seededUnit(i + 1) * 100).toFixed(4)),
        delay: parseFloat((seededUnit(i + 101) * 10).toFixed(4)),
        duration: parseFloat((8 + seededUnit(i + 201) * 15).toFixed(4)),
        size: parseFloat((3 + seededUnit(i + 301) * 14).toFixed(4)),
        opacity: parseFloat((0.04 + seededUnit(i + 401) * 0.12).toFixed(4)),
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.left.toFixed(4)}%`,
            width: `${drop.size.toFixed(4)}px`,
            height: `${(drop.size * 1.4).toFixed(4)}px`,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            opacity: drop.opacity.toFixed(4),
            background: "radial-gradient(ellipse at 30% 30%, #ff6274, #8B0000 68%)",
          }}
          animate={{ y: ["-5vh", "105vh"], rotate: [0, 220] }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGradientBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[820px] h-[820px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,0,0,0.18) 0%, transparent 70%)",
          top: "-22%",
          left: "-12%",
        }}
        animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[620px] h-[620px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(220,20,60,0.12) 0%, transparent 70%)",
          bottom: "-14%",
          right: "-10%",
        }}
        animate={{ x: [0, -80, 60, 0], y: [0, 60, -40, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function TypewriterEffect({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.set(el, { opacity: 0 });

    const timer = setTimeout(() => {
      gsap.to(el, {
        opacity: 1,
        duration: 0.01,
        onComplete: () => {
          el.textContent = "";
          text.split("").forEach((char, i) => {
            gsap.to(el, {
              delay: i * 0.035,
              duration: 0,
              onComplete: () => {
                el.textContent += char;
              },
            });
          });
        },
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span ref={ref} />;
}

const stats = [
  { icon: Activity, value: "12,847", label: "Units Available", suffix: "+" },
  { icon: Users, value: "45,000", label: "Registered Donors", suffix: "+" },
  { icon: Building2, value: "120", label: "Partner Hospitals", suffix: "+" },
  { icon: Shield, value: "99.8", label: "Safety Rate", suffix: "%" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const opacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.62], [1, 0.94]);

  useEffect(() => {
    if (!titleRef.current) return;
    const lines = titleRef.current.querySelectorAll(".hero-line");
    
    // Wait for preloader to finish
    const timer = setTimeout(() => {
      gsap.fromTo(lines, {
        y: 80,
        opacity: 0,
        rotateX: -20,
        transformPerspective: 500,
      }, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
      });
    }, 2800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
      <BloodWaveVisual />
      <AnimatedGradientBg />
      <BloodDropParticles />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--bg-primary)]" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 flex min-h-screen w-full items-end px-6 pb-20 pt-32 lg:px-10 lg:pb-12"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(280px,0.48fr)]">
          <div className="hero-glass-panel rounded-[2rem] border border-white/10 bg-black/32 p-6 text-left shadow-2xl shadow-black/45 backdrop-blur-2xl md:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-xl"
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-crimson-500"
                animate={{ scale: [1, 1.35, 1], opacity: [1, 0.65, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-semibold text-white/74">
                Real-time Blood Bank Intelligence Platform
              </span>
            </motion.div>

            <h1
              ref={titleRef}
              className="mb-7 max-w-5xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]"
            >
              <span className="hero-line block">Powering Every Drop.</span>
              <span className="hero-line block gradient-text">
                <TypewriterEffect text="Protecting Every Life." delay={0} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.4, ease: "easeOut" }}
              className="mb-10 max-w-3xl text-lg leading-relaxed text-white/72 md:text-xl"
            >
              A next-generation blood bank intelligence platform built for real-time
              inventory, emergency response, donor coordination, and life-saving
              hospital decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.6, ease: "easeOut" }}
              className="mb-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
            >
              <MagneticButton
                href="#donate"
                strength={0.15}
                className="btn-primary group flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-semibold text-white sm:px-10 sm:py-5"
              >
                <Droplets className="h-5 w-5" />
                Start Donating
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                href="#emergency"
                strength={0.15}
                className="btn-outline group flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-semibold text-white sm:px-10 sm:py-5"
              >
                <Zap className="h-5 w-5" />
                Emergency Request
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.8 }}
              className="mb-10 flex items-center gap-3"
            >
              <div className="flex -space-x-3">
                {["SC", "MR", "AP", "JT", "KL"].map((initials, i) => (
                  <motion.div
                    key={initials}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4.0 + i * 0.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-crimson-700 to-blood-dark text-[10px] font-bold text-white"
                  >
                    {initials}
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-white/55">
                <span className="font-semibold text-white">4,200+</span> donors this month
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 4.2 }}
              className="grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 4.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.3 } }}
                  className="glass-card group relative overflow-hidden rounded-2xl p-5 text-center"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <stat.icon className="mx-auto mb-3 h-6 w-6 text-crimson-400 transition-transform group-hover:scale-110" />
                  <div className="mb-1 font-display text-2xl font-bold text-white lg:text-3xl">
                    {stat.value}
                    <span className="text-crimson-400">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-white/50 sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 4.4, ease: [0.76, 0, 0.24, 1] }}
            className="hidden rounded-[2rem] border border-white/10 bg-black/24 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:block"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                <Radio className="h-4 w-4 text-crimson-400" /> Live Signal
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-crimson-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              </div>
            </div>
            <div className="mb-6 rounded-2xl border border-crimson-500/20 bg-crimson-950/25 p-5">
              <Waves className="mb-4 h-7 w-7 text-crimson-300" />
              <div className="mb-2 font-display text-2xl font-bold text-white">Blood flow optimized</div>
              <p className="text-sm leading-relaxed text-white/55">
                Predictive inventory routing balances urgent hospital requests with
                donor availability in real time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <Sparkles className="mb-3 h-5 w-5 text-amber-300" />
                <div className="text-2xl font-bold text-white">15m</div>
                <div className="text-xs text-white/45">Avg response</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <Droplets className="mb-3 h-5 w-5 text-crimson-300" />
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-xs text-white/45">Blood groups</div>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8 z-10 hidden flex-col items-end gap-2 lg:flex"
      >
        <span className="text-right text-xs font-bold uppercase tracking-[0.24em] text-white/45">
          Scroll down to<br />discover more
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/15 pt-2"
        >
          <motion.div
            className="h-2 w-1 rounded-full bg-crimson-500"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
}
