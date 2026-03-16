'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { orderService } from '@/features/payments/services/orderService';
import { OrderDetailCard, OrderItemsList, TransactionHistory } from '@/features/payments/components';
import type {Order } from '@/features/payments/types';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setIsLoading(true);
            const orderData = await orderService.getOrderById(id);
            setOrder(orderData);
        } catch (err) {
            console.error('Failed to load order:', err);
            setError('ไม่พบคำสั่งซื้อนี้');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'ไม่พบคำสั่งซื้อ'}</p>
                    <Link
                        href="/payments/orders"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <ArrowLeft size={16} />
                        กลับไปหน้ารายการ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/payments/orders"
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">รายละเอียดคำสั่งซื้อ</h1>
                        <p className="text-slate-500">ข้อมูลและรายการสินค้าในคำสั่งซื้อ</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold"
                        onClick={() => alert('Download Invoice - Coming soon!')}
                    >
                        <Download size={18} />
                        ดาวน์โหลดใบเสร็จ
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    <OrderItemsList items={order.orderItems || []} />
                    <TransactionHistory transactions={order.transactions || []} />
                </div>

                {/* Right Column - Order Info */}
                <div>
                    <OrderDetailCard order={order} />
                </div>
            </div>
        </div>
    );
}
