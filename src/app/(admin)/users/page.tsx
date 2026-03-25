'use client';

import { useRouter } from 'next/navigation';
import { useUsers } from '@/features/users/hooks';
import { UserStatsCards } from '@/features/users/components/UserStatsCards';
import { UserTableToolbar } from '@/features/users/components/UserTableToolbar';
import { UsersTable } from '@/features/users/components/UsersTable';
import { userService } from '@/features/users/services/userService';

import { useState, useEffect } from 'react';

const PAGE_SIZE = 10;

export default function UsersPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive' | ''>('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [actionError, setActionError] = useState('');
    const [notice, setNotice] = useState('');
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const { users, stats, isLoading, error, refresh } = useUsers(page, PAGE_SIZE, debouncedSearch, status || undefined);

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

    const handleDeleteUser = async (userId: string) => {
        const selectedUser = users.find((user) => user.id === userId);
        if (!selectedUser) {
            return;
        }

        const shouldDelete = window.confirm(`ยืนยันการลบผู้ใช้ "${selectedUser.name}" ใช่หรือไม่?`);
        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingUserId(userId);
            setActionError('');
            setNotice('');
            await userService.deleteUser(userId);
            await refresh();
            setNotice(`ลบผู้ใช้ "${selectedUser.name}" สำเร็จ`);
        } catch (deleteError) {
            setActionError(deleteError instanceof Error ? deleteError.message : 'ลบผู้ใช้ไม่สำเร็จ');
        } finally {
            setDeletingUserId(null);
        }
    };

    const totalItems = stats?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const startItem = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const endItem = totalItems === 0 ? 0 : Math.min(page * PAGE_SIZE, totalItems);

    // เราใช้การเปลี่ยน opacity ของตารางและ Spinner เล็กๆ แทนเพื่อไม่ให้ดูเหมือนการ "refresh" ทั้งหน้า

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
                        className="px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 font-semibold transition-all"
                    >
                        ลองอีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1 flex items-center gap-3">
                        บุคคลทั่วไป
                        {isLoading && (
                            <span className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">จัดการผู้ใช้ทั่วไปในระบบ</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && <UserStatsCards stats={stats} type="user" />}

            {/* Table Card */}
            <div className={`bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden transition-opacity duration-200 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
                <UserTableToolbar 
                    searchPlaceholder="ค้นหาด้วยชื่อ, อีเมล..." 
                    searchValue={searchTerm}
                    onSearch={setSearchTerm}
                    statusValue={status}
                    onStatusChange={setStatus}
                />
                <UsersTable
                    users={users}
                    onView={(id) => router.push(`/users/${id}`)}
                    onDelete={handleDeleteUser}
                    deletingUserId={deletingUserId}
                />

                {/* Pagination */}
                <div className="p-4 md:p-6 border-t border-sky-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-slate-500 font-medium text-center sm:text-left">
                        แสดง {startItem}-{endItem} จากทั้งหมด {totalItems} รายการ
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            className="px-3 md:px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all touch-target" 
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        >
                            ก่อนหน้า
                        </button>
                        <button className="px-3 md:px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-semibold shadow-sm min-w-[40px]">{page}</button>
                        <button 
                            className="px-3 md:px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-white disabled:opacity-50 font-semibold transition-all touch-target"
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
