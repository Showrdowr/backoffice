'use client';

import { use, useState } from 'react';
import {
    ArrowLeft, Mail, User, Calendar, MapPin, Phone, BookOpen,
    Clock, CheckCircle, TrendingUp, Award, MoreVertical, Shield,
    BadgeCheck, Building2, FileText, Download
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockPharmacist = {
    id: '1',
    name: 'ภญ. สมหญิง ใจงาม',
    email: 'somying@example.com',
    phone: '082-345-6789',
    address: '456 ถนนพระราม 4 เขตปทุมวัน กรุงเทพมหานคร 10330',
    status: 'active' as const,
    joined: '2024-01-10',
    lastLogin: '2024-03-22 14:30',
    avatar: null,
    license: 'ภ.12345',
    licenseExpiry: '2026-12-31',
    workplace: 'โรงพยาบาลรามาธิบดี',
    verificationStatus: 'verified' as const,
};

const mockStats = {
    totalCourses: 8,
    completedCourses: 6,
    inProgressCourses: 2,
    totalCPE: 15,
    targetCPE: 20,
    thisYearCPE: 8,
};

const mockCourses = [
    { id: '1', title: 'เภสัชศาสตร์คลินิก: การดูแลผู้ป่วยโรคเรื้อรัง', progress: 100, status: 'completed', enrolledDate: '2024-02-01', cpe: 3 },
    { id: '2', title: 'จริยธรรมทางเภสัชกรรม', progress: 100, status: 'completed', enrolledDate: '2024-01-15', cpe: 2 },
    { id: '3', title: 'การให้คำปรึกษาด้านยา', progress: 80, status: 'in-progress', enrolledDate: '2024-03-01', cpe: 3 },
    { id: '4', title: 'การจัดการระบบยาในโรงพยาบาล', progress: 100, status: 'completed', enrolledDate: '2024-01-20', cpe: 4 },
];

const mockCPEHistory = [
    { id: '1', course: 'เภสัชศาสตร์คลินิก: การดูแลผู้ป่วยโรคเรื้อรัง', credits: 3, date: '01 มี.ค. 2024', status: 'approved' },
    { id: '2', course: 'จริยธรรมทางเภสัชกรรม', credits: 2, date: '15 ก.พ. 2024', status: 'approved' },
    { id: '3', course: 'เภสัชกรรมคลินิกขั้นสูง', credits: 3, date: '28 ก.พ. 2024', status: 'approved' },
    { id: '4', course: 'การจัดการระบบยาในโรงพยาบาล', credits: 4, date: '20 ม.ค. 2024', status: 'approved' },
];

export default function PharmacistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [showActionMenu, setShowActionMenu] = useState(false);

    const cpeProgress = (mockStats.totalCPE / mockStats.targetCPE) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/users/pharmacists" className="p-2 hover:bg-emerald-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">รายละเอียดเภสัชกร</h1>
                        <p className="text-slate-500">ID: {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-semibold">
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
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                                    <Download size={16} />
                                    ดาวน์โหลด CPE Report
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                                    <Shield size={16} />
                                    รีเซ็ตรหัสผ่าน
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
                    {/* Pharmacist Hero Card */}
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 text-white">
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/30 flex-shrink-0 relative">
                                    {mockPharmacist.avatar ? (
                                        <img src={mockPharmacist.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <span className="text-4xl font-bold">{mockPharmacist.name.charAt(0)}</span>
                                    )}
                                    {mockPharmacist.verificationStatus === 'verified' && (
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-white">
                                            <BadgeCheck size={18} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold">{mockPharmacist.name}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mockPharmacist.verificationStatus === 'verified'
                                                ? 'bg-emerald-400/30 text-white'
                                                : 'bg-amber-400/30 text-white'
                                            }`}>
                                            {mockPharmacist.verificationStatus === 'verified' ? '✓ ยืนยันแล้ว' : '● รอยืนยัน'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/80 text-sm mb-3">
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} />
                                            ใบอนุญาต: {mockPharmacist.license}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Building2 size={14} />
                                            {mockPharmacist.workplace}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Mail size={14} />
                                            {mockPharmacist.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone size={14} />
                                            {mockPharmacist.phone}
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
                                <p className="text-2xl font-bold">{mockStats.totalCPE}</p>
                                <p className="text-xs text-white/70">CPE Credits</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{mockStats.thisYearCPE}</p>
                                <p className="text-xs text-white/70">ปีนี้</p>
                            </div>
                        </div>
                    </div>

                    {/* CPE Progress Card */}
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Award className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">ความคืบหน้า CPE Credits</h3>
                                    <p className="text-sm text-slate-500">เป้าหมายรายปี: {mockStats.targetCPE} หน่วย</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-emerald-600">{mockStats.totalCPE}/{mockStats.targetCPE}</p>
                                <p className="text-sm text-slate-500">หน่วยกิต</p>
                            </div>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                                style={{ width: `${Math.min(cpeProgress, 100)}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            {cpeProgress >= 100 ? '✓ บรรลุเป้าหมายแล้ว!' : `เหลืออีก ${mockStats.targetCPE - mockStats.totalCPE} หน่วย`}
                        </p>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-emerald-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-800">คอร์สที่ลงทะเบียน</h3>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                {mockStats.totalCourses} คอร์ส
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockCourses.map((course) => (
                                <div key={course.id} className="p-4 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-slate-800">{course.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">
                                                {course.cpe} CPE
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'completed'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {course.status === 'completed' ? '✓ เสร็จสิ้น' : '● กำลังเรียน'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-teal-500'
                                                        }`}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 w-12">{course.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CPE History */}
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Award className="text-emerald-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-800">ประวัติ CPE Credits</h3>
                            </div>
                            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                                <Download size={16} />
                                ดาวน์โหลด
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockCPEHistory.map((record) => (
                                <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-800">{record.course}</p>
                                        <p className="text-sm text-slate-500">{record.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600">{record.credits} หน่วย</p>
                                        <span className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                                            <CheckCircle size={12} />
                                            อนุมัติ
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* License Info */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <BadgeCheck size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">ใบอนุญาต</h3>
                                <p className="text-sm text-emerald-600">ยืนยันแล้ว</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500">เลขที่ใบอนุญาต</p>
                                <p className="font-bold text-slate-800">{mockPharmacist.license}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">วันหมดอายุ</p>
                                <p className="font-medium text-slate-800">{new Date(mockPharmacist.licenseExpiry).toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">สถานที่ทำงาน</p>
                                <p className="font-medium text-slate-800">{mockPharmacist.workplace}</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <User size={18} className="text-emerald-600" />
                            ข้อมูลส่วนตัว
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">อีเมล</p>
                                <p className="font-medium text-slate-800">{mockPharmacist.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">โทรศัพท์</p>
                                <p className="font-medium text-slate-800">{mockPharmacist.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">ที่อยู่</p>
                                <p className="font-medium text-slate-800 text-sm">{mockPharmacist.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Shield size={18} className="text-emerald-600" />
                            ข้อมูลบัญชี
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">สถานะ</span>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                    ใช้งานอยู่
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">ประเภท</span>
                                <span className="font-medium text-slate-800">เภสัชกร</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">วันที่สมัคร</span>
                                <span className="font-medium text-slate-800">{new Date(mockPharmacist.joined).toLocaleDateString('th-TH')}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">เข้าใช้ล่าสุด</span>
                                <span className="font-medium text-slate-800">{mockPharmacist.lastLogin}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">การดำเนินการ</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left">
                                <Mail size={18} className="text-emerald-500" />
                                <span className="font-medium">ส่งอีเมล</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all text-left">
                                <Download size={18} className="text-teal-500" />
                                <span className="font-medium">ดาวน์โหลด CPE Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
