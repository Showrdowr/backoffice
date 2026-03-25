'use client';

import { useEffect, useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { refundRequestService } from '@/features/payments/services/refundRequestService';
import type { RefundRequest } from '@/features/payments/types';

function getStatusBadgeStyle(status: RefundRequest['status']) {
    switch (status) {
        case 'APPROVED':
            return { background: '#dcfce7', color: '#166534' };
        case 'REJECTED':
            return { background: '#fee2e2', color: '#b91c1c' };
        default:
            return { background: '#fef3c7', color: '#b45309' };
    }
}

export default function RefundRequestsPage() {
    const [requests, setRequests] = useState<RefundRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actingId, setActingId] = useState<number | null>(null);

    const loadRefundRequests = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await refundRequestService.getRefundRequests();
            setRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดคำขอคืนเงินได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadRefundRequests();
    }, []);

    const stats = useMemo(() => ({
        total: requests.length,
        pending: requests.filter((request) => request.status === 'PENDING').length,
        approved: requests.filter((request) => request.status === 'APPROVED').length,
        rejected: requests.filter((request) => request.status === 'REJECTED').length,
    }), [requests]);

    const handleResolve = async (request: RefundRequest, action: 'approve' | 'reject') => {
        const adminNote = window.prompt(
            action === 'approve'
                ? 'หมายเหตุสำหรับการอนุมัติคืนเงิน (ไม่บังคับ)'
                : 'หมายเหตุสำหรับการปฏิเสธคำขอ (ไม่บังคับ)',
            request.adminNote || '',
        ) ?? undefined;

        try {
            setActingId(request.id);
            if (action === 'approve') {
                await refundRequestService.approveRefundRequest(request.id, adminNote);
            } else {
                await refundRequestService.rejectRefundRequest(request.id, adminNote);
            }
            await loadRefundRequests();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ดำเนินการคำขอคืนเงินไม่สำเร็จ');
        } finally {
            setActingId(null);
        }
    };

    if (error && !requests.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} className="text-red-500" />
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => void loadRefundRequests()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        ลองอีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">คำขอคืนเงินคอร์ส</h1>
                    <p className="text-slate-500">ตรวจสอบ ยืนยัน หรือปฏิเสธคำขอคืนเงินจากผู้เรียน</p>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: 'ทั้งหมด', value: stats.total, background: '#e0f2fe', color: '#0369a1' },
                    { label: 'รอดำเนินการ', value: stats.pending, background: '#fef3c7', color: '#b45309' },
                    { label: 'อนุมัติแล้ว', value: stats.approved, background: '#dcfce7', color: '#166534' },
                    { label: 'ปฏิเสธแล้ว', value: stats.rejected, background: '#fee2e2', color: '#b91c1c' },
                ].map((card) => (
                    <div key={card.label} className="rounded-3xl bg-white p-5 shadow-sm">
                        <div className="inline-flex rounded-2xl px-3 py-1 text-sm font-semibold" style={{ background: card.background, color: card.color }}>
                            {card.label}
                        </div>
                        <div className="mt-4 text-3xl font-bold text-slate-800">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="rounded-3xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">ผู้เรียน</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">คอร์ส</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">ราคา</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">สถานะ</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">วันที่ขอ</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">เหตุผล</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                                        กำลังโหลดข้อมูล...
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                                        ยังไม่มีคำขอคืนเงิน
                                    </td>
                                </tr>
                            ) : requests.map((request) => {
                                const badgeStyle = getStatusBadgeStyle(request.status);
                                const isPending = request.status === 'PENDING';

                                return (
                                    <tr key={request.id} className="align-top">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-800">{request.user.fullName || '-'}</div>
                                            <div className="text-sm text-slate-500">{request.user.email}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-800">{request.courseTitle}</div>
                                            <div className="text-sm text-slate-500">Order #{request.orderId ?? '-'}</div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">{Number(request.coursePrice ?? 0).toLocaleString()}</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={badgeStyle}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">{request.requestedAt ? new Date(request.requestedAt).toLocaleString() : '-'}</td>
                                        <td className="px-5 py-4">
                                            <div className="max-w-[280px] text-sm text-slate-700">{request.reason || '-'}</div>
                                            {request.adminNote && <div className="mt-2 text-xs text-slate-500">Admin note: {request.adminNote}</div>}
                                        </td>
                                        <td className="px-5 py-4">
                                            {isPending ? (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                                        disabled={actingId === request.id}
                                                        onClick={() => void handleResolve(request, 'approve')}
                                                    >
                                                        อนุมัติคืนเงิน
                                                    </button>
                                                    <button
                                                        className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 disabled:opacity-50"
                                                        disabled={actingId === request.id}
                                                        onClick={() => void handleResolve(request, 'reject')}
                                                    >
                                                        ปฏิเสธคำขอ
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500">ดำเนินการแล้ว</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
