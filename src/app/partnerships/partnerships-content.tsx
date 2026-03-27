"use client";

import React from "react";
import Link from "next/link";
import { Handshake, Mail, Calendar, MapPin, TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function PartnershipsContent() {
    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden pb-24">
            {/* Ambient Backgrounds */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="hero-mesh-1" />
                <div className="hero-mesh-2" />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32">
                {/* Hero */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="text-center mb-24 max-w-4xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 mb-8 backdrop-blur-md">
                        <Handshake className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold text-primary tracking-wide uppercase">Partnership Opportunities</span>
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl">
                        Grow With <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">AutoShowList</span>
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                        We're building the go-to platform for car shows and automotive events across the country. Let's work together to reach passionate enthusiasts.
                    </motion.p>
                </motion.div>

                {/* Stats bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-32"
                >
                    {[
                        { label: "Monthly Visitors", value: "Growing", icon: TrendingUp },
                        { label: "Events Listed", value: "Nationwide", icon: Calendar },
                        { label: "Markets Covered", value: "50 States", icon: MapPin },
                        { label: "Engaged Community", value: "Automotive", icon: Users },
                    ].map((stat, i) => (
                        <div key={stat.label} className="ultra-glass rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <stat.icon className="h-8 w-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                            <div className="text-2xl font-black text-white mb-1 relative z-10">{stat.value}</div>
                            <div className="text-sm font-medium text-muted-foreground relative z-10 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Partnership Types */}
                <div className="mb-32">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12 tracking-tight"
                    >
                        Our Pillars of Partnership
                    </motion.h2>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {/* Sponsors Card */}
                        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative group overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <Star className="h-7 w-7 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Brand Sponsors</h3>
                            <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed">
                                Put your brand in front of thousands of high-intent car enthusiasts actively searching for events and parts.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-300 relative z-10 font-medium">
                                <li className="flex items-center gap-2">• <span className="text-white">Homepage brand placement</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Featured event co-branding</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Custom landing pages</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Social media amplification</span></li>
                            </ul>
                        </motion.div>

                        {/* Venues & Tracks Card */}
                        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative group overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <MapPin className="h-7 w-7 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Venues & Tracks</h3>
                            <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed">
                                Drive attendance to your venue and fill your lots with highly targeted event listings.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-300 relative z-10 font-medium">
                                <li className="flex items-center gap-2">• <span className="text-white">Dedicated venue profile</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Recurring event scheduling</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Organizer Season Pass</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Attendee analytics insights</span></li>
                            </ul>
                        </motion.div>

                        {/* Event Promoters Card */}
                        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative group overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <Calendar className="h-7 w-7 text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Event Promoters</h3>
                            <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed">
                                Pack your lot and put your automotive event on the map with powerful promotion tools.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-300 relative z-10 font-medium">
                                <li className="flex items-center gap-2">• <span className="text-white">Premium event placements</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Nationwide audience reach</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">High-conversion ticketing</span></li>
                                <li className="flex items-center gap-2">• <span className="text-white">Dedicated organizer pages</span></li>
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Why Partner */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="ultra-glass rounded-3xl p-10 md:p-16 mb-24 lg:mx-10"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center tracking-tight">Why Partner With Us?</h2>
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                        <div className="space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Nationwide Reach</h3>
                                    <p className="text-muted-foreground leading-relaxed">Events listed across all 50 states with growing organic traffic, capturing high-intent searches instantly.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Users className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Passionate Audience</h3>
                                    <p className="text-muted-foreground leading-relaxed">We cater specifically to car enthusiasts who are actively spending time and money on events, parts, and services.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <TrendingUp className="h-6 w-6 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Early Mover Advantage</h3>
                                    <p className="text-muted-foreground leading-relaxed">Get in on the ground floor as we scale. Founding partners receive premium legacy placement across the site.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Calendar className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Flexible Programs</h3>
                                    <p className="text-muted-foreground leading-relaxed">Custom promotional packages strictly tailored to your goals — from local detailing shops to massive national brands.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center bg-black/50 border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
                    <Mail className="h-12 w-12 text-primary mx-auto mb-6 relative z-10" />
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight relative z-10">Start The Conversation</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
                        Whether you're a sponsor, venue, or event promoter, we are ready to elevate your brand.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center relative z-10">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/50 transition-all rounded-full" asChild>
                            <a href="mailto:partnerships@autoshowlist.com">
                                <Mail className="mr-3 h-5 w-5" />
                                Email Partnerships
                            </a>
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded-full" asChild>
                            <Link href="/pricing">
                                View Pricing <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
