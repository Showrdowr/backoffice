import { apiClient } from '@/services/api/client';
import type { DashboardData } from '../types';

export const dashboardService = {
    /**
     * Fetch dashboard data including stats, recent enrollments, and top courses
     */
    async getDashboardData(): Promise<DashboardData> {
        try {
            // In a real app, this would call the actual API
            // const response = await apiClient.get<DashboardData>('/dashboard');
            // return response.data;

            // Mock data for now
            return {
                stats: {
                    totalUsers: 12845,
                    totalCourses: 156,
                    monthlyRevenue: 385500,
                    cpeCreditsIssued: 8456,
                    usersChange: 12.5,
                    coursesChange: 8.3,
                    revenueChange: 15.2,
                    cpeCreditsChange: -5.4,
                },
                recentEnrollments: [
                    { id: '1', userName: 'สมชาย ใจดี', courseName: 'การดูแลผู้ป่วยโรคเรื้อรัง', enrolledAt: new Date(Date.now() - 5 * 60 * 1000) },
                    { id: '2', userName: 'สมหญิง รักเรียน', courseName: 'เภสัชกรรมคลินิกขั้นสูง', enrolledAt: new Date(Date.now() - 12 * 60 * 1000) },
                    { id: '3', userName: 'วิภา มานะ', courseName: 'กฎหมายเภสัชกรรม 2024', enrolledAt: new Date(Date.now() - 25 * 60 * 1000) },
                    { id: '4', userName: 'ณัฐพล เก่งมาก', courseName: 'ทักษะการสื่อสารกับผู้ป่วย', enrolledAt: new Date(Date.now() - 60 * 60 * 1000) },
                ],
                topCourses: [
                    { id: '1', name: 'การดูแลผู้ป่วยโรคเรื้อรัง', title: 'การดูแลผู้ป่วยโรคเรื้อรัง', enrollments: 1245, revenue: 622500 },
                    { id: '2', name: 'เภสัชกรรมคลินิกขั้นสูง', title: 'เภสัชกรรมคลินิกขั้นสูง', enrollments: 987, revenue: 493500 },
                    { id: '3', name: 'กฎหมายเภสัชกรรม 2024', title: 'กฎหมายเภสัชกรรม 2024', enrollments: 856, revenue: 342400 },
                    { id: '4', name: 'ทักษะการสื่อสารกับผู้ป่วย', title: 'ทักษะการสื่อสารกับผู้ป่วย', enrollments: 654, revenue: 261600 },
                ],
            };
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            throw error;
        }
    },
};
