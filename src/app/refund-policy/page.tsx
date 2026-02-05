import Link from "next/link";
// import { Separator } from "@/components/ui/separator";

export default function RefundPage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">Refund Policy</h1>
            <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert max-w-none text-gray-300 space-y-8 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Our Guarantee</h2>
                    <p>
                        At Car Show Calendar, we want to ensure that our platform provides value to both event organizers and vendors. We understand that sometimes things don't go as planned. This Refund Policy outlines when and how refunds may be issued.
                    </p>
                </section>

                <div className="my-8 h-px bg-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Digital Products and Services</h2>
                    <p>
                        Most of our paid services are digital and irrevocable once delivered. Therefore, we generally do not offer refunds for:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Featured Event Listings:</strong> Once an event has been featured on the homepage or search results for the agreed duration.</li>
                        <li><strong>Event Boosts:</strong> Once the boost has been applied and the event has received the additional visibility.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Vendor Pro Subscriptions</h2>
                    <p>
                        <strong>Cancellation:</strong> You may cancel your Vendor Pro subscription at any time via your account settings. If you cancel, your subscription will remain active until the end of the current billing period, and you will not be charged for the next cycle.
                    </p>
                    <p className="mt-2">
                        <strong>Refunds:</strong> We do not offer prorated refunds for partial billing periods. However, if you believe you were charged in error (e.g., after you cancelled), please contact us immediately.
                    </p>
                    <p className="mt-2 text-sm text-yellow-500/80 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                        Note: If you have just signed up and are unsatisfied with the Pro features, please contact us within 48 hours of your initial purchase for a discretionary full refund review.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Event Cancellations</h2>
                    <p>
                        Car Show Calendar is not responsible for the cancellation of events listed on our platform.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>If you are an Organizer:</strong> Fees paid to feature your event are for the advertising service we provided. If you cancel your event, we cannot refund the advertising fee as the service (exposure) was already delivered.</li>
                        <li><strong>If you are a Vendor:</strong> If you paid to Boost your appearance at an event that is subsequently cancelled by the organizer, please contact us. We may offer a credit to apply your Boost to a different event or issue a refund.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. How to Request a Refund</h2>
                    <p>
                        To request a refund or raise a billing dispute, please email us at <a href="mailto:support@autoshowlist.com" className="text-primary hover:underline">support@autoshowlist.com</a> with the subject line "Refund Request". Please include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Your account email address</li>
                        <li>Transaction ID or Date</li>
                        <li>Reason for the request</li>
                    </ul>
                    <p className="mt-4">
                        We aim to review and respond to all requests within 3 business days.
                    </p>
                </section>
            </div>
        </div>
    );
}
