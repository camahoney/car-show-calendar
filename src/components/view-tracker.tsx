"use client";

import { useEffect } from "react";

export function ViewTracker({ eventId }: { eventId: string }) {
    useEffect(() => {
        // Increment view count on mount (API route handles bot/admin filtering)
        fetch("/api/analytics/view", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventId }),
        }).catch(err => console.error("Failed to track view:", err));
    }, [eventId]);

    return null;
}
