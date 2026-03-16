'use client';

import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface TransactionStatsProps {
    todayRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    todayTransactions: number;
    pendingTransactions: number;
}

export function TransactionStatsCards({
    todayRevenue,
    monthlyRevenue,
    yearlyRevenue,
    todayTransactions,
    pendingTransactions
}: TransactionStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">รายได้วันนี้</p>
                <p className="text-2xl font-bold text-slate-800">
                    ฿{todayRevenue.toLocaleString()}
                </p>
                <span className="text-xs text-emerald-600">+15% จากเมื่อวาน</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">รายได้เดือนนี้</p>
                <p className="text-2xl font-bold text-emerald-600">
                    ฿{monthlyRevenue.toLocaleString()}
                </p>
                <span className="text-xs text-emerald-600">+8% จากเดือนที่แล้ว</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">รายได้ปีนี้</p>
                <p className="text-2xl font-bold text-blue-600">
                    ฿{(yearlyRevenue / 1000000).toFixed(2)}M
                </p>
                <span className="text-xs text-emerald-600">+22% จากปีที่แล้ว</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">ธุรกรรมวันนี้</p>
                <p className="text-2xl font-bold text-violet-600">{todayTransactions}</p>
                <span className="text-xs text-amber-600">{pendingTransactions} รอดำเนินการ</span>
            </div>
        </div>
    );
}

export function getStatusBadge(status: string) {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <CheckCircle size={14} />
                    สำเร็จ
                </span>
            );
        case 'pending':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <Clock size={14} />
                    รอดำเนินการ
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle size={14} />
                    ล้มเหลว
                </span>
            );
        default:
            return null;
    }
}
