'use client';

import { useState, useEffect } from 'react';
import type { Question, QuestionType, ExamType, QuestionOption, ExamSettings, VideoQuestion, Lesson } from '../types';
import type { Video as VideoType } from '@/features/videos/types';
import { courseService } from '../services/courseService';

// Use Lesson type directly or extend if needed for form-specific temporary states
// But here we can mostly stick to the shared type
export type FormLesson = Lesson & {
    videoQuestions: VideoQuestion[]; // Enforce array even if empty
};

export interface NewLessonData {
    title: string;
    videoId: number | null;
    duration: string;
    description: string;
    videoQuestions: VideoQuestion[];
}

export function useCourseForm(courseId?: string) {
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
    });

    // Exam states (Final Exam)
    const [examQuestions, setExamQuestions] = useState<Question[]>([]);
    const [examSettings, setExamSettings] = useState<ExamSettings>({
        minPassingScore: 70,
        maxAttempts: 'unlimited',
    });
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
    const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

    // Video handlers
    const handleAddVideo = (video: VideoType) => {
        setUploadedVideos([...uploadedVideos, video]);
    };

    const handleDeleteVideo = (videoId: number) => {
        // Check if video is being used by any lesson
        const isUsed = lessons.some(l => l.videoId === videoId);
        if (isUsed) {
            alert('ไม่สามารถลบวิดีโอนี้ได้ เนื่องจากกำลังถูกใช้งานในบทเรียน');
            return;
        }
        setUploadedVideos(uploadedVideos.filter(v => v.id !== videoId));
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
    const handleAddLesson = (lessonData: NewLessonData) => {
        const lesson: FormLesson = {
            id: Date.now().toString(),
            title: lessonData.title,
            videoId: lessonData.videoId,
            duration: lessonData.duration,
            description: lessonData.description,
            videoQuestions: lessonData.videoQuestions || [],
        };
        setLessons([...lessons, lesson]);
        setNewLesson({ title: '', videoId: null, duration: '', description: '', videoQuestions: [] });
        setShowAddModal(false);
    };

    const handleEditLesson = () => {
        if (currentLesson) {
            setLessons(lessons.map((l) => (l.id === currentLesson.id ? currentLesson : l)));
            setShowEditModal(false);
            setCurrentLesson(null);
        }
    };

    const handleDeleteLesson = () => {
        if (currentLesson) {
            setLessons(lessons.filter((l) => l.id !== currentLesson.id));
            setShowDeleteModal(false);
            setCurrentLesson(null);
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
    const [subcategoryId, setSubcategoryId] = useState<string>('');
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
    const [price, setPrice] = useState<number>(0);
    const [cpeCredits, setCpeCredits] = useState<number>(0);
    const [conferenceCode, setConferenceCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('Thai');
    const [skillLevel, setSkillLevel] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
    const [hasCertificate, setHasCertificate] = useState<boolean>(false);
    const [enrollmentDeadline, setEnrollmentDeadline] = useState<string>('');
    const [authorName, setAuthorName] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>('');
    const [thumbnailMimeType, setThumbnailMimeType] = useState<string>('');
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

    // Load initial data if editing
    useEffect(() => {
        if (courseId) {
            courseService.getCourse(courseId).then(data => {
                setTitle(data.title || '');
                setDescription(data.description || '');
                setDetails(data.details || '');
                setCategoryId(data.categoryId?.toString() || '');
                setSubcategoryId(data.subcategoryId?.toString() || '');
                setCourseType(data.price && Number(data.price) > 0 ? 'paid' : 'free');
                setPrice(Number(data.price) || 0);
                setCpeCredits(data.cpeCredits ?? 0);
                setConferenceCode(data.conferenceCode || '');
                setCeEnabled((data.cpeCredits ?? 0) > 0 || Boolean(data.conferenceCode));
                setLanguage(data.language || 'Thai');
                const normalizedSkillLevel = String(data.skillLevel || 'ALL').toUpperCase();
                setSkillLevel(
                    normalizedSkillLevel === 'BEGINNER' ||
                        normalizedSkillLevel === 'INTERMEDIATE' ||
                        normalizedSkillLevel === 'ADVANCED'
                        ? normalizedSkillLevel
                        : 'ALL'
                );
                setHasCertificate(Boolean(data.hasCertificate));
                if (data.enrollmentDeadline) {
                    const parsedDate = new Date(String(data.enrollmentDeadline));
                    setEnrollmentDeadline(
                        Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10)
                    );
                } else {
                    setEnrollmentDeadline('');
                }
                setAuthorName(data.authorName || '');
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
                    const normalizedLessons: FormLesson[] = data.lessons.map((lesson) => ({
                        ...lesson,
                        videoQuestions: Array.isArray(lesson.videoQuestions) ? lesson.videoQuestions : [],
                    }));
                    setLessons(normalizedLessons);
                }
            });
        }
    }, [courseId]);

    const handleThumbnailSelect = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setThumbnailPreview(base64);
            // Strip the data:...;base64, prefix for storage
            const base64Data = base64.split(',')[1] || base64;
            setThumbnail(base64Data);
            setThumbnailMimeType(file.type);
        };
        reader.readAsDataURL(file);
    };

    const buildPayload = () => {
        const parsedCategoryId = parseInt(categoryId, 10);
        const parsedSubcategoryId = parseInt(subcategoryId, 10);
        return {
            title,
            description,
            details,
            categoryId: Number.isNaN(parsedCategoryId) ? undefined : parsedCategoryId,
            subcategoryId: Number.isNaN(parsedSubcategoryId) ? undefined : parsedSubcategoryId,
            price: courseType === 'free' ? 0 : price,
            cpeCredits: ceEnabled ? cpeCredits : 0,
            conferenceCode: ceEnabled ? conferenceCode || undefined : undefined,
            language: language.trim() || undefined,
            skillLevel,
            hasCertificate,
            enrollmentDeadline: enrollmentDeadline ? `${enrollmentDeadline}T00:00:00.000Z` : undefined,
            authorName: authorName || undefined,
            thumbnail: thumbnail || undefined,
            thumbnailMimeType: thumbnailMimeType || undefined,
            previewVideoId,
            status,
        };
    };

    const createCourse = async () => {
        const payload = buildPayload();
        return courseService.createCourse(payload);
    };

    const saveCourse = async () => {
        if (!courseId) return;
        const payload = buildPayload();
        return courseService.updateCourse(courseId, payload);
    };

    return {
        // Basic Info
        title, setTitle,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        subcategoryId, setSubcategoryId,
        price, setPrice,
        cpeCredits, setCpeCredits,
        conferenceCode, setConferenceCode,
        language, setLanguage,
        skillLevel, setSkillLevel,
        hasCertificate, setHasCertificate,
        enrollmentDeadline, setEnrollmentDeadline,
        authorName, setAuthorName,
        thumbnailPreview,
        handleThumbnailSelect,

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
