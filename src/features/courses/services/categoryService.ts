import { apiClient } from '@/services/api/client';
import type { Category, Subcategory } from '../types';

export const categoryService = {
    // Category operations
    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<Category[]>('/categories');
        return response.data;
    },

    async getCategoryById(id: number | string): Promise<Category | null> {
        try {
            const response = await apiClient.get<Category>(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get category:', error);
            return null;
        }
    },

    async createCategory(data: Partial<Category>): Promise<Category> {
        const response = await apiClient.post<Category>('/categories', data);
        return response.data;
    },

    async updateCategory(id: number | string, data: Partial<Category>): Promise<Category> {
        const response = await apiClient.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    async deleteCategory(id: number | string): Promise<void> {
        await apiClient.delete(`/categories/${id}`);
    },

    // Subcategory operations
    async getSubcategories(categoryId?: number | string): Promise<Subcategory[]> {
        const url = categoryId ? `/subcategories?categoryId=${categoryId}` : '/subcategories';
        const response = await apiClient.get<Subcategory[]>(url);
        return response.data;
    },

    async getSubcategoryById(id: number | string): Promise<Subcategory | null> {
        try {
            const response = await apiClient.get<Subcategory>(`/subcategories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get subcategory:', error);
            return null;
        }
    },

    async createSubcategory(data: Partial<Subcategory>): Promise<Subcategory> {
        const response = await apiClient.post<Subcategory>('/subcategories', data);
        return response.data;
    },

    async updateSubcategory(id: number | string, data: Partial<Subcategory>): Promise<Subcategory> {
        const response = await apiClient.put<Subcategory>(`/subcategories/${id}`, data);
        return response.data;
    },

    async deleteSubcategory(id: number | string): Promise<void> {
        await apiClient.delete(`/subcategories/${id}`);
    },
};
