import { AdminSidebar } from "@/components/admin/sidebar";
// import { checkAdmin } from "@/lib/auth"; // TODO: Implement admin check
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/signin");

    // Minimal role check - Enforce strict ADMIN role in DB
    // Type casting because NextAuth user type might be loose in this context
    const userRole = (user as any).role;
    if (userRole !== 'ADMIN') redirect('/dashboard');

    return (
        <div className="min-h-screen bg-background/95">
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background z-0" />
            <AdminSidebar />
            <div className="lg:pl-64 pt-6 relative z-10 transition-all duration-300">
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
