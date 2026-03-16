import { apiClient } from '@/services/api/client';
import type { AdminLoginLogQueryParams, PaginatedAdminLoginLogs } from '../types/login-logs';

export const loginLogService = {
    async getLogs(params: AdminLoginLogQueryParams): Promise<PaginatedAdminLoginLogs> {
        const query = new URLSearchParams();
        
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.adminId) query.append('adminId', params.adminId);
        if (params.status) query.append('status', params.status);
        if (params.startDate) query.append('startDate', params.startDate);
        if (params.endDate) query.append('endDate', params.endDate);
        if (params.search) query.append('search', params.search);

        const response = await apiClient.get<PaginatedAdminLoginLogs>(`/admin-login-logs?${query.toString()}`);
        return response.data;
    }
};
