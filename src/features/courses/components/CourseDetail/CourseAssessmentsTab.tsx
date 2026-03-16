import { HelpCircle, Clock, CheckCircle, Edit, Settings, Play, ChevronDown, ChevronRight } from 'lucide-react';
import type { Exam, ExamQuestion, Lesson, VideoQuestion, QuestionType } from '../../types';
import { useState } from 'react';

interface CourseAssessmentsTabProps {
    exam: Exam | null;
    lessons: Lesson[];
    onEditExam?: () => void;
    onEditVideoQuestion?: (lessonId: string | number, questionId: string | number) => void;
}

function formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getQuestionTypeLabel(type: QuestionType | string): string {
    if (type === 'MULTIPLE_CHOICE' || type === 'multiple-choice') return 'ตัวเลือก';
    if (type === 'FREE_TEXT' || type === 'short-answer') return 'เขียนตอบ';
    return type;
}

function getQuestionTypeClass(type: QuestionType | string): string {
    if (type === 'MULTIPLE_CHOICE' || type === 'multiple-choice') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
}

export function CourseAssessmentsTab({ exam, lessons, onEditExam, onEditVideoQuestion }: CourseAssessmentsTabProps) {
    const [expandedLessons, setExpandedLessons] = useState<Set<string | number>>(new Set());

    const totalVideoQuestions = lessons.reduce((sum, lesson) => sum + (lesson.videoQuestions?.length || 0), 0);

    const toggleLesson = (lessonId: string | number) => {
        const newExpanded = new Set(expandedLessons);
        if (newExpanded.has(lessonId)) {
            newExpanded.delete(lessonId);
        } else {
            newExpanded.add(lessonId);
        }
        setExpandedLessons(newExpanded);
    };

    return (
        <div className="space-y-8">
            {/* Exam Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle size={20} className="text-violet-500" />
                        แบบทดสอบหลังเรียน (Exam)
                    </h3>
                    {exam && onEditExam && (
                        <button
                            onClick={onEditExam}
                            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                        >
                            <Edit size={16} />
                            แก้ไขข้อสอบ
                        </button>
                    )}
                </div>

                {!exam ? (
                    <div className="bg-violet-50 rounded-xl border border-violet-200 p-8 text-center">
                        <p className="text-slate-600 mb-4">ยังไม่มีแบบทดสอบหลังเรียน</p>
                        {onEditExam && (
                            <button
                                onClick={onEditExam}
                                className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors"
                            >
                                สร้างแบบทดสอบ
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                        {/* Exam Settings */}
                        <div className="p-6 border-b border-violet-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Settings size={18} className="text-violet-600" />
                                <h4 className="font-semibold text-slate-800">{exam.title || 'แบบทดสอบหลังเรียน'}</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">คะแนนผ่าน</p>
                                    <p className="text-xl font-bold text-violet-600">{exam.passingScorePercent || 80}%</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">เวลาทำ</p>
                                    <p className="text-xl font-bold text-violet-600">{exam.timeLimitMinutes || 30} นาที</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">จำนวนคำถาม</p>
                                    <p className="text-xl font-bold text-violet-600">{exam.questions?.length || 0} ข้อ</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">สถานะ</p>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                                        <CheckCircle size={14} />
                                        พร้อมใช้งาน
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Exam Questions Preview */}
                        {exam.questions && exam.questions.length > 0 && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-slate-600">ตัวอย่างคำถาม</p>
                                    <span className="text-xs text-violet-600">{exam.questions.length} ข้อ</span>
                                </div>
                                <div className="space-y-2">
                                    {exam.questions.slice(0, 3).map((q, index) => (
                                        <div key={q.id} className="bg-white rounded-lg p-3 border border-violet-100 flex items-center gap-3">
                                            <span className="w-6 h-6 bg-violet-100 rounded text-xs font-bold text-violet-600 flex items-center justify-center">
                                                {index + 1}
                                            </span>
                                            <p className="flex-1 text-sm text-slate-700 truncate">{q.questionText}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded ${getQuestionTypeClass(q.questionType)}`}>
                                                {getQuestionTypeLabel(q.questionType)}
                                            </span>
                                        </div>
                                    ))}
                                    {exam.questions.length > 3 && (
                                        <p className="text-center text-xs text-slate-400">+ อีก {exam.questions.length - 3} คำถาม</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* VideoQuestions Section - Grouped by Lesson */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle size={20} className="text-orange-500" />
                        คำถาม Interactive ระหว่างเรียน
                        <span className="text-sm font-normal text-slate-500">({totalVideoQuestions} คำถาม)</span>
                    </h3>
                </div>

                {lessons.length === 0 ? (
                    <div className="bg-orange-50 rounded-xl border border-orange-200 p-8 text-center">
                        <p className="text-slate-600">ยังไม่มีบทเรียน กรุณาเพิ่มบทเรียนก่อน</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lessons.map((lesson) => (
                            <div key={lesson.id} className="bg-white border border-orange-100 rounded-xl overflow-hidden">
                                {/* Lesson Header */}
                                <button
                                    onClick={() => toggleLesson(lesson.id)}
                                    className="w-full px-5 py-4 flex items-center gap-3 hover:bg-orange-50/50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                                        <Play size={16} className="text-orange-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-slate-800">{lesson.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {lesson.videoQuestions?.length || 0} คำถาม Interactive
                                        </p>
                                    </div>
                                    {(lesson.videoQuestions?.length || 0) > 0 && (
                                        expandedLessons.has(lesson.id)
                                            ? <ChevronDown size={20} className="text-slate-400" />
                                            : <ChevronRight size={20} className="text-slate-400" />
                                    )}
                                </button>

                                {/* VideoQuestions List */}
                                {expandedLessons.has(lesson.id) && lesson.videoQuestions && lesson.videoQuestions.length > 0 && (
                                    <div className="px-5 pb-4 pt-0">
                                        <div className="border-t border-orange-100 pt-4 space-y-2">
                                            {lesson.videoQuestions.map((vq, index) => (
                                                <div
                                                    key={vq.id}
                                                    className="bg-orange-50/50 rounded-lg p-3 flex items-start gap-3"
                                                    onClick={() => onEditVideoQuestion?.(lesson.id, vq.id)}
                                                >
                                                    <span className="flex-shrink-0 text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-medium flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatTimestamp(vq.displayAtSeconds ?? 0)}
                                                    </span>
                                                    <p className="flex-1 text-sm text-slate-700">{vq.questionText}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded ${getQuestionTypeClass(vq.questionType)}`}>
                                                        {getQuestionTypeLabel(vq.questionType)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty State for Lesson */}
                                {expandedLessons.has(lesson.id) && (!lesson.videoQuestions || lesson.videoQuestions.length === 0) && (
                                    <div className="px-5 pb-4">
                                        <div className="border-t border-orange-100 pt-4">
                                            <p className="text-sm text-slate-400 text-center py-2">ยังไม่มีคำถาม Interactive ในบทนี้</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
