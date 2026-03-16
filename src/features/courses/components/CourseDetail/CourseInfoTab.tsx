import { Calendar, Tag, TrendingUp, DollarSign, Award } from 'lucide-react';
import type { Course } from '../../types';

interface CourseInfoTabProps {
    course: Course;
}

export function CourseInfoTab({ course }: CourseInfoTabProps) {
    return (
        <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-violet-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">รายละเอียดคอร์ส</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {course.description}
                </p>
            </div>

            {/* Course Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories & Tags */}
                <div className="bg-white rounded-xl border border-violet-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Tag size={20} className="text-violet-500" />
                        หมวดหมู่และแท็ก
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">หมวดหมู่:</p>
                            <div className="flex flex-wrap gap-2">
                                {course.categories?.map((cat) => (
                                    <span key={cat} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">แท็ก:</p>
                            <div className="flex flex-wrap gap-2">
                                {course.tags?.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Difficulty & Level */}
                <div className="bg-white rounded-xl border border-violet-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-violet-500" />
                        ระดับความยาก
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600">ระดับ:</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-lg font-semibold">
                                {course.level === 'beginner' ? 'เริ่มต้น' : course.level === 'intermediate' ? 'ปานกลาง' : 'ขั้นสูง'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600">จำนวนบทเรียน:</span>
                            <span className="font-semibold text-slate-800">{course.lessonsCount ?? 0} บท</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600">ระยะเวลา:</span>
                            <span className="font-semibold text-slate-800">{course.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl border border-violet-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-violet-500" />
                        ราคาและการเข้าถึง
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600">ประเภท:</span>
                            <span className={`px-4 py-2 rounded-lg font-semibold ${(course.price ?? 0) === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {(course.price ?? 0) === 0 ? 'ฟรี' : 'เสียค่าใช้จ่าย'}
                            </span>
                        </div>
                        {(course.price ?? 0) > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">ราคา:</span>
                                <span className="text-2xl font-bold text-violet-600">{course.price} บาท</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* CPE Credits */}
                <div className="bg-white rounded-xl border border-violet-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Award size={20} className="text-violet-500" />
                        หน่วยกิต CE
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600">มีหน่วยกิต:</span>
                            <span className={`px-4 py-2 rounded-lg font-semibold ${(course.cpeCredits ?? 0) > 0 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {(course.cpeCredits ?? 0) > 0 ? 'มี' : 'ไม่มี'}
                            </span>
                        </div>
                        {(course.cpeCredits ?? 0) > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">จำนวน:</span>
                                <span className="text-2xl font-bold text-violet-600">{course.cpeCredits} หน่วย</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Timestamps */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={20} className="text-violet-500" />
                    <h3 className="text-lg font-bold text-slate-800">ข้อมูลเวลา</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">สร้างเมื่อ</p>
                        <p className="font-semibold text-slate-800">{new Date(course.createdAt).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">อัพเดทล่าสุด</p>
                        <p className="font-semibold text-slate-800">{course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('th-TH') : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">เผยแพร่เมื่อ</p>
                        <p className="font-semibold text-slate-800">
                            {course.publishedAt ? new Date(course.publishedAt).toLocaleDateString('th-TH') : 'ยังไม่เผยแพร่'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
