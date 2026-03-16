import { apiClient } from '@/services/api/client';
import type { User, Pharmacist, UserStats, PharmacistStats, UsersData, PharmacistsData } from '../types';

interface RawUser {
    id: number;
    fullName: string;
    email: string;
    failedAttempts: number;
    createdAt: string;
    courseCount: number;
}

interface RawPharmacist extends RawUser {
    professionalLicenseNumber: string;
}

export const userService = {
    /**
     * Fetch all general users
     */
    async getUsers(page: number = 1, limit: number = 20, search?: string, status?: 'active' | 'inactive'): Promise<UsersData> {
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const statusParam = status ? `&status=${status}` : '';
            const response = await apiClient.get<{ users: RawUser[], stats: UserStats }>(`/users?role=member&page=${page}&limit=${limit}${searchParam}${statusParam}`);
            
            const users: User[] = response.data.users.map(u => ({
                id: u.id.toString(),
                name: u.fullName || 'ไม่ระบุชื่อ',
                email: u.email,
                status: u.failedAttempts < 5 ? 'active' : 'inactive',
                joined: new Date(u.createdAt),
                courses: u.courseCount || 0,
            }));

            return { users, stats: response.data.stats };
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    },

    /**
     * Fetch all pharmacists
     */
    async getPharmacists(page: number = 1, limit: number = 20, search?: string, status?: 'active' | 'inactive'): Promise<PharmacistsData> {
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const statusParam = status ? `&status=${status}` : '';
            const response = await apiClient.get<{ users: RawPharmacist[], stats: PharmacistStats }>(`/users?role=pharmacist&page=${page}&limit=${limit}${searchParam}${statusParam}`);
            
            const pharmacists: Pharmacist[] = response.data.users.map(u => ({
                id: u.id.toString(),
                name: u.fullName || 'ไม่ระบุชื่อ',
                email: u.email,
                license: u.professionalLicenseNumber || '-',
                status: u.failedAttempts < 5 ? 'active' : 'inactive',
                verificationStatus: 'verified', // Placeholder as requested, no CPE logic yet
                cpeCredits: 0, 
                courses: u.courseCount || 0,
                joined: new Date(u.createdAt),
            }));

            const stats: PharmacistStats = {
                total: response.data.stats.total,
                active: response.data.stats.active,
                inactive: response.data.stats.inactive,
                verified: response.data.stats.active, // Placeholder
                totalCpeCredits: 0,
                averageCpeCredits: 0,
            };

            return { pharmacists, stats };
        } catch (error) {
            console.error('Failed to fetch pharmacists:', error);
            throw error;
        }
    },

    /**
     * Delete a user
     */
    async deleteUser(id: string): Promise<void> {
        try {
            // In production: await apiClient.delete(`/users/${id}`);
            console.log('Delete user:', id);
        } catch (error) {
            console.error('Failed to delete user:', error);
            throw error;
        }
    },

    /**
     * Send email to user
     */
    async sendEmail(id: string, message: string): Promise<void> {
        try {
            // In production: await apiClient.post(`/users/${id}/email`, { message });
            console.log('Send email to:', id, message);
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    },
};
