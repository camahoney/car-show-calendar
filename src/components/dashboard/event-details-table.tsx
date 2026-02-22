"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Eye, MousePointerClick, Heart, ThumbsUp, TrendingUp, ExternalLink } from "lucide-react";

interface EventDetail {
    id: string;
    title: string;
    slug: string | null;
    views: number;
    clicks: number;
    saves: number;
    votes: number;
    status: string | null;
    tier: string | null;
    conversionRate: number;
    startDate: string;
    location: string;
}

interface EventDetailsTableProps {
    events: EventDetail[];
}

const STATUS_STYLES: Record<string, string> = {
    APPROVED: "bg-green-500/15 text-green-400 border-green-500/30",
    DRAFT: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    EXPIRED: "bg-red-500/15 text-red-400 border-red-500/30",
    REJECTED: "bg-red-500/15 text-red-400 border-red-500/30",
};

const TIER_BADGE: Record<string, string> = {
    STANDARD: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    FEATURED: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

function StatPill({ icon: Icon, value, className }: { icon: any; value: number; className?: string }) {
    return (
        <div className={`flex items-center gap-1.5 text-xs ${className}`}>
            <Icon className="h-3 w-3" />
            <span className="font-medium">{value.toLocaleString()}</span>
        </div>
    );
}

export function EventDetailsTable({ events }: EventDetailsTableProps) {
    if (events.length === 0) {
        return (
            <Card className="glass border-white/10">
                <CardContent className="py-12 text-center text-muted-foreground">
                    No events yet. Create your first event to start tracking performance.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass border-white/10">
            <CardHeader>
                <CardTitle>All Events Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-xs text-muted-foreground">
                                <th className="text-left py-3 px-4 font-medium">Event</th>
                                <th className="text-center py-3 px-2 font-medium">
                                    <div className="flex items-center justify-center gap-1"><Eye className="h-3 w-3" /> Views</div>
                                </th>
                                <th className="text-center py-3 px-2 font-medium">
                                    <div className="flex items-center justify-center gap-1"><MousePointerClick className="h-3 w-3" /> Clicks</div>
                                </th>
                                <th className="text-center py-3 px-2 font-medium">
                                    <div className="flex items-center justify-center gap-1"><Heart className="h-3 w-3" /> Saves</div>
                                </th>
                                <th className="text-center py-3 px-2 font-medium">
                                    <div className="flex items-center justify-center gap-1"><ThumbsUp className="h-3 w-3" /> Votes</div>
                                </th>
                                <th className="text-center py-3 px-2 font-medium">
                                    <div className="flex items-center justify-center gap-1"><TrendingUp className="h-3 w-3" /> CTR</div>
                                </th>
                                <th className="text-center py-3 px-2 font-medium">Status</th>
                                <th className="text-center py-3 px-2 font-medium hidden md:table-cell">Tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, i) => {
                                const maxViews = events[0]?.views || 1;
                                const barWidth = (event.views / maxViews) * 100;

                                return (
                                    <tr
                                        key={event.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="py-3 px-4 max-w-[250px]">
                                            <div className="relative">
                                                {/* Background bar for visual comparison */}
                                                <div
                                                    className="absolute inset-y-0 left-0 bg-primary/5 rounded"
                                                    style={{ width: `${barWidth}%` }}
                                                />
                                                <div className="relative">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground font-mono w-5">{i + 1}</span>
                                                        {event.slug ? (
                                                            <Link
                                                                href={`/events/${event.slug}`}
                                                                className="text-sm font-medium text-white hover:text-primary transition-colors truncate"
                                                            >
                                                                {event.title}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm font-medium text-white truncate">{event.title}</span>
                                                        )}
                                                        {event.slug && (
                                                            <Link href={`/events/${event.slug}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5 pl-7">
                                                        {event.location} · {new Date(event.startDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <span className="text-sm font-semibold text-white">{event.views.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <span className="text-sm text-blue-400 font-medium">{event.clicks.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <span className="text-sm text-pink-400 font-medium">{event.saves.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <span className="text-sm text-green-400 font-medium">{event.votes.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <span className={`text-sm font-medium ${event.conversionRate > 5 ? "text-green-400" : event.conversionRate > 2 ? "text-yellow-400" : "text-muted-foreground"}`}>
                                                {event.conversionRate.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[event.status || "DRAFT"] || STATUS_STYLES.DRAFT}`}>
                                                {event.status || "DRAFT"}
                                            </span>
                                        </td>
                                        <td className="text-center py-3 px-2 hidden md:table-cell">
                                            {event.tier && event.tier !== "FREE_BASIC" ? (
                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${TIER_BADGE[event.tier] || ""}`}>
                                                    {event.tier === "STANDARD" ? "Standard" : event.tier === "FEATURED" ? "Featured" : event.tier}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">Free</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
