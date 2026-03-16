'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    error: Error | string;
    fullScreen?: boolean;
    onRetry?: () => void;
}

export default function ErrorMessage({ 
    error, 
    fullScreen = false,
    onRetry 
}: ErrorMessageProps) {
    const errorMessage = typeof error === 'string' ? error : error.message;

    const content = (
        <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">เกิดข้อผิดพลาด</h3>
                <p className="text-slate-600">{errorMessage}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
                >
                    <RefreshCw size={18} />
                    ลองใหม่อีกครั้ง
                </button>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12 bg-red-50/50 rounded-2xl border border-red-100">
            {content}
        </div>
    );
}
