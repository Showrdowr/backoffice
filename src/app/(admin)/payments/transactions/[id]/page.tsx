'use client';

import { use, useEffect, useState } from 'react';
import { ArrowLeft, CreditCard, User, BookOpen, Calendar, CheckCircle, XCircle, Clock, Receipt, FileText, Copy, Download } from 'lucide-react';
import Link from 'next/link';
import { paymentService } from '@/features/payments/services/paymentService';

interface TransactionDetail {
    id: string;
    user: { name: string; email: string; phone: string };
    course: { title: string; category: string; instructor: string };
    amount: number;
    originalPrice: number;
    discount: number;
    couponCode: string | null;
    method: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    transactionRef: string;
    paymentDetails: {
        cardLast4?: string;
        bankName?: string;
        promptpayRef?: string;
    };
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle size={18} />
                    ชำระเงินสำเร็จ
                </span>
            );
        case 'pending':
            return (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-100 text-amber-800">
                    <Clock size={18} />
                    รอการยืนยัน
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-800">
                    <XCircle size={18} />
                    ล้มเหลว
                </span>
            );
        default:
            return null;
    }
};

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [txn, setTxn] = useState<TransactionDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTransaction = async () => {
            try {
                setIsLoading(true);
                const data = await paymentService.getTransactionById(id) as unknown as TransactionDetail;
                setTxn(data);
            } catch (err) {
                console.error('Failed to load transaction:', err);
                setError('ไม่สามารถโหลดข้อมูลธุรกรรมได้');
            } finally {
                setIsLoading(false);
            }
        };
        loadTransaction();
    }, [id]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('คัดลอกแล้ว!');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !txn) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-red-500">{error || 'ไม่พบข้อมูลธุรกรรม'}</p>
                <Link href="/payments/transactions" className="text-blue-600 hover:underline">
                    กลับไปหน้ารายการธุรกรรม
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/payments/transactions" className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-800">รายละเอียดธุรกรรม</h1>
                            <span className="font-mono text-lg text-slate-500">{txn.id}</span>
                        </div>
                        <p className="text-slate-500">{txn.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {getStatusBadge(txn.status)}
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                        <Download size={18} />
                        <span>ดาวน์โหลดใบเสร็จ</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <Receipt className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">สรุปการชำระเงิน</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600">ราคาเต็ม</span>
                                    <span className="text-slate-800">฿{txn.originalPrice.toLocaleString()}</span>
                                </div>
                                {txn.discount > 0 && (
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                        <div>
                                            <span className="text-slate-600">ส่วนลด</span>
                                            {txn.couponCode && (
                                                <span className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-800 rounded text-xs font-medium">
                                                    {txn.couponCode}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-emerald-600">-฿{txn.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-lg font-semibold text-slate-800">ยอดชำระ</span>
                                    <span className="text-2xl font-bold text-blue-600">฿{txn.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ข้อมูลคอร์สเรียน</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">{txn.course.title}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">หมวดหมู่</p>
                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-medium">{txn.course.category}</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">ผู้สอน</p>
                                    <p className="font-medium text-slate-800">{txn.course.instructor}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ข้อมูลการชำระเงิน</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <span className="text-slate-600">ช่องทาง</span>
                                <span className="font-medium text-slate-800">{txn.method}</span>
                            </div>
                            {txn.paymentDetails.cardLast4 && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600">หมายเลขบัตร</span>
                                    <span className="font-mono text-slate-800">**** **** **** {txn.paymentDetails.cardLast4}</span>
                                </div>
                            )}
                            {txn.paymentDetails.bankName && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600">ธนาคาร</span>
                                    <span className="font-medium text-slate-800">{txn.paymentDetails.bankName}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-3">
                                <span className="text-slate-600">เลขอ้างอิง</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-slate-800">{txn.transactionRef}</span>
                                    <button
                                        onClick={() => copyToClipboard(txn.transactionRef)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                                        title="คัดลอก"
                                    >
                                        <Copy size={16} className="text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - User Info */}
                <div className="space-y-6">
                    {/* User Card */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <User className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ข้อมูลผู้ซื้อ</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {txn.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{txn.user.name}</h3>
                                    <p className="text-sm text-slate-500">{txn.user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-slate-500">อีเมล</span>
                                    <span className="text-sm text-slate-800">{txn.user.email}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-slate-500">โทรศัพท์</span>
                                    <span className="text-sm text-slate-800">{txn.user.phone}</span>
                                </div>
                            </div>
                            <Link
                                href="/users/pharmacists/1"
                                className="mt-4 block w-full text-center py-2.5 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-all"
                            >
                                ดูโปรไฟล์ผู้ใช้
                            </Link>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">ไทม์ไลน์</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">ชำระเงินสำเร็จ</p>
                                        <p className="text-sm text-slate-500">{txn.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FileText size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">สร้างรายการ</p>
                                        <p className="text-sm text-slate-500">{txn.date.split(' ')[0]} {txn.date.split(' ')[1]} {txn.date.split(' ')[2].split(':')[0]}:{String(parseInt(txn.date.split(' ')[2].split(':')[1]) - 1).padStart(2, '0')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {txn.status === 'pending' && (
                        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                            <h3 className="font-semibold text-amber-800 mb-3">รอการยืนยัน</h3>
                            <p className="text-sm text-amber-700 mb-4">ธุรกรรมนี้ยังรอการยืนยันการชำระเงิน</p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                                    ยืนยัน
                                </button>
                                <button className="flex-1 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">
                                    ปฏิเสธ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
