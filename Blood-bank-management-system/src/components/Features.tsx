"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import {
  Scan,
  Database,
  Brain,
  Bell,
  Shield,
  Globe,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Scan,
    title: "Real-Time Blood Tracking",
    desc: "Track every unit from donation to transfusion with barcode scanning, temperature monitoring, and chain-of-custody verification.",
    color: "from-crimson-600/20 to-crimson-800/5",
    borderColor: "border-crimson-600/15",
    iconColor: "text-crimson-400",
  },
  {
    icon: Database,
    title: "Universal Donor Database",
    desc: "Centralized donor records with eligibility tracking, donation history, health records, and automated re-engagement campaigns.",
    color: "from-blue-600/20 to-blue-800/5",
    borderColor: "border-blue-600/15",
    iconColor: "text-blue-400",
  },
  {
    icon: Brain,
    title: "AI-Powered Matching",
    desc: "Machine learning algorithms match donors to patients, predict inventory needs, and optimize blood distribution across facilities.",
    color: "from-purple-600/20 to-purple-800/5",
    borderColor: "border-purple-600/15",
    iconColor: "text-purple-400",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Automated alerts for low inventory, expiring units, donor eligibility, and emergency broadcast to matching donors within minutes.",
    color: "from-amber-600/20 to-amber-800/5",
    borderColor: "border-amber-600/15",
    iconColor: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Compliance & Safety",
    desc: "FDA-compliant workflows, automated quality checks, and complete audit trails ensuring the highest safety standards.",
    color: "from-emerald-600/20 to-emerald-800/5",
    borderColor: "border-emerald-600/15",
    iconColor: "text-emerald-400",
  },
  {
    icon: Globe,
    title: "Multi-Facility Network",
    desc: "Connect multiple blood banks, hospitals, and mobile donation units in a unified network with real-time synchronization.",
    color: "from-cyan-600/20 to-cyan-800/5",
    borderColor: "border-cyan-600/15",
    iconColor: "text-cyan-400",
  },
  {
    icon: Zap,
    title: "Emergency Response",
    desc: "Instant emergency broadcast system that reaches matching donors within minutes, with hospital coordination and transport tracking.",
    color: "from-red-600/20 to-red-800/5",
    borderColor: "border-red-600/15",
    iconColor: "text-red-400",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Comprehensive dashboards with predictive analytics, seasonal trends, donor behavior insights, and inventory optimization.",
    color: "from-indigo-600/20 to-indigo-800/5",
    borderColor: "border-indigo-600/15",
    iconColor: "text-indigo-400",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP 3D tilt stagger
  useEffect(() => {
    if (!inView || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".feature-card");
    gsap.fromTo(cards, {
      rotateX: 15,
      rotateY: -10,
      y: 80,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 1000,
    }, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
      clearProps: "all"
    });
  }, [inView]);

  return (
    <section id="features" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-crimson-900/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">Platform Features</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-[var(--text-primary)]">Everything You Need to </span>
            <span className="gradient-text-red">Save Lives</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            A comprehensive suite of tools designed for blood banks, hospitals,
            and donation centers to manage the entire blood supply chain.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: "1000px" }}>
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{
                y: -12,
                rotateY: 5,
                rotateX: -3,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="feature-card group relative glass-card rounded-2xl p-6 cursor-pointer overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.borderColor} flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </motion.div>
                <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                  Learn more
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
