import { Video, FileText, Check } from 'lucide-react';
import type { Lesson } from '../../types';

interface LessonListProps {
    lessons: Lesson[];
    onEdit: (lesson: Lesson) => void;
    onDelete: (lesson: Lesson) => void;
}

export function LessonList({ lessons, onEdit, onDelete }: LessonListProps) {
    return (
        <div className="space-y-3">
            {lessons.map((lesson, index) => (
                <div
                    key={lesson.id}
                    className="group flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-sky-50/30 border border-sky-100 rounded-xl hover:shadow-md hover:border-sky-200 transition-all"
                >
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-sm font-bold text-sky-600">{index + 1}</span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Video size={18} className="text-sky-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{lesson.title}</p>
                            <p className="text-sm text-slate-500">
                                วิดีโอ • {lesson.duration}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(lesson)}
                            className="p-2.5 bg-white hover:bg-sky-50 border border-sky-200 rounded-xl transition-all"
                            title="แก้ไข"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(lesson)}
                            className="p-2.5 bg-white hover:bg-red-50 border border-red-200 rounded-xl transition-all"
                            title="ลบ"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
