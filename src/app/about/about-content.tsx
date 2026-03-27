"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Map, Users, Trophy, Zap, ShieldCheck, Globe } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function AboutContent() {
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="hero-mesh-1" />
                <div className="hero-mesh-2" />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[100px]" />
            </div>

            {/* Hero Section */}
            <div className="relative z-10 min-h-[50vh] flex items-center justify-center pt-32 pb-16 px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-white/80 tracking-wide uppercase">The Movement</span>
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl flex flex-col font-extrabold tracking-tighter text-white mb-6 drop-shadow-2xl">
                        <span>Driven by</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                            Passion.
                        </span>
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                        We are building the definitive digital home for the car culture community.
                        No more broken websites, dead links, or missed events.
                    </motion.p>
                </motion.div>
            </div>

            {/* Guiding Principles Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 container mx-auto px-4 mb-24"
            >
                <div className="ultra-glass rounded-3xl p-8 md:p-12 mb-10 w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="flex flex-col items-center pt-4 md:pt-0">
                        <Users className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">100% Enthusiast Built</h3>
                        <p className="text-sm text-muted-foreground">Created by car folks, for car folks.</p>
                    </div>
                    <div className="flex flex-col items-center pt-8 md:pt-0">
                        <ShieldCheck className="h-8 w-8 text-rose-500 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Strictly Curated</h3>
                        <p className="text-sm text-muted-foreground">Every event is verified for quality.</p>
                    </div>
                    <div className="flex flex-col items-center pt-8 md:pt-0">
                        <Globe className="h-8 w-8 text-orange-500 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Nationwide Coverage</h3>
                        <p className="text-sm text-muted-foreground">From massive nationals to Friday meets.</p>
                    </div>
                </div>
            </motion.div>

            {/* Editorial Mission Section */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-8 relative"
                    >
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-rose-500 to-transparent hidden md:block rounded-full" />
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            The Engine <br/>Behind The Platform
                        </h2>
                        
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                Car Show Calendar was born out of a simple, undeniable frustration: <span className="text-white font-medium">it is fundamentally too hard to find high-quality car shows.</span>
                            </p>
                            <p>
                                Relying on disorganized social media groups or legacy directories that look like they haven't been updated since 2005 just shouldn't be the norm anymore. We believe that automotive enthusiasts spend thousands of hours and dollars on their builds, and they deserve a premium platform that matches their dedication.
                            </p>
                            <p>
                                Our mission is to index every verifiable car show, cruise-in, and automotive meet across the nation, placing them all on a beautiful, lightning-fast discovery platform. No ads masking the calendar, no confusing mobile layouts. Just pure car culture.
                            </p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        <motion.div variants={itemVariants}>
                            <FeatureCard
                                icon={Calendar}
                                title="Comprehensive"
                                desc="Aggregated listings from huge conventions down to local grassroot weekend meets."
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <FeatureCard
                                icon={Map}
                                title="Local First"
                                desc="Our powerful location engine means you never have to guess what's happening near your zip code."
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <FeatureCard
                                icon={Users}
                                title="Community Hub"
                                desc="Connecting passionate attendees directly with the hard-working organizers who make the events happen."
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <FeatureCard
                                icon={Trophy}
                                title="Premium Quality"
                                desc="Say goodbye to broken websites. A platform that looks as good as the cars parked at the shows."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* High Impact Call to Action */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 mt-24 border-t border-white/10 bg-black/50"
            >
                <div className="container mx-auto px-4 py-24 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Fuel The Movement</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                        Whether you're an organizer ready to pack the lot, or an enthusiast mapping out your weekend drive.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button size="lg" className="h-14 text-lg px-10 font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/50 transition-all rounded-full" asChild>
                            <Link href="/events">Explore Events</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 text-lg px-10 font-bold border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded-full" asChild>
                            <Link href="/events/new">Submit a Show</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl glass-card relative group overflow-hidden h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Icon className="h-10 w-10 text-primary mb-5 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
            <p className="text-sm text-muted-foreground relative z-10 flex-1">{desc}</p>
        </div>
    );
}
