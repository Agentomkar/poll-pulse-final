import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { AudioProvider } from "@/components/AudioController";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeStream — Blood Bank Management System",
  description:
    "Save lives through intelligent blood management. Real-time inventory tracking, donor management, and emergency blood request coordination.",
};

import SmoothScrolling from "@/components/SmoothScrolling";
import Preloader from "@/components/Preloader";
import ShaderAnimation from "@/components/ShaderAnimation";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} data-theme="dark">
      <body className="bg-[var(--bg-primary)] text-white antialiased selection:bg-crimson-500/30">
        <SmoothScrolling>
          <ShaderAnimation />
          <Preloader />
          <ThemeProvider>
            <AudioProvider>
              {children}
            </AudioProvider>
          </ThemeProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
