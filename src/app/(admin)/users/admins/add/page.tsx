'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api/client';
import PasswordConfirmModal from '@/components/modals/PasswordConfirmModal';

export default function AddAdminPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<string>('');
    const [department, setDepartment] = useState('');
    const [major, setMajor] = useState('');
    const [availableRoles, setAvailableRoles] = useState<{ id: string; name: string; description: string }[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await apiClient.get<{ roles: { id: string; name: string; description: string }[] }>('/admin/roles');
                if (response.success) {
                    setAvailableRoles(response.data.roles);
                    // Select officer by default if available (old name), fallback to system_admin
                    const defaultRole = response.data.roles.find((r) => r.name === 'officer' || r.name === 'system_admin');
                    if (defaultRole) setRole(defaultRole.name);
                    else if (response.data.roles.length > 0) setRole(response.data.roles[0].name);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            } finally {
                setIsLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const isOfficer = role === 'officer' || role === 'system_admin';

        if (!email || !password || (isOfficer && !department)) {
            alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return;
        }

        if (password.length < 8) {
            alert('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
            return;
        }

        // Show password confirmation modal instead of creating directly
        setPasswordError(null);
        setShowPasswordModal(true);
    };

    const handleConfirmCreate = async (confirmPassword: string) => {
        setIsCreating(true);
        setPasswordError(null);
        try {
            const isOfficer = role === 'officer' || role === 'system_admin';
            const data = {
                email,
                password,
                role,
                confirmPassword,
                ...(isOfficer ? { department, major } : {}),
            };

            await apiClient.post('/admin/users', data);
            
            setShowPasswordModal(false);
            alert('สร้างผู้ดูแลระบบสำเร็จ');
            router.push('/users/admins');
        } catch (error: unknown) {
            console.error('Failed to create admin:', error);
            const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างผู้ดูแลระบบ';
            if (errorMessage.includes('รหัสผ่าน')) {
                setPasswordError(errorMessage);
            } else {
                setShowPasswordModal(false);
                alert(errorMessage);
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4 border-b border-sky-100 pb-4">
                <Link href="/users" className="p-2 hover:bg-sky-50 rounded-xl transition-all">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">เพิ่มผู้ดูแลระบบ (Admin)</h1>
                    <p className="text-slate-500 text-sm">สร้างบัญชีผู้ดูแลระบบพร้อมกำหนดสิทธิ์การใช้งาน</p>
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100">
                    <h2 className="text-lg font-bold text-slate-800">ข้อมูลบัญชี</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                อีเมล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                                placeholder="admin@example.com"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                รหัสผ่าน <span className="text-red-500">*</span> <span className="text-xs text-slate-400 font-normal">(อย่างน้อย 8 ตัวอักษร)</span>
                            </label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                                placeholder="กำหนดรหัสผ่านเบื้องต้น"
                            />
                        </div>
                    </div>

                    <div className="border-t border-sky-100 pt-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-4">
                            ระดับสิทธิ์การเข้าถึง <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isLoadingRoles ? (
                                <div className="col-span-2 flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin text-sky-500 mr-2" />
                                    <span className="text-slate-500">กำลังโหลดรายการสิทธิ์...</span>
                                </div>
                            ) : (
                                availableRoles.map((r) => {
                                    const isSelected = role === r.name;
                                    const isSuperAdmin = r.name === 'super_admin' || r.name === 'admin';
                                    
                                    return (
                                        <label 
                                            key={r.id}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                isSelected 
                                                    ? (isSuperAdmin ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-emerald-500 bg-emerald-50 shadow-sm') 
                                                    : 'border-slate-200 hover:border-sky-200 bg-white'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={r.name}
                                                checked={isSelected}
                                                onChange={() => setRole(r.name)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                    isSelected 
                                                        ? (isSuperAdmin ? 'border-sky-500' : 'border-emerald-500') 
                                                        : 'border-slate-300'
                                                }`}>
                                                    {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${isSuperAdmin ? 'bg-sky-500' : 'bg-emerald-500'}`} />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {(r.name === 'super_admin' || r.name === 'admin') ? 'Admin (สิทธิ์สูงสุด)' : (r.name === 'system_admin' || r.name === 'officer' ? 'Officer' : r.name)}
                                                    </p>
                                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                                        {r.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {(role === 'officer' || role === 'system_admin') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100 animate-slide-in">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    แผนก <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required={role === 'officer' || role === 'system_admin'}
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                                    placeholder="เช่น ฝ่ายวิชาการ, ฝ่ายผลิตสื่อ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    สาขาวิชา <span className="text-slate-400 font-normal">(ไม่บังคับ)</span>
                                </label>
                                <input
                                    type="text"
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                                    placeholder="เช่น เภสัชกรรม"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-sky-100 flex items-center justify-end gap-3">
                    <Link href="/users" className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-white text-sm font-semibold transition-all text-slate-600">
                        ยกเลิก
                    </Link>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50"
                    >
                        {isCreating ? (
                            <span>กำลังสร้าง...</span>
                        ) : (
                            <>
                                <Plus size={18} />
                                <span>บันทึกข้อมูลผู้ดูแลระบบ</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Password Confirmation Modal */}
            <PasswordConfirmModal
                isOpen={showPasswordModal}
                title="ยืนยันการสร้างผู้ดูแลระบบ"
                description="กรุณากรอกรหัสผ่านของคุณเพื่อยืนยันว่าต้องการสร้างบัญชีผู้ดูแลระบบใหม่"
                confirmLabel="ยืนยันการสร้าง"
                isLoading={isCreating}
                error={passwordError}
                onConfirm={handleConfirmCreate}
                onCancel={() => { setShowPasswordModal(false); setPasswordError(null); }}
            />
        </div>
    );
}
