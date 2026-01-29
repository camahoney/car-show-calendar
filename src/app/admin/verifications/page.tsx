import { prisma } from "@/lib/prisma";
import { verifyOrganizer, verifyVendor } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Shield, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminVerificationsPage() {
    const pendingOrganizers = await prisma.organizerProfile.findMany({
        where: { verifiedStatus: "PENDING" }, // Need to ensure status logic matches app, might need to allow UNVERIFIED request
        include: { user: true }
    });

    // Also fetch "UNVERIFIED" but assume they requested verification? 
    // Actually our schema doesn't have a "Pending Verification" flag other than verifiedStatus.
    // Let's list PENDING.

    const pendingVendors = await prisma.vendor.findMany({
        where: { verifiedStatus: "PENDING" },
        include: { user: true }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-white">Verification Queue</h1>
                <p className="text-muted-foreground">Review Organizer and Vendor verification requests.</p>
            </div>

            <Tabs defaultValue="organizers">
                <TabsList>
                    <TabsTrigger value="organizers">Organizers ({pendingOrganizers.length})</TabsTrigger>
                    <TabsTrigger value="vendors">Vendors ({pendingVendors.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="organizers" className="space-y-4 mt-4">
                    {pendingOrganizers.length === 0 && (
                        <p className="text-muted-foreground">No pending organizer verifications.</p>
                    )}
                    {pendingOrganizers.map(org => (
                        <Card key={org.id} className="p-6 bg-card/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        {org.organizerName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">User: {org.user.email}</p>
                                    {org.website && (
                                        <Link href={org.website} target="_blank" className="text-sm text-blue-400 hover:underline">
                                            {org.website}
                                        </Link>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <form action={verifyOrganizer}>
                                        <input type="hidden" name="organizerId" value={org.id} />
                                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                            <Check className="h-4 w-4 mr-2" /> Verify
                                        </Button>
                                    </form>
                                    {/* Reject logic not implemented yet */}
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="vendors" className="space-y-4 mt-4">
                    {pendingVendors.length === 0 && (
                        <p className="text-muted-foreground">No pending vendor verifications.</p>
                    )}
                    {pendingVendors.map(vendor => (
                        <Card key={vendor.id} className="p-6 bg-card/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Store className="h-5 w-5 text-blue-400" />
                                        {vendor.businessName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">User: {vendor.user.email}</p>
                                    <Badge variant="secondary" className="mt-2">{vendor.category}</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <form action={verifyVendor}>
                                        <input type="hidden" name="vendorId" value={vendor.id} />
                                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                            <Check className="h-4 w-4 mr-2" /> Verify
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
