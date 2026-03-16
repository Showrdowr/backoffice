import { Download, TrendingUp, TrendingDown, DollarSign, Users, BookOpen, CreditCard } from 'lucide-react';

const monthlyData = [
    { month: 'ม.ค.', revenue: 285000, expenses: 45000 },
    { month: 'ก.พ.', revenue: 312000, expenses: 52000 },
    { month: 'มี.ค.', revenue: 298000, expenses: 48000 },
    { month: 'เม.ย.', revenue: 345000, expenses: 55000 },
    { month: 'พ.ค.', revenue: 378000, expenses: 62000 },
    { month: 'มิ.ย.', revenue: 356000, expenses: 58000 },
];

const topCourses = [
    { name: 'การดูแลผู้ป่วยโรคเรื้อรัง', revenue: 622500, enrollments: 1245 },
    { name: 'เภสัชกรรมคลินิกขั้นสูง', revenue: 493500, enrollments: 987 },
    { name: 'กฎหมายเภสัชกรรม 2024', revenue: 342400, enrollments: 856 },
    { name: 'ทักษะการสื่อสารกับผู้ป่วย', revenue: 261600, enrollments: 654 },
];

export default function FinancialReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">รายงานการเงิน</h1>
                    <p className="text-slate-500">ภาพรวมรายได้และค่าใช้จ่าย</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                        <option>ปี 2024</option>
                        <option>ปี 2023</option>
                    </select>
                    <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                        <Download size={18} />
                        <span>ส่งออกรายงาน</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <DollarSign size={20} className="text-emerald-600" />
                        </div>
                        <span className="flex items-center text-sm font-medium text-emerald-600">
                            <TrendingUp size={16} />+15.3%
                        </span>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-800">฿3.85M</p>
                    <p className="text-sm text-slate-500">รายได้รวมปีนี้</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard size={20} className="text-blue-600" />
                        </div>
                        <span className="flex items-center text-sm font-medium text-emerald-600">
                            <TrendingUp size={16} />+8.7%
                        </span>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-800">฿385,500</p>
                    <p className="text-sm text-slate-500">รายได้เดือนนี้</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-violet-600" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-800">12,845</p>
                    <p className="text-sm text-slate-500">ลูกค้าทั้งหมด</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <BookOpen size={20} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-800">฿2,450</p>
                    <p className="text-sm text-slate-500">รายได้เฉลี่ย/คอร์ส</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">รายได้รายเดือน</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {monthlyData.map((data) => (
                                <div key={data.month} className="flex items-center gap-4">
                                    <span className="w-12 text-sm text-slate-500">{data.month}</span>
                                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${(data.revenue / 400000) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-24 text-sm font-medium text-slate-800 text-right">
                                        ฿{(data.revenue / 1000).toFixed(0)}K
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">คอร์สที่ทำรายได้สูงสุด</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {topCourses.map((course, index) => (
                            <div key={index} className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{course.name}</p>
                                    <p className="text-sm text-slate-500">{course.enrollments.toLocaleString()} ลงทะเบียน</p>
                                </div>
                                <span className="text-lg font-semibold text-slate-800">
                                    ฿{(course.revenue / 1000).toFixed(0)}K
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
