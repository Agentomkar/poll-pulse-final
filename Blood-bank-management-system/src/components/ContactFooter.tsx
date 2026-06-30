"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Droplets,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Globe,
  MessageCircle,
  Share2,
  Heart,
  Clock,
  Shield,
  ExternalLink,
} from "lucide-react";

const footerLinks = {
  Platform: ["Blood Inventory", "Donor Management", "Emergency Requests", "Analytics Dashboard", "API Documentation"],
  Resources: ["Documentation", "Help Center", "Blog", "Case Studies", "System Status"],
  Company: ["About Us", "Careers", "Press Kit", "Partners", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"],
};

export default function ContactFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <footer ref={sectionRef} id="contact" className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-crimson-900/10 rounded-full blur-[150px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <div className="glass-strong rounded-[2rem] p-10 md:p-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-crimson-500/30 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-crimson-600/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-crimson-600/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center mx-auto mb-8 glow-red-strong"
              >
                <Droplets className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Save More Lives?
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
                Join over 120 hospitals and blood banks already using LifeStream
                to manage their blood supply chain efficiently.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <a
                  href="#donate"
                  className="btn-primary group flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="btn-outline flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold"
                >
                  Schedule a Demo
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  HIPAA Compliant
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  24/7 Support
                </span>
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Free for Non-Profits
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Info */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-crimson-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  24/7 Emergency Hotline
                </div>
                <div className="text-white/40">+1 (800) BLOOD-NOW</div>
                <div className="text-xs text-white/25 mt-1">
                  Available around the clock for emergencies
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-crimson-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  Email Us
                </div>
                <div className="text-white/40">contact@lifestream.health</div>
                <div className="text-xs text-white/25 mt-1">
                  We respond within 2 hours
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-crimson-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  Headquarters
                </div>
                <div className="text-white/40">
                  123 Medical Center Drive, Suite 400
                </div>
                <div className="text-xs text-white/25 mt-1">
                  San Francisco, CA 94102
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <span className="font-display text-lg font-bold">
                  Life<span className="text-crimson-500">Stream</span>
                </span>
              </a>
              <p className="text-sm text-white/30 leading-relaxed mb-6">
                The next-generation blood bank management platform saving lives
                through intelligent technology.
              </p>
              <div className="flex items-center gap-3">
                {[MessageCircle, Share2, Globe].map((Icon, i) => (
                  <a
                    key={`social-${i}`}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white/40" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 group"
                      >
                        {link}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/20">
            © 2026 LifeStream Health Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-white/20">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>FDA Registered</span>
            <span>•</span>
            <span>SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-crimson-500 fill-crimson-500" />
            <span>for healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
