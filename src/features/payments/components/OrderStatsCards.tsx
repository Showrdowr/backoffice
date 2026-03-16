import { ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import type { OrderStats } from '../types';
import { formatCurrency, formatNumber } from '@/utils/format';

interface OrderStatsCardsProps {
    stats: OrderStats;
}

export function OrderStatsCards({ stats }: OrderStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Orders */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <ShoppingCart size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{formatNumber(stats.total)}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">คำสั่งซื้อทั้งหมด</p>
                <p className="text-xs text-slate-500 mt-1">วันนี้: {stats.todayOrders} รายการ</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Clock size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{formatNumber(stats.pending)}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">รอชำระ</p>
                <p className="text-xs text-slate-500 mt-1">ค้างชำระ</p>
            </div>

            {/* Paid Orders */}
            <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <CheckCircle size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">{formatNumber(stats.paid)}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">ชำระแล้ว</p>
                <p className="text-xs text-slate-500 mt-1">สำเร็จ</p>
            </div>

            {/* Today Revenue */}
            <div className="bg-white rounded-2xl shadow-md border border-violet-100 p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-violet-600">{formatCurrency(stats.todayRevenue)}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">รายได้วันนี้</p>
                <p className="text-xs text-slate-500 mt-1">{stats.todayOrders} รายการ</p>
            </div>
        </div>
    );
}
