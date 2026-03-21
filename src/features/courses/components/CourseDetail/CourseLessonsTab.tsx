import { PlayCircle, Clock, FileText, FileQuestion, HelpCircle } from 'lucide-react';
import type { Lesson } from '../../types';

interface CourseLessonsTabProps {
    lessons: Lesson[];
}

function formatDuration(seconds?: number | null) {
    if (!seconds || seconds <= 0) {
        return '-';
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function CourseLessonsTab({ lessons }: CourseLessonsTabProps) {
    if (lessons.length === 0) {
        return (
            <div className="rounded-xl border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <PlayCircle size={32} className="text-violet-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-800">ยังไม่มีบทเรียน</h3>
                <p className="text-slate-500">คอร์สนี้ยังไม่มีบทเรียน กรุณาเพิ่มบทเรียนในหน้าแก้ไขคอร์ส</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {lessons.map((lesson, index) => (
                <div
                    key={lesson.id}
                    className="rounded-xl border border-violet-100 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-md"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 font-bold text-white shadow-sm">
                            {lesson.sequenceOrder || index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-slate-800">{lesson.title}</h4>
                                    {lesson.description && (
                                        <p className="mt-1 text-sm text-slate-500">{lesson.description}</p>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="rounded-full bg-sky-100 px-2.5 py-1 font-medium text-sky-700">
                                        วิดีโอ
                                    </span>
                                    {lesson.hasQuiz && (
                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                                            มี Quiz
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatDuration(lesson.video?.duration)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText size={14} />
                                    {lesson.documents?.length || 0} เอกสาร
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileQuestion size={14} />
                                    {lesson.lessonQuiz?.questions?.length || 0} คำถามท้ายบท
                                </span>
                                <span className="flex items-center gap-1">
                                    <HelpCircle size={14} />
                                    {lesson.videoQuestions?.length || 0} interactive
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-6 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-4">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">รวมทั้งหมด</span>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-violet-600">{lessons.length} บทเรียน</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-medium text-slate-600">
                            {lessons.reduce((sum, lesson) => sum + (lesson.documents?.length || 0), 0)} เอกสาร
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-medium text-slate-600">
                            {lessons.reduce((sum, lesson) => sum + (lesson.videoQuestions?.length || 0), 0)} interactive
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
