'use client';

import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Image as ImageIcon, FileText, Eye, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCourseForm } from '@/features/courses/hooks/useCourseForm';
import { PricingSection } from '@/features/courses/components/CourseForm/PricingSection';
import { CECreditsSection } from '@/features/courses/components/CourseForm/CECreditsSection';
import { StepIndicator } from '@/features/courses/components/CourseForm/StepIndicator';
import { courseService } from '@/features/courses/services/courseService';
import type { Category, Subcategory } from '@/features/courses/types/categories';
import { CourseVideoSection } from '@/features/courses/components/CourseForm/CourseVideoSection';
import type { Video } from '@/features/videos/types';

type StepId = 1 | 2 | 3 | 4;

const STEPS = [
    { id: 1, title: 'ข้อมูลพื้นฐาน' },
    { id: 2, title: 'เนื้อหา & ราคา' },
    { id: 3, title: 'การตั้งค่า' },
    { id: 4, title: 'ตรวจสอบ & สร้าง' },
];

const STATUS_OPTIONS = [
    {
        value: 'DRAFT' as const,
        label: 'ฉบับร่าง',
        description: 'เตรียมข้อมูล ยังไม่แสดงให้ผู้เรียนเห็น',
        icon: FileText,
        color: 'slate',
    },
    {
        value: 'PUBLISHED' as const,
        label: 'เผยแพร่',
        description: 'ผู้เรียนสามารถเห็นและสมัครเรียนได้ทันที',
        icon: Eye,
        color: 'emerald',
    },
    {
        value: 'ARCHIVED' as const,
        label: 'เก็บถาวร',
        description: 'ซ่อนคอร์สจากหน้าค้นหา เก็บข้อมูลไว้ในระบบ',
        icon: Rocket,
        color: 'amber',
    },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'ฉบับร่าง', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    PUBLISHED: { label: 'เผยแพร่', className: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    ARCHIVED: { label: 'เก็บถาวร', className: 'bg-amber-50 text-amber-600 border-amber-200' },
};

export default function AddCoursePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategoryList, setSubcategoryList] = useState<Subcategory[]>([]);
    const [currentStep, setCurrentStep] = useState<StepId>(1);
    const [stepError, setStepError] = useState('');

    const {
        title, setTitle,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        subcategoryId, setSubcategoryId,
        courseType, setCourseType,
        price, setPrice,
        cpeCredits, setCpeCredits,
        conferenceCode, setConferenceCode,
        language, setLanguage,
        skillLevel, setSkillLevel,
        hasCertificate, setHasCertificate,
        enrollmentDeadline, setEnrollmentDeadline,
        ceEnabled, setCeEnabled,
        authorName, setAuthorName,
        thumbnailPreview, thumbnailError, handleThumbnailSelect,
        uploadedVideos, handleAddVideo, handleDeleteVideo,
        previewVideoId, handleSetPreviewVideo,
        createCourse,
        status, setStatus,
    } = useCourseForm();

    useEffect(() => {
        courseService.getCategories().then((response) => {
            setCategories(response.categories);
        });
    }, []);

    useEffect(() => {
        const cat = categories.find(c => c.id.toString() === categoryId.toString());
        setSubcategoryList(cat?.subcategories || []);
    }, [categoryId, categories]);

    const handleCategoryChange = (nextCategoryId: string) => {
        setCategoryId(nextCategoryId);
        setSubcategoryId('');
    };

    const selectedCategory = categories.find(c => c.id.toString() === categoryId.toString());
    const badge = STATUS_BADGE[status] || STATUS_BADGE.DRAFT;

    const requiredChecks = useMemo(
        () => [
            { label: 'ชื่อคอร์ส', done: Boolean(title.trim()) },
            { label: 'คำอธิบายโดยย่อ', done: Boolean(description.trim()) },
            { label: 'รายละเอียดคอร์ส', done: Boolean(details.trim()) },
            { label: 'หมวดหมู่หลัก', done: Boolean(categoryId) },
            { label: 'ชื่อผู้สอน', done: Boolean(authorName.trim()) },
        ],
        [title, description, details, categoryId, authorName]
    );

    const isStep1Valid = requiredChecks.every(item => item.done);

    const isStep2Valid = courseType === 'paid' ? price > 0 : true;
    const isStep2CPEValid = ceEnabled ? cpeCredits > 0 : true;

    const canNavigateTo = (stepId: number) => {
        if (stepId === 1) return true;
        if (stepId === 2) return isStep1Valid;
        if (stepId === 3) return isStep1Valid && isStep2Valid && isStep2CPEValid;
        if (stepId === 4) return isStep1Valid && isStep2Valid && isStep2CPEValid;
        return false;
    };

    const gotoStep = (stepId: number) => {
        if (stepId > currentStep && !canNavigateTo(stepId)) {
            if (currentStep === 1) {
                setStepError('กรุณากรอกข้อมูลพื้นฐานให้ครบก่อน');
            } else if (currentStep === 2) {
                if (!isStep2Valid) setStepError('กรุณากำหนดราคาคอร์สให้มากกว่า 0 บาท');
                else if (!isStep2CPEValid) setStepError('กรุณาระบุจำนวน CPE Credits ให้ถูกต้อง');
            }
            return;
        }
        setStepError('');
        setCurrentStep(stepId as StepId);
    };

    const handleNextStep = () => {
        const nextStep = Math.min(currentStep + 1, 4) as StepId;
        gotoStep(nextStep);
    };

    const handlePrevStep = () => {
        setStepError('');
        setCurrentStep((prev) => Math.max(prev - 1, 1) as StepId);
    };

    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!canNavigateTo(4)) {
            if (!isStep1Valid) setCurrentStep(1);
            else if (!isStep2Valid || !isStep2CPEValid) setCurrentStep(2);
            setStepError('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้องก่อนสร้างคอร์ส');
            return;
        }
        setIsCreating(true);
        try {
            const result = await createCourse();
            const newCourse = result.data || result;
            if (!newCourse.id) throw new Error('ไม่พบรหัสคอร์สหลังสร้าง');
            router.push(`/courses/${newCourse.id}/edit`);
        } catch (error) {
            console.error('Failed to create course:', error);
            const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
            setStepError(`สร้างคอร์สไม่สำเร็จ: ${message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!canNavigateTo(4)) {
            if (!isStep1Valid) setCurrentStep(1);
            else if (!isStep2Valid || !isStep2CPEValid) setCurrentStep(2);
            setStepError('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้องก่อนบันทึกฉบับร่าง');
            return;
        }
        setIsCreating(true);
        const prevStatus = status;
        setStatus('DRAFT');
        try {
            const result = await createCourse();
            const newCourse = result.data || result;
            if (!newCourse.id) throw new Error('ไม่พบรหัสคอร์ส');
            router.push(`/courses/${newCourse.id}/edit`);
        } catch (error) {
            setStatus(prevStatus);
            console.error('Failed to save draft:', error);
            setStepError('บันทึกไม่สำเร็จ');
        } finally {
            setIsCreating(false);
        }
    };

    const nextStepLabel = STEPS[currentStep]?.title;

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/courses" className="p-2 hover:bg-sky-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">สร้างคอร์สใหม่</h1>
                        <p className="text-sm text-slate-500">กรอกข้อมูลให้ครบทุก step แล้ว submit หรือ review</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${badge.className}`}>
                        {badge.label}
                    </span>
                    <Link href="/courses" className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-semibold transition-all text-slate-600">
                        ยกเลิก
                    </Link>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <StepIndicator
                    steps={STEPS}
                    currentStep={currentStep}
                    onStepClick={gotoStep}
                    canNavigateTo={canNavigateTo}
                />
            </div>

            {/* Error */}
            {stepError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 mb-6">
                    {stepError}
                </div>
            )}

            {/* Form Content */}
            <div className="max-w-3xl mx-auto">
                {/* Step 1: ข้อมูลพื้นฐาน */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">ข้อมูลพื้นฐาน</h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    ชื่อคอร์ส <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="กรอกชื่อคอร์ส"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    คำอธิบายโดยย่อ <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="คำอธิบายสั้นๆ เกี่ยวกับคอร์ส"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    รายละเอียดคอร์ส <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={6}
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="รายละเอียดเนื้อหาของคอร์ส"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        หมวดหมู่หลัก <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-slate-50 focus:bg-white"
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        หมวดหมู่ย่อย
                                    </label>
                                    <select
                                        value={subcategoryId}
                                        onChange={(e) => setSubcategoryId(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-slate-50 focus:bg-white"
                                        disabled={subcategoryList.length === 0}
                                    >
                                        <option value="">ไม่ระบุ</option>
                                        {subcategoryList.map((sub) => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        ชื่อผู้สอน <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                        placeholder="เช่น ภญ.สมใจ รักเรียน"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        ระดับผู้เรียน
                                    </label>
                                    <select
                                        value={skillLevel}
                                        onChange={(e) => setSkillLevel(e.target.value as 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-slate-50 focus:bg-white"
                                    >
                                        <option value="ALL">ทุกระดับ</option>
                                        <option value="BEGINNER">เริ่มต้น</option>
                                        <option value="INTERMEDIATE">ปานกลาง</option>
                                        <option value="ADVANCED">ขั้นสูง</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">รูปปกคอร์ส</h2>
                            {thumbnailPreview ? (
                                <div className="relative">
                                    <img src={thumbnailPreview} alt="รูปปก" className="w-full rounded-xl object-cover aspect-video" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('thumbnail-input') as HTMLInputElement;
                                            input?.click();
                                        }}
                                        className="mt-3 text-sm text-sky-600 hover:text-sky-700 font-semibold"
                                    >
                                        เปลี่ยนรูปภาพ
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        const input = document.getElementById('thumbnail-input') as HTMLInputElement;
                                        input?.click();
                                    }}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer"
                                >
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <ImageIcon size={28} className="text-slate-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 mb-1">คลิกเพื่ออัปโหลดรูปภาพ</p>
                                    <p className="text-xs text-slate-400">แนะนำ: 1280x720px (JPG, PNG, WEBP, ไม่เกิน 5MB)</p>
                                </div>
                            )}
                            <input
                                id="thumbnail-input"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleThumbnailSelect(file);
                                }}
                            />
                            {thumbnailError && (
                                <p className="mt-3 text-sm font-semibold text-red-600">{thumbnailError}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: เนื้อหา & ราคา */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <CourseVideoSection
                            videos={uploadedVideos}
                            onAddVideo={(video) => {
                                handleAddVideo(video);
                                handleSetPreviewVideo(Number(video.id));
                            }}
                            onDeleteVideo={handleDeleteVideo}
                            previewVideoId={previewVideoId}
                            onSelectPreview={handleSetPreviewVideo}
                            title="วิดีโอตัวอย่าง (Course Preview)"
                            description="อัพโหลดวิดีโอแนะนำคอร์ส (Teaser)"
                            showPreviewAsBadge={true}
                        />
                        <PricingSection
                            courseType={courseType}
                            onCourseTypeChange={setCourseType}
                            price={price}
                            onPriceChange={setPrice}
                        />
                        <CECreditsSection
                            ceEnabled={ceEnabled}
                            onCeEnabledChange={setCeEnabled}
                            cpeCredits={cpeCredits}
                            onCpeCreditsChange={setCpeCredits}
                            conferenceCode={conferenceCode}
                            onConferenceCodeChange={setConferenceCode}
                        />
                    </div>
                )}

                {/* Step 3: การตั้งค่า */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">การตั้งค่าคอร์ส</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">ภาษา</label>
                                    <input
                                        type="text"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        placeholder="เช่น Thai, English"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-slate-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">วันหมดเขตสมัคร</label>
                                    <input
                                        type="date"
                                        value={enrollmentDeadline}
                                        onChange={(e) => setEnrollmentDeadline(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                                <div>
                                    <span className="text-sm font-semibold text-slate-700">ออกใบรับรอง</span>
                                    <p className="text-xs text-slate-400 mt-0.5">เมื่อผู้เรียนผ่านคอร์สแล้วจะได้รับใบรับรอง</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={hasCertificate}
                                    onChange={(e) => setHasCertificate(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                            </label>
                        </div>

                        {/* Status Card Radio */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">สถานะคอร์ส</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {STATUS_OPTIONS.map((option) => {
                                    const isSelected = status === option.value;
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setStatus(option.value)}
                                            className={`text-left rounded-xl border-2 p-4 transition-all ${
                                                isSelected
                                                    ? option.color === 'emerald'
                                                        ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                                                        : option.color === 'amber'
                                                            ? 'border-amber-400 bg-amber-50 shadow-sm'
                                                            : 'border-sky-400 bg-sky-50 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon size={18} className={isSelected
                                                    ? option.color === 'emerald' ? 'text-emerald-600'
                                                        : option.color === 'amber' ? 'text-amber-600'
                                                            : 'text-sky-600'
                                                    : 'text-slate-400'
                                                } />
                                                <span className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            <p className={`text-xs ${isSelected ? 'text-slate-600' : 'text-slate-400'}`}>
                                                {option.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: ตรวจสอบ & สร้าง */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        {/* Course Preview Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="รูปปก" className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                                    <ImageIcon size={48} className="text-sky-300" />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{title || 'ยังไม่ได้ระบุชื่อ'}</h3>
                                <p className="text-sm text-slate-500 mb-4">{description || '-'}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs mb-0.5">ผู้สอน</p>
                                        <p className="font-semibold text-slate-700">{authorName || '-'}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs mb-0.5">หมวดหมู่</p>
                                        <p className="font-semibold text-slate-700">{selectedCategory?.name || '-'}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs mb-0.5">ราคา</p>
                                        <p className="font-semibold text-slate-700">
                                            {courseType === 'free' ? 'ฟรี' : `฿${Number(price || 0).toLocaleString()}`}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs mb-0.5">CPE Credit</p>
                                        <p className="font-semibold text-slate-700">{ceEnabled ? `${cpeCredits || 0} หน่วย` : 'ไม่เปิดใช้'}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs mb-0.5">สถานะ</p>
                                        <p className="font-semibold text-slate-700">{STATUS_BADGE[status]?.label}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs mb-0.5">ระดับ</p>
                                        <p className="font-semibold text-slate-700">
                                            {skillLevel === 'ALL' ? 'ทุกระดับ' : skillLevel === 'BEGINNER' ? 'เริ่มต้น' : skillLevel === 'INTERMEDIATE' ? 'ปานกลาง' : 'ขั้นสูง'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Required Checklist */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">เช็คลิสต์ข้อมูลจำเป็น</h2>
                            <div className="space-y-2">
                                {requiredChecks.map((item) => (
                                    <div key={item.label} className={`flex items-center gap-3 p-3 rounded-lg ${item.done ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                        {item.done ? (
                                            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                                        ) : (
                                            <Circle size={18} className="text-red-300 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm font-medium ${item.done ? 'text-emerald-700' : 'text-red-600'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={isCreating || !isStep1Valid}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl hover:shadow-lg transition-all text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    กำลังสร้างคอร์ส...
                                </>
                            ) : (
                                <>
                                    <Rocket size={20} />
                                    สร้างคอร์สและไปจัดการเนื้อหา
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40">
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all text-slate-600"
                    >
                        <ArrowLeft size={16} />
                        ย้อนกลับ
                    </button>
                    <div className="flex items-center gap-3">
                        {currentStep >= 2 && isStep1Valid && (
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={isCreating}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all text-slate-600 disabled:opacity-50"
                            >
                                บันทึกฉบับร่าง
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                            >
                                <span>ถัดไป: {nextStepLabel}</span>
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={isCreating || !isStep1Valid}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50"
                            >
                                <Rocket size={16} />
                                <span>{isCreating ? 'กำลังสร้าง...' : 'สร้างคอร์ส'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
