'use client';

import { useEffect, useState } from 'react';
import { Plus, Tag as TagIcon, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/features/courses/services/categoryService';
import type { Category } from '@/features/courses/types';

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const categoriesData = await categoryService.getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: number | string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) return;
        
        try {
            await categoryService.deleteCategory(id);
            await loadData();
        } catch {
            console.error('Failed to delete category');
        }
    };

    if (loading) {
        return <LoadingSpinner message="กำลังโหลด..." fullScreen />;
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">หมวดหมู่คอร์สเรียน</h1>
                    <p className="text-slate-500">จัดการโครงสร้างคอร์สและการจัดกลุ่มข้อมูล</p>
                </div>
                <Link
                    href="/courses/categories/add"
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                    <Plus size={18} />
                    เพิ่มหมวดหมู่
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Categories Table */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-md border border-violet-100 overflow-hidden">
                        <div className="p-6 border-b border-violet-50 bg-slate-50/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <TagIcon size={18} className="text-violet-500" />
                                หมวดหมู่ทั้งหมด
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/80 border-b border-violet-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">หมวดหมู่</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">หมวดหมู่ย่อย</th>
                                        <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">จำนวนคอร์ส</th>
                                        <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                                                ยังไม่มีข้อมูลหมวดหมู่
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-violet-50/30 transition-colors cursor-pointer group"
                                                onClick={() => router.push(`/courses/categories/${category.id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 ${category.color ? `bg-${category.color}-500` : 'bg-violet-500'} rounded-lg flex items-center justify-center shadow-sm`}>
                                                            <TagIcon size={20} className="text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-800">{category.name}</div>
                                                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{category.description || 'ไม่มีคำอธิบาย'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {category.subcategories && category.subcategories.length > 0 ? (
                                                            <>
                                                                 {category.subcategories.slice(0, 3).map((sub) => (
                                                                    <span key={sub.id} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                                                                        {sub.name}
                                                                    </span>
                                                                 ))}
                                                                {category.subcategories.length > 3 && (
                                                                    <span className="px-2 py-1 bg-violet-50 text-violet-600 rounded-md text-[10px] font-bold">
                                                                        +{category.subcategories.length - 3}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-300 text-xs">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold shadow-sm">
                                                        {category.courseCount || 0} คอร์ส
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            className="p-2 hover:bg-blue-100 rounded-lg transition-all text-slate-400 hover:text-blue-600"
                                                            title="แก้ไข"
                                                            onClick={() => router.push(`/courses/categories/${category.id}/edit`)}
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-all text-slate-400 hover:text-red-600"
                                                            title="ลบ"
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
