import { Search, Filter } from 'lucide-react';

export function CourseFilters() {
    return (
        <div className="p-6 border-b border-violet-100 flex flex-wrap items-center gap-4 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 flex-1 max-w-md border border-violet-200 shadow-sm">
                <Search size={20} className="text-violet-500" />
                <input
                    type="text"
                    placeholder="ค้นหาคอร์ส..."
                    className="bg-transparent border-none outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
                />
            </div>
            <select className="px-5 py-3 border border-violet-200 bg-white rounded-xl text-sm font-medium hover:bg-violet-50 transition-all shadow-sm">
                <option>หมวดหมู่ทั้งหมด</option>
                <option>วิทยาลัยเภสัชบำบัด</option>
                <option>วิทยาลัยคุ้มครองผู้บริโภคด้านยาฯ</option>
                <option>วิทยาลัยเภสัชกรรมสมุนไพร</option>
                <option>วิทยาลัยเภสัชกรรมอุตสาหการ</option>
                <option>วิทยาลัยเภสัชกรรมชุมชน</option>
                <option>วิทยาลัยการบริหารเภสัชกิจ</option>
                <option>วิทยาลัยเภสัชพันธุศาสตร์และเภสัชกรรมแม่นยำ</option>
                <option>อื่นๆ</option>
            </select>
            <select className="px-5 py-3 border border-violet-200 bg-white rounded-xl text-sm font-medium hover:bg-violet-50 transition-all shadow-sm">
                <option>สถานะทั้งหมด</option>
                <option>เผยแพร่แล้ว</option>
                <option>ฉบับร่าง</option>
            </select>
        </div>
    );
}
