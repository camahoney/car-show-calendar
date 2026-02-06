import { prisma } from "@/lib/prisma";
import { Users, Calendar, ShieldAlert, TrendingUp } from "lucide-react";
import { getAdminDashboardStats, getRecentActivity } from "../actions/admin";
import { RecentActivityList } from "@/components/admin/RecentActivityList";
import dynamic from "next/dynamic";

const OverviewCharts = dynamic(() => import("@/components/admin/OverviewCharts").then(mod => mod.OverviewCharts), {
    ssr: false,
    loading: () => <div className="col-span-4 h-[350px] animate-pulse rounded-xl bg-white/5" />
});

export default async function AdminDashboardPage() {
    let recentActivity = { recentUsers: [], recentEvents: [] };
    let chartData = [];

    // Safely fetch extra data to prevent page crash
    try {
        const dashboardData = await Promise.all([
            getAdminDashboardStats(),
            getRecentActivity()
        ]);
        chartData = dashboardData[0];
        recentActivity = dashboardData[1];
    } catch (e) {
        console.error("Failed to fetch admin dashboard extended stats", e);
    }

    // Basic stats (Keep these required as they were working before)
    const [userCount, eventCount, reportCount, pendingEvents] = await Promise.all([
        prisma.user.count(),
        prisma.event.count(),
        prisma.report.count({ where: { status: "OPEN" } }),
        prisma.event.count({ where: { status: "PENDING_REVIEW" } }),
    ]);

    const stats = [
        {
            title: "Total Users",
            value: userCount,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Total Events",
            value: eventCount,
            icon: Calendar,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            title: "Pending Approval",
            value: pendingEvents,
            icon: ShieldAlert,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            href: "/admin/events/pending",
        },
        {
            title: "Reports",
            value: reportCount,
            icon: TrendingUp,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Commander. System overview online.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title}>
                        {stat.href ? (
                            <a href={stat.href} className="group relative block overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5">
                                <div className={`absolute right-4 top-4 rounded-xl p-2.5 ${stat.bg} ${stat.color} opacity-80 transition-opacity group-hover:opacity-100`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                            </a>
                        ) : (
                            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5">
                                <div className={`absolute right-4 top-4 rounded-xl p-2.5 ${stat.bg} ${stat.color} opacity-80 transition-opacity group-hover:opacity-100`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid gap-6">
                <OverviewCharts data={chartData} />
                <RecentActivityList users={recentActivity.recentUsers} events={recentActivity.recentEvents} />
            </div>
        </div>
    );
}
