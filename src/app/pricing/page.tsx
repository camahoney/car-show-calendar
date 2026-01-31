"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Fuel Your <span className="text-gradient-primary">Growth</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Whether you are hosting a local meet or running a professional detail shop,
                        we have the tools to help you reach thousands of automotive enthusiasts.
                    </p>
                </div>

                <Tabs defaultValue="organizers" className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-center mb-12">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                            <TabsTrigger value="organizers" className="text-lg">For Organizers</TabsTrigger>
                            <TabsTrigger value="vendors" className="text-lg">For Vendors</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ORGANIZER PLANS */}
                    <TabsContent value="organizers">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Free Tier */}
                            <Card className="flex flex-col border-white/10 relative overflow-hidden">
                                <CardHeader>
                                    <CardTitle>Free Basic</CardTitle>
                                    <CardDescription>Get your event on the map.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6">$0</div>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Basic Listing (Title, Time, Location)</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Searchable in Calendar</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Community Visibility</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/events/new">Post Free Event</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Standard Tier */}
                            <Card className="flex flex-col border-primary/50 bg-primary/5 relative overflow-hidden shadow-2xl shadow-primary/10 scale-105 z-10">
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                <CardHeader>
                                    <CardTitle className="text-primary">Standard Listing</CardTitle>
                                    <CardDescription>Essential tools for event growth.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6 text-green-400">$29<span className="text-lg font-normal text-muted-foreground line-through ml-2">$49</span></div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> <b>Full Event Page</b></li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Event Poster & Gallery</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Website & Registration Links</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Analytics Dashboard</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full font-bold bg-primary hover:bg-primary/90" asChild>
                                        <Link href="/events/new">Create Standard Event</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Featured Tier */}
                            <Card className="flex flex-col border-orange-500/30 bg-orange-500/5 relative overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-orange-500">Featured Upgrade</CardTitle>
                                    <CardDescription>Maximum exposure for major shows.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6 text-orange-400">$59<span className="text-lg font-normal text-muted-foreground line-through ml-2">$99</span></div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> <b>Homepage Hero Placement</b></li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> Priority placement above organic listings</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> "Featured" Badge</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> Weekly Email Newsletter Spot</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full border-orange-500/50 hover:bg-orange-500/10 text-orange-500" asChild>
                                        <Link href="/events/new">Go Featured</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Bundle Tier */}
                            <Card className="flex flex-col border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden md:col-span-3 lg:col-span-1">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">NEW</div>
                                <CardHeader>
                                    <CardTitle className="text-indigo-400">The Power Package</CardTitle>
                                    <CardDescription>For Vendor-Organizers who do it all.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6 text-indigo-300">$69<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-indigo-500" /> <b>Pro Vendor Profile</b> ($29 value)</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-indigo-500" /> <b>1 Free Featured Event</b> / mo</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-indigo-500" /> Unlimited Standard Events</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-indigo-500" /> Priority Support</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                                        <Link href="/dashboard/billing">Get the Bundle</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Season Pass Callout */}
                        <div className="mt-12 p-8 rounded-2xl glass border border-white/10 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <Crown className="text-yellow-400 h-6 w-6" /> Organizer Season Pass
                                    </h3>
                                    <p className="text-muted-foreground mt-2 max-w-xl">
                                        Hosting multiple events? Get <b>Unlimited Standard Listings</b> for the entire year, plus discounts on Featured upgrades. Perfect for clubs, tracks, and recurring meets.
                                    </p>
                                </div>
                                <div className="text-center md:text-right">
                                    <div className="text-3xl font-bold mb-2">$399<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                                    <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold" asChild>
                                        <Link href="/dashboard/billing?tab=organizers">Get Season Pass</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* VENDOR PLANS */}
                    <TabsContent value="vendors">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Basic Vendor */}
                            <Card className="flex flex-col border-white/10">
                                <CardHeader>
                                    <CardTitle>Vendor Basic</CardTitle>
                                    <CardDescription>Claim your business profile.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6">$0</div>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Basic Business Profile</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Listed in Vendor Directory</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Website Link</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/vendors/register">Create Profile</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Pro Vendor */}
                            <Card className="flex flex-col border-blue-500/50 bg-blue-500/5 relative overflow-hidden shadow-2xl shadow-blue-500/10 scale-105">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                                <CardHeader>
                                    <CardTitle className="text-blue-400">Vendor Pro</CardTitle>
                                    <CardDescription>Scale your automotive business.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6">$99<span className="text-lg font-normal text-muted-foreground">/year</span></div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> <b>Verified Blue Badge</b></li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> Enhanced Profile (Logo, Gallery)</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> Priority Search Visibility</li>
                                        <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> Attach Profile to Events</li>
                                    </ul>

                                    <div className="mt-6 pt-4 border-t border-white/5">
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Optional add-on (per event)</p>
                                        <div className="flex items-center justify-between bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                            <span className="font-bold text-blue-100 flex items-center gap-2">➕ Vendor Boost</span>
                                            <span className="font-bold text-xl">$15</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full font-bold bg-blue-600 hover:bg-blue-700" asChild>
                                        <Link href="/dashboard/billing?tab=vendors">Go Pro</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-20 text-center">
                    <h3 className="text-xl font-bold mb-4">Questions?</h3>
                    <p className="text-muted-foreground mb-6">Need a custom package for a large event series or sponsorship?</p>
                    <Button variant="ghost" asChild>
                        <Link href="mailto:support@autoshowlist.com">Contact Sales</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
