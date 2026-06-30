"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import {
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Droplets,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { soundEngine, useAudio } from "./AudioController";

type Urgency = "critical" | "urgent" | "normal";
type Status = "pending" | "approved" | "fulfilled" | "rejected";

interface BloodRequest {
  id: string;
  patient: string;
  hospital: string;
  bloodGroup: string;
  units: number;
  urgency: Urgency;
  status: Status;
  timeAgo: string;
  phone: string;
}

const requests: BloodRequest[] = [
  { id: "REQ-2847", patient: "Emergency Trauma Patient", hospital: "City General Hospital", bloodGroup: "O-", units: 4, urgency: "critical", status: "pending", timeAgo: "12 min ago", phone: "+1 (555) 100-2847" },
  { id: "REQ-2846", patient: "Surgery Preparation", hospital: "St. Mary's Medical Center", bloodGroup: "A+", units: 3, urgency: "urgent", status: "approved", timeAgo: "28 min ago", phone: "+1 (555) 100-2846" },
  { id: "REQ-2845", patient: "Chemotherapy Treatment", hospital: "Memorial Cancer Institute", bloodGroup: "B+", units: 2, urgency: "urgent", status: "approved", timeAgo: "45 min ago", phone: "+1 (555) 100-2845" },
  { id: "REQ-2844", patient: "Maternity Complications", hospital: "Women's Health Center", bloodGroup: "AB+", units: 2, urgency: "normal", status: "fulfilled", timeAgo: "1 hr ago", phone: "+1 (555) 100-2844" },
  { id: "REQ-2843", patient: "Pediatric Anemia", hospital: "Children's National Hospital", bloodGroup: "O+", units: 1, urgency: "normal", status: "fulfilled", timeAgo: "2 hr ago", phone: "+1 (555) 100-2843" },
];

function urgencyConfig(urgency: Urgency) {
  switch (urgency) {
    case "critical": return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "CRITICAL" };
    case "urgent": return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "URGENT" };
    case "normal": return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "STANDARD" };
  }
}

function statusIcon(status: Status) {
  switch (status) {
    case "pending": return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
    case "approved": return <Zap className="w-4 h-4 text-blue-400" />;
    case "fulfilled": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case "rejected": return <XCircle className="w-4 h-4 text-red-400" />;
  }
}

function statusLabel(status: Status) {
  switch (status) {
    case "pending": return "Awaiting Match";
    case "approved": return "Approved — In Transit";
    case "fulfilled": return "Fulfilled";
    case "rejected": return "Rejected";
  }
}

export default function EmergencyRequests() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const listRef = useRef<HTMLDivElement>(null);
  const { enabled: audioEnabled } = useAudio();

  useEffect(() => {
    if (!inView || !listRef.current) return;
    const items = listRef.current.querySelectorAll(".request-card");
    gsap.fromTo(items, {
      x: -60,
      opacity: 0,
      scale: 0.95,
    }, {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "all"
    });
  }, [inView]);

  return (
    <section id="emergency" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-red-900/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">Emergency Coordination</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-[var(--text-primary)]">Emergency Blood </span>
            <span className="gradient-text-red">Requests</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            Real-time blood request tracking from partner hospitals. Every second counts.
          </p>
        </motion.div>

        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 rounded-2xl bg-gradient-to-r from-red-900/30 via-red-800/15 to-red-900/30 border border-red-500/15 p-5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </motion.div>
            <div>
              <div className="text-sm font-semibold text-red-300">2 Critical Requests Pending</div>
              <div className="text-xs text-[var(--text-muted)]">O- blood urgently needed at City General Hospital</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (audioEnabled) soundEngine.notification();
            }}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
          >
            Respond Now
          </button>
        </motion.div>

        {/* Request Cards */}
        <div ref={listRef} className="space-y-4">
          {requests.map((req) => {
            const urgency = urgencyConfig(req.urgency);
            return (
              <motion.div
                key={req.id}
                whileHover={{ scale: 1.005, x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`request-card glass-card rounded-2xl p-6 md:p-8 group ${
                  req.urgency === "critical" ? "glow-red" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson-600/20 to-crimson-800/10 border border-crimson-600/20 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="font-display text-lg font-extrabold text-[var(--text-primary)] leading-none">
                          {req.bloodGroup}
                        </div>
                        <Droplets className="w-3 h-3 text-crimson-400 mx-auto mt-1" />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-mono text-[var(--text-muted)]">{req.id}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${urgency.bg} ${urgency.text} border ${urgency.border}`}>
                          {urgency.label}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
                        {req.patient}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{req.hospital}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{req.timeAgo}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{req.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-[var(--text-muted)] mb-1">Units Needed</div>
                      <div className="font-display text-2xl font-bold text-[var(--text-primary)]">{req.units}</div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                      {statusIcon(req.status)}
                      <span className="text-sm text-[var(--text-secondary)]">{statusLabel(req.status)}</span>
                    </div>
                    {req.status === "pending" && (
                      <button
                        className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                        onClick={() => { if (audioEnabled) soundEngine.success(); }}
                      >
                        Fulfill
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
