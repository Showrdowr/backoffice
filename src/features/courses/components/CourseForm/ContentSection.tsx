import { Plus } from 'lucide-react';
import { LessonList } from './LessonList';
import type { Lesson } from '../../types';

interface ContentSectionProps {
    lessons: Lesson[];
    onAddClick: () => void;
    onEdit: (lesson: Lesson) => void;
    onDelete: (lesson: Lesson) => void;
}

export function ContentSection({ lessons, onAddClick, onEdit, onDelete }: ContentSectionProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
            <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between rounded-t-2xl">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">เนื้อหาคอร์ส</h2>
                    <p className="text-sm text-slate-500 mt-1">จัดการบทเรียนและเนื้อหาในคอร์ส</p>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                >
                    <Plus size={18} />
                    <span>เพิ่มบทเรียน</span>
                </button>
            </div>
            <div className="p-6">
                {lessons.length === 0 ? (
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-dashed border-sky-200 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Plus size={32} className="text-sky-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มีบทเรียน</h3>
                        <p className="text-sm text-slate-500 mb-4">เริ่มต้นเพิ่มบทเรียนแรกของคุณ</p>
                        <button
                            onClick={onAddClick}
                            className="inline-flex items-center gap-2 bg-sky-500 text-white px-5 py-2.5 rounded-xl hover:bg-sky-600 transition-all text-sm font-semibold"
                        >
                            <Plus size={18} />
                            เพิ่มบทเรียนแรก
                        </button>
                    </div>
                ) : (
                    <LessonList lessons={lessons} onEdit={onEdit} onDelete={onDelete} />
                )}
            </div>
        </div>
    );
}
