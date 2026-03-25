// Courses feature types - Aligned with Database Schema
// NOTE: Some fields have aliases for backward compatibility

import type { Video } from '../videos/types';

// ==========================================
// Enums
// ==========================================

export enum CourseStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export type CourseAudience = 'all' | 'general' | 'pharmacist';
export type CourseAdminAction = 'delete' | 'archive';

export interface CourseDeletionBlockers {
    enrollmentsCount: number;
    certificatesCount: number;
    orderItemsCount: number;
}

// QuestionType - supports both legacy and new schema values
export type QuestionType =
    | 'MULTIPLE_CHOICE'
    | 'TRUE_FALSE'
    | 'SHORT_ANSWER'
    | 'FREE_TEXT'
    | 'multiple-choice'
    | 'free-text';

// ==========================================
// Category
// ==========================================

export interface Category {
    id: number;
    name: string;
    description?: string;
    color?: string;
    // Display field
    courseCount?: number;
    // Relations
    subcategories?: Subcategory[];
}

export interface Subcategory {
    id: number;
    categoryId: number;
    name: string;
    description?: string;
    color?: string;
    // Relations
    category?: Category;
    // Display field
    courseCount?: number;
}

// ==========================================
// Course
// ==========================================

export interface Course {
    id: number | string;
    categoryId?: number;
    subcategoryId?: number;
    title: string;
    description?: string;
    details?: string;
    authorName?: string;
    price?: number;
    language?: string;
    audience?: CourseAudience;
    skillLevel?: 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    hasCertificate?: boolean;
    maxStudents?: number | null;
    enrollmentDeadline?: string | Date;
    courseEndAt?: string | Date;
    // Schema field
    thumbnailUrl?: string;
    // Backward compatible alias
    thumbnail?: string;
    previewVideoId?: number;
    cpeCredits?: number;
    conferenceCode?: string;
    status: CourseStatus | 'draft' | 'published' | 'archived';
    publishedAt?: string;
    createdAt: string | Date;
    updatedAt?: string | Date;
    // Relations
    category?: Category | string;
    subcategory?: Subcategory;
    previewVideo?: Video;
    lessons?: Lesson[];
    exams?: Exam[];
    exam?: Exam | null;
    relatedCourses?: Course[];
    relatedCourseIds?: number[];
    deletionBlockers?: CourseDeletionBlockers;
    canHardDelete?: boolean;
    recommendedAdminAction?: CourseAdminAction;
    // Frontend display fields (backward compatible)
    enrollmentsCount?: number;
    enrolledCount?: number;
    enrollments?: number;
    lessonsCount?: number;
    rating?: number;
    instructor?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    duration?: string;
    categories?: string[];
    tags?: string[];
}

// ==========================================
// Lesson (บทเรียน)
// ==========================================

export interface Lesson {
    id: number | string;
    courseId?: number | string;
    videoId?: number | null;
    title: string;
    sequenceOrder?: number;
    // Backward compatible
    type?: 'video' | 'document' | 'exam';
    duration?: string;
    description?: string;
    order?: number;
    // Relations
    video?: Video;
    videoQuestions?: VideoQuestion[];
    documents?: LessonDocument[];
    documentsCount?: number;
    lessonQuiz?: LessonQuiz | null;
    hasQuiz?: boolean;
}

export interface LessonDocument {
    id: number | string;
    lessonId: number | string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    fileUrl?: string;
    createdAt?: string;
}

export interface LessonQuiz {
    id: number | string;
    lessonId: number | string;
    passingScorePercent?: number;
    maxAttempts?: number | null;
    questions?: LessonQuizQuestion[];
}

export interface LessonQuizQuestion {
    id: number | string;
    lessonQuizId: number | string;
    questionText?: string;
    questionType: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
    scoreWeight?: number;
}

// ==========================================
// VideoQuestion (คำถาม Interactive ระหว่างดูวิดีโอ)
// ==========================================

export interface VideoQuestion {
    id: number | string;
    lessonId: number | string;
    questionText?: string;
    displayAtSeconds?: number;
    sortOrder?: number;
    questionType: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
    updatedAt?: string;
}

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect?: boolean;
}

// ==========================================
// Exam (แบบทดสอบหลังเรียน)
// ==========================================

export interface Exam {
    id: number | string;
    courseId: number | string;
    title: string;
    description?: string;
    passingScorePercent?: number;
    timeLimitMinutes?: number;
    // Relations
    questions?: ExamQuestion[];
}

export interface ExamQuestion {
    id: number | string;
    examId: number | string;
    questionText?: string;
    questionType: QuestionType;
    options?: QuestionOption[];
    scoreWeight?: number;
    correctAnswer?: string;
}

// ==========================================
// Legacy types for backward compatibility
// ==========================================

export type ExamType = 'final-exam' | 'interactive';

export interface Question {
    id: string;
    type: QuestionType;
    examType: ExamType;
    question: string;
    options?: QuestionOption[];
    correctAnswer?: string;
    timestamp?: string;
    points?: number;
}

export interface ExamSettings {
    minPassingScore: number;
    timeLimit: number | 'unlimited';
}


// ==========================================
// Stats & Data interfaces
// ==========================================

export interface CourseStats {
    total: number;
    published: number;
    draft: number;
    archived?: number;
    totalRevenue?: number;
}

export interface CoursesData {
    courses: Course[];
    stats: CourseStats;
}

export interface CategoriesData {
    categories: Category[];
    tags?: string[];
}

// ==========================================
// Form Input interfaces
// ==========================================

export interface CreateCourseInput {
    categoryId?: number;
    title: string;
    description?: string;
    details?: string;
    authorName?: string;
    price?: number;
    language?: string;
    audience?: CourseAudience;
    hasCertificate?: boolean;
    maxStudents?: number;
    enrollmentDeadline?: string;
    courseEndAt?: string;
    previewVideoId?: number;
    cpeCredits?: number;
    conferenceCode?: string;
    status?: CourseStatus;
    relatedCourseIds?: number[];
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
    id: number;
}

export interface CreateLessonInput {
    courseId: number;
    videoId: number;
    title: string;
    description?: string;
    sequenceOrder?: number;
}

export interface CreateVideoQuestionInput {
    lessonId: number;
    questionText: string;
    displayAtSeconds: number;
    sortOrder?: number;
    questionType: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
}

export interface UpdateVideoQuestionInput extends Partial<CreateVideoQuestionInput> {}

export interface CreateLessonDocumentInput {
    lessonId: number;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    fileUrl: string;
}

export interface CreateLessonQuizInput {
    lessonId: number;
    passingScorePercent?: number;
    maxAttempts?: number | null;
    questions?: CreateLessonQuizQuestionInput[];
}

export interface CreateLessonQuizQuestionInput {
    questionText: string;
    questionType: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
    scoreWeight?: number;
}

export interface CreateExamInput {
    courseId: number;
    title: string;
    description?: string;
    passingScorePercent?: number;
    timeLimitMinutes?: number;
}

export interface CreateExamQuestionInput {
    examId: number;
    questionText: string;
    questionType: QuestionType;
    options?: QuestionOption[];
    scoreWeight?: number;
    correctAnswer?: string;
}
