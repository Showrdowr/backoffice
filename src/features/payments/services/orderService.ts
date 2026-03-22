import { apiClient } from '@/services/api/client';
import type { OrderStatus, Order, OrderDisplay, OrdersData, OrderStats } from '../types';

function toOrderDisplay(order: Order): OrderDisplay {
    return {
        id: String(order.id),
        orderNumber: `ORD-${String(order.id).padStart(6, '0')}`,
        user: order.userName || '-',
        userEmail: order.userEmail || '-',
        courses: order.orderItems?.length || 0,
        totalAmount: order.grandTotal,
        status: order.status,
        paymentMethod: order.paymentMethod || '-',
        createdAt: order.createdAt,
    };
}

export const orderService = {
    async getOrders(): Promise<OrdersData> {
        const response = await apiClient.get<{ orders: Order[]; stats: OrderStats }>('/admin/orders');
        const orders = (response.data.orders ?? []).map(toOrderDisplay);
        const stats = response.data.stats ?? {
            total: orders.length,
            pending: 0,
            paid: 0,
            cancelled: 0,
            todayOrders: 0,
            todayRevenue: 0,
        };
        return { orders, stats };
    },

    async getOrderById(id: string): Promise<Order> {
        const response = await apiClient.get<Order>(`/admin/orders/${id}`);
        return response.data;
    },

    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        const response = await apiClient.put<Order>(`/admin/orders/${id}/status`, { status });
        return response.data;
    },

    async cancelOrder(id: string, reason?: string): Promise<void> {
        await apiClient.post(`/admin/orders/${id}/cancel`, { reason });
    },

    async refundOrder(id: string, amount: number): Promise<void> {
        await apiClient.post(`/admin/orders/${id}/refund`, { amount });
    },
};
