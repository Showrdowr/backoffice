import type { CourseStats } from '../types';
import { formatCurrency, formatNumber } from '@/utils/format';

interface CourseStatsCardsProps {
    stats: CourseStats;
}

export function CourseStatsCards({ stats }: CourseStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100 hover:shadow-xl transition-all">
                <p className="text-sm font-medium text-slate-500 mb-2">คอร์สทั้งหมด</p>
                <p className="text-3xl font-bold text-slate-800">{formatNumber(stats.total)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition-all">
                <p className="text-sm font-medium text-slate-500 mb-2">เผยแพร่แล้ว</p>
                <p className="text-3xl font-bold text-emerald-600">{formatNumber(stats.published)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-100 hover:shadow-xl transition-all">
                <p className="text-sm font-medium text-slate-500 mb-2">ฉบับร่าง</p>
                <p className="text-3xl font-bold text-amber-600">{formatNumber(stats.draft)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all">
                <p className="text-sm font-medium text-slate-500 mb-2">รายได้รวม</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalRevenue ?? 0)}</p>
            </div>
        </div>
    );
}
