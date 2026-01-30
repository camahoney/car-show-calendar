"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateVendor } from "@/app/actions/vendor";
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
import { VendorCategory } from "@prisma/client";

const vendorSchema = z.object({
    businessName: z.string().min(2, "Name must be at least 2 characters"),
    category: z.nativeEnum(VendorCategory),
    description: z.string().min(20, "Please provide a longer description"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    website: z.string().url().optional().or(z.literal("")),
    instagram: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    logoUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface ManageVendorFormProps {
    initialData: any; // Type accurately if possible, but any works for now
}

export function ManageVendorForm({ initialData }: ManageVendorFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            businessName: initialData?.businessName || "",
            category: initialData?.category || "OTHER",
            description: initialData?.description || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            website: initialData?.website || "",
            instagram: initialData?.instagram || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            logoUrl: initialData?.logoUrl || "",
            bannerUrl: initialData?.bannerUrl || "",
        },
    });

    function onSubmit(data: VendorFormValues) {
        startTransition(async () => {
            const result = await updateVendor(data);

            if (result.success) {
                toast.success("Vendor profile updated successfully!");
                router.refresh();
                router.push(`/vendors/${result.data?.slug}`);
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Visual Assets */}
                <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Visual Identity</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Logo</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value || ""}
                                            onChange={(url) => field.onChange(url)}
                                        />
                                    </FormControl>
                                    <FormDescription>Square ratio recommended</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bannerUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Banner Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value || ""}
                                            onChange={(url) => field.onChange(url)}
                                        />
                                    </FormControl>
                                    <FormDescription>Wide landscape image (e.g. 1200x400)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Business Details</h3>

                    <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Business Name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-white/5 border-white/10 text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
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
                                            {Object.keys(VendorCategory).map((cat) => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">City</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-white/5 border-white/10 text-white" />
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
                                            <Input {...field} className="bg-white/5 border-white/10 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="resize-none bg-white/5 border-white/10 text-white h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Contact Info */}
                <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} className="bg-white/5 border-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Instagram</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@username" {...field} className="bg-white/5 border-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="contact@business.com" {...field} className="bg-white/5 border-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(555) 123-4567" {...field} className="bg-white/5 border-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
