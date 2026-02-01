import { getSystemSettings } from "@/app/actions/settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const settings = await getSystemSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">System Settings</h1>
                <p className="text-gray-400">Manage global pricing and system preferences.</p>
            </div>

            <SettingsForm initialData={settings} />
        </div>
    );
}
