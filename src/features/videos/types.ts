// Videos feature types - Aligned with Database Schema

export enum VideoProvider {
    VIMEO = 'VIMEO',
}

export type VideoStatus = 'PROCESSING' | 'READY' | 'FAILED';

export interface VideoUsage {
    previewCourseCount: number;
    lessonUsageCount: number;
    totalUsageCount: number;
}

export interface Video {
    id: number;
    name: string | null;
    provider: VideoProvider;
    resourceId: string;
    duration: number | null;
    playbackUrl: string | null;
    status: VideoStatus;
    createdAt: string | null;
    updatedAt: string | null;
    usage: VideoUsage;
}

export interface VideoStats {
    total: number;
    totalDurationSeconds: number;
    totalDurationHours: number;
    byProvider: Record<string, number>;
    byStatus: Record<string, number>;
}

export interface VideoPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface VideoListFilters {
    search?: string;
    provider?: VideoProvider;
    status?: VideoStatus;
    used?: boolean;
    page?: number;
    limit?: number;
}

export interface VideosData {
    videos: Video[];
    stats: VideoStats;
    pagination: VideoPagination;
}
