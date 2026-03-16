// Payments Feature Hooks
'use client';

import { useState, useEffect } from 'react';
import { paymentService, type TransactionsData, type CouponsData, type MonthlyRevenue, type CategorySales, type ReportsData } from './services/paymentService';

export function useTransactions() {
    const [data, setData] = useState<TransactionsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                setIsLoading(true);
                setError(null);
                const transactionsData = await paymentService.getTransactions();
                setData(transactionsData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load transactions'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchTransactions();
    }, []);

    return {
        transactions: data?.transactions || [],
        stats: data?.stats,
        isLoading,
        error,
        refresh: () => {
            setIsLoading(true);
            paymentService.getTransactions().then(setData).finally(() => setIsLoading(false));
        },
    };
}

export function useMonthlyRevenue(year: string) {
    const [data, setData] = useState<MonthlyRevenue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);
                const revenueData = await paymentService.getMonthlyRevenue(year);
                setData(revenueData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load monthly revenue'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [year]);

    return { data, isLoading, error };
}

export function useCategorySales() {
    const [data, setData] = useState<CategorySales[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);
                const salesData = await paymentService.getCategorySales();
                setData(salesData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load category sales'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    return { data, isLoading, error };
}

export function useCoupons() {
    const [data, setData] = useState<CouponsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchCoupons() {
            try {
                setIsLoading(true);
                setError(null);
                const couponsData = await paymentService.getCoupons();
                setData(couponsData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load coupons'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchCoupons();
    }, []);

    const deleteCoupon = async (id: number) => {
        await paymentService.deleteCoupon(id);
        // Refresh data after deletion
        const couponsData = await paymentService.getCoupons();
        setData(couponsData);
    };

    return {
        coupons: data?.coupons || [],
        stats: data?.stats,
        isLoading,
        error,
        deleteCoupon,
        refresh: () => {
            setIsLoading(true);
            paymentService.getCoupons().then(setData).finally(() => setIsLoading(false));
        },
    };
}

export function usePaymentReports() {
    const [data, setData] = useState<ReportsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchReports() {
            try {
                setIsLoading(true);
                setError(null);
                const reportsData = await paymentService.getReports();
                setData(reportsData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load reports'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchReports();
    }, []);

    return {
        data,
        isLoading,
        error,
        refresh: () => {
            setIsLoading(true);
            paymentService.getReports().then(setData).finally(() => setIsLoading(false));
        },
    };
}
