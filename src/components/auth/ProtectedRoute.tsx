'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, hasRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!isLoading && isAuthenticated && allowedRoles && !hasRole(user, allowedRoles)) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && !hasRole(user, allowedRoles)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                    <p className="text-muted-foreground mt-2">You don&apos;t have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
