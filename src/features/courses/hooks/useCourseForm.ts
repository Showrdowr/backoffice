'use client';

import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/services/api/client';
import type { Question, QuestionType, ExamType, QuestionOption, ExamSettings, VideoQuestion, Lesson, LessonDocument } from '../types';
import type { Video as VideoType } from '@/features/videos/types';
import { courseService } from '../services/courseService';
import { lessonService } from '../services/lessonService';
import { normalizeCourseAudience } from '../utils/audience';

const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;
const MAX_THUMBNAIL_DIMENSION = 1920;
const ALLOWED_THUMBNAIL_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('READ_FILE_FAILED'));
        reader.readAsDataURL(file);
    });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('LOAD_IMAGE_FAILED'));
        image.src = dataUrl;
    });
}

async function resizeImageDataUrl(
    dataUrl: string,
    mimeType: string,
    maxDimension: number
): Promise<string> {
    const image = await loadImage(dataUrl);
    const originalWidth = image.naturalWidth || image.width;
    const originalHeight = image.naturalHeight || image.height;

    if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
        return dataUrl;
    }

    const scale = Math.min(maxDimension / originalWidth, maxDimension / originalHeight);
    const targetWidth = Math.max(1, Math.round(originalWidth * scale));
    const targetHeight = Math.max(1, Math.round(originalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('CANVAS_CONTEXT_FAILED');
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
        return canvas.toDataURL(mimeType, 0.92);
    }

    return canvas.toDataURL(mimeType);
}

function getBase64SizeBytes(base64Data: string): number {
    const sanitized = base64Data.replace(/\s+/g, '');
    const paddingMatch = sanitized.match(/=+$/);
    const paddingLength = paddingMatch ? paddingMatch[0].length : 0;
    return Math.max(0, Math.floor((sanitized.length * 3) / 4) - paddingLength);
}

// Use Lesson type directly or extend if needed for form-specific temporary states
// But here we can mostly stick to the shared type
export type FormLesson = Lesson & {
    videoQuestions: VideoQuestion[]; // Enforce array even if empty
    documents: LessonDocument[];
};

export interface NewLessonData {
    title: string;
    videoId: number | null;
    duration: string;
    description: string;
    videoQuestions: VideoQuestion[];
    documents: LessonDocument[];
}

function toNumberId(value: string | number | undefined | null): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeLessonForForm(lesson: Lesson): FormLesson {
    return {
        ...lesson,
        videoQuestions: Array.isArray(lesson.videoQuestions) ? lesson.videoQuestions : [],
        documents: Array.isArray(lesson.documents) ? lesson.documents : [],
    };
}

function getLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

type DraftSnapshot = {
    title: string;
    description: string;
    details: string;
    categoryId: string;
    audience: 'all' | 'general' | 'pharmacist';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    courseType: string;
    price: number;
    cpeCredits: number;
    conferenceCode: string;
    language: string;
    hasCertificate: boolean;
    maxStudents: number;
    enrollmentDeadline: string;
    courseEndAt: string;
    ceEnabled: boolean;
    authorName: string;
    relatedCourseIds: number[];
    previewVideoId: number | null;
    uploadedVideos: VideoType[];
};

function createEmptyDraftSnapshot(): DraftSnapshot {
    return {
        title: '',
        description: '',
        details: '',
        categoryId: '',
        audience: 'all',
        status: 'DRAFT',
        courseType: 'paid',
        price: 0,
        cpeCredits: 0,
        conferenceCode: '',
        language: 'Thai',
        hasCertificate: false,
        maxStudents: 0,
        enrollmentDeadline: '',
        courseEndAt: '',
        ceEnabled: false,
        authorName: '',
        relatedCourseIds: [],
        previewVideoId: null,
        uploadedVideos: [],
    };
}

function normalizeDraftSnapshot(value: unknown): DraftSnapshot {
    const fallback = createEmptyDraftSnapshot();
    if (!value || typeof value !== 'object') {
        return fallback;
    }

    const candidate = value as Partial<DraftSnapshot>;
    const normalizedVideos = Array.isArray(candidate.uploadedVideos)
        ? candidate.uploadedVideos
            .filter((video): video is VideoType => Boolean(video && typeof video === 'object'))
            .map((video) => {
                const typedVideo = video as Partial<VideoType>;
                return {
                    id: Number(typedVideo.id),
                    name: typedVideo.name ?? null,
                    provider: typedVideo.provider ?? 'VIMEO',
                    resourceId: String(typedVideo.resourceId || ''),
                    duration: typedVideo.duration ?? 0,
                    status: typedVideo.status ?? 'PROCESSING',
                    createdAt: typedVideo.createdAt ?? null,
                    updatedAt: typedVideo.updatedAt ?? null,
                    usage: {
                        previewCourseCount: Number(typedVideo.usage?.previewCourseCount ?? 0),
                        lessonUsageCount: Number(typedVideo.usage?.lessonUsageCount ?? 0),
                        totalUsageCount: Number(typedVideo.usage?.totalUsageCount ?? 0),
                    },
                } as VideoType;
            })
            .filter((video) => Number.isFinite(video.id) && Boolean(video.resourceId))
        : [];

    return {
        title: typeof candidate.title === 'string' ? candidate.title : fallback.title,
        description: typeof candidate.description === 'string' ? candidate.description : fallback.description,
        details: typeof candidate.details === 'string' ? candidate.details : fallback.details,
        categoryId: typeof candidate.categoryId === 'string' ? candidate.categoryId : fallback.categoryId,
        audience: normalizeCourseAudience(typeof candidate.audience === 'string' ? candidate.audience : fallback.audience),
        status: candidate.status === 'PUBLISHED' || candidate.status === 'ARCHIVED' ? candidate.status : 'DRAFT',
        courseType: typeof candidate.courseType === 'string' ? candidate.courseType : fallback.courseType,
        price: typeof candidate.price === 'number' ? candidate.price : fallback.price,
        cpeCredits: typeof candidate.cpeCredits === 'number' ? candidate.cpeCredits : fallback.cpeCredits,
        conferenceCode: typeof candidate.conferenceCode === 'string' ? candidate.conferenceCode : fallback.conferenceCode,
        language: typeof candidate.language === 'string' ? candidate.language : fallback.language,
        hasCertificate: Boolean(candidate.hasCertificate),
        maxStudents: typeof candidate.maxStudents === 'number' ? candidate.maxStudents : fallback.maxStudents,
        enrollmentDeadline: typeof candidate.enrollmentDeadline === 'string' ? candidate.enrollmentDeadline : fallback.enrollmentDeadline,
        courseEndAt: typeof candidate.courseEndAt === 'string' ? candidate.courseEndAt : fallback.courseEndAt,
        ceEnabled: Boolean(candidate.ceEnabled),
        authorName: typeof candidate.authorName === 'string' ? candidate.authorName : fallback.authorName,
        relatedCourseIds: Array.isArray(candidate.relatedCourseIds)
            ? candidate.relatedCourseIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
            : fallback.relatedCourseIds,
        previewVideoId: typeof candidate.previewVideoId === 'number' ? candidate.previewVideoId : fallback.previewVideoId,
        uploadedVideos: normalizedVideos,
    };
}

export interface UseCourseFormOptions {
    enableDraftPersistence?: boolean;
    draftStorageKey?: string;
}

export function useCourseForm(courseId?: string, options?: UseCourseFormOptions) {
    const [actionError, setActionError] = useState('');
    const enableDraftPersistence = Boolean(options?.enableDraftPersistence && !courseId);
    const draftStorageKey = options?.draftStorageKey || 'backoffice:add-course-draft';
    const [draftRestored, setDraftRestored] = useState(false);
    const [isDraftHydrated, setIsDraftHydrated] = useState(!enableDraftPersistence);
    const [isDraftPersistenceSuspended, setIsDraftPersistenceSuspended] = useState(false);

    // Videos uploaded for this course
    const [uploadedVideos, setUploadedVideos] = useState<VideoType[]>([]);

    // Lessons using the uploaded videos
    const [lessons, setLessons] = useState<FormLesson[]>([]);

    const [courseType, setCourseType] = useState('paid');
    const [ceEnabled, setCeEnabled] = useState(false);

    // Lesson modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<FormLesson | null>(null);
    const [newLesson, setNewLesson] = useState<NewLessonData>({
        title: '',
        videoId: null,
        duration: '',
        description: '',
        videoQuestions: [],
        documents: [],
    });

    // Exam states (Final Exam)
    const [examQuestions, setExamQuestions] = useState<Question[]>([]);
    const [examSettings, setExamSettings] = useState<ExamSettings>({
        minPassingScore: 70,
        timeLimit: 'unlimited',
    });
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
    const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

    // Video handlers
    const handleAddVideo = (video: VideoType) => {
        setUploadedVideos((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === video.id);
            if (existingIndex === -1) {
                return [...prev, video];
            }

            const next = [...prev];
            next[existingIndex] = video;
            return next;
        });
    };

    const handleDeleteVideo = async (videoId: number) => {
        setActionError('');
        // Check if video is being used by any lesson
        const isUsed = lessons.some(l => l.videoId === videoId);
        if (isUsed) {
            setActionError('ไม่สามารถลบวิดีโอนี้ได้ เนื่องจากกำลังถูกใช้งานในบทเรียน');
            return;
        }
        try {
            if (Number.isFinite(Number(videoId))) {
                await apiClient.delete(`/videos/${videoId}`);
            }
            setUploadedVideos((prev) => prev.filter(v => v.id !== videoId));
        } catch (error) {
            console.error('Failed to delete video:', error);
            setActionError(error instanceof Error ? error.message : 'ลบวิดีโอไม่สำเร็จ');
            return;
        }
        if (previewVideoId === videoId) {
            setPreviewVideoId(null);
        }
    };

    // Preview Video
    const [previewVideoId, setPreviewVideoId] = useState<number | null>(null);

    const handleSetPreviewVideo = (videoId: number) => {
        setPreviewVideoId(videoId === previewVideoId ? null : videoId);
    };

    // Lesson handlers
    const handleAddLesson = async (lessonData: NewLessonData) => {
        setActionError('');
        if (!courseId || !lessonData.videoId) {
            const lesson: FormLesson = {
                id: Date.now().toString(),
                title: lessonData.title,
                videoId: lessonData.videoId,
                duration: lessonData.duration,
                description: lessonData.description,
                videoQuestions: lessonData.videoQuestions || [],
                documents: lessonData.documents || [],
            };
            setLessons((prev) => [...prev, lesson]);
            setNewLesson({ title: '', videoId: null, duration: '', description: '', videoQuestions: [], documents: [] });
            setShowAddModal(false);
            return;
        }

        try {
            const createdLesson = await lessonService.createLesson({
                courseId: Number(courseId),
                title: lessonData.title,
                videoId: lessonData.videoId,
                sequenceOrder: lessons.length + 1,
            });

            if (lessonData.documents.length > 0) {
                for (const document of lessonData.documents) {
                    await lessonService.addLessonDocument({
                        lessonId: Number(createdLesson.id),
                        fileName: document.fileName,
                        mimeType: document.mimeType,
                        sizeBytes: document.sizeBytes,
                        fileUrl: document.fileUrl,
                    });
                }
            }

            const refreshed = await lessonService.getLessons(Number(courseId));
            setLessons(refreshed.lessons.map((lesson) => normalizeLessonForForm(lesson)));
            setNewLesson({ title: '', videoId: null, duration: '', description: '', videoQuestions: [], documents: [] });
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to create lesson:', error);
            setActionError(error instanceof Error ? error.message : 'สร้างบทเรียนไม่สำเร็จ');
        }
    };

    const handleEditLesson = async () => {
        setActionError('');
        if (currentLesson) {
            if (!courseId) {
                setLessons(lessons.map((l) => (l.id === currentLesson.id ? currentLesson : l)));
                setShowEditModal(false);
                setCurrentLesson(null);
                return;
            }

            try {
                await lessonService.updateLesson(Number(currentLesson.id), {
                    title: currentLesson.title,
                    videoId: currentLesson.videoId ? Number(currentLesson.videoId) : undefined,
                });

                const originalLesson = lessons.find((lesson) => String(lesson.id) === String(currentLesson.id));
                const originalDocuments = Array.isArray(originalLesson?.documents) ? originalLesson.documents : [];
                const nextDocuments = Array.isArray(currentLesson.documents) ? currentLesson.documents : [];

                const originalDocIds = new Set(originalDocuments.map((doc) => String(doc.id)));
                const nextDocIds = new Set(nextDocuments.map((doc) => String(doc.id)));

                for (const document of originalDocuments) {
                    if (!nextDocIds.has(String(document.id))) {
                        await lessonService.deleteLessonDocument(Number(document.id));
                    }
                }

                for (const document of nextDocuments) {
                    if (!originalDocIds.has(String(document.id)) || String(document.id).startsWith('doc-')) {
                        await lessonService.addLessonDocument({
                            lessonId: Number(currentLesson.id),
                            fileName: document.fileName,
                            mimeType: document.mimeType,
                            sizeBytes: document.sizeBytes,
                            fileUrl: document.fileUrl,
                        });
                    }
                }

                const refreshed = await lessonService.getLessons(Number(courseId));
                setLessons(refreshed.lessons.map((lesson) => normalizeLessonForForm(lesson)));
                setShowEditModal(false);
                setCurrentLesson(null);
            } catch (error) {
                console.error('Failed to update lesson:', error);
                setActionError(error instanceof Error ? error.message : 'บันทึกบทเรียนไม่สำเร็จ');
            }
        }
    };

    const handleDeleteLesson = async () => {
        setActionError('');
        if (currentLesson) {
            if (!courseId) {
                setLessons(lessons.filter((l) => l.id !== currentLesson.id));
                setShowDeleteModal(false);
                setCurrentLesson(null);
                return;
            }

            try {
                await lessonService.deleteLesson(Number(currentLesson.id));
                setLessons((prev) => prev.filter((lesson) => String(lesson.id) !== String(currentLesson.id)));
                setShowDeleteModal(false);
                setCurrentLesson(null);
            } catch (error) {
                console.error('Failed to delete lesson:', error);
                setActionError(error instanceof Error ? error.message : 'ลบบทเรียนไม่สำเร็จ');
            }
        }
    };

    const openEditModal = (lesson: FormLesson) => {
        setCurrentLesson(lesson);
        setShowEditModal(true);
    };

    const openDeleteModal = (lesson: FormLesson) => {
        setCurrentLesson(lesson);
        setShowDeleteModal(true);
    };

    // Question handlers (Final Exam)
    const handleAddExamQuestion = (questionData: {
        type: QuestionType;
        examType: ExamType;
        question: string;
        options?: QuestionOption[];
        correctAnswer?: string;
        timestamp?: string;
        points?: number;
    }) => {
        const question: Question = {
            id: Date.now().toString(),
            ...questionData,
        };
        setExamQuestions([...examQuestions, question]);
        setShowAddQuestionModal(false);
    };

    const handleEditExamQuestion = () => {
        if (currentQuestion) {
            setExamQuestions(examQuestions.map((q) => (q.id === currentQuestion.id ? currentQuestion : q)));
            setShowEditQuestionModal(false);
            setCurrentQuestion(null);
        }
    };

    const handleDeleteExamQuestion = () => {
        if (currentQuestion) {
            setExamQuestions(examQuestions.filter((q) => q.id !== currentQuestion.id));
            setShowDeleteQuestionModal(false);
            setCurrentQuestion(null);
        }
    };

    const openEditQuestionModal = (question: Question) => {
        setCurrentQuestion(question);
        setShowEditQuestionModal(true);
    };

    const openDeleteQuestionModal = (question: Question) => {
        setCurrentQuestion(question);
        setShowDeleteQuestionModal(true);
    };

    // Basic Course Info State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState(''); // รายละเอียดคอร์ส
    const [categoryId, setCategoryId] = useState<string>('');
    const [audience, setAudience] = useState<'all' | 'general' | 'pharmacist'>('all');
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
    const [price, setPrice] = useState<number>(0);
    const [cpeCredits, setCpeCredits] = useState<number>(0);
    const [conferenceCode, setConferenceCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('Thai');
    const [hasCertificate, setHasCertificate] = useState<boolean>(false);
    const [maxStudents, setMaxStudents] = useState<number>(0);
    const [enrollmentDeadline, setEnrollmentDeadline] = useState<string>('');
    const [courseEndAt, setCourseEndAt] = useState<string>('');
    const [authorName, setAuthorName] = useState<string>('');
    const [relatedCourseIds, setRelatedCourseIds] = useState<number[]>([]);
    const [enrolledCount, setEnrolledCount] = useState<number>(0);
    const [thumbnail, setThumbnail] = useState<string>('');
    const [thumbnailMimeType, setThumbnailMimeType] = useState<string>('');
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [thumbnailError, setThumbnailError] = useState<string>('');

    const settingsValidationErrors = useMemo(() => {
        const errors: string[] = [];
        const today = getLocalDateString(new Date());

        if (maxStudents < 0) {
            errors.push('จำนวนรับสูงสุดต้องไม่ติดลบ');
        }

        if (enrollmentDeadline && enrollmentDeadline < today) {
            errors.push('วันหมดเขตสมัครต้องไม่ย้อนหลัง');
        }

        if (courseEndAt && courseEndAt < today) {
            errors.push('วันสิ้นสุดคอร์สต้องไม่ย้อนหลัง');
        }

        if (enrollmentDeadline && courseEndAt && courseEndAt < enrollmentDeadline) {
            errors.push('วันสิ้นสุดคอร์สต้องไม่เร็วกว่าวันหมดเขตสมัคร');
        }

        return errors;
    }, [courseEndAt, enrollmentDeadline, maxStudents]);

    const currentDraftSnapshot = useMemo<DraftSnapshot>(() => ({
        title,
        description,
        details,
        categoryId,
        audience,
        status,
        courseType,
        price,
        cpeCredits,
        conferenceCode,
        language,
        hasCertificate,
        maxStudents,
        enrollmentDeadline,
        courseEndAt,
        ceEnabled,
        authorName,
        relatedCourseIds,
        previewVideoId,
        uploadedVideos,
    }), [
        authorName,
        audience,
        categoryId,
        ceEnabled,
        conferenceCode,
        cpeCredits,
        courseEndAt,
        courseType,
        description,
        details,
        enrollmentDeadline,
        hasCertificate,
        language,
        maxStudents,
        previewVideoId,
        price,
        relatedCourseIds,
        status,
        title,
        uploadedVideos,
    ]);

    const hasPersistableDraft = useMemo(() => {
        if (!enableDraftPersistence) {
            return false;
        }

        return JSON.stringify(currentDraftSnapshot) !== JSON.stringify(createEmptyDraftSnapshot());
    }, [currentDraftSnapshot, enableDraftPersistence]);

    const hasUnsavedChanges = useMemo(() => {
        if (!enableDraftPersistence) {
            return false;
        }

        return hasPersistableDraft || Boolean(thumbnail) || Boolean(thumbnailPreview);
    }, [enableDraftPersistence, hasPersistableDraft, thumbnail, thumbnailPreview]);

    // Load initial data if editing
    useEffect(() => {
        if (courseId) {
            courseService.getCourse(courseId).then(data => {
                setTitle(data.title || '');
                setDescription(data.description || '');
                setDetails(data.details || '');
                setCategoryId(data.categoryId?.toString() || '');
                setAudience(normalizeCourseAudience(typeof data.audience === 'string' ? data.audience : 'all'));
                setCourseType(data.price && Number(data.price) > 0 ? 'paid' : 'free');
                setPrice(Number(data.price) || 0);
                setCpeCredits(Number(data.cpeCredits ?? 0) || 0);
                setConferenceCode(data.conferenceCode || '');
                setCeEnabled((Number(data.cpeCredits ?? 0) || 0) > 0 || Boolean(data.conferenceCode));
                setLanguage(data.language || 'Thai');
                setHasCertificate(Boolean(data.hasCertificate));
                setMaxStudents(Number(data.maxStudents) || 0);
                if (data.enrollmentDeadline) {
                    const parsedDate = new Date(String(data.enrollmentDeadline));
                    setEnrollmentDeadline(
                        Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10)
                    );
                } else {
                    setEnrollmentDeadline('');
                }
                if (data.courseEndAt) {
                    const parsedDate = new Date(String(data.courseEndAt));
                    setCourseEndAt(
                        Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10)
                    );
                } else {
                    setCourseEndAt('');
                }
                setAuthorName(data.authorName || '');
                setRelatedCourseIds(Array.isArray(data.relatedCourseIds) ? data.relatedCourseIds.map((id) => Number(id)) : []);
                setEnrolledCount(Number(data.enrolledCount ?? data.enrollmentsCount ?? 0));
                if (data.thumbnail) {
                    setThumbnailPreview(data.thumbnail);
                }
                setPreviewVideoId(data.previewVideoId ?? null);
                const normalizedStatus = String(data.status || 'DRAFT').toUpperCase();
                setStatus(
                    normalizedStatus === 'PUBLISHED' || normalizedStatus === 'ARCHIVED'
                        ? normalizedStatus
                        : 'DRAFT'
                );
                // Maps lessons and other data as needed
                if (Array.isArray(data.lessons)) {
                    const normalizedLessons: FormLesson[] = data.lessons.map((lesson) => normalizeLessonForForm(lesson));
                    setLessons(normalizedLessons);

                    const videosMap = new Map<number, VideoType>();
                    if (data.previewVideo && typeof data.previewVideo.id === 'number') {
                        videosMap.set(data.previewVideo.id, data.previewVideo as VideoType);
                    }
                    normalizedLessons.forEach((lesson) => {
                        if (lesson.video && typeof lesson.video.id === 'number') {
                            videosMap.set(lesson.video.id, lesson.video as VideoType);
                        }
                    });
                    setUploadedVideos(Array.from(videosMap.values()));
                }
            });
        }
    }, [courseId]);

    useEffect(() => {
        if (!enableDraftPersistence) {
            return;
        }

        try {
            const rawDraft = sessionStorage.getItem(draftStorageKey);
            if (!rawDraft) {
                setIsDraftHydrated(true);
                return;
            }

            const snapshot = normalizeDraftSnapshot(JSON.parse(rawDraft));
            setTitle(snapshot.title);
            setDescription(snapshot.description);
            setDetails(snapshot.details);
            setCategoryId(snapshot.categoryId);
            setAudience(snapshot.audience);
            setStatus(snapshot.status);
            setCourseType(snapshot.courseType);
            setPrice(snapshot.price);
            setCpeCredits(snapshot.cpeCredits);
            setConferenceCode(snapshot.conferenceCode);
            setLanguage(snapshot.language);
            setHasCertificate(snapshot.hasCertificate);
            setMaxStudents(snapshot.maxStudents);
            setEnrollmentDeadline(snapshot.enrollmentDeadline);
            setCourseEndAt(snapshot.courseEndAt);
            setCeEnabled(snapshot.ceEnabled);
            setAuthorName(snapshot.authorName);
            setRelatedCourseIds(snapshot.relatedCourseIds);
            setPreviewVideoId(snapshot.previewVideoId);
            setUploadedVideos(snapshot.uploadedVideos);
            setDraftRestored(true);
            setIsDraftPersistenceSuspended(false);
        } catch (error) {
            console.error('Failed to restore add-course draft:', error);
            sessionStorage.removeItem(draftStorageKey);
        } finally {
            setIsDraftHydrated(true);
        }
    }, [draftStorageKey, enableDraftPersistence]);

    useEffect(() => {
        if (!enableDraftPersistence || !isDraftHydrated || isDraftPersistenceSuspended) {
            return;
        }

        if (!hasPersistableDraft) {
            sessionStorage.removeItem(draftStorageKey);
            return;
        }

        try {
            sessionStorage.setItem(draftStorageKey, JSON.stringify(currentDraftSnapshot));
        } catch (error) {
            console.error('Failed to persist add-course draft:', error);
        }
    }, [currentDraftSnapshot, draftStorageKey, enableDraftPersistence, hasPersistableDraft, isDraftHydrated, isDraftPersistenceSuspended]);

    useEffect(() => {
        if (!enableDraftPersistence || !hasUnsavedChanges) {
            return;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [enableDraftPersistence, hasUnsavedChanges]);

    useEffect(() => {
        if (previewVideoId === null) {
            return;
        }

        const previewStillAvailable = uploadedVideos.some((video) => Number(video.id) === Number(previewVideoId));
        if (!previewStillAvailable) {
            setPreviewVideoId(null);
        }
    }, [previewVideoId, uploadedVideos]);

    const handleThumbnailSelect = async (file: File) => {
        setThumbnailError('');

        if (!ALLOWED_THUMBNAIL_MIME_TYPES.has(file.type)) {
            setThumbnailError('รองรับเฉพาะไฟล์ JPG, PNG และ WEBP');
            return;
        }

        if (file.size > MAX_THUMBNAIL_BYTES) {
            setThumbnailError('ไฟล์รูปต้องไม่เกิน 5MB');
            return;
        }

        try {
            const originalDataUrl = await readFileAsDataUrl(file);
            const resizedDataUrl = await resizeImageDataUrl(
                originalDataUrl,
                file.type,
                MAX_THUMBNAIL_DIMENSION
            );
            const base64Data = resizedDataUrl.split(',')[1] || '';
            if (!base64Data) {
                throw new Error('INVALID_IMAGE_DATA');
            }

            const resizedBytes = getBase64SizeBytes(base64Data);
            if (resizedBytes > MAX_THUMBNAIL_BYTES) {
                setThumbnailError('ไฟล์รูปต้องไม่เกิน 5MB');
                return;
            }

            const mimeMatch = resizedDataUrl.match(/^data:([^;]+);base64,/i);
            const resolvedMimeType = (mimeMatch?.[1] || file.type).toLowerCase();

            setThumbnailPreview(resizedDataUrl);
            setThumbnail(base64Data);
            setThumbnailMimeType(resolvedMimeType);
        } catch (error) {
            console.error('Failed to process thumbnail:', error);
            setThumbnailError('ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองใหม่');
        }
    };

    const clearThumbnail = () => {
        setThumbnail('');
        setThumbnailMimeType('');
        setThumbnailPreview('');
        setThumbnailError('');
    };

    const clearDraftState = () => {
        if (!enableDraftPersistence) {
            return;
        }

        setIsDraftPersistenceSuspended(true);
        sessionStorage.removeItem(draftStorageKey);
        setDraftRestored(false);
    };

    const buildPayload = (statusOverride?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
        const parsedCategoryId = parseInt(categoryId, 10);
        const resolvedPreviewVideoId = previewVideoId !== null
            && uploadedVideos.some((video) => Number(video.id) === Number(previewVideoId))
            ? previewVideoId
            : null;
        const resolvedPrice = Number(price || 0);
        const resolvedCpeCredits = Number(cpeCredits || 0);
        const resolvedMaxStudents = Number(maxStudents || 0);

        return {
            title,
            description,
            details,
            categoryId: Number.isNaN(parsedCategoryId) ? undefined : parsedCategoryId,
            audience,
            price: courseType === 'free' ? 0 : (Number.isFinite(resolvedPrice) ? resolvedPrice : 0),
            cpeCredits: ceEnabled ? (Number.isFinite(resolvedCpeCredits) ? resolvedCpeCredits : 0) : 0,
            conferenceCode: ceEnabled ? conferenceCode || undefined : undefined,
            language: language.trim() || undefined,
            hasCertificate,
            maxStudents: resolvedMaxStudents > 0 ? resolvedMaxStudents : undefined,
            enrollmentDeadline: enrollmentDeadline ? `${enrollmentDeadline}T00:00:00.000Z` : undefined,
            courseEndAt: courseEndAt ? `${courseEndAt}T00:00:00.000Z` : undefined,
            authorName: authorName || undefined,
            thumbnail: thumbnail || undefined,
            thumbnailMimeType: thumbnailMimeType || undefined,
            previewVideoId: resolvedPreviewVideoId,
            relatedCourseIds,
            status: statusOverride || status,
        };
    };

    const createCourse = async (statusOverride?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
        const payload = buildPayload(statusOverride);
        return courseService.createCourse(payload);
    };

    const saveCourse = async (statusOverride?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
        if (!courseId) return;
        const payload = buildPayload(statusOverride);
        return courseService.updateCourse(courseId, payload);
    };

    return {
        // Basic Info
        title, setTitle,
        actionError,
        setActionError,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        audience, setAudience,
        price, setPrice,
        cpeCredits, setCpeCredits,
        conferenceCode, setConferenceCode,
        language, setLanguage,
        hasCertificate, setHasCertificate,
        maxStudents, setMaxStudents,
        enrollmentDeadline, setEnrollmentDeadline,
        courseEndAt, setCourseEndAt,
        authorName, setAuthorName,
        relatedCourseIds, setRelatedCourseIds,
        enrolledCount,
        thumbnailPreview,
        thumbnailError,
        handleThumbnailSelect,
        clearThumbnail,
        settingsValidationErrors,
        hasUnsavedChanges,
        draftRestored,
        clearDraftState,

        // Actions
        saveCourse,
        createCourse,
        status, setStatus,

        // Videos
        uploadedVideos,
        handleAddVideo,
        handleDeleteVideo,

        // Lessons
        lessons,
        setLessons,
        newLesson,
        currentLesson,
        setNewLesson,
        setCurrentLesson,

        // Course settings
        courseType,
        setCourseType,
        ceEnabled,
        setCeEnabled,

        // Lesson modals
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,

        // Lesson handlers
        handleAddLesson,
        handleEditLesson,
        handleDeleteLesson,
        openEditModal,
        openDeleteModal,

        // Questions (Final Exam)
        questions: examQuestions, // Export as questions for compatibility or rename in consumer
        examQuestions,
        currentQuestion,
        examSettings,
        setExamSettings,

        // Question modals
        showAddQuestionModal,
        setShowAddQuestionModal,
        showEditQuestionModal,
        setShowEditQuestionModal,
        showDeleteQuestionModal,
        setShowDeleteQuestionModal,

        // Question handlers
        handleAddQuestion: handleAddExamQuestion,
        handleEditQuestion: handleEditExamQuestion,
        handleDeleteQuestion: handleDeleteExamQuestion,
        openDeleteQuestionModal,

        // Preview Video
        previewVideoId,
        handleSetPreviewVideo,
    };
}
