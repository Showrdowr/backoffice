import { Save, Shield, Key, Lock, Smartphone, AlertTriangle } from 'lucide-react';

export default function SecuritySettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">ตั้งค่าความปลอดภัย</h1>
                <p className="text-slate-500">ตั้งค่าความปลอดภัยของระบบ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                <Key size={20} className="text-violet-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">นโยบายรหัสผ่าน</h2>
                                <p className="text-sm text-slate-500">กำหนดความซับซ้อนของรหัสผ่าน</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">ความยาวขั้นต่ำ</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                                <option>8 ตัวอักษร</option>
                                <option>10 ตัวอักษร</option>
                                <option>12 ตัวอักษร</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                                <span className="text-sm text-slate-700">ต้องมีตัวพิมพ์ใหญ่</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                                <span className="text-sm text-slate-700">ต้องมีตัวเลข</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                                <span className="text-sm text-slate-700">ต้องมีอักขระพิเศษ</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Smartphone size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">การยืนยันตัวตนสองขั้นตอน</h2>
                                <p className="text-sm text-slate-500">2FA สำหรับผู้ดูแลระบบ</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">บังคับใช้ 2FA สำหรับ Admin</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">SMS OTP</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Google Authenticator</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Lock size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Session Management</h2>
                                <p className="text-sm text-slate-500">จัดการ session ผู้ใช้</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">หมดอายุ Session หลังจาก</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                                <option>30 นาที</option>
                                <option>1 ชั่วโมง</option>
                                <option>2 ชั่วโมง</option>
                                <option>8 ชั่วโมง</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">จำนวน Login ผิดพลาดสูงสุด</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                                <option>3 ครั้ง</option>
                                <option>5 ครั้ง</option>
                                <option>10 ครั้ง</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Danger Zone</h2>
                                <p className="text-sm text-slate-500">การดำเนินการที่มีความเสี่ยง</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                            บังคับ Logout ทุก Session
                        </button>
                        <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                            รีเซ็ต 2FA ทั้งหมด
                        </button>
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
