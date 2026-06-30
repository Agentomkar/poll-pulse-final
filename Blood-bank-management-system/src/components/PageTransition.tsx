"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Droplets } from "lucide-react";

export default function PageTransition() {
  const [active, setActive] = useState(false);
  const [targetLabel, setTargetLabel] = useState("LifeStream");

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href^='#']") as HTMLAnchorElement | null;

      if (!anchor) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const destination = document.querySelector(href);
      if (!destination) return;

      event.preventDefault();
      setTargetLabel(anchor.textContent?.trim() || href.replace("#", ""));
      setActive(true);

      scrollTimer = setTimeout(() => {
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 360);

      hideTimer = setTimeout(() => {
        setActive(false);
      }, 1150);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (hideTimer) clearTimeout(hideTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden bg-[#050000]"
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(220,20,60,0.42),transparent_28%),linear-gradient(135deg,#190003_0%,#050000_50%,#2a0005_100%)]" />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[46vh] bg-[linear-gradient(180deg,transparent,rgba(142,0,12,0.62)_38%,#090000_100%)]"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* animated fluid ribbons */}
          <motion.div
            className="absolute -left-[10%] top-[35%] h-24 w-[120%] rounded-[50%] bg-crimson-700/40 blur-2xl"
            initial={{ rotate: -4, x: "-30%", opacity: 0 }}
            animate={{ rotate: 5, x: "10%", opacity: 0.7 }}
            exit={{ rotate: -5, x: "40%", opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-[15%] top-[52%] h-16 w-[100%] rounded-[50%] bg-red-500/20 blur-2xl"
            initial={{ rotate: 8, x: "35%", opacity: 0 }}
            animate={{ rotate: -4, x: "-12%", opacity: 0.8 }}
            exit={{ rotate: 8, x: "-45%", opacity: 0 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.div
              initial={{ y: 26, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -24, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <motion.div
                className="mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-crimson-900/40 backdrop-blur-2xl"
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Droplets className="h-12 w-12 text-crimson-300" />
              </motion.div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-crimson-200/70">
                Opening
              </div>
              <div className="font-display text-4xl font-extrabold text-white md:text-6xl">
                {targetLabel}
              </div>
              <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-crimson-700 via-red-400 to-crimson-800"
                  initial={{ x: "-100%" }}
                  animate={{ x: "120%" }}
                  transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
