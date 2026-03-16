import type { User } from '../types';
import { Eye, Mail, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/format';

interface UsersTableProps {
    users: User[];
    onView?: (id: string) => void;
    onEmail?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function UsersTable({ users, onView, onEmail, onDelete }: UsersTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-sky-50 border-b border-sky-100">
                    <tr>
                        <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">ชื่อ</th>
                        <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">อีเมล</th>
                        <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide hidden md:table-cell">สถานะ</th>
                        <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide hidden lg:table-cell">สมัครเมื่อ</th>
                        <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide hidden sm:table-cell">คอร์ส</th>
                        <th className="text-right px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-sky-50/30 transition-colors group">
                            <td className="px-4 md:px-6 py-4">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center text-sky-600 font-bold text-base md:text-lg shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all flex-shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-slate-800 text-sm md:text-base truncate">{user.name}</span>
                                </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-slate-600 text-sm md:text-base truncate max-w-[200px]">{user.email}</td>
                            <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                                <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${user.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {user.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                                </span>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-slate-600 hidden lg:table-cell text-sm">{formatDate(user.joined)}</td>
                            <td className="px-4 md:px-6 py-4 text-slate-600 font-medium hidden sm:table-cell text-sm">{user.courses} คอร์ส</td>
                            <td className="px-4 md:px-6 py-4">
                                <div className="flex items-center justify-end gap-1 md:gap-2">
                                    <button
                                        onClick={() => onView?.(user.id)}
                                        className="p-2 md:p-2.5 hover:bg-sky-100 rounded-xl transition-all group/btn touch-target"
                                        title="ดูรายละเอียด"
                                    >
                                        <Eye size={16} className="text-slate-500 group-hover/btn:text-sky-600" />
                                    </button>
                                    <button
                                        onClick={() => onEmail?.(user.id)}
                                        className="p-2 md:p-2.5 hover:bg-blue-100 rounded-xl transition-all group/btn touch-target hidden sm:block"
                                        title="ส่งอีเมล"
                                    >
                                        <Mail size={16} className="text-slate-500 group-hover/btn:text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(user.id)}
                                        className="p-2 md:p-2.5 hover:bg-red-100 rounded-xl transition-all group/btn touch-target hidden md:block"
                                        title="ลบ"
                                    >
                                        <Trash2 size={16} className="text-slate-500 group-hover/btn:text-red-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
