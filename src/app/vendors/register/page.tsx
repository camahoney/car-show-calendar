"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerVendor } from "@/app/actions/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";

const vendorSchema = z.object({
    businessName: z.string().min(2, "Name must be at least 2 characters"),
    category: z.enum([
        "DETAILING",
        "PERFORMANCE",
        "MECHANIC",
        "PHOTOGRAPHY",
        "MERCHANDISE",
        "FOOD_DRINK",
        "OTHER"
    ]),
    description: z.string().min(20, "Please provide a longer description"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    website: z.string().url().optional().or(z.literal("")),
    logoUrl: z.string().optional(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

export default function VendorRegistrationPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [pricingTier, setPricingTier] = useState<"FREE" | "PRO">("PRO"); // Default to PRO as recommended

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            businessName: "",
            description: "",
            city: "",
            state: "",
            website: "",
        },
    });

    function onSubmit(data: VendorFormValues) {
        startTransition(async () => {
            const result = await registerVendor({
                ...data,
                subscriptionTier: pricingTier
            });

            if (result.success) {
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                } else {
                    toast.success("Vendor profile created successfully!");
                    router.push("/vendors");
                }
            } else {
                toast.error(result.error || "Failed to create profile");
            }
        });
    }

    return (
        <div className="container max-w-4xl py-20 px-4">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Join the Vendor Directory</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Showcase your automotive business to thousands of enthusiasts.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-3xl mx-auto">
                {/* Basic Card */}
                <div
                    onClick={() => setPricingTier("FREE")}
                    className={`cursor-pointer group relative p-8 rounded-2xl border-2 transition-all duration-300 ${pricingTier === "FREE" ? "border-white bg-white/5" : "border-white/10 hover:border-white/30 bg-black/40"}`}
                >
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">Vendor Basic</h3>
                        <div className="text-3xl font-bold text-white">$0</div>
                        <p className="text-sm text-muted-foreground mt-1">Claim your business profile.</p>
                    </div>

                    <ul className="space-y-3 text-sm text-gray-300 mb-8">
                        <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Basic Business Profile</li>
                        <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Listed in Vendor Directory</li>
                        <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Website Link</li>
                    </ul>

                    {pricingTier === "FREE" && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-white flex items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-black" />
                        </div>
                    )}
                </div>

                {/* Pro Card */}
                <div
                    onClick={() => setPricingTier("PRO")}
                    className={`cursor-pointer group relative p-8 rounded-2xl border-2 transition-all duration-300 ${pricingTier === "PRO" ? "border-blue-500 bg-blue-500/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]" : "border-white/10 hover:border-blue-500/30 bg-black/40"}`}
                >
                    <div className="absolute -top-3 right-8 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        RECOMMENDED
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">Vendor Pro</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">$99</span>
                            <span className="text-muted-foreground">/year</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Scale your automotive business.</p>
                    </div>

                    <ul className="space-y-3 text-sm text-gray-300 mb-8">
                        <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> <strong>Verified Blue Badge</strong></li>
                        <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Enhanced Profile (Logo, Gallery)</li>
                        <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Priority Search Visibility</li>
                        <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Attach Profile to Events</li>
                    </ul>

                    {pricingTier === "PRO" && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-white" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/5 max-w-3xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <FormField
                                    control={form.control}
                                    name="logoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Logo</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value || ""}
                                                    onChange={(url) => field.onChange(url)}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-center text-xs">
                                                Upload your business logo (Square ratio recommended)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="businessName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Business Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Apex Auto Detailing" {...field} className="bg-white/5 border-white/10 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="DETAILING">Detailing & Paint Protection</SelectItem>
                                                <SelectItem value="PERFORMANCE">Performance & Tuning</SelectItem>
                                                <SelectItem value="MECHANIC">Mechanic & Repair</SelectItem>
                                                <SelectItem value="PHOTOGRAPHY">Photography & Media</SelectItem>
                                                <SelectItem value="MERCHANDISE">Apparel & Merchandise</SelectItem>
                                                <SelectItem value="FOOD_DRINK">Food & Drink</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Austin" {...field} className="bg-white/5 border-white/10 text-white" />
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
                                            <FormLabel className="text-white">State</FormLabel>
                                            <FormControl>
                                                <Input placeholder="TX" {...field} className="bg-white/5 border-white/10 text-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about your services..."
                                                className="resize-none bg-white/5 border-white/10 text-white h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Website (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} className="bg-white/5 border-white/10 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isPending} className={`w-full text-lg h-12 font-bold ${pricingTier === "PRO" ? "bg-blue-600 hover:bg-blue-700" : ""}`} size="lg">
                            {isPending ? "Processing..." : (pricingTier === "PRO" ? "Continue to Payment ($99/year)" : "Create Free Profile")}
                        </Button>

                        {pricingTier === "PRO" && (
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                Secure payment via Stripe. You can cancel anytime.
                            </p>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}
