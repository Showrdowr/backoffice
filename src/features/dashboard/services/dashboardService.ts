import { apiClient } from '@/services/api/client';
import type { DashboardData } from '../types';
import { parseDbDate } from '@/utils/date';

export const dashboardService = {
    /**
     * Fetch dashboard data including stats, recent enrollments, and top courses
     */
    async getDashboardData(): Promise<DashboardData> {
        try {
            const response = await apiClient.get<DashboardData>('/dashboard');
            return {
                ...response.data,
                recentEnrollments: response.data.recentEnrollments.map((enrollment) => ({
                    ...enrollment,
                    enrolledAt: parseDbDate(enrollment.enrolledAt),
                })),
            };
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            throw error;
        }
    },
};
