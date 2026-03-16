'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useState, useEffect } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    // สถานะสำหรับ desktop sidebar collapse
    const [isCollapsed, setIsCollapsed] = useState(false);
    // สถานะสำหรับ mobile sidebar open
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // อ่านค่าจาก localStorage
        const savedState = localStorage.getItem('sidebar-collapsed');
        setIsCollapsed(savedState === 'true');

        // ฟังการเปลี่ยนแปลงของ localStorage
        const handleStorageChange = () => {
            const newState = localStorage.getItem('sidebar-collapsed');
            setIsCollapsed(newState === 'true');
        };

        window.addEventListener('storage', handleStorageChange);
        
        // ใช้ custom event สำหรับการเปลี่ยนแปลงภายใน tab เดียวกัน
        const handleCustomEvent = () => {
            const newState = localStorage.getItem('sidebar-collapsed');
            setIsCollapsed(newState === 'true');
        };

        window.addEventListener('sidebar-toggle', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('sidebar-toggle', handleCustomEvent);
        };
    }, []);

    // ปิด mobile menu เมื่อ resize เป็น desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-sky-50/50">
            <Sidebar 
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />
            <Topbar 
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <main 
                style={{ paddingTop: '96px' }}
                className={`p-4 md:p-6 lg:p-8 transition-all duration-300 ${
                    isCollapsed 
                        ? 'ml-0 lg:ml-[80px]' 
                        : 'ml-0 lg:ml-[280px]'
                }`}
            >
                {children}
            </main>
        </div>
    );
}

