// Shared UI Components - SearchInput
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchInput({
    value,
    onChange,
    placeholder = 'ค้นหา...',
    className = '',
}: SearchInputProps) {
    return (
        <div className={`flex items-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 transition-colors
            w-full md:w-auto min-h-[44px] ${className}`}>
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-transparent border-none outline-none text-base md:text-sm flex-1 min-w-0 text-slate-700 placeholder:text-slate-400"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="p-1 hover:bg-slate-200 rounded-md transition-colors flex-shrink-0"
                    aria-label="ล้างการค้นหา"
                >
                    <X size={16} className="text-slate-500" />
                </button>
            )}
        </div>
    );
}

