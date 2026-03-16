import { Edit, Mail, Ban, CheckCircle, Users as UsersIcon, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import type { User } from '../../types';

interface UserHeroProps {
    user: User & {
        phone?: string;
        lastLogin?: string;
        completedCourses?: number;
    };
    onEmail: () => void;
    onSuspend: () => void;
}

export function UserHero({ user, onEmail, onSuspend }: UserHeroProps) {
    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'ใช้งานอยู่' : 'ระงับ';
    };

    return (
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
                {/* User Avatar */}
                <div className="lg:col-span-1">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
                            <span className="text-8xl text-white/80">👤</span>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="lg:col-span-2 text-white">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                                    {getStatusText(user.status)}
                                </span>
                                <span className="text-sm text-white/80">ID: {user.id}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                            <p className="text-white/90 text-lg mb-2">{user.email}</p>
                            {user.phone && (
                                <p className="text-white/80">📞 {user.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <UsersIcon size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{user.courses}</p>
                                    <p className="text-xs text-white/70">คอร์สที่ลงทะเบียน</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Award size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{user.completedCourses || 0}</p>
                                    <p className="text-xs text-white/70">คอร์สที่จบแล้ว</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Clock size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('th-TH') : 'N/A'}</p>
                                    <p className="text-xs text-white/70">เข้าใช้ล่าสุด</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/users/${user.id}/edit`}
                            className="flex items-center gap-2 bg-white text-sky-600 px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold"
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
                        <button
                            onClick={onSuspend}
                            className={`flex items-center gap-2 backdrop-blur-sm border px-5 py-2.5 rounded-xl transition-all font-semibold ${user.status === 'active'
                                    ? 'bg-red-500/20 border-red-400/30 text-white hover:bg-red-500/30'
                                    : 'bg-green-500/20 border-green-400/30 text-white hover:bg-green-500/30'
                                }`}
                        >
                            {user.status === 'active' ? (
                                <>
                                    <Ban size={18} />
                                    ระงับบัญชี
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    เปิดใช้งาน
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
