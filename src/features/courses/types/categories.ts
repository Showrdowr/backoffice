import type { Category, Course } from '../types';
export type { Category } from '../types';

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

export interface CategoryWithCourses extends Category {
    courses: Course[];
}
