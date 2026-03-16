import type { Category } from '../types';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';

interface CategoryListProps {
    categories: Category[];
    onAdd?: () => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export function CategoryList({ categories, onAdd, onEdit, onDelete }: CategoryListProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                        <FolderOpen size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">หมวดหมู่</h2>
                </div>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all"
                >
                    <Plus size={18} />
                    <span>เพิ่มหมวดหมู่</span>
                </button>
            </div>
            <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="p-5 flex items-center justify-between hover:bg-blue-50/30 transition-all group"
                    >
                        <div>
                            <p className="font-semibold text-slate-800 mb-1">{category.name}</p>
                            <p className="text-sm text-slate-500">{category.courseCount} คอร์ส</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit?.(category.id)}
                                className="p-2.5 hover:bg-blue-100 rounded-xl transition-all"
                                title="แก้ไข"
                            >
                                <Edit size={16} className="text-slate-500" />
                            </button>
                            <button
                                onClick={() => onDelete?.(category.id)}
                                className="p-2.5 hover:bg-red-100 rounded-xl transition-all"
                                title="ลบ"
                            >
                                <Trash2 size={16} className="text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
