'use client';

import { use, useEffect, useState } from 'react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    Clock,
    CreditCard,
    Shield,
    TrendingUp,
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

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
                    setError(apiError?.statusCode === 404 ? 'ไม่พบผู้ใช้นี้' : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
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
                    <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">กำลังโหลดข้อมูลผู้ใช้...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 font-semibold mb-4">{error || 'ไม่สามารถโหลดข้อมูลได้'}</p>
                    <Link href="/users" className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                        กลับไปรายชื่อผู้ใช้
                    </Link>
                </div>
            </div>
        );
    }

    const { profile, summary, enrollments, transactions } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/users" className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">รายละเอียดผู้ใช้</h1>
                        <p className="text-slate-500">ID: {profile.id}</p>
                    </div>
                </div>
                <Link
                    href={`/users/${profile.id}/edit`}
                    className="px-4 py-2.5 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all font-semibold"
                >
                    แก้ไขข้อมูล
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 text-white">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                                    <span className="text-4xl font-bold">{profile.fullName.charAt(0)}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.accountStatus === 'active' ? 'bg-emerald-400/30 text-white' : 'bg-slate-500/40 text-white'}`}>
                                            {profile.accountStatus === 'active' ? '● ใช้งานอยู่' : '○ ไม่ใช้งาน'}
                                        </span>
                                    </div>
                                    <p className="text-white/80 text-sm mb-3">{profile.email}</p>
                                    <div className="text-sm text-white/80">
                                        สมัครเมื่อ {formatDate(profile.createdAt)}
                                    </div>
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
                                <p className="text-2xl font-bold">{summary.averageWatchPercent}%</p>
                                <p className="text-xs text-white/70">ดูเฉลี่ย</p>
                            </div>
                            <div className="p-4 text-center text-white">
                                <p className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</p>
                                <p className="text-xs text-white/70">ยอดซื้อรวม</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-3">
                            <BookOpen className="text-blue-600" size={24} />
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
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {enrollment.isCompleted ? '✓ เสร็จสิ้น' : '● กำลังเรียน'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${enrollment.isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.max(enrollment.watchPercent, enrollment.completionPercent)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 w-20 text-right">
                                                {enrollment.watchPercent}% ดูแล้ว
                                            </span>
                                            <span className="text-sm text-slate-500">{formatDate(enrollment.enrolledAt)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-3">
                            <CreditCard className="text-blue-600" size={24} />
                            <h3 className="text-xl font-bold text-slate-800">ประวัติการสั่งซื้อ</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {transactions.length === 0 ? (
                                <div className="p-6 text-slate-500">ยังไม่มีประวัติการชำระเงิน</div>
                            ) : (
                                transactions.map((transaction) => (
                                    <div key={transaction.id} className="p-4 hover:bg-slate-50 transition-all">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {transaction.courseTitles.length > 0 ? transaction.courseTitles.join(', ') : 'ไม่มีรายการคอร์ส'}
                                                </p>
                                                <p className="text-sm text-slate-500">{formatDate(transaction.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">{formatCurrency(transaction.amount)}</p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {transaction.status === 'PAID' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <User size={18} className="text-blue-600" />
                            ข้อมูลบัญชี
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">อีเมล</p>
                                <p className="font-medium text-slate-800">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">ประเภทผู้ใช้</p>
                                <p className="font-medium text-slate-800">บุคคลทั่วไป</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">สถานะบัญชี</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(profile.accountStatus)}`}>
                                    {profile.accountStatus === 'active' ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <TrendingUp size={18} className="text-blue-600" />
                            สรุปการเรียน
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">เรียนจบแล้ว</span>
                                <span className="font-bold text-emerald-600">{formatNumber(summary.completedCourses)} คอร์ส</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">กำลังเรียน</span>
                                <span className="font-bold text-amber-600">{formatNumber(summary.inProgressCourses)} คอร์ส</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-500">ดูเฉลี่ย</span>
                                <span className="font-bold text-blue-600">{summary.averageWatchPercent}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Shield size={18} className="text-blue-600" />
                            ความปลอดภัย
                        </h3>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-slate-500">Failed Attempts</span>
                            <span className="font-bold text-slate-800">{formatNumber(profile.failedAttempts)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
