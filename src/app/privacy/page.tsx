import Link from "next/link";
// import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert max-w-none text-gray-300 space-y-8 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p>
                        Car Show Calendar ("us", "we", or "our") operates the Car Show Calendar website and mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                    </p>
                    <p className="mt-2">
                        We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </section>

                <div className="my-8 h-px bg-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Information Collection and Use</h2>
                    <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

                    <h3 className="text-xl font-semibold text-white mt-6 mb-2">Types of Data Collected</h3>

                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, and Business/Organization details.</li>
                        <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.</li>
                        <li><strong>Location Data:</strong> We may use and store information about your location if you give us permission to do so. We use this data to provide features of our Service, such as finding events near you.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Use of Data</h2>
                    <p>Car Show Calendar uses the collected data for various purposes:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>To provide and maintain the Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                        <li>To provide customer care and support</li>
                        <li>To provide analysis or valuable information so that we can improve the Service</li>
                        <li>To process payments and prevent fraud (via Stripe)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Service Providers</h2>

                    <h3 className="text-xl font-semibold text-white mt-4 mb-2">Payments</h3>
                    <p>
                        We provide paid products and/or services within the Service. In that case, we use third-party services for payment processing (e.g. payment processors). We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council.
                    </p>
                    <p className="mt-2">Our payment processor is <strong>Stripe</strong>. Their Privacy Policy can be viewed at <a href="https://stripe.com/us/privacy" target="_blank" rel="nofollow noopener noreferrer" className="text-primary hover:underline">https://stripe.com/us/privacy</a>.</p>

                    <h3 className="text-xl font-semibold text-white mt-4 mb-2">Analytics & Maps</h3>
                    <p>
                        We may use third-party Service Providers to monitor and analyze the use of our Service, such as Vercel Analytics. We also utilize mapping services (Mapbox/Google Maps) which may collect IP addresses to function.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                    <p>
                        The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Your Data Rights</h2>
                    <p>
                        Car Show Calendar aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us by email: <a href="mailto:support@autoshowlist.com" className="text-primary hover:underline">support@autoshowlist.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
