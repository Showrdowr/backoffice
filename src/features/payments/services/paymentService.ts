import { apiClient } from '@/services/api/client';

// Extended types for the service
export interface TransactionsData {
    transactions: TransactionDisplay[];
    stats: TransactionStats;
}

export interface TransactionDisplay {
    id: string;
    user: string;
    course: string;
    category: string;
    amount: number;
    method: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
}

export interface TransactionStats {
    todayRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    todayTransactions: number;
    pendingTransactions: number;
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export interface CategorySales {
    name: string;
    sales: number;
    courses: number;
    color: string;
    percentage: number;
}

export interface CouponsData {
    coupons: CouponDisplay[];
    stats: CouponStats;
}

export interface CouponDisplay {
    id: number;
    code: string;
    discount: number;
    type: 'percent' | 'fixed';
    usage: number;
    limit: number;
    status: 'active' | 'expired';
    expires: string;
}

export interface CouponStats {
    total: number;
    active: number;
    usedThisMonth: number;
    totalDiscount: number;
}

export interface ReportsData {
    stats: ReportStats;
    monthlyData: MonthlyReportData[];
    topCourses: TopCourseRevenue[];
}

export interface ReportStats {
    yearlyRevenue: number;
    yearlyRevenueChange: number;
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    totalCustomers: number;
    avgRevenuePerCourse: number;
}

export interface MonthlyReportData {
    month: string;
    revenue: number;
    expenses: number;
}

export interface TopCourseRevenue {
    name: string;
    revenue: number;
    enrollments: number;
}

export const paymentService = {
    /**
     * Fetch transactions with stats
     */
    async getTransactions(): Promise<TransactionsData> {
        const response = await apiClient.get<TransactionsData>('/admin/transactions');
        return response.data;
    },

    /**
     * Fetch single transaction detail
     */
    async getTransactionById(id: string): Promise<TransactionDisplay> {
        const response = await apiClient.get<TransactionDisplay>(`/admin/transactions/${id}`);
        return response.data;
    },

    /**
     * Fetch monthly revenue data
     */
    async getMonthlyRevenue(year: string): Promise<MonthlyRevenue[]> {
        const response = await apiClient.get<MonthlyRevenue[]>(`/admin/reports/monthly-revenue?year=${year}`);
        return response.data;
    },

    /**
     * Fetch category sales data
     */
    async getCategorySales(): Promise<CategorySales[]> {
        const response = await apiClient.get<CategorySales[]>('/admin/reports/category-sales');
        return response.data;
    },

    /**
     * Fetch coupons data
     */
    async getCoupons(): Promise<CouponsData> {
        const response = await apiClient.get<CouponsData>('/admin/vouchers');
        return response.data;
    },

    /**
     * Fetch single coupon by ID
     */
    async getCouponById(id: number): Promise<CouponDisplay> {
        const response = await apiClient.get<CouponDisplay>(`/admin/vouchers/${id}`);
        return response.data;
    },

    /**
     * Update a coupon
     */
    async updateCoupon(id: number, data: Partial<CouponDisplay>): Promise<CouponDisplay> {
        const response = await apiClient.put<CouponDisplay>(`/admin/vouchers/${id}`, data);
        return response.data;
    },

    /**
     * Delete a coupon
     */
    async deleteCoupon(id: number): Promise<void> {
        await apiClient.delete(`/admin/vouchers/${id}`);
    },

    /**
     * Fetch financial reports
     */
    async getReports(): Promise<ReportsData> {
        const response = await apiClient.get<ReportsData>('/admin/reports/financial');
        return response.data;
    },
};
