"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function BloodWaveVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const dropY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const waveY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: "transform" }}>
      {/* Cinematic crimson background */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: glowOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(220,20,60,0.22),transparent_24%),radial-gradient(circle_at_18%_78%,rgba(139,0,0,0.28),transparent_34%),linear-gradient(180deg,rgba(8,0,2,0.1)_0%,rgba(8,0,2,0.88)_72%,rgba(5,0,1,1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.55)_100%)]" />
      </motion.div>

      {/* Soft light beams */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35], scaleX: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[58%] top-[22%] h-[42vh] w-[42vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,118,118,0.16),transparent_68%)] blur-3xl"
      />
      <motion.div
        animate={{ x: ["-8%", "8%", "-8%"], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[38%] left-0 h-20 w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent)] blur-2xl"
      />

      {/* Floating crystalline blood drop */}
      <motion.svg
        viewBox="0 0 420 560"
        className="absolute left-[62%] top-[10%] h-[54vh] max-h-[560px] min-h-[320px] w-auto -translate-x-1/2 drop-shadow-[0_0_80px_rgba(220,20,60,0.42)]"
        style={{ y: dropY, willChange: "transform" }}
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          scale: [0.8, 1.05, 1],
          rotate: [-2, 2, -1.5, -2] 
        }}
        transition={{ 
          y: { duration: 1.8, delay: 2.8, ease: "easeOut" },
          opacity: { duration: 1.8, delay: 2.8 },
          scale: { duration: 1.8, delay: 2.8, ease: "easeOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4.6 }
        }}
      >
        <defs>
          <radialGradient id="dropCore" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#ff9a9a" stopOpacity="0.98" />
            <stop offset="18%" stopColor="#ff284e" stopOpacity="0.95" />
            <stop offset="52%" stopColor="#b00018" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#280004" stopOpacity="0.98" />
          </radialGradient>
          <linearGradient id="dropEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="26%" stopColor="#ff7b86" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#210003" stopOpacity="0.1" />
          </linearGradient>
          <filter id="dropGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.9  0 0.15 0 0 0.02  0 0 0.15 0 0.04  0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="innerGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="bloodDropClip">
            <path d="M212 28 C258 94 334 180 334 289 C334 420 282 520 211 520 C138 520 86 420 86 290 C86 180 166 94 212 28 Z" />
          </clipPath>
        </defs>

        <motion.path
          d="M212 28 C258 94 334 180 334 289 C334 420 282 520 211 520 C138 520 86 420 86 290 C86 180 166 94 212 28 Z"
          fill="url(#dropCore)"
          stroke="url(#dropEdge)"
          strokeWidth="3"
          filter="url(#dropGlow)"
          animate={{ opacity: [0.92, 1, 0.94] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Faceted crystalline panels */}
        <g clipPath="url(#bloodDropClip)" opacity="0.78">
          {[
            "M210 42 L255 122 L214 190 L170 128 Z",
            "M258 124 L315 210 L245 232 L216 192 Z",
            "M168 130 L214 194 L156 252 L96 210 Z",
            "M158 254 L244 235 L274 328 L196 350 Z",
            "M96 214 L156 256 L198 352 L118 338 Z",
            "M276 332 L323 292 L298 432 L235 405 Z",
            "M196 354 L236 407 L210 516 L144 420 Z",
            "M120 342 L196 356 L144 420 L96 380 Z",
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill={i % 2 === 0 ? "rgba(255,255,255,0.11)" : "rgba(255,40,70,0.16)"}
              stroke="rgba(255,210,210,0.18)"
              strokeWidth="1.5"
              animate={{ opacity: [0.22, 0.55, 0.28] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
            />
          ))}
        </g>

        {/* Glowing vein lines */}
        <g clipPath="url(#bloodDropClip)" filter="url(#innerGlow)">
          {[
            "M205 70 C228 142 232 186 210 250 C198 286 214 330 254 392",
            "M162 150 C190 190 196 226 176 274 C156 322 168 374 212 446",
            "M262 156 C244 214 250 260 286 318 C304 348 294 394 256 438",
            "M116 238 C162 252 198 252 246 232 C284 218 310 234 326 270",
            "M110 352 C168 334 226 346 286 392",
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke={i % 2 === 0 ? "rgba(255,245,245,0.78)" : "rgba(255,120,120,0.58)"}
              strokeWidth={i % 2 === 0 ? 5 : 3}
              strokeLinecap="round"
              strokeDasharray="14 18"
              animate={{ strokeDashoffset: [0, -64], opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 3.5 + i * 0.35, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </g>

        {/* Specular highlights */}
        <motion.ellipse
          cx="174"
          cy="150"
          rx="38"
          ry="82"
          fill="rgba(255,255,255,0.38)"
          transform="rotate(22 174 150)"
          filter="url(#innerGlow)"
          animate={{ opacity: [0.2, 0.55, 0.25], x: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="276"
          cy="238"
          rx="18"
          ry="48"
          fill="rgba(255,255,255,0.2)"
          transform="rotate(-28 276 238)"
          animate={{ opacity: [0.15, 0.42, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.svg>

      {/* Liquid blood wave surface */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[42vh] origin-bottom"
        style={{ y: waveY, willChange: "transform" }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <svg viewBox="0 0 1600 520" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9f0015" stopOpacity="0.92" />
              <stop offset="44%" stopColor="#4b0008" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#060002" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="waveHighlight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="45%" stopColor="#ffb3b3" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="liquidBlur">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <motion.path
            d="M0 204 C170 122 262 238 412 158 C578 70 690 210 836 154 C1048 74 1190 190 1370 132 C1482 96 1542 102 1600 122 L1600 520 L0 520 Z"
            fill="url(#waveFill)"
            animate={{
              d: [
                "M0 204 C170 122 262 238 412 158 C578 70 690 210 836 154 C1048 74 1190 190 1370 132 C1482 96 1542 102 1600 122 L1600 520 L0 520 Z",
                "M0 176 C184 236 286 126 438 186 C608 254 724 114 886 174 C1068 242 1178 118 1362 180 C1480 220 1532 186 1600 154 L1600 520 L0 520 Z",
                "M0 204 C170 122 262 238 412 158 C578 70 690 210 836 154 C1048 74 1190 190 1370 132 C1482 96 1542 102 1600 122 L1600 520 L0 520 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0 210 C210 178 286 206 448 176 C620 144 760 190 914 164 C1100 132 1260 184 1600 140"
            fill="none"
            stroke="url(#waveHighlight)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#liquidBlur)"
            animate={{ y: [0, 22, 0], opacity: [0.22, 0.52, 0.22] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0 292 C260 238 382 304 560 262 C754 218 948 306 1160 248 C1350 196 1470 232 1600 206"
            fill="none"
            stroke="rgba(255,80,95,0.24)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#liquidBlur)"
            animate={{ y: [8, -14, 8], opacity: [0.12, 0.3, 0.12] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>

      {/* Premium grain + vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.6)_100%)]" />
      <div className="absolute inset-0 opacity-[0.055] mix-blend-screen [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
    </div>
  );
}
