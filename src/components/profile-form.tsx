"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z.string().max(300).optional(),
    imageUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    profile?: {
        bio?: string | null;
    } | null;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name || "",
            bio: profile?.bio || "",
            imageUrl: user.image || "",
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        setLoading(true);
        try {
            const result = await updateProfile({
                name: data.name,
                image: data.imageUrl,
                bio: data.bio
            });

            if (result.success) {
                toast.success("Profile updated", {
                    description: "Your settings have been saved successfully."
                });
                router.refresh();
            } else {
                toast.error("Error", {
                    description: "Failed to update profile. Please try again."
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                description: "Could not save your profile. Please try again later."
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                                {/* 
                  Using ImageUpload component which handles Cloudinary widget.
                  Pass onChange to update form state.
                */}
                                <ImageUpload
                                    value={field.value || ""}
                                    onChange={(url) => field.onChange(url)}
                                    // onRemove is not defined in ImageUploadProps, removing it
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormDescription>
                                This will be displayed on your profile and reviews.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" {...field} className="glass border-white/10" />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself (and your cars)"
                                    className="resize-none glass border-white/10 min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional: Shared on your public profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 font-bold">
                    {loading ? "Saving..." : "Update Profile"}
                </Button>
            </form>
        </Form>
    );
}
