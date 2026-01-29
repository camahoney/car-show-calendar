export const dynamic = 'force-dynamic';

export default function DebugPage() {
    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold">Debug Route Works</h1>
            <p>If you can see this, the new deployment has successfully propagated.</p>
            <p>Timestamp: {new Date().toISOString()}</p>
        </div>
    );
}
