'use client';

import { use } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const handleSave = () => {
        console.log('Save user changes:', id);
        alert('บันทึกข้อมูลสำเร็จ');
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/users/${id}`} className="p-2 hover:bg-sky-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขข้อมูลผู้ใช้</h1>
                        <p className="text-slate-500">แก้ไขข้อมูลส่วนตัวของผู้ใช้</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/users/${id}`}
                        className="px-5 py-2.5 border border-sky-200 rounded-xl hover:bg-sky-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                    >
                        <Save size={18} />
                        <span>บันทึกการเปลี่ยนแปลง</span>
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
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
                                defaultValue="สมชาย ใจดี"
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                placeholder="กรอกชื่อ-นามสกุล"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                อีเมล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                defaultValue="somchai@example.com"
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                placeholder="กรอกอีเมล"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                เบอร์โทรศัพท์
                            </label>
                            <input
                                type="tel"
                                defaultValue="081-234-5678"
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                placeholder="กรอกเบอร์โทรศัพท์"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                สถานะ
                            </label>
                            <select
                                defaultValue="active"
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                            >
                                <option value="active">ใช้งานอยู่</option>
                                <option value="inactive">ระงับ</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ที่อยู่
                        </label>
                        <textarea
                            rows={3}
                            defaultValue="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110"
                            className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                            placeholder="กรอกที่อยู่"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
