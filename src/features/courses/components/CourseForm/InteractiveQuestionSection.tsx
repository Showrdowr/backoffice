'use client';

import { ArrowDown, ArrowUp, Clock, HelpCircle, PencilLine, Plus, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CreateExamQuestionInput, CreateVideoQuestionInput, Lesson, QuestionOption, VideoQuestion } from '../../types';
import { lessonService } from '../../services/lessonService';
import { CSVImportModal } from './CSVImportModal';

interface InteractiveQuestionSectionProps {
    lesson: Lesson;
    onLessonChange: (lesson: Lesson) => void;
    onQuestionsImported?: () => void;
}

type InteractiveQuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

type QuestionFormState = {
    questionText: string;
    questionType: InteractiveQuestionType;
    displayTimeInput: string;
    sortOrder: number;
    options: QuestionOption[];
    correctAnswer: string;
};

const DEFAULT_OPTIONS: QuestionOption[] = [
    { id: '1', text: '' },
    { id: '2', text: '' },
];

const TRUE_FALSE_OPTIONS: QuestionOption[] = [
    { id: 'true', text: 'จริง' },
    { id: 'false', text: 'เท็จ' },
];

function formatDuration(seconds: number): string {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function parseDurationInput(value: string): number | null {
    const normalized = value.trim();
    if (!normalized) {
        return null;
    }

    if (/^\d+$/.test(normalized)) {
        return Number(normalized);
    }

    const parts = normalized.split(':').map((part) => part.trim());
    if (parts.length !== 2) {
        return null;
    }

    const [minutes, seconds] = parts.map((part) => Number(part));
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds < 0 || seconds >= 60) {
        return null;
    }

    return (minutes * 60) + seconds;
}

function normalizeQuestionType(questionType?: string): InteractiveQuestionType {
    if (questionType === 'TRUE_FALSE') {
        return 'TRUE_FALSE';
    }

    if (questionType === 'SHORT_ANSWER' || questionType === 'FREE_TEXT' || questionType === 'free-text') {
        return 'SHORT_ANSWER';
    }

    return 'MULTIPLE_CHOICE';
}

function getQuestionTypeLabel(questionType: InteractiveQuestionType) {
    if (questionType === 'TRUE_FALSE') {
        return 'จริง/เท็จ';
    }

    if (questionType === 'SHORT_ANSWER') {
        return 'เขียนตอบ';
    }

    return 'ตัวเลือก';
}

function getQuestionTypeBadge(questionType: InteractiveQuestionType) {
    if (questionType === 'TRUE_FALSE') {
        return 'bg-amber-100 text-amber-700';
    }

    if (questionType === 'SHORT_ANSWER') {
        return 'bg-emerald-100 text-emerald-700';
    }

    return 'bg-blue-100 text-blue-700';
}

function normalizeOptionsForQuestion(question: VideoQuestion): QuestionOption[] {
    const normalizedType = normalizeQuestionType(question.questionType);
    if (normalizedType === 'TRUE_FALSE') {
        return TRUE_FALSE_OPTIONS;
    }

    if (normalizedType === 'SHORT_ANSWER') {
        return [];
    }

    if (Array.isArray(question.options) && question.options.length > 0) {
        return question.options.map((option, index) => ({
            id: option.id || `${index + 1}`,
            text: option.text,
        }));
    }

    return DEFAULT_OPTIONS;
}

function normalizeTrueFalseAnswer(value?: string | null) {
    const normalizedValue = String(value || '').trim().toLowerCase();
    if (!normalizedValue) {
        return '';
    }

    const matchedOption = TRUE_FALSE_OPTIONS.find((option) =>
        option.id === normalizedValue || option.text.trim().toLowerCase() === normalizedValue
    );

    return matchedOption?.id || '';
}

function getTrueFalseAnswerLabel(value?: string | null) {
    const normalizedValue = normalizeTrueFalseAnswer(value);
    return TRUE_FALSE_OPTIONS.find((option) => option.id === normalizedValue)?.text || null;
}

function sortQuestions(questions: VideoQuestion[]) {
    return [...questions].sort((left, right) => {
        const displayAtDelta = Number(left.displayAtSeconds || 0) - Number(right.displayAtSeconds || 0);
        if (displayAtDelta !== 0) {
            return displayAtDelta;
        }

        const sortOrderDelta = Number(left.sortOrder || 0) - Number(right.sortOrder || 0);
        if (sortOrderDelta !== 0) {
            return sortOrderDelta;
        }

        return Number(left.id) - Number(right.id);
    });
}

function isLessonVideoReadyForInteractive(lesson: Lesson) {
    return lesson.video?.status === 'READY' && Number(lesson.video?.duration || 0) > 0;
}

function getInteractiveVideoReadinessMessage(lesson: Lesson) {
    if (!lesson.video) {
        return 'กรุณาเลือกวิดีโอบทเรียนก่อนเพิ่มคำถาม interactive เพราะคำถามจะผูกกับเวลาระหว่างดูวิดีโอ';
    }

    if (lesson.video.status === 'FAILED') {
        return 'วิดีโอบทเรียนนี้มีปัญหาอยู่ จึงยังไม่ควรสร้างคำถาม interactive จนกว่าวิดีโอจะพร้อมใช้งานจริง';
    }

    if (lesson.video.status !== 'READY' || Number(lesson.video.duration || 0) <= 0) {
        return 'วิดีโอบทเรียนนี้ยังไม่พร้อมใช้งานจริงหรือยังไม่มีความยาววิดีโอที่เชื่อถือได้ จึงยังไม่ควรสร้างคำถาม interactive เพราะ learner runtime จะ trigger ตามเวลาได้ไม่แม่น';
    }

    return null;
}

export function InteractiveQuestionSection({
    lesson,
    onLessonChange,
    onQuestionsImported,
}: InteractiveQuestionSectionProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [questionForm, setQuestionForm] = useState<QuestionFormState>({
        questionText: '',
        questionType: 'MULTIPLE_CHOICE',
        displayTimeInput: '0:00',
        sortOrder: 0,
        options: DEFAULT_OPTIONS,
        correctAnswer: '',
    });

    const lessonId = Number(lesson.id);
    const courseId = Number(lesson.courseId);
    const videoDuration = Number(lesson.video?.duration || 0);
    const rawQuestions = Array.isArray(lesson.videoQuestions) ? lesson.videoQuestions : [];
    const sortedQuestions = useMemo(() => sortQuestions(rawQuestions), [rawQuestions]);
    const hasPersistedLesson = Number.isInteger(lessonId) && lessonId > 0 && Number.isInteger(courseId) && courseId > 0;
    const hasPersistedVideo = Boolean(lesson.videoId && lesson.video?.id);
    const isVideoReadyForInteractive = isLessonVideoReadyForInteractive(lesson);
    const videoReadinessMessage = getInteractiveVideoReadinessMessage(lesson);

    const refreshLessonFromApi = async () => {
        if (!hasPersistedLesson) {
            return null;
        }

        const refreshedLesson = await lessonService.refreshLesson(courseId, lessonId);
        if (refreshedLesson) {
            onLessonChange(refreshedLesson);
        }
        return refreshedLesson;
    };

    const resetForm = (nextSortOrder = sortedQuestions.length) => {
        setEditingQuestionId(null);
        setQuestionForm({
            questionText: '',
            questionType: 'MULTIPLE_CHOICE',
            displayTimeInput: '0:00',
            sortOrder: Math.max(0, nextSortOrder),
            options: DEFAULT_OPTIONS,
            correctAnswer: '',
        });
    };

    const openCreateForm = () => {
        resetForm(sortedQuestions.length);
        setActionError(null);
        setIsFormOpen(true);
    };

    const getValidatedSeconds = () => {
        const seconds = parseDurationInput(questionForm.displayTimeInput);
        if (seconds === null) {
            throw new Error('กรุณาระบุเวลาในรูปแบบ mm:ss หรือจำนวนวินาที');
        }

        if (videoDuration > 0 && seconds > videoDuration) {
            throw new Error(`เวลาที่แสดงคำถามต้องไม่เกิน ${formatDuration(videoDuration)}`);
        }

        return seconds;
    };

    const buildPayload = (): CreateVideoQuestionInput => {
        const questionText = questionForm.questionText.trim();
        if (!questionText) {
            throw new Error('กรุณาระบุข้อความคำถาม');
        }

        const displayAtSeconds = getValidatedSeconds();
        const questionType = normalizeQuestionType(questionForm.questionType);

        if (questionType === 'MULTIPLE_CHOICE') {
            const options = questionForm.options
                .map((option, index) => ({
                    id: option.id || `${index + 1}`,
                    text: option.text.trim(),
                }))
                .filter((option) => option.text.length > 0);

            if (options.length < 2) {
                throw new Error('คำถามแบบตัวเลือกต้องมีอย่างน้อย 2 ตัวเลือก');
            }

            return {
                lessonId,
                questionText,
                questionType,
                displayAtSeconds,
                sortOrder: Math.max(0, questionForm.sortOrder),
                options,
            };
        }

        if (questionType === 'TRUE_FALSE') {
            const correctAnswer = normalizeTrueFalseAnswer(questionForm.correctAnswer);
            if (!correctAnswer) {
                throw new Error('กรุณาเลือกคำตอบที่ถูกต้องสำหรับคำถามจริง/เท็จ');
            }

            return {
                lessonId,
                questionText,
                questionType,
                displayAtSeconds,
                sortOrder: Math.max(0, questionForm.sortOrder),
                options: TRUE_FALSE_OPTIONS,
                correctAnswer,
            };
        }

        return {
            lessonId,
            questionText,
            questionType,
            displayAtSeconds,
            sortOrder: Math.max(0, questionForm.sortOrder),
        };
    };

    const handleImportQuestions = async (
        importedQuestions: CreateVideoQuestionInput[] | CreateExamQuestionInput[]
    ) => {
        if (!hasPersistedLesson) {
            throw new Error('กรุณาบันทึกบทเรียนก่อนทำการ Import');
        }

        if (!hasPersistedVideo) {
            throw new Error('กรุณาเลือกวิดีโอบทเรียนก่อนเพิ่มคำถาม interactive');
        }

        if (!isVideoReadyForInteractive) {
            throw new Error(videoReadinessMessage || 'วิดีโอบทเรียนยังไม่พร้อมสำหรับคำถาม interactive');
        }

        setIsSubmitting(true);
        setActionError(null);

        try {
            await lessonService.bulkAddVideoQuestions(
                lessonId,
                (importedQuestions as CreateVideoQuestionInput[]).map((importedQuestion) => ({
                    ...importedQuestion,
                    lessonId,
                }))
            );

            await refreshLessonFromApi();
            setIsImportModalOpen(false);
            if (onQuestionsImported) {
                onQuestionsImported();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Import คำถามไม่สำเร็จ';
            setActionError(message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveQuestion = async () => {
        if (!hasPersistedLesson) {
            setActionError('กรุณาบันทึกบทเรียนก่อนเพิ่มคำถาม');
            return;
        }

        if (!hasPersistedVideo) {
            setActionError('กรุณาเลือกวิดีโอบทเรียนก่อนเพิ่มคำถาม interactive');
            return;
        }

        if (!editingQuestionId && !isVideoReadyForInteractive) {
            setActionError(videoReadinessMessage || 'วิดีโอบทเรียนยังไม่พร้อมสำหรับคำถาม interactive');
            return;
        }

        setIsSubmitting(true);
        setActionError(null);

        try {
            const payload = buildPayload();

            if (editingQuestionId) {
                await lessonService.updateVideoQuestion(editingQuestionId, payload);
            } else {
                await lessonService.addVideoQuestion(payload);
            }

            await refreshLessonFromApi();
            setIsFormOpen(false);
            resetForm(sortedQuestions.length + (editingQuestionId ? 0 : 1));
        } catch (error) {
            setActionError(error instanceof Error ? error.message : 'บันทึกคำถามไม่สำเร็จ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (questionId: string | number) => {
        if (!Number.isFinite(Number(questionId))) {
            return;
        }

        setIsSubmitting(true);
        setActionError(null);

        try {
            await lessonService.deleteVideoQuestion(Number(questionId));
            await refreshLessonFromApi();
        } catch (error) {
            setActionError(error instanceof Error ? error.message : 'ลบคำถามไม่สำเร็จ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditQuestion = (question: VideoQuestion) => {
        const questionType = normalizeQuestionType(question.questionType);
        setEditingQuestionId(Number(question.id));
        setQuestionForm({
            questionText: question.questionText || '',
            questionType,
            displayTimeInput: formatDuration(Number(question.displayAtSeconds || 0)),
            sortOrder: Number(question.sortOrder || 0),
            options: normalizeOptionsForQuestion(question),
            correctAnswer: questionType === 'TRUE_FALSE' ? normalizeTrueFalseAnswer(question.correctAnswer) : '',
        });
        setActionError(null);
        setIsFormOpen(true);
    };

    const handleMoveQuestion = async (questionId: number, direction: 'up' | 'down') => {
        const currentIndex = sortedQuestions.findIndex((question) => Number(question.id) === questionId);
        if (currentIndex === -1) {
            return;
        }

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= sortedQuestions.length) {
            return;
        }

        const reorderedQuestions = [...sortedQuestions];
        const [movedQuestion] = reorderedQuestions.splice(currentIndex, 1);
        reorderedQuestions.splice(targetIndex, 0, movedQuestion);

        setIsSubmitting(true);
        setActionError(null);

        try {
            for (const [index, question] of reorderedQuestions.entries()) {
                await lessonService.updateVideoQuestion(Number(question.id), {
                    sortOrder: index,
                });
            }

            await refreshLessonFromApi();
        } catch (error) {
            setActionError(error instanceof Error ? error.message : 'จัดลำดับคำถามไม่สำเร็จ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuestionTypeChange = (nextType: InteractiveQuestionType) => {
        setQuestionForm((current) => ({
            ...current,
            questionType: nextType,
            options: nextType === 'MULTIPLE_CHOICE'
                ? current.options.length > 0 ? current.options : DEFAULT_OPTIONS
                : nextType === 'TRUE_FALSE'
                    ? TRUE_FALSE_OPTIONS
                    : [],
            correctAnswer: nextType === 'TRUE_FALSE'
                ? normalizeTrueFalseAnswer(current.correctAnswer)
                : '',
        }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const nextOptions = [...questionForm.options];
        nextOptions[index] = {
            ...nextOptions[index],
            id: nextOptions[index]?.id || `${index + 1}`,
            text: value,
        };

        setQuestionForm((current) => ({
            ...current,
            options: nextOptions,
        }));
    };

    const handleAddOption = () => {
        setQuestionForm((current) => ({
            ...current,
            options: [
                ...current.options,
                { id: `${Date.now()}`, text: '' },
            ],
        }));
    };

    const handleRemoveOption = (index: number) => {
        setQuestionForm((current) => ({
            ...current,
            options: current.options.filter((_, optionIndex) => optionIndex !== index),
        }));
    };

    const isSubmitDisabled =
        isSubmitting ||
        !questionForm.questionText.trim() ||
        (questionForm.questionType === 'TRUE_FALSE' && !normalizeTrueFalseAnswer(questionForm.correctAnswer)) ||
        (questionForm.questionType === 'MULTIPLE_CHOICE' &&
            questionForm.options.filter((option) => option.text.trim()).length < 2);

    return (
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md">
            <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                                <HelpCircle size={22} className="text-orange-500" />
                                คำถาม Interactive ระหว่างวิดีโอ
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                คำถามชุดนี้จะเด้งระหว่างที่ผู้เรียนดูวิดีโอของบทเรียน &quot;{lesson.title}&quot;
                            </p>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                            ผู้เรียนต้องตอบคำถามก่อนวิดีโอจะเล่นต่อ คำถามชุดนี้ไม่มีคะแนนและใช้เพื่อกระตุ้นการมีส่วนร่วมระหว่างเรียน
                        </div>
                        <div className={`rounded-xl px-4 py-3 text-sm ${
                            isVideoReadyForInteractive
                                ? 'border border-emerald-100 bg-emerald-50 text-emerald-800'
                                : 'border border-amber-100 bg-amber-50 text-amber-800'
                        }`}>
                            {isVideoReadyForInteractive
                                ? `วิดีโอพร้อมใช้งาน • ความยาว ${formatDuration(videoDuration)} • มีคำถาม ${sortedQuestions.length} ข้อ`
                                : videoReadinessMessage}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            disabled={!hasPersistedLesson || !hasPersistedVideo || !isVideoReadyForInteractive || isSubmitting}
                            className="flex items-center gap-2 rounded-xl border border-orange-300 px-4 py-2.5 text-sm font-semibold text-orange-700 transition-all hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Upload size={18} />
                            <span className="hidden sm:inline">Import CSV</span>
                        </button>
                        <button
                            onClick={openCreateForm}
                            disabled={!hasPersistedLesson || !hasPersistedVideo || !isVideoReadyForInteractive || isSubmitting}
                            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus size={18} />
                            เพิ่มคำถาม
                        </button>
                    </div>
                </div>
            </div>

            {!hasPersistedLesson && (
                <div className="border-b border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-800">
                    กรุณาบันทึกบทเรียนให้เรียบร้อยก่อน แล้วจึงเพิ่มคำถาม interactive
                </div>
            )}

            {hasPersistedLesson && !hasPersistedVideo && (
                <div className="border-b border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-800">
                    กรุณาเลือกวิดีโอบทเรียนก่อนเพิ่มคำถาม interactive เพราะคำถามจะผูกกับเวลาระหว่างดูวิดีโอ
                </div>
            )}

            {hasPersistedLesson && hasPersistedVideo && !isVideoReadyForInteractive && videoReadinessMessage && (
                <div className="border-b border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-800">
                    {videoReadinessMessage}
                </div>
            )}

            {actionError && !isFormOpen && (
                <div className="border-b border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
                    {actionError}
                </div>
            )}

            {isFormOpen && (
                <div className="border-b border-orange-100 bg-orange-50/60 p-6">
                    <h3 className="mb-4 text-sm font-semibold text-slate-700">
                        {editingQuestionId ? 'แก้ไขคำถาม interactive' : 'เพิ่มคำถาม interactive'}
                    </h3>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    เวลาแสดงคำถาม <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={questionForm.displayTimeInput}
                                    onChange={(event) => setQuestionForm((current) => ({
                                        ...current,
                                        displayTimeInput: event.target.value,
                                    }))}
                                    placeholder="เช่น 01:30"
                                    className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    กรอกเป็น mm:ss หรือจำนวนวินาที เช่น 90 = 1:30
                                    {videoDuration > 0 ? ` • ความยาววิดีโอ ${formatDuration(videoDuration)}` : ''}
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    ประเภทคำถาม <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={questionForm.questionType}
                                    onChange={(event) => handleQuestionTypeChange(event.target.value as InteractiveQuestionType)}
                                    className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                >
                                    <option value="MULTIPLE_CHOICE">ตัวเลือก</option>
                                    <option value="TRUE_FALSE">จริง / เท็จ</option>
                                    <option value="SHORT_ANSWER">เขียนตอบ</option>
                                </select>
                                <p className="mt-1 text-xs text-slate-500">
                                    ไม่มีการให้คะแนน ใช้เพื่อให้ผู้เรียนมีส่วนร่วมก่อนวิดีโอเล่นต่อ
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    ลำดับคำถาม
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={questionForm.sortOrder}
                                    onChange={(event) => setQuestionForm((current) => ({
                                        ...current,
                                        sortOrder: Number(event.target.value) || 0,
                                    }))}
                                    className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    ใช้จัดลำดับเมื่อมีหลายคำถามเกิดขึ้นในเวลาเดียวกัน
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                ข้อความคำถาม <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={questionForm.questionText}
                                onChange={(event) => setQuestionForm((current) => ({
                                    ...current,
                                    questionText: event.target.value,
                                }))}
                                rows={3}
                                placeholder="เช่น ประเด็นสำคัญจากช่วงนี้คืออะไร"
                                className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        {questionForm.questionType === 'MULTIPLE_CHOICE' && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    ตัวเลือกคำตอบ <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {questionForm.options.map((option, index) => (
                                        <div key={option.id || index} className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-700">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <input
                                                type="text"
                                                value={option.text}
                                                onChange={(event) => handleOptionChange(index, event.target.value)}
                                                placeholder={`ตัวเลือกที่ ${index + 1}`}
                                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            />
                                            <button
                                                onClick={() => handleRemoveOption(index)}
                                                disabled={questionForm.options.length <= 2}
                                                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                title="ลบตัวเลือก"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleAddOption}
                                        className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:underline"
                                    >
                                        <Plus size={16} />
                                        เพิ่มตัวเลือก
                                    </button>
                                </div>
                            </div>
                        )}

                        {questionForm.questionType === 'TRUE_FALSE' && (
                            <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
                                <p className="text-sm text-amber-800">
                                    ระบบจะสร้างตัวเลือก “จริง” และ “เท็จ” ให้อัตโนมัติ และสามารถกำหนดคำตอบที่ถูกต้องได้ด้านล่าง
                                </p>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        คำตอบที่ถูกต้อง <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        {TRUE_FALSE_OPTIONS.map((option) => (
                                            <label key={option.id} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-700">
                                                <input
                                                    type="radio"
                                                    name="interactive-true-false-answer"
                                                    value={option.id}
                                                    checked={normalizeTrueFalseAnswer(questionForm.correctAnswer) === option.id}
                                                    onChange={(event) => setQuestionForm((current) => ({
                                                        ...current,
                                                        correctAnswer: event.target.value,
                                                    }))}
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span>{option.text}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {questionForm.questionType === 'SHORT_ANSWER' && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                ผู้เรียนจะต้องพิมพ์คำตอบก่อนวิดีโอเล่นต่อ โดยระบบไม่ตรวจถูกผิดและไม่ให้คะแนน
                            </div>
                        )}

                        {actionError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {actionError}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => {
                                    resetForm(sortedQuestions.length);
                                    setActionError(null);
                                    setIsFormOpen(false);
                                }}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSaveQuestion}
                                disabled={isSubmitDisabled}
                                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {editingQuestionId ? 'บันทึกการแก้ไข' : 'บันทึกคำถาม'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                {sortedQuestions.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-10 text-center">
                        <Clock size={36} className="mx-auto mb-3 text-orange-400" />
                        <h3 className="text-lg font-semibold text-slate-800">ยังไม่มีคำถาม interactive</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            เพิ่มคำถามเพื่อให้ผู้เรียนต้องตอบระหว่างดูวิดีโอ เช่น คำถามทบทวนหรือให้สะท้อนความเข้าใจในจุดสำคัญ
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedQuestions.map((question, index) => {
                            const normalizedType = normalizeQuestionType(question.questionType);
                            const canMoveUp = index > 0;
                            const canMoveDown = index < sortedQuestions.length - 1;

                            return (
                                <div
                                    key={question.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                                    เวลา {formatDuration(Number(question.displayAtSeconds || 0))}
                                                </span>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getQuestionTypeBadge(normalizedType)}`}>
                                                    {getQuestionTypeLabel(normalizedType)}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    ลำดับ {Number(question.sortOrder || 0)}
                                                </span>
                                            </div>

                                            <p className="font-semibold text-slate-800">{question.questionText}</p>

                                            {normalizedType === 'MULTIPLE_CHOICE' && Array.isArray(question.options) && question.options.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <span
                                                            key={option.id || optionIndex}
                                                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                                                        >
                                                            {String.fromCharCode(65 + optionIndex)}. {option.text}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {normalizedType === 'TRUE_FALSE' && getTrueFalseAnswerLabel(question.correctAnswer) && (
                                                <div className="mt-3">
                                                    <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
                                                        เฉลย: {getTrueFalseAnswerLabel(question.correctAnswer)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleMoveQuestion(Number(question.id), 'up')}
                                                disabled={!canMoveUp || isSubmitting}
                                                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                title="เลื่อนขึ้น"
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleMoveQuestion(Number(question.id), 'down')}
                                                disabled={!canMoveDown || isSubmitting}
                                                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                title="เลื่อนลง"
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEditQuestion(question)}
                                                disabled={isSubmitting}
                                                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                title="แก้ไขคำถาม"
                                            >
                                                <PencilLine size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuestion(question.id)}
                                                disabled={isSubmitting}
                                                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                title="ลบคำถาม"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <CSVImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                type="video"
                targetId={lessonId}
                onImport={handleImportQuestions}
            />
        </div>
    );
}
