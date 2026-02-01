
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-700">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">Contact Us</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Have a question about an event? Need help with your listing? Send us a message and we'll help you out.
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <ContactForm />
            </div>
        </div>
    )
}
