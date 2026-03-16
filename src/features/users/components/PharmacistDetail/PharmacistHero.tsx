import { Edit, Mail, CheckCircle, XCircle, Award, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Pharmacist } from '../../types';

interface PharmacistHeroProps {
    pharmacist: Pharmacist & {
        phone?: string;
        lastLogin?: string;
        completedCourses?: number;
        workplace?: string;
    };
    onEmail: () => void;
    onVerify: () => void;
}

export function PharmacistHero({ pharmacist, onEmail, onVerify }: PharmacistHeroProps) {
    const getVerificationColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-red-100 text-red-700';
        }
    };

    const getVerificationText = (status: string) => {
        switch (status) {
            case 'verified':
                return 'ยืนยันแล้ว';
            case 'pending':
                return 'รอการยืนยัน';
            default:
                return 'ไม่ผ่าน';
        }
    };

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
                {/* Pharmacist Avatar */}
                <div className="lg:col-span-1">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
                            <span className="text-8xl text-white/80">👨‍⚕️</span>
                        </div>
                    </div>
                </div>

                {/* Pharmacist Info */}
                <div className="lg:col-span-2 text-white">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(pharmacist.verificationStatus)}`}>
                                    {getVerificationText(pharmacist.verificationStatus)}
                                </span>
                                <span className="text-sm text-white/80">ID: {pharmacist.id}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{pharmacist.name}</h1>
                            <p className="text-white/90 text-lg mb-2">เลขใบอนุญาต: {pharmacist.license}</p>
                            <p className="text-white/90 mb-2">{pharmacist.email}</p>
                            {pharmacist.phone && (
                                <p className="text-white/80">📞 {pharmacist.phone}</p>
                            )}
                            {pharmacist.workplace && (
                                <p className="text-white/80">🏥 {pharmacist.workplace}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Award size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pharmacist.cpeCredits}</p>
                                    <p className="text-xs text-white/70">CPE Credits</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <BookOpen size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pharmacist.courses}</p>
                                    <p className="text-xs text-white/70">คอร์สทั้งหมด</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Clock size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{pharmacist.lastLogin ? new Date(pharmacist.lastLogin).toLocaleDateString('th-TH') : 'N/A'}</p>
                                    <p className="text-xs text-white/70">เข้าใช้ล่าสุด</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/users/pharmacists/${pharmacist.id}/edit`}
                            className="flex items-center gap-2 bg-white text-emerald-600 px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                            <Edit size={18} />
                            แก้ไขข้อมูล
                        </Link>
                        <button
                            onClick={onEmail}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all font-semibold"
                        >
                            <Mail size={18} />
                            ส่งอีเมล
                        </button>
                        {pharmacist.verificationStatus === 'pending' && (
                            <button
                                onClick={onVerify}
                                className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-white px-5 py-2.5 rounded-xl hover:bg-green-500/30 transition-all font-semibold"
                            >
                                <CheckCircle size={18} />
                                ยืนยันใบอนุญาต
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
