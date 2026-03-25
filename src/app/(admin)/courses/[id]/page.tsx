'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Tag, BookOpen, Film, Calendar, Link2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { courseService } from '@/features/courses/services/courseService';
import type { Course, Lesson } from '@/features/courses/types';
import { CourseHero } from '@/features/courses/components/CourseDetail/CourseHero';
import { CourseLessonsTab } from '@/features/courses/components/CourseDetail/CourseLessonsTab';
import { CourseAssessmentsTab } from '@/features/courses/components/CourseDetail/CourseAssessmentsTab';
import { getCourseAudienceLabel } from '@/features/courses/utils/audience';
import {
    canCourseBeHardDeleted,
    getCourseArchiveSummary,
    getCourseDeletionBlockerItems,
    getCourseDeletionSummary,
} from '@/features/courses/utils/deletion';

type CourseTab = 'overview' | 'lessons' | 'assessments';

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

function formatPrice(price?: number | null) {
    const parsedPrice = Number(price || 0);
    return parsedPrice <= 0 ? 'ฟรี' : `฿${parsedPrice.toLocaleString()}`;
}

function getCategoryName(course: Course) {
    return typeof course.category === 'object' ? course.category?.name || '-' : course.category || '-';
}

function getSubcategoryName(course: Course) {
    return typeof course.subcategory === 'object' ? course.subcategory?.name || '-' : '-';
}

function getCourseTypeLabel(price?: number | null) {
    return (Number(price) || 0) > 0 ? 'เสียค่าใช้จ่าย' : 'ฟรี';
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<CourseTab>('overview');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCourse() {
            try {
                setIsLoading(true);
                setPageError(null);
                const data = await courseService.getCourse(id);
                setCourse(data);
            } catch (error) {
                setPageError(error instanceof Error ? error.message : 'ไม่พบคอร์สนี้');
            } finally {
                setIsLoading(false);
            }
        }

        void loadCourse();
    }, [id]);

    const lessons = useMemo(() => (Array.isArray(course?.lessons) ? course?.lessons : []) as Lesson[], [course?.lessons]);
    const relatedCourses = useMemo(() => (Array.isArray(course?.relatedCourses) ? course.relatedCourses : []), [course?.relatedCourses]);

    const lessonDocumentCount = lessons.reduce((sum, lesson) => sum + (lesson.documents?.length || 0), 0);
    const lessonQuizCount = lessons.filter((lesson) => lesson.hasQuiz || lesson.lessonQuiz).length;
    const interactiveQuestionCount = lessons.reduce((sum, lesson) => sum + (lesson.videoQuestions?.length || 0), 0);
    const canHardDelete = canCourseBeHardDeleted(course);
    const isArchived = String(course?.status || 'DRAFT').toUpperCase() === 'ARCHIVED';
    const blockerItems = getCourseDeletionBlockerItems(course).filter((item) => item.count > 0);
    const removalHint = canHardDelete ? null : getCourseArchiveSummary(course);

    const handleRemove = async () => {
        setShowDeleteModal(false);
        try {
            if (canHardDelete) {
                await courseService.deleteCourse(Number(id));
                router.push('/courses');
                return;
            }

            const updatedCourse = await courseService.archiveCourse(Number(id));
            setCourse(updatedCourse);
            setPageError(null);
        } catch (error) {
            try {
                const refreshedCourse = await courseService.getCourse(id);
                setCourse(refreshedCourse);
            } catch {
                // Preserve the original action error if refresh fails.
            }
            setPageError(error instanceof Error ? error.message : 'จัดการคอร์สไม่สำเร็จ');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (pageError || !course) {
        return (
            <div className="py-20 text-center">
                <p className="text-lg text-slate-500">{pageError || 'ไม่พบคอร์ส'}</p>
                <Link href="/courses" className="mt-4 inline-block text-blue-500 hover:underline">กลับหน้ารายการคอร์ส</Link>
            </div>
        );
    }

    const tabs: Array<{ id: CourseTab; label: string }> = [
        { id: 'overview', label: 'ภาพรวม' },
        { id: 'lessons', label: 'บทเรียน' },
        { id: 'assessments', label: 'Assessment' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/courses" className="rounded-xl p-2 transition-all hover:bg-blue-50">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">รายละเอียดคอร์ส</h1>
                    <p className="text-slate-500">ภาพรวมคอร์ส บทเรียน และแบบทดสอบจากข้อมูลจริง</p>
                </div>
            </div>

            {pageError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {pageError}
                </div>
            )}

            <CourseHero
                course={course}
                stats={{
                    totalEnrolled: Number(course.enrolledCount ?? course.enrollmentsCount ?? 0),
                    lessonsCount: lessons.length,
                    maxStudents: course.maxStudents ?? null,
                    courseEndAt: course.courseEndAt,
                }}
                onRemove={() => !isArchived && setShowDeleteModal(true)}
                removeLabel={canHardDelete ? 'ลบคอร์ส' : isArchived ? 'เก็บถาวรแล้ว' : 'เก็บถาวร'}
                removeVariant={canHardDelete ? 'delete' : 'archive'}
                removeDisabled={isArchived}
                removeHint={isArchived ? 'คอร์สนี้ถูกเก็บถาวรแล้ว จึงไม่สามารถลบถาวรได้' : removalHint}
            />

            {!canHardDelete && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                    <p className="font-semibold">คอร์สนี้ลบถาวรไม่ได้</p>
                    <p className="mt-1">{getCourseDeletionSummary(course)}</p>
                    {blockerItems.length > 0 && (
                        <p className="mt-2 text-amber-800">
                            {blockerItems.map((item) => `${item.label} ${item.count}`).join(' • ')}
                        </p>
                    )}
                </div>
            )}

            <div className="flex border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-6 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? 'text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-violet-600" />}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                                <BookOpen size={20} className="text-violet-500" />
                                รายละเอียดคอร์ส
                            </h2>
                            <p className="whitespace-pre-line leading-relaxed text-slate-600">
                                {course.details || course.description || '-'}
                            </p>
                        </div>

                        {relatedCourses.length > 0 && (
                            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                                    <Link2 size={20} className="text-violet-500" />
                                    คอร์สที่เกี่ยวข้อง
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {relatedCourses.map((relatedCourse) => (
                                        <Link
                                            key={relatedCourse.id}
                                            href={`/courses/${relatedCourse.id}`}
                                            className="rounded-xl border border-slate-200 p-4 transition-all hover:border-violet-300 hover:shadow-sm"
                                        >
                                            <p className="font-semibold text-slate-800">{relatedCourse.title}</p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                ผู้สอน: {relatedCourse.authorName || 'ไม่ระบุ'}
                                            </p>
                                            <p className="mt-2 text-xs text-slate-400">
                                                ผู้เรียน {Number(relatedCourse.enrolledCount ?? relatedCourse.enrollmentsCount ?? 0)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Tag size={18} className="text-violet-500" />
                                ข้อมูลคอร์ส
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">ผู้สอน</span>
                                    <span className="font-medium text-slate-800">{course.authorName || 'ไม่ระบุ'}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">หมวดหลัก</span>
                                    <span className="font-medium text-slate-800">{getCategoryName(course)}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">กลุ่มผู้เรียน</span>
                                    <span className="font-medium text-slate-800">{getCourseAudienceLabel(course.audience)}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">หมวดหมู่ย่อย</span>
                                    <span className="font-medium text-slate-800">{getSubcategoryName(course)}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">ประเภทคอร์ส</span>
                                    <span className="font-medium text-slate-800">{getCourseTypeLabel(course.price)}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">ราคา</span>
                                    <span className="font-medium text-slate-800">{formatPrice(course.price)}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">ใบรับรอง</span>
                                    <span className="font-medium text-slate-800">{course.hasCertificate ? 'มี' : 'ไม่มี'}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">CPE Credits</span>
                                    <span className="font-medium text-slate-800">{course.cpeCredits ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 py-2">
                                    <span className="text-slate-500">จำนวนรับ</span>
                                    <span className="font-medium text-slate-800">{course.maxStudents ?? 'ไม่จำกัด'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-slate-500">วันสิ้นสุดคอร์ส</span>
                                    <span className="font-medium text-slate-800">{formatDate(course.courseEndAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Film size={18} className="text-violet-500" />
                                สรุปเนื้อหา
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">บทเรียน</p>
                                    <p className="text-2xl font-bold text-slate-800">{lessons.length}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">เอกสาร</p>
                                    <p className="text-2xl font-bold text-slate-800">{lessonDocumentCount}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">Interactive Questions</p>
                                    <p className="text-2xl font-bold text-slate-800">{interactiveQuestionCount}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">Lesson Quizzes</p>
                                    <p className="text-2xl font-bold text-slate-800">{lessonQuizCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Calendar size={18} className="text-violet-500" />
                                ไทม์ไลน์
                            </h2>
                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>สร้างเมื่อ</span>
                                    <span className="font-medium text-slate-800">{formatDate(course.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>อัปเดตล่าสุด</span>
                                    <span className="font-medium text-slate-800">{formatDate(course.updatedAt)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>เผยแพร่เมื่อ</span>
                                    <span className="font-medium text-slate-800">{formatDate(course.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'lessons' && <CourseLessonsTab lessons={lessons} />}

            {activeTab === 'assessments' && (
                <CourseAssessmentsTab
                    exam={course.exam || null}
                    lessons={lessons}
                />
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-6">
                            <h3 className="text-xl font-bold text-slate-800">
                                {canHardDelete ? 'ยืนยันการลบคอร์ส' : 'ยืนยันการเก็บถาวรคอร์ส'}
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 text-slate-600">
                                {canHardDelete
                                    ? <>คุณต้องการลบคอร์ส "<span className="font-semibold">{course.title}</span>" ใช่หรือไม่?</>
                                    : <>คอร์ส "<span className="font-semibold">{course.title}</span>" มีประวัติใช้งานแล้ว คุณต้องการย้ายไปเก็บถาวรแทนการลบใช่หรือไม่?</>}
                            </p>
                            {canHardDelete ? (
                                <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                </p>
                            ) : (
                                <div className="mb-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                                    <p>{getCourseArchiveSummary(course)}</p>
                                    {blockerItems.length > 0 && (
                                        <p className="mt-2">
                                            {blockerItems.map((item) => `${item.label} ${item.count}`).join(' • ')}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white ${
                                        canHardDelete
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-amber-600 hover:bg-amber-700'
                                    }`}
                                >
                                    {canHardDelete ? 'ลบคอร์ส' : 'เก็บถาวร'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
