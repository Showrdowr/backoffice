'use client';

import { useState } from 'react';
import { Search, Download, CreditCard, CheckCircle, XCircle, Clock, TrendingUp, BarChart3, PieChart, Eye, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// Monthly revenue data
const monthlyRevenue = [
    { month: 'ม.ค.', revenue: 245000 },
    { month: 'ก.พ.', revenue: 312000 },
    { month: 'มี.ค.', revenue: 298000 },
    { month: 'เม.ย.', revenue: 356000 },
    { month: 'พ.ค.', revenue: 421000 },
    { month: 'มิ.ย.', revenue: 389000 },
    { month: 'ก.ค.', revenue: 445000 },
    { month: 'ส.ค.', revenue: 412000 },
    { month: 'ก.ย.', revenue: 478000 },
    { month: 'ต.ค.', revenue: 523000 },
    { month: 'พ.ย.', revenue: 495000 },
    { month: 'ธ.ค.', revenue: 385500 },
];

// Category sales data
const categorySales = [
    { name: 'วิทยาลัยเภสัชบำบัด', sales: 1850000, courses: 12, color: 'bg-blue-500', percentage: 28 },
    { name: 'วิทยาลัยคุ้มครองผู้บริโภคด้านยาฯ', sales: 980000, courses: 8, color: 'bg-emerald-500', percentage: 15 },
    { name: 'วิทยาลัยเภสัชกรรมสมุนไพร', sales: 756000, courses: 6, color: 'bg-violet-500', percentage: 12 },
    { name: 'วิทยาลัยเภสัชกรรมอุตสาหการ', sales: 645000, courses: 5, color: 'bg-amber-500', percentage: 10 },
    { name: 'วิทยาลัยเภสัชกรรมชุมชน', sales: 820000, courses: 7, color: 'bg-rose-500', percentage: 13 },
    { name: 'วิทยาลัยการบริหารเภสัชกิจ', sales: 520000, courses: 4, color: 'bg-cyan-500', percentage: 8 },
    { name: 'วิทยาลัยเภสัชพันธุศาสตร์ฯ', sales: 380000, courses: 3, color: 'bg-pink-500', percentage: 6 },
    { name: 'อื่นๆ', sales: 380500, courses: 5, color: 'bg-slate-400', percentage: 8 },
];

const transactions = [
    { id: 'TXN001', orderId: '1', orderNumber: 'ORD-20260107-001', user: 'สมชาย ใจดี', course: 'การดูแลผู้ป่วยโรคเรื้อรัง', category: 'วิทยาลัยเภสัชบำบัด', amount: 500, method: 'PromptPay', status: 'completed', date: '22 ธ.ค. 2024 10:30' },
    { id: 'TXN002', orderId: '2', orderNumber: 'ORD-20260107-002', user: 'สมหญิง รักเรียน', course: 'เภสัชกรรมคลินิกขั้นสูง', category: 'วิทยาลัยเภสัชบำบัด', amount: 800, method: 'Credit Card', status: 'completed', date: '22 ธ.ค. 2024 09:15' },
    { id: 'TXN003', orderId: '3', orderNumber: 'ORD-20260107-003', user: 'วิภา มานะ', course: 'กฎหมายเภสัชกรรม 2024', category: 'วิทยาลัยคุ้มครองผู้บริโภคด้านยาฯ', amount: 400, method: 'PromptPay', status: 'pending', date: '22 ธ.ค. 2024 08:45' },
    { id: 'TXN004', orderId: '4', orderNumber: 'ORD-20260106-045', user: 'ณัฐพล เก่งมาก', course: 'ทักษะการสื่อสารกับผู้ป่วย', category: 'วิทยาลัยเภสัชกรรมชุมชน', amount: 350, method: 'Credit Card', status: 'failed', date: '21 ธ.ค. 2024 16:20' },
    { id: 'TXN005', orderId: '5', orderNumber: 'ORD-20260106-044', user: 'ปิยะ รักดี', course: 'เภสัชกรรมชุมชนยุคใหม่', category: 'วิทยาลัยเภสัชกรรมชุมชน', amount: 600, method: 'PromptPay', status: 'completed', date: '21 ธ.ค. 2024 14:00' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <CheckCircle size={14} />
                    สำเร็จ
                </span>
            );
        case 'pending':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <Clock size={14} />
                    รอดำเนินการ
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle size={14} />
                    ล้มเหลว
                </span>
            );
        default:
            return null;
    }
};

export default function TransactionsPage() {
    const [selectedYear, setSelectedYear] = useState('2024');
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">รายการธุรกรรม</h1>
                    <p className="text-slate-500">ภาพรวมรายได้และธุรกรรมทั้งหมด</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                    >
                        <option value="2024">ปี 2024</option>
                        <option value="2023">ปี 2023</option>
                    </select>
                    <button className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50">
                        <Download size={18} />
                        <span>ส่งออก</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">รายได้วันนี้</p>
                    <p className="text-2xl font-bold text-slate-800">฿12,500</p>
                    <span className="text-xs text-emerald-600">+15% จากเมื่อวาน</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">รายได้เดือนนี้</p>
                    <p className="text-2xl font-bold text-emerald-600">฿385,500</p>
                    <span className="text-xs text-emerald-600">+8% จากเดือนที่แล้ว</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">รายได้ปีนี้</p>
                    <p className="text-2xl font-bold text-blue-600">฿{(totalRevenue / 1000000).toFixed(2)}M</p>
                    <span className="text-xs text-emerald-600">+22% จากปีที่แล้ว</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">ธุรกรรมวันนี้</p>
                    <p className="text-2xl font-bold text-violet-600">28</p>
                    <span className="text-xs text-amber-600">5 รอดำเนินการ</span>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <BarChart3 className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">รายได้รายเดือน</h3>
                                <p className="text-sm text-slate-500">ปี {selectedYear}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600">
                            <TrendingUp size={18} />
                            <span className="font-semibold">+22%</span>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-56">
                        {monthlyRevenue.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col items-center">
                                    <span className="text-xs font-medium text-slate-600 mb-1">
                                        ฿{(item.revenue / 1000).toFixed(0)}k
                                    </span>
                                    <div
                                        className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${idx === monthlyRevenue.length - 1 ? 'bg-blue-500' : 'bg-blue-200'
                                            }`}
                                        style={{ height: `${(item.revenue / maxRevenue) * 160}px` }}
                                        title={`${item.month}: ฿${item.revenue.toLocaleString()}`}
                                    />
                                </div>
                                <span className="text-xs text-slate-500">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Sales */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                            <PieChart className="text-violet-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">ยอดขายตามหมวดหมู่</h3>
                            <p className="text-sm text-slate-500">ปี {selectedYear}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {categorySales.map((cat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                                        <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800">฿{(cat.sales / 1000).toFixed(0)}k</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${cat.color} rounded-full transition-all`}
                                        style={{ width: `${cat.percentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{cat.courses} คอร์ส</span>
                                    <span>{cat.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาธุรกรรม..."
                            className="bg-transparent border-none outline-none text-sm flex-1"
                        />
                    </div>
                    <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                        <option>หมวดหมู่ทั้งหมด</option>
                        {categorySales.map((cat, idx) => (
                            <option key={idx}>{cat.name}</option>
                        ))}
                    </select>
                    <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                        <option>สถานะทั้งหมด</option>
                        <option>สำเร็จ</option>
                        <option>รอดำเนินการ</option>
                        <option>ล้มเหลว</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">รหัส</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">คำสั่งซื้อ</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">ผู้ใช้</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">คอร์ส</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">หมวดหมู่</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">จำนวน</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">ช่องทาง</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">สถานะ</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">วันที่</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-slate-800">{txn.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            href={`/payments/orders/${txn.orderId}`}
                                            className="inline-flex items-center gap-1.5 font-mono text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            <ShoppingBag size={14} />
                                            {txn.orderNumber}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{txn.user}</td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{txn.course}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                            {txn.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-slate-800">฿{txn.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={16} className="text-slate-400" />
                                            <span className="text-sm text-slate-600">{txn.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{txn.date}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/payments/transactions/${txn.id}`}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition-all inline-flex"
                                            title="ดูรายละเอียด"
                                        >
                                            <Eye size={18} className="text-blue-500" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">แสดง 1-5 จาก 1,234 รายการ</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled>
                            ก่อนหน้า
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">2</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">3</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
