'use client';

import { Search, Download, Award, Calendar, FileText, Users, AlertTriangle } from 'lucide-react';
import { useCpeCredits } from '@/features/cpe-credits/hooks';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

export default function CECreditsPage() {
    const { records, stats, loading, error, searchQuery, setSearchQuery } = useCpeCredits();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">กำลังโหลดข้อมูล CPE...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        ลองอีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">จัดการ CPE Credit</h1>
                    <p className="text-slate-500">รายงานและจัดการ CPE Credit สำหรับเภสัชกร</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                    <Download size={18} />
                    <span>ส่งออกรายงาน</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Award size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">CE ออกเดือนนี้</p>
                            <p className="text-xl font-bold text-slate-800">{stats?.totalCreditsThisMonth?.toLocaleString() ?? '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">เภสัชกรได้รับ CE</p>
                            <p className="text-xl font-bold text-slate-800">{stats?.pharmacistsReceived?.toLocaleString() ?? '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">คอร์สที่มี CE</p>
                            <p className="text-xl font-bold text-slate-800">{stats?.coursesWithCpe?.toLocaleString() ?? '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Calendar size={20} className="text-violet-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">CE รวมปีนี้</p>
                            <p className="text-xl font-bold text-slate-800">{stats?.totalCreditsThisYear?.toLocaleString() ?? '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">รายการ CPE Credit ล่าสุด</h2>
                </div>
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาเภสัชกร หรือ เลขใบประกอบวิชาชีพ..."
                            className="bg-transparent border-none outline-none text-sm flex-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">เภสัชกร</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">เลข ภ.</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">คอร์ส</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">CPE Credits</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">วันที่</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        ไม่พบข้อมูล CPE Credit
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-800">{record.pharmacistName}</td>
                                        <td className="px-6 py-4 font-mono text-slate-600">{record.licenseNumber || '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{record.courseName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Award size={16} className="text-amber-500" />
                                                <span className="font-medium text-slate-800">{record.credits}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {record.completedAt
                                                ? formatDistanceToNow(new Date(record.completedAt), { addSuffix: true, locale: th })
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
