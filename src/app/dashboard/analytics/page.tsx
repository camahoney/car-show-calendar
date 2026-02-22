import { getOrganizerStats } from "@/app/actions/analytics";
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { EventDetailsTable } from "@/components/dashboard/event-details-table";

export default async function AnalyticsPage() {
    const stats = await getOrganizerStats();

    if (!stats.success || !stats.data) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Failed to load analytics. Please try again later.
            </div>
        );
    }

    const {
        totalViews, totalClicks, totalSaves, totalVotes,
        conversionRate, eventCount, eventPerformance, eventDetails,
        statusBreakdown, tierBreakdown
    } = stats.data;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Performance across {eventCount} event{eventCount !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <AnalyticsSummary
                views={totalViews}
                clicks={totalClicks}
                saves={totalSaves}
                votes={totalVotes}
            />

            <AnalyticsCharts
                data={eventPerformance}
                statusBreakdown={statusBreakdown}
                tierBreakdown={tierBreakdown}
                conversionRate={conversionRate}
                eventCount={eventCount}
            />

            <EventDetailsTable events={eventDetails} />
        </div>
    );
}
