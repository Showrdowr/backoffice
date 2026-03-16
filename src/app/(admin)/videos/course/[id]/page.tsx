'use client';

import { use, useState, useEffect } from 'react';
import { courseService } from '@/features/courses/services/courseService';
import { videoService } from '@/features/videos/services/videoService';
import type { Video } from '@/features/videos/types';
import type { Lesson } from '@/features/courses/types';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { ArrowLeft, Play, Clock, ListVideo, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Local type definitions for this page
interface LessonWithVideo extends Lesson {
    video?: Video;
}

interface CourseWithDetails {
    id: number | string;
    title: string;
    categoryId?: number;
    lessonsCount?: number;
    lessons?: Lesson[] | number;
    lessonsData?: LessonWithVideo[];
    enrollments?: number;
    previewVideo?: Video;
}

interface CoursePlayerPageProps {
    params: Promise<{ id: string }>;
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
    const { id } = use(params);

    const [course, setCourse] = useState<CourseWithDetails | null>(null);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock lesson videos
    const [lessonVideos, setLessonVideos] = useState<Map<number, Video>>(new Map());

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseData = await courseService.getCourse(id);
                setCourse(courseData);

                // Default to preview video if available
                if (courseData.previewVideo) {
                    setCurrentVideo(courseData.previewVideo);
                }

                // Try to fetch video details for lessons
                if (courseData.lessonsData) {
                    const videoMap = new Map<number, Video>();
                    for (const lesson of courseData.lessonsData) {
                        if (lesson.videoId) {
                            try {
                                const v = await videoService.getVideo(lesson.videoId);
                                videoMap.set(Number(lesson.id), v);
                            } catch (e) {
                                console.warn(`Could not load video for lesson ${lesson.id}`, e);
                            }
                        }
                    }
                    setLessonVideos(videoMap);
                }

            } catch (err) {
                console.error(err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์ส');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleLessonSelect = (lesson: LessonWithVideo) => {
        const video = lessonVideos.get(Number(lesson.id));
        if (video) {
            setCurrentVideo(video);
        } else {
            alert('วิดีโอสำหรับบทเรียนนี้ยังไม่พร้อมใช้งาน');
        }
    };

    if (isLoading) return <LoadingSpinner message="กำลังโหลดคอร์ส..." fullScreen />;
    if (error) return <ErrorMessage error={new Error(error)} fullScreen />;
    if (!course) return <ErrorMessage error={new Error('Course not found')} fullScreen />;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <Link
                    href={`/videos/category/${course.categoryId || '1'}`}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-sky-600"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-sky-500" />
                        {course.title}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {course.lessonsCount || (Array.isArray(course.lessons) ? course.lessons.length : course.lessons) || 0} บทเรียน • {course.enrollments} ผู้เรียน
                    </p>
                </div>
            </div>

            {/* Content Layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Main Video Player Area */}
                <div className="flex-1 flex flex-col min-h-0 bg-black rounded-2xl overflow-hidden shadow-2xl">
                    {currentVideo ? (
                        <>
                            <div className="flex-1 relative bg-black">
                                <iframe
                                    src={`https://player.vimeo.com/video/${currentVideo.resourceId}?autoplay=1`}
                                    className="w-full h-full absolute inset-0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title={currentVideo.name}
                                />
                            </div>
                            <div className="p-6 bg-slate-900 text-white shrink-0">
                                <h2 className="text-xl font-bold mb-2">{currentVideo.name}</h2>
                                <div className="flex items-center gap-4 text-slate-400 text-sm">
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-white">
                                        Vimeo
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {Math.floor(currentVideo.duration / 60)} นาที
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-10">
                            <ListVideo size={64} className="mb-4 opacity-50" />
                            <p className="text-lg">เลือกรายการเพื่อรับชม</p>
                        </div>
                    )}
                </div>

                {/* Playlist Sidebar */}
                <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0 overflow-hidden">

                    {/* Section 1: Video Preview */}
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <Play size={18} className="text-sky-600" />
                            Video Preview
                        </h3>
                    </div>
                    {course.previewVideo && (
                        <button
                            onClick={() => setCurrentVideo(course.previewVideo!)}
                            className={`w-full text-left p-4 border-b border-slate-100 transition-all flex gap-3 group ${currentVideo?.id === course.previewVideo.id
                                ? 'bg-sky-50'
                                : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className="shrink-0 w-24 h-16 bg-slate-200 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                    <Play size={20} className="text-white fill-white" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`font-semibold text-sm line-clamp-2 ${currentVideo?.id === course.previewVideo.id ? 'text-sky-700' : 'text-slate-700'
                                    }`}>
                                    {course.previewVideo.name}
                                </p>
                                <span className="text-xs text-slate-400 mt-1 block">
                                    {Math.floor(course.previewVideo.duration / 60)} นาที
                                </span>
                            </div>
                        </button>
                    )}

                    {/* Section 2: Lessons */}
                    <div className="p-4 bg-slate-50 border-b border-slate-100 mt-2">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <ListVideo size={18} className="text-sky-600" />
                            Lessons (บทเรียน)
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {course.lessonsData?.map((lesson, index) => {
                            const lessonVideo = lessonVideos.get(Number(lesson.id));
                            const isActive = currentVideo?.id === lessonVideo?.id;

                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => handleLessonSelect(lesson)}
                                    disabled={!lessonVideo}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex gap-3 group ${isActive
                                        ? 'bg-sky-50 border-sky-100 shadow-sm'
                                        : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                                        } border ${!lessonVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isActive
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
                                        }`}>
                                        {isActive ? <Play size={12} fill="currentColor" /> : index + 1}
                                    </div>

                                    <div className="min-w-0">
                                        <p className={`font-semibold text-sm truncate ${isActive ? 'text-sky-700' : 'text-slate-700'
                                            }`}>
                                            {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock size={12} />
                                                {lesson.duration || '00:00'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {(!course.lessonsData || course.lessonsData.length === 0) && (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                ไม่มีบทเรียน
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
