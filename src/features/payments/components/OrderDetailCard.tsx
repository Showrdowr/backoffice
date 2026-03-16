import { ShoppingCart, User, CreditCard, Calendar, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Order, OrderStatus } from '../types';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface OrderDetailCardProps {
    order: Order;
}

function getStatusBadge(status: OrderStatus) {
    const styles = {
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        PAID: 'bg-green-100 text-green-700 border-green-300',
        CANCELLED: 'bg-red-100 text-red-700 border-red-300',
    };

    const labels = {
        PENDING: 'รอชำระเงิน',
        PAID: 'ชำระเงินแล้ว',
        CANCELLED: 'ยกเลิกแล้ว',
    };

    return (
        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(order.id.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <ShoppingCart size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">รายละเอียดคำสั่งซื้อ</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-sm text-slate-600">#{order.id}</span>
                                <button
                                    onClick={handleCopyOrderId}
                                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                                    title="Copy Order ID"
                                >
                                    {copied ? (
                                        <Check size={14} className="text-green-600" />
                                    ) : (
                                        <Copy size={14} className="text-slate-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge(order.status)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Order Information */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        ข้อมูลคำสั่งซื้อ
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">วันที่สั่งซื้อ</p>
                            <p className="text-sm font-semibold text-slate-800">
                                {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: th })} น.
                            </p>
                        </div>
                        {order.paidAt && (
                            <div>
                                <p className="text-xs text-slate-500 mb-1">วันที่ชำระเงิน</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {format(new Date(order.paidAt), 'dd MMMM yyyy, HH:mm', { locale: th })} น.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Information */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <User size={16} className="text-green-500" />
                        ข้อมูลลูกค้า
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">ชื่อ-นามสกุล</p>
                            <p className="text-sm font-semibold text-slate-800">{order.userName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">อีเมล</p>
                            <p className="text-sm font-semibold text-slate-800">{order.userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <CreditCard size={16} className="text-violet-500" />
                        สรุปการชำระเงิน
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">ช่องทางชำระเงิน</span>
                            <span className="text-sm font-semibold text-slate-800">{order.paymentMethod || '-'}</span>
                        </div>
                        {order.voucher && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">คูปองส่วนลด</span>
                                <span className="text-sm font-semibold text-green-600">{order.voucher.code}</span>
                            </div>
                        )}
                        {order.discountAmount > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">ส่วนลด</span>
                                <span className="text-sm font-semibold text-green-600">
                                    -{formatCurrency(order.discountAmount)}
                                </span>
                            </div>
                        )}
                        <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                            <span className="text-base font-bold text-slate-800">ยอดรวมทั้งสิ้น</span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatCurrency(order.grandTotal)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
