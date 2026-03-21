import type { VideoStats } from '../types';
import { formatNumber } from '@/utils/format';
import { AlertCircle, Clock, RefreshCcw, Video } from 'lucide-react';

interface VideoStatsCardsProps {
    stats: VideoStats;
}

export function VideoStatsCards({ stats }: VideoStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md transition-all hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-100">
                        <Video size={24} className="text-sky-600" />
                    </div>
                </div>
                <p className="mb-1 text-sm font-medium text-slate-500">วิดีโอทั้งหมด</p>
                <p className="text-3xl font-bold text-slate-800">{formatNumber(stats.total)}</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md transition-all hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-sky-100">
                        <Clock size={24} className="text-blue-600" />
                    </div>
                </div>
                <p className="mb-1 text-sm font-medium text-slate-500">ชั่วโมงรวม</p>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(stats.totalDurationHours ?? 0)} ชม.</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md transition-all hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
                        <RefreshCcw size={24} className="text-emerald-600" />
                    </div>
                </div>
                <p className="mb-1 text-sm font-medium text-slate-500">พร้อมใช้งาน</p>
                <p className="text-3xl font-bold text-emerald-600">{formatNumber(stats.byStatus?.READY ?? 0)}</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md transition-all hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-rose-100">
                        <AlertCircle size={24} className="text-red-600" />
                    </div>
                </div>
                <p className="mb-1 text-sm font-medium text-slate-500">มีปัญหา</p>
                <p className="text-3xl font-bold text-red-600">{formatNumber(stats.byStatus?.FAILED ?? 0)}</p>
            </div>
        </div>
    );
}
