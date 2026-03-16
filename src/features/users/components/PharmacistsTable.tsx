import type { Pharmacist } from '../types';
import { Eye, Mail, Award, CheckCircle } from 'lucide-react';
import { formatDate } from '@/utils/format';

interface PharmacistsTableProps {
    pharmacists: Pharmacist[];
    onView?: (id: string) => void;
    onEmail?: (id: string) => void;
}

export function PharmacistsTable({ pharmacists, onView, onEmail }: PharmacistsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-emerald-100">
                    <tr>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">ชื่อ</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">เลข ภ.</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">สถานะ</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">CPE Credits</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">สมัครเมื่อ</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {pharmacists.map((pharmacist) => (
                        <tr key={pharmacist.id} className="hover:bg-emerald-50/30 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-lg shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                                        {pharmacist.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{pharmacist.name}</p>
                                        <p className="text-sm text-slate-500">{pharmacist.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-mono text-slate-700 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                                    {pharmacist.license}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                    <CheckCircle size={14} />
                                    ยืนยันแล้ว
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Award size={18} className="text-amber-600" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-lg">{pharmacist.cpeCredits}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{formatDate(pharmacist.joined)}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView?.(pharmacist.id)}
                                        className="p-2.5 hover:bg-emerald-100 rounded-xl transition-all group/btn"
                                        title="ดูรายละเอียด"
                                    >
                                        <Eye size={18} className="text-slate-500 group-hover/btn:text-emerald-600" />
                                    </button>
                                    <button
                                        onClick={() => onEmail?.(pharmacist.id)}
                                        className="p-2.5 hover:bg-blue-100 rounded-xl transition-all group/btn"
                                        title="ส่งอีเมล"
                                    >
                                        <Mail size={18} className="text-slate-500 group-hover/btn:text-blue-600" />
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
