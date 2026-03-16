// Responsive Table Component
'use client';

import React, { useState, useEffect } from 'react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
    hideOnMobile?: boolean; // ซ่อนคอลัมน์นี้บน mobile
}

interface ResponsiveTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    mobileCardRender?: (item: T) => React.ReactNode; // Custom mobile card layout
    responsiveMode?: 'auto' | 'scroll' | 'card'; // auto = card on mobile, scroll on tablet+
}

export default function ResponsiveTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = 'ไม่พบข้อมูล',
    mobileCardRender,
    responsiveMode = 'auto',
}: ResponsiveTableProps<T>) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mobile Card View
    if (responsiveMode === 'card' || (responsiveMode === 'auto' && isMobile && mobileCardRender)) {
        return (
            <div className="space-y-3">
                {data.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        {emptyMessage}
                    </div>
                ) : (
                    data.map((item) => (
                        <div key={keyExtractor(item)} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                            {mobileCardRender ? mobileCardRender(item) : (
                                // Fallback: แสดงทุก column แบบ vertical
                                <div className="space-y-2">
                                    {columns.map((col) => (
                                        <div key={String(col.key)} className="flex justify-between">
                                            <span className="text-sm font-medium text-slate-500">{col.header}:</span>
                                            <span className="text-sm text-slate-800">
                                                {col.render
                                                    ? col.render(item)
                                                    : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        );
    }

    // Desktop Table View (with responsive scrolling)
    return (
        <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-sky-50 border-b border-sky-100">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`text-left px-4 md:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wide
                                        ${col.hideOnMobile ? 'hidden md:table-cell' : ''} 
                                        ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={keyExtractor(item)} className="hover:bg-sky-50/30 transition-colors">
                                    {columns.map((col) => (
                                        <td 
                                            key={String(col.key)} 
                                            className={`px-4 md:px-6 py-4 text-sm
                                                ${col.hideOnMobile ? 'hidden md:table-cell' : ''} 
                                                ${col.className || ''}`}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
