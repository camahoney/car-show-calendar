export const dynamic = 'force-dynamic';

export default function DebugCanaryPage() {
    return (
        <div className="p-10 text-white bg-red-900">
            <h1 className="text-3xl font-bold">CANARY 2: ALIVE</h1>
            <p>Deployment ID: TRIGGER-FORCE-UPDATE</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
