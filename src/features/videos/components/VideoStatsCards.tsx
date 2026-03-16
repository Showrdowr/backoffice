import type { VideoStats } from '../types';
import { formatNumber } from '@/utils/format';
import { Video, Clock, Film } from 'lucide-react';

interface VideoStatsCardsProps {
    stats: VideoStats;
}

export function VideoStatsCards({ stats }: VideoStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <Video size={24} className="text-sky-600" />
                    </div>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">วิดีโอทั้งหมด</p>
                <p className="text-3xl font-bold text-slate-800">{formatNumber(stats.total)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl flex items-center justify-center">
                        <Clock size={24} className="text-blue-600" />
                    </div>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">ชั่วโมงรวม</p>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(stats.totalDurationHours ?? 0)} ชม.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-sky-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <Film size={24} className="text-violet-600" />
                    </div>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Vimeo</p>
                <p className="text-3xl font-bold text-violet-600">{formatNumber(stats.byProvider?.vimeo ?? 0)}</p>
            </div>
        </div>
    );
}
