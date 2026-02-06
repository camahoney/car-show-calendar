"use client";

import dynamic from "next/dynamic";

const OverviewCharts = dynamic(() => import("./OverviewCharts").then(mod => mod.OverviewCharts), {
    ssr: false,
    loading: () => <div className="col-span-4 h-[350px] animate-pulse rounded-xl bg-white/5" />
});

export function ChartsWrapper({ data }: { data: any[] }) {
    return <OverviewCharts data={data} />;
}
