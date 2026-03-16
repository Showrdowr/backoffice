import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserTableToolbarProps {
    searchPlaceholder: string;
    onSearch?: (term: string) => void;
    searchValue?: string;
    statusValue?: string;
    onStatusChange?: (status: 'active' | 'inactive' | '') => void;
}

export function UserTableToolbar({ 
    searchPlaceholder, 
    onSearch, 
    searchValue = '', 
    statusValue = '',
    onStatusChange 
}: UserTableToolbarProps) {
    const [localSearch, setLocalSearch] = useState(searchValue);

    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalSearch(val);
        onSearch?.(val);
    };

    return (
        <div className="p-6 border-b border-sky-100 flex flex-wrap items-center gap-4 bg-gradient-to-r from-sky-50 to-blue-50">
            {/* Search Input */}
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 flex-1 min-w-[300px] max-w-md border border-sky-200 shadow-sm transition-all focus-within:border-sky-400 focus-within:shadow-md">
                <Search size={20} className="text-sky-500" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={localSearch}
                    onChange={handleSearchChange}
                    className="bg-transparent border-none outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 hidden sm:inline">สถานะ:</span>
                <select 
                    value={statusValue}
                    onChange={(e) => onStatusChange?.(e.target.value as 'active' | 'inactive' | '')}
                    className="bg-white border border-sky-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none hover:border-sky-300 transition-all shadow-sm focus:border-sky-400"
                >
                    <option value="">ทั้งหมด</option>
                    <option value="active">ใช้งาน</option>
                    <option value="inactive">ไม่ใช้งาน</option>
                </select>
            </div>
        </div>
    );
}
