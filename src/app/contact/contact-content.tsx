"use client";

import React from "react";
import { ContactForm } from "@/components/contact-form";
import { Mail, Clock, ShieldCheck } from "lucide-react";
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
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function ContactContent() {
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col justify-center py-24">
            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="hero-mesh-1" />
                <div className="hero-mesh-2" />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 w-full">
                <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* Left Side: Editorial & Copy */}
                        <div className="p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                            {/* Subtle embedded mesh just for the left card */}
                            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-gradient-to-br from-primary/20 to-transparent" />
                            
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="relative z-10"
                            >
                                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-white/80 tracking-wide uppercase">Get In Touch</span>
                                </motion.div>
                                
                                <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight mb-6">
                                    Let's build the <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                        calendar together.
                                    </span>
                                </motion.h1>

                                <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
                                    Whether you're an organizer looking to bring more traffic to your lot, or an enthusiast experiencing an issue. We're here.
                                </motion.p>

                                <motion.div variants={containerVariants} className="space-y-6">
                                    <motion.div variants={itemVariants} className="flex items-start gap-4">
                                        <div className="bg-primary/20 p-3 rounded-xl">
                                            <Clock className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Fast Response</h3>
                                            <p className="text-muted-foreground text-sm">We typically respond within 24 hours.</p>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="flex items-start gap-4">
                                        <div className="bg-primary/20 p-3 rounded-xl">
                                            <ShieldCheck className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Direct Support</h3>
                                            <p className="text-muted-foreground text-sm">No bots. You speak directly to the founders.</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right Side: Form */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="p-10 lg:p-16 bg-white/[0.02]"
                        >
                            <div className="max-w-md mx-auto">
                                <ContactForm />
                            </div>
                        </motion.div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
