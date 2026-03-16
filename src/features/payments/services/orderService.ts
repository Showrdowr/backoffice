import { apiClient } from '@/services/api/client';
import { OrderStatus, DiscountType, TransactionStatus } from '../types';
import type { Order, OrdersData, OrderDisplay, OrderStats } from '../types';

export const orderService = {
    /**
     * Fetch all orders with stats
     */
    async getOrders(): Promise<OrdersData> {
        try {
            // In production: const response = await apiClient.get<OrdersData>('/orders');
            // return response.data;

            // Mock data for now
            const orders: OrderDisplay[] = [
                {
                    id: '1',
                    orderNumber: 'ORD-20260107-001',
                    user: 'สมชาย ใจดี',
                    userEmail: 'somchai@email.com',
                    courses: 2,
                    totalAmount: 4490,
                    status: OrderStatus.PAID,
                    paymentMethod: 'Credit Card',
                    createdAt: '2026-01-07T10:30:00Z',
                },
                {
                    id: '2',
                    orderNumber: 'ORD-20260107-002',
                    user: 'สมหญิง รักเรียน',
                    userEmail: 'somying@email.com',
                    courses: 1,
                    totalAmount: 2990,
                    status: OrderStatus.PENDING,
                    paymentMethod: 'Bank Transfer',
                    createdAt: '2026-01-07T12:15:00Z',
                },
                {
                    id: '3',
                    orderNumber: 'ORD-20260107-003',
                    user: 'วิภา มานะ',
                    userEmail: 'vipa@email.com',
                    courses: 3,
                    totalAmount: 7990,
                    status: OrderStatus.PAID,
                    paymentMethod: 'PromptPay',
                    createdAt: '2026-01-07T14:20:00Z',
                },
                {
                    id: '4',
                    orderNumber: 'ORD-20260106-045',
                    user: 'ณัฐพล เก่งมาก',
                    userEmail: 'nattapol@email.com',
                    courses: 1,
                    totalAmount: 1990,
                    status: OrderStatus.CANCELLED,
                    paymentMethod: 'Credit Card',
                    createdAt: '2026-01-06T16:45:00Z',
                },
                {
                    id: '5',
                    orderNumber: 'ORD-20260106-044',
                    user: 'ปิยะ รักดี',
                    userEmail: 'piya@email.com',
                    courses: 2,
                    totalAmount: 5980,
                    status: OrderStatus.PAID,
                    paymentMethod: 'Credit Card',
                    createdAt: '2026-01-06T15:30:00Z',
                },
                {
                    id: '6',
                    orderNumber: 'ORD-20260106-043',
                    user: 'สุรชัย ดีใจ',
                    userEmail: 'surachai@email.com',
                    courses: 1,
                    totalAmount: 2990,
                    status: OrderStatus.PENDING,
                    paymentMethod: 'Bank Transfer',
                    createdAt: '2026-01-06T11:00:00Z',
                },
            ];

            const stats: OrderStats = {
                total: 1523,
                pending: 45,
                paid: 1420,
                cancelled: 58,
                todayOrders: 12,
                todayRevenue: 35940,
            };

            return { orders, stats };
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
            // In production: const response = await apiClient.get<Order>(`/orders/${id}`);
            // return response.data;

            // Mock detailed order
            return {
                id: parseInt(id),
                userId: 1,
                userName: 'สมชาย ใจดี',
                userEmail: 'somchai@email.com',
                voucherId: 1,
                grandTotal: 4490,
                discountAmount: 500,
                status: OrderStatus.PAID,
                paymentMethod: 'Credit Card',
                createdAt: '2026-01-07T10:30:00Z',
                paidAt: '2026-01-07T10:32:15Z',
                voucher: {
                    id: 1,
                    code: 'NEW2026',
                    discountType: DiscountType.PERCENT,
                    discountValue: 10,
                    usageLimit: 100,
                    perUserLimit: 1,
                    minOrderAmount: 1000,
                    minItemQuantity: 1,
                    isActive: true,
                },
                orderItems: [
                    {
                        id: 1,
                        orderId: parseInt(id),
                        courseId: 1,
                        courseName: 'เภสัชศาสตร์คลินิก: การดูแลผู้ป่วยโรคเรื้อรัง',
                        priceAtPurchase: 2990,
                        courseImage: '/courses/pharmacy-clinical.jpg',
                    },
                    {
                        id: 2,
                        orderId: parseInt(id),
                        courseId: 2,
                        courseName: 'การจัดการยาในโรงพยาบาล',
                        priceAtPurchase: 2000,
                        courseImage: '/courses/hospital-pharmacy.jpg',
                    },
                ],
                transactions: [
                    {
                        id: 1,
                        orderId: parseInt(id),
                        transactionRefId: 'TXN-20260107-001',
                        gateway: 'Stripe',
                        amount: 4490,
                        status: TransactionStatus.SUCCESS,
                        createdAt: '2026-01-07T10:32:15Z',
                        completedAt: '2026-01-07T10:32:20Z',
                    },
                ],
            };
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
            // In production: const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
            // return response.data;

            console.log('Update order status:', id, status);
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
            // In production: await apiClient.post(`/orders/${id}/cancel`, { reason });

            console.log('Cancel order:', id, reason);
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
            // In production: await apiClient.post(`/orders/${id}/refund`, { amount });

            console.log('Refund order:', id, amount);
        } catch (error) {
            console.error('Failed to refund order:', error);
            throw error;
        }
    },
};
