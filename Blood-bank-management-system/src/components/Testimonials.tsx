"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Building2 } from "lucide-react";
import MagneticButton from "./MagneticButton";

interface Testimonial {
  name: string;
  role: string;
  hospital: string;
  quote: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Chen",
    role: "Head of Hematology",
    hospital: "City General Hospital",
    quote:
      "LifeStream has completely transformed how we manage blood inventory. The real-time tracking and AI matching have reduced our emergency response time by 73%. It's not just a tool — it's a life-saving platform.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Director of Transfusion Medicine",
    hospital: "Memorial Medical Center",
    quote:
      "Before LifeStream, we lost critical hours coordinating blood transfers between facilities. Now, the entire network operates as one unified system. We've seen a 45% improvement in fulfilling urgent requests.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Nurse Aisha Patel",
    role: "Blood Bank Coordinator",
    hospital: "St. Mary's Hospital",
    quote:
      "The donor management system is incredible. Automated eligibility tracking, smart reminders, and the emergency broadcast feature have helped us maintain optimal inventory levels consistently.",
    rating: 5,
    avatar: "AP",
  },
  {
    name: "Dr. James Thompson",
    role: "Emergency Medicine Chief",
    hospital: "University Medical Center",
    quote:
      "In emergency medicine, every second counts. LifeStream's instant blood matching and cross-facility coordination has literally saved hundreds of lives at our hospital. The analytics dashboard is phenomenal.",
    rating: 5,
    avatar: "JT",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt on mouse move
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-crimson-900/8 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Quote className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-white/60">
              Trusted by Healthcare Leaders
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">What </span>
            <span className="gradient-text-red">Doctors Say</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Trusted by over 120 hospitals and blood banks worldwide to manage
            their critical blood supply operations.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              ref={cardRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="glass-strong rounded-3xl p-8 md:p-12 text-center relative"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 left-8 text-crimson-800/30">
                <Quote className="w-12 h-12" />
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`star-${i}`}
                    className={`w-5 h-5 ${
                      i < testimonials[current].rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 font-light">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <div className="font-display font-bold text-white">
                    {testimonials[current].name}
                  </div>
                  <div className="text-sm text-white/40">
                    {testimonials[current].role}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/30 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    {testimonials[current].hospital}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <MagneticButton
              strength={0.3}
              onClick={prev}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/[0.05] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </MagneticButton>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={`pager-${i}`}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-crimson-500"
                      : "w-1.5 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
            <MagneticButton
              strength={0.3}
              onClick={next}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/[0.05] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </MagneticButton>
          </div>
        </div>

        {/* Hospital Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-xs text-white/20 uppercase tracking-widest mb-8">
            Trusted by leading healthcare institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              "City General",
              "St. Mary's",
              "Memorial Medical",
              "University Health",
              "Metro Hospital",
            ].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 text-white/15 hover:text-white/30 transition-colors"
              >
                <Building2 className="w-5 h-5" />
                <span className="font-display text-sm font-semibold">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
