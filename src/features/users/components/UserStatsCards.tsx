import type { UserStats, PharmacistStats } from '../types';
import { formatNumber } from '@/utils/format';

interface UserStatsCardsProps {
    stats: UserStats | PharmacistStats;
    type: 'user' | 'pharmacist';
}

export function UserStatsCards({ stats, type }: UserStatsCardsProps) {
    const isPharmacist = type === 'pharmacist';
    const pharmacistStats = isPharmacist ? (stats as PharmacistStats) : null;

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isPharmacist ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-6`}>
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all card-hover">
                <p className="text-sm font-medium text-slate-500 mb-2">
                    {isPharmacist ? 'เภสัชกรทั้งหมด' : 'ผู้ใช้ทั้งหมด'}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">{formatNumber(stats.total)}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all card-hover">
                <p className="text-sm font-medium text-slate-500 mb-2">ใช้งานอยู่</p>
                <p className="text-2xl md:text-3xl font-bold text-emerald-600">{formatNumber(stats.active)}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all card-hover">
                <p className="text-sm font-medium text-slate-500 mb-2">ไม่ได้ใช้งาน</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-400">{formatNumber(stats.inactive)}</p>
            </div>

            {isPharmacist && pharmacistStats && (
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all card-hover">
                    <p className="text-sm font-medium text-slate-500 mb-2">เฉลี่ย CE/คน</p>
                    <p className="text-2xl md:text-3xl font-bold text-violet-600">{pharmacistStats.averageCpeCredits}</p>
                </div>
            )}
        </div>
    );
}
