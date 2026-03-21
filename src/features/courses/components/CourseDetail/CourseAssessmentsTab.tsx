import { HelpCircle, FileQuestion, CheckCircle, Clock, FileText } from 'lucide-react';
import type { Exam, Lesson } from '../../types';

interface CourseAssessmentsTabProps {
    exam: Exam | null;
    lessons: Lesson[];
}

function formatTimeLimit(minutes?: number | null) {
    if (!minutes || minutes <= 0) {
        return 'ไม่จำกัด';
    }

    return `${minutes} นาที`;
}

function formatDuration(seconds?: number | null) {
    if (!seconds || seconds < 0) {
        return '0:00';
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getQuestionTypeLabel(questionType?: string) {
    if (questionType === 'TRUE_FALSE') {
        return 'จริง/เท็จ';
    }

    if (questionType === 'SHORT_ANSWER' || questionType === 'FREE_TEXT') {
        return 'เขียนตอบ';
    }

    return 'ตัวเลือก';
}

export function CourseAssessmentsTab({ exam, lessons }: CourseAssessmentsTabProps) {
    const totalInteractiveQuestions = lessons.reduce((sum, lesson) => sum + (lesson.videoQuestions?.length || 0), 0);
    const totalLessonQuizzes = lessons.filter((lesson) => lesson.hasQuiz || lesson.lessonQuiz).length;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-violet-600">
                        <CheckCircle size={18} />
                        <span className="text-sm font-semibold">Final Exam</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{exam?.questions?.length || 0}</p>
                    <p className="text-sm text-slate-500">จำนวนคำถามท้ายคอร์ส</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-orange-600">
                        <HelpCircle size={18} />
                        <span className="text-sm font-semibold">Interactive</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{totalInteractiveQuestions}</p>
                    <p className="text-sm text-slate-500">คำถามระหว่างเรียน</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-emerald-600">
                        <FileQuestion size={18} />
                        <span className="text-sm font-semibold">Lesson Quiz</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{totalLessonQuizzes}</p>
                    <p className="text-sm text-slate-500">บทเรียนที่มี quiz ท้ายบท</p>
                </div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white shadow-md">
                <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-6">
                    <h3 className="text-lg font-bold text-slate-800">แบบทดสอบท้ายคอร์ส</h3>
                </div>
                {!exam ? (
                    <div className="p-6 text-sm text-slate-500">ยังไม่มีแบบทดสอบท้ายคอร์ส</div>
                ) : (
                    <div className="space-y-4 p-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">ชื่อแบบทดสอบ</p>
                                <p className="font-semibold text-slate-800">{exam.title}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">คะแนนผ่าน</p>
                                <p className="font-semibold text-slate-800">{exam.passingScorePercent || 70}%</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">เวลาทำข้อสอบ</p>
                                <p className="font-semibold text-slate-800">{formatTimeLimit(exam.timeLimitMinutes)}</p>
                            </div>
                        </div>
                        {exam.questions && exam.questions.length > 0 && (
                            <div className="space-y-2">
                                {exam.questions.slice(0, 5).map((question, index) => (
                                    <div key={question.id} className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-violet-600">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-800">{question.questionText}</p>
                                            <p className="text-xs text-slate-500">
                                                {question.scoreWeight || 1} คะแนน
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-md">
                <div className="border-b border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-bold text-slate-800">Assessment รายบทเรียน</h3>
                </div>
                <div className="space-y-3 p-6">
                    {lessons.length === 0 ? (
                        <div className="text-sm text-slate-500">ยังไม่มีบทเรียน</div>
                    ) : (
                        lessons.map((lesson, index) => {
                            const lessonQuizQuestionCount = lesson.lessonQuiz?.questions?.length || 0;
                            return (
                                <div key={lesson.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="mb-3 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {index + 1}. {lesson.title}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Interactive {lesson.videoQuestions?.length || 0} คำถาม • Lesson Quiz {lessonQuizQuestionCount} คำถาม
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                                                Interactive {lesson.videoQuestions?.length || 0}
                                            </span>
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                                                Quiz {lessonQuizQuestionCount}
                                            </span>
                                            <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">
                                                PDF {lesson.documents?.length || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="rounded-xl bg-orange-50 p-3">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-700">
                                                <Clock size={14} />
                                                คำถาม Interactive
                                            </div>
                                            {lesson.videoQuestions && lesson.videoQuestions.length > 0 ? (
                                                <div className="space-y-2">
                                                    {lesson.videoQuestions.slice(0, 3).map((question) => (
                                                        <div key={question.id} className="rounded-lg bg-white/70 px-3 py-2">
                                                            <p className="text-sm font-medium text-slate-700">{question.questionText}</p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                เวลา {formatDuration(question.displayAtSeconds)} • {getQuestionTypeLabel(question.questionType)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500">ไม่มีคำถาม interactive</p>
                                            )}
                                        </div>

                                        <div className="rounded-xl bg-emerald-50 p-3">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                                <FileQuestion size={14} />
                                                Quiz ท้ายบท
                                            </div>
                                            {lesson.lessonQuiz ? (
                                                <div className="space-y-1 text-sm text-slate-700">
                                                    <p>คะแนนผ่าน: {lesson.lessonQuiz.passingScorePercent || 70}%</p>
                                                    <p>จำนวนคำถาม: {lessonQuizQuestionCount}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500">ยังไม่มี quiz ท้ายบท</p>
                                            )}
                                        </div>
                                    </div>

                                    {(lesson.documents?.length || 0) > 0 && (
                                        <div className="mt-3 rounded-xl bg-slate-50 p-3">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                <FileText size={14} />
                                                เอกสารประกอบ
                                            </div>
                                            <div className="space-y-1">
                                                {lesson.documents?.slice(0, 3).map((document) => (
                                                    <p key={document.id} className="text-sm text-slate-600">
                                                        {document.fileName}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
