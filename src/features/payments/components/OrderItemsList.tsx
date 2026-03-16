import { BookOpen } from 'lucide-react';
import type { OrderItem } from '../types';
import { formatCurrency } from '@/utils/format';

interface OrderItemsListProps {
    items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
    const subtotal = items.reduce((sum, item) => sum + item.priceAtPurchase, 0);

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-violet-500" />
                    รายการคอร์สที่สั่งซื้อ
                </h2>
            </div>

            {/* Items List */}
            <div className="divide-y divide-slate-100">
                {items.map((item, index) => (
                    <div key={item.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        {/* Number Badge */}
                        <div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                            {index + 1}
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 mb-1">{item.courseName}</h3>
                            <p className="text-sm text-slate-500">ID: {item.courseId}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <p className="text-lg font-bold text-slate-800">
                                {formatCurrency(item.priceAtPurchase)}
                            </p>
                            {item.discountAmount && item.discountAmount > 0 && (
                                <p className="text-sm text-green-600 font-semibold">
                                    ส่วนลด -{formatCurrency(item.discountAmount)}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Summary */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-t border-slate-200">
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-700">รวมทั้งหมด ({items.length} คอร์ส)</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(subtotal)}</span>
                </div>
            </div>
        </div>
    );
}
