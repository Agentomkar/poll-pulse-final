"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Quote } from "lucide-react";

interface TeamMember {
    name: string;
    role: string;
    initials: string;
    bio: string;
    featured: boolean;
}

const teamMembers: TeamMember[] = [
    {
        name: "Omkar",
        role: "Founder & Lead Developer",
        initials: "OM",
        bio: "Visionary founder driving the platform's architecture and development with a passion for life-saving technology.",
        featured: true,
    },
    {
        name: "Blessy Arun",
        role: "Founder & Medical Director",
        initials: "BA",
        bio: "Medical expert ensuring clinical accuracy and compliance across all blood bank operations and protocols.",
        featured: true,
    },
    {
        name: "Sharmi",
        role: "Developer",
        initials: "SH",
        bio: "Full-stack developer contributing to the platform's core features and user experience.",
        featured: false,
    },
    {
        name: "Rosham",
        role: "Developer",
        initials: "RO",
        bio: "Backend specialist building robust APIs and database systems for reliable blood bank management.",
        featured: false,
    },
];

export default function TeamSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="team" ref={sectionRef} className="relative py-32 overflow-hidden">
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
                        <Users className="w-4 h-4 text-crimson-500" />
                        <span className="text-sm font-medium text-white/60">
                            Meet the Team
                        </span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        <span className="text-white">Built by </span>
                        <span className="gradient-text-red">Passionate People</span>
                    </h2>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto">
                        A dedicated team committed to revolutionizing blood bank management
                        and saving lives through innovative technology.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className={`glass-strong rounded-2xl p-6 text-center relative overflow-hidden ${member.featured
                                    ? "ring-1 ring-crimson-500/30"
                                    : ""
                                }`}
                        >
                            {/* Featured badge */}
                            {member.featured && (
                                <div className="absolute top-3 right-3">
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-crimson-600/20 border border-crimson-500/30">
                                        <Quote className="w-3 h-3 text-crimson-400" />
                                        <span className="text-[10px] font-semibold text-crimson-400 uppercase tracking-wider">Core</span>
                                    </div>
                                </div>
                            )}

                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-lg shadow-crimson-900/30">
                                {member.initials}
                            </div>

                            {/* Name & Role */}
                            <h3 className="font-display text-xl font-bold text-white mb-1">
                                {member.name}
                            </h3>
                            <p className="text-sm font-medium text-crimson-400 mb-3">
                                {member.role}
                            </p>

                            {/* Bio */}
                            <p className="text-sm text-white/40 leading-relaxed">
                                {member.bio}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}