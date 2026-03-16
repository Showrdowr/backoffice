'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { Search, Clock, User, FileText, ChevronLeft, ChevronRight, Loader2, Monitor, ShieldCheck, ShieldAlert } from 'lucide-react';
import { auditLogService } from '@/features/audit-logs/services/auditLogService';
import { loginLogService } from '@/features/admin-auth/services/loginLogService';
import type { AuditLog, PaginatedAuditLogs } from '@/features/audit-logs/types';
import type { PaginatedAdminLoginLogs } from '@/features/admin-auth/types/login-logs';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { parseDbDate } from '@/utils/date';

const ACTION_MAP: Record<string, string> = {
    'CREATE_COURSE': 'สร้างคอร์สใหม่',
    'UPDATE_COURSE': 'แก้ไขคอร์ส',
    'DELETE_COURSE': 'ลบคอร์ส',
    'CREATE_CATEGORY': 'สร้างหมวดหมู่ใหม่',
    'UPDATE_CATEGORY': 'แก้ไขหมวดหมู่',
    'DELETE_CATEGORY': 'ลบหมวดหมู่',
    'CREATE_SUBCATEGORY': 'สร้างหมวดหมู่ย่อยใหม่',
    'UPDATE_SUBCATEGORY': 'แก้ไขหมวดหมู่ย่อย',
    'DELETE_SUBCATEGORY': 'ลบหมวดหมู่ย่อย',
    'CREATE_ADMIN': 'สร้างผู้ดูแลระบบใหม่',
    'DELETE_ADMIN': 'ลบผู้ดูแลระบบ',
};

export default function AuditLogsPage() {
    // Audit Logs State
    const [auditLoading, setAuditLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState<PaginatedAuditLogs | null>(null);
    const [auditPage, setAuditPage] = useState(1);

    // Login Logs State
    const [loginLoading, setLoginLoading] = useState(true);
    const [loginLogs, setLoginLogs] = useState<PaginatedAdminLoginLogs | null>(null);
    const [loginPage, setLoginPage] = useState(1);

    // refs
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Common Filters
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [date, setDate] = useState('');

    // Debounce: รอ 500ms หลังจากหยุดพิมพ์แล้วค่อยส่ง request
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset pagination เมื่อ filter เปลี่ยน
    useEffect(() => {
        setAuditPage(1);
        setLoginPage(1);
    }, [debouncedSearch, date]);

    const fetchAuditLogs = useCallback(async () => {
        setAuditLoading(true);
        try {
            const result = await auditLogService.getLogs({
                page: auditPage,
                limit: 5,
                startDate: date,
                endDate: date,
                search: debouncedSearch || undefined,
            });
            setAuditLogs(result);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setAuditLoading(false);
        }
    }, [auditPage, date, debouncedSearch]);

    const fetchLoginLogs = useCallback(async () => {
        setLoginLoading(true);
        try {
            const result = await loginLogService.getLogs({
                page: loginPage,
                limit: 5,
                startDate: date,
                endDate: date,
                search: debouncedSearch || undefined,
            });
            setLoginLogs(result);
        } catch (error) {
            console.error('Failed to fetch login logs:', error);
        } finally {
            setLoginLoading(false);
        }
    }, [loginPage, date, debouncedSearch]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    useEffect(() => {
        fetchLoginLogs();
    }, [fetchLoginLogs]);

    const getTargetDisplay = (log: AuditLog): string => {
        const newValue = (log.newValue || {}) as Record<string, unknown>;
        const oldValue = (log.oldValue || {}) as Record<string, unknown>;
        if (log.targetTable === 'courses') {
            return (newValue?.title as string) || (oldValue?.title as string) || '-';
        }
        if (log.targetTable === 'categories') {
            return (newValue?.name as string) || (oldValue?.name as string) || '-';
        }
        if (log.targetTable === 'subcategories') {
            return (newValue?.name as string) || (oldValue?.name as string) || '-';
        }
        if (log.targetTable === 'admin_user') {
            return (newValue?.username as string) || (oldValue?.username as string) || '-';
        }
        return '-';
    };

    const getBrowserDisplay = (userAgent?: string) => {
        if (!userAgent) return 'Unknown';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Browser';
    };

    return (
        <div className="space-y-12">
            {/* Header with Global Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">ประวัติกิจกรรมและเข้าใช้งาน</h1>
                    <p className="text-slate-500">ติดตามการดำเนินการและการเข้าสู่ระบบของแอดมิน</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 w-full md:w-64">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="ค้นหา..." 
                            className="bg-transparent border-none outline-none text-sm flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div 
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 w-full md:w-auto min-w-[180px] hover:border-blue-400 transition-colors cursor-pointer group shadow-sm active:scale-95 transition-transform"
                    >
                        <Clock size={18} className="text-slate-400 group-hover:text-blue-500" />
                        <span className="text-sm text-slate-600 flex-1 select-none font-medium">
                            {date ? format(new Date(date), 'dd MMM yyyy', { locale: th }) : 'เลือกวันที่...'}
                        </span>
                        <input 
                            ref={dateInputRef}
                            type="date" 
                            className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Audit Logs Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <History className="text-blue-500" size={20} />
                    <h2 className="text-lg font-medium text-slate-800">ประวัติการใช้งาน (กิจกรรม)</h2>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100 min-h-[300px]">
                        {auditLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Loader2 className="animate-spin mb-2" size={32} />
                                <p>กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : (auditLogs?.data?.length || 0) > 0 ? (
                            auditLogs?.data?.map((log) => (
                                <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                        <User size={20} className="text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-medium text-slate-800">{log.admin?.username || 'System'}</span>
                                            <span className="text-slate-500"> {ACTION_MAP[log.action] || log.action} </span>
                                            <span className="font-medium text-blue-600 truncate">{getTargetDisplay(log)}</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">IP: {log.ipAddress || 'Unknown'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                                        <Clock size={14} />
                                        <span>{format(parseDbDate(log.createAt), 'dd MMM yyyy HH:mm', { locale: th })}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <FileText size={48} className="mb-2 opacity-20" />
                                <p>ยังไม่มีประวัติการใช้งาน</p>
                            </div>
                        )}
                    </div>

                    {auditLogs && auditLogs.totalPages > 1 && (
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                หน้า {auditLogs.page} จาก {auditLogs.totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                                    disabled={auditPage === 1}
                                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setAuditPage(p => Math.min(auditLogs.totalPages, p + 1))}
                                    disabled={auditPage === auditLogs.totalPages}
                                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Login Logs Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Monitor className="text-emerald-500" size={20} />
                    <h2 className="text-lg font-medium text-slate-800">ประวัติการเข้าสู่ระบบ</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100 min-h-[300px]">
                        {loginLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Loader2 className="animate-spin mb-2" size={32} />
                                <p>กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : (loginLogs?.data?.length || 0) > 0 ? (
                            loginLogs?.data?.map((log) => (
                                <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                        log.status === 'SUCCESS' ? 'bg-emerald-50' : 'bg-rose-50'
                                    }`}>
                                        {log.status === 'SUCCESS' ? (
                                            <ShieldCheck size={20} className="text-emerald-500" />
                                        ) : (
                                            <ShieldAlert size={20} className="text-rose-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-800">{log.admin?.username || 'Unknown Admin'}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                                {log.status === 'SUCCESS' ? 'สำเร็จ' : 'ล้มเหลว'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Monitor size={10} /> {getBrowserDisplay(log.userAgent)}
                                            </p>
                                            <p className="text-xs text-slate-400">IP: {log.ipAddress || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                                        <Clock size={14} />
                                        <span>{format(parseDbDate(log.createAt), 'dd MMM yyyy HH:mm', { locale: th })}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Monitor size={48} className="mb-2 opacity-20" />
                                <p>ยังไม่มีประวัติการเข้าสู่ระบบ</p>
                            </div>
                        )}
                    </div>

                    {loginLogs && loginLogs.totalPages > 1 && (
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                หน้า {loginLogs.page} จาก {loginLogs.totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setLoginPage(p => Math.max(1, p - 1))}
                                    disabled={loginPage === 1}
                                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setLoginPage(p => Math.min(loginLogs.totalPages, p + 1))}
                                    disabled={loginPage === loginLogs.totalPages}
                                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

// Re-using History icon from lucide-react (it was already in imports but I added a dummy comment to remind myself)
import { History } from 'lucide-react';
