import { getAdminVendors } from "@/app/actions/vendor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { VendorStatusToggle } from "./vendor-status-toggle";
import { VendorTierSelect } from "./vendor-tier-select";

export default async function AdminVendorsPage() {
    const result = await getAdminVendors();

    if (!result.success || !result.data) {
        return <div className="text-white">Failed to load vendors</div>;
    }

    const vendors = result.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Vendor Management</h1>
                    <p className="text-muted-foreground">Monitor and verify vendor profiles.</p>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-400">Business Name</TableHead>
                            <TableHead className="text-gray-400">Owner</TableHead>
                            <TableHead className="text-gray-400">Category</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Tier</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No vendors found.
                                </TableCell>
                            </TableRow>
                        )}
                        {vendors.map((vendor: any) => (
                            <TableRow key={vendor.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white">
                                    <div className="flex flex-col">
                                        <span>{vendor.businessName}</span>
                                        <span className="text-xs text-muted-foreground">{vendor.slug}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-300">
                                    <div className="flex flex-col">
                                        <span>{vendor.user?.name || 'Unknown'}</span>
                                        <span className="text-xs text-muted-foreground">{vendor.user?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">
                                        {vendor.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={vendor.verifiedStatus === 'VERIFIED' ? 'default' : 'destructive'}
                                        className={vendor.verifiedStatus === 'VERIFIED' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}
                                    >
                                        {vendor.verifiedStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-300">
                                    <VendorTierSelect vendorId={vendor.id} currentTier={vendor.subscriptionTier} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/vendors/${vendor.slug}`} target="_blank">
                                                <span className="sr-only">View</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-4 w-4"
                                                >
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </Link>
                                        </Button>
                                        <VendorStatusToggle vendorId={vendor.id} currentStatus={vendor.verifiedStatus} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
