'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Save, Tag, Percent, Calendar, Gift, Users, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data
const mockCoupons: Record<string, {
    code: string;
    description: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    usageLimit: number;
    minPurchase: number;
    maxDiscount: number;
    expiryDate: string;
    applicableTo: 'all' | 'specific';
    userLimit: number;
}> = {
    '1': {
        code: 'NEWYEAR2025',
        description: 'โปรโมชั่นต้อนรับปีใหม่ 2025',
        discountType: 'percent',
        discountValue: 30,
        usageLimit: 500,
        minPurchase: 200,
        maxDiscount: 300,
        expiryDate: '2024-12-31',
        applicableTo: 'all',
        userLimit: 1,
    },
    '2': {
        code: 'WELCOME50',
        description: 'ส่วนลดสำหรับสมาชิกใหม่',
        discountType: 'fixed',
        discountValue: 50,
        usageLimit: 1000,
        minPurchase: 100,
        maxDiscount: 0,
        expiryDate: '2025-01-31',
        applicableTo: 'all',
        userLimit: 1,
    },
};

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
    const [discountValue, setDiscountValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [minPurchase, setMinPurchase] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [description, setDescription] = useState('');
    const [applicableTo, setApplicableTo] = useState<'all' | 'specific'>('all');
    const [userLimit, setUserLimit] = useState('1');

    useEffect(() => {
        // Load coupon data
        const coupon = mockCoupons[id];
        if (coupon) {
            setCode(coupon.code);
            setDescription(coupon.description);
            setDiscountType(coupon.discountType);
            setDiscountValue(String(coupon.discountValue));
            setUsageLimit(String(coupon.usageLimit));
            setMinPurchase(String(coupon.minPurchase));
            setMaxDiscount(String(coupon.maxDiscount));
            setExpiryDate(coupon.expiryDate);
            setApplicableTo(coupon.applicableTo);
            setUserLimit(String(coupon.userLimit));
        }
        setLoading(false);
    }, [id]);

    const handleSave = () => {
        const couponData = {
            code,
            discountType,
            discountValue: Number(discountValue),
            usageLimit: Number(usageLimit),
            minPurchase: Number(minPurchase),
            maxDiscount: discountType === 'percent' ? Number(maxDiscount) : null,
            expiryDate,
            description,
            applicableTo,
            userLimit: Number(userLimit),
        };
        console.log('Update coupon:', couponData);
        alert('อัปเดตคูปองสำเร็จ!');
        router.push('/payments/coupons');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/payments/coupons" className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขคูปอง</h1>
                        <p className="text-slate-500">แก้ไขรายละเอียดและเงื่อนไขคูปอง {code}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/payments/coupons"
                        className="px-5 py-2.5 border border-blue-200 rounded-xl hover:bg-blue-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!code.trim() || !discountValue || !expiryDate}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Tag className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ข้อมูลคูปอง</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    รหัสคูปอง <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-mono uppercase"
                                    placeholder="เช่น NEWYEAR2025"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    คำอธิบาย
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                    placeholder="คำอธิบายสำหรับคูปองนี้"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Settings */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Percent className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">การตั้งค่าส่วนลด</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    ประเภทส่วนลด <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setDiscountType('percent')}
                                        className={`p-4 rounded-xl border-2 transition-all ${discountType === 'percent'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-blue-200'
                                            }`}
                                    >
                                        <Percent className={`mx-auto mb-2 ${discountType === 'percent' ? 'text-blue-600' : 'text-slate-400'}`} size={24} />
                                        <p className={`font-semibold ${discountType === 'percent' ? 'text-blue-600' : 'text-slate-600'}`}>เปอร์เซ็นต์</p>
                                    </button>
                                    <button
                                        onClick={() => setDiscountType('fixed')}
                                        className={`p-4 rounded-xl border-2 transition-all ${discountType === 'fixed'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-blue-200'
                                            }`}
                                    >
                                        <Gift className={`mx-auto mb-2 ${discountType === 'fixed' ? 'text-blue-600' : 'text-slate-400'}`} size={24} />
                                        <p className={`font-semibold ${discountType === 'fixed' ? 'text-blue-600' : 'text-slate-600'}`}>จำนวนเงิน</p>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {discountType === 'percent' ? 'ส่วนลด (%)' : 'ส่วนลด (บาท)'} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                        min="0"
                                        max={discountType === 'percent' ? '100' : undefined}
                                    />
                                </div>
                                {discountType === 'percent' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            ส่วนลดสูงสุด (บาท)
                                        </label>
                                        <input
                                            type="number"
                                            value={maxDiscount}
                                            onChange={(e) => setMaxDiscount(e.target.value)}
                                            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                            min="0"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    ยอดขั้นต่ำในการใช้ (บาท)
                                </label>
                                <input
                                    type="number"
                                    value={minPurchase}
                                    onChange={(e) => setMinPurchase(e.target.value)}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Usage Scope */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Layers className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ขอบเขตการใช้งาน</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setApplicableTo('all')}
                                    className={`p-3 rounded-xl border-2 transition-all text-left ${applicableTo === 'all'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-blue-200'
                                        }`}
                                >
                                    <p className={`font-semibold ${applicableTo === 'all' ? 'text-blue-600' : 'text-slate-600'}`}>คอร์สทั้งหมด</p>
                                </button>
                                <button
                                    onClick={() => setApplicableTo('specific')}
                                    className={`p-3 rounded-xl border-2 transition-all text-left ${applicableTo === 'specific'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-blue-200'
                                        }`}
                                >
                                    <p className={`font-semibold ${applicableTo === 'specific' ? 'text-blue-600' : 'text-slate-600'}`}>เลือกคอร์ส</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Usage Limits */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Users className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ขีดจำกัดการใช้</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    จำนวนครั้งที่ใช้ได้ทั้งหมด
                                </label>
                                <input
                                    type="number"
                                    value={usageLimit}
                                    onChange={(e) => setUsageLimit(e.target.value)}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    จำนวนครั้งต่อผู้ใช้
                                </label>
                                <input
                                    type="number"
                                    value={userLimit}
                                    onChange={(e) => setUserLimit(e.target.value)}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expiry */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ระยะเวลา</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                วันหมดอายุ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-md text-white p-6">
                        <h3 className="font-bold mb-4">ตัวอย่างคูปอง</h3>
                        <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Tag size={16} />
                                <span className="font-mono font-bold">{code || 'COUPONCODE'}</span>
                            </div>
                            <div className="text-2xl font-bold mb-1">
                                {discountType === 'percent'
                                    ? `${discountValue || '0'}% OFF`
                                    : `฿${discountValue || '0'} OFF`
                                }
                            </div>
                            {maxDiscount && discountType === 'percent' && (
                                <p className="text-sm opacity-80">สูงสุด ฿{maxDiscount}</p>
                            )}
                            {minPurchase && (
                                <p className="text-sm opacity-80">ขั้นต่ำ ฿{minPurchase}</p>
                            )}
                            {expiryDate && (
                                <p className="text-xs opacity-70 mt-2">หมดอายุ: {expiryDate}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
