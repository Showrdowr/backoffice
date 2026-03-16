'use client';

import { useState, useEffect } from 'react';
import { dashboardService } from './services/dashboardService';
import type { DashboardData } from './types';

export function useDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setIsLoading(true);
                setError(null);
                const dashboardData = await dashboardService.getDashboardData();
                setData(dashboardData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load dashboard'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    return {
        data,
        isLoading,
        error,
        refresh: () => {
            setIsLoading(true);
            dashboardService.getDashboardData().then(setData).finally(() => setIsLoading(false));
        },
    };
}
