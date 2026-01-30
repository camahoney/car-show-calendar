import { z } from "zod";

export const eventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters"),
    startDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
    endDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
    venueName: z.string().min(2, "Venue name is required"),
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().length(2, "Use 2-letter state code"),
    zip: z.string().min(5, "Invalid ZIP code"),
    // Rain policy (String for SQLite)
    rainDatePolicy: z.enum(["NONE", "RAIN_OR_SHINE", "RAIN_DATE_SET", "TBD"]),
    rainDate: z.string().optional().nullable(),
    entryFee: z.number().min(0).default(0),
    spectatorFee: z.number().min(0).default(0),
    vehicleRequirements: z.string().optional().or(z.literal("")),
    // Event Type (String for SQLite)
    judgedOrCruiseIn: z.enum(["JUDGED", "CRUISE_IN", "BOTH"]),
    charityBeneficiary: z.string().optional().or(z.literal("")),
    contactEmail: z.string().email("Invalid contact email").optional().or(z.literal("")),
    contactPhone: z.string().optional().or(z.literal("")),
    // Relax URL validation to avoid blocking submission on minor format issues
    websiteUrl: z.string().optional().or(z.literal("")),
    facebookUrl: z.string().optional().or(z.literal("")),
    registrationUrl: z.string().optional().or(z.literal("")),
    posterUrl: z.string().min(1, "Poster image is required"),
    votingEnabled: z.boolean().default(true),
    isPreRelease: z.boolean().default(false),
});

export type EventFormValues = z.infer<typeof eventSchema>;
