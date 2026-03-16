import { Save, Mail, Send, TestTube } from 'lucide-react';

export default function EmailSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">ตั้งค่าอีเมล</h1>
                <p className="text-slate-500">ตั้งค่า SMTP และเทมเพลตอีเมล</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">การตั้งค่า SMTP</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Host</label>
                            <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                            <input type="text" defaultValue="587" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                            <input type="text" defaultValue="noreply@pharmacylms.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input type="password" defaultValue="••••••••" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อผู้ส่ง</label>
                            <input type="text" defaultValue="Pharmacy LMS" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">อีเมลผู้ส่ง</label>
                            <input type="email" defaultValue="noreply@pharmacylms.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <TestTube size={18} />
                            <span>ทดสอบการส่งอีเมล</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">เทมเพลตอีเมล</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {['ยินดีต้อนรับ', 'ยืนยันการลงทะเบียน', 'รีเซ็ตรหัสผ่าน', 'แจ้งเตือนหลักสูตรใหม่', 'ใบเสร็จรับเงิน'].map((template) => (
                        <div key={template} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-slate-400" />
                                <span className="font-medium text-slate-800">{template}</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">แก้ไข</button>
                        </div>
                    ))}
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
