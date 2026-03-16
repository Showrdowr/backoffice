// Mock Vimeo Service - จำลอง Vimeo API
// TODO: เปลี่ยนเป็น Vimeo API จริงทีหลัง

import { VideoProvider } from '@/features/videos/types';

export interface VimeoUploadResult {
    videoId: string;
    duration: number;
    thumbnailUrl?: string;
}

export interface UploadProgress {
    percent: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
}

// Simulate upload delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const vimeoService = {
    /**
     * Mock upload to Vimeo
     * In production: use Vimeo tus-js-client for resumable uploads
     */
    async uploadVideo(
        file: File,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<VimeoUploadResult> {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            await delay(200);
            onProgress?.({
                percent: i,
                status: i < 100 ? 'uploading' : 'processing'
            });
        }

        // Simulate processing
        await delay(500);

        // Generate mock Vimeo video ID
        const mockVideoId = `${Date.now()}`;

        // Mock duration based on file size (1MB = ~10 seconds)
        const mockDuration = Math.round(file.size / 100000);

        onProgress?.({ percent: 100, status: 'complete' });

        return {
            videoId: mockVideoId,
            duration: mockDuration > 0 ? mockDuration : 300, // minimum 5 minutes
            thumbnailUrl: undefined, // Vimeo generates thumbnails automatically
        };
    },

    /**
     * Get video info from Vimeo
     * In production: call Vimeo API /videos/{video_id}
     */
    async getVideoInfo(videoId: string): Promise<{
        duration: number;
        thumbnailUrl?: string;
        title?: string;
    }> {
        // Mock response
        return {
            duration: 1800, // 30 minutes
            thumbnailUrl: `https://i.vimeocdn.com/video/${videoId}_640x360.jpg`,
            title: 'Video from Vimeo',
        };
    },

    /**
     * Parse Vimeo URL to get video ID
     * Supports: https://vimeo.com/123456789, https://player.vimeo.com/video/123456789
     */
    parseVimeoUrl(url: string): string | null {
        const patterns = [
            /vimeo\.com\/(\d+)/,
            /player\.vimeo\.com\/video\/(\d+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    },
};
