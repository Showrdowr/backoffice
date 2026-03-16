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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Video size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">คลังวิดีโอ</h1>
                        <p className="text-slate-500">เลือกหมวดหมู่เพื่อดูวิดีโอและบทเรียน</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาหมวดหมู่..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/videos/category/${category.id}`}
                        className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${getCategoryColorClass(category.color || 'slate')} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform`} />

                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 rounded-2xl bg-${category.color || 'slate'}-50 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <Folder size={28} className={`text-${category.color || 'slate'}-600`} />
                            </div>
                            <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full border border-slate-100">
                                {category.courseCount} คอร์ส
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                            {category.name}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                            {category.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm font-medium text-sky-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            <PlayCircle size={18} />
                            ดูวิดีโอทั้งหมด
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Folder size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600">ไม่พบหมวดหมู่</h3>
                    <p className="text-slate-500">กรุณาลองค้นหาด้วยคำค้นอื่น</p>
                </div>
            )}
        </div>
    );
}
