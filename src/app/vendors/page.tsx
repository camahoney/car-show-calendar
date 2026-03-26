import { getVendors } from "@/app/actions/vendor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Store, ExternalLink } from "lucide-react";

const AFFILIATE_PARTNERS = [
    {
        name: "Chemical Guys",
        category: "Detailing Supplies",
        description: "Premium car care products, waxes, and ceramic coatings for show-ready shine.",
        link: "#", // Add your affiliate link here
        image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80",
    },
    {
        name: "Tire Rack",
        category: "Wheels & Tires",
        description: "The nation's leading high-performance tire and wheel destination.",
        link: "#", // Add your affiliate link here
        image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80",
    },
    {
        name: "Fitment Industries",
        category: "Suspension & Wheels",
        description: "Find the perfect stance. Coilovers, wheels, and suspension kits.",
        link: "#", // Add your affiliate link here
        image: "https://images.unsplash.com/photo-1611821064430-0d40221e4f41?auto=format&fit=crop&q=80",
    },
    {
        name: "Griot's Garage",
        category: "Car Care",
        description: "Professional-grade buffers, polishes, and garage accessories.",
        link: "#", // Add your affiliate link here
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80",
    }
];

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
    // Fetch data using the server action
    const { data: vendors } = await getVendors();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative h-[300px] bg-black flex items-center justify-center overflow-hidden">
                <div className="hero-mesh-1 opacity-40 mix-blend-screen absolute inset-0 z-0" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/80 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600706432502-79c29d663806?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 z-0" />

                <div className="relative z-20 container text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight">
                        Vendor Directory
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Find the best detailers, tuners, and mechanics for your build.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search vendors, services, or locations..."
                                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-muted-foreground backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto py-12 px-4 space-y-20">
                
                {/* Affiliate Section */}
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Top Online Partners</h2>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 hidden sm:inline-block">Exclusive Deals</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {AFFILIATE_PARTNERS.map((partner, i) => (
                            <Link href={partner.link} target="_blank" rel="noopener noreferrer" key={partner.name} className="group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both block h-full" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="h-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] flex flex-col ultra-glass">
                                    <div className="h-40 relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={partner.image} alt={partner.name} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                                                {partner.name}
                                                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h3>
                                            <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wider">{partner.category}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                            {partner.description}
                                        </p>
                                        <span className="text-sm font-bold text-primary flex items-center justify-between mt-auto">
                                            Shop Now <span className="translate-x-0 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Local Vendors Section */}
                <div className="space-y-8 pt-10 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Local Directory</h2>
                            <p className="text-muted-foreground mt-1">Detail shops, mechanics, tuners, and more.</p>
                        </div>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold animate-pulse-glow hover:scale-105 transition-transform shadow-lg hidden sm:flex">
                            <Link href="/vendors/register">
                                <Store className="mr-2 h-4 w-4" /> Register Business
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendors?.map((vendor, i) => (
                            <Link href={`/vendors/${vendor.slug}`} key={vendor.id} className="group relative block h-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${(i % 6) * 100}ms` }}>
                                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)] ultra-glass flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                {vendor.businessName}
                                            </h3>
                                            <p className="text-sm text-primary font-medium mt-1 uppercase tracking-wider">{vendor.category}</p>
                                        </div>
                                        {vendor.logoUrl && vendor.subscriptionTier === 'PRO' && (
                                            <div className="h-12 w-12 rounded-lg bg-white/10 overflow-hidden relative shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] border border-blue-500/30 shrink-0 ml-4">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={vendor.logoUrl} alt={vendor.businessName} className="object-cover w-full h-full" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                        {vendor.description || "No description provided."}
                                    </p>
                                    <div className="flex items-center text-xs text-muted-foreground mt-4 pt-4 border-t border-white/5">
                                        <span className="flex items-center gap-1">
                                            📍 {vendor.city}, {vendor.state}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {(!vendors || vendors.length === 0) && (
                            <div className="col-span-full py-20 text-center space-y-4 ultra-glass rounded-3xl mt-8 animate-in fade-in zoom-in duration-500 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                                <Store className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                                <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">No Local Shops Yet</h3>
                                <p className="text-muted-foreground text-lg">Be the first to list your local automotive business!</p>
                                <Button asChild className="mt-6 bg-primary hover:bg-primary/90 hover:scale-105 transition-all text-white font-bold px-8 shadow-lg animate-pulse-glow">
                                    <Link href="/vendors/register">Register Now &rarr;</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
