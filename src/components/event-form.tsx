"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { eventSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { SimpleImageUpload } from "@/components/simple-image-upload";
import { createEvent, updateEvent } from "@/app/actions/event";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { lookupZip } from "@/app/actions/geo";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

type FormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
    initialData?: FormValues & { id?: string };
}

export function EventForm({ initialData }: EventFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";
    const [listingType, setListingType] = useState<"BASIC" | "PREMIUM">("PREMIUM");

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(eventSchema) as any,
        defaultValues: initialData || {
            title: "",
            description: "",
            venueName: "",
            addressLine1: "",
            city: "",
            state: "",
            zip: "",
            rainDatePolicy: "NONE",
            entryFee: 0,
            entryFeeMax: undefined,
            spectatorFee: 0,
            spectatorFeeMax: undefined,
            judgedOrCruiseIn: "BOTH",
            contactEmail: "",
            posterUrl: "",
            votingEnabled: true,
            rainDate: null,
            vehicleRequirements: "",
            charityBeneficiary: "",
            contactPhone: "",
            websiteUrl: "",
            facebookUrl: "",
            registrationUrl: "",
            isPreRelease: false,
            source: "USER",
        },
    });

    // Auto-Populate ZIP Code
    const city = form.watch("city");
    const state = form.watch("state");
    const addressLn1 = form.watch("addressLine1");

    // Debounce to avoid API spam
    const debouncedCity = useDebounce(city, 1000);
    const debouncedState = useDebounce(state, 1000);
    const debouncedAddress = useDebounce(addressLn1, 1000);

    useEffect(() => {
        const fetchZip = async () => {
            // Only fetch if we have City + State, and ZIP is empty
            if (debouncedCity && debouncedState && debouncedState.length === 2) {
                const currentZip = form.getValues("zip");
                if (!currentZip) {
                    const foundZip = await lookupZip(debouncedCity, debouncedState, debouncedAddress);
                    if (foundZip) {
                        form.setValue("zip", foundZip);
                    }
                }
            }
        };
        fetchZip();
    }, [debouncedCity, debouncedState, debouncedAddress, form]);

    // Reset advanced fields if switching to BASIC
    const handleTierChange = (type: "BASIC" | "PREMIUM") => {
        setListingType(type);
        if (type === "BASIC") {
            // Trim description if they wrote a massive one and then downgraded
            const currentDesc = form.getValues("description") || "";
            if (currentDesc.length > 150) {
                form.setValue("description", currentDesc.substring(0, 150));
            }
        }
    };

    async function onSubmit(data: FormValues) {
        setLoading(true);
        try {
            let result;
            // If BASIC, ensure we don't submit rich data? Or handled by server? 
            // For now, submitting what is in the form.

            if (initialData?.id) {
                result = await updateEvent({ ...data, id: initialData.id });
            } else {
                result = await createEvent(data);
            }

            if (result.success) {
                // If STANDARD and new event, maybe redirect to payment?
                // For now, standard flow.
                router.push(`/events/${result.eventId}`);
                router.refresh();
            } else {
                console.error(result.error);
                alert("Submission failed: " + JSON.stringify(result.details || result.error));
            }
        } catch (e) {
            console.error(e);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error("Form Validation Errors:", errors);
                alert("Please correct the errors in the form: " + Object.keys(errors).join(", "));
            })} className="space-y-8">

                {/* Aggressive Up-Sell Tier Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                     <div
                        onClick={() => handleTierChange("BASIC")}
                        className={`cursor-pointer ultra-glass rounded-[2rem] p-8 transition-all border-2 relative overflow-hidden group ${listingType === "BASIC" ? "border-white/50 bg-black/40 shadow-xl" : "border-white/10 bg-black/20 hover:border-white/30"}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-black text-2xl tracking-wide text-white">BASIC LISTING</h3>
                            {listingType === "BASIC" && <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />}
                        </div>
                        <p className="text-muted-foreground font-medium mb-8">A simple dictionary listing to get your event on the map for free.</p>
                        <ul className="space-y-4 font-semibold text-gray-300">
                            <li className="flex items-center gap-3"><span className="text-white">✓</span> Core Event Details</li>
                            <li className="flex items-center gap-3 text-primary font-bold"><span className="text-primary text-xl">✕</span> 150-Character Description Limit</li>
                            <li className="flex items-center gap-3 text-muted-foreground line-through"><span className="text-muted-foreground text-xl">✕</span> No Flyer Upload</li>
                            <li className="flex items-center gap-3 text-muted-foreground line-through"><span className="text-muted-foreground text-xl">✕</span> No External Links</li>
                        </ul>
                    </div>

                    <div
                        onClick={() => handleTierChange("PREMIUM")}
                        className={`cursor-pointer ultra-glass rounded-[2rem] p-8 transition-all border-2 relative overflow-hidden group ${listingType === "PREMIUM" ? "border-primary bg-primary/[0.05] shadow-[0_0_40px_-5px_rgba(239,68,68,0.3)]" : "border-primary/20 bg-primary/[0.02] hover:border-primary/50"}`}
                    >
                        {/* Premium Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="space-y-1">
                                <h3 className="font-black text-2xl tracking-wide text-white drop-shadow-md">PREMIUM ENTHUSIAST</h3>
                                <Badge variant="secondary" className="bg-primary text-white border-0 font-bold uppercase tracking-widest text-xs px-2 py-0.5 shadow-lg shadow-primary/20">Recommended</Badge>
                            </div>
                            {listingType === "PREMIUM" && <div className="h-4 w-4 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(239,68,68,0.8)] animate-pulse" />}
                        </div>
                        <p className="text-white/80 font-medium mb-6 relative z-10">Unlock maximum visibility, social sharing, and high-conversion ticket links.</p>
                        <ul className="space-y-4 font-semibold text-white relative z-10">
                            <li className="flex items-center gap-3 drop-shadow-sm"><span className="text-primary font-black text-xl">✓</span> Unlimited Rich Description</li>
                            <li className="flex items-center gap-3 drop-shadow-sm"><span className="text-primary font-black text-xl">✓</span> High-Res Flyer / Poster Upload</li>
                            <li className="flex items-center gap-3 drop-shadow-sm"><span className="text-primary font-black text-xl">✓</span> Registration & Social Links</li>
                            <li className="flex items-center gap-3 drop-shadow-sm"><span className="text-primary font-black text-xl">✓</span> Enhanced Map Visibility</li>
                        </ul>
                    </div>
                </div>

                {/* 1. Core Event Intelligence */}
                <div className="ultra-glass p-8 md:p-10 rounded-[2rem] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                    <h2 className="text-2xl font-black tracking-tight text-white border-b border-white/10 pb-4">1. Core Event Info</h2>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-bold text-gray-200">Event Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Annual Summer Car Show" className="h-14 text-lg bg-black/40 border-white/10 focus-visible:ring-primary rounded-xl" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-bold text-gray-200">Event Description</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Textarea 
                                            placeholder="Write a clear, compelling description for your event..." 
                                            className="min-h-[180px] resize-y bg-black/40 border-white/10 focus-visible:ring-primary text-base p-5 rounded-xl" 
                                            {...field} 
                                            value={field.value || ""} 
                                            maxLength={listingType === "BASIC" ? 150 : undefined}
                                        />
                                        {listingType === "BASIC" && (
                                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-primary/10 border border-primary/20 rounded-xl relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                                                <div className="flex flex-col z-10">
                                                    <span className={`text-sm font-black tracking-wide ${(field.value?.length ?? 0) >= 150 ? 'text-primary' : 'text-gray-300'}`}>
                                                        {field.value?.length ?? 0} / 150 CHARACTERS
                                                    </span>
                                                    {(field.value?.length ?? 0) >= 150 && (
                                                        <span className="text-xs text-primary/80 mt-1 uppercase font-bold tracking-wider">Storage Full. Upgrade Required.</span>
                                                    )}
                                                </div>
                                                {(field.value?.length ?? 0) >= 150 && (
                                                    <span 
                                                        className="z-10 text-sm font-black text-white bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl cursor-pointer transition-all shadow-[0_0_20px_-5px_rgba(239,68,68,0.8)] animate-pulse-glow" 
                                                        onClick={() => setListingType("PREMIUM")}
                                                    >
                                                        UNLOCK UNLIMITED TEXT
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {listingType === "PREMIUM" && (
                        <FormField
                            control={form.control}
                            name="posterUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-bold text-gray-200 flex items-center gap-3">
                                        Event Flyer / Poster 
                                        <Badge variant="secondary" className="bg-primary text-white border-0 font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 shadow-lg shadow-primary/20">Unlocked</Badge>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="bg-black/40 p-2 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                                            <SimpleImageUpload
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                disabled={loading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* 2. Logistics */}
                <div className="ultra-glass p-8 md:p-10 rounded-[2rem] border border-white/10 space-y-8 shadow-2xl">
                    <h2 className="text-2xl font-black tracking-tight text-white border-b border-white/10 pb-4">2. Dates & Location</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="startDateTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Start Date & Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value ? String(field.value) : ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDateTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">End Date & Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value ? String(field.value) : ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <FormField
                            control={form.control}
                            name="venueName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Venue Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City Park" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Address Line 1</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Springfield" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">State (2-letter)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="IL" maxLength={2} className="h-12 bg-black/40 border-white/10 rounded-xl uppercase" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Zip Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="62701" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {listingType === "PREMIUM" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* 3. Fees & Settings */}
                        <div className="ultra-glass p-8 md:p-10 rounded-[2rem] border border-primary/20 space-y-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <h2 className="text-2xl font-black tracking-tight text-white border-b border-primary/20 pb-4 flex items-center gap-3 relative z-10">
                                3. Fees & Analytics 
                                <Badge variant="secondary" className="bg-primary text-white border-0 font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 shadow-lg shadow-primary/20">Premium</Badge>
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-6 relative z-10">
                                <FormField
                                    control={form.control}
                                    name="entryFee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Entry Fee ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || 0} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="entryFeeMax"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Max Entry Fee ($) <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" placeholder="Max" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} onChange={e => field.onChange(e.target.value ? e.target.valueAsNumber : null)} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="spectatorFee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Spectator Fee ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || 0} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="spectatorFeeMax"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Max Spectator Fee ($) <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" placeholder="Max" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} onChange={e => field.onChange(e.target.value ? e.target.valueAsNumber : null)} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <FormField
                                    control={form.control}
                                    name="votingEnabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-2xl border border-white/10 p-5 bg-black/20 hover:bg-black/40 transition-colors">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                                            </FormControl>
                                            <div className="space-y-1.5 leading-none">
                                                <FormLabel className="text-white font-bold text-base">Enable Digital Voting</FormLabel>
                                                <FormDescription className="text-gray-400">Allow users to vote for their favorite cars directly on your listing.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isPreRelease"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-2xl border border-yellow-500/20 p-5 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 border-yellow-500/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black" />
                                            </FormControl>
                                            <div className="space-y-1.5 leading-none">
                                                <FormLabel className="text-yellow-500 font-bold text-base">Pre-Release ("Save The Date")</FormLabel>
                                                <FormDescription className="text-yellow-500/70">Mark this as a preliminary upload to build hype before tickets drop.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* 4. Marketing Links */}
                        <div className="ultra-glass p-8 md:p-10 rounded-[2rem] border border-primary/20 space-y-8 shadow-2xl relative overflow-hidden group">
                            <h2 className="text-2xl font-black tracking-tight text-white border-b border-primary/20 pb-4 flex items-center gap-3">
                                4. Marketing Links
                                <Badge variant="secondary" className="bg-primary text-white border-0 font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 shadow-lg shadow-primary/20">Premium</Badge>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="websiteUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Website URL <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." className="h-12 bg-black/40 border-white/10 rounded-xl focus-visible:ring-primary" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="facebookUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Facebook URL <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://facebook.com/events/..." className="h-12 bg-black/40 border-white/10 rounded-xl focus-visible:ring-primary" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="registrationUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-primary font-bold">Registration URL <span className="text-primary/60 font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." className="h-12 bg-primary/10 border-primary/30 text-primary placeholder:text-primary/40 focus-visible:ring-primary rounded-xl" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                <FormField
                                    control={form.control}
                                    name="contactEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Contact Email <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contact@example.com" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Contact Phone <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="(555) 123-4567" className="h-12 bg-black/40 border-white/10 rounded-xl" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full h-16 text-xl tracking-tight font-black uppercase shadow-[0_0_40px_-10px_rgba(239,68,68,0.8)] animate-pulse-glow transition-all hover:scale-[1.02]" 
                    size="lg"
                >
                    {loading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
                    SUBMIT EVENT
                </Button>
            </form>
        </Form>
    );
}

// Helper hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
