import { useState, useRef } from 'react';
import { X, FileText, Trash2, Upload, Video, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import type { Video as VideoType } from '@/features/videos/types';
import { vimeoService, type UploadProgress } from '@/features/videos/services/vimeoService';
import { VideoProvider } from '@/features/videos/types';

interface UploadedDocument {
    id: string;
    name: string;
    size: string;
    type: string;
}

import type { VideoQuestion } from '../../types';

interface LessonData {
    title: string;
    videoId: number | null;
    duration: string;
    description: string;
    videoQuestions: VideoQuestion[];
}

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (lesson: LessonData) => void;
    lessonData: LessonData;
    onChange: (data: LessonData) => void;
    availableVideos: VideoType[]; // Videos uploaded for this course
    onVideoUpload: (video: VideoType) => void;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AddLessonModal({ isOpen, onClose, onAdd, lessonData, onChange, availableVideos, onVideoUpload }: AddLessonModalProps) {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [activeTab, setActiveTab] = useState<'select' | 'upload'>('select');

    // Upload State
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const selectedVideo = availableVideos.find(v => v.id === lessonData.videoId);

    const handleVideoSelect = (videoId: number) => {
        const video = availableVideos.find(v => v.id === videoId);
        if (video) {
            onChange({
                ...lessonData,
                videoId: video.id,
                duration: formatDuration(video.duration),
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations
        if (!file.type.startsWith('video/')) {
            setUploadError('กรุณาเลือกไฟล์วิดีโอเท่านั้น');
            return;
        }
        if (file.size > 500 * 1024 * 1024) {
            setUploadError('ไฟล์ใหญ่เกินไป (สูงสุด 500MB)');
            return;
        }

        try {
            setUploadError(null);
            // Default title from filename if empty
            if (!lessonData.title) {
                onChange({ ...lessonData, title: file.name.replace(/\.[^/.]+$/, '') });
            }

            const result = await vimeoService.uploadVideo(file, setUploadProgress);

            const newVideo: VideoType = {
                id: Date.now(),
                name: file.name.replace(/\.[^/.]+$/, ''),
                provider: VideoProvider.VIMEO,
                resourceId: result.videoId,
                duration: result.duration,
                createdAt: new Date().toISOString(),
            };

            // Add to parent list
            onVideoUpload(newVideo);

            // Auto-select this video
            onChange({
                ...lessonData,
                title: lessonData.title || newVideo.name,
                videoId: newVideo.id,
                duration: formatDuration(newVideo.duration),
            });

            // Switch back to select tab to show it selected
            setActiveTab('select');
            setUploadProgress(null);

        } catch (err) {
            setUploadError('เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองใหม่');
            setUploadProgress(null);
        }
    };

    const handleSubmit = () => {
        if (lessonData.title && lessonData.videoId) {
            onAdd(lessonData);
        }
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newDocs: UploadedDocument[] = Array.from(files).map((file, idx) => ({
                id: `doc-${Date.now()}-${idx}`,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
            }));
            setDocuments([...documents, ...newDocs]);
        }
        e.target.value = '';
    };

    const removeDocument = (id: string) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const isUploading = uploadProgress !== null && uploadProgress.status !== 'complete';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-in max-h-[90vh] overflow-y-auto">
                <div className="p-6 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-bold">เพิ่มบทเรียนใหม่</h3>
                        <p className="text-sky-100 text-sm mt-1">เพิ่มเนื้อหาบทเรียนในคอร์สของคุณ</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    {/* Lesson Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ชื่อบทเรียน <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={lessonData.title}
                            onChange={(e) => onChange({ ...lessonData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                            placeholder="เช่น: บทที่ 1: บทนำ"
                            disabled={isUploading}
                        />
                    </div>

                    {/* Video Selection / Upload Tabs */}
                    <div>
                        <div className="flex items-center gap-4 mb-3 border-b border-slate-200">
                            <button
                                onClick={() => setActiveTab('select')}
                                className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'select' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                เลือกวิดีโอที่มีอยู่
                                {activeTab === 'select' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'upload' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                อัพโหลดวิดีโอใหม่
                                {activeTab === 'upload' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-t-full" />}
                            </button>
                        </div>

                        {activeTab === 'select' ? (
                            availableVideos.length === 0 ? (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
                                    <p className="text-sm text-slate-500 mb-3">ยังไม่มีวิดีโอในคลัง</p>
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className="text-sky-600 font-semibold text-sm hover:underline"
                                    >
                                        อัพโหลดวิดีโอใหม่
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {availableVideos.map((video) => (
                                        <label
                                            key={video.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${lessonData.videoId === video.id
                                                ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200'
                                                : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="video"
                                                checked={lessonData.videoId === video.id}
                                                onChange={() => handleVideoSelect(video.id)}
                                                className="sr-only"
                                            />
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lessonData.videoId === video.id
                                                ? 'bg-sky-500'
                                                : 'bg-slate-100'
                                                }`}>
                                                <Video size={16} className={lessonData.videoId === video.id ? 'text-white' : 'text-slate-500'} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 text-sm truncate">{video.name}</p>
                                                <p className="text-xs text-slate-500">{formatDuration(video.duration)}</p>
                                            </div>
                                            {lessonData.videoId === video.id && (
                                                <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
                                                    <CheckCircle size={12} className="text-white" />
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="space-y-4">
                                {!isUploading ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-sky-300 rounded-xl p-8 text-center bg-gradient-to-br from-sky-50 to-blue-50 hover:border-sky-400 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                                            <Upload size={24} className="text-sky-500" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">คลิกเพื่อเลือกไฟล์วิดีโอ</p>
                                        <p className="text-xs text-slate-500 mt-1">รองรับ MP4, MOV, AVI (สูงสุด 500MB)</p>
                                    </div>
                                ) : (
                                    <div className="border border-sky-200 rounded-xl p-6 bg-sky-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-sky-700">กำลังอัพโหลด...</span>
                                            <span className="text-sm font-bold text-sky-600">{uploadProgress?.percent}%</span>
                                        </div>
                                        <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-sky-100">
                                            <div
                                                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300 rounded-full"
                                                style={{ width: `${uploadProgress?.percent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 text-center">กรุณาอย่าปิดหน้าต่างนี้จนกว่าจะเสร็จสิ้น</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {uploadError && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                        <AlertCircle size={16} />
                                        {uploadError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Duration (auto-filled from selected video) */}
                    {selectedVideo && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                ระยะเวลา
                            </label>
                            <input
                                type="text"
                                value={lessonData.duration}
                                readOnly
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            คำอธิบาย
                        </label>
                        <textarea
                            value={lessonData.description}
                            onChange={(e) => onChange({ ...lessonData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                            placeholder="รายละเอียดเนื้อหาบทเรียน (ไม่บังคับ)"
                            disabled={isUploading}
                        />
                    </div>

                    {/* Document Upload Section */}
                    <div className="border-t border-slate-200 pt-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            เอกสารประกอบการเรียน
                        </label>

                        {/* Uploaded Documents List */}
                        {documents.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 text-sm truncate">{doc.name}</p>
                                            <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                                        </div>
                                        <button
                                            onClick={() => removeDocument(doc.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                            disabled={isUploading}
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Document Upload Area */}
                        <div className={`border-2 border-dashed border-emerald-300 rounded-xl p-5 text-center bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-400 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                                <Upload size={20} className="text-emerald-500" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">อัพโหลดเอกสารประกอบ</p>
                            <p className="text-xs text-slate-500 mb-3">รองรับ PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (สูงสุด 50MB)</p>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-all cursor-pointer">
                                <Upload size={16} />
                                เลือกไฟล์
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                    multiple
                                    className="hidden"
                                    onChange={handleDocumentUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            สามารถอัพโหลดได้หลายไฟล์ เอกสารเหล่านี้จะแสดงให้ผู้เรียนดาวน์โหลดในหน้าบทเรียน
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all font-semibold disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!lessonData.title || !lessonData.videoId || isUploading}
                        className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                กำลังบันทึก...
                            </>
                        ) : (
                            'เพิ่มบทเรียน'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
