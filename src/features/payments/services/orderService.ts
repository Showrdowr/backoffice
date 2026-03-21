import { OrderStatus, TransactionStatus } from '../types';
import type { Order, OrderDisplay, OrdersData } from '../types';

const mockOrders: Order[] = [
    {
        id: 1,
        userId: 101,
        grandTotal: 1200,
        paymentMethod: 'PromptPay',
        discountAmount: 0,
        status: OrderStatus.PAID,
        createdAt: '2026-03-18T09:30:00.000Z',
        paidAt: '2026-03-18T09:33:00.000Z',
        userName: 'สมชาย ใจดี',
        userEmail: 'somchai@example.com',
        orderItems: [
            {
                id: 1001,
                orderId: 1,
                courseId: 12,
                priceAtPurchase: 500,
                courseName: 'การดูแลผู้ป่วยโรคเรื้อรัง',
            },
            {
                id: 1002,
                orderId: 1,
                courseId: 18,
                priceAtPurchase: 700,
                courseName: 'เภสัชกรรมคลินิกขั้นสูง',
            },
        ],
        transactions: [
            {
                id: 5001,
                orderId: 1,
                transactionRefId: 'TXN-20260318-001',
                gateway: 'PromptPay',
                amount: 1200,
                status: TransactionStatus.SUCCESS,
                createdAt: '2026-03-18T09:31:00.000Z',
                completedAt: '2026-03-18T09:33:00.000Z',
            },
        ],
    },
    {
        id: 2,
        userId: 102,
        grandTotal: 800,
        paymentMethod: 'Credit Card',
        discountAmount: 100,
        status: OrderStatus.PENDING,
        createdAt: '2026-03-19T03:15:00.000Z',
        userName: 'สมหญิง รักเรียน',
        userEmail: 'somying@example.com',
        orderItems: [
            {
                id: 1003,
                orderId: 2,
                courseId: 24,
                priceAtPurchase: 900,
                discountAmount: 100,
                courseName: 'กฎหมายเภสัชกรรม 2026',
            },
        ],
        transactions: [
            {
                id: 5002,
                orderId: 2,
                transactionRefId: 'TXN-20260319-002',
                gateway: 'Credit Card',
                amount: 800,
                status: TransactionStatus.PENDING,
                createdAt: '2026-03-19T03:16:00.000Z',
            },
        ],
    },
    {
        id: 3,
        userId: 103,
        grandTotal: 400,
        paymentMethod: 'PromptPay',
        discountAmount: 0,
        status: OrderStatus.CANCELLED,
        createdAt: '2026-03-17T11:45:00.000Z',
        cancelledAt: '2026-03-17T12:10:00.000Z',
        userName: 'วิภา มานะ',
        userEmail: 'wipa@example.com',
        orderItems: [
            {
                id: 1004,
                orderId: 3,
                courseId: 31,
                priceAtPurchase: 400,
                courseName: 'ทักษะการสื่อสารกับผู้ป่วย',
            },
        ],
        transactions: [
            {
                id: 5003,
                orderId: 3,
                transactionRefId: 'TXN-20260317-003',
                gateway: 'PromptPay',
                amount: 400,
                status: TransactionStatus.FAIL,
                createdAt: '2026-03-17T11:47:00.000Z',
            },
        ],
    },
];

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

function createOrderStats() {
    const today = new Date().toISOString().slice(0, 10);
    const paidOrders = mockOrders.filter((order) => order.status === OrderStatus.PAID);
    const todayOrders = mockOrders.filter((order) => order.createdAt.slice(0, 10) === today);

    return {
        total: mockOrders.length,
        pending: mockOrders.filter((order) => order.status === OrderStatus.PENDING).length,
        paid: paidOrders.length,
        cancelled: mockOrders.filter((order) => order.status === OrderStatus.CANCELLED).length,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders
            .filter((order) => order.status === OrderStatus.PAID)
            .reduce((sum, order) => sum + order.grandTotal, 0),
    };
}

function findOrder(id: string): Order | undefined {
    return mockOrders.find((order) => String(order.id) === String(id));
}

export const orderService = {
    async getOrders(): Promise<OrdersData> {
        return {
            orders: mockOrders.map(toOrderDisplay),
            stats: createOrderStats(),
        };
    },

    async getOrderById(id: string): Promise<Order> {
        const order = findOrder(id);
        if (!order) {
            throw new Error('Order not found');
        }

        return {
            ...order,
            orderItems: order.orderItems ? [...order.orderItems] : [],
            transactions: order.transactions ? [...order.transactions] : [],
        };
    },

    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        const order = findOrder(id);
        if (!order) {
            throw new Error('Order not found');
        }

        order.status = status;
        if (status === OrderStatus.PAID && !order.paidAt) {
            order.paidAt = new Date().toISOString();
        }
        if (status === OrderStatus.CANCELLED && !order.cancelledAt) {
            order.cancelledAt = new Date().toISOString();
        }

        return this.getOrderById(id);
    },

    async cancelOrder(id: string, _reason?: string): Promise<void> {
        const order = findOrder(id);
        if (!order) {
            throw new Error('Order not found');
        }

        order.status = OrderStatus.CANCELLED;
        order.cancelledAt = new Date().toISOString();
    },

    async refundOrder(id: string, amount: number): Promise<void> {
        const order = findOrder(id);
        if (!order) {
            throw new Error('Order not found');
        }

        order.discountAmount += amount;
    },
};
