import { Eye, Package } from 'lucide-react';
import Link from 'next/link';
import type { OrderDisplay, OrderStatus } from '../types';
import { formatCurrency } from '@/utils/format';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface OrdersTableProps {
    orders: OrderDisplay[];
}

function getStatusBadge(status: OrderStatus) {
    const styles = {
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        PAID: 'bg-green-100 text-green-700 border-green-200',
        CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
        PENDING: 'รอชำระ',
        PAID: 'ชำระแล้ว',
        CANCELLED: 'ยกเลิก',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">ไม่พบคำสั่งซื้อ</h3>
                <p className="text-sm text-slate-500">ยังไม่มีคำสั่งซื้อในระบบ</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                หมายเลขคำสั่งซื้อ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                ลูกค้า
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                คอร์ส
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                ยอดรวม
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                สถานะ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                ช่องทางชำระ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                วันที่สั่งซื้อ
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                การดำเนินการ
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-sm font-semibold text-blue-600">
                                        {order.orderNumber}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{order.user}</p>
                                        <p className="text-xs text-slate-500">{order.userEmail}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                                        {order.courses}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-bold text-slate-800">
                                        {formatCurrency(order.totalAmount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600">{order.paymentMethod}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600">
                                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: th })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link
                                        href={`/payments/orders/${order.id}`}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                                    >
                                        <Eye size={16} />
                                        ดูรายละเอียด
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
