// Audit Logs Feature Hooks
import { useState, useCallback } from 'react';
import type { AuditLog } from './types';
import { auditLogService } from './services/auditLogService';

export function useAuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await auditLogService.getLogs({ page: 1, limit: 50 });
            setLogs(result.data);
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredLogs = logs.filter(log =>
        (log.admin?.username ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.targetTable ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        logs: filteredLogs,
        loading,
        fetchLogs,
        searchQuery,
        setSearchQuery
    };
}
