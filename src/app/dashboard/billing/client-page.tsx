"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Crown } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activateStandardListing } from "@/app/actions/billing";
import { createStandardUpgradeSession, createFeaturedUpgradeSession } from "@/app/actions/stripe";

interface BillingClientProps {
    isVerifiedOrganizer: boolean;
    isProVendor: boolean;
}

export function BillingClient({ isVerifiedOrganizer, isProVendor }: BillingClientProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const router = useRouter();

    const eventId = searchParams.get("eventId");
    const preselectedTab = searchParams.get("tab") || "events";

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Payment successful! Your account has been upgraded.");
            router.replace("/dashboard/billing");
        }
        if (searchParams.get("canceled")) {
            toast.error("Payment canceled.");
            router.replace("/dashboard/billing");
        }
    }, [searchParams, router]);

    const handleCheckout = async (type: string) => {
        if (type === "EVENT_STANDARD" || type === "EVENT_FEATURED") {
            if (!eventId) {
                toast.error("Please select an event from your dashboard to upgrade.");
                return;
            }
        }

        setLoading(type);

        try {
            if (type === "EVENT_STANDARD" && eventId) {
                await createStandardUpgradeSession(eventId);
            } else if (type === "EVENT_FEATURED" && eventId) {
                await createFeaturedUpgradeSession(eventId);
            } else {
                toast.error("Organizer/Vendor subscription checkout not yet implemented in this demo.");
                setLoading(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
            setLoading(null);
        }
    };

    const handleSeasonPassActivation = async () => {
        if (!eventId) {
            toast.error("Please select an event to upgrade.");
            return;
        }
        setLoading("ACTIVATE_SEASON");
        try {
            const res = await activateStandardListing(eventId);
            if (res.success) {
                toast.success("Event upgraded to Standard using Season Pass!");
                router.push("/dashboard/events"); // Go back to events
            } else {
                toast.error(res.error || "Activation failed");
            }
        } catch (error) {
            toast.error("Error activating listing");
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="space-y-8 p-8 max-w-6xl mx-auto">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tight">Monetization & Plans</h2>
                <p className="text-muted-foreground">Select the right plan for your automotive journey.</p>
            </div>

            {eventId && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        <span className="font-medium text-white">Upgrading Event: <span className="text-muted-foreground ml-1">(ID: ...{eventId.slice(-4)})</span></span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/events')}>Change Event</Button>
                </div>
            )}

            <Tabs defaultValue={preselectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1">
                    <TabsTrigger value="events">Event Listings</TabsTrigger>
                    <TabsTrigger value="organizers">Organizer Plans</TabsTrigger>
                    <TabsTrigger value="vendors">Vendor Solutions</TabsTrigger>
                </TabsList>

                {/* EVENT LISTINGS */}
                <TabsContent value="events" className="grid gap-6 md:grid-cols-3">
                    {/* Free Tier */}
                    <Card className="flex flex-col border-white/10 glass-card">
                        <CardHeader>
                            <CardTitle>Free Basic</CardTitle>
                            <CardDescription>Discovery Only</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-4xl font-bold">$0</div>
                            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Title, Date, City/State</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Searchable in Calendar</li>
                                <li className="flex items-center opacity-50"><Check className="mr-2 h-4 w-4" /> No Poster Image</li>
                                <li className="flex items-center opacity-50"><Check className="mr-2 h-4 w-4" /> No External Links</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* Standard Event */}
                    <Card className={`flex flex-col border-primary/20 ${isVerifiedOrganizer ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10" : "bg-primary/5"}`}>
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center justify-between">
                                Standard Listing
                                {isVerifiedOrganizer && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">INCLUDED</span>}
                            </CardTitle>
                            <CardDescription>Full Features & Visibility</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {isVerifiedOrganizer ? (
                                <div className="text-4xl font-bold text-green-400">$29<span className="text-lg font-normal text-muted-foreground line-through ml-2">$49</span></div>
                            ) : (
                                <div className="text-4xl font-bold">$29<span className="text-lg font-normal text-muted-foreground line-through ml-2">$49</span></div>
                            )}
                            <ul className="mt-6 space-y-3 text-sm">
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Full Details Page</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Event Poster Image</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Website & Registration Links</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-primary" /> Analytics & Voting</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            {isVerifiedOrganizer ? (
                                <Button
                                    className="w-full font-bold bg-green-600 hover:bg-green-700"
                                    onClick={handleSeasonPassActivation}
                                    disabled={!!loading}
                                >
                                    {loading === "ACTIVATE_SEASON" ? <Loader2 className="animate-spin" /> : "Activate (Season Pass)"}
                                </Button>
                            ) : (
                                <Button
                                    className="w-full font-bold"
                                    onClick={() => handleCheckout("EVENT_STANDARD")}
                                    disabled={!!loading}
                                >
                                    {loading === "EVENT_STANDARD" ? <Loader2 className="animate-spin" /> : "Purchase Listing"}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Featured Event */}
                    <Card className="flex flex-col border-orange-500/30 bg-orange-500/5 glow shadow-orange-900/20">
                        <CardHeader>
                            <CardTitle className="text-orange-500">Featured Listing</CardTitle>
                            <CardDescription>Maximum Exposure</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {isVerifiedOrganizer ? (
                                <div className="text-4xl font-bold text-orange-400">$59<span className="text-lg font-normal text-muted-foreground line-through ml-2">$99</span></div>
                            ) : (
                                <div className="text-4xl font-bold">$59<span className="text-lg font-normal text-muted-foreground line-through ml-2">$99</span></div>
                            )}
                            <ul className="mt-6 space-y-3 text-sm">
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> <b>Homepage Feature Spot</b></li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> Top of Search Results</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> Featured Badge</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-orange-500" /> Weekly Email Inclusion</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full font-bold bg-gradient-to-r from-orange-600 to-red-600 border-none hover:opacity-90"
                                onClick={() => handleCheckout("EVENT_FEATURED")}
                                disabled={!!loading}
                            >
                                {loading === "EVENT_FEATURED" ? <Loader2 className="animate-spin" /> : "Go Featured"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* ORGANIZER PLANS */}
                <TabsContent value="organizers">
                    <Card className="max-w-2xl mx-auto bg-card border-white/5 border-l-4 border-l-primary/50">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl">Organizer Season Pass</CardTitle>
                                {isVerifiedOrganizer ? (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-bold tracking-wide">ACTIVE</span>
                                ) : (
                                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-bold tracking-wide">BEST VALUE</span>
                                )}
                            </div>
                            <CardDescription>For clubs, tracks, and recurring promoters.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-5xl font-bold mb-6">$399<span className="text-lg font-normal text-muted-foreground">/year</span></div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-white">Includes:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Unlimited Standard Listings</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Verified Organizer Badge</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Historical Event Archive</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-white">Bonuses:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-400" /> Discounted Featured Upgrades ($59)</li>
                                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-400" /> Priority Support Line</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button className="w-full text-lg h-12" onClick={() => handleCheckout("ORGANIZER_SEASON")} disabled={isVerifiedOrganizer || !!loading}>
                                    {isVerifiedOrganizer ? "Season Pass Active" : (loading === "ORGANIZER_SEASON" ? <Loader2 className="animate-spin" /> : "Get Season Pass")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* VENDOR PLANS */}
                <TabsContent value="vendors" className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-card border-white/5">
                        <CardHeader>
                            <CardTitle>Vendor Basic</CardTitle>
                            <CardDescription>Create your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-4">$0</div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Basic Vendor Profile</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Listed in Directory (Standard)</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Website Link</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" disabled>Default</Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-card border-blue-500/20 bg-blue-500/5 glow shadow-blue-900/10">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-blue-400">Vendor Pro</CardTitle>
                                {isProVendor ? (
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">ACTIVE</span>
                                ) : (
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">BUSINESS</span>
                                )}
                            </div>
                            <CardDescription>Grow your reach & sales.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-4">$99<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> <b>Verified Blue Badge</b></li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> Enhanced Profile (Logo, Gallery)</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> Priority Search Visibility</li>
                                <li className="flex items-center text-white"><Check className="mr-2 h-4 w-4 text-blue-400" /> Attach Profile to Events</li>
                            </ul>

                            <div className="mt-6 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Available Add-on:</h4>
                                <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                    <span className="text-sm text-white">Event Boost</span>
                                    <span className="text-sm font-bold text-blue-400">$15<span className="text-muted-foreground font-normal">/event</span></span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleCheckout("VENDOR_PRO")} disabled={isProVendor || !!loading}>
                                {isProVendor ? "Pro Active" : (loading === "VENDOR_PRO" ? <Loader2 className="animate-spin" /> : "Join as Pro Vendor")}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
