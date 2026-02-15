"use server";

import { geocodeAddress } from "@/lib/geocoding";

export async function lookupZip(city: string, state: string, address?: string): Promise<string | null> {
    try {
        // Prioritize address if available for better accuracy
        const result = await geocodeAddress({
            city,
            state,
            street: address,
        });

        if (result && result.zip) {
            return result.zip;
        }

        // If no zip found with address, try just city/state (broader search)
        if (address && !result.zip) {
            const broadResult = await geocodeAddress({
                city,
                state
            });
            if (broadResult && broadResult.zip) {
                return broadResult.zip;
            }
        }

        return null;
    } catch (e) {
        console.error("ZIP Lookup Failed:", e);
        return null;
    }
}
