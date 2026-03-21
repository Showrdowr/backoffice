'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Video as VideoType } from '@/features/videos/types';
import { VideoPickerPanel } from './VideoPickerPanel';

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: (video: VideoType) => void;
}

export function VideoUploadModal({ isOpen, onClose, onUploadComplete }: VideoUploadModalProps) {
    const [isBusy, setIsBusy] = useState(false);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-slide-in">
                <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white">
                    <div>
                        <h3 className="text-2xl font-bold">เพิ่มวิดีโอ</h3>
                        <p className="mt-1 text-sm text-rose-100">เพิ่มวิดีโอใหม่เข้าคลังของคอร์ส ทั้งแบบอัปโหลดจากเครื่องหรือผูกจาก Vimeo เดิม</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isBusy}
                        className="rounded-xl p-2 transition-all hover:bg-white/20 disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <VideoPickerPanel
                        modes={['upload', 'existing']}
                        availableVideos={[]}
                        onVideoReady={(video) => {
                            onUploadComplete(video);
                            onClose();
                        }}
                        onBusyChange={setIsBusy}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 rounded-b-2xl bg-slate-50 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isBusy}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold transition-all hover:bg-white disabled:opacity-50"
                    >
                        ปิด
                    </button>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white opacity-90">
                        <Plus size={16} />
                        เพิ่มแล้วจะพร้อมให้เลือกใช้ทันที
                    </div>
                </div>
            </div>
        </div>
    );
}
