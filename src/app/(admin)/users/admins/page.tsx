'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { ApiError, apiClient } from '@/services/api/client';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { parseDbDate } from '@/utils/date';
import PasswordConfirmModal from '@/components/modals/PasswordConfirmModal';

interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: string;
    department?: string;
    major?: string;
    createAt: string;
}

export default function AdminsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(searchParams.get('created') === '1' ? 'สร้างผู้ดูแลระบบสำเร็จ' : null);

    const fetchAdmins = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get<{ users: AdminUser[] }>('/admin/users');
            setAdmins(response.data?.users || []);
            setError(null);
        } catch (error: unknown) {
            console.error('Failed to fetch admins:', error);
            const err = error as Error;
            setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const confirmDelete = async (confirmPassword: string) => {
        if (!adminToDelete) return;

        try {
            setIsDeleting(true);
            setPasswordError(null);
            await apiClient.delete(`/admin/users/${adminToDelete.id}`, { confirmPassword });
            setAdmins(prev => prev.filter(admin => admin.id !== adminToDelete.id));
            setAdminToDelete(null);
            setPasswordError(null);
            setNotice('ลบผู้ดูแลระบบสำเร็จ');
        } catch (error: unknown) {
            console.error('Failed to delete admin:', error);
            const apiError = error instanceof ApiError ? error : null;
            if (apiError?.code === 'INVALID_CONFIRM_PASSWORD') {
                setPasswordError(apiError.message);
            } else {
                setAdminToDelete(null);
                setPasswordError(null);
                setError(apiError?.message || 'เกิดข้อผิดพลาดในการลบ');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    if (error) {
        return (
             <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-red-600 font-semibold mb-4">เกิดข้อผิดพลาด</p>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={fetchAdmins}
                        className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-semibold transition-all"
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
                <div className="px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                    {notice}
                </div>
            )}
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1 flex items-center gap-3">
                        ผู้ดูแลระบบ
                        {isLoading && (
                            <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">จัดการบัญชีและสิทธิ์ของผู้ดูแลระบบ</p>
                </div>
                <button 
                    onClick={() => router.push('/users/admins/add')}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 md:px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold touch-target"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">เพิ่มผู้ดูแลระบบ</span>
                    <span className="sm:hidden">เพิ่ม</span>
                </button>
            </div>

            {/* Table */}
            <div className={`bg-white rounded-2xl shadow-md border border-indigo-100 overflow-hidden transition-opacity duration-200 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-indigo-100 text-sm font-semibold text-slate-600">
                                <th className="px-6 py-4 whitespace-nowrap">ชื่อผู้ใช้ / อีเมล</th>
                                <th className="px-6 py-4 whitespace-nowrap">ระดับสิทธิ์</th>
                                <th className="px-6 py-4 whitespace-nowrap">แผนก / สาขา</th>
                                <th className="px-6 py-4 whitespace-nowrap">วันที่สร้าง</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50">
                            {admins.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        ไม่มีข้อมูลผู้ดูแลระบบ
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {admin.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{admin.username}</div>
                                                    <div className="text-sm text-slate-500">{admin.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                (admin.role === 'super_admin' || admin.role === 'admin')
                                                    ? 'bg-sky-100 text-sky-700 border border-sky-200' 
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {(admin.role === 'super_admin' || admin.role === 'admin') ? 'Admin' : 'Officer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="text-sm text-slate-700 font-medium">{admin.department || '-'}</div>
                                            <div className="text-xs text-slate-500">{admin.major || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-sm text-slate-500">
                                            {format(parseDbDate(admin.createAt), 'dd MMM yyyy HH:mm', { locale: th })}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <button 
                                                onClick={() => { setAdminToDelete(admin); setPasswordError(null); }}
                                                className="text-red-500 hover:text-red-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 md:p-6 border-t border-indigo-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-slate-500 font-medium text-center sm:text-left">
                        จำนวนผู้ดูแลระบบทั้งหมด {admins.length} บัญชี
                    </p>
                </div>
            </div>

            {/* Password Confirmation Modal for Delete */}
            <PasswordConfirmModal
                isOpen={!!adminToDelete}
                title="ยืนยันการลบผู้ดูแลระบบ"
                description={`คุณกำลังจะลบบัญชี "${adminToDelete?.username}" กรุณากรอกรหัสผ่านของคุณเพื่อยืนยัน`}
                confirmLabel="ยืนยันการลบ"
                isLoading={isDeleting}
                error={passwordError}
                onConfirm={confirmDelete}
                onCancel={() => { setAdminToDelete(null); setPasswordError(null); }}
            />
        </div>
    );
}
