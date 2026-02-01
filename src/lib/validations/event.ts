import { z } from "zod";

export const eventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().optional().or(z.literal("")),
    startDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
    endDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
    venueName: z.string().min(2, "Venue name is required"),
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().length(2, "Use 2-letter state code"),
    zip: z.string().min(5, "Invalid ZIP code"),
    // Rain policy (String for SQLite)
    rainDatePolicy: z.enum(["NONE", "RAIN_OR_SHINE", "RAIN_DATE_SET", "TBD"]),
    rainDate: z.string().nullable().optional(),
    entryFee: z.number().min(0).default(0),
    entryFeeMax: z.number().min(0).optional().nullable(),
    spectatorFee: z.number().min(0).default(0),
    spectatorFeeMax: z.number().min(0).optional().nullable(),
    vehicleRequirements: z.string().nullable().optional().or(z.literal("")),
    // Event Type (String for SQLite)
    judgedOrCruiseIn: z.enum(["JUDGED", "CRUISE_IN", "BOTH"]),
    charityBeneficiary: z.string().nullable().optional().or(z.literal("")),
    contactEmail: z.string().email("Invalid contact email").nullable().optional().or(z.literal("")),
    contactPhone: z.string().nullable().optional().or(z.literal("")),
    // Relax URL validation to avoid blocking submission on minor format issues
    websiteUrl: z.string().nullable().optional().or(z.literal("")),
    facebookUrl: z.string().nullable().optional().or(z.literal("")),
    registrationUrl: z.string().nullable().optional().or(z.literal("")),
    posterUrl: z.string().optional().or(z.literal("")),
    votingEnabled: z.boolean().default(true),
    isPreRelease: z.boolean().default(false),
    source: z.string().default("USER"),
});

export type EventFormValues = z.infer<typeof eventSchema>;
