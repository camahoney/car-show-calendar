import { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
    title: "About Us | Car Show Calendar",
    description: "Learn about our mission to connect the automotive community through the world's best car show discovery platform.",
};

export default function AboutPage() {
    return <AboutContent />;
}
