import { apiClient } from '@/services/api/client';
import type { CoursesData, CategoriesData, CourseStatus } from '../types';
import { VideoProvider } from '../../videos/types';

export const courseService = {
    /**
     * Fetch all courses with stats
     */
    async getCourses(): Promise<CoursesData> {
        try {
            const response = await apiClient.get<any[]>('/courses');
            const courses = response.data;
            
            // Calculate stats based on real data
            const stats = {
                total: courses.length,
                published: courses.filter((c: any) => c.status === 'PUBLISHED').length,
                draft: courses.filter((c: any) => c.status === 'DRAFT').length,
                totalRevenue: courses.reduce((acc: number, c: any) => acc + (Number(c.price) || 0), 0),
            };

            return {
                courses: courses.map((c: any) => ({
                    ...c,
                    price: Number(c.price) || 0,
                    category: c.category?.name || 'Uncategorized',
                    lessonsCount: c.lessons?.length || 0,
                })),
                stats
            };
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            throw error;
        }
    },

    /**
     * Get a single course by ID
     */
    async getCourse(id: number | string): Promise<any> {
        try {
            const response = await apiClient.get<any>(`/courses/${id}`);
            const course = response.data;
            
            return {
                ...course,
                price: Number(course.price) || 0,
            };
        } catch (error) {
            console.error('Failed to fetch course details:', error);
            throw error;
        }
    },

    /**
     * Get courses by category ID
     */
    async getCoursesByCategory(categoryId: string): Promise<any[]> {
        try {
            const response = await apiClient.get<any[]>(`/courses?categoryId=${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch courses by category:', error);
            throw error;
        }
    },

    /**
    * Fetch categories
    */
    async getCategories(): Promise<CategoriesData> {
        try {
            const response = await apiClient.get<any[]>('/categories');
            return {
                categories: response.data
            };
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    },

    /**
     * Delete a course
     */
    async deleteCourse(id: number): Promise<void> {
        try {
            await apiClient.delete(`/courses/${id}`);
        } catch (error) {
            console.error('Failed to delete course:', error);
            throw error;
        }
    },

    /**
     * Create a new course
     */
    async createCourse(data: any): Promise<any> {
        try {
            const response = await apiClient.post<{ data: any }>('/courses', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create course:', error);
            throw error;
        }
    },

    /**
     * Update an existing course
     */
    async updateCourse(id: number | string, data: any): Promise<any> {
        try {
            const response = await apiClient.put<{ data: any }>(`/courses/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update course:', error);
            throw error;
        }
    }
};
