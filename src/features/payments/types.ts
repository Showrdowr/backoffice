// Payments Feature Types - Aligned with Database Schema

// ==========================================
// Enums
// ==========================================

export enum DiscountType {
    FIXED = 'FIXED',
    PERCENT = 'PERCENT',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
}

// ==========================================
// Voucher (renamed from Coupon)
// ==========================================

export interface Voucher {
    id: number;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    usageLimit: number;
    perUserLimit: number;
    minOrderAmount: number;
    minItemQuantity: number;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    // Relations
    specificCategories?: VoucherCategory[];
    specificCourses?: VoucherCourse[];
    // Frontend display
    usedCount?: number;
}

export interface VoucherCategory {
    voucherId: number;
    categoryId: number;
    categoryName?: string;
}

export interface VoucherCourse {
    voucherId: number;
    courseId: number;
    courseName?: string;
}

// ==========================================
// Order
// ==========================================

export interface Order {
    id: number;
    userId: number;
    voucherId?: number;
    grandTotal: number;
    paymentMethod?: string;
    discountAmount: number;
    status: OrderStatus;
    createdAt: string;
    paidAt?: string;
    cancelledAt?: string;
    // Relations
    userName?: string;
    userEmail?: string;
    voucher?: Voucher;
    orderItems?: OrderItem[];
    transactions?: Transaction[];
}

export interface OrderItem {
    id: number;
    orderId: number;
    courseId: number;
    priceAtPurchase: number;
    // Frontend display
    courseName?: string;
    courseImage?: string;
    discountAmount?: number;
}

// For display in table
export interface OrderDisplay {
    id: string;
    orderNumber: string;
    user: string;
    userEmail: string;
    courses: number;
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: string;
    createdAt: string;
}

// Stats for dashboard
export interface OrderStats {
    total: number;
    pending: number;
    paid: number;
    cancelled: number;
    todayOrders: number;
    todayRevenue: number;
}

// ==========================================
// Transaction
// ==========================================

export interface Transaction {
    id: number | string;
    orderId: number | string;
    transactionRefId?: string;
    gateway?: string;
    amount: number;
    status: TransactionStatus | 'pending' | 'completed' | 'failed';
    // Frontend display
    order?: Order;
    userName?: string;
    userId?: string;
    method?: 'credit_card' | 'promptpay' | 'bank_transfer';
    createdAt?: string;
    completedAt?: string;
}

// ==========================================
// Stats & Reports
// ==========================================

export interface VoucherStats {
    total: number;
    active: number;
    expired: number;
    usedThisMonth: number;
    totalDiscount: number;
}

export interface TransactionStats {
    todayRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    todayTransactions: number;
    pendingTransactions: number;
}

export interface PaymentReport {
    totalRevenue: number;
    totalTransactions: number;
    successRate: number;
    avgOrderValue: number;
}

// ==========================================
// Data Response interfaces
// ==========================================

export interface VouchersData {
    vouchers: Voucher[];
    stats: VoucherStats;
}

export interface OrdersData {
    orders: OrderDisplay[];
    stats: OrderStats;
}

export interface TransactionsData {
    transactions: Transaction[];
    stats: TransactionStats;
}

// ==========================================
// Form Input interfaces
// ==========================================

export interface CreateVoucherInput {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    usageLimit: number;
    perUserLimit?: number;
    minOrderAmount?: number;
    minItemQuantity?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    categoryIds?: number[];
    courseIds?: number[];
}

export interface UpdateVoucherInput extends Partial<CreateVoucherInput> {
    id: number;
}

// Legacy alias for backwards compatibility
export type Coupon = Voucher;

