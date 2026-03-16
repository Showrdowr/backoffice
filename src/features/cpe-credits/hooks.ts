// CPE Credits Feature Hooks
import { useState, useCallback } from 'react';
import type { CpeRecord, CpeStats } from './types';
import { MOCK_CPE_RECORDS, MOCK_CPE_STATS } from './types';

export function useCpeCredits() {
    const [records, setRecords] = useState<CpeRecord[]>(MOCK_CPE_RECORDS);
    const [stats, setStats] = useState<CpeStats>(MOCK_CPE_STATS);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: Implement API call
            setRecords(MOCK_CPE_RECORDS);
            setStats(MOCK_CPE_STATS);
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredRecords = records.filter(record =>
        record.pharmacistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        records: filteredRecords,
        stats,
        loading,
        fetchRecords,
        searchQuery,
        setSearchQuery
    };
}
