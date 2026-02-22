"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell
} from "recharts";

interface AnalyticsChartsProps {
    data: {
        name: string;
        views: number;
        clicks: number;
        saves: number;
    }[];
    statusBreakdown: Record<string, number>;
    tierBreakdown: Record<string, number>;
    conversionRate: number;
    eventCount: number;
}

const STATUS_COLORS: Record<string, string> = {
    APPROVED: "#22c55e",
    DRAFT: "#6b7280",
    PENDING: "#f59e0b",
    EXPIRED: "#ef4444",
    REJECTED: "#dc2626",
};

const TIER_COLORS: Record<string, string> = {
    FREE_BASIC: "#6b7280",
    STANDARD: "#3b82f6",
    FEATURED: "#f59e0b",
};

const TIER_LABELS: Record<string, string> = {
    FREE_BASIC: "Free",
    STANDARD: "Standard",
    FEATURED: "Featured",
};

export function AnalyticsCharts({ data, statusBreakdown, tierBreakdown, conversionRate, eventCount }: AnalyticsChartsProps) {
    const statusData = Object.entries(statusBreakdown).map(([name, value]) => ({ name, value }));
    const tierData = Object.entries(tierBreakdown).map(([name, value]) => ({
        name: TIER_LABELS[name] || name,
        value,
        fill: TIER_COLORS[name] || "#8884d8"
    }));

    return (
        <div className="space-y-6">
            {/* Top Row — Insights */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Click-Through Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{conversionRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {conversionRate > 5 ? "🔥 Great engagement" : conversionRate > 2 ? "👍 Solid performance" : "💡 Add website links to boost clicks"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Event Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="h-[80px] w-[80px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={38}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry) => (
                                                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#888"} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-1">
                                {statusData.map(s => (
                                    <div key={s.name} className="flex items-center gap-2 text-xs">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] || "#888" }} />
                                        <span className="text-muted-foreground">{s.name}</span>
                                        <span className="text-white font-medium ml-auto">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Listing Tiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="h-[80px] w-[80px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={tierData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={38}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {tierData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-1">
                                {tierData.map(t => (
                                    <div key={t.name} className="flex items-center gap-2 text-xs">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.fill }} />
                                        <span className="text-muted-foreground">{t.name}</span>
                                        <span className="text-white font-medium ml-auto">{t.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bar Chart */}
            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>Top Events Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                            No event data yet. Views will appear here as visitors find your events.
                        </div>
                    ) : (
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={0}
                                        angle={-20}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="views" name="Views" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="clicks" name="Clicks" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="saves" name="Saves" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
