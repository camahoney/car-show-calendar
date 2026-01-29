import { prisma } from "@/lib/prisma";
import { resolveReport } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";

export default async function AdminReportsPage() {
    const reports = await prisma.report.findMany({
        where: { status: "OPEN" },
        include: { reporter: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-white">Reports Queue</h1>
                <p className="text-muted-foreground">Review user reports and disputes.</p>
            </div>

            <div className="grid gap-4">
                {reports.length === 0 && (
                    <Card className="p-12 text-center border-dashed border-white/10">
                        <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold">No Open Reports</h3>
                        <p className="text-muted-foreground">System is clean.</p>
                    </Card>
                )}

                {reports.map(report => (
                    <Card key={report.id} className="p-6 border-red-500/20 bg-red-950/10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    <span className="font-bold text-red-400 uppercase">{report.reason}</span>
                                    <Badge variant="outline">{report.targetType}</Badge>
                                </div>
                                <p className="text-white">"{report.notes}"</p>
                                <p className="text-xs text-muted-foreground">Reported by: {report.reporter.email} on {report.createdAt.toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">Target ID: {report.targetId}</p>
                            </div>

                            <form action={resolveReport}>
                                <input type="hidden" name="reportId" value={report.id} />
                                <Button type="submit" variant="secondary">
                                    Mark Resolved
                                </Button>
                            </form>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
