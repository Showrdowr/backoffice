// Common types used across the application
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'pharmacist' | 'user';
    createdAt: Date;
    updatedAt: Date;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    thumbnail?: string;
    ceCredit?: number;
    status: 'draft' | 'published';
    createdAt: Date;
    updatedAt: Date;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    type: 'video' | 'document' | 'quiz';
    duration: string;
    description?: string;
    order: number;
}

export interface Payment {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface Permission {
    id: string;
    name: string;
    description?: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}
