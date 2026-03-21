'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import type Player from '@vimeo/player';
import type { Video } from '../types';

interface VimeoPlayerPreviewProps {
    video: Video;
    onClose: () => void;
}

function getBlockedPreviewMessage(video: Video) {
    if (video.status === 'FAILED') {
        return 'วิดีโอนี้มีปัญหา จึงยังไม่สามารถพรีวิวได้';
    }

    return 'วิดีโอนี้ยังประมวลผลไม่เสร็จ จึงยังเปิดพรีวิวไม่ได้';
}

export function VimeoPlayerPreview({ video, onClose }: VimeoPlayerPreviewProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<Player | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let destroyed = false;
        let timeoutId: number | null = null;

        const finishWithError = (message: string) => {
            if (destroyed) {
                return;
            }

            setError(message);
            setIsLoading(false);
        };

        (async () => {
            if (video.status !== 'READY' || Number(video.duration ?? 0) <= 0 || !video.playbackUrl) {
                setIsLoading(false);
                setError(
                    !video.playbackUrl && video.status === 'READY'
                        ? 'วิดีโอนี้ยังไม่มี playback URL กรุณาซิงก์สถานะใหม่'
                        : getBlockedPreviewMessage(video),
                );
                return;
            }

            try {
                const { default: VimeoPlayer } = await import('@vimeo/player');
                if (destroyed || !containerRef.current) {
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const player = new VimeoPlayer(containerRef.current, {
                    url: video.playbackUrl,
                    dnt: true,
                    title: false,
                    byline: false,
                    portrait: false,
                    responsive: true,
                } as any);

                playerRef.current = player;

                timeoutId = window.setTimeout(() => {
                    finishWithError('Vimeo ใช้เวลาตอบสนองนานเกินไป กรุณาซิงก์สถานะวิดีโอหรือลองใหม่อีกครั้ง');
                }, 10000);

                player.on('error', () => {
                    finishWithError('ไม่สามารถโหลดวิดีโอนี้จาก Vimeo ได้');
                });

                await player.ready();
                await player.getDuration().catch(() => Number(video.duration ?? 0));

                if (destroyed) {
                    return;
                }

                if (timeoutId) {
                    window.clearTimeout(timeoutId);
                }
                setIsLoading(false);
            } catch {
                finishWithError('ไม่สามารถเริ่มต้น Vimeo player ได้');
            }
        })();

        return () => {
            destroyed = true;
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            if (playerRef.current) {
                void playerRef.current.destroy().catch(() => undefined);
                playerRef.current = null;
            }
        };
    }, [video.duration, video.playbackUrl, video.status]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">ดูตัวอย่างวิดีโอ</h3>
                        <p className="mt-1 text-sm text-slate-500">{video.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative bg-slate-950">
                    <div className="aspect-video w-full">
                        <div ref={containerRef} className="h-full w-full" />
                    </div>

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65">
                            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                                <Loader2 size={16} className="animate-spin" />
                                กำลังโหลดวิดีโอ...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 p-4">
                            <div className="max-w-md rounded-2xl border border-red-200 bg-white px-5 py-4 text-sm text-red-700 shadow-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        ปิดหน้าต่าง
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500">
                    <span>วิดีโอจาก Vimeo</span>
                    <span>รหัสวิดีโอ {video.resourceId}</span>
                </div>
            </div>
        </div>
    );
}
