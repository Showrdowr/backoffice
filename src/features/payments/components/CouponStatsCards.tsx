'use client';

interface CouponStatsCardsProps {
    total: number;
    active: number;
    usedThisMonth: number;
    totalDiscount: number;
}

export function CouponStatsCards({ total, active, usedThisMonth, totalDiscount }: CouponStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">คูปองทั้งหมด</p>
                <p className="text-2xl font-bold text-slate-800">{total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">ใช้งานอยู่</p>
                <p className="text-2xl font-bold text-emerald-600">{active}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">ใช้แล้วเดือนนี้</p>
                <p className="text-2xl font-bold text-blue-600">{usedThisMonth.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-500">มูลค่าส่วนลด</p>
                <p className="text-2xl font-bold text-violet-600">฿{totalDiscount.toLocaleString()}</p>
            </div>
        </div>
    );
}
