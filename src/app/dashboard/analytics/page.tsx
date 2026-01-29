import { getOrganizerStats } from "@/app/actions/analytics";
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default async function AnalyticsPage() {
    const stats = await getOrganizerStats();

    if (!stats.success || !stats.data) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Failed to load analytics. Please try again later.
            </div>
        );
    }

    const { totalViews, totalClicks, totalSaves, totalVotes, eventPerformance } = stats.data;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>

            <AnalyticsSummary
                views={totalViews}
                clicks={totalClicks}
                saves={totalSaves}
                votes={totalVotes}
            />

            <div className="grid gap-4 grid-cols-1">
                <AnalyticsCharts data={eventPerformance} />
            </div>
        </div>
    );
}
