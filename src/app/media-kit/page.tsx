"use client";

import { Target, TrendingUp, Users, Calendar, Store, CheckCircle2, Printer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Print-Only Header (Hidden in Browser) */}
      <div className="hidden print:flex justify-between items-center py-8 px-12 border-b border-black/20 mb-8 w-full print-section">
        <div>
           <h2 className="text-3xl font-extrabold text-black">AutoShowList</h2>
        </div>
        <div className="text-right">
          <p className="font-bold text-black text-xl">2026 Media Kit</p>
          <p className="text-zinc-600">autoshowlist.com</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] print:h-[200px] bg-black flex flex-col items-center justify-center overflow-hidden print-section print:rounded-2xl print:mx-12 print-break-inside-avoid">
        <div className="hero-mesh-1 opacity-40 mix-blend-screen absolute inset-0 z-0 print:hidden" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-black/90 z-10 print:opacity-100" />
        
        <div className="relative z-20 container text-center space-y-4 px-4">
          <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm print:text-primary">Partnership Guide</span>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tight drop-shadow-md pb-2">
            The Hub for Automotive Events
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto font-medium print:text-white">
            Connect your brand directly with local car enthusiasts, drivers, and builders right as they plan their weekends.
          </p>
          
          <div className="pt-6 print-hide">
             <Button onClick={() => window.print()} variant="outline" className="border-white/20 hover:bg-white/10 text-white backdrop-blur-sm rounded-xl">
                <Printer className="mr-2 h-4 w-4" /> Save as PDF
             </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 print:px-12 max-w-5xl mt-16 space-y-24 print:space-y-12">
        
        {/* The Audience Section */}
        <section className="print-section print-break-inside-avoid">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white print:text-black mb-4">A Highly Engaged Audience</h2>
            <p className="text-muted-foreground print:text-zinc-800 max-w-2xl mx-auto font-medium">
              Auto Show List is rapidly growing into the go-to directory for local car culture. Our audience doesn't just browse; they actively attend events, buy parts, and invest in local services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ultra-glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-extrabold text-white print:text-black mb-2">25<span className="text-primary">%</span></h3>
              <p className="font-bold text-zinc-200 print:text-zinc-800">MoM Growth</p>
              <p className="text-sm text-muted-foreground print:text-zinc-600 mt-2">Consistent traffic increases as local organizers adopt our platform.</p>
            </div>

            <div className="ultra-glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-extrabold text-white print:text-black mb-2">High</h3>
              <p className="font-bold text-zinc-200 print:text-zinc-800">Purchase Intent</p>
              <p className="text-sm text-muted-foreground print:text-zinc-600 mt-2">Visitors are proactively looking for detailing, tuning, and event prep services.</p>
            </div>

            <div className="ultra-glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-extrabold text-white print:text-black mb-2">18-45</h3>
              <p className="font-bold text-zinc-200 print:text-zinc-800">Core Demographic</p>
              <p className="text-sm text-muted-foreground print:text-zinc-600 mt-2">A passionate community of JDM, Muscle, Euro, and Truck enthusiasts.</p>
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="print-section print-break-inside-avoid">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-white print:text-black">Partnership Opportunities</h2>
              <p className="text-muted-foreground print:text-zinc-800 leading-relaxed font-medium">
                Whether you are a local detailing shop looking to attract foot traffic, or a national parts brand seeking high-intent impressions, we offer seamless integrations.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <strong className="text-white print:text-black block">Featured Event Listings</strong>
                    <span className="text-sm text-muted-foreground print:text-zinc-600">Bump your car show to the top of the directory with a glowing premium card for maximum visibility.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <strong className="text-white print:text-black block">Vendor Directory Presence</strong>
                    <span className="text-sm text-muted-foreground print:text-zinc-600">List your local service business and attach it directly to upcoming meets so attendees know you will be there.</span>
                  </div>
                </li>
                 <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <strong className="text-white print:text-black block">Display Advertising</strong>
                    <span className="text-sm text-muted-foreground print:text-zinc-600">Secure a static banner slot on our homepage or event pages pointing directly to your storefront.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2 w-full grid grid-cols-1 gap-4">
               <div className="ultra-glass border border-primary/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calendar className="w-24 h-24 print:hidden" />
                  </div>
                  <h4 className="text-2xl font-bold text-white print:text-black mb-1">Organizers</h4>
                  <p className="text-muted-foreground print:text-zinc-600 mb-4">Promote your physical events.</p>
                  <p className="text-2xl font-extrabold text-primary mb-1">Starting at $9<span className="text-sm text-muted-foreground print:text-zinc-500 font-normal">/event</span></p>
               </div>
               
               <div className="ultra-glass border border-primary/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Store className="w-24 h-24 print:hidden" />
                  </div>
                  <h4 className="text-2xl font-bold text-white print:text-black mb-1">Vendors</h4>
                  <p className="text-muted-foreground print:text-zinc-600 mb-4">List your local shop or service.</p>
                  <p className="text-2xl font-extrabold text-primary mb-1">$99<span className="text-sm text-muted-foreground print:text-zinc-500 font-normal">/year</span></p>
               </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="print-section print-break-inside-avoid text-center ultra-glass p-12 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none print:hidden" />
            <h2 className="text-3xl font-extrabold text-white print:text-black mb-4 relative z-10">Ready to Gear Up?</h2>
            <p className="text-muted-foreground print:text-zinc-800 max-w-xl mx-auto mb-8 relative z-10 font-medium">
              Join the fastest-growing calendar for car enthusiasts. Let's build a custom partnership package that drives real results for your brand.
            </p>
            <div className="flex flex-col sm:flex-row justify-center relative z-10 print-hide gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 rounded-xl animate-pulse-glow shadow-lg w-full sm:w-auto">
                <a href="mailto:hello@autoshowlist.com?subject=Partnership Inquiry">
                  Contact Us For Placement
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 rounded-xl w-full sm:w-auto">
                <Link href="/pricing">View Self-Serve Pricing</Link>
              </Button>
            </div>
            
            {/* Print-Only Contact Info */}
            <div className="hidden print:block mt-6 pt-6 border-t border-black/10">
               <p className="text-xl font-bold text-black mb-2">Let's Connect.</p>
               <p className="text-lg font-medium text-black">Email: <span className="text-primary font-bold">hello@autoshowlist.com</span></p>
               <p className="text-zinc-600 mt-1">autoshowlist.com/pricing</p>
            </div>
        </section>
      </div>
    </div>
  );
}
