"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets } from "lucide-react";
import gsap from "gsap";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
      
      // Trigger opening animations for the rest of the app
      document.body.classList.add("app-loaded");
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050000]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.15),transparent_50%)]" />

          {/* Liquid fill animation */}
          <div className="relative mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-2xl">
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-crimson-800 to-crimson-500"
              initial={{ height: "0%" }}
              animate={{ height: "100%" }}
              transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
            />
            <Droplets className="relative z-10 h-12 w-12 text-white drop-shadow-lg" />
          </div>

          <div className="flex flex-col items-center overflow-hidden">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-display text-4xl font-bold tracking-widest text-white"
            >
              LIFESTREAM
            </motion.div>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              className="mt-4 h-px bg-gradient-to-r from-transparent via-crimson-500 to-transparent w-48"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-4 text-xs font-bold uppercase tracking-[0.4em] text-white/40"
            >
              Initializing Systems
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
