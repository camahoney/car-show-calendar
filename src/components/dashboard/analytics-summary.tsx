"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointerClick, Heart, ThumbsUp } from "lucide-react";

interface AnalyticsSummaryProps {
    views: number;
    clicks: number;
    saves: number;
    votes: number;
}

export function AnalyticsSummary({ views, clicks, saves, votes }: AnalyticsSummaryProps) {
    const stats = [
        {
            title: "Total Views",
            value: views,
            icon: Eye,
            description: "Check how many people saw your events",
        },
        {
            title: "Link Clicks",
            value: clicks,
            icon: MousePointerClick,
            description: "Traffic sent to your websites",
        },
        {
            title: "Saves",
            value: saves,
            icon: Heart,
            description: "Users interested in your events",
        },
        {
            title: "Votes",
            value: votes,
            icon: ThumbsUp,
            description: "Community endorsement",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="glass border-white/10 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
