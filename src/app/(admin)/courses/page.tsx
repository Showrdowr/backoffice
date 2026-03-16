'use client';

import { useRouter } from 'next/navigation';
import { useCourses } from '@/features/courses/hooks';
import { CourseStatsCards } from '@/features/courses/components/CourseStatsCards';
import { CourseFilters } from '@/features/courses/components/CourseFilters';
import { CoursesTable } from '@/features/courses/components/CoursesTable';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
    const router = useRouter();
    const { courses, stats, isLoading, error, deleteCourse } = useCourses();

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
                <CourseFilters />
                <CoursesTable
                    courses={courses}
                    onView={(id) => router.push(`/courses/${id}`)}
                    onEdit={(id) => router.push(`/courses/${id}/edit`)}
                    onDelete={async (id) => {
                        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?')) {
                            try {
                                await deleteCourse(id as number);
                                alert('ลบคอร์สสำเร็จ');
                            } catch (err) {
                                console.error('Failed to delete course:', err);
                                alert('เกิดข้อผิดพลาดในการลบคอร์ส');
                            }
                        }
                    }}
                />

                {/* Pagination */}
                <div className="p-6 border-t border-violet-100 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">
                        แสดง 1-{courses.length} {stats && `จาก ${stats.total} รายการ`}
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all" disabled>
                            ก่อนหน้า
                        </button>
                        <button className="px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-sm">1</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white font-semibold transition-all">2</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white font-semibold transition-all">3</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white font-semibold transition-all">
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
