'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

interface TextCaptchaModalProps {
  apiBase: string;
  onSuccess: (answer: string, token: string) => void;
  onClose: () => void;
}

export const TextCaptchaModal: React.FC<TextCaptchaModalProps> = ({ apiBase, onSuccess, onClose }) => {
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaptcha = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/v1/admin/auth/captcha`);
      const data = await res.json();
      if (data.success) {
        setCaptchaSvg(data.svg);
        setCaptchaToken(data.token);
        setCaptchaAnswer('');
      } else {
        setError('ไม่สามารถโหลด CAPTCHA ได้');
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลด CAPTCHA');
    } finally {
      setIsLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaAnswer.trim()) {
      setError('กรุณากรอกรหัส CAPTCHA');
      return;
    }
    onSuccess(captchaAnswer, captchaToken);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h3 className="text-xl font-bold text-black mb-2">
            ยืนยันตัวตน
          </h3>
          <p className="text-black text-sm mb-8">
            กรุณากรอกรหัสที่เห็นในรูปภาพเพื่อดำเนินการต่อ
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[60px] bg-slate-50 border-2 border-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
                {isLoading ? (
                  <Loader2 className="animate-spin text-blue-500" size={24} />
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ __html: captchaSvg }} 
                    className="w-full h-full flex items-center justify-center"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={fetchCaptcha}
                disabled={isLoading}
                className="p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-100 transition-all disabled:opacity-50"
                title="เปลี่ยนรูป"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div>
              <div className="relative">
                <AlertCircle size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-500' : 'text-slate-400'}`} />
                <input
                  autoFocus
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="รหัสที่เห็นในภาพ"
                  className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50 border-2 rounded-xl transition-all outline-none text-black ${
                    error ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-blue-500 focus:bg-white'
                  }`}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-2 font-medium">
                  <AlertCircle size={14} />
                  {error}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-4 px-6 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                ตกลง
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
