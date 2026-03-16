'use client';

import { use, useState, useEffect } from 'react';
import { courseService } from '@/features/courses/services/courseService';
import { categoryService } from '@/features/courses/services/categoryService';
import type { Category } from '@/features/courses/types/categories';
import type { Course } from '@/features/courses/types';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { ArrowLeft, BookOpen, Users, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryCourseListPageProps {
    params: Promise<{ id: string }>;
}

export default function CategoryCourseListPage({ params }: CategoryCourseListPageProps) {
    const { id } = use(params);

    const [category, setCategory] = useState<Category | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Category
                const cat = await categoryService.getCategoryById(id);
                if (!cat) {
                    setError('ไม่พบหมวดหมู่');
                    return;
                }
                setCategory(cat);

                // Fetch Courses for Category
                const coursesData = await courseService.getCoursesByCategory(id);
                setCourses(coursesData);
            } catch (err) {
                console.error(err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) return <LoadingSpinner message="กำลังโหลดคอร์สเรียน..." fullScreen />;
    if (error) return <ErrorMessage error={new Error(error)} fullScreen />;
    if (!category) return <ErrorMessage error={new Error('Category not found')} fullScreen />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/videos"
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-sky-600"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        {category.name}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {courses.length} คอร์สเรียนในหมวดหมู่นี้
                    </p>
                </div>
            </div>

            {/* Course List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        href={`/videos/course/${course.id}`}
                        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                        {/* Course Card Header / Thumbnail Placeholder */}
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 group-hover:scale-105 transition-transform duration-500`} />
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <BookOpen size={48} className="opacity-50" />
                            </div>

                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sky-600 text-xs font-bold rounded-full shadow-sm">
                                    {course.lessonsCount || (Array.isArray(course.lessons) ? course.lessons.length : 0)} บทเรียน
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                                {course.description || 'ไม่มีคำอธิบาย'}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {course.enrollments || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        {course.rating || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-sky-600 font-medium group-hover:translate-x-1 transition-transform">
                                    ดูคอร์ส
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <BookOpen size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600">ยังไม่มีคอร์สในหมวดหมู่นี้</h3>
                    <p className="text-slate-500">โปรดติดตามคอร์สใหม่เร็วๆ นี้</p>
                </div>
            )}
        </div>
    );
}
