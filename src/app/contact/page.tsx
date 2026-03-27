import { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
    title: "Contact Us | Car Show Calendar",
    description: "Send us a message. We're here to help organizers and enthusiasts alike.",
};

export default function ContactPage() {
    return <ContactContent />;
}
