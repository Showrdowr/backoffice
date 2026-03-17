import { Edit, Trash2, Copy, Users, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import type { Course } from '../../types';

interface CourseHeroProps {
    course: Course;
    enrollmentStats: {
        totalEnrolled: number;
        completionRate: number;
        averageRating: number;
    };
    onDelete: () => void;
    onDuplicate: () => void;
}

export function CourseHero({ course, enrollmentStats, onDelete, onDuplicate }: CourseHeroProps) {
    const normalizeStatus = (status: string) => String(status || 'DRAFT').toUpperCase();

    const getStatusColor = (status: string) => {
        const normalizedStatus = normalizeStatus(status);
        if (normalizedStatus === 'PUBLISHED') return 'bg-green-100 text-green-700';
        if (normalizedStatus === 'ARCHIVED') return 'bg-slate-200 text-slate-700';
        return 'bg-orange-100 text-orange-700';
    };

    const getStatusText = (status: string) => {
        const normalizedStatus = normalizeStatus(status);
        if (normalizedStatus === 'PUBLISHED') return 'เผยแพร่แล้ว';
        if (normalizedStatus === 'ARCHIVED') return 'เก็บถาวร';
        return 'ฉบับร่าง';
    };

    return (
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
                {/* Course Image */}
                <div className="lg:col-span-1">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
                                <span className="text-6xl text-white/50">📚</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Course Info */}
                <div className="lg:col-span-2 text-white">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(course.status)}`}>
                                    {getStatusText(course.status)}
                                </span>
                                <span className="text-sm text-white/80">ID: {course.id}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                            <p className="text-white/90 text-lg mb-4">{course.description}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Users size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{enrollmentStats.totalEnrolled}</p>
                                    <p className="text-xs text-white/70">ผู้เรียน</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{enrollmentStats.completionRate}%</p>
                                    <p className="text-xs text-white/70">อัตราสำเร็จ</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Star size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{enrollmentStats.averageRating}</p>
                                    <p className="text-xs text-white/70">คะแนนเฉลี่ย</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/courses/${course.id}/edit`}
                            className="flex items-center gap-2 bg-white text-violet-600 px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                            <Edit size={18} />
                            แก้ไขคอร์ส
                        </Link>
                        <button
                            onClick={onDuplicate}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all font-semibold"
                        >
                            <Copy size={18} />
                            คัดลอก
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-white px-5 py-2.5 rounded-xl hover:bg-red-500/30 transition-all font-semibold"
                        >
                            <Trash2 size={18} />
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
