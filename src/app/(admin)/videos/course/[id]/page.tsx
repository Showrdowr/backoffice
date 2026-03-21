'use client';

import { use, useEffect, useMemo, useRef, useState } from 'react';
import type Player from '@vimeo/player';
import { ArrowLeft, AlertCircle, BookOpen, Clock, ListVideo, Play, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { courseService } from '@/features/courses/services/courseService';
import type { Course, Lesson } from '@/features/courses/types';
import type { Video } from '@/features/videos/types';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { videoService } from '@/features/videos/services/videoService';

interface CoursePlayerPageProps {
    params: Promise<{ id: string }>;
}

type CourseVideoItem = {
    key: string;
    label: string;
    description: string;
    video: Video;
    lessonId?: number;
};

function formatDuration(seconds: number | null | undefined) {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds || 0)));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getVideoStatusMessage(video: Video) {
    if (video.status === 'READY' && Number(video.duration ?? 0) <= 0) {
        return 'วิดีโอนี้ยังประมวลผลไม่เสร็จ จึงยังเล่นไม่ได้ในขณะนี้';
    }

    switch (video.status) {
        case 'READY':
            return '';
        case 'FAILED':
            return 'วิดีโอนี้มีปัญหาและยังไม่สามารถเล่นได้ กรุณาซิงก์สถานะใหม่หรือแก้ไขวิดีโอจากต้นทาง';
        default:
            return 'วิดีโอนี้ยังอยู่ระหว่างประมวลผลจาก Vimeo จึงยังเล่นไม่ได้ในขณะนี้';
    }
}

function isVideoReadyForPlayback(video: Video) {
    return video.status === 'READY' && Number(video.duration ?? 0) > 0 && Boolean(video.playbackUrl);
}

function InlineVimeoPlayer({
    video,
    onSync,
    isSyncing,
}: {
    video: Video;
    onSync: () => void;
    isSyncing: boolean;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<Player | null>(null);
    const [playerError, setPlayerError] = useState('');
    const [isLoading, setIsLoading] = useState(isVideoReadyForPlayback(video));

    useEffect(() => {
        let destroyed = false;
        let timeoutId: number | null = null;

        const finishWithError = (message: string) => {
            if (destroyed) {
                return;
            }

            setPlayerError(message);
            setIsLoading(false);
        };

        if (!isVideoReadyForPlayback(video)) {
            setPlayerError('');
            setIsLoading(false);
            return;
        }

        setPlayerError('');
        setIsLoading(true);

        (async () => {
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
                    finishWithError('Vimeo ใช้เวลาตอบสนองนานเกินไป กรุณาซิงก์สถานะวิดีโอแล้วลองใหม่');
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

    if (!isVideoReadyForPlayback(video)) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-white">
                <AlertCircle size={40} className={video.status === 'FAILED' ? 'text-red-400' : 'text-amber-300'} />
                <div>
                    <p className="text-lg font-semibold">{video.status === 'FAILED' ? 'วิดีโอนี้มีปัญหา' : 'วิดีโอกำลังประมวลผล'}</p>
                    <p className="mt-2 max-w-xl text-sm text-white/75">{getVideoStatusMessage(video)}</p>
                </div>
                <button
                    type="button"
                    onClick={onSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 disabled:opacity-50"
                >
                    <RefreshCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    ซิงก์สถานะวิดีโอ
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-slate-950">
            <div ref={containerRef} className="h-full w-full" />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 text-sm font-semibold text-white">
                    กำลังโหลดวิดีโอ...
                </div>
            )}
            {playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 px-6 text-center text-sm text-red-200">
                    {playerError}
                </div>
            )}
        </div>
    );
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
    const { id } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [currentItemKey, setCurrentItemKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const courseData = await courseService.getCourse(id);
                setCourse(courseData);
            } catch (fetchError) {
                console.error(fetchError);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์ส');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchCourseData();
    }, [id]);

    const videoItems = useMemo<CourseVideoItem[]>(() => {
        if (!course) {
            return [];
        }

        const items: CourseVideoItem[] = [];

        if (course.previewVideo) {
            items.push({
                key: `preview-${course.previewVideo.id}`,
                label: course.previewVideo.name || 'วิดีโอตัวอย่างคอร์ส',
                description: 'วิดีโอตัวอย่างของคอร์ส',
                video: course.previewVideo,
            });
        }

        (course.lessons || []).forEach((lesson: Lesson, index) => {
            if (!lesson.video) {
                return;
            }

            items.push({
                key: `lesson-${lesson.id}`,
                label: lesson.title,
                description: `บทเรียน ${lesson.sequenceOrder ?? index + 1}`,
                video: lesson.video,
                lessonId: Number(lesson.id),
            });
        });

        return items;
    }, [course]);

    useEffect(() => {
        if (!videoItems.length) {
            setCurrentItemKey(null);
            return;
        }

        if (!currentItemKey || !videoItems.some((item) => item.key === currentItemKey)) {
            setCurrentItemKey(videoItems[0].key);
        }
    }, [currentItemKey, videoItems]);

    const currentItem = useMemo(
        () => videoItems.find((item) => item.key === currentItemKey) || null,
        [currentItemKey, videoItems]
    );

    const refreshCourse = async () => {
        const updatedCourse = await courseService.getCourse(id);
        setCourse(updatedCourse);
        return updatedCourse;
    };

    const handleSyncCurrentVideo = async () => {
        if (!currentItem?.video?.id) {
            return;
        }

        try {
            setActionError('');
            setIsSyncing(true);
            const updatedVideo = await videoService.syncVideoStatus(currentItem.video.id);
            setCourse((currentCourse) => {
                if (!currentCourse) {
                    return currentCourse;
                }

                return {
                    ...currentCourse,
                    previewVideo: currentCourse.previewVideo?.id === updatedVideo.id ? updatedVideo : currentCourse.previewVideo,
                    lessons: (currentCourse.lessons || []).map((lesson) => ({
                        ...lesson,
                        video: lesson.video?.id === updatedVideo.id ? updatedVideo : lesson.video,
                    })),
                };
            });
            await refreshCourse();
        } catch (syncError) {
            setActionError(syncError instanceof Error ? syncError.message : 'ซิงก์สถานะวิดีโอไม่สำเร็จ');
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="กำลังโหลดคอร์ส..." fullScreen />;
    }

    if (error) {
        return <ErrorMessage error={new Error(error)} fullScreen />;
    }

    if (!course) {
        return <ErrorMessage error={new Error('Course not found')} fullScreen />;
    }

    return (
        <div className="flex h-[calc(100vh-100px)] flex-col">
            <div className="mb-6 flex shrink-0 items-center gap-4">
                <Link
                    href="/videos"
                    className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-sky-600"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                        <BookOpen className="text-sky-500" />
                        {course.title}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {(course.lessons || []).length} บทเรียน • {course.enrolledCount ?? course.enrollments ?? 0} ผู้เรียน
                    </p>
                </div>
            </div>

            {actionError && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {actionError}
                </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-black shadow-2xl">
                    {currentItem ? (
                        <>
                            <div className="relative flex-1 bg-black">
                                <InlineVimeoPlayer
                                    video={currentItem.video}
                                    onSync={handleSyncCurrentVideo}
                                    isSyncing={isSyncing}
                                />
                            </div>
                            <div className="shrink-0 bg-slate-900 p-6 text-white">
                                <h2 className="text-xl font-bold">{currentItem.video.name || currentItem.label}</h2>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                    <span className="rounded bg-white/10 px-2 py-0.5 text-white">{currentItem.video.provider}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {formatDuration(currentItem.video.duration)}
                                    </span>
                                    <span>{currentItem.description}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-10 text-slate-500">
                            <ListVideo size={64} className="mb-4 opacity-50" />
                            <p className="text-lg">คอร์สนี้ยังไม่มีวิดีโอที่ผูกไว้</p>
                        </div>
                    )}
                </div>

                <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:w-96">
                    <div className="border-b border-slate-100 bg-slate-50 p-4">
                        <h3 className="flex items-center gap-2 font-bold text-slate-700">
                            <ListVideo size={18} className="text-sky-600" />
                            รายการวิดีโอของคอร์ส
                        </h3>
                    </div>

                    <div className="flex-1 space-y-1 overflow-y-auto p-2">
                        {videoItems.map((item, index) => {
                            const isActive = item.key === currentItem?.key;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setCurrentItemKey(item.key)}
                                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                                        isActive
                                            ? 'border-sky-200 bg-sky-50 shadow-sm'
                                            : 'border-transparent hover:border-slate-100 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                            isActive ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`truncate text-sm font-semibold ${isActive ? 'text-sky-700' : 'text-slate-700'}`}>
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                                                <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-700">
                                                    {item.video.provider}
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 font-semibold ${
                                                    item.video.status === 'READY'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : item.video.status === 'FAILED'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {item.video.status === 'READY'
                                                        ? 'พร้อมใช้งาน'
                                                        : item.video.status === 'FAILED'
                                                            ? 'มีปัญหา'
                                                            : 'กำลังประมวลผล'}
                                                </span>
                                                <span className="text-slate-400">{formatDuration(item.video.duration)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {videoItems.length === 0 && (
                            <div className="py-8 text-center text-sm text-slate-400">
                                ไม่มีวิดีโอในคอร์สนี้
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
