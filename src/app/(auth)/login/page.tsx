'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2, BookOpen, Users, Award } from 'lucide-react';
import { TextCaptchaModal } from '@/components/auth/TextCaptchaModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Captcha states
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);

  // No longer fetching CAPTCHA on mount
  useEffect(() => {
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldError(null);
    setShowCaptchaModal(true);
  };

  const handleCaptchaSuccess = async (answer: string, token: string) => {
    setShowCaptchaModal(false);
    setIsLoading(true);

    try {
      await login(email, password, answer, token);
      router.push('/');
    } catch (err) {
      const loginErr = err as Error & { field?: string; requiresCaptcha?: boolean };
      setError(loginErr.message || 'เข้าสู่ระบบล้มเหลว');
      setFieldError(loginErr.field || null);

      if (loginErr.message?.toLowerCase().includes('captcha')) {
        // Re-open modal on CAPTCHA error
        setShowCaptchaModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-8">
            <ShieldCheck size={48} className="text-white" />
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            Pharmacy Academy
          </h1>
          <p className="text-blue-200/80 text-lg xl:text-xl mb-12">
            ระบบจัดการการเรียนรู้สำหรับเภสัชกร
          </p>

          {/* Feature highlights */}
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={24} className="text-blue-200" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">จัดการคอร์สเรียน</p>
                <p className="text-blue-200/60 text-sm">สร้าง แก้ไข และเผยแพร่คอร์สเรียนออนไลน์</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-blue-200" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">จัดการผู้ใช้งาน</p>
                <p className="text-blue-200/60 text-sm">ดูแลสมาชิก เภสัชกร และเจ้าหน้าที่</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award size={24} className="text-blue-200" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">CPE Credits</p>
                <p className="text-blue-200/60 text-sm">บันทึกและรายงานหน่วยกิตการศึกษาต่อเนื่อง</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="absolute bottom-6 text-blue-200/30 text-sm">
          © 2026 Pharmacy Academy — All rights reserved
        </p>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Pharmacy Academy</h1>
            <p className="text-blue-300/70 text-sm">Backoffice Management System</p>
          </div>

          {/* Welcome text */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
            <p className="text-blue-300/70 text-base">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ Backoffice</p>
          </div>

          {/* General Error */}
          {error && !fieldError && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-200/80 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldError === 'email' ? 'text-red-400' : 'text-blue-300/50'}`} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (fieldError === 'email') { setError(''); setFieldError(null); } }}
                  autoComplete="off"
                  required
                  className={`w-full pl-12 pr-5 py-4 text-base bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-0 transition-all ${fieldError === 'email' ? 'border-red-400 focus:border-red-500' : 'border-white/10 focus:border-blue-400 hover:border-white/20'}`}
                />
              </div>
              {fieldError === 'email' && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} />
                  {error}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-200/80 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldError === 'password' ? 'text-red-400' : 'text-blue-300/50'}`} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (fieldError === 'password') { setError(''); setFieldError(null); } }}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className={`w-full pl-12 pr-5 py-4 text-base bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-0 transition-all ${fieldError === 'password' ? 'border-red-400 focus:border-red-500' : 'border-white/10 focus:border-blue-400 hover:border-white/20'}`}
                />
              </div>
              {fieldError === 'password' && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} />
                  {error}
                </p>
              )}
            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-base bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          {/* Footer on mobile */}
          <p className="lg:hidden text-center text-blue-300/30 text-sm mt-8">
            © 2026 Pharmacy Academy — Admin Panel
          </p>
        </div>
      </div>

      {showCaptchaModal && (
        <TextCaptchaModal
          apiBase={API_BASE}
          onSuccess={handleCaptchaSuccess}
          onClose={() => setShowCaptchaModal(false)}
        />
      )}
    </div>
  );
}
