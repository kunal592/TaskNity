'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';

// Types matching backend response
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    team?: string;
    phone?: string;
    address?: string;
    joinedAt: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    team?: string;
    phone?: string;
}

interface AuthResponse {
    message: string;
    user: AuthUser;
    accessToken: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const userData = await apiClient.get<AuthUser>('/auth/me');
                    setUser(userData);
                } catch (error) {
                    // Token is invalid, clear it
                    localStorage.removeItem('accessToken');
                    console.error('Session validation failed:', error);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials, false);
            localStorage.setItem('accessToken', response.accessToken);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', data, false);
            localStorage.setItem('accessToken', response.accessToken);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const userData = await apiClient.get<AuthUser>('/auth/me');
            setUser(userData);
        } catch (error) {
            logout();
        }
    }, [logout]);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper to check role permissions
export function hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
    if (!user) return false;
    // OWNER has access to everything
    if (user.role === 'OWNER') return true;
    return allowedRoles.includes(user.role);
}
