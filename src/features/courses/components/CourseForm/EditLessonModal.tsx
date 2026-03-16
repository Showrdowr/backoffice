import { useState, useRef } from 'react';
import { X, FileText, Trash2, Upload, Video, CheckCircle, AlertCircle } from 'lucide-react';
import type { Lesson } from '../../types';
import type { Video as VideoType } from '@/features/videos/types';
import { vimeoService, type UploadProgress } from '@/features/videos/services/vimeoService';
import { VideoProvider } from '@/features/videos/types';

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  lesson: Lesson | null;
  onChange: (lesson: Lesson) => void;
  availableVideos: VideoType[];
  onVideoUpload: (video: VideoType) => void;
}

// Mock existing documents for demo
const mockExistingDocuments: UploadedDocument[] = [
  { id: 'existing-1', name: 'สไลด์บทเรียน.pdf', size: '2.4 MB', type: 'PDF' },
  { id: 'existing-2', name: 'แบบฝึกหัด.docx', size: '156 KB', type: 'DOCX' },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseDuration(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // mm:ss
  if (parts.length === 1) return parts[0]; // seconds
  return 0;
}

export function EditLessonModal({ isOpen, onClose, onSave, lesson, onChange, availableVideos, onVideoUpload }: EditLessonModalProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>(mockExistingDocuments);
  const [activeVideoTab, setActiveVideoTab] = useState<'select' | 'upload'>('select');

  // Upload State
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !lesson) return null;

  const handleVideoSelect = (videoId: number) => {
    const video = availableVideos.find(v => v.id === videoId);
    if (video) {
      onChange({
        ...lesson,
        videoId: video.id,
        duration: formatDuration(video.duration),
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const result = await vimeoService.uploadVideo(file, setUploadProgress);

      const newVideo: VideoType = {
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        provider: VideoProvider.VIMEO,
        resourceId: result.videoId,
        duration: result.duration,
        createdAt: new Date().toISOString(),
      };

      onVideoUpload(newVideo);

      onChange({
        ...lesson,
        videoId: newVideo.id,
        duration: formatDuration(newVideo.duration),
      });

      setActiveVideoTab('select');
      setUploadProgress(null);

    } catch (err) {
      setUploadError('เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองใหม่');
      setUploadProgress(null);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-slide-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-2xl font-bold">แก้ไขบทเรียน</h3>
            <p className="text-violet-100 text-sm mt-1">จัดการเนื้อหาและคำถามในบทเรียน</p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* CONTENT */}
          <div className="space-y-5">
            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ชื่อบทเรียน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => onChange({ ...lesson, title: e.target.value })}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                disabled={isUploading}
              />
            </div>

            {/* Video Selection / Upload Tabs */}
            <div>
              <div className="flex items-center gap-4 mb-3 border-b border-slate-200">
                <button
                  onClick={() => setActiveVideoTab('select')}
                  className={`pb-2 text-sm font-semibold transition-all relative ${activeVideoTab === 'select' ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  เลือกวิดีโอที่มีอยู่
                  {activeVideoTab === 'select' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-t-full" />}
                </button>
                <button
                  onClick={() => setActiveVideoTab('upload')}
                  className={`pb-2 text-sm font-semibold transition-all relative ${activeVideoTab === 'upload' ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  อัพโหลดวิดีโอใหม่
                  {activeVideoTab === 'upload' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-t-full" />}
                </button>
              </div>

              {activeVideoTab === 'select' ? (
                availableVideos.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
                    <p className="text-sm text-slate-500 mb-3">ยังไม่มีวิดีโอในคลัง</p>
                    <button
                      onClick={() => setActiveVideoTab('upload')}
                      className="text-violet-600 font-semibold text-sm hover:underline"
                    >
                      อัพโหลดวิดีโอใหม่
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {availableVideos.map((video) => (
                      <label
                        key={video.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${lesson.videoId === video.id
                          ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-200'
                          : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="video"
                          checked={lesson.videoId === video.id}
                          onChange={() => handleVideoSelect(video.id)}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lesson.videoId === video.id
                          ? 'bg-violet-500'
                          : 'bg-slate-100'
                          }`}>
                          <Video size={16} className={lesson.videoId === video.id ? 'text-white' : 'text-slate-500'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">{video.name}</p>
                          <p className="text-xs text-slate-500">{formatDuration(video.duration)}</p>
                        </div>
                        {lesson.videoId === video.id && (
                          <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center shrink-0">
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
                      className="border-2 border-dashed border-violet-300 rounded-xl p-8 text-center bg-gradient-to-br from-violet-50 to-purple-50 hover:border-violet-400 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-violet-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">คลิกเพื่อเลือกไฟล์วิดีโอ</p>
                      <p className="text-xs text-slate-500 mt-1">รองรับ MP4, MOV, AVI (สูงสุด 500MB)</p>
                    </div>
                  ) : (
                    <div className="border border-violet-200 rounded-xl p-6 bg-violet-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-violet-700">กำลังอัพโหลด...</span>
                        <span className="text-sm font-bold text-violet-600">{uploadProgress?.percent}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-violet-100">
                        <div
                          className="h-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress?.percent}%` }}
                        />
                      </div>
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

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ระยะเวลา <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lesson.duration}
                onChange={(e) => onChange({ ...lesson, duration: e.target.value })}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                readOnly
                disabled={isUploading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                คำอธิบาย
              </label>
              <textarea
                value={lesson.description || ''}
                onChange={(e) => onChange({ ...lesson, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                placeholder="รายละเอียดเนื้อหาบทเรียน"
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
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all"
                        title="ลบเอกสาร"
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
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-white transition-all font-semibold disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            disabled={isUploading}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              'บันทึกการแก้ไข'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
