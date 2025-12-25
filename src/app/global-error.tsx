'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center font-sans">
                <div className="rounded-full bg-red-100 p-4">
                    <svg
                        className="h-8 w-8 text-red-600"
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
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Critical System Error</h2>
                <p className="max-w-md text-muted-foreground">
                    The application has encountered a critical error and cannot recover automatically.
                </p>
                <Button onClick={() => reset()} variant="default">
                    Restart Application
                </Button>
            </body>
        </html>
    );
}
