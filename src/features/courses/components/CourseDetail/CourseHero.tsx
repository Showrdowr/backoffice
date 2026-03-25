import { Archive, Edit, Trash2, Users, BookOpen, Calendar, Award, Film } from 'lucide-react';
import Link from 'next/link';
import type { Course } from '../../types';

interface CourseHeroProps {
    course: Course;
    stats: {
        totalEnrolled: number;
        lessonsCount: number;
        maxStudents: number | null;
        courseEndAt?: string | Date | null;
    };
    onRemove: () => void;
    removeLabel: string;
    removeVariant: 'delete' | 'archive';
    removeDisabled?: boolean;
    removeHint?: string | null;
}

function normalizeStatus(status: string) {
    return String(status || 'DRAFT').toUpperCase();
}

function getStatusColor(status: string) {
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'PUBLISHED') return 'bg-green-100 text-green-700';
    if (normalizedStatus === 'ARCHIVED') return 'bg-slate-200 text-slate-700';
    return 'bg-orange-100 text-orange-700';
}

function getStatusText(status: string) {
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'PUBLISHED') return 'เผยแพร่แล้ว';
    if (normalizedStatus === 'ARCHIVED') return 'เก็บถาวร';
    return 'ฉบับร่าง';
}

function formatDate(value?: string | Date | null) {
    if (!value) {
        return '-';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return '-';
    }

    return parsed.toLocaleDateString('th-TH');
}

export function CourseHero({
    course,
    stats,
    onRemove,
    removeLabel,
    removeVariant,
    removeDisabled = false,
    removeHint,
}: CourseHeroProps) {
    const thumbnail = course.thumbnail || course.thumbnailUrl;
    const isArchiveAction = removeVariant === 'archive';

    return (
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl">
            <div className="grid gap-6 p-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="aspect-video overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                        {thumbnail ? (
                            <img src={thumbnail} alt={course.title} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
                                <BookOpen size={52} className="text-white/50" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-white lg:col-span-2">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(String(course.status))}`}>
                                    {getStatusText(String(course.status))}
                                </span>
                                <span className="text-sm text-white/80">ID: {course.id}</span>
                            </div>
                            <h1 className="mb-2 text-3xl font-bold">{course.title}</h1>
                            <p className="mb-4 text-lg text-white/90">{course.description || '-'}</p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                                <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                                    ผู้สอน: {course.authorName || 'ไม่ระบุ'}
                                </span>
                                <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                                    รูปแบบ: {(Number(course.price) || 0) > 0 ? 'เสียค่าใช้จ่าย' : 'ฟรี'}
                                </span>
                                <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                                    ใบรับรอง: {course.hasCertificate ? 'มี' : 'ไม่มี'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/courses/${course.id}/edit`}
                                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-violet-600 transition-all hover:shadow-lg"
                            >
                                <Edit size={18} />
                                แก้ไขคอร์ส
                            </Link>
                            <button
                                onClick={onRemove}
                                disabled={removeDisabled}
                                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                                    isArchiveAction
                                        ? 'border border-amber-300/40 bg-amber-500/20 hover:bg-amber-500/30'
                                        : 'border border-red-400/30 bg-red-500/20 hover:bg-red-500/30'
                                }`}
                            >
                                {isArchiveAction ? <Archive size={18} /> : <Trash2 size={18} />}
                                {removeLabel}
                            </button>
                        </div>
                    </div>
                    {removeHint && (
                        <div className="mb-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur-sm">
                            {removeHint}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <Users size={18} className="text-white" />
                                <span className="text-xs text-white/80">ผู้เรียน</span>
                            </div>
                            <p className="text-2xl font-bold">{stats.totalEnrolled}</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <Film size={18} className="text-white" />
                                <span className="text-xs text-white/80">บทเรียน</span>
                            </div>
                            <p className="text-2xl font-bold">{stats.lessonsCount}</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <Award size={18} className="text-white" />
                                <span className="text-xs text-white/80">จำนวนรับ</span>
                            </div>
                            <p className="text-2xl font-bold">{stats.maxStudents ?? 'ไม่จำกัด'}</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <Calendar size={18} className="text-white" />
                                <span className="text-xs text-white/80">สิ้นสุดคอร์ส</span>
                            </div>
                            <p className="text-lg font-bold">{formatDate(stats.courseEndAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
