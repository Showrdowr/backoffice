'use client';

import { use, useEffect, useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/services/api/client';
import { userService } from '@/features/users/services/userService';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadUser = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const user = await userService.getUserById(id);
                if (isMounted) {
                    setFullName(user.fullName || '');
                    setEmail(user.email);
                }
            } catch (err) {
                const apiError = err instanceof ApiError ? err : null;
                if (isMounted) {
                    setError(apiError?.statusCode === 404 ? 'ไม่พบผู้ใช้นี้' : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadUser();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);
            await userService.updateUser(id, {
                fullName,
                email,
            });
            router.push(`/users/${id}`);
        } catch (err) {
            const apiError = err instanceof ApiError ? err : null;
            setError(apiError?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/users/${id}`} className="p-2 hover:bg-sky-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขข้อมูลผู้ใช้</h1>
                        <p className="text-slate-500">แก้ไขข้อมูลที่มีอยู่จริงในระบบ</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/users/${id}`}
                        className="px-5 py-2.5 border border-sky-200 rounded-xl hover:bg-sky-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-60"
                    >
                        <Save size={18} />
                        <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                ชื่อ-นามสกุล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                placeholder="กรอกชื่อ-นามสกุล"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                อีเมล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                placeholder="กรอกอีเมล"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        รอบนี้เปิดให้แก้เฉพาะข้อมูลที่มีอยู่จริงในฐานข้อมูลเท่านั้น
                    </p>
                </div>
            </div>
        </div>
    );
}
