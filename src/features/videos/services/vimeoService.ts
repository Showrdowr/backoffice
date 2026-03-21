import * as tus from 'tus-js-client';
import { ApiError, apiClient } from '@/services/api/client';
import type { Video, VideoStatus } from '../types';

export interface VimeoUploadResult extends Video {
    videoId: string;
    persistedVideoId: number;
    thumbnailUrl?: string;
}

export interface UploadProgress {
    percent: number;
    status: 'idle' | 'uploading' | 'processing' | 'complete' | 'failed' | 'canceled';
}

export interface ResolvedVimeoVideo {
    resourceId: string;
    videoUri: string;
    name: string | null;
    duration: number | null;
    sourceUrl: string | null;
    playbackUrl: string | null;
    privacyView: string | null;
    privacyEmbed: string | null;
    uploadStatus: string | null;
    transcodeStatus: string | null;
}

type InitiateUploadResponse = {
    uploadSessionId: string;
    resourceId: string;
    videoUri: string;
    provider: 'VIMEO';
    uploadStrategy: 'tus';
    uploadLink: string;
};

type VideoApiResponse = {
    id: number;
    name: string | null;
    provider: string;
    resourceId: string;
    duration: number | null;
    playbackUrl?: string | null;
    status: VideoStatus;
    createdAt: string | null;
    updatedAt: string | null;
    usage?: {
        previewCourseCount?: number;
        lessonUsageCount?: number;
        totalUsageCount?: number;
    } | null;
};

function buildClientError(message: string, code?: string) {
    return Object.assign(new Error(message), { code });
}

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
            previewCourseCount: Number(video.usage?.previewCourseCount ?? 0),
            lessonUsageCount: Number(video.usage?.lessonUsageCount ?? 0),
            totalUsageCount: Number(video.usage?.totalUsageCount ?? 0),
        },
    };
}

export function getVimeoErrorMessage(error: unknown, fallback = 'เกิดข้อผิดพลาดเกี่ยวกับวิดีโอ กรุณาลองใหม่อีกครั้ง') {
    if (error instanceof ApiError) {
        switch (error.code) {
            case 'VIMEO_INVALID_URL':
                return 'ลิงก์หรือ Video ID ของ Vimeo ไม่ถูกต้อง';
            case 'VIMEO_NOT_CONFIGURED':
                return 'ระบบ Vimeo ยังไม่ได้ตั้งค่า access token';
            case 'VIMEO_EMBED_ORIGINS_NOT_CONFIGURED':
                return 'ระบบ Vimeo ยังไม่ได้ตั้งค่าโดเมนที่อนุญาตให้ฝังวิดีโอ';
            case 'VIMEO_RESOLVE_FAILED':
                return 'ไม่พบวิดีโอนี้ใน Vimeo หรือ token ของระบบไม่มีสิทธิ์เข้าถึง';
            case 'VIMEO_INITIATE_FAILED':
                return 'เริ่มต้นอัปโหลดวิดีโอไปยัง Vimeo ไม่สำเร็จ';
            case 'VIMEO_COMPLETE_FAILED':
            case 'VIMEO_UPLOAD_FAILED':
                return 'อัปโหลดเสร็จแล้วแต่ระบบบันทึกข้อมูลวิดีโอไม่สำเร็จ';
            case 'VIMEO_IMPORT_FAILED':
                return 'นำเข้าวิดีโอจาก Vimeo ไม่สำเร็จ';
            case 'VIDEO_IN_USE':
                return 'วิดีโอนี้กำลังถูกใช้งานอยู่ จึงยังไม่สามารถลบได้';
            default:
                return error.message || fallback;
        }
    }

    if (error instanceof Error) {
        const code = (error as Error & { code?: string }).code;
        if (code === 'UPLOAD_CANCELED') {
            return 'ยกเลิกการอัปโหลดแล้ว';
        }
        return error.message || fallback;
    }

    return fallback;
}

function tusUpload(
    uploadLink: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void,
): { promise: Promise<void>; abort: () => void } {
    let abortFn: (() => void) | null = null;

    const promise = new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
            uploadUrl: uploadLink,
            endpoint: uploadLink,
            retryDelays: [0, 1000, 3000, 5000],
            chunkSize: 64 * 1024 * 1024,
            metadata: {
                filename: file.name,
                filetype: file.type || 'video/mp4',
            },
            onProgress(bytesUploaded, bytesTotal) {
                const percent = Math.min(95, Math.round((bytesUploaded / bytesTotal) * 95));
                onProgress?.({ percent, status: 'uploading' });
            },
            onSuccess() {
                resolve();
            },
            onError(error) {
                onProgress?.({ percent: 0, status: 'failed' });
                reject(buildClientError(error.message || 'อัปโหลดวิดีโอไปยัง Vimeo ไม่สำเร็จ', 'UPLOAD_FAILED'));
            },
        });

        abortFn = () => {
            upload.abort(true);
            onProgress?.({ percent: 0, status: 'canceled' });
            reject(buildClientError('อัปโหลดถูกยกเลิก', 'UPLOAD_CANCELED'));
        };

        upload.start();
    });

    return { promise, abort: () => abortFn?.() };
}

const VIMEO_URL_PATTERNS = [
    /vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/[^/]+\/(\d+)/,
    /vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
    /vimeo\.com\/showcase\/[^/]+\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/(\d+)/,
];

let activeAbort: (() => void) | null = null;

export const vimeoService = {
    async uploadVideo(
        file: File,
        onProgress?: (progress: UploadProgress) => void,
        customName?: string
    ): Promise<VimeoUploadResult> {
        const resolvedName = customName?.trim() || file.name.replace(/\.[^/.]+$/, '');

        const initiateResponse = await apiClient.post<InitiateUploadResponse>('/videos/vimeo/initiate', {
            fileName: resolvedName || file.name,
            fileSize: file.size,
            mimeType: file.type || 'video/mp4',
        });

        const uploadSession = initiateResponse.data;

        const { promise, abort } = tusUpload(uploadSession.uploadLink, file, onProgress);
        activeAbort = abort;

        try {
            await promise;
        } finally {
            activeAbort = null;
        }

        onProgress?.({ percent: 97, status: 'processing' });

        try {
            const completeResponse = await apiClient.post<{
                id: number;
                resourceId: string;
                duration: number;
                name: string | null;
                provider: string;
                status: VideoStatus;
                createdAt: string | null;
                updatedAt: string | null;
                usage?: {
                    previewCourseCount?: number;
                    lessonUsageCount?: number;
                    totalUsageCount?: number;
                } | null;
            }>('/videos/vimeo/complete', {
                uploadSessionId: uploadSession.uploadSessionId,
                name: resolvedName,
                provider: uploadSession.provider,
                resourceId: uploadSession.resourceId,
                videoUri: uploadSession.videoUri,
            });

            onProgress?.({ percent: 100, status: 'complete' });

            const video = normalizeVideo(completeResponse.data);
            return {
                ...video,
                videoId: completeResponse.data.resourceId,
                persistedVideoId: completeResponse.data.id,
                thumbnailUrl: undefined,
            };
        } catch (error) {
            onProgress?.({ percent: 97, status: 'failed' });
            throw error;
        }
    },

    cancelUpload() {
        activeAbort?.();
        activeAbort = null;
    },

    async resolveExistingVideo(input: string): Promise<ResolvedVimeoVideo> {
        const resourceId = this.parseVimeoUrl(input);
        const payload = resourceId ? { resourceId } : { url: input };

        const response = await apiClient.post<ResolvedVimeoVideo>('/videos/vimeo/resolve', payload);
        return response.data;
    },

    async importExistingVideo(input: string, name?: string): Promise<Video> {
        const resourceId = this.parseVimeoUrl(input);
        const payload = resourceId
            ? { resourceId, ...(name ? { name } : {}) }
            : { url: input, ...(name ? { name } : {}) };

        const response = await apiClient.post<VideoApiResponse>('/videos/vimeo/import', payload);
        return normalizeVideo(response.data);
    },

    parseVimeoUrl(url: string): string | null {
        if (/^\d+$/.test(url.trim())) {
            return url.trim();
        }

        for (const pattern of VIMEO_URL_PATTERNS) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    },
};
