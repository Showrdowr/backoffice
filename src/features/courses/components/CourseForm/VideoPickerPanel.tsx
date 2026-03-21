'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Link as LinkIcon,
    RefreshCcw,
    Search,
    Upload,
    Video,
} from 'lucide-react';
import { getVimeoErrorMessage, type ResolvedVimeoVideo, type UploadProgress, vimeoService } from '@/features/videos/services/vimeoService';
import type { Video as VideoType } from '@/features/videos/types';
import { videoService } from '@/features/videos/services/videoService';

type VideoPickerMode = 'library' | 'upload' | 'existing';

interface VideoPickerPanelProps {
    modes?: VideoPickerMode[];
    availableVideos: VideoType[];
    selectedVideoId?: number | null;
    onSelectVideo?: (video: VideoType) => void;
    onVideoReady: (video: VideoType) => void;
    onVideoRefresh?: (video: VideoType) => void;
    preferredName?: string;
    onBusyChange?: (isBusy: boolean) => void;
    libraryEmptyText?: string;
}

function formatDurationLabel(seconds: number | null): string {
    if (!seconds || seconds <= 0) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatUploadedVideo(fileName: string, result: {
    id: number;
    persistedVideoId: number;
    resourceId: string;
    duration: number | null;
    provider: string;
    createdAt: string | null;
    updatedAt: string | null;
    status: VideoType['status'];
    usage: VideoType['usage'];
    name: string | null;
    playbackUrl?: string | null;
}): VideoType {
    return {
        id: result.persistedVideoId,
        name: result.name || fileName,
        provider: result.provider as VideoType['provider'],
        resourceId: result.resourceId,
        duration: result.duration,
        playbackUrl: result.playbackUrl ?? null,
        status: result.status,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        usage: result.usage,
    };
}

function getStatusLabel(status: VideoType['status']) {
    switch (status) {
        case 'READY':
            return 'พร้อมใช้งาน';
        case 'FAILED':
            return 'มีปัญหา';
        default:
            return 'กำลังประมวลผล';
    }
}

function getStatusClasses(status: VideoType['status']) {
    switch (status) {
        case 'READY':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'FAILED':
            return 'border-red-200 bg-red-50 text-red-700';
        default:
            return 'border-amber-200 bg-amber-50 text-amber-700';
    }
}

export function VideoPickerPanel({
    modes = ['library', 'upload', 'existing'],
    availableVideos,
    selectedVideoId,
    onSelectVideo,
    onVideoReady,
    onVideoRefresh,
    preferredName,
    onBusyChange,
    libraryEmptyText = 'ยังไม่มีวิดีโอในคลัง',
}: VideoPickerPanelProps) {
    const firstMode = modes[0] || 'upload';
    const [mode, setMode] = useState<VideoPickerMode>(firstMode);
    const [videoName, setVideoName] = useState(preferredName || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [vimeoInput, setVimeoInput] = useState('');
    const [resolvedVideo, setResolvedVideo] = useState<ResolvedVimeoVideo | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [syncingVideoId, setSyncingVideoId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isUploading = progress !== null && progress.status !== 'complete' && progress.status !== 'failed' && progress.status !== 'canceled';
    const isBusy = isUploading || isResolving || isImporting || syncingVideoId !== null;

    useEffect(() => {
        onBusyChange?.(isBusy);
    }, [isBusy, onBusyChange]);

    useEffect(() => {
        if (!videoName.trim() && preferredName?.trim()) {
            setVideoName(preferredName.trim());
        }
    }, [preferredName, videoName]);

    const selectableVideos = useMemo(() => availableVideos.filter((video) => typeof video.id === 'number'), [availableVideos]);
    const selectedVideo = useMemo(
        () => selectableVideos.find((video) => video.id === selectedVideoId) || null,
        [selectableVideos, selectedVideoId]
    );
    const resolvedVideoIsPlayable = Boolean(
        resolvedVideo
        && resolvedVideo.uploadStatus === 'complete'
        && resolvedVideo.transcodeStatus === 'complete'
        && Number(resolvedVideo.duration ?? 0) > 0
        && resolvedVideo.playbackUrl
    );
    const resolvedVideoNeedsProcessing = Boolean(
        resolvedVideo
        && (!resolvedVideo.playbackUrl
            || resolvedVideo.uploadStatus !== 'complete'
            || resolvedVideo.transcodeStatus !== 'complete'
            || Number(resolvedVideo.duration ?? 0) <= 0)
    );

    const resetTransientState = () => {
        setSelectedFile(null);
        setProgress(null);
        setError(null);
        setVimeoInput('');
        setResolvedVideo(null);
        setIsResolving(false);
        setIsImporting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const switchMode = (nextMode: VideoPickerMode) => {
        if (isBusy || mode === nextMode) {
            return;
        }

        resetTransientState();
        setMode(nextMode);
        if ((nextMode === 'upload' || nextMode === 'existing') && preferredName?.trim()) {
            setVideoName(preferredName.trim());
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('video/')) {
            setError('กรุณาเลือกไฟล์วิดีโอเท่านั้น');
            return;
        }

        if (file.size > 500 * 1024 * 1024) {
            setError('ไฟล์วิดีโอมีขนาดเกิน 500MB');
            return;
        }

        setSelectedFile(file);
        setError(null);

        if (!videoName.trim()) {
            setVideoName(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !videoName.trim()) {
            setError('กรุณากรอกชื่อวิดีโอและเลือกไฟล์ก่อนอัปโหลด');
            return;
        }

        try {
            setError(null);
            setProgress({ percent: 0, status: 'uploading' });
            const result = await vimeoService.uploadVideo(selectedFile, setProgress, videoName.trim());
            onVideoReady(formatUploadedVideo(videoName.trim(), result));
            resetTransientState();
            if (preferredName?.trim()) {
                setVideoName(preferredName.trim());
            } else {
                setVideoName('');
            }
        } catch (uploadError) {
            setError(getVimeoErrorMessage(uploadError, 'อัปโหลดวิดีโอไม่สำเร็จ'));
            setProgress((current) => current ? { ...current, status: 'failed' } : { percent: 0, status: 'failed' });
        }
    };

    const handleCancelUpload = () => {
        vimeoService.cancelUpload();
        setProgress({ percent: 0, status: 'canceled' });
        setError('ยกเลิกการอัปโหลดแล้ว');
    };

    const handleResolve = async () => {
        if (!vimeoInput.trim()) {
            setError('กรุณากรอก Vimeo URL หรือ Video ID');
            return;
        }

        try {
            setError(null);
            setResolvedVideo(null);
            setIsResolving(true);
            const result = await vimeoService.resolveExistingVideo(vimeoInput.trim());
            setResolvedVideo(result);
            if (!videoName.trim() && result.name) {
                setVideoName(result.name);
            }
        } catch (resolveError) {
            setError(getVimeoErrorMessage(resolveError, 'ตรวจสอบวิดีโอจาก Vimeo ไม่สำเร็จ'));
        } finally {
            setIsResolving(false);
        }
    };

    const handleSyncVideo = async (video: VideoType) => {
        try {
            setError(null);
            setSyncingVideoId(video.id);
            const updatedVideo = await videoService.syncVideoStatus(video.id);
            onVideoRefresh?.(updatedVideo);
            if (selectedVideoId === video.id) {
                onSelectVideo?.(updatedVideo);
            }
        } catch (syncError) {
            setError(syncError instanceof Error ? syncError.message : 'ซิงก์สถานะวิดีโอไม่สำเร็จ');
        } finally {
            setSyncingVideoId(null);
        }
    };

    const handleImport = async () => {
        if (!resolvedVideo) {
            return;
        }

        try {
            setError(null);
            setIsImporting(true);
            const imported = await vimeoService.importExistingVideo(
                resolvedVideo.resourceId,
                videoName.trim() || undefined,
            );
            onVideoReady({
                ...imported,
                name: imported.name || resolvedVideo.name || `Vimeo ${resolvedVideo.resourceId}`,
            });
            resetTransientState();
            if (preferredName?.trim()) {
                setVideoName(preferredName.trim());
            } else {
                setVideoName('');
            }
        } catch (importError) {
            setError(getVimeoErrorMessage(importError, 'นำเข้าวิดีโอจาก Vimeo ไม่สำเร็จ'));
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="space-y-4">
            {modes.length > 1 && (
                <div className="flex items-center gap-4 border-b border-slate-200">
                    {modes.map((modeOption) => {
                        const isActive = mode === modeOption;
                        const labels: Record<VideoPickerMode, string> = {
                            library: 'เลือกจากคลัง',
                            upload: 'อัปโหลดใหม่',
                            existing: 'ใช้ลิงก์ Vimeo เดิม',
                        };

                        return (
                            <button
                                key={modeOption}
                                type="button"
                                onClick={() => switchMode(modeOption)}
                                disabled={isBusy}
                                className={`relative pb-2 text-sm font-semibold transition-all ${
                                    isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                                } disabled:opacity-50`}
                            >
                                {labels[modeOption]}
                                {isActive && <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-sky-600" />}
                            </button>
                        );
                    })}
                </div>
            )}

            {mode === 'library' && (
                selectableVideos.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                        <p className="text-sm text-slate-500">{libraryEmptyText}</p>
                    </div>
                ) : (
                    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                        {selectableVideos.map((video) => (
                            <label
                                key={video.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                                    selectedVideoId === video.id
                                        ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200'
                                        : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="video-library"
                                    checked={selectedVideoId === video.id}
                                    onChange={() => onSelectVideo?.(video)}
                                    className="sr-only"
                                />
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedVideoId === video.id ? 'bg-sky-500' : 'bg-slate-100'}`}>
                                    <Video size={16} className={selectedVideoId === video.id ? 'text-white' : 'text-slate-500'} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate text-sm font-medium text-slate-800">{video.name}</p>
                                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusClasses(video.status)}`}>
                                            {getStatusLabel(video.status)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {formatDurationLabel(video.duration)} • ใช้ในระบบ {video.usage.totalUsageCount} จุด
                                    </p>
                                </div>
                                {video.status !== 'READY' && (
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            void handleSyncVideo(video);
                                        }}
                                        disabled={syncingVideoId === video.id}
                                        className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        title="ซิงก์สถานะวิดีโอ"
                                    >
                                        <RefreshCcw size={14} className={syncingVideoId === video.id ? 'animate-spin' : ''} />
                                    </button>
                                )}
                                {selectedVideoId === video.id && (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                )
            )}

            {mode === 'library' && selectedVideo && selectedVideo.status !== 'READY' && (
                <div className={`rounded-xl border px-4 py-3 text-xs ${getStatusClasses(selectedVideo.status)}`}>
                    {selectedVideo.status === 'PROCESSING'
                        ? 'วิดีโอนี้ยังประมวลผลไม่เสร็จ สามารถผูกกับบทเรียนได้ แต่ยังพรีวิวหรือเล่นจริงไม่ได้'
                        : 'วิดีโอนี้มีปัญหา กรุณาซิงก์สถานะใหม่หรือลองอัปโหลด/นำเข้าใหม่'}
                </div>
            )}

            {mode === 'upload' && (
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            ชื่อวิดีโอ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={videoName}
                            onChange={(event) => setVideoName(event.target.value)}
                            disabled={isBusy}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-100"
                            placeholder="เช่น: บทที่ 1 - บทนำ"
                        />
                    </div>

                    {!selectedFile ? (
                        <div
                            onClick={() => !isBusy && fileInputRef.current?.click()}
                            className="cursor-pointer rounded-xl border-2 border-dashed border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 p-8 text-center transition-all hover:border-sky-400"
                        >
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                <Upload size={24} className="text-sky-500" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">คลิกเพื่อเลือกไฟล์วิดีโอ</p>
                            <p className="mt-1 text-xs text-slate-500">รองรับ MP4, MOV, AVI (สูงสุด 500MB)</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                    <Video size={22} className="text-sky-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-800">{selectedFile.name}</p>
                                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {progress && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">
                                    {progress.status === 'uploading' && 'กำลังอัปโหลด...'}
                                    {progress.status === 'processing' && 'กำลังประมวลผล...'}
                                    {progress.status === 'complete' && 'อัปโหลดสำเร็จ'}
                                    {progress.status === 'failed' && 'อัปโหลดไม่สำเร็จ'}
                                    {progress.status === 'canceled' && 'ยกเลิกการอัปโหลดแล้ว'}
                                </span>
                                <span className="font-semibold text-sky-600">{progress.percent}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-sky-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300" style={{ width: `${progress.percent}%` }} />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        {isUploading && (
                            <button
                                type="button"
                                onClick={handleCancelUpload}
                                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                            >
                                ยกเลิกอัปโหลด
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => void handleUpload()}
                            disabled={!selectedFile || !videoName.trim() || isBusy}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Upload size={16} />
                            อัปโหลดวิดีโอ
                        </button>
                    </div>
                </div>
            )}

            {mode === 'existing' && (
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Vimeo URL หรือ Video ID <span className="text-red-500">*</span>
                        </label>
                        <p className="mb-2 text-xs text-slate-500">ระบบจะผูกวิดีโอที่มีอยู่แล้วใน Vimeo โดยไม่อัปโหลดไฟล์ใหม่</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={vimeoInput}
                                onChange={(event) => {
                                    setVimeoInput(event.target.value);
                                    setResolvedVideo(null);
                                }}
                                disabled={isBusy}
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-100"
                                placeholder="เช่น https://vimeo.com/123456789 หรือ 123456789"
                            />
                            <button
                                type="button"
                                onClick={() => void handleResolve()}
                                disabled={!vimeoInput.trim() || isBusy}
                                className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition-all hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isResolving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-300 border-t-sky-700" /> : <Search size={16} />}
                                ตรวจสอบ
                            </button>
                        </div>
                    </div>

                    {resolvedVideo && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                                    <Video size={22} className="text-emerald-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-slate-800">{resolvedVideo.name || `Vimeo ${resolvedVideo.resourceId}`}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <Clock size={12} />
                                    {formatDurationLabel(resolvedVideo.duration)}
                                </span>
                                <span>ID: {resolvedVideo.resourceId}</span>
                                <span className={`rounded-full border px-2 py-0.5 font-semibold ${
                                    resolvedVideoIsPlayable
                                        ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                                        : 'border-amber-200 bg-amber-100 text-amber-700'
                                }`}>
                                    {resolvedVideoIsPlayable ? 'พร้อมใช้งาน' : 'อาจยังอยู่ระหว่างประมวลผล'}
                                </span>
                                <span className={`rounded-full border px-2 py-0.5 font-semibold ${
                                    resolvedVideo.playbackUrl
                                        ? 'border-sky-200 bg-sky-100 text-sky-700'
                                        : 'border-amber-200 bg-amber-100 text-amber-700'
                                }`}>
                                    {resolvedVideo.playbackUrl ? 'มี playback URL' : 'ยังไม่มี playback URL'}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-semibold text-slate-600">
                                    view: {resolvedVideo.privacyView || '-'}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-semibold text-slate-600">
                                    embed: {resolvedVideo.privacyEmbed || '-'}
                                </span>
                            </div>
                            {resolvedVideo.sourceUrl && (
                                <a
                                    href={resolvedVideo.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
                                >
                                    <LinkIcon size={12} />
                                    เปิดวิดีโอที่ Vimeo
                                </a>
                            )}
                                </div>
                                <CheckCircle size={18} className="mt-1 flex-shrink-0 text-emerald-500" />
                            </div>

                            {resolvedVideoNeedsProcessing && (
                                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                    วิดีโอนี้ยังไม่พร้อมสำหรับ playback ทันที ระบบสามารถนำเข้าไปผูกกับคอร์สหรือบทเรียนได้ แต่การพรีวิวจะใช้ได้หลังจาก Vimeo ประมวลผลเสร็จและมี playback URL แล้ว
                                </div>
                            )}

                            <div className="mt-3">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">ชื่อวิดีโอในระบบ</label>
                                <input
                                    type="text"
                                    value={videoName}
                                    onChange={(event) => setVideoName(event.target.value)}
                                    disabled={isBusy}
                                    className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100"
                                    placeholder={resolvedVideo.name || 'ใช้ชื่อจาก Vimeo หากเว้นว่าง'}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => void handleImport()}
                            disabled={!resolvedVideo || isBusy}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LinkIcon size={16} />
                            นำวิดีโอนี้ไปใช้
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
