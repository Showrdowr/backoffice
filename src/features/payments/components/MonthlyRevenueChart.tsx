'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import type { MonthlyRevenue } from '../services/paymentService';

interface MonthlyRevenueChartProps {
    data: MonthlyRevenue[];
    selectedYear: string;
}

export function MonthlyRevenueChart({ data, selectedYear }: MonthlyRevenueChartProps) {
    const maxRevenue = Math.max(...data.map(m => m.revenue));
    const totalRevenue = data.reduce((sum, m) => sum + m.revenue, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">รายได้รายเดือน</h3>
                        <p className="text-sm text-slate-500">ปี {selectedYear}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                    <TrendingUp size={18} />
                    <span className="font-semibold">+22%</span>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-56">
                {data.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col items-center">
                            <span className="text-xs font-medium text-slate-600 mb-1">
                                ฿{(item.revenue / 1000).toFixed(0)}k
                            </span>
                            <div
                                className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${idx === data.length - 1 ? 'bg-blue-500' : 'bg-blue-200'
                                    }`}
                                style={{ height: `${(item.revenue / maxRevenue) * 160}px` }}
                                title={`${item.month}: ฿${item.revenue.toLocaleString()}`}
                            />
                        </div>
                        <span className="text-xs text-slate-500">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
