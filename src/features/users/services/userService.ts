import { apiClient } from '@/services/api/client';
import { parseDbDate } from '@/utils/date';
import type {
    Pharmacist,
    PharmacistStats,
    PharmacistsData,
    User,
    UserOverviewResponse,
    UserStats,
    UsersData,
} from '../types';

interface RawUser {
    id: number;
    fullName: string | null;
    email: string;
    failedAttempts: number;
    createdAt: string;
    courseCount: number;
    professionalLicenseNumber?: string | null;
    earnedCpeCredits?: number | null;
}

interface RawUsersResponse<TUser, TStats> {
    users: TUser[];
    stats: TStats;
}

interface RawUserProfile {
    id: string;
    fullName: string;
    email: string;
    role: 'member' | 'pharmacist' | 'admin';
    professionalLicenseNumber: string | null;
    createdAt: string;
    accountStatus: 'active' | 'inactive';
    failedAttempts: number;
}

interface RawUserOverviewResponse {
    profile: RawUserProfile;
    summary: UserOverviewResponse['summary'];
    enrollments: Array<{
        id: string;
        courseId: string;
        courseTitle: string;
        watchPercent: number;
        completionPercent: number;
        isCompleted: boolean;
        enrolledAt: string;
        cpeCredits: number;
        certificateCode: string | null;
    }>;
    transactions: Array<{
        id: string;
        amount: number;
        status: string;
        createdAt: string;
        courseTitles: string[];
    }>;
    certificates: Array<{
        id: string;
        certificateCode: string;
        issuedAt: string;
        courseId: string;
        courseTitle: string;
        cpeCredits: number;
    }>;
}

interface RawEditableUser {
    id: number;
    fullName: string | null;
    email: string;
    professionalLicenseNumber?: string | null;
}

function mapBaseUser(user: RawUser): User {
    return {
        id: user.id.toString(),
        name: user.fullName || 'ไม่ระบุชื่อ',
        email: user.email,
        status: user.failedAttempts < 5 ? 'active' : 'inactive',
        joined: parseDbDate(user.createdAt),
        courses: user.courseCount || 0,
    };
}

function mapOverview(data: RawUserOverviewResponse): UserOverviewResponse {
    return {
        profile: {
            ...data.profile,
            createdAt: parseDbDate(data.profile.createdAt),
        },
        summary: data.summary,
        enrollments: data.enrollments.map((enrollment) => ({
            ...enrollment,
            enrolledAt: parseDbDate(enrollment.enrolledAt),
        })),
        transactions: data.transactions.map((transaction) => ({
            ...transaction,
            createdAt: parseDbDate(transaction.createdAt),
        })),
        certificates: data.certificates.map((certificate) => ({
            ...certificate,
            issuedAt: parseDbDate(certificate.issuedAt),
        })),
    };
}

export const userService = {
    async getUsers(page: number = 1, limit: number = 20, search?: string, status?: 'active' | 'inactive'): Promise<UsersData> {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const statusParam = status ? `&status=${status}` : '';
        const response = await apiClient.get<{ data: RawUsersResponse<RawUser, UserStats> } | RawUsersResponse<RawUser, UserStats>>(
            `/users?role=member&page=${page}&limit=${limit}${searchParam}${statusParam}`
        );
        const payload = 'users' in response.data ? response.data : response.data.data;

        return {
            users: payload.users.map(mapBaseUser),
            stats: payload.stats,
        };
    },

    async getPharmacists(page: number = 1, limit: number = 20, search?: string, status?: 'active' | 'inactive'): Promise<PharmacistsData> {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const statusParam = status ? `&status=${status}` : '';
        const response = await apiClient.get<{ data: RawUsersResponse<RawUser, PharmacistStats> } | RawUsersResponse<RawUser, PharmacistStats>>(
            `/users?role=pharmacist&page=${page}&limit=${limit}${searchParam}${statusParam}`
        );
        const payload = 'users' in response.data ? response.data : response.data.data;

        return {
            pharmacists: payload.users.map((user): Pharmacist => ({
                ...mapBaseUser(user),
                license: user.professionalLicenseNumber || '-',
                cpeCredits: Number(user.earnedCpeCredits ?? 0),
            })),
            stats: payload.stats,
        };
    },

    async getUserOverview(id: string): Promise<UserOverviewResponse> {
        const response = await apiClient.get<RawUserOverviewResponse>(`/users/${id}/overview`);
        const payload = 'data' in response.data ? response.data.data : response.data;
        return mapOverview(payload as RawUserOverviewResponse);
    },

    async getUserById(id: string): Promise<RawEditableUser> {
        const response = await apiClient.get<RawEditableUser>(`/users/${id}`);
        return response.data;
    },

    async updateUser(id: string, data: { fullName: string; email: string; professionalLicenseNumber?: string | null }) {
        const response = await apiClient.put<RawEditableUser>(`/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: string): Promise<void> {
        await apiClient.delete(`/users/${id}`);
    },
};
