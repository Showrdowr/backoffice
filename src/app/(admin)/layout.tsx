'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from "@/components/layout";
import { useAuth } from "@/features/auth/auth-context";

export default function AdminGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!isLoading && isAuthenticated && !isAdmin) {
            // Guard routes for System Admins (who are not 'isAdmin')
            const adminOnlyPaths = ['/users', '/payments', '/cpe-credits', '/audit-logs', '/settings'];
            const isTryingToAccessAdminOnly = adminOnlyPaths.some(p => pathname?.startsWith(p));
            
            if (isTryingToAccessAdminOnly) {
                router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, isAdmin, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <AdminLayout>{children}</AdminLayout>;
}
