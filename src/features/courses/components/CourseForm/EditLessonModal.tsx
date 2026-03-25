import { useEffect, useMemo, useState } from 'react';
import { X, FileText, Trash2, Upload, AlertCircle, Eye } from 'lucide-react';
import type { Lesson, LessonDocument } from '../../types';
import type { Video as VideoType } from '@/features/videos/types';
import { lessonService } from '../../services/lessonService';
import { VideoPickerPanel } from './VideoPickerPanel';
import { MAX_LESSON_DOCUMENT_BYTES, MAX_LESSON_DOCUMENT_MB } from '../../constants';

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  lesson: Lesson | null;
  onChange: (lesson: Lesson) => void;
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

function getFirstPreviewableDocumentId(documents: LessonDocument[]) {
  const firstPreviewableDocument = documents.find((doc) => isPdfDocument(doc.fileName, doc.mimeType));
  return firstPreviewableDocument ? String(firstPreviewableDocument.id) : null;
}

export function EditLessonModal({ isOpen, onClose, onSave, lesson, onChange, availableVideos, onVideoUpload }: EditLessonModalProps) {
  const [modalError, setModalError] = useState<string | null>(null);
  const [isVideoPickerBusy, setIsVideoPickerBusy] = useState(false);
  const [previewDocumentId, setPreviewDocumentId] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const lessonDocuments = lesson?.documents || [];

  const previewDocument = useMemo(
    () => lessonDocuments.find((doc) => String(doc.id) === previewDocumentId) || null,
    [lessonDocuments, previewDocumentId]
  );

  useEffect(() => {
    if (lessonDocuments.length === 0) {
      setPreviewDocumentId(null);
      return;
    }

    if (!previewDocumentId || !lessonDocuments.some((doc) => String(doc.id) === previewDocumentId)) {
      setPreviewDocumentId(getFirstPreviewableDocumentId(lessonDocuments));
    }
  }, [lessonDocuments, previewDocumentId]);

  if (!isOpen || !lesson) return null;

  const handleVideoReady = (video: VideoType) => {
    onVideoUpload(video);
    onChange({
      ...lesson,
      videoId: video.id,
      duration: formatDuration(video.duration),
      title: lesson.title || video.name || '',
    });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Promise.all(Array.from(files).map(async (file, idx) => {
        if (file.size > MAX_LESSON_DOCUMENT_BYTES) {
          throw new Error(`ไฟล์เอกสารต้องไม่เกิน ${MAX_LESSON_DOCUMENT_MB}MB ต่อไฟล์`);
        }

        return {
          id: `doc-${Date.now()}-${idx}`,
          lessonId: Number(lesson.id),
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          sizeBytes: file.size,
          fileUrl: await readFileAsDataUrl(file),
        } as LessonDocument;
      }))
        .then((documents) => {
          const nextDocuments = [...(lesson.documents || []), ...documents];
          onChange({
            ...lesson,
            documents: nextDocuments,
          });
          setPreviewDocumentId(getFirstPreviewableDocumentId(nextDocuments));
          setModalError(null);
        })
        .catch((error) => {
          setModalError(error instanceof Error ? error.message : 'อัปโหลดเอกสารไม่สำเร็จ');
        });
    }
    event.target.value = '';
  };

  const removeDocument = (id: string) => {
    const remainingDocuments = (lesson.documents || []).filter((doc) => String(doc.id) !== id);
    onChange({
      ...lesson,
      documents: remainingDocuments,
    });
    if (previewDocumentId === id) {
      setPreviewDocumentId(getFirstPreviewableDocumentId(remainingDocuments));
    }
  };

  const openPreviewDocument = async (document: LessonDocument) => {
    setPreviewDocumentId(String(document.id));

    if (!isPdfDocument(document.fileName, document.mimeType)) {
      setModalError('ตัวอย่างในระบบรองรับเฉพาะไฟล์ PDF ส่วน DOC/DOCX/PPT/PPTX/XLS/XLSX ให้เปิดจากเครื่องเพื่อตรวจสอบ');
      return;
    }

    setModalError(null);

    if (document.fileUrl) {
      return;
    }

    const documentId = Number(document.id);
    if (!Number.isFinite(documentId)) {
      setModalError('ไม่สามารถโหลดตัวอย่างเอกสารนี้ได้');
      return;
    }

    try {
      setIsPreviewLoading(true);
      const resolvedDocument = await lessonService.getLessonDocument(documentId);
      const nextDocuments = lessonDocuments.map((item) => (
        String(item.id) === String(document.id)
          ? { ...item, fileUrl: resolvedDocument.fileUrl }
          : item
      ));

      onChange({
        ...lesson,
        documents: nextDocuments,
      });
    } catch (error) {
      setModalError(error instanceof Error ? error.message : 'โหลดตัวอย่างเอกสารไม่สำเร็จ');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl animate-slide-in">
        <div className="shrink-0 rounded-t-2xl bg-gradient-to-r from-violet-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">แก้ไขบทเรียน</h3>
              <p className="mt-1 text-sm text-violet-100">จัดการวิดีโอ เอกสาร และข้อมูลพื้นฐานของบทเรียน</p>
            </div>
            <button
              onClick={onClose}
              disabled={isVideoPickerBusy}
              className="rounded-xl p-2 transition-all hover:bg-white/20 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ชื่อบทเรียน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lesson.title}
                onChange={(event) => onChange({ ...lesson, title: event.target.value })}
                className="w-full rounded-xl border border-violet-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
                disabled={isVideoPickerBusy}
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                วิดีโอบทเรียน <span className="text-red-500">*</span>
              </label>
              <p className="mb-3 text-xs text-slate-500">เลือกวิดีโอจากคลัง อัปโหลดใหม่ หรือใช้ลิงก์ Vimeo เดิมก็ได้ การเลือกใหม่จะอัปเดตระยะเวลาบทเรียนตามวิดีโอที่เลือก</p>
              <VideoPickerPanel
                modes={['library', 'upload', 'existing']}
                availableVideos={availableVideos}
                selectedVideoId={lesson.videoId ?? null}
                onSelectVideo={(video) => {
                  onChange({
                    ...lesson,
                    videoId: video.id,
                    duration: formatDuration(video.duration),
                  });
                }}
                onVideoReady={handleVideoReady}
                onVideoRefresh={onVideoUpload}
                preferredName={lesson.title}
                onBusyChange={setIsVideoPickerBusy}
                libraryEmptyText="ยังไม่มีวิดีโอในคลังสำหรับคอร์สนี้"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ระยะเวลา <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lesson.duration || ''}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
              />
              {availableVideos.find((video) => video.id === lesson.videoId)?.status !== 'READY' && lesson.videoId && (
                <p className={`mt-2 text-xs ${availableVideos.find((video) => video.id === lesson.videoId)?.status === 'PROCESSING' ? 'text-amber-600' : 'text-red-600'}`}>
                  {availableVideos.find((video) => video.id === lesson.videoId)?.status === 'PROCESSING'
                    ? 'วิดีโอนี้ยังประมวลผลไม่เสร็จ จึงยังพรีวิวไม่ได้ แต่สามารถผูกกับบทเรียนไว้ก่อนได้'
                    : 'วิดีโอนี้มีปัญหา กรุณาซิงก์สถานะใหม่หรือนำเข้า/อัปโหลดใหม่'}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">คำอธิบาย</label>
              <textarea
                value={lesson.description || ''}
                onChange={(event) => onChange({ ...lesson, description: event.target.value })}
                rows={3}
                className="w-full rounded-xl border border-violet-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="รายละเอียดเนื้อหาบทเรียน"
                disabled={isVideoPickerBusy}
              />
            </div>

            <div className="border-t border-slate-200 pt-5">
              <label className="mb-3 block text-sm font-semibold text-slate-700">เอกสารประกอบการเรียน</label>

              {(lesson.documents || []).length > 0 && (
                <div className="mb-4 space-y-2">
                  {(lesson.documents || []).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        <FileText size={20} className="text-violet-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{doc.fileName}</p>
                        <p className="text-xs text-slate-500">{doc.mimeType} • {formatFileSize(doc.sizeBytes)}</p>
                      </div>
                      <button
                        onClick={() => void openPreviewDocument(doc)}
                        className="rounded-lg p-2 transition-all hover:bg-sky-50"
                        title="ดูตัวอย่างเอกสาร (PDF)"
                        disabled={isVideoPickerBusy || isPreviewLoading}
                      >
                        <Eye size={16} className="text-sky-500" />
                      </button>
                      <button
                        onClick={() => removeDocument(String(doc.id))}
                        className="rounded-lg p-2 transition-all hover:bg-red-50"
                        title="ลบเอกสาร"
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
                  {isPreviewLoading && !previewDocument.fileUrl ? (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      กำลังโหลดตัวอย่างเอกสาร...
                    </div>
                  ) : previewDocument.fileUrl && isPdfDocument(previewDocument.fileName, previewDocument.mimeType) ? (
                    <iframe
                      src={previewDocument.fileUrl}
                      title={`preview-${previewDocument.fileName}`}
                      className="h-[420px] w-full bg-white"
                    />
                  ) : previewDocument.fileUrl ? (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      ตัวอย่างในระบบรองรับเฉพาะไฟล์ PDF ส่วน DOC/DOCX/PPT/PPTX/XLS/XLSX ให้เปิดจากเครื่องเพื่อตรวจสอบ
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      เลือกเอกสารเพื่อโหลดตัวอย่าง
                    </div>
                  )}
                </div>
              )}

              <div className={`rounded-xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center transition-all hover:border-emerald-400 ${isVideoPickerBusy ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Upload size={20} className="text-emerald-500" />
                </div>
                <p className="mb-1 text-sm font-semibold text-slate-700">อัปโหลดเอกสารประกอบ</p>
                <p className="mb-3 text-xs text-slate-500">
                  รองรับ PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (สูงสุด {MAX_LESSON_DOCUMENT_MB}MB ต่อไฟล์) และดูตัวอย่างในระบบได้เฉพาะ PDF
                </p>
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
            </div>

            {modalError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={16} />
                {modalError}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 rounded-b-2xl bg-slate-50 p-6">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isVideoPickerBusy}
              className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold transition-all hover:bg-white disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={onSave}
              disabled={isVideoPickerBusy}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isVideoPickerBusy ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
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
