'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCourseForm } from '@/features/courses/hooks/useCourseForm';
import { PricingSection } from '@/features/courses/components/CourseForm/PricingSection';
import { Image as ImageIcon } from 'lucide-react';
import { courseService } from '@/features/courses/services/courseService';
import type { Category } from '@/features/courses/types/categories';
import { CourseVideoSection } from '@/features/courses/components/CourseForm/CourseVideoSection';

export default function AddCoursePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const {
        title, setTitle,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        subcategories, setSubcategories,
        courseType,
        setCourseType,
        uploadedVideos,
        handleAddVideo,
        handleDeleteVideo,
        previewVideoId,
        handleSetPreviewVideo,
        createCourse,
        status, setStatus,
    } = useCourseForm();

    const loadCategories = async () => {
        const response = await courseService.getCategories();
        setCategories(response.categories);
    };

    useEffect(() => {
        // Use setTimeout to avoid synchronous setState inside effect warning
        const timer = setTimeout(() => {
            void loadCategories();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setCategoryId(categoryId);
        setSubcategories([]); // Reset subcategories when category changes
    };

    const toggleSubcategory = (subId: string) => {
        setSubcategories(prev =>
            prev.includes(subId)
                ? prev.filter(id => id !== subId)
                : [...prev, subId]
        );
    };

    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!title || !description) {
            alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return;
        }

        setIsCreating(true);
        try {
            const result = await createCourse();
            // The result structure might vary, let's assume it has the data in .data
            const newCourse = result.data || result;
            alert('สร้างคอร์สสำเร็จ');
            router.push(`/courses/${newCourse.id}/edit`);
        } catch (error) {
            console.error('Failed to create course:', error);
            alert('เกิดข้อผิดพลาดในการสร้างคอร์ส');
        } finally {
            setIsCreating(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddPreviewVideo = (video: any) => {
        handleAddVideo(video as any);
        // Auto select as preview if it's the first video or specifically uploaded here
        handleSetPreviewVideo(Number(video.id));
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/courses" className="p-2 hover:bg-sky-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">สร้างคอร์สใหม่</h1>
                        <p className="text-slate-500">กรอกข้อมูลพื้นฐานเพื่อเริ่มต้นสร้างคอร์ส</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/courses" className="px-5 py-2.5 border border-sky-200 rounded-xl hover:bg-sky-50 text-sm font-semibold transition-all">
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50"
                    >
                        <span>{isCreating ? 'กำลังสร้างคอร์ส...' : 'ถัดไป: จัดการเนื้อหา'}</span>
                        {!isCreating && <ArrowRight size={18} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    ชื่อคอร์ส <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                    placeholder="กรอกชื่อคอร์ส"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    คำอธิบายโดยย่อ <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                    placeholder="คำอธิบายสั้นๆ เกี่ยวกับคอร์ส"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    รายละเอียดคอร์ส <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={6}
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                    placeholder="รายละเอียดเนื้อหาของคอร์ส"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        หมวดหมู่หลัก <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    หมวดหมู่ย่อย <span className="text-slate-400">(เลือกได้หลายรายการ)</span>
                                </label>
                                <div className="border border-sky-200 rounded-xl p-3 max-h-48 overflow-y-auto bg-white">
                                    <div className="space-y-2">
                                        {categories.find(c => c.id.toString() === categoryId.toString())?.subcategories?.map((sub) => (
                                            <label key={sub.id} className="flex items-center gap-2 cursor-pointer hover:bg-sky-50 p-2 rounded-lg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={subcategories.includes(sub.id.toString())}
                                                    onChange={() => toggleSubcategory(sub.id.toString())}
                                                    className="w-4 h-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-slate-700">{sub.name}</span>
                                                    {sub.description && <p className="text-xs text-slate-500">{sub.description}</p>}
                                                </div>
                                            </label>
                                        )) || <p className="text-sm text-slate-400 text-center py-4">ไม่มีหมวดหมู่ย่อย</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Video Section */}
                    <CourseVideoSection
                        // Show all uploaded videos here as "Candidates for Preview".
                        // Logic: uploadedVideos contains ALL videos. If user uploads 5 videos here, they are all in the list.
                        videos={uploadedVideos}
                        onAddVideo={handleAddPreviewVideo}
                        onDeleteVideo={handleDeleteVideo}
                        previewVideoId={previewVideoId}
                        onSelectPreview={handleSetPreviewVideo}
                        title="วิดีโอตัวอย่าง (Course Preview)"
                        description="อัพโหลดวิดีโอแนะนำคอร์ส (Teaser) เพื่อดึงดูดผู้เรียน"
                        showPreviewAsBadge={true}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Image */}
                    <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-slate-800">รูปปกคอร์ส</h2>
                        </div>
                        <div className="p-6">
                            <div className="border-2 border-dashed border-sky-300 rounded-xl p-8 text-center bg-gradient-to-br from-sky-50 to-blue-50 hover:border-sky-400 transition-all cursor-pointer">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <ImageIcon size={32} className="text-sky-500" />
                                </div>
                                <p className="text-sm font-semibold text-slate-700 mb-1">อัปโหลดรูปภาพ</p>
                                <p className="text-xs text-slate-500">แนะนำ: 1280x720px</p>
                            </div>
                            <input type="file" className="mt-4 w-full text-sm" accept="image/*" />
                        </div>
                    </div>

                    {/* Pricing */}
                    <PricingSection courseType={courseType} onCourseTypeChange={setCourseType} />

                    {/* Status */}
                    <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-slate-800">สถานะ</h2>
                        </div>
                        <div className="p-6">
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                            >
                                <option value="DRAFT">ฉบับร่าง</option>
                                <option value="PUBLISHED">เผยแพร่</option>
                                <option value="ARCHIVED">เก็บถาวร</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
