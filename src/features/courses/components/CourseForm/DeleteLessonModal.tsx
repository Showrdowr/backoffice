import { Trash2 } from 'lucide-react';
import type { Lesson } from '../../types';

interface DeleteLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    lesson: Lesson | null;
}

export function DeleteLessonModal({ isOpen, onClose, onConfirm, lesson }: DeleteLessonModalProps) {
    if (!isOpen || !lesson) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">
                <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-2xl">
                    <h3 className="text-2xl font-bold">ยืนยันการลบ</h3>
                </div>
                <div className="p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} className="text-red-500" />
                    </div>
                    <p className="text-center text-slate-700 mb-2">
                        คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียน
                    </p>
                    <p className="text-center font-semibold text-slate-800 mb-4">
                        "{lesson.title}"
                    </p>
                    <p className="text-center text-sm text-slate-500">
                        การกระทำนี้ไม่สามารถย้อนกลับได้
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all font-semibold"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                    >
                        ลบบทเรียน
                    </button>
                </div>
            </div>
        </div>
    );
}
