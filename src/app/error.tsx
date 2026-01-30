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
        <div className="flex flex-col items-center justify-center min-h-[60rem] p-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Application Error</h2>
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg mb-6 max-w-2xl overflow-auto text-left text-sm font-mono border border-destructive/20 shadow-lg">
                <p className="font-bold mb-2">{error.message}</p>
                <div className="opacity-75 whitespace-pre-wrap">{error.stack}</div>
            </div>
            <Button
                onClick={() => reset()}
                variant="outline"
            >
                Try again
            </Button>
        </div>
    )
}
