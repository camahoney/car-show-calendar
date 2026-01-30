import { getCurrentUser } from "@/lib/auth";
import { getMyVendor } from "@/app/actions/vendor";
import { redirect } from "next/navigation";
import { ManageVendorForm } from "./manage-vendor-form";

export default async function ManageVendorPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/signin");
    }

    const vendor = await getMyVendor();

    if (!vendor) {
        redirect("/vendors/register");
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-24">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Manage Vendor Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Update your business details and contact information.
                    </p>
                </div>

                <ManageVendorForm initialData={vendor} />
            </div>
        </div>
    );
}
