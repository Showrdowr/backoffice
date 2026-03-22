import { useEffect, useMemo, useState } from 'react';
import { X, FileText, Trash2, Upload, AlertCircle, Eye } from 'lucide-react';
import type { Video as VideoType } from '@/features/videos/types';
import type { LessonDocument } from '../../types';
import type { VideoQuestion } from '../../types';
import { VideoPickerPanel } from './VideoPickerPanel';

const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

interface LessonData {
    title: string;
    videoId: number | null;
    duration: string;
    description: string;
    videoQuestions: VideoQuestion[];
    documents: LessonDocument[];
}

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (lesson: LessonData) => void;
    lessonData: LessonData;
    onChange: (data: LessonData) => void;
    availableVideos: VideoType[];
    onVideoUpload: (video: VideoType) => void;
}

function formatDuration(seconds: number | null | undefined): string {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds || 0)));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function isPdfDocument(fileName: string, mimeType?: string | null) {
    return String(mimeType || '').toLowerCase().includes('pdf') || fileName.toLowerCase().endsWith('.pdf');
}

export function AddLessonModal({ isOpen, onClose, onAdd, lessonData, onChange, availableVideos, onVideoUpload }: AddLessonModalProps) {
    const [modalError, setModalError] = useState<string | null>(null);
    const [isVideoPickerBusy, setIsVideoPickerBusy] = useState(false);
    const [previewDocumentId, setPreviewDocumentId] = useState<string | null>(null);
    const previewDocument = useMemo(
        () => lessonData.documents.find((doc) => String(doc.id) === previewDocumentId) || null,
        [lessonData.documents, previewDocumentId]
    );

    useEffect(() => {
        if (lessonData.documents.length === 0) {
            setPreviewDocumentId(null);
            return;
        }

        if (!previewDocumentId || !lessonData.documents.some((doc) => String(doc.id) === previewDocumentId)) {
            setPreviewDocumentId(String(lessonData.documents[0].id));
        }
    }, [lessonData.documents, previewDocumentId]);

    if (!isOpen) return null;

    const selectedVideo = availableVideos.find((video) => video.id === lessonData.videoId);

    const handleVideoReady = (video: VideoType) => {
        onVideoUpload(video);
        onChange({
            ...lessonData,
            videoId: video.id,
            duration: formatDuration(video.duration),
            title: lessonData.title || video.name || '',
        });
    };

    const handleSubmit = () => {
        if (lessonData.title && lessonData.videoId) {
            onAdd(lessonData);
        }
    };

    const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const nextDocuments: LessonDocument[] = [];
            for (const [idx, file] of Array.from(files).entries()) {
                if (file.size > MAX_DOCUMENT_BYTES) {
                    setModalError('ไฟล์เอกสารต้องไม่เกิน 5MB ต่อไฟล์');
                    continue;
                }

                const fileUrl = await readFileAsDataUrl(file);
                nextDocuments.push({
                    id: `doc-${Date.now()}-${idx}`,
                    lessonId: 0,
                    fileName: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    sizeBytes: file.size,
                    fileUrl,
                });
            }
            onChange({
                ...lessonData,
                documents: [...lessonData.documents, ...nextDocuments],
            });
            if (nextDocuments.length > 0) {
                setPreviewDocumentId(String(nextDocuments[0].id));
            }
        }
        event.target.value = '';
    };

    const removeDocument = (id: string) => {
        const remainingDocuments = lessonData.documents.filter((doc) => String(doc.id) !== id);
        onChange({
            ...lessonData,
            documents: remainingDocuments,
        });
        if (previewDocumentId === id) {
            setPreviewDocumentId(remainingDocuments[0] ? String(remainingDocuments[0].id) : null);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-slide-in">
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
                    <div>
                        <h3 className="text-2xl font-bold">เพิ่มบทเรียนใหม่</h3>
                        <p className="mt-1 text-sm text-sky-100">เพิ่มวิดีโอ เอกสาร และข้อมูลพื้นฐานของบทเรียน</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isVideoPickerBusy}
                        className="rounded-xl p-2 transition-all hover:bg-white/20 disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            ชื่อบทเรียน <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={lessonData.title}
                            onChange={(event) => onChange({ ...lessonData, title: event.target.value })}
                            className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="เช่น: บทที่ 1: บทนำ"
                            disabled={isVideoPickerBusy}
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-semibold text-slate-700">
                            วิดีโอบทเรียน <span className="text-red-500">*</span>
                        </label>
                        <p className="mb-3 text-xs text-slate-500">เลือกจากคลัง อัปโหลดใหม่ หรือใช้ลิงก์ Vimeo เดิมก็ได้ หลังเลือกแล้วระบบจะผูกวิดีโอนี้เข้ากับบทเรียนทันที</p>
                        <VideoPickerPanel
                            modes={['library', 'upload', 'existing']}
                            availableVideos={availableVideos}
                            selectedVideoId={lessonData.videoId}
                            onSelectVideo={(video) => {
                                onChange({
                                    ...lessonData,
                                    videoId: video.id,
                                    duration: formatDuration(video.duration),
                                });
                            }}
                            onVideoReady={handleVideoReady}
                            onVideoRefresh={onVideoUpload}
                            preferredName={lessonData.title}
                            onBusyChange={setIsVideoPickerBusy}
                            libraryEmptyText="ยังไม่มีวิดีโอในคลังสำหรับคอร์สนี้"
                        />
                    </div>

                    {selectedVideo && (
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">ระยะเวลา</label>
                            <input
                                type="text"
                                value={lessonData.duration}
                                readOnly
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
                            />
                            {selectedVideo.status !== 'READY' && (
                                <p className={`mt-2 text-xs ${selectedVideo.status === 'PROCESSING' ? 'text-amber-600' : 'text-red-600'}`}>
                                    {selectedVideo.status === 'PROCESSING'
                                        ? 'วิดีโอนี้ยังประมวลผลไม่เสร็จ จึงยังพรีวิวไม่ได้ แต่สามารถผูกกับบทเรียนไว้ก่อนได้'
                                        : 'วิดีโอนี้มีปัญหา กรุณาซิงก์สถานะใหม่หรือนำเข้า/อัปโหลดใหม่'}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">คำอธิบาย</label>
                        <textarea
                            value={lessonData.description}
                            onChange={(event) => onChange({ ...lessonData, description: event.target.value })}
                            rows={3}
                            className="w-full rounded-xl border border-sky-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="รายละเอียดเนื้อหาบทเรียน (ไม่บังคับ)"
                            disabled={isVideoPickerBusy}
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                        <label className="mb-3 block text-sm font-semibold text-slate-700">เอกสารประกอบการเรียน</label>

                        {lessonData.documents.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {lessonData.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                            <FileText size={20} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">{doc.fileName}</p>
                                            <p className="text-xs text-slate-500">{doc.mimeType} • {formatFileSize(doc.sizeBytes)}</p>
                                        </div>
                                        <button
                                            onClick={() => setPreviewDocumentId(String(doc.id))}
                                            className="rounded-lg p-2 transition-all hover:bg-sky-50"
                                            title="ดูตัวอย่างเอกสาร"
                                            disabled={isVideoPickerBusy}
                                        >
                                            <Eye size={16} className="text-sky-500" />
                                        </button>
                                        <button
                                            onClick={() => removeDocument(String(doc.id))}
                                            className="rounded-lg p-2 transition-all hover:bg-red-50"
                                            disabled={isVideoPickerBusy}
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {previewDocument && (
                            <div className="mb-4 overflow-hidden rounded-xl border border-sky-100 bg-white">
                                <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">ตัวอย่างเอกสาร</p>
                                        <p className="text-xs text-slate-500">{previewDocument.fileName}</p>
                                    </div>
                                    <button
                                        onClick={() => setPreviewDocumentId(null)}
                                        className="rounded-lg p-2 transition-all hover:bg-white"
                                        title="ปิดตัวอย่าง"
                                    >
                                        <X size={16} className="text-slate-500" />
                                    </button>
                                </div>
                                {isPdfDocument(previewDocument.fileName, previewDocument.mimeType) ? (
                                    <iframe
                                        src={previewDocument.fileUrl}
                                        title={`preview-${previewDocument.fileName}`}
                                        className="h-[420px] w-full bg-white"
                                    />
                                ) : (
                                    <div className="px-4 py-6 text-sm text-slate-500">
                                        ไฟล์ชนิดนี้ยังไม่รองรับตัวอย่างในระบบ กรุณาเปิดจากเครื่องเพื่อตรวจสอบ
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={`rounded-xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center transition-all hover:border-emerald-400 ${isVideoPickerBusy ? 'pointer-events-none opacity-50' : ''}`}>
                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                                <Upload size={20} className="text-emerald-500" />
                            </div>
                            <p className="mb-1 text-sm font-semibold text-slate-700">อัปโหลดเอกสารประกอบ</p>
                            <p className="mb-3 text-xs text-slate-500">รองรับ PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (สูงสุด 5MB ต่อไฟล์)</p>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-600">
                                <Upload size={16} />
                                เลือกไฟล์
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                    multiple
                                    className="hidden"
                                    onChange={handleDocumentUpload}
                                    disabled={isVideoPickerBusy}
                                />
                            </label>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">เอกสารเหล่านี้จะแสดงให้ผู้เรียนดาวน์โหลดจากหน้าบทเรียน</p>
                    </div>

                    {modalError && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                            <AlertCircle size={16} />
                            {modalError}
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-b-2xl bg-slate-50 p-6">
                    <button
                        onClick={onClose}
                        disabled={isVideoPickerBusy}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold transition-all hover:bg-white disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!lessonData.title || !lessonData.videoId || isVideoPickerBusy}
                        className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isVideoPickerBusy ? 'กำลังบันทึก...' : 'เพิ่มบทเรียน'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('READ_FILE_FAILED'));
        reader.readAsDataURL(file);
    });
}
