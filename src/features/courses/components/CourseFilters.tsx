import { Search } from 'lucide-react';

export interface CourseFilterCategoryOption {
    id: string;
    name: string;
}

interface CourseFiltersProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    categoryValue: string;
    onCategoryChange: (value: string) => void;
    statusValue: string;
    onStatusChange: (value: 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => void;
    categories: CourseFilterCategoryOption[];
}

export function CourseFilters({
    searchValue,
    onSearchChange,
    categoryValue,
    onCategoryChange,
    statusValue,
    onStatusChange,
    categories,
}: CourseFiltersProps) {
    return (
        <div className="p-6 border-b border-violet-100 flex flex-wrap items-center gap-4 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 flex-1 max-w-md border border-violet-200 shadow-sm">
                <Search size={20} className="text-violet-500" />
                <input
                    type="text"
                    placeholder="ค้นหาคอร์ส..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
                />
            </div>
            <select
                value={categoryValue}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="px-5 py-3 border border-violet-200 bg-white rounded-xl text-sm font-medium hover:bg-violet-50 transition-all shadow-sm min-w-[300px]"
            >
                <option value="ALL">หมวดหมู่ทั้งหมด</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <select
                value={statusValue}
                onChange={(e) => onStatusChange(e.target.value as 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                className="px-5 py-3 border border-violet-200 bg-white rounded-xl text-sm font-medium hover:bg-violet-50 transition-all shadow-sm"
            >
                <option value="ALL">สถานะทั้งหมด</option>
                <option value="PUBLISHED">เผยแพร่แล้ว</option>
                <option value="DRAFT">ฉบับร่าง</option>
                <option value="ARCHIVED">เก็บถาวร</option>
            </select>
        </div>
    );
}
