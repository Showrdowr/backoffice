'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
    message = 'กำลังโหลด...', 
    fullScreen = false,
    size = 'md' 
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className={`${sizeClasses[size]} text-sky-500 animate-spin`} />
            {message && (
                <p className="text-slate-600 font-medium animate-pulse">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {content}
        </div>
    );
}
