'use client';

import { use, useState } from 'react';
import {
    ArrowLeft, Mail, Ban, User, Calendar, MapPin, Phone, BookOpen,
    Clock, CheckCircle, TrendingUp, CreditCard, MoreVertical, Shield
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockUser = {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    status: 'active' as const,
    joined: '2024-01-15',
    lastLogin: '2024-03-20 10:30',
    avatar: null,
};

const mockStats = {
    totalCourses: 5,
    completedCourses: 3,
    inProgressCourses: 2,
    totalSpent: 4500,
    averageProgress: 72,
};

const mockCourses = [
    { id: '1', title: 'เภสัชศาสตร์คลินิก: การดูแลผู้ป่วยโรคเรื้อรัง', progress: 75, status: 'in-progress', enrolledDate: '2024-02-01', price: 1500 },
    { id: '2', title: 'จริยธรรมทางเภสัชกรรม', progress: 100, status: 'completed', enrolledDate: '2024-01-20', price: 800 },
    { id: '3', title: 'การให้คำปรึกษาด้านยา', progress: 45, status: 'in-progress', enrolledDate: '2024-02-10', price: 1200 },
    { id: '4', title: 'เภสัชกรรมชุมชนยุคใหม่', progress: 100, status: 'completed', enrolledDate: '2024-01-15', price: 500 },
    { id: '5', title: 'การจัดการระบบยาในโรงพยาบาล', progress: 100, status: 'completed', enrolledDate: '2024-01-10', price: 500 },
];

const mockTransactions = [
    { id: 'TXN001', course: 'เภสัชศาสตร์คลินิก', amount: 1500, date: '01 ก.พ. 2024', status: 'completed' },
    { id: 'TXN002', course: 'การให้คำปรึกษาด้านยา', amount: 1200, date: '10 ก.พ. 2024', status: 'completed' },
    { id: 'TXN003', course: 'จริยธรรมทางเภสัชกรรม', amount: 800, date: '20 ม.ค. 2024', status: 'completed' },
];

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [showActionMenu, setShowActionMenu] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/users" className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">รายละเอียดผู้ใช้</h1>
                        <p className="text-slate-500">ID: {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold">
                        <Mail size={18} />
                        ส่งอีเมล
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowActionMenu(!showActionMenu)}
                            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                        >
                            <MoreVertical size={18} className="text-slate-500" />
                        </button>
                        {showActionMenu && (
                            <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-slate-200 py-2 w-48 z-10">
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700">
                                    รีเซ็ตรหัสผ่าน
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600">
                                    <span className="flex items-center gap-2">
                                        <Ban size={16} />
                                        ระงับบัญชี
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Hero Card */}
                    <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 text-white">
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                                    {mockUser.avatar ? (
                                        <img src={mockUser.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <span className="text-4xl font-bold">{mockUser.name.charAt(0)}</span>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold">{mockUser.name}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mockUser.status === 'active'
                                                ? 'bg-emerald-400/30 text-white'
                                                : 'bg-red-400/30 text-white'
                                            }`}>
                                            {mockUser.status === 'active' ? '● ใช้งานอยู่' : '○ ถูกระงับ'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                                        <span className="flex items-center gap-1">
                                            <Mail size={14} />
                                            {mockUser.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone size={14} />
                                            {mockUser.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            สมัคร: {new Date(mockUser.joined).toLocaleDateString('th-TH')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            ล่าสุด: {mockUser.lastLogin}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 divide-x divide-white/10 bg-white/10 backdrop-blur-sm">
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{mockStats.totalCourses}</p>
                                <p className="text-xs text-white/70">คอร์สทั้งหมด</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{mockStats.completedCourses}</p>
                                <p className="text-xs text-white/70">เรียนจบแล้ว</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{mockStats.averageProgress}%</p>
                                <p className="text-xs text-white/70">ความคืบหน้าเฉลี่ย</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">฿{(mockStats.totalSpent / 1000).toFixed(1)}k</p>
                                <p className="text-xs text-white/70">ยอดซื้อรวม</p>
                            </div>
                        </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-blue-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-800">คอร์สที่ลงทะเบียน</h3>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                {mockStats.totalCourses} คอร์ส
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockCourses.map((course) => (
                                <div key={course.id} className="p-4 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-slate-800">{course.title}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'completed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {course.status === 'completed' ? '✓ เสร็จสิ้น' : '● กำลังเรียน'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 w-12">{course.progress}%</span>
                                        <span className="text-sm text-slate-500">{course.enrolledDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-blue-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-800">ประวัติการชำระเงิน</h3>
                            </div>
                            <Link href="/payments/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockTransactions.map((txn) => (
                                <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-800">{txn.course}</p>
                                        <p className="text-sm text-slate-500">{txn.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800">฿{txn.amount.toLocaleString()}</p>
                                        <span className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                                            <CheckCircle size={12} />
                                            สำเร็จ
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <User size={18} className="text-blue-600" />
                            ข้อมูลส่วนตัว
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">อีเมล</p>
                                <p className="font-medium text-slate-800">{mockUser.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">โทรศัพท์</p>
                                <p className="font-medium text-slate-800">{mockUser.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">ที่อยู่</p>
                                <p className="font-medium text-slate-800 text-sm">{mockUser.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Learning Stats */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <TrendingUp size={18} className="text-blue-600" />
                            สถิติการเรียน
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">เสร็จสิ้น</span>
                                <span className="font-bold text-emerald-600">{mockStats.completedCourses} คอร์ส</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">กำลังเรียน</span>
                                <span className="font-bold text-amber-600">{mockStats.inProgressCourses} คอร์ส</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">ความคืบหน้าเฉลี่ย</span>
                                <span className="font-bold text-blue-600">{mockStats.averageProgress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Shield size={18} className="text-blue-600" />
                            ข้อมูลบัญชี
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">สถานะ</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mockUser.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {mockUser.status === 'active' ? 'ใช้งานอยู่' : 'ถูกระงับ'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">ประเภท</span>
                                <span className="font-medium text-slate-800">บุคคลทั่วไป</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">วันที่สมัคร</span>
                                <span className="font-medium text-slate-800">{new Date(mockUser.joined).toLocaleDateString('th-TH')}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">เข้าใช้ล่าสุด</span>
                                <span className="font-medium text-slate-800">{mockUser.lastLogin}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">การดำเนินการ</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                                <Mail size={18} className="text-blue-500" />
                                <span className="font-medium">ส่งอีเมล</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left">
                                <Shield size={18} className="text-amber-500" />
                                <span className="font-medium">รีเซ็ตรหัสผ่าน</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
