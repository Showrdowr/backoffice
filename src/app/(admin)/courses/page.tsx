'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses, useCategories } from '@/features/courses/hooks';
import { CourseStatsCards } from '@/features/courses/components/CourseStatsCards';
import { CourseFilters } from '@/features/courses/components/CourseFilters';
import { CoursesTable } from '@/features/courses/components/CoursesTable';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
    getCourseArchiveSummary,
    getCourseDeletionSummary,
} from '@/features/courses/utils/deletion';

const PAGE_SIZE = 10;

export default function CoursesPage() {
    const router = useRouter();
    const { courses, stats, isLoading, error, deleteCourse, archiveCourse } = useCourses();
    const { categories } = useCategories();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
    const [page, setPage] = useState(1);

    const categoryOptions = useMemo(() => {
        const fromApi = categories.map((category) => ({
            id: String(category.id),
            name: category.name,
        }));

        if (fromApi.length > 0) return fromApi;

        const unique = new Map<string, { id: string; name: string }>();
        courses.forEach((course) => {
            const categoryName = typeof course.category === 'object' ? course.category?.name : course.category;
            const id = course.categoryId ? String(course.categoryId) : categoryName || 'uncategorized';
            const name = categoryName || 'Uncategorized';
            if (!unique.has(id)) {
                unique.set(id, { id, name });
            }
        });

        return Array.from(unique.values());
    }, [categories, courses]);

    const filteredCourses = useMemo(() => {
        const keyword = searchQuery.trim().toLowerCase();

        return courses.filter((course) => {
            const categoryName = typeof course.category === 'object' ? course.category?.name : course.category;
            const categoryIdFromCourse =
                course.categoryId ||
                (typeof course.category === 'object' ? course.category?.id : undefined);
            const courseStatus = String(course.status || 'DRAFT').toUpperCase();

            const searchableText = [
                course.title,
                course.description,
                course.authorName,
                categoryName,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const matchesSearch = !keyword || searchableText.includes(keyword);
            const matchesCategory =
                selectedCategory === 'ALL' ||
                String(categoryIdFromCourse || '') === selectedCategory;
            const matchesStatus =
                selectedStatus === 'ALL' || courseStatus === selectedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [courses, searchQuery, selectedCategory, selectedStatus]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategory, selectedStatus]);

    const totalItems = filteredCourses.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedCourses = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        return filteredCourses.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredCourses, page]);

    const startItem = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const endItem = totalItems === 0 ? 0 : Math.min(page * PAGE_SIZE, totalItems);

    const findCourseById = (id: string | number) =>
        courses.find((course) => String(course.id) === String(id));

    const handleDeleteCourse = async (id: string | number) => {
        const course = findCourseById(id);
        const confirmMessage = course
            ? `คุณแน่ใจหรือไม่ว่าต้องการลบคอร์ส "${course.title}" แบบถาวร?\n\n${getCourseDeletionSummary(course)}`
            : 'คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้แบบถาวร?';

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            await deleteCourse(Number(id));
            alert('ลบคอร์สสำเร็จ');
        } catch (err) {
            console.error('Failed to delete course:', err);
            alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบคอร์ส');
        }
    };

    const handleArchiveCourse = async (id: string | number) => {
        const course = findCourseById(id);
        const confirmMessage = course
            ? `คอร์ส "${course.title}" ไม่ควรถูกลบถาวร\n\n${getCourseArchiveSummary(course)}\n\nคุณต้องการเปลี่ยนสถานะเป็น ARCHIVED ใช่หรือไม่?`
            : 'คุณต้องการเปลี่ยนสถานะคอร์สเป็น ARCHIVED ใช่หรือไม่?';

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            await archiveCourse(Number(id));
            alert('ย้ายคอร์สไปเก็บถาวรสำเร็จ');
        } catch (err) {
            console.error('Failed to archive course:', err);
            alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเก็บถาวรคอร์ส');
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="กำลังโหลดข้อมูลคอร์ส..." />;
    }

    if (error) {
        return (
            <ErrorMessage
                error={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">คอร์สทั้งหมด</h1>
                    <p className="text-slate-500">จัดการคอร์สเรียนในระบบ</p>
                </div>
                <Link
                    href="/courses/add"
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                    <Plus size={20} />
                    <span>สร้างคอร์สใหม่</span>
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && <CourseStatsCards stats={stats} />}

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-md border border-violet-100 overflow-hidden">
                <CourseFilters
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    categoryValue={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    statusValue={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    categories={categoryOptions}
                />
                <CoursesTable
                    courses={paginatedCourses}
                    onView={(id) => router.push(`/courses/${id}`)}
                    onEdit={(id) => router.push(`/courses/${id}/edit`)}
                    onDelete={handleDeleteCourse}
                    onArchive={handleArchiveCourse}
                />

                {/* Pagination */}
                <div className="p-6 border-t border-violet-100 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">
                        {totalItems > 0
                            ? `แสดง ${startItem}-${endItem} จากทั้งหมด ${totalItems} รายการ`
                            : `ไม่พบข้อมูล จากทั้งหมด ${courses.length} รายการ`}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all"
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            ก่อนหน้า
                        </button>
                        <button className="px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-sm">
                            {page}
                        </button>
                        <button
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all"
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
