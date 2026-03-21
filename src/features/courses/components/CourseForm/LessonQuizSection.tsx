'use client';

import { FileQuestion, Plus, Save, Trash2, PencilLine } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type {
    Lesson,
    LessonQuiz,
    LessonQuizQuestion,
    QuestionOption,
    QuestionType,
} from '../../types';
import { lessonService } from '../../services/lessonService';

interface LessonQuizSectionProps {
    lesson: Lesson;
    onLessonChange: (lesson: Lesson) => void;
}

const INITIAL_OPTIONS: QuestionOption[] = [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
];

function normalizeQuestionType(questionType?: QuestionType): 'multiple-choice' | 'free-text' {
    if (
        questionType === 'MULTIPLE_CHOICE' ||
        questionType === 'multiple-choice' ||
        questionType === 'TRUE_FALSE'
    ) {
        return 'multiple-choice';
    }

    return 'free-text';
}

function buildEditableOptions(question?: LessonQuizQuestion | null): QuestionOption[] {
    const options = Array.isArray(question?.options) && question?.options.length > 0
        ? question.options.map((option, index) => ({
            id: option.id || `${index + 1}`,
            text: option.text,
            isCorrect: option.text === question.correctAnswer || option.isCorrect,
        }))
        : INITIAL_OPTIONS;

    return options.length >= 2 ? options : INITIAL_OPTIONS;
}

function parseMaxAttempts(maxAttempts?: number | null): string {
    return maxAttempts && maxAttempts > 0 ? String(maxAttempts) : 'unlimited';
}

export function LessonQuizSection({ lesson, onLessonChange }: LessonQuizSectionProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [passingScorePercent, setPassingScorePercent] = useState(70);
    const [maxAttempts, setMaxAttempts] = useState('unlimited');
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState<'multiple-choice' | 'free-text'>('multiple-choice');
    const [scoreWeight, setScoreWeight] = useState(1);
    const [options, setOptions] = useState<QuestionOption[]>(INITIAL_OPTIONS);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const lessonId = Number(lesson.id);
    const hasPersistedLesson = Number.isFinite(lessonId);
    const lessonQuiz = lesson.lessonQuiz || null;
    const lessonQuizQuestions = lessonQuiz?.questions || [];

    useEffect(() => {
        setPassingScorePercent(lessonQuiz?.passingScorePercent ?? 70);
        setMaxAttempts(parseMaxAttempts(lessonQuiz?.maxAttempts));
    }, [lessonQuiz?.id, lessonQuiz?.passingScorePercent, lessonQuiz?.maxAttempts]);

    useEffect(() => {
        setEditingQuestionId(null);
        setIsQuestionFormOpen(false);
        setQuestionText('');
        setQuestionType('multiple-choice');
        setScoreWeight(1);
        setOptions(INITIAL_OPTIONS);
        setCorrectAnswer('');
        setErrorMessage('');
    }, [lesson.id]);

    const syncLessonQuiz = async () => {
        const refreshedQuiz = await lessonService.getLessonQuiz(lessonId);
        onLessonChange({
            ...lesson,
            lessonQuiz: refreshedQuiz,
            hasQuiz: Boolean(refreshedQuiz),
        });
        return refreshedQuiz;
    };

    const ensureLessonQuiz = async (): Promise<LessonQuiz> => {
        const payload = {
            lessonId,
            passingScorePercent,
            maxAttempts: maxAttempts === 'unlimited' ? null : Number(maxAttempts),
        };

        if (lessonQuiz?.id) {
            const savedQuiz = await lessonService.saveLessonQuiz(payload);
            if (!savedQuiz) {
                throw new Error('บันทึกแบบทดสอบท้ายบทไม่สำเร็จ');
            }
            return savedQuiz;
        }

        const savedQuiz = await lessonService.saveLessonQuiz(payload);
        if (!savedQuiz) {
            throw new Error('สร้างแบบทดสอบท้ายบทไม่สำเร็จ');
        }
        return savedQuiz;
    };

    const resetQuestionForm = () => {
        setEditingQuestionId(null);
        setQuestionText('');
        setQuestionType('multiple-choice');
        setScoreWeight(1);
        setOptions(INITIAL_OPTIONS);
        setCorrectAnswer('');
        setIsQuestionFormOpen(false);
    };

    const handleSaveQuizSettings = async () => {
        if (!hasPersistedLesson) {
            setErrorMessage('กรุณาบันทึกบทเรียนก่อนตั้งค่าแบบทดสอบท้ายบท');
            return;
        }

        setIsSaving(true);
        setErrorMessage('');
        try {
            await ensureLessonQuiz();
            await syncLessonQuiz();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'บันทึกแบบทดสอบท้ายบทไม่สำเร็จ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditQuestion = (question: LessonQuizQuestion) => {
        setEditingQuestionId(Number(question.id));
        setQuestionText(question.questionText || '');
        setQuestionType(normalizeQuestionType(question.questionType));
        setScoreWeight(question.scoreWeight || 1);
        setOptions(buildEditableOptions(question));
        setCorrectAnswer(question.correctAnswer || '');
        setIsQuestionFormOpen(true);
    };

    const handleSaveQuestion = async () => {
        if (!hasPersistedLesson) {
            setErrorMessage('กรุณาบันทึกบทเรียนก่อนเพิ่มคำถาม');
            return;
        }

        if (!questionText.trim()) {
            setErrorMessage('กรุณาระบุคำถามก่อนบันทึก');
            return;
        }

        if (questionType === 'multiple-choice') {
            const validOptions = options.filter((option) => option.text.trim());
            if (validOptions.length < 2) {
                setErrorMessage('คำถามแบบตัวเลือกต้องมีอย่างน้อย 2 ตัวเลือก');
                return;
            }

            if (!validOptions.some((option) => option.isCorrect)) {
                setErrorMessage('กรุณาเลือกคำตอบที่ถูกต้อง');
                return;
            }
        }

        setIsSaving(true);
        setErrorMessage('');

        try {
            const ensuredQuiz = await ensureLessonQuiz();
            const resolvedCorrectAnswer =
                questionType === 'multiple-choice'
                    ? options.find((option) => option.isCorrect)?.text || ''
                    : correctAnswer;
            const resolvedQuestionType: QuestionType =
                questionType === 'multiple-choice' ? 'MULTIPLE_CHOICE' : 'SHORT_ANSWER';

            const payload = {
                questionText: questionText.trim(),
                questionType: resolvedQuestionType,
                options: questionType === 'multiple-choice'
                    ? options.filter((option) => option.text.trim())
                    : undefined,
                correctAnswer: resolvedCorrectAnswer || undefined,
                scoreWeight,
            };

            if (editingQuestionId) {
                await lessonService.updateLessonQuizQuestion(editingQuestionId, payload);
            } else {
                await lessonService.addLessonQuizQuestion(Number(ensuredQuiz.id), payload);
            }

            await syncLessonQuiz();
            resetQuestionForm();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'บันทึกคำถามไม่สำเร็จ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteQuestion = async (questionId: number | string) => {
        if (!Number.isFinite(Number(questionId))) {
            return;
        }

        setIsSaving(true);
        setErrorMessage('');
        try {
            await lessonService.deleteLessonQuizQuestion(Number(questionId));
            await syncLessonQuiz();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'ลบคำถามไม่สำเร็จ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOptionChange = (index: number, field: keyof QuestionOption, value: string | boolean) => {
        const nextOptions = [...options];
        nextOptions[index] = { ...nextOptions[index], [field]: value };
        setOptions(nextOptions);
    };

    const addOption = () => {
        setOptions((currentOptions) => [
            ...currentOptions,
            { id: Date.now().toString(), text: '', isCorrect: false },
        ]);
    };

    const removeOption = (index: number) => {
        setOptions((currentOptions) => currentOptions.filter((_, currentIndex) => currentIndex !== index));
    };

    const questionCountLabel = useMemo(
        () => `${lessonQuizQuestions.length} คำถาม`,
        [lessonQuizQuestions.length]
    );

    return (
        <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <FileQuestion size={22} className="text-emerald-600" />
                            แบบทดสอบท้ายบทเรียน
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            ตั้งค่าคะแนนผ่านและจัดการคำถามของบทเรียน: {lesson.title}
                        </p>
                    </div>
                    <button
                        onClick={handleSaveQuizSettings}
                        disabled={!hasPersistedLesson || isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={16} />
                        บันทึกการตั้งค่า
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            คะแนนผ่านขั้นต่ำ (%)
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={passingScorePercent}
                            onChange={(event) => setPassingScorePercent(Number(event.target.value) || 0)}
                            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            จำนวนครั้งที่ทำได้
                        </label>
                        <select
                            value={maxAttempts}
                            onChange={(event) => setMaxAttempts(event.target.value)}
                            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="unlimited">ไม่จำกัด</option>
                            <option value="1">1 ครั้ง</option>
                            <option value="2">2 ครั้ง</option>
                            <option value="3">3 ครั้ง</option>
                            <option value="5">5 ครั้ง</option>
                        </select>
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">คำถามท้ายบท</h3>
                            <p className="text-sm text-slate-500">{questionCountLabel}</p>
                        </div>
                        <button
                            onClick={() => {
                                resetQuestionForm();
                                setIsQuestionFormOpen(true);
                            }}
                            disabled={!hasPersistedLesson || isSaving}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus size={16} />
                            เพิ่มคำถาม
                        </button>
                    </div>

                    {isQuestionFormOpen && (
                        <div className="mb-4 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        คำถาม
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={questionText}
                                        onChange={(event) => setQuestionText(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        placeholder="ระบุคำถามท้ายบทเรียน"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        ประเภทคำถาม
                                    </label>
                                    <select
                                        value={questionType}
                                        onChange={(event) => setQuestionType(event.target.value as 'multiple-choice' | 'free-text')}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    >
                                        <option value="multiple-choice">ตัวเลือก</option>
                                        <option value="free-text">เขียนตอบ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        คะแนน
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={scoreWeight}
                                        onChange={(event) => setScoreWeight(Number(event.target.value) || 1)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                            </div>

                            {questionType === 'multiple-choice' ? (
                                <div className="mt-4">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        ตัวเลือกคำตอบ
                                    </label>
                                    <div className="space-y-2">
                                        {options.map((option, index) => (
                                            <div key={option.id || index} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="lesson-quiz-correct-answer"
                                                    checked={option.isCorrect}
                                                    onChange={() => {
                                                        setOptions((currentOptions) =>
                                                            currentOptions.map((currentOption, currentIndex) => ({
                                                                ...currentOption,
                                                                isCorrect: currentIndex === index,
                                                            }))
                                                        );
                                                    }}
                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(event) => handleOptionChange(index, 'text', event.target.value)}
                                                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                    placeholder={`ตัวเลือกที่ ${index + 1}`}
                                                />
                                                <button
                                                    onClick={() => removeOption(index)}
                                                    disabled={options.length <= 2}
                                                    className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={addOption}
                                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                    >
                                        <Plus size={16} />
                                        เพิ่มตัวเลือก
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        คำตอบที่ถูกต้อง
                                    </label>
                                    <input
                                        type="text"
                                        value={correctAnswer}
                                        onChange={(event) => setCorrectAnswer(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        placeholder="ระบุคำตอบที่ถูกต้อง"
                                    />
                                </div>
                            )}

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={resetQuestionForm}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSaveQuestion}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {editingQuestionId ? 'บันทึกการแก้ไข' : 'เพิ่มคำถาม'}
                                </button>
                            </div>
                        </div>
                    )}

                    {lessonQuizQuestions.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                            ยังไม่มีคำถามท้ายบทเรียน
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {lessonQuizQuestions.map((question, index) => (
                                <div
                                    key={question.id}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-sm"
                                >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-800">{question.questionText}</p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                                                {normalizeQuestionType(question.questionType) === 'multiple-choice' ? 'ตัวเลือก' : 'เขียนตอบ'}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                                                {question.scoreWeight || 1} คะแนน
                                            </span>
                                            {question.correctAnswer && (
                                                <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">
                                                    เฉลย: {question.correctAnswer}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditQuestion(question)}
                                            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
                                            title="แก้ไข"
                                        >
                                            <PencilLine size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
                                            title="ลบ"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
