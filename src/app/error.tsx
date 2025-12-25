'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <svg
                    className="h-8 w-8 text-red-600 dark:text-red-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
            <p className="max-w-md text-muted-foreground">
                We apologize for the inconvenience. An unexpected error has occurred. You can try to recover by resetting the page.
            </p>
            <div className="flex gap-2">
                <Button onClick={() => reset()} variant="default">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline">
                    Go to Dashboard
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
                Error code: {error.digest || 'Unknown'}
            </p>
        </div>
    );
}
