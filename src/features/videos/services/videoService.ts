import { apiClient } from '@/services/api/client';
import type { Video, VideoListFilters, VideosData } from '../types';

type VideoApiResponse = {
    id: number;
    name: string | null;
    provider: string;
    resourceId: string;
    duration: number | null;
    playbackUrl?: string | null;
    status: Video['status'];
    createdAt: string | null;
    updatedAt: string | null;
    usage?: {
        previewCourseCount?: number;
        lessonUsageCount?: number;
        totalUsageCount?: number;
        previewCount?: number;
        lessonCount?: number;
    } | null;
};

type VideosApiResponse = {
    videos: VideoApiResponse[];
    stats: VideosData['stats'];
    pagination: VideosData['pagination'];
};

function normalizeVideo(video: VideoApiResponse): Video {
    return {
        id: video.id,
        name: video.name,
        provider: video.provider as Video['provider'],
        resourceId: video.resourceId,
        duration: video.duration,
        playbackUrl: video.playbackUrl ?? null,
        status: video.status ?? 'PROCESSING',
        createdAt: video.createdAt ?? null,
        updatedAt: video.updatedAt ?? null,
        usage: {
            previewCourseCount: Number(video.usage?.previewCourseCount ?? video.usage?.previewCount ?? 0),
            lessonUsageCount: Number(video.usage?.lessonUsageCount ?? video.usage?.lessonCount ?? 0),
            totalUsageCount: Number(
                video.usage?.totalUsageCount
                    ?? Number(video.usage?.previewCourseCount ?? video.usage?.previewCount ?? 0)
                    + Number(video.usage?.lessonUsageCount ?? video.usage?.lessonCount ?? 0)
            ),
        },
    };
}

function buildVideosQuery(filters?: VideoListFilters) {
    const params = new URLSearchParams();

    if (filters?.search?.trim()) {
        params.set('search', filters.search.trim());
    }

    if (filters?.provider) {
        params.set('provider', filters.provider);
    }

    if (filters?.status) {
        params.set('status', filters.status);
    }

    if (typeof filters?.used === 'boolean') {
        params.set('used', String(filters.used));
    }

    if (filters?.page && filters.page > 0) {
        params.set('page', String(filters.page));
    }

    if (filters?.limit && filters.limit > 0) {
        params.set('limit', String(filters.limit));
    }

    const query = params.toString();
    return query ? `/videos?${query}` : '/videos';
}

export const videoService = {
    async getVideos(filters?: VideoListFilters): Promise<VideosData> {
        const response = await apiClient.get<VideosApiResponse>(buildVideosQuery(filters));
        return {
            videos: Array.isArray(response.data?.videos) ? response.data.videos.map(normalizeVideo) : [],
            stats: response.data?.stats ?? {
                total: 0,
                totalDurationSeconds: 0,
                totalDurationHours: 0,
                byProvider: {},
                byStatus: {},
            },
            pagination: response.data?.pagination ?? {
                page: 1,
                limit: filters?.limit ?? 20,
                total: 0,
                totalPages: 1,
            },
        };
    },

    async getVideo(id: number): Promise<Video> {
        const response = await apiClient.get<VideoApiResponse>(`/videos/${id}`);
        return normalizeVideo(response.data);
    },

    async syncVideoStatus(id: number): Promise<Video> {
        const response = await apiClient.post<VideoApiResponse>(`/videos/${id}/sync-status`);
        return normalizeVideo(response.data);
    },

    async deleteVideo(id: number): Promise<void> {
        await apiClient.delete(`/videos/${id}`);
    },
};
