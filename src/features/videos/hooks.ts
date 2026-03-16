// Videos Feature Hooks
'use client';

import { useState, useEffect, useCallback } from 'react';
import { videoService } from './services/videoService';
import type { Video, VideosData, CreateVideoInput, UpdateVideoInput } from './types';

export function useVideos() {
    const [data, setData] = useState<VideosData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const videosData = await videoService.getVideos();
            setData(videosData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load videos'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createVideo = async (input: CreateVideoInput) => {
        const video = await videoService.createVideo(input);
        await fetchData();
        return video;
    };

    const deleteVideo = async (id: number) => {
        await videoService.deleteVideo(id);
        await fetchData();
    };

    return {
        videos: data?.videos || [],
        stats: data?.stats,
        isLoading,
        error,
        refresh: fetchData,
        getVideo: (id: number) => videoService.getVideo(id),
        getVideosByCategory: (id: string) => videoService.getVideosByCategory(id),
        createVideo,
        deleteVideo,
    };
}

export function useVideo(id: number) {
    const [video, setVideo] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);
                const videoData = await videoService.getVideo(id);
                setVideo(videoData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load video'));
            } finally {
                setIsLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    const updateVideo = async (data: UpdateVideoInput) => {
        const updated = await videoService.updateVideo(id, data);
        setVideo(updated);
        return updated;
    };

    return {
        video,
        isLoading,
        error,
        updateVideo,
    };
}
