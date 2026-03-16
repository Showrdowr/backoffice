'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Percent, Calendar, CheckCircle, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const initialCoupons = [
    { id: 1, code: 'NEWYEAR2025', discount: 30, type: 'percent', usage: 156, limit: 500, status: 'active', expires: '31 ธ.ค. 2024' },
    { id: 2, code: 'WELCOME50', discount: 50, type: 'fixed', usage: 892, limit: 1000, status: 'active', expires: '31 ม.ค. 2025' },
    { id: 3, code: 'PHARMACY20', discount: 20, type: 'percent', usage: 234, limit: 300, status: 'active', expires: '28 ก.พ. 2025' },
    { id: 4, code: 'SUMMER2024', discount: 25, type: 'percent', usage: 500, limit: 500, status: 'expired', expires: '31 ส.ค. 2024' },
];

interface Coupon {
    id: number;
    code: string;
    discount: number;
    type: string;
    usage: number;
    limit: number;
    status: string;
    expires: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState(initialCoupons);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

    const handleDeleteClick = (coupon: Coupon) => {
        setCouponToDelete(coupon);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (couponToDelete) {
            setCoupons(coupons.filter(c => c.id !== couponToDelete.id));
            setShowDeleteModal(false);
            setCouponToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">คูปองส่วนลด</h1>
                    <p className="text-slate-500">จัดการคูปองส่วนลดสำหรับคอร์สเรียน</p>
                </div>
                <Link href="/payments/coupons/add" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                    <Plus size={18} />
                    <span>สร้างคูปอง</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">คูปองทั้งหมด</p>
                    <p className="text-2xl font-bold text-slate-800">{coupons.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">ใช้งานอยู่</p>
                    <p className="text-2xl font-bold text-emerald-600">{coupons.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">ใช้แล้วเดือนนี้</p>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">มูลค่าส่วนลด</p>
                    <p className="text-2xl font-bold text-violet-600">฿45,600</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="ค้นหารหัสคูปอง..." className="bg-transparent border-none outline-none text-sm flex-1" />
                    </div>
                    <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                        <option>สถานะทั้งหมด</option>
                        <option>ใช้งานอยู่</option>
                        <option>หมดอายุ</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">รหัสคูปอง</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">ส่วนลด</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">การใช้งาน</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">หมดอายุ</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">สถานะ</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} className="text-violet-500" />
                                            <span className="font-mono font-medium text-slate-800">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {coupon.type === 'percent' ? (
                                                <><Percent size={16} className="text-slate-400" /><span className="font-medium">{coupon.discount}%</span></>
                                            ) : (
                                                <span className="font-medium">฿{coupon.discount}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{coupon.usage} / {coupon.limit}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={14} />
                                            <span className="text-sm">{coupon.expires}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {coupon.status === 'active' ? <><CheckCircle size={14} />ใช้งานอยู่</> : 'หมดอายุ'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/payments/coupons/${coupon.id}/edit`}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-all"
                                                title="แก้ไข"
                                            >
                                                <Edit size={18} className="text-blue-500" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(coupon)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                                title="ลบ"
                                            >
                                                <Trash2 size={18} className="text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && couponToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">ยืนยันการลบคูปอง</h3>
                                    <p className="text-sm text-slate-500">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag size={18} className="text-violet-500" />
                                    <span className="font-mono font-bold text-lg">{couponToDelete.code}</span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    ส่วนลด: {couponToDelete.type === 'percent' ? `${couponToDelete.discount}%` : `฿${couponToDelete.discount}`}
                                </p>
                                <p className="text-sm text-slate-600">
                                    ใช้แล้ว: {couponToDelete.usage} / {couponToDelete.limit} ครั้ง
                                </p>
                            </div>
                            <p className="text-slate-600 mb-6">
                                คุณต้องการลบคูปอง <span className="font-semibold">{couponToDelete.code}</span> ใช่หรือไม่?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setCouponToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all"
                                >
                                    ลบคูปอง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
