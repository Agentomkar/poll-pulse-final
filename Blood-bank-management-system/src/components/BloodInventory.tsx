"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { Droplets, TrendingUp, AlertTriangle, Check } from "lucide-react";

interface BloodGroupData {
  group: string;
  available: number;
  capacity: number;
  status: "critical" | "low" | "adequate" | "optimal";
  trend: "up" | "down" | "stable";
}

const bloodData: BloodGroupData[] = [
  { group: "A+", available: 142, capacity: 200, status: "adequate", trend: "up" },
  { group: "A-", available: 23, capacity: 80, status: "critical", trend: "down" },
  { group: "B+", available: 189, capacity: 250, status: "optimal", trend: "up" },
  { group: "B-", available: 34, capacity: 80, status: "low", trend: "stable" },
  { group: "O+", available: 256, capacity: 300, status: "optimal", trend: "up" },
  { group: "O-", available: 18, capacity: 100, status: "critical", trend: "down" },
  { group: "AB+", available: 67, capacity: 100, status: "adequate", trend: "up" },
  { group: "AB-", available: 12, capacity: 50, status: "low", trend: "stable" },
];

function statusConfig(status: BloodGroupData["status"]) {
  switch (status) {
    case "optimal":
      return { color: "text-emerald-400", bg: "bg-emerald-400", label: "Optimal", icon: Check };
    case "adequate":
      return { color: "text-blue-400", bg: "bg-blue-400", label: "Adequate", icon: Check };
    case "low":
      return { color: "text-amber-400", bg: "bg-amber-400", label: "Low Stock", icon: AlertTriangle };
    case "critical":
      return { color: "text-red-400", bg: "bg-red-400", label: "Critical", icon: AlertTriangle };
  }
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function BloodInventory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const cardsRef = useRef<HTMLDivElement>(null);

  // GSAP stagger animation for cards
  useEffect(() => {
    if (!inView || !cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll(".blood-card");
    gsap.fromTo(cards, {
      y: 60,
      opacity: 0,
      scale: 0.9,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "back.out(1.5)",
      clearProps: "all"
    });
  }, [inView]);

  return (
    <section id="inventory" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-crimson-900/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Droplets className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">Live Inventory</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-[var(--text-primary)]">Blood Group </span>
            <span className="gradient-text-red">Availability</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            Real-time blood inventory across all partner banks. Updated every 30
            seconds with smart alerting for critical shortages.
          </p>
        </motion.div>

        {/* Inventory Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bloodData.map((blood) => {
            const config = statusConfig(blood.status);
            const percentage = Math.round((blood.available / blood.capacity) * 100);
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={blood.group}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="blood-card glass-card rounded-2xl p-6 relative overflow-hidden group"
              >
                {/* Hover gradient shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-crimson-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated border glow on hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-crimson-500/20 transition-colors duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="font-display text-4xl font-extrabold text-[var(--text-primary)] mb-1 group-hover:scale-105 origin-left transition-transform">
                        {blood.group}
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    </div>
                    <motion.div
                      className={`w-3 h-3 rounded-full ${config.bg}`}
                      animate={blood.status === "critical" ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-[var(--text-primary)]">
                        <AnimatedCounter value={blood.available} />
                      </span>
                      <span className="text-[var(--text-muted)] text-sm">
                        / {blood.capacity} units
                      </span>
                    </div>
                  </div>

                  <div className="relative h-2 bg-[var(--card-bg)] rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${percentage}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                      className={`absolute left-0 top-0 h-full rounded-full ${config.bg}`}
                      style={{ opacity: 0.8 }}
                    />
                    {/* Shimmer on progress bar */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">{percentage}% capacity</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-3 h-3 ${blood.trend === "up" ? "text-emerald-400" : blood.trend === "down" ? "text-red-400 rotate-180" : "text-[var(--text-muted)]"}`} />
                      <span className="text-xs text-[var(--text-muted)]">
                        {blood.trend === "up" ? "+12 today" : blood.trend === "down" ? "-8 today" : "Stable"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 glass-strong rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-[var(--text-secondary)]">
              Last updated: <span className="text-[var(--text-primary)] font-medium">30 seconds ago</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-[var(--text-muted)]">
              Total Units: <span className="text-[var(--text-primary)] font-semibold">741</span>
            </span>
            <span className="text-[var(--text-muted)]">
              Critical Alerts: <span className="text-red-400 font-semibold">2</span>
            </span>
            <span className="text-[var(--text-muted)]">
              Today&apos;s Donations: <span className="text-emerald-400 font-semibold">+47</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
