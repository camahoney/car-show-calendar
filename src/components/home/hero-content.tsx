"use client";

import { Flame } from "lucide-react";
import { motion, Variants } from "framer-motion";

export function HeroContent() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="container relative z-20 px-4 text-center max-w-4xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        variants={item}
        className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] animate-float"
      >
        <Flame className="h-4 w-4 text-primary animate-pulse" />
        <span>The #1 Automotive Event Calendar</span>
      </motion.div>

      <motion.h1 
        variants={item}
        className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white drop-shadow-2xl"
      >
        Fuel Your <span className="text-gradient-primary relative inline-block">
          Passion
          <div className="absolute inset-0 blur-[40px] bg-primary/30 -z-10 rounded-full max-w-full" />
        </span>
      </motion.h1>

      <motion.p 
        variants={item}
        className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
      >
        Discover the most exclusive car shows, meetups, and track days your area has to offer.
      </motion.p>
    </motion.div>
  );
}
