'use client';

import { useState } from 'react';
import { Video, Plus, Trash2, Clock, Eye, Star } from 'lucide-react';
import type { Video as VideoType } from '@/features/videos/types';
import { VideoProvider } from '@/features/videos/types';
import { VideoUploadModal } from './VideoUploadModal';

interface CourseVideoSectionProps {
    videos: VideoType[];
    onAddVideo: (video: VideoType) => void;
    onDeleteVideo: (videoId: number) => void;
    previewVideoId?: number | null;
    onSelectPreview?: (videoId: number) => void;
    title?: string;
    description?: string;
    showPreviewAsBadge?: boolean;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getProviderLabel(provider: VideoProvider): string {
    switch (provider) {
        case VideoProvider.VIMEO: return 'Vimeo';
        default: return provider;
    }
}

export function CourseVideoSection({
    videos,
    onAddVideo,
    onDeleteVideo,
    previewVideoId,
    onSelectPreview,
    title = "วิดีโอสำหรับคอร์สนี้",
    description = "อัพโหลดวิดีโอแล้วนำไปใช้ในบทเรียน",
    showPreviewAsBadge = false
}: CourseVideoSectionProps) {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md border border-rose-100">
                <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Video size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                            <p className="text-sm text-slate-500">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                    >
                        <Plus size={18} />
                        อัพโหลดวิดีโอ
                    </button>
                </div>

                <div className="p-6">
                    {videos.length === 0 ? (
                        <div className="text-center py-12 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-xl border border-dashed border-rose-200">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Video size={32} className="text-rose-400" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">ยังไม่มีวิดีโอ</h3>
                            <p className="text-sm text-slate-500 mb-4">อัพโหลดวิดีโอเพื่อใช้ในบทเรียน</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 text-rose-600 font-semibold text-sm hover:text-rose-700"
                            >
                                <Plus size={16} />
                                อัพโหลดวิดีโอแรก
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {videos.map((video, index) => (
                                <div
                                    key={video.id}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-rose-50/30 rounded-xl border border-rose-100 hover:shadow-md transition-all group"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-rose-600">{index + 1}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 truncate">{video.name}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatDuration(video.duration)}
                                            </span>
                                            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded font-medium">
                                                {getProviderLabel(video.provider)}
                                            </span>
                                            <span className="text-slate-400 font-mono text-[10px]">
                                                ID: {video.resourceId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-2 transition-all ${previewVideoId === video.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {showPreviewAsBadge ? (
                                            previewVideoId === video.id && (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full border border-amber-200">
                                                    วิดีโอตัวอย่าง
                                                </span>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => onSelectPreview?.(video.id)}
                                                className={`p-2 transition-all rounded-lg ${previewVideoId === video.id
                                                    ? 'bg-amber-100 text-amber-500'
                                                    : 'hover:bg-amber-50 text-slate-400 hover:text-amber-500'
                                                    }`}
                                                title={previewVideoId === video.id ? 'วิดีโอตัวอย่าง (คลิกเพื่อยกเลิก)' : 'ตั้งเป็นวิดีโอตัวอย่าง'}
                                            >
                                                <Star size={16} fill={previewVideoId === video.id ? 'currentColor' : 'none'} />
                                            </button>
                                        )}
                                        {!showPreviewAsBadge && (
                                            <button
                                                className="p-2 hover:bg-rose-100 rounded-lg transition-all"
                                                title="ดูตัวอย่าง"
                                            >
                                                <Eye size={16} className="text-slate-500" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDeleteVideo(video.id)}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-all"
                                            title="ลบ"
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <VideoUploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploadComplete={onAddVideo}
            />
        </>
    );
}
