import { ApiError, apiClient } from '@/services/api/client';
import type { CoursesData, CategoriesData, CourseStatus, Category, Course } from '../types';
import type { Video } from '@/features/videos/types';
import { normalizeCourseAudience } from '../utils/audience';
import {
    buildCourseDeleteConflictMessage,
    canCourseBeHardDeleted,
    getCourseRecommendedAdminAction,
    normalizeCourseDeletionBlockers,
} from '../utils/deletion';

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
};

type CourseFilters = {
    categoryId?: string | number;
    search?: string;
    limit?: number;
};

function normalizeOptionalNumber(value: unknown, options?: { integer?: boolean }) {
    if (value === undefined) {
        return undefined;
    }

    if (value === null || value === '') {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return undefined;
    }

    return options?.integer ? Math.trunc(parsed) : parsed;
}

function normalizeCourseWritePayload(data: ApiRecord): ApiRecord {
    return {
        ...data,
        categoryId: normalizeOptionalNumber(data.categoryId, { integer: true }),
        subcategoryId: normalizeOptionalNumber(data.subcategoryId, { integer: true }),
        price: normalizeOptionalNumber(data.price) ?? 0,
        cpeCredits: normalizeOptionalNumber(data.cpeCredits) ?? 0,
        maxStudents: normalizeOptionalNumber(data.maxStudents, { integer: true }) ?? undefined,
        previewVideoId: normalizeOptionalNumber(data.previewVideoId, { integer: true }),
        relatedCourseIds: Array.isArray(data.relatedCourseIds)
            ? data.relatedCourseIds
                .map((id) => normalizeOptionalNumber(id, { integer: true }))
                .filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
            : data.relatedCourseIds,
    };
}

function normalizeVideo(raw: unknown): Video | undefined {
    if (!raw || typeof raw !== 'object') {
        return undefined;
    }

    const video = raw as Record<string, unknown>;
    if (typeof video.id !== 'number' && typeof video.id !== 'string') {
        return undefined;
    }

    return {
        id: Number(video.id),
        name: typeof video.name === 'string' ? video.name : null,
        provider: String(video.provider || 'VIMEO') as Video['provider'],
        resourceId: typeof video.resourceId === 'string' ? video.resourceId : '',
        duration: typeof video.duration === 'number' ? video.duration : Number(video.duration ?? 0) || 0,
        playbackUrl: typeof video.playbackUrl === 'string' ? video.playbackUrl : null,
        status: (String(video.status || 'PROCESSING').toUpperCase() as Video['status']) || 'PROCESSING',
        createdAt: typeof video.createdAt === 'string' ? video.createdAt : null,
        updatedAt: typeof video.updatedAt === 'string' ? video.updatedAt : null,
        usage: {
            previewCourseCount: Number((video.usage as Record<string, unknown> | undefined)?.previewCourseCount ?? 0),
            lessonUsageCount: Number((video.usage as Record<string, unknown> | undefined)?.lessonUsageCount ?? 0),
            totalUsageCount: Number((video.usage as Record<string, unknown> | undefined)?.totalUsageCount ?? 0),
        },
    };
}

function buildCoursesQuery(filters?: CourseFilters) {
    const params = new URLSearchParams();

    if (filters?.categoryId !== undefined && filters.categoryId !== null && String(filters.categoryId).trim()) {
        params.set('categoryId', String(filters.categoryId));
    }

    if (filters?.search?.trim()) {
        params.set('search', filters.search.trim());
    }

    if (filters?.limit && filters.limit > 0) {
        params.set('limit', String(filters.limit));
    }

    const query = params.toString();
    return query ? `/courses?${query}` : '/courses';
}

function normalizeCourseDeletionFields(raw: Partial<Course>) {
    const deletionBlockers = normalizeCourseDeletionBlockers(raw.deletionBlockers);
    const draftCourse = {
        ...raw,
        deletionBlockers,
        canHardDelete: typeof raw.canHardDelete === 'boolean' ? raw.canHardDelete : undefined,
        recommendedAdminAction: raw.recommendedAdminAction,
    } as Partial<Course>;

    return {
        deletionBlockers,
        canHardDelete: canCourseBeHardDeleted(draftCourse),
        recommendedAdminAction: getCourseRecommendedAdminAction(draftCourse),
    };
}

function normalizeCourseResponse(course: ApiCourseRaw): CourseResponse {
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
        cpeCredits: Number(course.cpeCredits ?? 0) || 0,
        maxStudents: course.maxStudents === null || course.maxStudents === undefined
            ? undefined
            : Number(course.maxStudents) || 0,
        previewVideoId: typeof course.previewVideoId === 'number' || typeof course.previewVideoId === 'string'
            ? Number(course.previewVideoId)
            : undefined,
        audience: normalizeCourseAudience(String(course.audience || 'all')),
        status: String(course.status || 'DRAFT').toUpperCase() as CourseStatus,
        category: categoryName || 'Uncategorized',
        enrolledCount: Number(course.enrolledCount ?? course.enrollmentsCount ?? 0),
        enrollmentsCount: Number(course.enrolledCount ?? course.enrollmentsCount ?? 0),
        relatedCourseIds: Array.isArray(course.relatedCourseIds)
            ? course.relatedCourseIds.map((id) => Number(id))
            : Array.isArray(course.relatedCourses)
                ? course.relatedCourses.map((related) => Number(related.id))
                : [],
        previewVideo: normalizeVideo(course.previewVideo),
        lessons: Array.isArray(course.lessons)
            ? course.lessons.map((lesson) => ({
                ...lesson,
                video: normalizeVideo((lesson as unknown as { video?: unknown }).video),
            }))
            : [],
        authorName,
        ...normalizeCourseDeletionFields(course),
    } as CourseResponse;
}

export const courseService = {
    /**
     * Fetch all courses with stats
     */
    async getCourses(filters?: CourseFilters): Promise<CoursesData> {
        try {
            const response = await apiClient.get<ApiCourseRaw[]>(buildCoursesQuery(filters));
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
                    cpeCredits: Number(c.cpeCredits ?? 0) || 0,
                    maxStudents: c.maxStudents === null || c.maxStudents === undefined
                        ? undefined
                        : Number(c.maxStudents) || 0,
                    audience: normalizeCourseAudience(String(c.audience || 'all')),
                    status: normalizedStatus,
                    category: categoryName || 'Uncategorized',
                    lessonsCount: c.lessonsCount || (Array.isArray(c.lessons) ? c.lessons.length : 0),
                    enrolledCount: Number(c.enrolledCount ?? c.enrollmentsCount ?? 0),
                    enrollmentsCount: Number(c.enrolledCount ?? c.enrollmentsCount ?? 0),
                    authorName,
                    ...normalizeCourseDeletionFields(c),
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
            return normalizeCourseResponse(response.data);
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
            const { courses } = await this.getCourses({ categoryId });
            return courses;
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
            if (error instanceof ApiError && error.code === 'COURSE_DELETE_CONFLICT') {
                const details = error.details && typeof error.details === 'object'
                    ? error.details as Record<string, unknown>
                    : {};
                const normalizedBlockers = normalizeCourseDeletionBlockers(details);

                throw new ApiError(buildCourseDeleteConflictMessage(normalizedBlockers), {
                    statusCode: error.statusCode,
                    code: error.code,
                    details: {
                        ...details,
                        deletionBlockers: normalizedBlockers,
                        canHardDelete: false,
                        recommendedAdminAction: 'archive',
                    },
                });
            }
            throw error;
        }
    },

    async archiveCourse(id: number): Promise<CourseResponse> {
        try {
            const response = await apiClient.put<ApiCourseRaw>(`/courses/${id}`, { status: 'ARCHIVED' });
            return normalizeCourseResponse(response.data);
        } catch (error) {
            console.error('Failed to archive course:', error);
            throw error;
        }
    },

    /**
     * Create a new course
     */
    async createCourse(data: ApiRecord): Promise<CourseResponse> {
        try {
            const response = await apiClient.post<CourseResponse>('/courses', normalizeCourseWritePayload(data));
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
            const response = await apiClient.put<CourseResponse>(`/courses/${id}`, normalizeCourseWritePayload(data));
            return response.data;
        } catch (error) {
            console.error('Failed to update course:', error);
            throw error;
        }
    }
};
