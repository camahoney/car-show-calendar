import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary";
import { StatusBadge } from "@/components/status-badge";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const eventCount = await prisma.event.count({
        where: {
            organizerId: user.id
        }
    });

    const recentEvents = await prisma.event.findMany({
        where: {
            organizerId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    });

    const events = await prisma.event.findMany({
        where: { organizerId: user.id },
        include: { votes: true, saves: true }
    });

    const stats = {
        views: events.reduce((acc, curr) => acc + (curr.views || 0), 0),
        clicks: events.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
        votes: events.reduce((acc, curr) => acc + curr.votes.length, 0),
        saves: events.reduce((acc, curr) => acc + curr.saves.length, 0),
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {user?.role === "ADMIN" && (
                        <Link href="/admin">
                            <Button variant="destructive">
                                Admin Panel
                            </Button>
                        </Link>
                    )}
                    <Link href="/events/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    </Link>
                </div>
            </div>

            <AnalyticsSummary {...stats} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentEvents.length === 0 && (
                                <div className="text-center text-sm text-muted-foreground py-10">
                                    No events found. Create your first event!
                                </div>
                            )}
                            {recentEvents.map(event => (
                                <div key={event.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.startDateTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        <StatusBadge status={event.status || 'DRAFT'} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
