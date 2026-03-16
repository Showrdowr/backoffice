'use client';

import { use, useState } from 'react';
import {
    ArrowLeft, Edit, Trash2, Copy, Users, TrendingUp, Star, Clock, Award,
    DollarSign, Calendar, Tag, PlayCircle, HelpCircle, BookOpen, Eye,
    BarChart3, CheckCircle, Settings
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockCourse = {
    id: '1',
    title: 'เภสัชศาสตร์คลินิก: การดูแลผู้ป่วยโรคเรื้อรัง',
    description: 'คอร์สนี้จะสอนเกี่ยวกับการดูแลผู้ป่วยโรคเรื้อรัง การให้คำปรึกษาด้านยา และการติดตามผลการรักษา รวมถึงการประเมินความเสี่ยงและการป้องกันภาวะแทรกซ้อน',
    thumbnail: '',
    status: 'published' as const,
    level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    category: 'วิทยาลัยเภสัชบำบัด',
    subcategories: ['โรคเรื้อรัง', 'ผู้สูงอายุ'],
    tags: ['คำปรึกษา', 'การติดตามผล', 'เบาหวาน'],
    price: 1500,
    cpeCredits: 5,
    lessons: 12,
    quizzes: 3,
    duration: '8 ชั่วโมง',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    publishedAt: '2024-02-01',
    instructor: 'ดร. สมชาย ใจดี',
};

const mockStats = {
    totalEnrolled: 156,
    completionRate: 78,
    averageRating: 4.5,
    totalReviews: 42,
    revenue: 234000,
    thisMonthEnrolled: 23,
};

const mockLessons = [
    { id: '1', title: 'บทนำ: ความสำคัญของการดูแลผู้ป่วยโรคเรื้อรัง', type: 'video', duration: '15:30', views: 156 },
    { id: '2', title: 'โรคเบาหวาน: การประเมินและการให้คำปรึกษา', type: 'video', duration: '25:45', views: 142 },
    { id: '3', title: 'โรคความดันโลหิตสูง: การจัดการและการติดตาม', type: 'video', duration: '30:00', views: 138 },
    { id: '4', title: 'การประเมินความเสี่ยงและการป้องกันภาวะแทรกซ้อน', type: 'video', duration: '22:15', views: 125 },
    { id: '5', title: 'แบบฝึกหัดท้ายบท', type: 'quiz', duration: '15:00', views: 120 },
];

const mockRecentEnrollments = [
    { id: '1', name: 'สมชาย ใจดี', date: '22 ธ.ค. 2024', avatar: 'ส' },
    { id: '2', name: 'สมหญิง รักเรียน', date: '21 ธ.ค. 2024', avatar: 'ส' },
    { id: '3', name: 'วิภา มานะ', date: '20 ธ.ค. 2024', avatar: 'ว' },
];

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(false);
        console.log('Delete course:', id);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/courses" className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">รายละเอียดคอร์ส</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mockCourse.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}>
                                {mockCourse.status === 'published' ? '✓ เผยแพร่แล้ว' : '● ฉบับร่าง'}
                            </span>
                        </div>
                        <p className="text-slate-500">ID: {mockCourse.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                        <Eye size={18} className="text-slate-500" />
                        <span className="font-medium">ดูตัวอย่าง</span>
                    </button>
                    <Link
                        href={`/courses/${id}/edit`}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold"
                    >
                        <Edit size={18} />
                        แก้ไขคอร์ส
                    </Link>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2.5 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
                    >
                        <Trash2 size={18} className="text-red-500" />
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course Hero Card */}
                    <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 text-white">
                            <div className="flex gap-6">
                                {/* Thumbnail */}
                                <div className="w-48 h-32 rounded-xl overflow-hidden bg-white/10 backdrop-blur flex-shrink-0 border border-white/20">
                                    {mockCourse.thumbnail ? (
                                        <img src={mockCourse.thumbnail} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen size={40} className="text-white/50" />
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2">{mockCourse.title}</h2>
                                    <p className="text-white/80 mb-4 line-clamp-2">{mockCourse.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {mockCourse.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <PlayCircle size={16} />
                                            {mockCourse.lessons} บทเรียน
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HelpCircle size={16} />
                                            {mockCourse.quizzes} แบบทดสอบ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 divide-x divide-white/10 bg-white/10 backdrop-blur-sm">
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{mockStats.totalEnrolled}</p>
                                <p className="text-xs text-white/70">ผู้เรียนทั้งหมด</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{mockStats.completionRate}%</p>
                                <p className="text-xs text-white/70">อัตราสำเร็จ</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold flex items-center justify-center gap-1">
                                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                                    {mockStats.averageRating}
                                </p>
                                <p className="text-xs text-white/70">{mockStats.totalReviews} รีวิว</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">฿{(mockStats.revenue / 1000).toFixed(0)}k</p>
                                <p className="text-xs text-white/70">รายได้</p>
                            </div>
                        </div>
                    </div>

                    {/* Course Content Summary */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <PlayCircle className="text-blue-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-800">บทเรียนทั้งหมด</h3>
                            </div>
                            <Link
                                href={`/courses/${id}/edit`}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                            >
                                <Settings size={16} />
                                จัดการบทเรียน
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockLessons.map((lesson, idx) => (
                                <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-all">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-800">{lesson.title}</h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                {lesson.type === 'video' ? <PlayCircle size={14} /> : <HelpCircle size={14} />}
                                                {lesson.type === 'video' ? 'วิดีโอ' : 'แบบทดสอบ'}
                                            </span>
                                            <span>{lesson.duration}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-600">{lesson.views} ครั้ง</p>
                                        <p className="text-xs text-slate-400">ความนิยม</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Enrollments */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users className="text-blue-600" size={24} />
                                <h3 className="text-xl font-bold text-slate-800">ลงทะเบียนล่าสุด</h3>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                +{mockStats.thisMonthEnrolled} เดือนนี้
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {mockRecentEnrollments.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.date}</p>
                                    </div>
                                    <CheckCircle size={18} className="text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={18} className="text-emerald-500" />
                                <span className="text-sm text-slate-500">ราคา</span>
                            </div>
                            <p className="text-xl font-bold text-slate-800">฿{mockCourse.price.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Award size={18} className="text-violet-500" />
                                <span className="text-sm text-slate-500">CPE Credits</span>
                            </div>
                            <p className="text-xl font-bold text-slate-800">{mockCourse.cpeCredits} หน่วย</p>
                        </div>
                    </div>

                    {/* Category & Tags */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Tag size={18} className="text-blue-600" />
                            หมวดหมู่
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500 mb-2">หมวดหมู่หลัก</p>
                                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
                                    {mockCourse.category}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-2">หมวดหมู่ย่อย</p>
                                <div className="flex flex-wrap gap-2">
                                    {mockCourse.subcategories.map((sub) => (
                                        <span key={sub} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-2">แท็ก</p>
                                <div className="flex flex-wrap gap-2">
                                    {mockCourse.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-violet-50 text-violet-600 rounded text-xs font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <BarChart3 size={18} className="text-blue-600" />
                            ข้อมูลคอร์ส
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">ระดับ</span>
                                <span className="font-medium text-slate-800">
                                    {mockCourse.level === 'beginner' ? 'เริ่มต้น' : mockCourse.level === 'intermediate' ? 'ปานกลาง' : 'ขั้นสูง'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">ผู้สอน</span>
                                <span className="font-medium text-slate-800">{mockCourse.instructor}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">จำนวนบทเรียน</span>
                                <span className="font-medium text-slate-800">{mockCourse.lessons} บท</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">ระยะเวลา</span>
                                <span className="font-medium text-slate-800">{mockCourse.duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Calendar size={18} className="text-blue-600" />
                            ไทม์ไลน์
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={16} className="text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">เผยแพร่</p>
                                    <p className="text-sm text-slate-500">{new Date(mockCourse.publishedAt).toLocaleDateString('th-TH')}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Edit size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">อัปเดตล่าสุด</p>
                                    <p className="text-sm text-slate-500">{new Date(mockCourse.updatedAt).toLocaleDateString('th-TH')}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar size={16} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">สร้างเมื่อ</p>
                                    <p className="text-sm text-slate-500">{new Date(mockCourse.createdAt).toLocaleDateString('th-TH')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">การดำเนินการ</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                                <Copy size={18} className="text-blue-500" />
                                <span className="font-medium">คัดลอกคอร์ส</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left">
                                <TrendingUp size={18} className="text-amber-500" />
                                <span className="font-medium">ดูสถิติ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                            <h3 className="text-xl font-bold text-slate-800">ยืนยันการลบคอร์ส</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 mb-4">
                                คุณต้องการลบคอร์ส "<span className="font-semibold">{mockCourse.title}</span>" ใช่หรือไม่?
                            </p>
                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6">
                                ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้ และจะลบข้อมูลผู้เรียนทั้งหมด
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold"
                                >
                                    ลบคอร์ส
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
