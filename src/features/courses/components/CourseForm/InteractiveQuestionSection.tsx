'use client';

import { Plus, Upload, Trash2, Clock, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type {
    Lesson,
    VideoQuestion,
    QuestionOption,
    CreateVideoQuestionInput
} from '../../types';
import { CSVImportModal } from './CSVImportModal';
import { lessonService } from '../../services/lessonService';

interface InteractiveQuestionSectionProps {
    lesson: Lesson;
    onLessonChange: (lesson: Lesson) => void;
    onQuestionsImported?: () => void;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function InteractiveQuestionSection({
    lesson,
    onLessonChange,
    onQuestionsImported,
}: InteractiveQuestionSectionProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [questionForm, setQuestionForm] = useState<Partial<VideoQuestion>>({
        questionType: 'MULTIPLE_CHOICE',
        displayAtSeconds: 0,
        options: [
            { id: '1', text: '', isCorrect: false },
            { id: '2', text: '', isCorrect: false },
        ],
    });

    const videoQuestions = lesson.videoQuestions || [];

    // Handle CSV Import
    const handleImportQuestions = async (
        importedQuestions: CreateVideoQuestionInput[] | import('../../types').CreateExamQuestionInput[]
    ) => {
        const lessonId = lesson.id as number;
        if (!lessonId) {
            throw new Error('กรุณาบันทึกบทเรียนก่อนทำการ Import');
        }

        // Add imported questions to lesson state
        const newQuestions: VideoQuestion[] = (importedQuestions as CreateVideoQuestionInput[]).map((q, idx) => ({
            id: `imported-${Date.now()}-${idx}`,
            lessonId: q.lessonId,
            questionText: q.questionText,
            questionType: q.questionType,
            displayAtSeconds: q.displayAtSeconds,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }));

        onLessonChange({
            ...lesson,
            videoQuestions: [...videoQuestions, ...newQuestions],
        });

        if (onQuestionsImported) {
            onQuestionsImported();
        }
    };

    // Handle Add Question
    const handleAddQuestion = () => {
        const newQuestion: VideoQuestion = {
            id: `new-${Date.now()}`,
            lessonId: lesson.id as number,
            questionText: questionForm.questionText || '',
            questionType: questionForm.questionType || 'MULTIPLE_CHOICE',
            displayAtSeconds: questionForm.displayAtSeconds || 0,
            options: questionForm.options || [],
            correctAnswer: questionForm.options?.find(o => o.isCorrect)?.text,
        };

        onLessonChange({
            ...lesson,
            videoQuestions: [...videoQuestions, newQuestion],
        });

        // Reset form
        setQuestionForm({
            questionType: 'MULTIPLE_CHOICE',
            displayAtSeconds: 0,
            questionText: '',
            options: [
                { id: '1', text: '', isCorrect: false },
                { id: '2', text: '', isCorrect: false },
            ],
        });
        setIsAddFormOpen(false);
    };

    // Handle Delete Question
    const handleDeleteQuestion = (questionId: string | number) => {
        onLessonChange({
            ...lesson,
            videoQuestions: videoQuestions.filter(q => q.id !== questionId),
        });
    };

    // Handle Option Change
    const handleOptionChange = (idx: number, field: keyof QuestionOption, value: string | boolean) => {
        const newOptions = [...(questionForm.options || [])];
        newOptions[idx] = { ...newOptions[idx], [field]: value };
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const handleAddOption = () => {
        setQuestionForm({
            ...questionForm,
            options: [
                ...(questionForm.options || []),
                { id: Date.now().toString(), text: '', isCorrect: false },
            ],
        });
    };

    const handleRemoveOption = (idx: number) => {
        const newOptions = [...(questionForm.options || [])];
        newOptions.splice(idx, 1);
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const sortedQuestions = [...videoQuestions].sort(
        (a, b) => (a.displayAtSeconds || 0) - (b.displayAtSeconds || 0)
    );

    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">คำถาม Interactive</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            คำถามที่แสดงระหว่างดูวิดีโอ สำหรับบทเรียน: {lesson.title}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* CSV Import Button */}
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="flex items-center gap-2 border border-orange-300 text-orange-600 px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-all text-sm font-semibold"
                            title="Import จาก CSV"
                        >
                            <Upload size={18} />
                            <span className="hidden sm:inline">Import CSV</span>
                        </button>
                        {/* Add Question Button */}
                        <button
                            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                        >
                            <Plus size={18} />
                            <span>เพิ่มคำถาม</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Question Form */}
            {isAddFormOpen && (
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Plus size={16} className="text-orange-600" />
                        เพิ่มคำถามใหม่
                    </h3>
                    <div className="space-y-4">
                        {/* Display Time */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-slate-700">
                                แสดงที่เวลา (วินาที)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={questionForm.displayAtSeconds || 0}
                                onChange={(e) =>
                                    setQuestionForm({
                                        ...questionForm,
                                        displayAtSeconds: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-24 px-3 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all bg-white"
                            />
                        </div>

                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                คำถาม
                            </label>
                            <textarea
                                value={questionForm.questionText || ''}
                                onChange={(e) =>
                                    setQuestionForm({ ...questionForm, questionText: e.target.value })
                                }
                                rows={2}
                                className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all bg-white"
                                placeholder="พิมพ์คำถามที่นี่..."
                            />
                        </div>

                        {/* Options */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                ตัวเลือกคำตอบ
                            </label>
                            <div className="space-y-2">
                                {questionForm.options?.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={opt.isCorrect}
                                            onChange={() => {
                                                const newOpts = questionForm.options?.map((o, i) => ({
                                                    ...o,
                                                    isCorrect: i === idx,
                                                }));
                                                setQuestionForm({ ...questionForm, options: newOpts });
                                            }}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                            placeholder={`ตัวเลือกที่ ${idx + 1}`}
                                        />
                                        <button
                                            onClick={() => handleRemoveOption(idx)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddOption}
                                    className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1"
                                >
                                    <Plus size={16} /> เพิ่มตัวเลือก
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsAddFormOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-white rounded-lg transition-all text-sm font-semibold"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleAddQuestion}
                                disabled={
                                    !questionForm.questionText ||
                                    !questionForm.options?.some((o) => o.text)
                                }
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                บันทึกคำถาม
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Question List */}
            <div className="p-6">
                {sortedQuestions.length === 0 ? (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-dashed border-orange-200 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <HelpCircle size={32} className="text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มีคำถาม Interactive</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            เพิ่มคำถามที่จะแสดงระหว่างดูวิดีโอ หรือ Import จาก CSV
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center gap-2 border border-orange-300 text-orange-600 px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all text-sm font-semibold"
                            >
                                <Upload size={18} />
                                Import CSV
                            </button>
                            <button
                                onClick={() => setIsAddFormOpen(true)}
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all text-sm font-semibold"
                            >
                                <Plus size={18} />
                                เพิ่มคำถามแรก
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedQuestions.map((q, index) => (
                            <div
                                key={q.id}
                                className="group flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-orange-200 transition-all"
                            >
                                {/* Time Badge */}
                                <div className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold font-mono flex items-center gap-1">
                                    <Clock size={12} />
                                    {formatDuration(q.displayAtSeconds || 0)}
                                </div>

                                {/* Question Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 mb-1 line-clamp-2">
                                        {q.questionText}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${q.questionType === 'MULTIPLE_CHOICE' ||
                                                    q.questionType === 'multiple-choice'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {q.questionType === 'MULTIPLE_CHOICE' ||
                                                q.questionType === 'multiple-choice'
                                                ? 'ตัวเลือก'
                                                : 'เขียนตอบ'}
                                        </span>
                                        {q.options && q.options.length > 0 && (
                                            <span className="text-xs text-slate-500">
                                                {q.options.length} ตัวเลือก
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="ลบ"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CSV Import Modal */}
            <CSVImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                type="video"
                targetId={lesson.id as number || 0}
                onImport={handleImportQuestions}
            />
        </div>
    );
}
