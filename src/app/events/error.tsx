'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center p-4">
            <h2 className="text-xl font-bold text-red-500">Something went wrong loading events!</h2>
            <p className="text-muted-foreground">{error.message || "Failed to load events."}</p>
            {process.env.NODE_ENV !== 'production' && (
                <div className="text-left text-xs text-muted-foreground bg-muted p-4 rounded-lg max-w-2xl overflow-auto whitespace-pre-wrap">
                    {error.stack}
                </div>
            )}
            <Button
                onClick={() => reset()}
            >
                Try again
            </Button>
        </div>
    )
}
