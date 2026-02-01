import Link from "next/link";
// import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-invert max-w-none text-gray-300 space-y-8 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>
                        Welcome to Car Show Calendar ("we," "our," or "us"). By accessing or using our website, services, and mobile application (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services.
                    </p>
                </section>

                <div className="my-8 h-px bg-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
                    <p>
                        Car Show Calendar provides a digital platform for automotive enthusiasts to discover events, for organizers to list upcoming car shows, and for vendors to promote their services. We function solely as a directory and facilitator of information; we do not organize, supervise, or control the events listed on our platform unless explicitly stated.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Registration:</strong> You may need to create an account to access certain features. You agree to provide accurate, current, and complete information during registration.</li>
                        <li><strong>Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                        <li><strong>Vendor & Organizer Accounts:</strong> Users registering as Organizers or Vendors may be subject to additional verification steps to ensure the legitimacy of the business or event.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. User-Generated Content</h2>
                    <p>
                        Our platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p className="mt-4">
                        By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Conduct</h2>
                    <p>You agree not to use the Services to:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Violate any applicable national or international law or regulation.</li>
                        <li>Exploit, harm, or attempt to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                        <li>Impersonate or attempt to impersonate Car Show Calendar, a Car Show Calendar employee, another user, or any other person or entity.</li>
                        <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm Car Show Calendar or users of the Service or expose them to liability.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Payments, Subscriptions, and Refunds</h2>
                    <p>
                        Certain aspects of the Service, such as "Vendor Pro" memberships, "Event Boosts," and "Featured Listings," may be provided for a fee.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Payment Processing:</strong> We use Stripe, Inc. as our third-party payment processor. By making a payment, you agree to comply with Stripe's Services Agreement.</li>
                        <li><strong>Subscriptions:</strong> Paid subscriptions (e.g., Vendor Pro) will automatically renew at the end of each billing cycle unless you cancel them through your account management page.</li>
                        <li><strong>No Refunds:</strong> Except as required by law or stated in our Refund Policy, all fees are non-refundable once the service has been rendered (e.g., the listing has been published).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
                    <p>
                        The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Car Show Calendar and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                    <p>
                        In no event shall Car Show Calendar, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:support@carshowcalendar.com" className="text-primary hover:underline">support@carshowcalendar.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
