// CPE Credits Feature Hooks
import { useState, useCallback, useEffect } from 'react';
import type { CpeRecord, CpeStats } from './types';
import { cpeService } from './services/cpeService';

export function useCpeCredits() {
    const [records, setRecords] = useState<CpeRecord[]>([]);
    const [stats, setStats] = useState<CpeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRecords = useCallback(async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const [recordsData, statsData] = await Promise.all([
                cpeService.getRecords({ page: 1, limit: 50, search }),
                cpeService.getStats(),
            ]);
            setRecords(recordsData.records);
            setStats(statsData);
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล CPE');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const filteredRecords = searchQuery
        ? records.filter(record =>
            record.pharmacistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.courseName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : records;

    return {
        records: filteredRecords,
        stats,
        loading,
        error,
        fetchRecords,
        searchQuery,
        setSearchQuery
    };
}
