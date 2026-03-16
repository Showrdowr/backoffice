import { apiClient } from '@/services/api/client';
import type { PaginatedAuditLogs, AuditLogQueryParams } from '../types';

export const auditLogService = {
    async getLogs(params: AuditLogQueryParams): Promise<PaginatedAuditLogs> {
        const query = new URLSearchParams();
        
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.adminId) query.append('adminId', params.adminId);
        if (params.action) query.append('action', params.action);
        if (params.targetTable) query.append('targetTable', params.targetTable);
        if (params.startDate) query.append('startDate', params.startDate);
        if (params.endDate) query.append('endDate', params.endDate);
        if (params.search) query.append('search', params.search);

        const response = await apiClient.get<PaginatedAuditLogs>(`/audit-logs?${query.toString()}`);
        return response.data;
    }
};


