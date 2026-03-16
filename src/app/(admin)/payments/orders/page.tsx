'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { orderService } from '@/features/payments/services/orderService';
import { OrderStatsCards, OrdersTable } from '@/features/payments/components';
import type { OrdersData } from '@/features/payments/types';

export default function OrdersPage() {
    const [data, setData] = useState<OrdersData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const ordersData = await orderService.getOrders();
            setData(ordersData);
        } catch (err) {
            console.error('Failed to load orders:', err);
            setError('ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart size={32} className="text-red-500" />
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={loadOrders}
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">คำสั่งซื้อ</h1>
                    <p className="text-slate-500">จัดการและติดตามคำสั่งซื้อทั้งหมด</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            ) : data ? (
                <>
                    {/* Stats Cards */}
                    <OrderStatsCards stats={data.stats} />

                    {/* Orders Table */}
                    <OrdersTable orders={data.orders} />
                </>
            ) : null}
        </div>
    );
}
