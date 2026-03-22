'use client';

import { use, useEffect, useState } from 'react';
import {
    ArrowLeft,
    Award,
    BadgeCheck,
    BookOpen,
    CheckCircle,
    Shield,
    User,
} from 'lucide-react';
import Link from 'next/link';
import { ApiError } from '@/services/api/client';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import { userService } from '@/features/users/services/userService';
import type { UserOverviewResponse } from '@/features/users/types';

function getStatusBadgeClasses(status: string) {
    return status === 'active'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-slate-100 text-slate-600';
}

export default function PharmacistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<UserOverviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const overview = await userService.getUserOverview(id);
                if (isMounted) {
                    setData(overview);
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

        loadData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">กำลังโหลดข้อมูลเภสัชกร...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 font-semibold mb-4">{error || 'ไม่สามารถโหลดข้อมูลได้'}</p>
                    <Link href="/users/pharmacists" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                        กลับไปรายชื่อเภสัชกร
                    </Link>
                </div>
            </div>
        );
    }

    const { profile, summary, enrollments, certificates } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/users/pharmacists" className="p-2 hover:bg-emerald-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">รายละเอียดเภสัชกร</h1>
                        <p className="text-slate-500">ID: {profile.id}</p>
                    </div>
                </div>
                <Link
                    href={`/users/pharmacists/${profile.id}/edit`}
                    className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-semibold"
                >
                    แก้ไขข้อมูล
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 text-white">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/30 flex-shrink-0 relative">
                                    <span className="text-4xl font-bold">{profile.fullName.charAt(0)}</span>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-white">
                                        <BadgeCheck size={18} className="text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.accountStatus === 'active' ? 'bg-emerald-400/30 text-white' : 'bg-slate-500/40 text-white'}`}>
                                            {profile.accountStatus === 'active' ? '● ใช้งานอยู่' : '○ ไม่ใช้งาน'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/80 text-sm mb-3">
                                        <span>อีเมล: {profile.email}</span>
                                        <span>เลขใบอนุญาต: {profile.professionalLicenseNumber || '-'}</span>
                                    </div>
                                    <div className="text-sm text-white/80">สมัครเมื่อ {formatDate(profile.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 divide-x divide-white/10 bg-white/10 backdrop-blur-sm">
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{formatNumber(summary.totalCourses)}</p>
                                <p className="text-xs text-white/70">คอร์สทั้งหมด</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{formatNumber(summary.completedCourses)}</p>
                                <p className="text-xs text-white/70">เรียนจบแล้ว</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{formatNumber(summary.earnedCpeCredits)}</p>
                                <p className="text-xs text-white/70">CPE สะสม</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{summary.averageWatchPercent}%</p>
                                <p className="text-xs text-white/70">ดูเฉลี่ย</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Award className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">สรุป CPE Credits</h3>
                                    <p className="text-sm text-slate-500">อิงจาก certificate ที่ออกแล้ว</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-emerald-600">{formatNumber(summary.earnedCpeCredits)}</p>
                                <p className="text-sm text-slate-500">หน่วย</p>
                            </div>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                style={{ width: `${Math.min(summary.averageWatchPercent, 100)}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2">ความคืบหน้าการรับชมเฉลี่ย {summary.averageWatchPercent}%</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center gap-3">
                            <BookOpen className="text-emerald-600" size={24} />
                            <h3 className="text-xl font-bold text-slate-800">คอร์สที่ลงทะเบียน</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {enrollments.length === 0 ? (
                                <div className="p-6 text-slate-500">ยังไม่มีประวัติการลงทะเบียนคอร์ส</div>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="p-4 hover:bg-slate-50 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-slate-800">{enrollment.courseTitle}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">
                                                    {formatNumber(enrollment.cpeCredits)} CPE
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {enrollment.isCompleted ? '✓ เสร็จสิ้น' : '● กำลังเรียน'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${enrollment.isCompleted ? 'bg-emerald-500' : 'bg-teal-500'}`}
                                                        style={{ width: `${Math.max(enrollment.watchPercent, enrollment.completionPercent)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 w-20 text-right">{enrollment.watchPercent}%</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center gap-3">
                            <Award className="text-emerald-600" size={24} />
                            <h3 className="text-xl font-bold text-slate-800">ประวัติ CPE / Certificates</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {certificates.length === 0 ? (
                                <div className="p-6 text-slate-500">ยังไม่มีประวัติ certificate</div>
                            ) : (
                                certificates.map((certificate) => (
                                    <div key={certificate.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-800">{certificate.courseTitle}</p>
                                            <p className="text-sm text-slate-500">{formatDate(certificate.issuedAt)}</p>
                                            <p className="text-xs text-slate-400">Certificate: {certificate.certificateCode}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-emerald-600">{formatNumber(certificate.cpeCredits)} หน่วย</p>
                                            <span className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                                                <CheckCircle size={12} />
                                                ออกแล้ว
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <User size={18} className="text-emerald-600" />
                            ข้อมูลบัญชี
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">อีเมล</p>
                                <p className="font-medium text-slate-800">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">เลขใบอนุญาต</p>
                                <p className="font-medium text-slate-800">{profile.professionalLicenseNumber || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">สถานะบัญชี</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(profile.accountStatus)}`}>
                                    {profile.accountStatus === 'active' ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Shield size={18} className="text-emerald-600" />
                            สรุปบัญชี
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">ยอดซื้อรวม</span>
                                <span className="font-bold text-slate-800">{formatCurrency(summary.totalSpent)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Failed Attempts</span>
                                <span className="font-bold text-slate-800">{formatNumber(profile.failedAttempts)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">สมัครเมื่อ</span>
                                <span className="font-medium text-slate-800">{formatDate(profile.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
