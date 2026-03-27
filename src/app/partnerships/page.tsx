import { Metadata } from "next";
import Link from "next/link";
import { Handshake, Mail, Calendar, MapPin, TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Partnerships | AutoShowList",
    description: "Partner with AutoShowList — the premier car show discovery platform. Sponsorship, vendor, and event promotion opportunities for automotive brands, venues, and media.",
    openGraph: {
        title: "Partner with AutoShowList",
        description: "Sponsorship, vendor, and event promotion opportunities for automotive brands, venues, and media.",
        type: "website",
    },
};

export default function PartnershipsPage() {
    return (
        <main className="min-h-screen py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <Handshake className="h-4 w-4" />
                        Partnership Opportunities
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Grow With AutoShowList
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We&apos;re building the go-to platform for car shows and automotive events across the country.
                        Let&apos;s work together to reach passionate car enthusiasts.
                    </p>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[
                        { label: "Monthly Visitors", value: "Growing", icon: TrendingUp },
                        { label: "Events Listed", value: "Nationwide", icon: Calendar },
                        { label: "Markets Covered", value: "50 States", icon: MapPin },
                        { label: "Engaged Community", value: "Automotive", icon: Users },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Partnership Types */}
                <h2 className="text-2xl font-bold text-white text-center mb-8">Partnership Opportunities</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <Card className="bg-card border-white/10 hover:border-primary/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Sponsors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>Put your brand in front of thousands of car enthusiasts.</p>
                            <ul className="space-y-1">
                                <li>• Homepage brand placement</li>
                                <li>• Featured event co-branding</li>
                                <li>• Custom landing pages</li>
                                <li>• Social media amplification</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-white/10 hover:border-blue-500/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-blue-400 flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Venues &amp; Tracks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>Drive attendance to your venue with free or premium listings.</p>
                            <ul className="space-y-1">
                                <li>• Dedicated venue profile page</li>
                                <li>• Recurring event scheduling</li>
                                <li>• Organizer Season Pass discounts</li>
                                <li>• Analytics and attendee insights</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-white/10 hover:border-orange-500/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-orange-400 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Event Promoters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>Pack your lot and put your automotive event on the map.</p>
                            <ul className="space-y-1">
                                <li>• Premium featured event placements</li>
                                <li>• Nationwide audience amplification</li>
                                <li>• High-conversion registration routing</li>
                                <li>• Dedicated organizer profiles</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Why Partner */}
                <div className="bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 border border-white/10 rounded-2xl p-8 md:p-12 mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Why Partner With Us?</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Nationwide Reach</h3>
                                    <p className="text-muted-foreground">Events listed across all 50 states with growing organic traffic.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Passionate Audience</h3>
                                    <p className="text-muted-foreground">Car enthusiasts actively searching for events, parts, and services.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Early Mover Advantage</h3>
                                    <p className="text-muted-foreground">Get in on the ground floor as we scale. Founding partners get premium placement.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-4 w-4 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Flexible Programs</h3>
                                    <p className="text-muted-foreground">Custom packages tailored to your goals — from local shops to national brands.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
                    <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Let&apos;s Talk</h2>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                        Whether you&apos;re a sponsor, venue, vendor, or media outlet, we&apos;d love to explore how we can work together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="font-bold" asChild>
                            <a href="mailto:partnerships@autoshowlist.com">
                                <Mail className="mr-2 h-4 w-4" />
                                partnerships@autoshowlist.com
                            </a>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/pricing">
                                View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
