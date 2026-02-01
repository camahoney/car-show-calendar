"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { eventSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/image-upload";
import { createEvent, updateEvent } from "@/app/actions/event";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

type FormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
    initialData?: FormValues & { id?: string };
}

export function EventForm({ initialData }: EventFormProps) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";
    const [listingType, setListingType] = useState<"BASIC" | "STANDARD">("STANDARD");

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
        },
    });

    // Reset advanced fields if switching to BASIC
    const handleTierChange = (type: "BASIC" | "STANDARD") => {
        setListingType(type);
        if (type === "BASIC") {
            // Optional: clear fields or just hide them. Keeping data is safer if they switch back.
            // form.setValue("description", "");
            // form.setValue("posterUrl", "");
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

                {/* Tier Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div
                        onClick={() => handleTierChange("STANDARD")}
                        className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${listingType === "STANDARD" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">Standard Listing</h3>
                            {listingType === "STANDARD" && <div className="h-4 w-4 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Include Description, Poster, Social Links, and more.</p>
                        <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">✓ Full Event Details</li>
                            <li className="flex items-center gap-2">✓ Event Poster Upload</li>
                            <li className="flex items-center gap-2">✓ Social & Website Links</li>
                        </ul>
                    </div>

                    <div
                        onClick={() => handleTierChange("BASIC")}
                        className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${listingType === "BASIC" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">Basic Listing</h3>
                            {listingType === "BASIC" && <div className="h-4 w-4 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Simple listing for community visibility.</p>
                        <ul className="text-sm space-y-1 opacity-80">
                            <li className="flex items-center gap-2">✓ Title, Time, Location</li>
                            <li className="flex items-center gap-2 text-muted-foreground line-through">✕ No Description</li>
                            <li className="flex items-center gap-2 text-muted-foreground line-through">✕ No Poster</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Event Details</h2>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Annual Summer Car Show" {...field} value={field.value || ""} />
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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the event..." {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="posterUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Poster</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date & Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} value={field.value ? String(field.value) : ""} />
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
                                <FormLabel>End Date & Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} value={field.value ? String(field.value) : ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Location</h2>
                    <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Venue Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="City Park" {...field} value={field.value || ""} />
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
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main St" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Springfield" {...field} value={field.value || ""} />
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
                                    <FormLabel>State (2-letter)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="IL" maxLength={2} {...field} value={field.value || ""} />
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
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="62701" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Fees & Settings</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="entryFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entry Fee ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...field}
                                            onChange={e => field.onChange(e.target.valueAsNumber)}
                                            value={field.value || 0}
                                        />
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
                                    <FormLabel>Max Entry Fee ($) <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Max"
                                            {...field}
                                            onChange={e => field.onChange(e.target.value ? e.target.valueAsNumber : null)}
                                            value={field.value || ""}
                                        />
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
                                    <FormLabel>Spectator Fee ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...field}
                                            onChange={e => field.onChange(e.target.valueAsNumber)}
                                            value={field.value || 0}
                                        />
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
                                    <FormLabel>Max Spectator Fee ($) <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Max"
                                            {...field}
                                            onChange={e => field.onChange(e.target.value ? e.target.valueAsNumber : null)}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="votingEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Enable Voting
                                        </FormLabel>
                                        <FormDescription>
                                            Allow users to vote for their favorite cars.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPreRelease"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-yellow-500/10 border-yellow-500/20">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-yellow-500 font-bold">
                                            Pre-Release Upload ("Save The Date")
                                        </FormLabel>
                                        <FormDescription>
                                            Mark this as a preliminary upload (e.g. just a flyer).
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Additional Information</h2>
                    <FormField
                        control={form.control}
                        name="vehicleRequirements"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle Requirements <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Pre-1980 Rods & Customs" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="charityBeneficiary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Charity Beneficiary <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Local Food Bank" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="websiteUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website URL <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} value={field.value || ""} />
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
                                    <FormLabel>Facebook Event URL <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://facebook.com/events/..." {...field} value={field.value || ""} />
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
                                    <FormLabel>Registration URL <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Contact Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="contact@example.com" {...field} value={field.value || ""} />
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
                                    <FormLabel>Contact Phone <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="(555) 123-4567" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Event
                </Button>
            </form>
        </Form>
    );
}
