import { Plus, Edit, Trash2, Bell } from 'lucide-react';

const announcements = [
    { id: 1, title: 'ปิดปรับปรุงระบบ 25 ธ.ค. 2024', type: 'warning', status: 'active', created: '20 ธ.ค. 2024' },
    { id: 2, title: 'คอร์สใหม่! เภสัชกรรมคลินิก 2025', type: 'info', status: 'active', created: '18 ธ.ค. 2024' },
    { id: 3, title: 'โปรโมชั่นส่งท้ายปี ลด 30%', type: 'success', status: 'expired', created: '15 ธ.ค. 2024' },
];

export default function AnnouncementsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">ประกาศ</h1>
                    <p className="text-slate-500">จัดการประกาศบนเว็บไซต์</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={18} />
                    <span>สร้างประกาศ</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="divide-y divide-slate-100">
                    {announcements.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'warning' ? 'bg-amber-100' :
                                        item.type === 'info' ? 'bg-blue-100' : 'bg-emerald-100'
                                    }`}>
                                    <Bell size={20} className={
                                        item.type === 'warning' ? 'text-amber-600' :
                                            item.type === 'info' ? 'text-blue-600' : 'text-emerald-600'
                                    } />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{item.title}</p>
                                    <p className="text-sm text-slate-500">{item.created}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {item.status === 'active' ? 'แสดงอยู่' : 'หมดอายุ'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={16} className="text-slate-500" /></button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
