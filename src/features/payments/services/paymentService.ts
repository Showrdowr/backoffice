import { apiClient } from '@/services/api/client';
import type { Transaction, Coupon, PaymentReport } from '../types';

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
        try {
            // In production: const response = await apiClient.get<TransactionsData>('/payments/transactions');

            // Mock data
            return {
                transactions: [
                    { id: 'TXN001', user: 'สมชาย ใจดี', course: 'การดูแลผู้ป่วยโรคเรื้อรัง', category: 'วิทยาลัยเภสัชบำบัด', amount: 500, method: 'PromptPay', status: 'completed', date: '22 ธ.ค. 2024 10:30' },
                    { id: 'TXN002', user: 'สมหญิง รักเรียน', course: 'เภสัชกรรมคลินิกขั้นสูง', category: 'วิทยาลัยเภสัชบำบัด', amount: 800, method: 'Credit Card', status: 'completed', date: '22 ธ.ค. 2024 09:15' },
                    { id: 'TXN003', user: 'วิภา มานะ', course: 'กฎหมายเภสัชกรรม 2024', category: 'วิทยาลัยคุ้มครองผู้บริโภคด้านยาฯ', amount: 400, method: 'PromptPay', status: 'pending', date: '22 ธ.ค. 2024 08:45' },
                    { id: 'TXN004', user: 'ณัฐพล เก่งมาก', course: 'ทักษะการสื่อสารกับผู้ป่วย', category: 'วิทยาลัยเภสัชกรรมชุมชน', amount: 350, method: 'Credit Card', status: 'failed', date: '21 ธ.ค. 2024 16:20' },
                    { id: 'TXN005', user: 'ปิยะ รักดี', course: 'เภสัชกรรมชุมชนยุคใหม่', category: 'วิทยาลัยเภสัชกรรมชุมชน', amount: 600, method: 'PromptPay', status: 'completed', date: '21 ธ.ค. 2024 14:00' },
                ],
                stats: {
                    todayRevenue: 12500,
                    monthlyRevenue: 385500,
                    yearlyRevenue: 4759500,
                    todayTransactions: 28,
                    pendingTransactions: 5,
                },
            };
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            throw error;
        }
    },

    /**
     * Fetch monthly revenue data
     */
    async getMonthlyRevenue(year: string): Promise<MonthlyRevenue[]> {
        try {
            // Mock data
            return [
                { month: 'ม.ค.', revenue: 245000 },
                { month: 'ก.พ.', revenue: 312000 },
                { month: 'มี.ค.', revenue: 298000 },
                { month: 'เม.ย.', revenue: 356000 },
                { month: 'พ.ค.', revenue: 421000 },
                { month: 'มิ.ย.', revenue: 389000 },
                { month: 'ก.ค.', revenue: 445000 },
                { month: 'ส.ค.', revenue: 412000 },
                { month: 'ก.ย.', revenue: 478000 },
                { month: 'ต.ค.', revenue: 523000 },
                { month: 'พ.ย.', revenue: 495000 },
                { month: 'ธ.ค.', revenue: 385500 },
            ];
        } catch (error) {
            console.error('Failed to fetch monthly revenue:', error);
            throw error;
        }
    },

    /**
     * Fetch category sales data
     */
    async getCategorySales(): Promise<CategorySales[]> {
        try {
            return [
                { name: 'วิทยาลัยเภสัชบำบัด', sales: 1850000, courses: 12, color: 'bg-blue-500', percentage: 28 },
                { name: 'วิทยาลัยคุ้มครองผู้บริโภคด้านยาฯ', sales: 980000, courses: 8, color: 'bg-emerald-500', percentage: 15 },
                { name: 'วิทยาลัยเภสัชกรรมสมุนไพร', sales: 756000, courses: 6, color: 'bg-violet-500', percentage: 12 },
                { name: 'วิทยาลัยเภสัชกรรมอุตสาหการ', sales: 645000, courses: 5, color: 'bg-amber-500', percentage: 10 },
                { name: 'วิทยาลัยเภสัชกรรมชุมชน', sales: 820000, courses: 7, color: 'bg-rose-500', percentage: 13 },
                { name: 'วิทยาลัยการบริหารเภสัชกิจ', sales: 520000, courses: 4, color: 'bg-cyan-500', percentage: 8 },
                { name: 'วิทยาลัยเภสัชพันธุศาสตร์ฯ', sales: 380000, courses: 3, color: 'bg-pink-500', percentage: 6 },
                { name: 'อื่นๆ', sales: 380500, courses: 5, color: 'bg-slate-400', percentage: 8 },
            ];
        } catch (error) {
            console.error('Failed to fetch category sales:', error);
            throw error;
        }
    },

    /**
     * Fetch coupons data
     */
    async getCoupons(): Promise<CouponsData> {
        try {
            const coupons: CouponDisplay[] = [
                { id: 1, code: 'NEWYEAR2025', discount: 30, type: 'percent', usage: 156, limit: 500, status: 'active', expires: '31 ธ.ค. 2024' },
                { id: 2, code: 'WELCOME50', discount: 50, type: 'fixed', usage: 892, limit: 1000, status: 'active', expires: '31 ม.ค. 2025' },
                { id: 3, code: 'PHARMACY20', discount: 20, type: 'percent', usage: 234, limit: 300, status: 'active', expires: '28 ก.พ. 2025' },
                { id: 4, code: 'SUMMER2024', discount: 25, type: 'percent', usage: 500, limit: 500, status: 'expired', expires: '31 ส.ค. 2024' },
            ];

            return {
                coupons,
                stats: {
                    total: coupons.length,
                    active: coupons.filter(c => c.status === 'active').length,
                    usedThisMonth: 1234,
                    totalDiscount: 45600,
                },
            };
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
            throw error;
        }
    },

    /**
     * Delete a coupon
     */
    async deleteCoupon(id: number): Promise<void> {
        try {
            // In production: await apiClient.delete(`/payments/coupons/${id}`);
            console.log('Delete coupon:', id);
        } catch (error) {
            console.error('Failed to delete coupon:', error);
            throw error;
        }
    },

    /**
     * Fetch financial reports
     */
    async getReports(): Promise<ReportsData> {
        try {
            return {
                stats: {
                    yearlyRevenue: 3850000,
                    yearlyRevenueChange: 15.3,
                    monthlyRevenue: 385500,
                    monthlyRevenueChange: 8.7,
                    totalCustomers: 12845,
                    avgRevenuePerCourse: 2450,
                },
                monthlyData: [
                    { month: 'ม.ค.', revenue: 285000, expenses: 45000 },
                    { month: 'ก.พ.', revenue: 312000, expenses: 52000 },
                    { month: 'มี.ค.', revenue: 298000, expenses: 48000 },
                    { month: 'เม.ย.', revenue: 345000, expenses: 55000 },
                    { month: 'พ.ค.', revenue: 378000, expenses: 62000 },
                    { month: 'มิ.ย.', revenue: 356000, expenses: 58000 },
                ],
                topCourses: [
                    { name: 'การดูแลผู้ป่วยโรคเรื้อรัง', revenue: 622500, enrollments: 1245 },
                    { name: 'เภสัชกรรมคลินิกขั้นสูง', revenue: 493500, enrollments: 987 },
                    { name: 'กฎหมายเภสัชกรรม 2024', revenue: 342400, enrollments: 856 },
                    { name: 'ทักษะการสื่อสารกับผู้ป่วย', revenue: 261600, enrollments: 654 },
                ],
            };
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            throw error;
        }
    },
};
