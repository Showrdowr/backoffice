import { Save } from 'lucide-react';

export default function SettingsGeneralPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">ตั้งค่าทั่วไป</h1>
                <p className="text-slate-500">ตั้งค่าพื้นฐานของระบบ</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">ข้อมูลสถาบัน</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อสถาบัน</label>
                            <input type="text" defaultValue="Pharmacy LMS" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">อีเมลติดต่อ</label>
                            <input type="email" defaultValue="admin@pharmacylms.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                            <input type="tel" defaultValue="02-123-4567" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">ที่อยู่</label>
                            <input type="text" defaultValue="กรุงเทพมหานคร" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    <Save size={18} />
                    <span>บันทึกการตั้งค่า</span>
                </button>
            </div>
        </div>
    );
}
