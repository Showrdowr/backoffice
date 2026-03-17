import { apiClient } from '@/services/api/client';
import { OrderStatus, DiscountType, TransactionStatus } from '../types';
import type { Order, OrdersData, OrderDisplay, OrderStats } from '../types';

export const orderService = {
    /**
     * Fetch all orders with stats
     */
    async getOrders(): Promise<OrdersData> {
        try {
            const response = await apiClient.get<OrdersData>('/orders');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    },

    /**
     * Get order by ID with full details
     */
    async getOrderById(id: string): Promise<Order> {
        try {
            const response = await apiClient.get<Order>(`/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch order:', error);
            throw error;
        }
    },

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        try {
            await apiClient.put(`/orders/${id}/status`, { status });
            return this.getOrderById(id);
        } catch (error) {
            console.error('Failed to update order status:', error);
            throw error;
        }
    },

    /**
     * Cancel order
     */
    async cancelOrder(id: string, reason?: string): Promise<void> {
        try {
            await apiClient.post(`/orders/${id}/cancel`, { reason });
        } catch (error) {
            console.error('Failed to cancel order:', error);
            throw error;
        }
    },

    /**
     * Issue refund
     */
    async refundOrder(id: string, amount: number): Promise<void> {
        try {
            await apiClient.post(`/orders/${id}/refund`, { amount });
        } catch (error) {
            console.error('Failed to refund order:', error);
            throw error;
        }
    },
};
