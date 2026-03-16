'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface PasswordConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    isLoading?: boolean;
    error?: string | null;
    onConfirm: (password: string) => void;
    onCancel: () => void;
}

export default function PasswordConfirmModal({
    isOpen,
    title,
    description,
    confirmLabel = 'ยืนยัน',
    isLoading = false,
    error = null,
    onConfirm,
    onCancel,
}: PasswordConfirmModalProps) {
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;
        onConfirm(password);
    };

    const handleClose = () => {
        setPassword('');
        onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} className="text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {title}
                        </h3>
                        <p className="text-slate-500 mb-6 text-sm">
                            {description}
                        </p>

                        <div className="text-left">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                รหัสผ่านของคุณ
                            </label>
                            <input
                                type="password"
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="กรอกรหัสผ่านเพื่อยืนยัน"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
                                disabled={isLoading}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex bg-slate-50 p-4 border-t border-slate-100 gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !password.trim()}
                            className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold transition-all flex justify-center items-center gap-2 shadow-sm shadow-amber-200 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>กำลังดำเนินการ...</span>
                                </>
                            ) : (
                                <span>{confirmLabel}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
