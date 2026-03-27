import { Metadata } from "next";
import PartnershipsContent from "./partnerships-content";

export const metadata: Metadata = {
    title: "Partnerships | AutoShowList",
    description: "Partner with AutoShowList — the premier car show discovery platform. Sponsorship, venue, and event promoter opportunities.",
    openGraph: {
        title: "Partner with AutoShowList",
        description: "Sponsorship, venue, and event promoter opportunities for automotive brands.",
        type: "website",
    },
};

export default function PartnershipsPage() {
    return <PartnershipsContent />;
}
