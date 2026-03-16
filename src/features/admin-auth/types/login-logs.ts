export interface AdminLoginLog {
    id: string;
    adminId?: string;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
    createAt: string;
    admin?: {
        username: string;
        email: string;
    } | null;
}

export interface AdminLoginLogQueryParams {
    page?: number;
    limit?: number;
    adminId?: string;
    status?: 'SUCCESS' | 'FAILED';
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface PaginatedAdminLoginLogs {
    data: AdminLoginLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
