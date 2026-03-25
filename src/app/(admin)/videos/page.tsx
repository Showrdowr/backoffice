'use client';

import { useState, useEffect } from 'react';
import { Video, Search, Folder, PlayCircle, Sparkles, LayoutGrid, Clapperboard } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';
import { categoryService } from '@/features/courses/services/categoryService';
import type { Category } from '@/features/courses/types/categories';
import Link from 'next/link';
import { getCategoryColorClasses } from '@/features/courses/utils/categoryColors';

export default function VideosPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCategories();
    }, []);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    const totalCourses = categories.reduce((sum, category) => sum + (category.courseCount || 0), 0);
    const activeSearch = searchTerm.trim();

    if (isLoading) return <LoadingSpinner message="กำลังโหลดหมวดหมู่..." fullScreen />;

    return (
        <div className="space-y-8 pb-10">
            <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(135deg,_#ffffff_0%,_#f0f9ff_48%,_#eef6ff_100%)] p-6 shadow-[0_20px_60px_-35px_rgba(14,165,233,0.45)] md:p-8">
                <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.10),_transparent_60%)] lg:block" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-bold tracking-[0.2em] text-sky-700 shadow-sm">
                            <Sparkles size={14} />
                            VIDEO LIBRARY
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 shadow-[0_20px_35px_-18px_rgba(37,99,235,0.8)]">
                                <Video size={30} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">คลังวิดีโอ</h1>
                                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                                    จัดหมวดเนื้อหาวิดีโอและบทเรียนให้ค้นหาได้เร็วขึ้น เลือกหมวดที่ต้องการเพื่อเข้าไปดูรายการวิดีโอและคอนเทนต์ทั้งหมดภายในหมวดนั้น
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 shadow-sm backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                        <LayoutGrid size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">หมวดทั้งหมด</p>
                                        <p className="text-2xl font-black text-slate-900">{categories.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 shadow-sm backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                        <Clapperboard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">คอร์สรวม</p>
                                        <p className="text-2xl font-black text-slate-900">{totalCourses}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="w-full max-w-xl xl:pt-2">
                        <div className="rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
                            <label htmlFor="video-category-search" className="mb-2 block px-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                ค้นหาหมวดวิดีโอ
                            </label>
                            <div className="relative">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="video-category-search"
                                    type="text"
                                    placeholder="ค้นหาหมวดหมู่, ชื่อหน่วยงาน หรือคำอธิบาย..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-14 w-full rounded-2xl border border-sky-100 bg-slate-50/80 px-4 py-3 pl-12 pr-4 text-sm text-slate-700 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                />
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-xs text-slate-500">
                                <span className="rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700">ค้นหาแบบเรียลไทม์</span>
                                <span>รองรับทั้งชื่อหมวดและคำอธิบาย</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">หมวดวิดีโอทั้งหมด</h2>
                    <p className="text-sm text-slate-500">
                        {activeSearch
                            ? `กำลังแสดงผลลัพธ์สำหรับ "${activeSearch}"`
                            : 'เลือกหมวดที่ต้องการเพื่อดูวิดีโอและบทเรียนภายในหมวดนั้น'}
                    </p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                    <Folder size={16} className="text-sky-600" />
                    {filteredCategories.length} หมวด
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredCategories.map((category) => {
                    const colorClasses = getCategoryColorClasses(category.color || 'slate');

                    return (
                        <Link
                            key={category.id}
                            href={`/videos/category/${category.id}`}
                            className="group relative overflow-hidden rounded-[28px] border border-sky-100/80 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_26px_60px_-34px_rgba(14,165,233,0.45)]"
                        >
                            <div className={`absolute inset-x-0 top-0 h-1.5 ${colorClasses.hero}`} />
                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-100/80 transition-transform duration-500 group-hover:scale-125" />
                            <div className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full border border-sky-100/70 bg-sky-50/70" />

                            <div className="relative flex min-h-[270px] flex-col">
                                <div className="mb-6 flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <div className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${colorClasses.iconBg} shadow-lg shadow-sky-100/80 ring-8 ring-white`}>
                                            <Folder size={30} className="text-white" />
                                        </div>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            พร้อมใช้งาน
                                        </span>
                                    </div>

                                    <div className="rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1.5 text-xs font-bold text-sky-800 shadow-sm">
                                        {category.courseCount || 0} คอร์ส
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[1.75rem] font-black leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-sky-700">
                                        {category.name}
                                    </h3>
                                    <p className="min-h-[72px] text-sm leading-6 text-slate-500">
                                        {category.description || 'หมวดนี้พร้อมสำหรับจัดเก็บวิดีโอและบทเรียน โดยสามารถคลิกเข้าไปจัดการรายการทั้งหมดในหมวดได้ทันที'}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Action</p>
                                        <div className="flex items-center gap-2 text-sm font-bold text-sky-700 transition-transform duration-300 group-hover:translate-x-1">
                                            <PlayCircle size={18} />
                                            เปิดคลังวิดีโอ
                                        </div>
                                    </div>

                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClasses.hero} text-white shadow-lg shadow-sky-100 transition-all duration-300 group-hover:scale-110`}>
                                        <Folder size={22} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredCategories.length === 0 && (
                <div className="overflow-hidden rounded-[32px] border border-dashed border-sky-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fbff_100%)] px-6 py-18 text-center shadow-[0_20px_50px_-40px_rgba(14,165,233,0.45)]">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-sky-50 text-sky-500 shadow-inner">
                        <Folder size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">ไม่พบหมวดหมู่ที่ตรงกับการค้นหา</h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
                        ลองใช้คำค้นที่สั้นลง เปลี่ยนคำสำคัญ หรือค้นหาจากชื่อหน่วยงาน/คำอธิบายของหมวดแทน
                    </p>
                    {activeSearch && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <Search size={16} />
                            ล้างคำค้นหา
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
