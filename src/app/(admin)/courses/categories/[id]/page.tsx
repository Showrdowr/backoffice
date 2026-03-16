'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Tag, Filter } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { categoryService } from '@/features/courses/services/categoryService';
import { courseService } from '@/features/courses/services/courseService';
import type { Category, Course } from '@/features/courses/types';

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [category, setCategory] = useState<Category | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const cat = await categoryService.getCategoryById(id);
            setCategory(cat);

            if (cat) {
                const { courses: allCourses } = await courseService.getCourses();
                // Filter courses that belong to this category
                const filtered = allCourses.filter(c => 
                    c.categoryId?.toString() === cat.id.toString()
                );
                setCourses(filtered);
            }
        } catch (error) {
            console.error('Failed to load category data:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredCourses = selectedSubcategory 
        ? courses.filter(c => c.subcategoryId?.toString() === selectedSubcategory.toString())
        : courses;

    if (loading) {
        return <LoadingSpinner message="กำลังโหลด..." fullScreen />;
    }

    if (!category) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">ไม่พบหมวดหมู่</p>
                <Link href="/courses/categories" className="text-violet-600 font-bold hover:underline mt-4 inline-block">
                    กลับไปหน้าหมวดหมู่
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Back Button */}
            <Link
                href="/courses/categories"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors font-medium"
            >
                <ArrowLeft size={20} />
                กลับไปหน้าหมวดหมู่
            </Link>

            {/* Category Hero */}
            <div className={`bg-gradient-to-br from-${category.color || 'violet'}-500 to-${category.color || 'violet'}-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="flex items-start gap-6 relative z-10">
                    <div className={`w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg`}>
                        <Tag size={40} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                        <p className="text-white/90 mb-4 max-w-2xl">{category.description || 'ไม่มีคำอธิบาย'}</p>
                        <div className="flex items-center gap-6">
                            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">จำนวนคอร์ส</p>
                                <p className="text-2xl font-black">{category.courseCount || 0}</p>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">หมวดหมู่ย่อย</p>
                                <p className="text-2xl font-black">{category.subcategories?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategory Filter */}
            {category.subcategories && category.subcategories.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md border border-violet-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter size={20} className="text-violet-500" />
                        <h2 className="text-lg font-bold text-slate-800">กรองตามหมวดหมู่ย่อย</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedSubcategory(null)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${selectedSubcategory === null
                                ? 'bg-violet-500 text-white shadow-lg scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            ทั้งหมด ({courses.length})
                        </button>
                        {category.subcategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(sub.id)}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${selectedSubcategory?.toString() === sub.id.toString()
                                    ? 'bg-violet-500 text-white shadow-lg scale-105'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all overflow-hidden group flex flex-col h-full"
                    >
                        <div className="p-6 flex-1">
                            <div className="mb-4">
                                <span className="px-2 py-1 bg-violet-50 text-violet-600 text-[10px] font-black uppercase rounded-md mb-2 inline-block">
                                    {course.subcategory?.name || category.name}
                                </span>
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-violet-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-500 mb-4 border-t border-slate-50 pt-4">
                                <div className="flex items-center gap-1 font-bold">
                                    <span className="text-violet-500">฿</span>
                                    <span>{(course.price ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1 font-bold">
                                    <span className="text-emerald-500">CPE</span>
                                    <span>{course.cpeCredits ?? 0}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold">
                                    <span>⭐</span>
                                    <span>{course.rating ?? 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-1 rounded-lg text-xs font-bold">
                                    <span>👥</span>
                                    <span>{(course.enrollmentsCount ?? 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center shadow-inner">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold">ยังไม่มีคอร์สในหมวดหมู่นี้</p>
                    <p className="text-slate-400 text-sm mt-1">ลองเปลี่ยนการกรองหรือเลือกหมวดหมู่อื่น</p>
                </div>
            )}
        </div>
    );
}
