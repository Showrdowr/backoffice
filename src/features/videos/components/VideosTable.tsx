import type { Video } from '../types';
import { Eye, RefreshCcw, Trash2, Video as VideoIcon } from 'lucide-react';

interface VideosTableProps {
    videos: Video[];
    onView?: (id: number) => void;
    onSync?: (id: number) => void;
    onDelete?: (id: number) => void;
}

function formatDuration(seconds?: number | null): string {
    if (!seconds) return '-';
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getStatusClasses(status: Video['status']) {
    switch (status) {
        case 'READY':
            return 'bg-emerald-100 text-emerald-700';
        case 'FAILED':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-amber-100 text-amber-700';
    }
}

function getStatusLabel(status: Video['status']) {
    switch (status) {
        case 'READY':
            return 'พร้อมใช้งาน';
        case 'FAILED':
            return 'มีปัญหา';
        default:
            return 'กำลังประมวลผล';
    }
}

export function VideosTable({ videos, onView, onSync, onDelete }: VideosTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-600">วิดีโอ</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-600">สถานะ</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-600">ความยาว</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-600">การใช้งาน</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-600">สร้างเมื่อ</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-600">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {videos.map((video) => (
                        <tr key={video.id} className="transition-colors hover:bg-sky-50/30">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 shadow-sm">
                                        <VideoIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{video.name || `Vimeo ${video.resourceId}`}</p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                                                {video.provider}
                                            </span>
                                            <p className="font-mono text-xs text-slate-400">{video.resourceId}</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(video.status)}`}>
                                    {getStatusLabel(video.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{formatDuration(video.duration)}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                <p>Preview: {video.usage.previewCourseCount}</p>
                                <p>Lessons: {video.usage.lessonUsageCount}</p>
                                <p className="font-semibold text-slate-800">รวม {video.usage.totalUsageCount}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                                {video.createdAt ? new Date(video.createdAt).toLocaleDateString('th-TH') : '-'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView?.(video.id)}
                                        className="rounded-xl p-2.5 transition-all hover:bg-sky-100"
                                        title="ดูรายละเอียด"
                                    >
                                        <Eye size={18} className="text-slate-500" />
                                    </button>
                                    <button
                                        onClick={() => onSync?.(video.id)}
                                        className="rounded-xl p-2.5 transition-all hover:bg-slate-100"
                                        title="ซิงก์สถานะ"
                                    >
                                        <RefreshCcw size={18} className="text-slate-500" />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(video.id)}
                                        className="rounded-xl p-2.5 transition-all hover:bg-red-100"
                                        title="ลบ"
                                    >
                                        <Trash2 size={18} className="text-slate-500" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
