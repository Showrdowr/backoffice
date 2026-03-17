import { apiClient } from '@/services/api/client';
import type { CpeRecord, CpeStats } from '../types';

export interface CpeRecordsResponse {
    records: CpeRecord[];
    total: number;
    page: number;
    totalPages: number;
}

export const cpeService = {
    /**
     * Fetch CPE credit records
     */
    async getRecords(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<CpeRecordsResponse> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', String(params.page));
        if (params?.limit) query.append('limit', String(params.limit));
        if (params?.search) query.append('search', params.search);

        const response = await apiClient.get<CpeRecordsResponse>(
            `/admin/cpe-credits?${query.toString()}`
        );
        return response.data;
    },

    /**
     * Fetch CPE stats summary
     */
    async getStats(): Promise<CpeStats> {
        const response = await apiClient.get<CpeStats>(
            '/admin/cpe-credits/stats'
        );
        return response.data;
    },
};
