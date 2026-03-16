'use client';

import { useState, useCallback, useRef } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import {
    parseVideoQuestionCSV,
    parseExamQuestionCSV,
    downloadCSVTemplate,
    type ParseResult,
    type ValidationError
} from '@/utils/csvQuestionParser';
import type { CreateVideoQuestionInput, CreateExamQuestionInput } from '@/features/courses/types';

// ==========================================
// Types
// ==========================================

interface CSVImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'video' | 'exam';
    targetId: number; // lessonId for video, examId for exam
    onImport: (questions: CreateVideoQuestionInput[] | CreateExamQuestionInput[]) => Promise<void>;
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete';

// ==========================================
// Component
// ==========================================

export function CSVImportModal({ isOpen, onClose, type, targetId, onImport }: CSVImportModalProps) {
    const [step, setStep] = useState<ImportStep>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [parseResult, setParseResult] = useState<ParseResult<CreateVideoQuestionInput | CreateExamQuestionInput> | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal closes
    const handleClose = useCallback(() => {
        setStep('upload');
        setFile(null);
        setParseResult(null);
        setIsDragging(false);
        setImportError(null);
        onClose();
    }, [onClose]);

    // Handle file selection
    const handleFileSelect = useCallback(async (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.csv')) {
            setImportError('กรุณาเลือกไฟล์ CSV เท่านั้น');
            return;
        }

        setFile(selectedFile);
        setImportError(null);

        // Parse the file
        const result = type === 'video'
            ? await parseVideoQuestionCSV(selectedFile, targetId)
            : await parseExamQuestionCSV(selectedFile, targetId);

        setParseResult(result as ParseResult<CreateVideoQuestionInput | CreateExamQuestionInput>);
        setStep('preview');
    }, [type, targetId]);

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    }, [handleFileSelect]);

    // Handle import
    const handleImport = useCallback(async () => {
        if (!parseResult || parseResult.data.length === 0) return;

        setStep('importing');
        setImportError(null);

        try {
            // Cast to the appropriate type based on the import type
            if (type === 'video') {
                await onImport(parseResult.data as CreateVideoQuestionInput[]);
            } else {
                await onImport(parseResult.data as CreateExamQuestionInput[]);
            }
            setStep('complete');
        } catch (error) {
            setImportError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการ import');
            setStep('preview');
        }
    }, [parseResult, onImport, type]);

    // Handle template download
    const handleDownloadTemplate = useCallback(() => {
        downloadCSVTemplate(type);
    }, [type]);

    if (!isOpen) return null;

    const title = type === 'video' ? 'Import คำถาม Interactive' : 'Import คำถามแบบทดสอบ';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Upload Step */}
                    {step === 'upload' && (
                        <div className="space-y-6">
                            {/* Download template button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                                >
                                    <Download size={16} />
                                    ดาวน์โหลด Template
                                </button>
                            </div>

                            {/* Drop zone */}
                            <div
                                className={`
                                    border-2 border-dashed rounded-xl p-8 text-center transition-colors
                                    ${isDragging
                                        ? 'border-violet-500 bg-violet-50'
                                        : 'border-slate-300 hover:border-violet-400'
                                    }
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload size={48} className="mx-auto text-slate-400 mb-4" />
                                <p className="text-slate-600 mb-2">
                                    ลากไฟล์ CSV มาวางที่นี่
                                </p>
                                <p className="text-sm text-slate-500 mb-4">หรือ</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                                >
                                    เลือกไฟล์
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFileSelect(f);
                                    }}
                                />
                            </div>

                            {/* Error message */}
                            {importError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    <AlertCircle size={18} />
                                    <span className="text-sm">{importError}</span>
                                </div>
                            )}

                            {/* CSV Format info */}
                            <div className="bg-slate-50 rounded-xl p-4">
                                <h4 className="font-semibold text-slate-700 mb-2">รูปแบบ CSV</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    {type === 'video' ? (
                                        <>
                                            <li>• <code className="bg-slate-200 px-1 rounded">questionText</code> - ข้อความคำถาม</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">questionType</code> - MULTIPLE_CHOICE หรือ FREE_TEXT</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">displayAtSeconds</code> - เวลาที่แสดง (วินาที)</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">option1-4</code> - ตัวเลือก (สำหรับ Multiple Choice)</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">correctAnswer</code> - A, B, C, หรือ D</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>• <code className="bg-slate-200 px-1 rounded">questionText</code> - ข้อความคำถาม</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">questionType</code> - MULTIPLE_CHOICE หรือ FREE_TEXT</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">scoreWeight</code> - คะแนน (ค่าเริ่มต้น: 1)</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">option1-4</code> - ตัวเลือก (สำหรับ Multiple Choice)</li>
                                            <li>• <code className="bg-slate-200 px-1 rounded">correctAnswer</code> - A, B, C, หรือ D</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Preview Step */}
                    {step === 'preview' && parseResult && (
                        <div className="space-y-6">
                            {/* File info */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <FileText size={20} className="text-slate-500" />
                                <div className="flex-1">
                                    <p className="font-medium text-slate-700">{file?.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {parseResult.totalRows} แถว • {parseResult.validRows} แถวที่ถูกต้อง
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setStep('upload');
                                        setFile(null);
                                        setParseResult(null);
                                    }}
                                    className="text-sm text-violet-600 hover:text-violet-700"
                                >
                                    เปลี่ยนไฟล์
                                </button>
                            </div>

                            {/* Validation errors */}
                            {parseResult.errors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                                        <AlertCircle size={18} />
                                        <span>พบข้อผิดพลาด {parseResult.errors.length} รายการ</span>
                                    </div>
                                    <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
                                        {parseResult.errors.slice(0, 10).map((error, index) => (
                                            <li key={index}>
                                                แถวที่ {error.row}: {error.message} ({error.field})
                                            </li>
                                        ))}
                                        {parseResult.errors.length > 10 && (
                                            <li className="font-medium">
                                                ...และอีก {parseResult.errors.length - 10} รายการ
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Preview table */}
                            {parseResult.data.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-2">
                                        ตัวอย่างข้อมูล (แสดง {Math.min(5, parseResult.data.length)} จาก {parseResult.data.length} รายการ)
                                    </h4>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold text-slate-600">#</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-slate-600">คำถาม</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-slate-600">ประเภท</th>
                                                    {type === 'video' && (
                                                        <th className="px-4 py-2 text-left font-semibold text-slate-600">เวลา</th>
                                                    )}
                                                    {type === 'exam' && (
                                                        <th className="px-4 py-2 text-left font-semibold text-slate-600">คะแนน</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parseResult.data.slice(0, 5).map((question, index) => (
                                                    <tr key={index} className="border-t border-slate-200">
                                                        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                                                        <td className="px-4 py-2 text-slate-800 max-w-xs truncate">
                                                            {question.questionText}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className={`
                                                                text-xs px-2 py-1 rounded-full font-medium
                                                                ${question.questionType === 'MULTIPLE_CHOICE'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-green-100 text-green-700'
                                                                }
                                                            `}>
                                                                {question.questionType === 'MULTIPLE_CHOICE' ? 'ตัวเลือก' : 'เขียนตอบ'}
                                                            </span>
                                                        </td>
                                                        {type === 'video' && 'displayAtSeconds' in question && (
                                                            <td className="px-4 py-2 text-slate-600">
                                                                {question.displayAtSeconds}s
                                                            </td>
                                                        )}
                                                        {type === 'exam' && 'scoreWeight' in question && (
                                                            <td className="px-4 py-2 text-slate-600">
                                                                {question.scoreWeight}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Import error */}
                            {importError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    <AlertCircle size={18} />
                                    <span className="text-sm">{importError}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Importing Step */}
                    {step === 'importing' && (
                        <div className="text-center py-12">
                            <Loader2 size={48} className="mx-auto text-violet-600 animate-spin mb-4" />
                            <p className="text-slate-600">กำลัง import คำถาม...</p>
                        </div>
                    )}

                    {/* Complete Step */}
                    {step === 'complete' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Import สำเร็จ!</h3>
                            <p className="text-slate-600">
                                เพิ่มคำถาม {parseResult?.validRows || 0} ข้อเรียบร้อยแล้ว
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                    {step === 'upload' && (
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            ยกเลิก
                        </button>
                    )}

                    {step === 'preview' && (
                        <>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!parseResult || parseResult.validRows === 0}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Import {parseResult?.validRows || 0} คำถาม
                            </button>
                        </>
                    )}

                    {step === 'complete' && (
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            เสร็จสิ้น
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
