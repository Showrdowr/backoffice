'use client';

import { useEffect, useMemo, useState } from 'react';
import { Video, Plus, Trash2, Clock, Eye, RefreshCcw, Star } from 'lucide-react';
import type { Video as VideoType } from '@/features/videos/types';
import { VimeoPlayerPreview } from '@/features/videos/components/VimeoPlayerPreview';
import { videoService } from '@/features/videos/services/videoService';
import { VideoUploadModal } from './VideoUploadModal';

interface CourseVideoSectionProps {
    videos: VideoType[];
    onAddVideo: (video: VideoType) => void;
    onDeleteVideo: (videoId: number) => void;
    previewVideoId?: number | null;
    onSelectPreview?: (videoId: number) => void;
    title?: string;
    description?: string;
    helperText?: string;
    showPreviewAsBadge?: boolean;
}

function formatDuration(seconds: number | null | undefined): string {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds || 0)));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    if (mins >= 60) {
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getProviderLabel(provider: string): string {
    return provider === 'VIMEO' ? 'Vimeo' : provider;
}

function canPreviewVideo(video: VideoType) {
    return video.status === 'READY' && Number(video.duration ?? 0) > 0 && Boolean(video.playbackUrl);
}

function getUnavailablePreviewMessage(video: VideoType) {
    if (video.status === 'FAILED') {
        return 'วิดีโอนี้มีปัญหา จึงยังดูตัวอย่างไม่ได้';
    }
    if (video.status === 'READY' && !video.playbackUrl) {
        return 'วิดีโอนี้ยังไม่มี playback URL กรุณาซิงก์สถานะใหม่';
    }

    return 'วิดีโอนี้ยังประมวลผลไม่เสร็จ จึงยังดูตัวอย่างไม่ได้';
}

export function CourseVideoSection({
    videos,
    onAddVideo,
    onDeleteVideo,
    previewVideoId,
    onSelectPreview,
    title = 'วิดีโอสำหรับคอร์สนี้',
    description = 'อัปโหลดวิดีโอแล้วนำไปใช้ในบทเรียน',
    helperText,
    showPreviewAsBadge = false,
}: CourseVideoSectionProps) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [previewingVideo, setPreviewingVideo] = useState<VideoType | null>(null);
    const [videoNotice, setVideoNotice] = useState('');
    const [syncingVideoId, setSyncingVideoId] = useState<number | null>(null);

    const previewVideo = useMemo(
        () => videos.find((video) => video.id === previewVideoId) || null,
        [previewVideoId, videos]
    );

    useEffect(() => {
        if (previewingVideo && !videos.some((video) => video.id === previewingVideo.id)) {
            setPreviewingVideo(null);
        }
    }, [previewingVideo, videos]);

    useEffect(() => {
        if (!videoNotice) {
            return;
        }

        const timeoutId = window.setTimeout(() => setVideoNotice(''), 3500);
        return () => window.clearTimeout(timeoutId);
    }, [videoNotice]);

    const getStatusClasses = (status: VideoType['status']) => {
        switch (status) {
            case 'READY':
                return 'border-emerald-200 bg-emerald-100 text-emerald-700';
            case 'FAILED':
                return 'border-red-200 bg-red-100 text-red-700';
            default:
                return 'border-amber-200 bg-amber-100 text-amber-700';
        }
    };

    const getStatusLabel = (status: VideoType['status']) => {
        switch (status) {
            case 'READY':
                return 'พร้อมใช้งาน';
            case 'FAILED':
                return 'มีปัญหา';
            default:
                return 'กำลังประมวลผล';
        }
    };

    const renderPreviewControls = (video: VideoType, isSelected: boolean) => {
        if (!onSelectPreview) {
            return null;
        }

        if (showPreviewAsBadge) {
            return (
                <button
                    type="button"
                    onClick={() => {
                        if (!canPreviewVideo(video)) {
                            setVideoNotice('วิดีโอตัวอย่างต้องอยู่ในสถานะพร้อมใช้งานก่อน');
                            return;
                        }
                        onSelectPreview(video.id);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                            ? 'border border-amber-200 bg-amber-100 text-amber-700'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700'
                    }`}
                >
                    {isSelected ? 'ยกเลิกวิดีโอตัวอย่าง' : 'ตั้งเป็นวิดีโอตัวอย่าง'}
                </button>
            );
        }

        return (
            <button
                type="button"
                onClick={() => {
                    if (!canPreviewVideo(video)) {
                        setVideoNotice('วิดีโอตัวอย่างต้องอยู่ในสถานะพร้อมใช้งานก่อน');
                        return;
                    }
                    onSelectPreview(video.id);
                }}
                className={`rounded-lg p-2 transition-all ${
                    isSelected
                        ? 'bg-amber-100 text-amber-500'
                        : 'text-slate-400 hover:bg-amber-50 hover:text-amber-500'
                }`}
                title={isSelected ? 'ยกเลิกวิดีโอตัวอย่าง' : 'ตั้งเป็นวิดีโอตัวอย่าง'}
            >
                <Star size={16} fill={isSelected ? 'currentColor' : 'none'} />
            </button>
        );
    };

    const handleSyncVideo = async (videoId: number) => {
        try {
            setVideoNotice('');
            setSyncingVideoId(videoId);
            const updatedVideo = await videoService.syncVideoStatus(videoId);
            onAddVideo(updatedVideo);
        } catch (error) {
            setVideoNotice(error instanceof Error ? error.message : 'ซิงก์สถานะวิดีโอไม่สำเร็จ');
        } finally {
            setSyncingVideoId(null);
        }
    };

    return (
        <>
            <div className="rounded-2xl border border-rose-100 bg-white shadow-md">
                <div className="rounded-t-2xl border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600">
                                <Video size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                                <p className="text-sm text-slate-500">{description}</p>
                                {helperText && <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">{helperText}</p>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
                        >
                            <Plus size={18} />
                            เพิ่มวิดีโอ
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-700">
                            {previewVideo ? `วิดีโอตัวอย่างที่เลือก: ${previewVideo.name}` : 'ยังไม่ได้เลือกวิดีโอตัวอย่าง'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            วิดีโอนี้ใช้แสดงเป็น teaser ของคอร์สบนหน้ารายละเอียด ไม่ใช่วิดีโอบทเรียนของผู้เรียน
                        </p>
                    </div>

                    {videoNotice && (
                        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            {videoNotice}
                        </div>
                    )}

                    {videos.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-rose-200 bg-gradient-to-br from-rose-50/50 to-pink-50/50 py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <Video size={32} className="text-rose-400" />
                            </div>
                            <h3 className="mb-1 font-semibold text-slate-800">ยังไม่มีวิดีโอ</h3>
                            <p className="mb-4 text-sm text-slate-500">อัปโหลดวิดีโอเพื่อใช้เป็นตัวอย่างคอร์ส</p>
                            <button
                                type="button"
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
                            >
                                <Plus size={16} />
                                อัปโหลดวิดีโอแรก
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {videos.map((video, index) => {
                                const isSelectedPreview = previewVideoId === video.id;

                                return (
                                    <div
                                        key={video.id}
                                        className="group flex items-center gap-4 rounded-xl border border-rose-100 bg-gradient-to-r from-slate-50 to-rose-50/30 p-4 transition-all hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-pink-100">
                                            <span className="text-sm font-bold text-rose-600">{index + 1}</span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate font-semibold text-slate-800">{video.name}</p>
                                                {isSelectedPreview && (
                                                    <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                                        วิดีโอตัวอย่าง
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatDuration(video.duration)}
                                                </span>
                                                <span className="rounded bg-violet-100 px-2 py-0.5 font-medium text-violet-700">
                                                    {getProviderLabel(video.provider)}
                                                </span>
                                                <span className={`rounded border px-2 py-0.5 font-semibold ${getStatusClasses(video.status)}`}>
                                                    {getStatusLabel(video.status)}
                                                </span>
                                                <span>ใช้งาน {video.usage.totalUsageCount} จุด</span>
                                                <span className="font-mono text-[10px] text-slate-400">ID: {video.resourceId}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {renderPreviewControls(video, isSelectedPreview)}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!canPreviewVideo(video)) {
                                                        setVideoNotice(getUnavailablePreviewMessage(video));
                                                        return;
                                                    }
                                                    setPreviewingVideo(video);
                                                }}
                                                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                title={canPreviewVideo(video) ? 'ดูตัวอย่าง' : 'วิดีโอยังไม่พร้อมพรีวิว'}
                                                disabled={!canPreviewVideo(video)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void handleSyncVideo(video.id)}
                                                disabled={syncingVideoId === video.id}
                                                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                title="ซิงก์สถานะวิดีโอ"
                                            >
                                                <RefreshCcw size={16} className={syncingVideoId === video.id ? 'animate-spin' : ''} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteVideo(video.id)}
                                                className="rounded-lg p-2 transition-all hover:bg-red-100"
                                                title="ลบ"
                                            >
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <VideoUploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploadComplete={onAddVideo}
            />

            {previewingVideo && (
                <VimeoPlayerPreview
                    video={previewingVideo}
                    onClose={() => setPreviewingVideo(null)}
                />
            )}
        </>
    );
}
