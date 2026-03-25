import { apiClient } from '@/services/api/client';
import type { RefundRequest } from '../types';

export const refundRequestService = {
    async getRefundRequests(): Promise<RefundRequest[]> {
        const response = await apiClient.get<RefundRequest[]>('/admin/refund-requests');
        return Array.isArray(response.data) ? response.data : [];
    },

    async approveRefundRequest(id: number, adminNote?: string): Promise<RefundRequest> {
        const response = await apiClient.post<RefundRequest>(`/admin/refund-requests/${id}/approve`, {
            adminNote: adminNote?.trim() || undefined,
        });
        return response.data;
    },

    async rejectRefundRequest(id: number, adminNote?: string): Promise<RefundRequest> {
        const response = await apiClient.post<RefundRequest>(`/admin/refund-requests/${id}/reject`, {
            adminNote: adminNote?.trim() || undefined,
        });
        return response.data;
    },
};

export default refundRequestService;
