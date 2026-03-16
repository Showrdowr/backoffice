import { Search, Download, Award, Calendar, FileText, Users } from 'lucide-react';

const ceRecords = [
    { id: 1, pharmacist: 'ภก.สุรชัย เก่งมาก', license: 'ภ.12345', course: 'การดูแลผู้ป่วยโรคเรื้อรัง', credits: 3, date: '20 ธ.ค. 2024' },
    { id: 2, pharmacist: 'ภญ.วิภา รักการสอน', license: 'ภ.23456', course: 'เภสัชกรรมคลินิกขั้นสูง', credits: 5, date: '19 ธ.ค. 2024' },
    { id: 3, pharmacist: 'ภก.ณัฐพล มีความรู้', license: 'ภ.34567', course: 'กฎหมายเภสัชกรรม 2024', credits: 2, date: '18 ธ.ค. 2024' },
    { id: 4, pharmacist: 'ภญ.ปิยะ ใจดี', license: 'ภ.45678', course: 'ทักษะการสื่อสารกับผู้ป่วย', credits: 2, date: '17 ธ.ค. 2024' },
    { id: 5, pharmacist: 'ภก.สมชาย รักเรียน', license: 'ภ.56789', course: 'เภสัชกรรมชุมชนยุคใหม่', credits: 4, date: '16 ธ.ค. 2024' },
];

export default function CECreditsPage() {
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
                            <p className="text-xl font-bold text-slate-800">1,245</p>
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
                            <p className="text-xl font-bold text-slate-800">856</p>
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
                            <p className="text-xl font-bold text-slate-800">45</p>
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
                            <p className="text-xl font-bold text-slate-800">18,456</p>
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
                        />
                    </div>
                    <input type="date" className="px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                    <input type="date" className="px-4 py-2 border border-slate-200 rounded-lg text-sm" />
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
                            {ceRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">{record.pharmacist}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600">{record.license}</td>
                                    <td className="px-6 py-4 text-slate-600">{record.course}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Award size={16} className="text-amber-500" />
                                            <span className="font-medium text-slate-800">{record.credits}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{record.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
