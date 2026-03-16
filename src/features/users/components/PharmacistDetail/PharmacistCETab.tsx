import { Award, Calendar, CheckCircle } from 'lucide-react';

interface CECreditRecord {
    id: string;
    courseTitle: string;
    cpeCredits: number;
    completedDate: string;
    certificateUrl?: string;
}

interface PharmacistCETabProps {
    records: CECreditRecord[];
    totalCredits: number;
}

export function PharmacistCETab({ records, totalCredits }: PharmacistCETabProps) {
    if (records.length === 0) {
        return (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-emerald-200 p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Award size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มี CPE Credits</h3>
                <p className="text-slate-500">เภสัชกรยังไม่ได้รับ CPE Credits จากคอร์สใดๆ</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 mb-1">CPE Credits สะสมทั้งหมด</p>
                        <p className="text-4xl font-bold">{totalCredits} หน่วย</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Award size={32} className="text-white" />
                    </div>
                </div>
            </div>

            {/* CPE Credits Table */}
            <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                    รายวิชา
                                </th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                    CPE Credits
                                </th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                    วันที่จบหลักสูตร
                                </th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                    สถานะ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Award size={20} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{record.courseTitle}</p>
                                                <p className="text-sm text-slate-500">Course ID: {record.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-lg">
                                            <span className="text-2xl font-bold text-emerald-600">{record.cpeCredits}</span>
                                            <span className="text-sm text-slate-600">หน่วย</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-700">
                                            <Calendar size={16} className="text-emerald-500" />
                                            <span className="font-medium">
                                                {new Date(record.completedDate).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            <CheckCircle size={14} />
                                            ผ่านแล้ว
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">รวมทั้งหมด</span>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-600">
                            {records.length} รายวิชา
                        </span>
                        <span className="text-emerald-600 font-bold text-lg">
                            {totalCredits} CPE Credits
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
