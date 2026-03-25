'use client';

import { useRouter } from 'next/navigation';
import { usePharmacists } from '@/features/users/hooks';
import { UserStatsCards } from '@/features/users/components/UserStatsCards';
import { UserTableToolbar } from '@/features/users/components/UserTableToolbar';
import { PharmacistsTable } from '@/features/users/components/PharmacistsTable';
import { userService } from '@/features/users/services/userService';

import { useState, useEffect } from 'react';

const PAGE_SIZE = 10;

export default function PharmacistsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive' | ''>('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [actionError, setActionError] = useState('');
    const [notice, setNotice] = useState('');
    const [deletingPharmacistId, setDeletingPharmacistId] = useState<string | null>(null);
    const { pharmacists, stats, isLoading, error, refresh } = usePharmacists(page, PAGE_SIZE, debouncedSearch, status || undefined);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [status]);

    const handleDeletePharmacist = async (userId: string) => {
        const selectedPharmacist = pharmacists.find((pharmacist) => pharmacist.id === userId);
        if (!selectedPharmacist) {
            return;
        }

        const shouldDelete = window.confirm(`ยืนยันการลบเภสัชกร "${selectedPharmacist.name}" ใช่หรือไม่?`);
        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingPharmacistId(userId);
            setActionError('');
            setNotice('');
            await userService.deleteUser(userId);
            await refresh();
            setNotice(`ลบเภสัชกร "${selectedPharmacist.name}" สำเร็จ`);
        } catch (deleteError) {
            setActionError(deleteError instanceof Error ? deleteError.message : 'ลบเภสัชกรไม่สำเร็จ');
        } finally {
            setDeletingPharmacistId(null);
        }
    };

    const totalItems = stats?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const startItem = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const endItem = totalItems === 0 ? 0 : Math.min(page * PAGE_SIZE, totalItems);

    // Subtle loading UI

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-red-600 font-semibold mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold transition-all"
                    >
                        ลองอีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {notice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {notice}
                </div>
            )}
            {actionError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {actionError}
                </div>
            )}
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-3">
                        เภสัชกร
                        {isLoading && (
                            <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                        )}
                    </h1>
                    <p className="text-slate-500">จัดการเภสัชกรในระบบ</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && <UserStatsCards stats={stats} type="pharmacist" />}

            {/* Table Card */}
            <div className={`bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden transition-opacity duration-200 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
                <UserTableToolbar 
                    searchPlaceholder="ค้นหาด้วยชื่อ, อีเมล หรือเลขใบประกอบฯ..." 
                    searchValue={searchTerm}
                    onSearch={setSearchTerm}
                    statusValue={status}
                    onStatusChange={setStatus}
                />
                <PharmacistsTable
                    pharmacists={pharmacists}
                    onView={(id) => router.push(`/users/pharmacists/${id}`)}
                    onDelete={handleDeletePharmacist}
                    deletingPharmacistId={deletingPharmacistId}
                />

                {/* Pagination */}
                <div className="p-6 border-t border-emerald-100 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">
                        แสดง {startItem}-{endItem} จากทั้งหมด {totalItems} รายการ
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all" 
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        >
                            ก่อนหน้า
                        </button>
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-sm">{page}</button>
                        <button 
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all"
                            disabled={page >= totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
