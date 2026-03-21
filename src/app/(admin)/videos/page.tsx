'use client';

import { useState, useEffect } from 'react';
import { Video, Search, Folder, PlayCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';
import { categoryService } from '@/features/courses/services/categoryService';
import type { Category } from '@/features/courses/types/categories';
import Link from 'next/link';

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

    const getCategoryColorClass = (color: string) => {
        switch (color) {
            case 'violet': return 'from-violet-500 to-purple-600 shadow-violet-200';
            case 'blue': return 'from-blue-500 to-sky-600 shadow-blue-200';
            case 'emerald': return 'from-emerald-500 to-teal-600 shadow-emerald-200';
            case 'amber': return 'from-amber-500 to-orange-600 shadow-amber-200';
            case 'rose': return 'from-rose-500 to-red-600 shadow-rose-200';
            case 'cyan': return 'from-cyan-500 to-blue-600 shadow-cyan-200';
            case 'pink': return 'from-pink-500 to-rose-600 shadow-pink-200';
            default: return 'from-slate-500 to-gray-600 shadow-slate-200';
        }
    };

    if (isLoading) return <LoadingSpinner message="กำลังโหลดหมวดหมู่..." fullScreen />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg">
                        <Video size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">คลังวิดีโอ</h1>
                        <p className="text-slate-500">เลือกหมวดหมู่เพื่อดูวิดีโอและบทเรียน</p>
                    </div>
                </div>

                <div className="relative w-full md:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาหมวดหมู่..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-12 pr-4 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/videos/category/${category.id}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
                    >
                        <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${getCategoryColorClass(category.color || 'slate')} opacity-10 transition-transform group-hover:scale-110`} />

                        <div className="mb-4 flex items-start justify-between">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${category.color || 'slate'}-50 transition-transform group-hover:scale-105`}>
                                <Folder size={28} className={`text-${category.color || 'slate'}-600`} />
                            </div>
                            <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                {category.courseCount} คอร์ส
                            </span>
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-slate-800 transition-colors group-hover:text-sky-600">
                            {category.name}
                        </h3>
                        <p className="mb-4 h-10 line-clamp-2 text-sm text-slate-500">
                            {category.description}
                        </p>

                        <div className="flex translate-y-2 items-center gap-2 text-sm font-medium text-sky-600 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                            <PlayCircle size={18} />
                            ดูวิดีโอทั้งหมด
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                    <Folder size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-600">ไม่พบหมวดหมู่</h3>
                    <p className="text-slate-500">กรุณาลองค้นหาด้วยคำค้นอื่น</p>
                </div>
            )}
        </div>
    );
}
