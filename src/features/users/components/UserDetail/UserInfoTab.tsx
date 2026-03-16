import { Calendar, Mail, Phone, User as UserIcon } from 'lucide-react';
import type { User } from '../../types';

interface UserInfoTabProps {
    user: User & {
        phone?: string;
        address?: string;
        lastLogin?: string;
    };
}

export function UserInfoTab({ user }: UserInfoTabProps) {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-sky-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <UserIcon size={20} className="text-sky-500" />
                    ข้อมูลส่วนตัว
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">ชื่อ-นามสกุล</p>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">อีเมล</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-2">
                            <Mail size={16} className="text-sky-500" />
                            {user.email}
                        </p>
                    </div>
                    {user.phone && (
                        <div>
                            <p className="text-sm text-slate-600 mb-1">เบอร์โทรศัพท์</p>
                            <p className="font-semibold text-slate-800 flex items-center gap-2">
                                <Phone size={16} className="text-sky-500" />
                                {user.phone}
                            </p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-slate-600 mb-1">สถานะ</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {user.status === 'active' ? 'ใช้งานอยู่' : 'ระงับ'}
                        </span>
                    </div>
                </div>
                {user.address && (
                    <div className="mt-4">
                        <p className="text-sm text-slate-600 mb-1">ที่อยู่</p>
                        <p className="font-semibold text-slate-800">{user.address}</p>
                    </div>
                )}
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-xl border border-sky-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">สถิติการเรียน</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">คอร์สที่ลงทะเบียน</p>
                        <p className="text-3xl font-bold text-sky-600">{user.courses}</p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">กำลังเรียน</p>
                        <p className="text-3xl font-bold text-violet-600">
                            {user.courses - ((user as any).completedCourses || 0)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">เรียนจบแล้ว</p>
                        <p className="text-3xl font-bold text-emerald-600">{(user as any).completedCourses || 0}</p>
                    </div>
                </div>
            </div>

            {/* Timestamps */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={20} className="text-sky-500" />
                    <h3 className="text-lg font-bold text-slate-800">ข้อมูลเวลา</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">สมัครสมาชิกเมื่อ</p>
                        <p className="font-semibold text-slate-800">
                            {new Date(user.joined).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">เข้าใช้งานล่าสุด</p>
                        <p className="font-semibold text-slate-800">
                            {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'ยังไม่เคยเข้าใช้งาน'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
