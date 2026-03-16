// Videos feature types - Aligned with Database Schema

export enum VideoProvider {
    VIMEO = 'VIMEO',
}

export interface Video {
    id: number;
    name: string; // Admin internal name / title
    provider: VideoProvider;
    resourceId: string; // Video ID from provider (externalId)
    duration: number; // Seconds
    categoryId?: string; // Course category
    createdAt: string;
}

export interface VideoStats {
    total: number;
    totalDuration?: number; // Total seconds
    totalDurationHours?: number; // Total hours (computed)
    byProvider?: {
        vimeo: number;
    };
    byCategory?: Record<string, number>; // count by category ID
}

export interface VideosData {
    videos: Video[];
    stats: VideoStats;
}

// Form input interfaces
export interface CreateVideoInput {
    name: string;
    provider: VideoProvider;
    resourceId: string;
    duration?: number;
    categoryId?: string;
}

export interface UpdateVideoInput {
    name?: string;
    provider?: VideoProvider;
    resourceId?: string;
    duration?: number;
    categoryId?: string;
}
