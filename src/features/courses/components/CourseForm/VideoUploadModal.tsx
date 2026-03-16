'use client';

import { useState, useRef } from 'react';
import { X, Upload, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { vimeoService, UploadProgress } from '@/features/videos/services/vimeoService';
import type { Video as VideoType } from '@/features/videos/types';
import { VideoProvider } from '@/features/videos/types';

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: (video: VideoType) => void;
}

export function VideoUploadModal({ isOpen, onClose, onUploadComplete }: VideoUploadModalProps) {
    const [videoName, setVideoName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('video/')) {
                setError('กรุณาเลือกไฟล์วิดีโอเท่านั้น');
                return;
            }
            // Validate file size (max 500MB)
            if (file.size > 500 * 1024 * 1024) {
                setError('ไฟล์ใหญ่เกินไป (สูงสุด 500MB)');
                return;
            }
            setSelectedFile(file);
            setError(null);
            // Auto-fill name if empty
            if (!videoName) {
                setVideoName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !videoName.trim()) {
            setError('กรุณากรอกชื่อวิดีโอและเลือกไฟล์');
            return;
        }

        try {
            setError(null);
            const result = await vimeoService.uploadVideo(selectedFile, setProgress);

            // Create video object
            const newVideo: VideoType = {
                id: Date.now(),
                name: videoName.trim(),
                provider: VideoProvider.VIMEO,
                resourceId: result.videoId,
                duration: result.duration,
                createdAt: new Date().toISOString(),
            };

            onUploadComplete(newVideo);
            handleReset();
            onClose();
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองใหม่');
            setProgress(null);
        }
    };

    const handleReset = () => {
        setVideoName('');
        setSelectedFile(null);
        setProgress(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isUploading = progress !== null && progress.status !== 'complete';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-in">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">อัพโหลดวิดีโอ</h3>
                        <p className="text-rose-100 text-sm mt-1">อัพโหลดไฟล์วิดีโอไปยัง Vimeo</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Video Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ชื่อวิดีโอ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={videoName}
                            onChange={(e) => setVideoName(e.target.value)}
                            disabled={isUploading}
                            className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all disabled:bg-slate-100"
                            placeholder="เช่น: บทที่ 1 - บทนำ"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ไฟล์วิดีโอ <span className="text-red-500">*</span>
                        </label>

                        {!selectedFile ? (
                            <div
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className="border-2 border-dashed border-rose-300 rounded-xl p-8 text-center bg-gradient-to-br from-rose-50 to-pink-50 hover:border-rose-400 transition-all cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <Upload size={28} className="text-rose-500" />
                                </div>
                                <p className="text-sm font-semibold text-slate-700 mb-1">คลิกเพื่อเลือกไฟล์</p>
                                <p className="text-xs text-slate-500">รองรับ MP4, MOV, AVI (สูงสุด 500MB)</p>
                            </div>
                        ) : (
                            <div className="border border-rose-200 rounded-xl p-4 bg-rose-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Video size={24} className="text-rose-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 truncate">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                    {!isUploading && (
                                        <button
                                            onClick={handleReset}
                                            className="p-2 hover:bg-rose-100 rounded-lg transition-all"
                                        >
                                            <X size={18} className="text-slate-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Progress Bar */}
                    {progress && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">
                                    {progress.status === 'uploading' && 'กำลังอัพโหลด...'}
                                    {progress.status === 'processing' && 'กำลังประมวลผล...'}
                                    {progress.status === 'complete' && (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <CheckCircle size={16} />
                                            อัพโหลดสำเร็จ!
                                        </span>
                                    )}
                                </span>
                                <span className="font-medium text-rose-600">{progress.percent}%</span>
                            </div>
                            <div className="w-full bg-rose-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.percent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all font-semibold disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || !videoName.trim() || isUploading}
                        className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                กำลังอัพโหลด...
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                อัพโหลด
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
