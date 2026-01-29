import type { Event, Vote, EventSave } from "@prisma/client";

// Types with relations included
type EventWithStats = Event & {
    votes: Vote[];
    saves: EventSave[];
};

export function calculateEventScore(event: EventWithStats): number {
    const now = new Date().getTime();
    const eventTime = new Date(event.startDateTime).getTime();
    const createdTime = new Date(event.createdAt).getTime();

    // 1. Featured Boost (Highest priority)
    // If featured and not expired, give massive boost
    const isFeatured = event.tier === "FEATURED" && (!event.featuredUntil || new Date(event.featuredUntil).getTime() > now);
    const featuredScore = isFeatured ? 10000 : 0;

    // 2. Engagement Score
    // Votes worth 2 points, Saves worth 5 points
    const voteScore = event.votes.length * 2;
    const saveScore = event.saves.length * 5;

    // 3. Recency / Urgency Score
    // Events happening soon get a boost (Linear decay as date approaches? Or boost for "This Week"?)
    // Let's do: Closer events = higher score, but PAST events = negative score
    const hoursUntilStart = (eventTime - now) / (1000 * 60 * 60);

    let timeScore = 0;
    if (hoursUntilStart < 0) {
        // Past event: Push to bottom
        timeScore = -10000;
    } else if (hoursUntilStart < 24) {
        // Happening in < 24h: Super/Urgent
        timeScore = 500;
    } else if (hoursUntilStart < 168) {
        // Happening in < 7 days
        timeScore = 200;
    } else {
        // Far future: Decay slightly? No, just keep neutral.
        timeScore = 0;
    }

    // 4. Freshness
    // Newly created events get a small "New" bump for 48h
    const hoursSinceCreation = (now - createdTime) / (1000 * 60 * 60);
    const freshnessScore = hoursSinceCreation < 48 ? 100 : 0;

    return featuredScore + voteScore + saveScore + timeScore + freshnessScore;
}

export function sortEventsByScore(events: EventWithStats[]) {
    return events.sort((a, b) => calculateEventScore(b) - calculateEventScore(a));
}
