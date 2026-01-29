import { getVendors } from "@/app/actions/vendor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Store } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
    // Fetch data using the server action
    const { data: vendors } = await getVendors();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative h-[300px] bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600706432502-79c29d663806?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />

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
            <div className="container mx-auto py-12 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Featured Vendors</h2>
                    <Button asChild>
                        <Link href="/vendors/register">
                            <Store className="mr-2 h-4 w-4" /> Register Your Business
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors?.map((vendor) => (
                        <Link href={`/vendors/${vendor.slug}`} key={vendor.id} className="group relative block h-full">
                            <div className="h-full rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                            {vendor.businessName}
                                        </h3>
                                        <p className="text-sm text-primary font-medium mt-1 uppercase tracking-wider">{vendor.category}</p>
                                    </div>
                                    {vendor.logoUrl && vendor.subscriptionTier === 'PRO' && (
                                        <div className="h-12 w-12 rounded-lg bg-white/10 overflow-hidden relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={vendor.logoUrl} alt={vendor.businessName} className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                    {vendor.description || "No description provided."}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground mt-auto">
                                    <span className="flex items-center">
                                        📍 {vendor.city}, {vendor.state}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {(!vendors || vendors.length === 0) && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                            <Store className="mx-auto h-12 w-12 opacity-20 mb-4" />
                            <h3 className="text-lg font-medium text-white">No Vendors Yet</h3>
                            <p>Be the first to list your business!</p>
                            <Button variant="link" asChild className="mt-2 text-primary">
                                <Link href="/vendors/register">Register Now &rarr;</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
