"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import {
  Heart,
  User,
  Mail,
  Phone,
  Calendar,
  Scale,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import { ApiResponseError, fetchJson } from "@/lib/fetchJson";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

type DonorProfile = {
  donorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  status: string;
  createdAt: string;
};

type DonorRegistrationError = {
  error: string;
  donor?: DonorProfile;
};

const eligibilityCriteria = [
  {
    icon: Calendar,
    title: "Age 18-65",
    desc: "Must be between 18 and 65 years old",
  },
  {
    icon: Scale,
    title: "Weight 50kg+",
    desc: "Minimum weight of 50 kilograms required",
  },
  {
    icon: Heart,
    title: "Good Health",
    desc: "No active infections or chronic conditions",
  },
  {
    icon: Clock,
    title: "56-Day Gap",
    desc: "At least 56 days since last donation",
  },
];

export default function DonorRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    dateOfBirth: "",
    weight: "",
    address: "",
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("lifestreamDonorProfile");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDonorProfile(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!inView || !formRef.current) return;
    gsap.from(formRef.current, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
    });
  }, [inView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await fetchJson<DonorProfile>("/api/donors", {
        label: "Donor registration form",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setDonorProfile(result);
      window.localStorage.setItem("lifestreamDonorProfile", JSON.stringify(result));
      window.dispatchEvent(new Event("lifestream:donor-registered"));
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiResponseError && err.response.status === 409) {
        const data = err.data as DonorRegistrationError;
        if (data.donor) {
          setDonorProfile(data.donor);
          window.localStorage.setItem(
            "lifestreamDonorProfile",
            JSON.stringify(data.donor)
          );
          setSubmitted(false);
          setError("You are already registered. Your profile is shown below.");
          return;
        }
      }

      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses =
    "w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-crimson-500/50 focus:ring-2 focus:ring-crimson-500/10 transition-all duration-300";

  return (
    <section id="donate" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-crimson-900/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-white/60">
              Become a Donor
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Your Blood Can </span>
            <span className="gradient-text-red">Save Lives</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Register as a donor and join our network of life-savers. Every
            donation can help up to three patients in need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div ref={formRef} className="glass-strong rounded-3xl p-8 md:p-10">
              {donorProfile ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10"
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-3">
                      {submitted
                        ? "Registration completed successfully."
                        : "Registered Donor Profile"}
                    </h3>
                    <p className="text-white/50 max-w-md">
                      {submitted
                        ? "Welcome to LifeStream Blood Network."
                        : "This donor is already marked as Registered in the LifeStream network."}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      ["Donor ID", donorProfile.donorId],
                      ["Status", donorProfile.status],
                      ["Name", `${donorProfile.firstName} ${donorProfile.lastName}`],
                      ["Blood Group", donorProfile.bloodGroup],
                      ["Email", donorProfile.email],
                      ["Phone", donorProfile.phone],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                        <div className="text-xs uppercase tracking-wider text-white/30 mb-1">
                          {label}
                        </div>
                        <div className="font-semibold text-white/85 break-words">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {error && (
                    <p className="mt-5 text-center text-sm text-amber-300/80">
                      {error}
                    </p>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={`${inputClasses} pl-11`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`${inputClasses} pl-11`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className={`${inputClasses} pl-11`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                        required
                      >
                        <option value="" className="bg-[#0a0a0a]">
                          Select
                        </option>
                        {bloodGroups.map((g) => (
                          <option key={g} value={g} className="bg-[#0a0a0a]">
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="70"
                        min="50"
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Your full address"
                        rows={3}
                        className={`${inputClasses} pl-11 resize-none`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    {isSubmitting ? "Registering..." : "Register as Donor"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Eligibility Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Eligibility Card */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-crimson-600/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-crimson-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Eligibility Criteria
                </h3>
              </div>
              <div className="space-y-4">
                {eligibilityCriteria.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-4 h-4 text-crimson-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {c.title}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">
                        {c.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Impact So Far
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Lives Saved</span>
                  <span className="font-display text-2xl font-bold text-white">
                    127,000+
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Active Donors</span>
                  <span className="font-display text-2xl font-bold text-white">
                    45,000+
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Donations Today</span>
                  <span className="font-display text-2xl font-bold text-emerald-400">
                    +47
                  </span>
                </div>
              </div>
            </div>

            {/* Alert Card */}
            <div className="rounded-2xl bg-gradient-to-br from-crimson-900/30 to-crimson-800/10 border border-crimson-600/20 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-crimson-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-crimson-300 mb-1">
                    Urgent: O- Blood Needed
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    We have a critical shortage of O- blood type. If you&apos;re
                    O-negative, your donation today could save emergency patients.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
