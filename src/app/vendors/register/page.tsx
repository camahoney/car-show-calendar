"use client";

import { useTransition } from "react";
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
            const result = await registerVendor(data);

            if (result.success) {
                toast.success("Vendor profile created successfully!");
                router.push("/vendors");
            } else {
                toast.error(result.error || "Failed to create profile");
            }
        });
    }

    return (
        <div className="container max-w-2xl py-20 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Join the Vendor Directory</h1>
                <p className="text-muted-foreground mt-2">
                    Showcase your automotive business to thousands of enthusiasts.
                </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/5">
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

                        <Button type="submit" disabled={isPending} className="w-full" size="lg">
                            {isPending ? "Creating..." : "Create Vendor Profile"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
