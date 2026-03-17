import { apiClient } from '@/services/api/client';
import type { CoursesData, CategoriesData, CourseStatus, Category, Course } from '../types';

type ApiCategoryRef = {
    id?: number | string | null;
    name?: string | null;
};

type ApiCourseRaw = Partial<Course> & {
    id: number | string;
    categoryId?: number | string | null;
    category?: ApiCategoryRef | string | null;
    lessons?: unknown[] | null;
    lessonsCount?: number | null;
    price?: number | string | null;
    status?: string | null;
    [key: string]: unknown;
};

type ApiRecord = Record<string, unknown>;
type CourseResponse = Course & {
    details?: string;
    lessonsData?: Course['lessons'];
    data?: { id?: number | string };
};

export const courseService = {
    /**
     * Fetch all courses with stats
     */
    async getCourses(): Promise<CoursesData> {
        try {
            const response = await apiClient.get<ApiCourseRaw[]>('/courses');
            const courses = Array.isArray(response.data) ? response.data : [];
            const normalizedCourses: Course[] = courses.map((c) => {
                const normalizedStatus = String(c.status || 'DRAFT').toUpperCase() as CourseStatus;
                const categoryRef = typeof c.category === 'object' && c.category ? c.category : undefined;
                const resolvedCategoryId = c.categoryId ?? categoryRef?.id;
                const categoryName = categoryRef?.name || c.category;
                const authorName =
                    (typeof c.authorName === 'string' && c.authorName.trim()) ? c.authorName :
                        (typeof c['author_name'] === 'string' && c['author_name'].trim()) ? c['author_name'] as string :
                            (typeof c.instructor === 'string' && c.instructor.trim()) ? c.instructor :
                                '';

                return {
                    ...c,
                    title: c.title || '',
                    createdAt: c.createdAt || new Date().toISOString(),
                    categoryId: resolvedCategoryId ? Number(resolvedCategoryId) : undefined,
                    price: Number(c.price) || 0,
                    status: normalizedStatus,
                    category: categoryName || 'Uncategorized',
                    lessonsCount: c.lessonsCount || (Array.isArray(c.lessons) ? c.lessons.length : 0),
                    authorName,
                } as Course;
            });
            
            // Calculate stats based on real data
            const stats = {
                total: normalizedCourses.length,
                published: normalizedCourses.filter((c) => c.status === 'PUBLISHED').length,
                draft: normalizedCourses.filter((c) => c.status === 'DRAFT').length,
                totalRevenue: normalizedCourses.reduce((acc, c) => acc + (Number(c.price) || 0), 0),
            };

            return {
                courses: normalizedCourses,
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
    async getCourse(id: number | string): Promise<CourseResponse> {
        try {
            const response = await apiClient.get<ApiCourseRaw>(`/courses/${id}`);
            const course = response.data;
            const categoryRef = typeof course.category === 'object' && course.category ? course.category : undefined;
            const categoryName = categoryRef?.name || course.category;
            const authorName =
                (typeof course.authorName === 'string' && course.authorName.trim()) ? course.authorName :
                    (typeof course['author_name'] === 'string' && course['author_name'].trim()) ? course['author_name'] as string :
                        (typeof course.instructor === 'string' && course.instructor.trim()) ? course.instructor :
                            '';

            return {
                ...course,
                title: course.title || '',
                createdAt: course.createdAt || new Date().toISOString(),
                price: Number(course.price) || 0,
                status: String(course.status || 'DRAFT').toUpperCase() as CourseStatus,
                category: categoryName || 'Uncategorized',
                authorName,
            } as CourseResponse;
        } catch (error) {
            console.error('Failed to fetch course details:', error);
            throw error;
        }
    },

    /**
     * Get courses by category ID
     */
    async getCoursesByCategory(categoryId: string): Promise<Course[]> {
        try {
            const response = await apiClient.get<Course[]>(`/courses?categoryId=${categoryId}`);
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
            const response = await apiClient.get<Category[]>('/categories');
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
    async createCourse(data: ApiRecord): Promise<CourseResponse> {
        try {
            const response = await apiClient.post<CourseResponse>('/courses', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create course:', error);
            throw error;
        }
    },

    /**
     * Update an existing course
     */
    async updateCourse(id: number | string, data: ApiRecord): Promise<CourseResponse> {
        try {
            const response = await apiClient.put<CourseResponse>(`/courses/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update course:', error);
            throw error;
        }
    }
};
