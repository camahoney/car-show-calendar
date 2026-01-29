"use client";

import dynamic from "next/dynamic";
import { Event } from "@prisma/client";

const MapView = dynamic(() => import("./map-view"), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted/10 animate-pulse rounded-2xl" />
});

export default MapView;
