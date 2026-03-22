'use client';

import { use, useEffect, useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/services/api/client';
import { userService } from '@/features/users/services/userService';

export default function EditPharmacistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [professionalLicenseNumber, setProfessionalLicenseNumber] = useState('');
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
                    setProfessionalLicenseNumber(user.professionalLicenseNumber || '');
                }
            } catch (err) {
                const apiError = err instanceof ApiError ? err : null;
                if (isMounted) {
                    setError(apiError?.statusCode === 404 ? 'ไม่พบเภสัชกรนี้' : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
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
                professionalLicenseNumber: professionalLicenseNumber || null,
            });
            router.push(`/users/pharmacists/${id}`);
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
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/users/pharmacists/${id}`} className="p-2 hover:bg-emerald-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขข้อมูลเภสัชกร</h1>
                        <p className="text-slate-500">แก้ไขข้อมูลที่มีอยู่จริงในระบบ</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/users/pharmacists/${id}`}
                        className="px-5 py-2.5 border border-emerald-200 rounded-xl hover:bg-emerald-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-60"
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

            <div className="bg-white rounded-2xl shadow-md border border-emerald-100">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 rounded-t-2xl">
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
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
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
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                เลขใบอนุญาต
                            </label>
                            <input
                                type="text"
                                value={professionalLicenseNumber}
                                onChange={(event) => setProfessionalLicenseNumber(event.target.value)}
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        รอบนี้ยังไม่เปิดให้แก้ข้อมูล verification หรือ CPE แบบ manual เพื่อหลีกเลี่ยงข้อมูลหลอกในระบบ
                    </p>
                </div>
            </div>
        </div>
    );
}
