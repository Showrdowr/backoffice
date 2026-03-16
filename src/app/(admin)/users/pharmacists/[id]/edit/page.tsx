'use client';

import { use } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPharmacistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const handleSave = () => {
        console.log('Save pharmacist changes:', id);
        alert('บันทึกข้อมูลสำเร็จ');
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/users/pharmacists/${id}`} className="p-2 hover:bg-emerald-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขข้อมูลเภสัชกร</h1>
                        <p className="text-slate-500">แก้ไขข้อมูลส่วนตัวและใบอนุญาต</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/users/pharmacists/${id}`}
                        className="px-5 py-2.5 border border-emerald-200 rounded-xl hover:bg-emerald-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                    >
                        <Save size={18} />
                        <span>บันทึกการเปลี่ยนแปลง</span>
                    </button>
                </div>
            </div>

            {/* Basic Info Form */}
            <div className="bg-white rounded-2xl shadow-md border border-emerald-100">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                ชื่อ-นามสกุล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue="ภญ. สมหญิง ใจงาม"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                อีเมล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                defaultValue="somying@example.com"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                เบอร์โทรศัพท์
                            </label>
                            <input
                                type="tel"
                                defaultValue="082-345-6789"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                สถานที่ทำงาน
                            </label>
                            <input
                                type="text"
                                defaultValue="โรงพยาบาลรามาธิบดี"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* License Info Form */}
            <div className="bg-white rounded-2xl shadow-md border border-emerald-100">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-slate-800">ข้อมูลใบอนุญาต</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                เลขใบอนุญาต <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue="จ.1234567"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                สถานะการยืนยัน
                            </label>
                            <select
                                defaultValue="verified"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all bg-white"
                            >
                                <option value="verified">ยืนยันแล้ว</option>
                                <option value="pending">รอการยืนยัน</option>
                                <option value="rejected">ไม่ผ่าน</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                CPE Credits ปัจจุบัน
                            </label>
                            <input
                                type="number"
                                defaultValue="15"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                สถานะบัญชี
                            </label>
                            <select
                                defaultValue="active"
                                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all bg-white"
                            >
                                <option value="active">ใช้งานอยู่</option>
                                <option value="inactive">ระงับ</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
