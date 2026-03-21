import { X, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { QuestionType, ExamType, QuestionOption, Question } from '../../types';

interface AddQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (question: {
        type: QuestionType;
        examType: ExamType;
        question: string;
        options?: QuestionOption[];
        correctAnswer?: string;
        timestamp?: string;
        points?: number;
    }) => void | Promise<void>;
    initialQuestion?: Question | null;
    title?: string;
    description?: string;
    submitLabel?: string;
}

const DEFAULT_OPTIONS: QuestionOption[] = [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
];

function normalizeQuestionType(questionType?: QuestionType): QuestionType {
    if (questionType === 'MULTIPLE_CHOICE') {
        return 'multiple-choice';
    }

    if (questionType === 'FREE_TEXT' || questionType === 'SHORT_ANSWER') {
        return 'free-text';
    }

    return questionType || 'multiple-choice';
}

function buildDefaultOptions(question?: Question | null): QuestionOption[] {
    if (!question?.options || question.options.length === 0) {
        return DEFAULT_OPTIONS;
    }

    return question.options.map((option, index) => ({
        id: option.id || `${index + 1}`,
        text: option.text,
        isCorrect: option.isCorrect || option.text === question.correctAnswer,
    }));
}

export function AddQuestionModal({
    isOpen,
    onClose,
    onAdd,
    initialQuestion = null,
    title = 'เพิ่มคำถาม',
    description = 'สร้างคำถามสำหรับแบบทดสอบท้ายคอร์ส',
    submitLabel,
}: AddQuestionModalProps) {
    const examType: ExamType = initialQuestion?.examType || 'final-exam';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
    const [questionText, setQuestionText] = useState('');
    const [points, setPoints] = useState(1);
    const [options, setOptions] = useState<QuestionOption[]>(DEFAULT_OPTIONS);
    const [freeTextAnswer, setFreeTextAnswer] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setQuestionType(normalizeQuestionType(initialQuestion?.type));
        setQuestionText(initialQuestion?.question || '');
        setPoints(initialQuestion?.points || 1);
        setOptions(buildDefaultOptions(initialQuestion));
        setFreeTextAnswer(initialQuestion?.correctAnswer || '');
    }, [initialQuestion, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!questionText.trim()) return;
        if (questionType === 'multiple-choice' && options.filter((option) => option.text.trim()).length < 2) return;

        const questionData: {
            type: QuestionType;
            examType: ExamType;
            question: string;
            options?: QuestionOption[];
            correctAnswer?: string;
            points?: number;
        } = {
            type: questionType,
            examType,
            question: questionText,
            points,
        };

        if (questionType === 'multiple-choice') {
            const cleanedOptions = options
                .filter((option) => option.text.trim())
                .map((option) => ({ ...option, text: option.text.trim() }));

            questionData.options = cleanedOptions;
            questionData.correctAnswer = cleanedOptions.find((option) => option.isCorrect)?.text;
        } else {
            questionData.correctAnswer = freeTextAnswer.trim() || undefined;
        }

        setIsSubmitting(true);
        try {
            await onAdd(questionData);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setQuestionType('multiple-choice');
        setQuestionText('');
        setPoints(1);
        setOptions(DEFAULT_OPTIONS);
        setFreeTextAnswer('');
        onClose();
    };

    const addOption = () => {
        setOptions([...options, { id: Date.now().toString(), text: '', isCorrect: false }]);
    };

    const removeOption = (id: string) => {
        if (options.length > 2) {
            setOptions(options.filter((option) => option.id !== id));
        }
    };

    const updateOption = (id: string, text: string) => {
        setOptions(options.map((option) => option.id === id ? { ...option, text } : option));
    };

    const setCorrectOption = (id: string) => {
        setOptions(options.map((option) => ({ ...option, isCorrect: option.id === id })));
    };

    const actionLabel = submitLabel || (initialQuestion ? 'บันทึกการแก้ไข' : 'เพิ่มคำถาม');

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
                <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-bold">{title}</h3>
                        <p className="text-violet-100 text-sm mt-1">{description}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ประเภทคำตอบ <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={questionType}
                            onChange={(event) => setQuestionType(event.target.value as QuestionType)}
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all bg-white"
                        >
                            <option value="multiple-choice">ตัวเลือก (Multiple Choice)</option>
                            <option value="free-text">เขียนตอบ (Free Text)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            คำถาม <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={questionText}
                            onChange={(event) => setQuestionText(event.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                            placeholder="กรอกคำถาม"
                        />
                    </div>

                    {questionType === 'multiple-choice' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                ตัวเลือก <span className="text-red-500">*</span>
                            </label>
                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-3 mb-3">
                                <p className="text-xs text-slate-600 flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-violet-500 bg-white flex-shrink-0"></span>
                                    คลิกวงกลมเพื่อเลือกคำตอบที่ถูกต้อง
                                </p>
                            </div>
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="correct-answer"
                                            checked={option.isCorrect}
                                            onChange={() => setCorrectOption(option.id)}
                                            className="w-5 h-5 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                            title="เลือกเป็นคำตอบที่ถูกต้อง"
                                        />
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(event) => updateOption(option.id, event.target.value)}
                                            className={`flex-1 px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${option.isCorrect ? 'bg-green-50 border-green-300' : ''}`}
                                            placeholder={`ตัวเลือกที่ ${index + 1}`}
                                        />
                                        {options.length > 2 && (
                                            <button
                                                onClick={() => removeOption(option.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="ลบตัวเลือก"
                                            >
                                                <Trash2 size={18} className="text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addOption}
                                className="mt-3 flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium text-sm"
                            >
                                <Plus size={16} />
                                เพิ่มตัวเลือก
                            </button>
                        </div>
                    )}

                    {questionType === 'free-text' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                คำตอบที่ถูกต้อง (ไม่บังคับ)
                            </label>
                            <input
                                type="text"
                                value={freeTextAnswer}
                                onChange={(event) => setFreeTextAnswer(event.target.value)}
                                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                                placeholder="คำตอบที่ถูกต้อง (ถ้ามี)"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            คะแนน
                        </label>
                        <input
                            type="number"
                            value={points}
                            onChange={(event) => setPoints(Number(event.target.value) || 1)}
                            min={1}
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all font-semibold"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!questionText.trim() || isSubmitting}
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'กำลังบันทึก...' : actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
