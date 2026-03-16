import { PlayCircle, Clock, GripVertical } from 'lucide-react';
import type { Lesson } from '../../types';

interface CourseLessonsTabProps {
    lessons: Lesson[];
}

export function CourseLessonsTab({ lessons }: CourseLessonsTabProps) {
    if (lessons.length === 0) {
        return (
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-dashed border-violet-200 p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <PlayCircle size={32} className="text-violet-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มีบทเรียน</h3>
                <p className="text-slate-500">คอร์สนี้ยังไม่มีบทเรียน กรุณาเพิ่มบทเรียนในหน้าแก้ไขคอร์ส</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {lessons.map((lesson, index) => (
                <div
                    key={lesson.id}
                    className="group bg-white border border-violet-100 rounded-xl p-5 hover:shadow-md hover:border-violet-200 transition-all"
                >
                    <div className="flex items-center gap-4">
                        {/* Drag Handle */}
                        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={20} className="text-slate-400" />
                        </div>

                        {/* Lesson Number */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {index + 1}
                            </div>
                        </div>

                        {/* Lesson Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-800 mb-1 truncate">{lesson.title}</h4>
                                    {lesson.description && (
                                        <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    {/* Duration Badge */}
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg">
                                        <Clock size={14} />
                                        <span className="text-sm font-medium">{lesson.duration}</span>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg">
                                        <PlayCircle size={14} />
                                        <span className="text-sm font-medium">วิดีโอ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Summary */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-4 mt-6">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">รวมทั้งหมด</span>
                    <div className="flex items-center gap-4">
                        <span className="text-violet-600 font-bold">{lessons.length} บทเรียน</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                            เวลารวม: {lessons.reduce((acc, l) => {
                                const [hours, mins] = (l.duration || '0:00').split(':').map(Number);
                                return acc + (hours || 0) * 60 + (mins || 0);
                            }, 0)} นาที
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
