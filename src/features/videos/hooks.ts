'use client';

import { useCallback, useEffect, useState } from 'react';
import { videoService } from './services/videoService';
import type { Video, VideoListFilters, VideosData } from './types';

export function useVideos(filters?: VideoListFilters) {
    const [data, setData] = useState<VideosData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const videosData = await videoService.getVideos(filters);
            setData(videosData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load videos'));
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const syncVideoStatus = async (id: number) => {
        const video = await videoService.syncVideoStatus(id);
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
        pagination: data?.pagination,
        isLoading,
        error,
        refresh: fetchData,
        getVideo: (id: number) => videoService.getVideo(id),
        syncVideoStatus,
        deleteVideo,
    };
}

export function useVideo(id: number) {
    const [video, setVideo] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        if (!id) {
            return;
        }

        void fetchData();
    }, [fetchData, id]);

    const syncVideoStatus = async () => {
        const updated = await videoService.syncVideoStatus(id);
        setVideo(updated);
        return updated;
    };

    return {
        video,
        isLoading,
        error,
        refresh: fetchData,
        syncVideoStatus,
    };
}
