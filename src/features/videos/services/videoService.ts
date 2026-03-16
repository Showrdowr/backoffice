import type { Video, VideoStats, VideosData, CreateVideoInput, UpdateVideoInput } from '../types';
import { VideoProvider } from '../types';

export const videoService = {
    /**
     * Fetch all videos with stats
     */
    async getVideos(): Promise<VideosData> {
        try {
            // In production: const response = await apiClient.get<VideosData>('/videos');

            // Mock data
            return {
                videos: [
                    {
                        id: 1,
                        name: 'การดูแลผู้ป่วยเบื้องต้น',
                        provider: VideoProvider.VIMEO,
                        resourceId: '987654321',
                        duration: 1800,
                        categoryId: '1',
                        createdAt: '2024-01-15',
                    },
                    {
                        id: 2,
                        name: 'เทคนิคการให้คำปรึกษา',
                        provider: VideoProvider.VIMEO,
                        resourceId: '987654322',
                        duration: 2400,
                        categoryId: '1',
                        createdAt: '2024-01-20',
                    },
                    {
                        id: 3,
                        name: 'กฎหมายเภสัชกรรม 2024',
                        provider: VideoProvider.VIMEO,
                        resourceId: '987654323',
                        duration: 3600,
                        categoryId: '2',
                        createdAt: '2024-02-01',
                    },
                    {
                        id: 4,
                        name: 'สมุนไพรไทยกับการรักษา',
                        provider: VideoProvider.VIMEO,
                        resourceId: '987654324',
                        duration: 2100,
                        categoryId: '3',
                        createdAt: '2024-02-10',
                    },
                ],
                stats: {
                    total: 4,
                    totalDurationHours: 3,
                    byProvider: {
                        vimeo: 4,
                    },
                },
            };
        } catch (error) {
            console.error('Failed to fetch videos:', error);
            throw error;
        }
    },

    /**
     * Fetch videos by category
     */
    async getVideosByCategory(categoryId: string): Promise<Video[]> {
        try {
            // In production: const response = await apiClient.get<Video[]>(`/videos?categoryId=${categoryId}`);
            const data = await this.getVideos();
            return data.videos.filter(v => v.categoryId === categoryId);
        } catch (error) {
            console.error('Failed to fetch videos by category:', error);
            throw error;
        }
    },

    /**
     * Get a single video by ID
     */
    async getVideo(id: number): Promise<Video> {
        try {
            // In production: const response = await apiClient.get<Video>(`/videos/${id}`);

            // Mock data
            return {
                id,
                name: 'การดูแลผู้ป่วยเบื้องต้น',
                provider: VideoProvider.VIMEO,
                resourceId: '987654321',
                duration: 1800,
                categoryId: '1',
                createdAt: '2024-01-15',
            };
        } catch (error) {
            console.error('Failed to fetch video:', error);
            throw error;
        }
    },

    /**
     * Create a new video
     */
    async createVideo(data: CreateVideoInput): Promise<Video> {
        try {
            // In production: const response = await apiClient.post<Video>('/videos', data);
            console.log('Create video:', data);
            return {
                id: Date.now(),
                name: data.name,
                provider: data.provider,
                resourceId: data.resourceId,
                duration: data.duration ?? 0,
                categoryId: data.categoryId,
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Failed to create video:', error);
            throw error;
        }
    },

    /**
     * Update a video
     */
    async updateVideo(id: number, data: UpdateVideoInput): Promise<Video> {
        try {
            // In production: const response = await apiClient.put<Video>(`/videos/${id}`, data);
            console.log('Update video:', id, data);
            return {
                id,
                name: data.name || '',
                provider: data.provider || VideoProvider.VIMEO,
                resourceId: data.resourceId || '',
                duration: data.duration ?? 0,
                categoryId: data.categoryId,
                createdAt: '2024-01-15',
            };
        } catch (error) {
            console.error('Failed to update video:', error);
            throw error;
        }
    },

    /**
     * Delete a video
     */
    async deleteVideo(id: number): Promise<void> {
        try {
            // In production: await apiClient.delete(`/videos/${id}`);
            console.log('Delete video:', id);
        } catch (error) {
            console.error('Failed to delete video:', error);
            throw error;
        }
    },
};
