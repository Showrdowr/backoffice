'use client';

import { use, useState, useEffect } from 'react';
import {
    ArrowLeft, Edit, Trash2, Copy, Users, TrendingUp, Star, Clock, Award,
    DollarSign, Calendar, Tag, PlayCircle, HelpCircle, BookOpen, Eye,
    BarChart3, CheckCircle, Settings, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { courseService } from '@/features/courses/services/courseService';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [course, setCourse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCourse() {
            try {
                setIsLoading(true);
                const data = await courseService.getCourse(id);
                setCourse(data);
            } catch (err) {
                setError('ไม่พบคอร์สนี้');
            } finally {
                setIsLoading(false);
            }
        }
        loadCourse();
    }, [id]);

    const handleDelete = async () => {
        setShowDeleteModal(false);
        try {
            await courseService.deleteCourse(Number(id));
            router.push('/courses');
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการลบคอร์ส');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 text-lg">{error || 'ไม่พบคอร์ส'}</p>
                <Link href="/courses" className="text-blue-500 hover:underline mt-4 inline-block">กลับหน้ารายการคอร์ส</Link>
            </div>
        );
    }

    const lessonsData = course.lessons || [];
    const categoryName = typeof course.category === 'object' ? course.category?.name : course.category || 'ไม่ระบุ';
    const subcategoryName = typeof course.subcategory === 'object' ? course.subcategory?.name : '';
    const coursePrice = Number(course.price) || 0;
    const coursePriceLabel = coursePrice <= 0 ? 'ฟรี' : `฿${coursePrice.toLocaleString()}`;
    const courseCpe = course.cpeCredits || 0;
    const courseStatus = (course.status || 'DRAFT').toLowerCase();

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
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${courseStatus === 'published'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}>
                                {courseStatus === 'published' ? '✓ เผยแพร่แล้ว' : '● ฉบับร่าง'}
                            </span>
                        </div>
                        <p className="text-slate-500">ID: {course.id}</p>
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
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen size={40} className="text-white/50" />
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                                    <p className="text-white/80 mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {lessonsData.length} บทเรียน
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <PlayCircle size={16} />
                                            {lessonsData.length} บท
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award size={16} />
                                            {courseCpe} CPE
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 divide-x divide-white/10 bg-white/10 backdrop-blur-sm">
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{course.enrollmentsCount || 0}</p>
                                <p className="text-xs text-white/70">ผู้เรียนทั้งหมด</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{lessonsData.length}</p>
                                <p className="text-xs text-white/70">บทเรียน</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold flex items-center justify-center gap-1">
                                    <Award size={16} className="text-yellow-400" />
                                    {courseCpe}
                                </p>
                                <p className="text-xs text-white/70">CPE Credits</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{coursePriceLabel}</p>
                                <p className="text-xs text-white/70">ราคา</p>
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
                            {lessonsData.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <PlayCircle size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>ยังไม่มีบทเรียน</p>
                                </div>
                            ) : lessonsData.map((lesson: any, idx: number) => (
                                <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-all">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                                        {lesson.sequenceOrder || idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-800">{lesson.title}</h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <PlayCircle size={14} />
                                                วิดีโอ
                                            </span>
                                        </div>
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
                                {course.enrollmentsCount || 0} ทั้งหมด
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center py-6 text-slate-400">
                                <Users size={28} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">ยังไม่มีข้อมูลผู้ลงทะเบียน</p>
                            </div>
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
                            <p className="text-xl font-bold text-slate-800">{coursePriceLabel}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Award size={18} className="text-violet-500" />
                                <span className="text-sm text-slate-500">CPE Credits</span>
                            </div>
                            <p className="text-xl font-bold text-slate-800">{courseCpe} หน่วย</p>
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
                                    {categoryName}
                                </span>
                            </div>
                            {subcategoryName && (
                                <div>
                                    <p className="text-sm text-slate-500 mb-2">หมวดหมู่ย่อย</p>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                                        {subcategoryName}
                                    </span>
                                </div>
                            )}
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
                                <span className="text-slate-500">ผู้สอน</span>
                                <span className="font-medium text-slate-800">{course.authorName || 'ไม่ระบุ'}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">จำนวนบทเรียน</span>
                                <span className="font-medium text-slate-800">{lessonsData.length} บท</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">สถานะ</span>
                                <span className="font-medium text-slate-800">{course.status}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">Conference Code</span>
                                <span className="font-medium text-slate-800">{course.conferenceCode || '-'}</span>
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
                                    <p className="text-sm text-slate-500">{course.publishedAt ? new Date(course.publishedAt).toLocaleDateString('th-TH') : '-'}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Edit size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">อัปเดตล่าสุด</p>
                                    <p className="text-sm text-slate-500">{course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('th-TH') : '-'}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar size={16} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">สร้างเมื่อ</p>
                                    <p className="text-sm text-slate-500">{course.createdAt ? new Date(course.createdAt).toLocaleDateString('th-TH') : '-'}</p>
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
                                คุณต้องการลบคอร์ส "<span className="font-semibold">{course.title}</span>" ใช่หรือไม่?
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
