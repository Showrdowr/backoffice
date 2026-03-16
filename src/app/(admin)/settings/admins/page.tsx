import { Search, Plus, Edit, Trash2, Shield, User, Mail, CheckCircle } from 'lucide-react';

const admins = [
    { id: 1, name: 'ผู้ดูแลระบบหลัก', email: 'admin@pharmacylms.com', role: 'Super Admin', status: 'active', lastLogin: '22 ธ.ค. 2024 10:30' },
    { id: 2, name: 'สมชาย จัดการ', email: 'somchai@pharmacylms.com', role: 'Admin', status: 'active', lastLogin: '22 ธ.ค. 2024 09:15' },
    { id: 3, name: 'วิภา ดูแล', email: 'vipa@pharmacylms.com', role: 'Editor', status: 'active', lastLogin: '21 ธ.ค. 2024 16:45' },
    { id: 4, name: 'ณัฐพล ช่วยเหลือ', email: 'nattapol@pharmacylms.com', role: 'Support', status: 'inactive', lastLogin: '20 ธ.ค. 2024 11:00' },
];

const roles = [
    { name: 'Super Admin', permissions: 'สิทธิ์เต็ม', color: 'bg-red-100 text-red-800' },
    { name: 'Admin', permissions: 'จัดการผู้ใช้, คอร์ส, การเงิน', color: 'bg-violet-100 text-violet-800' },
    { name: 'Editor', permissions: 'จัดการคอร์ส, เนื้อหา', color: 'bg-blue-100 text-blue-800' },
    { name: 'Support', permissions: 'ดูข้อมูล, ตอบ Ticket', color: 'bg-emerald-100 text-emerald-800' },
];

export default function AdminManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">จัดการผู้ดูแลระบบ</h1>
                    <p className="text-slate-500">จัดการผู้ดูแลและสิทธิ์การใช้งาน</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={18} />
                    <span>เพิ่มผู้ดูแล</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {roles.map((role) => (
                    <div key={role.name} className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield size={20} className="text-slate-400" />
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${role.color}`}>{role.name}</span>
                        </div>
                        <p className="text-sm text-slate-500">{role.permissions}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="ค้นหาผู้ดูแล..." className="bg-transparent border-none outline-none text-sm flex-1" />
                    </div>
                    <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                        <option>Role ทั้งหมด</option>
                        <option>Super Admin</option>
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Support</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">ผู้ดูแล</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">สถานะ</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">เข้าสู่ระบบล่าสุด</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{admin.name}</p>
                                                <p className="text-sm text-slate-500">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.role === 'Super Admin' ? 'bg-red-100 text-red-800' :
                                                admin.role === 'Admin' ? 'bg-violet-100 text-violet-800' :
                                                    admin.role === 'Editor' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                            }`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {admin.status === 'active' ? <><CheckCircle size={14} />ใช้งาน</> : 'ไม่ใช้งาน'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{admin.lastLogin}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={18} className="text-slate-500" /></button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg"><Mail size={18} className="text-slate-500" /></button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} className="text-red-500" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
