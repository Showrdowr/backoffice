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

// QuestionType - supports both legacy and new schema values
export type QuestionType =
    | 'MULTIPLE_CHOICE'
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
    authorName?: string;
    price?: number;
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
    // Frontend display fields (backward compatible)
    enrollmentsCount?: number;
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
}

// ==========================================
// VideoQuestion (คำถาม Interactive ระหว่างดูวิดีโอ)
// ==========================================

export interface VideoQuestion {
    id: number | string;
    lessonId: number | string;
    questionText?: string;
    displayAtSeconds?: number;
    questionType: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
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
    maxAttempts: number | 'unlimited';
    timeLimit?: number;
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
    authorName?: string;
    price?: number;
    previewVideoId?: number;
    cpeCredits?: number;
    conferenceCode?: string;
    status?: CourseStatus;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
    id: number;
}

export interface CreateLessonInput {
    courseId: number;
    videoId: number;
    title: string;
    sequenceOrder?: number;
}

export interface CreateVideoQuestionInput {
    lessonId: number;
    questionText: string;
    displayAtSeconds: number;
    questionType: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string;
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
