import { ProfileForm } from "@/components/profile-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Settings | Dashboard",
    description: "Manage your account settings and profile.",
};

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/signin");
    }

    // Fetch bio/socials if they exist
    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-white">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your public profile and account details.
                    </p>
                </div>
                <div className="max-w-xl">
                    <ProfileForm user={user} profile={profile} />
                </div>
            </div>
        </div>
    );
}
