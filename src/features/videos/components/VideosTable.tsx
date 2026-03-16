
import type { Video } from '../types';
import { VideoProvider } from '../types';
import { Eye, Edit, Trash2, Film, Folder } from 'lucide-react';
import type { Category } from '@/features/courses/types/categories';

interface VideosTableProps {
    videos: Video[];
    categories?: Category[];
    onView?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

function formatDuration(seconds?: number): string {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')} ชม.`;
    }
    return `${minutes} นาที`;
}

function getProviderIcon(provider: VideoProvider) {
    switch (provider) {
        case VideoProvider.VIMEO:
            return <Film size={16} className="text-blue-600" />;
        default:
            return <Film size={16} className="text-slate-600" />;
    }
}

function getProviderLabel(provider: VideoProvider): string {
    switch (provider) {
        case VideoProvider.VIMEO:
            return 'Vimeo';
        default:
            return provider;
    }
}

export function VideosTable({ videos, categories = [], onView, onEdit, onDelete }: VideosTableProps) {
    const getCategory = (id?: string | number) => {
        if (!id) return null;
        return categories.find(c => c.id.toString() === id.toString());
    };

    const getCategoryColor = (color?: string) => {
        switch (color) {
            case 'violet': return 'bg-violet-100 text-violet-600';
            case 'blue': return 'bg-blue-100 text-blue-600';
            case 'emerald': return 'bg-emerald-100 text-emerald-600';
            case 'amber': return 'bg-amber-100 text-amber-600';
            case 'rose': return 'bg-rose-100 text-rose-600';
            case 'cyan': return 'bg-cyan-100 text-cyan-600';
            case 'pink': return 'bg-pink-100 text-pink-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-sky-50 border-b border-sky-100">
                    <tr>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">หมวดหมู่ / วิดีโอ</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Provider</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">ความยาว</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">สร้างเมื่อ</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {videos.map((video) => {
                        const category = getCategory(video.categoryId);
                        return (
                            <tr key={video.id} className="hover:bg-sky-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {/* Category Badge instead of Thumbnail */}
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${getCategoryColor(category?.color)}`}
                                            title={category?.name || 'ไม่มีหมวดหมู่'}
                                        >
                                            <Folder size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{video.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {category && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(category.color).replace('text-', 'bg-opacity-10 text-')}`}>
                                                        {category.name}
                                                    </span>
                                                )}
                                                <p className="text-xs text-slate-400 font-mono">{video.resourceId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                        {getProviderIcon(video.provider)}
                                        {getProviderLabel(video.provider)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        <span>{formatDuration(video.duration)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {new Date(video.createdAt).toLocaleDateString('th-TH')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView?.(video.id)}
                                            className="p-2.5 hover:bg-sky-100 rounded-xl transition-all group/btn"
                                            title="ดูรายละเอียด"
                                        >
                                            <Eye size={18} className="text-slate-500 group-hover/btn:text-sky-600" />
                                        </button>
                                        <button
                                            onClick={() => onEdit?.(video.id)}
                                            className="p-2.5 hover:bg-blue-100 rounded-xl transition-all group/btn"
                                            title="แก้ไข"
                                        >
                                            <Edit size={18} className="text-slate-500 group-hover/btn:text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(video.id)}
                                            className="p-2.5 hover:bg-red-100 rounded-xl transition-all group/btn"
                                            title="ลบ"
                                        >
                                            <Trash2 size={18} className="text-slate-500 group-hover/btn:text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
