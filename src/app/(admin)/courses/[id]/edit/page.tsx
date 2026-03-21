'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Image as ImageIcon, Save, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AddLessonModal } from '@/features/courses/components/CourseForm/AddLessonModal';
import { AddQuestionModal } from '@/features/courses/components/CourseForm/AddQuestionModal';
import { CECreditsSection } from '@/features/courses/components/CourseForm/CECreditsSection';
import { ContentSection } from '@/features/courses/components/CourseForm/ContentSection';
import { CourseVideoSection } from '@/features/courses/components/CourseForm/CourseVideoSection';
import { DeleteLessonModal } from '@/features/courses/components/CourseForm/DeleteLessonModal';
import { DeleteQuestionModal } from '@/features/courses/components/CourseForm/DeleteQuestionModal';
import { EditLessonModal } from '@/features/courses/components/CourseForm/EditLessonModal';
import { ExamSection } from '@/features/courses/components/CourseForm/ExamSection';
import { InteractiveQuestionSection } from '@/features/courses/components/CourseForm/InteractiveQuestionSection';
import { LessonQuizSection } from '@/features/courses/components/CourseForm/LessonQuizSection';
import { PricingSection } from '@/features/courses/components/CourseForm/PricingSection';
import { useCourseForm, type FormLesson } from '@/features/courses/hooks/useCourseForm';
import { courseService } from '@/features/courses/services/courseService';
import { examService } from '@/features/courses/services/examService';
import type { Category } from '@/features/courses/types/categories';
import type { Course, ExamSettings, Lesson, Question, QuestionOption, QuestionType } from '@/features/courses/types';

const DEFAULT_EXAM_SETTINGS: ExamSettings = {
    minPassingScore: 70,
    timeLimit: 'unlimited',
};

function toLegacyQuestionType(questionType?: QuestionType): QuestionType {
    if (questionType === 'MULTIPLE_CHOICE') return 'multiple-choice';
    if (questionType === 'FREE_TEXT' || questionType === 'SHORT_ANSWER') return 'free-text';
    return questionType || 'multiple-choice';
}

function toApiQuestionType(questionType?: QuestionType): 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' {
    return questionType === 'MULTIPLE_CHOICE' || questionType === 'multiple-choice'
        ? 'MULTIPLE_CHOICE'
        : 'SHORT_ANSWER';
}

function normalizeLessonForPage(lesson: Lesson): FormLesson {
    return {
        ...lesson,
        videoQuestions: Array.isArray(lesson.videoQuestions) ? lesson.videoQuestions : [],
        documents: Array.isArray(lesson.documents) ? lesson.documents : [],
    };
}

function mapExamQuestionToForm(question: {
    id: number | string;
    questionText?: string | null;
    questionType?: QuestionType;
    options?: QuestionOption[] | null;
    correctAnswer?: string | null;
    scoreWeight?: number | null;
}): Question {
    const type = toLegacyQuestionType(question.questionType);
    return {
        id: String(question.id),
        type,
        examType: 'final-exam',
        question: question.questionText || '',
        options: Array.isArray(question.options)
            ? question.options.map((option, index) => ({
                id: option.id || `${index + 1}`,
                text: option.text,
                isCorrect: option.isCorrect || option.text === question.correctAnswer,
            }))
            : undefined,
        correctAnswer: question.correctAnswer || undefined,
        points: question.scoreWeight || 1,
    };
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'basic' | 'curriculum' | 'assessment' | 'settings'>('basic');
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [pageError, setPageError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [examId, setExamId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [examSettings, setExamSettings] = useState<ExamSettings>(DEFAULT_EXAM_SETTINGS);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

    const {
        title, setTitle,
        actionError,
        setActionError,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        price, setPrice,
        cpeCredits, setCpeCredits,
        conferenceCode, setConferenceCode,
        language, setLanguage,
        hasCertificate, setHasCertificate,
        maxStudents, setMaxStudents,
        enrollmentDeadline, setEnrollmentDeadline,
        courseEndAt, setCourseEndAt,
        authorName, setAuthorName,
        relatedCourseIds, setRelatedCourseIds,
        enrolledCount,
        thumbnailPreview,
        thumbnailError,
        handleThumbnailSelect,
        saveCourse,
        uploadedVideos,
        handleAddVideo,
        handleDeleteVideo,
        lessons,
        setLessons,
        newLesson,
        currentLesson,
        setNewLesson,
        setCurrentLesson,
        courseType,
        setCourseType,
        ceEnabled,
        setCeEnabled,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,
        handleAddLesson,
        handleEditLesson,
        handleDeleteLesson,
        openEditModal,
        openDeleteModal,
        previewVideoId,
        handleSetPreviewVideo,
        status,
        setStatus,
    } = useCourseForm(id);

    const relatedCourseOptions = useMemo(
        () => availableCourses.filter((course) => String(course.id) !== String(id)),
        [availableCourses, id]
    );

    const selectedLesson = useMemo(
        () => lessons.find((lesson) => String(lesson.id) === String(selectedLessonId)) || null,
        [lessons, selectedLessonId]
    );

    useEffect(() => {
        const loadStaticData = async () => {
            try {
                const [categoriesResponse, coursesResponse] = await Promise.all([
                    courseService.getCategories(),
                    courseService.getCourses(),
                ]);
                setCategories(categoriesResponse.categories);
                setAvailableCourses(coursesResponse.courses);
            } catch (error) {
                setPageError(error instanceof Error ? error.message : 'โหลดข้อมูลไม่สำเร็จ');
            }
        };

        void loadStaticData();
    }, []);

    useEffect(() => {
        const loadExam = async () => {
            try {
                const examData = await examService.getExam(Number(id));
                if (!examData.exam) {
                    setExamId(null);
                    setQuestions([]);
                    setExamSettings(DEFAULT_EXAM_SETTINGS);
                    return;
                }

                setExamId(Number(examData.exam.id));
                setQuestions(
                    Array.isArray(examData.exam.questions)
                        ? examData.exam.questions.map((question) => mapExamQuestionToForm(question))
                        : []
                );
                setExamSettings({
                    minPassingScore: examData.exam.passingScorePercent || 70,
                    timeLimit: examData.exam.timeLimitMinutes && examData.exam.timeLimitMinutes > 0
                        ? examData.exam.timeLimitMinutes
                        : 'unlimited',
                });
            } catch (error) {
                setPageError(error instanceof Error ? error.message : 'โหลดข้อมูลแบบทดสอบไม่สำเร็จ');
            }
        };

        void loadExam();
    }, [id]);

    useEffect(() => {
        if (!selectedLessonId && lessons.length > 0) {
            setSelectedLessonId(String(lessons[0].id));
            return;
        }

        if (selectedLessonId && !lessons.some((lesson) => String(lesson.id) === String(selectedLessonId))) {
            setSelectedLessonId(lessons.length > 0 ? String(lessons[0].id) : null);
        }
    }, [lessons, selectedLessonId]);

    const replaceLessonInState = (updatedLesson: Lesson) => {
        setLessons((currentLessons) =>
            currentLessons.map((lesson) =>
                String(lesson.id) === String(updatedLesson.id)
                    ? { ...lesson, ...normalizeLessonForPage(updatedLesson) }
                    : lesson
            )
        );
    };

    const refreshExam = async () => {
        const examData = await examService.getExam(Number(id));
        if (!examData.exam) {
            setExamId(null);
            setQuestions([]);
            return;
        }

        setExamId(Number(examData.exam.id));
        setQuestions(
            Array.isArray(examData.exam.questions)
                ? examData.exam.questions.map((question) => mapExamQuestionToForm(question))
                : []
        );
        setExamSettings({
            minPassingScore: examData.exam.passingScorePercent || 70,
            timeLimit: examData.exam.timeLimitMinutes && examData.exam.timeLimitMinutes > 0
                ? examData.exam.timeLimitMinutes
                : 'unlimited',
        });
    };

    const ensureExam = async () => {
        if (examId) {
            await examService.updateExam(examId, {
                passingScorePercent: examSettings.minPassingScore,
                timeLimitMinutes: examSettings.timeLimit === 'unlimited' ? undefined : Number(examSettings.timeLimit),
            });
            return examId;
        }

        const exam = await examService.saveExam({
            courseId: Number(id),
            title: `${title || 'Course'} Final Exam`,
            description: title ? `แบบทดสอบท้ายคอร์ส: ${title}` : 'แบบทดสอบท้ายคอร์ส',
            passingScorePercent: examSettings.minPassingScore,
            timeLimitMinutes: examSettings.timeLimit === 'unlimited' ? undefined : Number(examSettings.timeLimit),
        });
        const nextExamId = Number(exam.id);
        setExamId(nextExamId);
        return nextExamId;
    };

    const persistExamSettings = async () => {
        const shouldPersist =
            examId !== null ||
            questions.length > 0 ||
            examSettings.minPassingScore !== DEFAULT_EXAM_SETTINGS.minPassingScore ||
            examSettings.timeLimit !== DEFAULT_EXAM_SETTINGS.timeLimit;

        if (!shouldPersist) {
            return;
        }

        await ensureExam();
        await refreshExam();
    };

    const handleSave = async () => {
        setIsSaving(true);
        setPageError('');
        setActionError('');

        try {
            await persistExamSettings();
            await saveCourse();
            router.push('/courses');
            router.refresh();
        } catch (error) {
            setPageError(error instanceof Error ? error.message : 'บันทึกข้อมูลไม่สำเร็จ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExamQuestionSubmit = async (questionData: {
        type: QuestionType;
        examType: 'final-exam' | 'interactive';
        question: string;
        options?: QuestionOption[];
        correctAnswer?: string;
        points?: number;
    }) => {
        const payload = {
            questionText: questionData.question.trim(),
            questionType: toApiQuestionType(questionData.type),
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            scoreWeight: questionData.points || 1,
        };

        try {
            const resolvedExamId = await ensureExam();
            if (editingQuestion) {
                await examService.updateExamQuestion(Number(editingQuestion.id), payload);
            } else {
                await examService.addExamQuestion({ examId: resolvedExamId, ...payload });
            }

            await refreshExam();
            setEditingQuestion(null);
            setIsQuestionModalOpen(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'บันทึกคำถามไม่สำเร็จ';
            setPageError(message);
            throw error;
        }
    };

    const tabs = [
        { id: 'basic', label: 'ข้อมูลทั่วไป' },
        { id: 'curriculum', label: 'หลักสูตร' },
        { id: 'assessment', label: 'แบบทดสอบ' },
        { id: 'settings', label: 'ตั้งค่า' },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/courses/${id}`} className="rounded-xl p-2 transition-all hover:bg-sky-50">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขคอร์ส</h1>
                        <p className="text-slate-500">จัดการข้อมูลคอร์ส บทเรียน และ assessment</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 disabled:opacity-50"
                >
                    <Save size={18} />
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
            </div>

            {pageError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {pageError}
                </div>
            )}

            {actionError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                    {actionError}
                </div>
            )}

            <div className="flex border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-6 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-sky-600" />}
                    </button>
                ))}
            </div>

            {activeTab === 'basic' && (
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-md">
                        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                            ส่วนนี้เป็นข้อมูลหลักของคอร์สที่จะแสดงให้ผู้เรียนเห็นในหน้ารายการคอร์สและหน้ารายละเอียดคอร์ส
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    ชื่อคอร์ส <span className="text-red-500">*</span>
                                </label>
                                <p className="mb-2 text-xs text-slate-500">ใช้เป็นชื่อหลักของคอร์สในทุกหน้า</p>
                                <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="เช่น การให้บริการเภสัชกรรมทางไกล รุ่นที่ 17" className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    คำอธิบายโดยย่อ <span className="text-red-500">*</span>
                                </label>
                                <p className="mb-2 text-xs text-slate-500">สรุปสั้น ๆ เพื่อให้ผู้เรียนรู้ว่าคอร์สนี้เกี่ยวกับอะไร</p>
                                <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="อธิบายคอร์สแบบสั้น กระชับ และอ่านเข้าใจง่าย" className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    รายละเอียดคอร์ส <span className="text-red-500">*</span>
                                </label>
                                <p className="mb-2 text-xs text-slate-500">ใช้สำหรับอธิบายเนื้อหา สิ่งที่ผู้เรียนจะได้รับ และรายละเอียดเชิงลึกของคอร์ส</p>
                                <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={6} placeholder="อธิบายรายละเอียดคอร์สแบบเต็ม" className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    ชื่อผู้สอน <span className="text-red-500">*</span>
                                </label>
                                <p className="mb-2 text-xs text-slate-500">ชื่อผู้สอนหรือทีมวิทยากรที่จะโชว์ในหน้า Course Details</p>
                                <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} placeholder="เช่น ภญ.สมใจ รักเรียน" className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        หมวดหมู่หลัก <span className="text-red-500">*</span>
                                    </label>
                                    <p className="mb-2 text-xs text-slate-500">เลือกวิทยาลัยหรือหมวดหลักที่คอร์สนี้สังกัด</p>
                                    <select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); }} className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400">
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md">
                            <div className="mb-4">
                                <h3 className="text-base font-bold text-slate-800">รูปปกคอร์ส</h3>
                                <p className="mt-1 text-xs text-slate-500">รูปนี้จะใช้เป็นภาพหน้าปกในหน้ารายการคอร์สและหน้า Course Details</p>
                            </div>
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="thumbnail" className="aspect-video w-full rounded-xl object-cover" />
                            ) : (
                                <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50">
                                    <ImageIcon size={28} className="text-sky-400" />
                                </div>
                            )}
                            <input
                                id="edit-course-thumbnail"
                                type="file"
                                accept="image/*"
                                className="mt-4 block w-full text-sm"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) handleThumbnailSelect(file);
                                }}
                            />
                            {thumbnailError && <p className="mt-2 text-sm font-semibold text-red-600">{thumbnailError}</p>}
                        </div>
                        <CourseVideoSection
                            videos={uploadedVideos.filter((video) => video.id === previewVideoId)}
                            onAddVideo={(video) => {
                                handleAddVideo(video);
                                handleSetPreviewVideo(video.id);
                            }}
                            onDeleteVideo={handleDeleteVideo}
                            previewVideoId={previewVideoId}
                            onSelectPreview={handleSetPreviewVideo}
                            title="วิดีโอตัวอย่าง"
                            description="วิดีโอแนะนำคอร์ส"
                            showPreviewAsBadge={true}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'curriculum' && (
                <div className="space-y-6">
                    <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                        ส่วนนี้ใช้จัดการวิดีโอและบทเรียนของคอร์ส ให้เพิ่มวิดีโอที่ต้องใช้ก่อน แล้วค่อยผูกวิดีโอเข้ากับแต่ละบทเรียน
                    </div>
                    <CourseVideoSection
                        videos={uploadedVideos}
                        onAddVideo={handleAddVideo}
                        onDeleteVideo={handleDeleteVideo}
                        previewVideoId={previewVideoId}
                        onSelectPreview={handleSetPreviewVideo}
                    />
                    <ContentSection
                        lessons={lessons}
                        onAddClick={() => setShowAddModal(true)}
                        onEdit={(lesson) => openEditModal(normalizeLessonForPage(lesson))}
                        onDelete={(lesson) => openDeleteModal(normalizeLessonForPage(lesson))}
                    />
                </div>
            )}

            {activeTab === 'assessment' && (
                <div className="space-y-8">
                    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-md">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                            <BookOpen size={20} className="text-orange-500" />
                            Assessment รายบทเรียน
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            เลือกบทเรียนที่ต้องการก่อน จากนั้นเพิ่มคำถามระหว่างวิดีโอและแบบทดสอบท้ายบทของบทเรียนนั้น
                        </p>
                        <select
                            value={selectedLessonId || ''}
                            onChange={(event) => setSelectedLessonId(event.target.value || null)}
                            className="mt-4 w-full rounded-xl border border-orange-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="">เลือกบทเรียน</option>
                            {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
                        </select>
                    </div>

                    {selectedLesson ? (
                        <>
                            <InteractiveQuestionSection lesson={selectedLesson} onLessonChange={replaceLessonInState} />
                            <LessonQuizSection lesson={selectedLesson} onLessonChange={replaceLessonInState} />
                        </>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                            เลือกบทเรียนก่อนเพื่อจัดการคำถามและแบบทดสอบท้ายบท
                        </div>
                    )}

                    <ExamSection
                        questions={questions}
                        examSettings={examSettings}
                        examId={examId || undefined}
                        onAddClick={() => {
                            setEditingQuestion(null);
                            setIsQuestionModalOpen(true);
                        }}
                        onEdit={(question) => {
                            setEditingQuestion(question);
                            setIsQuestionModalOpen(true);
                        }}
                        onDelete={(question) => setQuestionToDelete(question)}
                        onSettingsChange={setExamSettings}
                        onQuestionsImported={refreshExam}
                    />
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <PricingSection courseType={courseType} onCourseTypeChange={setCourseType} price={price} onPriceChange={setPrice} />
                    <CECreditsSection ceEnabled={ceEnabled} onCeEnabledChange={setCeEnabled} cpeCredits={cpeCredits} onCpeCreditsChange={setCpeCredits} conferenceCode={conferenceCode} onConferenceCodeChange={setConferenceCode} />
                    <div className="space-y-4 rounded-2xl border border-sky-100 bg-white p-6 shadow-md">
                        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                            ส่วนนี้ใช้กำหนดเงื่อนไขของคอร์ส เช่น ภาษา จำนวนรับ วันสิ้นสุด และการออกใบรับรอง
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">ภาษา</label>
                            <p className="mb-2 text-xs text-slate-500">ระบุภาษาหลักที่ใช้สอนหรือใช้ในเอกสารของคอร์ส</p>
                            <input value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="เช่น Thai, English" className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">วันปิดรับสมัคร</label>
                            <p className="mb-2 text-xs text-slate-500">ถ้าต้องการกำหนดวันสุดท้ายที่ผู้เรียนสมัครได้ ให้ระบุวันที่ตรงนี้</p>
                            <input type="date" value={enrollmentDeadline} onChange={(event) => setEnrollmentDeadline(event.target.value)} className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">จำนวนรับสูงสุด</label>
                                <p className="mb-2 text-xs text-slate-500">ใส่จำนวนผู้เรียนที่รับได้สูงสุด ถ้าไม่จำกัดให้เว้นว่างหรือใส่ 0</p>
                                <input type="number" min={0} value={maxStudents || ''} onChange={(event) => setMaxStudents(Number(event.target.value) || 0)} placeholder="เช่น 100" className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">วันสิ้นสุดคอร์ส</label>
                                <p className="mb-2 text-xs text-slate-500">กำหนดวันสิ้นสุดการเรียนของคอร์สนี้</p>
                                <input type="date" value={courseEndAt} onChange={(event) => setCourseEndAt(event.target.value)} className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                            </div>
                        </div>
                        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div>
                                <span className="font-semibold text-slate-700">ออกใบรับรอง</span>
                                <p className="mt-1 text-xs text-slate-500">เปิดใช้เมื่อต้องการให้ผู้เรียนได้รับ certificate หลังเรียนจบ</p>
                            </div>
                            <input type="checkbox" checked={hasCertificate} onChange={(event) => setHasCertificate(event.target.checked)} className="h-5 w-5" />
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="rounded-xl bg-sky-100 p-2 text-sky-600"><Users size={18} /></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">ผู้เข้าเรียนปัจจุบัน</p>
                                <p className="text-2xl font-bold text-slate-900">{enrolledCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 rounded-2xl border border-sky-100 bg-white p-6 shadow-md">
                        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                            ส่วนนี้ใช้กำหนดสถานะของคอร์สและเลือกคอร์สที่จะแนะนำต่อในหน้า Course Details
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">สถานะคอร์ส</label>
                            <p className="mb-2 text-xs text-slate-500">เลือกว่าคอร์สนี้เป็นฉบับร่าง เผยแพร่ หรือเก็บถาวร</p>
                            <select value={status} onChange={(event) => setStatus(event.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')} className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400">
                                <option value="DRAFT">ฉบับร่าง</option>
                                <option value="PUBLISHED">เผยแพร่</option>
                                <option value="ARCHIVED">เก็บถาวร</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">คอร์สที่เกี่ยวข้อง</label>
                            <p className="mb-2 text-xs text-slate-500">เลือกคอร์สที่ต้องการแนะนำให้ผู้เรียนเรียนต่อหลังดูคอร์สนี้</p>
                        </div>
                        <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                            {relatedCourseOptions.map((course) => {
                                const courseIdValue = Number(course.id);
                                return (
                                    <label key={courseIdValue} className="flex items-start gap-3 rounded-lg bg-white px-3 py-2">
                                        <input
                                            type="checkbox"
                                            checked={relatedCourseIds.includes(courseIdValue)}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setRelatedCourseIds([...relatedCourseIds, courseIdValue]);
                                                    return;
                                                }
                                                setRelatedCourseIds(relatedCourseIds.filter((relatedCourseId) => relatedCourseId !== courseIdValue));
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-700">{course.title}</p>
                                            <p className="truncate text-xs text-slate-500">{course.authorName || 'ไม่ระบุผู้สอน'}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <AddLessonModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddLesson} lessonData={newLesson} onChange={setNewLesson} availableVideos={uploadedVideos} onVideoUpload={handleAddVideo} />
            <EditLessonModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setCurrentLesson(null); }} onSave={handleEditLesson} lesson={currentLesson} onChange={(lesson) => setCurrentLesson(normalizeLessonForPage(lesson))} availableVideos={uploadedVideos} onVideoUpload={handleAddVideo} />
            <DeleteLessonModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setCurrentLesson(null); }} onConfirm={handleDeleteLesson} lesson={currentLesson} />
            <AddQuestionModal isOpen={isQuestionModalOpen} onClose={() => { setIsQuestionModalOpen(false); setEditingQuestion(null); }} onAdd={handleExamQuestionSubmit} initialQuestion={editingQuestion} title={editingQuestion ? 'แก้ไขคำถามแบบทดสอบ' : 'เพิ่มคำถามแบบทดสอบ'} description="จัดการคำถามสำหรับแบบทดสอบท้ายคอร์ส" submitLabel={editingQuestion ? 'บันทึกการแก้ไข' : 'เพิ่มคำถาม'} />
            <DeleteQuestionModal isOpen={Boolean(questionToDelete)} onClose={() => setQuestionToDelete(null)} onConfirm={async () => {
                if (!questionToDelete) return;
                try {
                    await examService.deleteExamQuestion(Number(questionToDelete.id));
                    await refreshExam();
                    setQuestionToDelete(null);
                } catch (error) {
                    setPageError(error instanceof Error ? error.message : 'ลบคำถามไม่สำเร็จ');
                }
            }} question={questionToDelete} />
        </div>
    );
}
