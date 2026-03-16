'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Plus, X, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/features/courses/services/categoryService';

interface SubcategoryItemProps {
    sub: { id: string; name: string; description: string };
    onUpdate: (id: string, name: string, description: string) => void;
    onRemove: (id: string) => void;
}

function SubcategoryItem({ sub, onUpdate, onRemove }: SubcategoryItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(sub.name);
    const [editDesc, setEditDesc] = useState(sub.description || '');

    const handleSave = () => {
        onUpdate(sub.id, editName, editDesc);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(sub.name);
        setEditDesc(sub.description || '');
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="ชื่อหมวดหมู่ย่อย"
                />
                <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="คำอธิบาย"
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-semibold"
                    >
                        บันทึก
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all text-sm font-semibold"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4">
            <div>
                <p className="font-semibold text-slate-800">{sub.name}</p>
                {sub.description && <p className="text-sm text-slate-500">{sub.description}</p>}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-all group"
                    title="แก้ไข"
                >
                    <Edit size={18} className="text-slate-400 group-hover:text-blue-600" />
                </button>
                <button
                    onClick={() => onRemove(sub.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-all group"
                    title="ลบ"
                >
                    <X size={18} className="text-slate-400 group-hover:text-red-600" />
                </button>
            </div>
        </div>
    );
}

export default function AddCategoryPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('violet');
    const [subcategories, setSubcategories] = useState<{ id: string; name: string; description: string }[]>([]);
    const [newSubName, setNewSubName] = useState('');
    const [newSubDesc, setNewSubDesc] = useState('');

    const colors = [
        { value: 'violet', label: 'ม่วง', class: 'bg-violet-500' },
        { value: 'blue', label: 'น้ำเงิน', class: 'bg-blue-500' },
        { value: 'emerald', label: 'เขียว', class: 'bg-emerald-500' },
        { value: 'amber', label: 'ส้ม', class: 'bg-amber-500' },
        { value: 'pink', label: 'ชมพู', class: 'bg-pink-500' },
        { value: 'cyan', label: 'ฟ้า', class: 'bg-cyan-500' },
    ];

    const addSubcategory = () => {
        if (newSubName.trim()) {
            setSubcategories([...subcategories, {
                id: Date.now().toString(),
                name: newSubName,
                description: newSubDesc
            }]);
            setNewSubName('');
            setNewSubDesc('');
        }
    };

    const updateSubcategory = (id: string, name: string, description: string) => {
        setSubcategories(subcategories.map(sub =>
            sub.id === id ? { ...sub, name, description } : sub
        ));
    };

    const removeSubcategory = (id: string) => {
        setSubcategories(subcategories.filter(sub => sub.id !== id));
    };

    const handleSave = async () => {
        try {
            // 1. Create parent category
            const parent = await categoryService.createCategory({
                name,
                description,
                color,
            });

            // 2. Create subcategories if any
            if (subcategories.length > 0) {
                await Promise.all(
                    subcategories.map(sub =>
                        categoryService.createSubcategory({
                            name: sub.name,
                            description: sub.description,
                            categoryId: Number(parent.id)
                        })
                    )
                );
            }

            router.push('/courses/categories');
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/courses/categories" className="p-2 hover:bg-violet-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">เพิ่มหมวดหมู่ใหม่</h1>
                        <p className="text-slate-500">สร้างหมวดหมู่และหมวดหมู่ย่อยสำหรับคอร์ส</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/courses/categories"
                        className="px-5 py-2.5 border border-violet-200 rounded-xl hover:bg-violet-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        บันทึกหมวดหมู่
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-md border border-violet-100">
                <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
                    <h2 className="text-xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                            placeholder="เช่น เภสัชศาสตร์คลินิก"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            คำอธิบาย
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                            placeholder="อธิบายเกี่ยวกับหมวดหมู่นี้"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            สีธีม
                        </label>
                        <div className="grid grid-cols-6 gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => setColor(c.value)}
                                    className={`${c.class} h-12 rounded-xl transition-all ${color === c.value ? 'ring-4 ring-offset-2 ring-violet-400 scale-105' : 'hover:scale-105'
                                        }`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategories */}
            <div className="bg-white rounded-2xl shadow-md border border-violet-100">
                <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
                    <h2 className="text-xl font-bold text-slate-800">หมวดหมู่ย่อย</h2>
                </div>
                <div className="p-6 space-y-4">
                    {/* Add Subcategory Form */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={newSubName}
                                onChange={(e) => setNewSubName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
                                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
                                placeholder="ชื่อหมวดหมู่ย่อย เช่น โรคเรื้อรัง"
                            />
                            <input
                                type="text"
                                value={newSubDesc}
                                onChange={(e) => setNewSubDesc(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
                                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
                                placeholder="คำอธิบาย (ไม่บังคับ)"
                            />
                        </div>
                        <button
                            onClick={addSubcategory}
                            disabled={!newSubName.trim()}
                            className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-xl hover:bg-violet-600 transition-all font-semibold disabled:opacity-50"
                        >
                            <Plus size={18} />
                            เพิ่มหมวดหมู่ย่อย
                        </button>
                    </div>

                    {/* Subcategories List */}
                    {subcategories.length > 0 ? (
                        <div className="space-y-2">
                            {subcategories.map((sub) => (
                                <SubcategoryItem
                                    key={sub.id}
                                    sub={sub}
                                    onUpdate={updateSubcategory}
                                    onRemove={removeSubcategory}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <p>ยังไม่มีหมวดหมู่ย่อย</p>
                            <p className="text-sm">เพิ่มหมวดหมู่ย่อยเพื่อจัดระเบียบคอร์สภายในหมวดหมู่นี้</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
