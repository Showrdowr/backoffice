import type { Course } from '../types';
import { Eye, Edit, Trash2, Star, Users } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/format';

interface CoursesTableProps {
    courses: Course[];
    onView?: (id: string | number) => void;
    onEdit?: (id: string | number) => void;
    onDelete?: (id: string | number) => void;
}

export function CoursesTable({ courses, onView, onEdit, onDelete }: CoursesTableProps) {
    const getStatusUI = (status: Course['status']) => {
        const normalized = String(status || 'DRAFT').toUpperCase();

        if (normalized === 'PUBLISHED') {
            return {
                className: 'bg-emerald-100 text-emerald-700',
                label: 'เผยแพร่แล้ว',
            };
        }

        if (normalized === 'ARCHIVED') {
            return {
                className: 'bg-slate-200 text-slate-700',
                label: 'เก็บถาวร',
            };
        }

        return {
            className: 'bg-amber-100 text-amber-700',
            label: 'ฉบับร่าง',
        };
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-violet-50 border-b border-violet-100">
                    <tr>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">คอร์ส</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">ราคา</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">ลงทะเบียน</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Rating</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">สถานะ</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {courses.length > 0 ? (
                        courses.map((course) => {
                            const statusUI = getStatusUI(course.status);
                            const parsedPrice = Number(course.price ?? 0);
                            const priceLabel = parsedPrice <= 0 ? 'ฟรี' : formatCurrency(parsedPrice);

                            return (
                                <tr key={course.id} className="hover:bg-violet-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-800">{course.title}</p>
                                            <p className="text-sm text-slate-500">
                                                {typeof course.category === 'object' ? course.category?.name : course.category} • {course.cpeCredits ?? 0} CPE Credits • ผู้สอน: {course.authorName || '-'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-800">{priceLabel}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Users size={16} className="text-blue-600" />
                                            </div>
                                            <span className="text-slate-700 font-medium">{formatNumber(course.enrollments ?? course.enrollmentsCount ?? 0)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Star size={16} className="text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-slate-800">{course.rating ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusUI.className}`}>
                                            {statusUI.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView?.(course.id)}
                                                className="p-2.5 hover:bg-violet-100 rounded-xl transition-all group/btn"
                                                title="ดูรายละเอียด"
                                            >
                                                <Eye size={18} className="text-slate-500 group-hover/btn:text-violet-600" />
                                            </button>
                                            <button
                                                onClick={() => onEdit?.(course.id)}
                                                className="p-2.5 hover:bg-blue-100 rounded-xl transition-all group/btn"
                                                title="แก้ไข"
                                            >
                                                <Edit size={18} className="text-slate-500 group-hover/btn:text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(course.id)}
                                                className="p-2.5 hover:bg-red-100 rounded-xl transition-all group/btn"
                                                title="ลบ"
                                            >
                                                <Trash2 size={18} className="text-slate-500 group-hover/btn:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                ไม่พบรายการคอร์สตามเงื่อนไขที่เลือก
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
