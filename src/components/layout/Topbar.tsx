'use client';

import { Bell, Search, Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';

interface TopbarProps {
    onMobileMenuToggle?: () => void;
}

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
    const [isDark, setIsDark] = useState(false);
    const { user, logout, isAdmin } = useAuth();

    return (
        <header 
            className="fixed top-0 h-[72px] bg-white/80 backdrop-blur-xl border-b border-sky-100 z-40 flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-sm transition-all duration-300 left-0 right-0 lg:left-[var(--sidebar-width)]"
        >
            {/* Left Side */}
            <div className="flex items-center gap-3 md:gap-4 flex-1">
                {/* Mobile Menu Button */}
                <button 
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2.5 hover:bg-sky-50 rounded-xl transition-all"
                    aria-label="เปิดเมนู"
                >
                    <Menu size={22} className="text-slate-600" />
                </button>

                {/* Search */}
                <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl px-5 py-3 max-w-md w-full border border-sky-100 hover:border-sky-200 transition-all focus-within:ring-2 focus-within:ring-sky-200">
                    <Search size={20} className="text-sky-500" />
                    <input
                        type="text"
                        placeholder="ค้นหาคอร์ส, ผู้ใช้งาน, หรือรายการ..."
                        className="bg-transparent border-none outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                {/* Mobile Search Icon */}
                <button className="md:hidden p-2.5 hover:bg-sky-50 rounded-xl transition-all">
                    <Search size={20} className="text-slate-600" />
                </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2.5 md:p-3 hover:bg-sky-50 rounded-xl transition-all hover:scale-110 group"
                >
                    {isDark ? (
                        <Sun size={20} className="text-slate-600 group-hover:text-sky-500 transition-colors" />
                    ) : (
                        <Moon size={20} className="text-slate-600 group-hover:text-sky-500 transition-colors" />
                    )}
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 md:p-3 hover:bg-sky-50 rounded-xl transition-all hover:scale-110 group">
                    <Bell size={20} className="text-slate-600 group-hover:text-sky-500 transition-colors" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-white shadow-lg animate-pulse"></span>
                </button>

                {/* User Info */}
                <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 pl-2 md:pl-3 pr-2 md:pr-4 rounded-2xl border border-transparent">
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md ${isAdmin ? 'bg-gradient-to-br from-sky-400 to-blue-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'}`}>
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="text-left hidden xl:block">
                        <p className="text-sm font-semibold text-slate-700">
                            {user?.major ? `${user.major} ${user.majorSequence || '01'}` : (user?.username || 'ผู้ใช้')}
                        </p>
                        <p className="text-xs text-slate-500">
                            {(user?.role === 'super_admin' || user?.role === 'admin') ? 'Admin' : (user?.role === 'system_admin' ? 'System Admin' : 'Officer')}
                        </p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="p-2.5 md:p-3 hover:bg-red-50 rounded-xl transition-all hover:scale-110 group"
                    title="ออกจากระบบ"
                >
                    <LogOut size={20} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                </button>
            </div>
        </header>
    );
}
