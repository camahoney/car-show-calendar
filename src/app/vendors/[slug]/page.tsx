import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Instagram, Phone, Mail, Store, CheckCircle, Edit, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const vendor = await prisma.vendor.findUnique({
        where: { slug },
    });

    if (!vendor) return { title: "Vendor Not Found" };

    return {
        title: `${vendor.businessName} - Car Show Calendar`,
        description: vendor.description?.substring(0, 160),
    };
}

export default async function VendorProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    const vendor = await prisma.vendor.findUnique({
        where: { slug },
        include: { user: true }
    });

    if (!vendor) notFound();

    const isPro = vendor.subscriptionTier === 'PRO';
    const isOwner = session?.user?.id === vendor.userId;
    const showContactInfo = isPro || isOwner;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Owner Upgrade Prompt */}
            {isOwner && !isPro && (
                <div className="bg-indigo-900/30 border-b border-indigo-500/20 py-3 px-4">
                    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Crown className="h-5 w-5 text-indigo-400" />
                            <p className="text-sm font-medium text-indigo-100">
                                Your contact info is visible to you, but hidden from the public. Upgrade to Pro to unlock full visibility.
                            </p>
                        </div>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap" asChild>
                            <Link href="/dashboard/billing?tab=vendors">Upgrade to Pro</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Banner - PRO Only (or Owner Preview) */}
            <div className="relative h-[300px] w-full bg-muted overflow-hidden">
                {(isPro || isOwner) && vendor.bannerUrl ? (
                    <Image
                        src={vendor.bannerUrl}
                        alt="Banner"
                        fill
                        className={`object-cover ${!isPro && isOwner ? 'opacity-75 grayscale' : ''}`}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center opacity-50">
                        {/* Fallback abstract pattern */}
                        {!isPro && isOwner && <p className="text-white/30 font-medium">Add a banner (Pro Only)</p>}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Logo - PRO Only (or Owner Preview) */}
                    <div className="w-40 h-40 rounded-2xl border-4 border-background overflow-hidden bg-card shadow-2xl shrink-0 relative group">
                        {(isPro || isOwner) && vendor.logoUrl ? (
                            <Image
                                src={vendor.logoUrl}
                                alt={vendor.businessName}
                                width={160}
                                height={160}
                                className={`object-cover w-full h-full ${!isPro && isOwner ? 'opacity-80' : ''}`}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-muted-foreground">
                                <Store className="h-12 w-12 opacity-50" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4 pt-12 md:pt-0 w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold text-white">{vendor.businessName}</h1>
                                    {vendor.verifiedStatus === "VERIFIED" && isPro && (
                                        <CheckCircle className="h-6 w-6 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="uppercase tracking-wider">{vendor.category}</Badge>
                                    <div className="flex items-center text-muted-foreground text-sm">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {vendor.city}, {vendor.state}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button for Owner */}
                            {isOwner && (
                                <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
                                    <Link href="/vendors/manage">
                                        <Edit className="h-4 w-4" /> Edit Profile
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Description - All Tiers */}
                        <div className="max-w-3xl prose prose-invert text-gray-300">
                            {vendor.description}
                        </div>

                        {/* Contact Info - PRO Only (or Owner) */}
                        {showContactInfo ? (
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-t border-white/10 mt-8 ${!isPro && isOwner ? "opacity-60 border-dashed" : ""}`}>
                                {vendor.website ? (
                                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5" asChild>
                                        <Link href={vendor.website} target="_blank">
                                            <Globe className="mr-2 h-4 w-4" /> Website
                                        </Link>
                                    </Button>
                                ) : (
                                    isOwner && <Button variant="outline" disabled className="h-12 border-dashed">No Website Added</Button>
                                )}

                                {vendor.instagram ? (
                                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5" asChild>
                                        <Link href={`https://instagram.com/${vendor.instagram.replace('@', '')}`} target="_blank">
                                            <Instagram className="mr-2 h-4 w-4" /> Instagram
                                        </Link>
                                    </Button>
                                ) : (
                                    isOwner && <Button variant="outline" disabled className="h-12 border-dashed">No Instagram Added</Button>
                                )}

                                {vendor.email ? (
                                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5" asChild>
                                        <Link href={`mailto:${vendor.email}`}>
                                            <Mail className="mr-2 h-4 w-4" /> Email
                                        </Link>
                                    </Button>
                                ) : (
                                    isOwner && <Button variant="outline" disabled className="h-12 border-dashed">No Email Added</Button>
                                )}

                                {vendor.phone ? (
                                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5" asChild>
                                        <Link href={`tel:${vendor.phone}`}>
                                            <Phone className="mr-2 h-4 w-4" /> Call
                                        </Link>
                                    </Button>
                                ) : (
                                    isOwner && <Button variant="outline" disabled className="h-12 border-dashed">No Phone Added</Button>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-muted-foreground mb-4">Contact information is available for Pro vendors.</p>
                                {/* Disabled button for visitors */}
                                <Button disabled variant="secondary" className="opacity-50">
                                    Unlock Contact Info
                                </Button>
                            </div>
                        )}

                        {/* Mobile Edit Button */}
                        {isOwner && (
                            <div className="mt-8 md:hidden">
                                <Button className="w-full" asChild>
                                    <Link href="/vendors/manage">Manage Profile</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
