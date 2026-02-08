
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DebugSessionPage() {
    const user = await getCurrentUser();
    const headersList = headers();

    return (
        <div className="p-8 space-y-4 text-white bg-black min-h-screen">
            <h1 className="text-2xl font-bold">Session Debugger</h1>
            <div className="border p-4 rounded bg-gray-900">
                <h2 className="text-xl font-semibold mb-2">User Object</h2>
                <pre className="whitespace-pre-wrap font-mono text-sm text-green-400">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>

            <div className="border p-4 rounded bg-gray-900">
                <h2 className="text-xl font-semibold mb-2">Role Check</h2>
                <p>Role: <span className="font-mono text-yellow-400">{user?.role || 'UNDEFINED'}</span></p>
                <p>Is Admin? <span className="font-mono text-yellow-400">{user?.role === 'ADMIN' ? 'YES' : 'NO'}</span></p>
            </div>

            <p className="text-gray-400 text-sm">
                If 'Role' is UNDEFINED, the session callback is not correctly populating the role from the database.
            </p>
        </div>
    );
}
