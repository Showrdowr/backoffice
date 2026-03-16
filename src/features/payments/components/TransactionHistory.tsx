import { CreditCard, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Transaction } from '../types';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

function getTransactionStatusBadge(status: string) {
    const styles = {
        SUCCESS: 'bg-green-100 text-green-700 border-green-200',
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        FAIL: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
        SUCCESS: 'สำเร็จ',
        PENDING: 'รอดำเนินการ',
        FAIL: 'ล้มเหลว',
    };

    const statusKey = status.toUpperCase() as keyof typeof styles;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statusKey] || styles.PENDING}`}>
            {labels[statusKey] || status}
        </span>
    );
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มีการชำระเงิน</h3>
                <p className="text-sm text-slate-500">รอลูกค้าทำการชำระเงินสำหรับคำสั่งซื้อนี้</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-500" />
                    ประวัติการชำระเงิน
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    รายการธุรกรรมทั้งหมดที่เกี่ยวข้องกับคำสั่งซื้อนี้
                </p>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-slate-100">
                {transactions.map((txn, index) => (
                    <div key={txn.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                            {/* Left: Transaction Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-mono text-sm font-semibold text-blue-600">
                                            {txn.transactionRefId || `TXN-${txn.id}`}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {txn.gateway || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="ml-11 space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-600">จำนวนเงิน:</span>
                                        <span className="font-bold text-slate-800">{formatCurrency(txn.amount)}</span>
                                    </div>
                                    {txn.createdAt && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-slate-600">เวลาทำรายการ:</span>
                                            <span className="text-slate-700">
                                                {format(new Date(txn.createdAt), 'dd MMM yyyy, HH:mm', { locale: th })} น.
                                            </span>
                                        </div>
                                    )}
                                    {txn.completedAt && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-slate-600">เวลาสำเร็จ:</span>
                                            <span className="text-green-700">
                                                {format(new Date(txn.completedAt), 'dd MMM yyyy, HH:mm', { locale: th })} น.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Status & Link */}
                            <div className="flex flex-col items-end gap-3">
                                {getTransactionStatusBadge(txn.status)}
                                
                                <Link
                                    href={`/payments/transactions?ref=${txn.transactionRefId || txn.id}`}
                                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    ดูรายละเอียด
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">จำนวนธุรกรรมทั้งหมด</span>
                    <span className="font-semibold text-slate-800">{transactions.length} รายการ</span>
                </div>
            </div>
        </div>
    );
}
