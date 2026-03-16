'use client';

import { PieChart } from 'lucide-react';
import type { CategorySales } from '../services/paymentService';

interface CategorySalesChartProps {
    data: CategorySales[];
    selectedYear: string;
}

export function CategorySalesChart({ data, selectedYear }: CategorySalesChartProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <PieChart className="text-violet-600" size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">ยอดขายตามหมวดหมู่</h3>
                    <p className="text-sm text-slate-500">ปี {selectedYear}</p>
                </div>
            </div>

            <div className="space-y-4">
                {data.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                                ฿{(cat.sales / 1000).toFixed(0)}k
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${cat.color} rounded-full transition-all`}
                                style={{ width: `${cat.percentage}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{cat.courses} คอร์ส</span>
                            <span>{cat.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
