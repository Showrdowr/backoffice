'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Circle,
    FileText,
    Image as ImageIcon,
    Layers3,
    Loader2,
    RefreshCw,
    Rocket,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCourseForm } from '@/features/courses/hooks/useCourseForm';
import { PricingSection } from '@/features/courses/components/CourseForm/PricingSection';
import { CECreditsSection } from '@/features/courses/components/CourseForm/CECreditsSection';
import { StepIndicator } from '@/features/courses/components/CourseForm/StepIndicator';
import { courseService } from '@/features/courses/services/courseService';
import type { Category } from '@/features/courses/types/categories';
import type { Course } from '@/features/courses/types';
import { CourseVideoSection } from '@/features/courses/components/CourseForm/CourseVideoSection';
import { ApiError } from '@/services/api/client';

type StepId = 1 | 2 | 3 | 4;

const STEPS = [
    { id: 1, title: 'ข้อมูลพื้นฐานของคอร์ส' },
    { id: 2, title: 'ราคา / CPE / วิดีโอตัวอย่าง' },
    { id: 3, title: 'การตั้งค่าเปิดเรียน' },
    { id: 4, title: 'ตรวจสอบก่อนสร้างโครงคอร์ส' },
];

const STATUS_OPTIONS = [
    {
        value: 'DRAFT' as const,
        label: 'ฉบับร่าง',
        description: 'สร้างคอร์สเพื่อเก็บข้อมูลก่อน ยังไม่เปิดให้ผู้เรียนเห็น',
    },
    {
        value: 'PUBLISHED' as const,
        label: 'เป้าหมายคือเผยแพร่',
        description: 'ระบบจะสร้างฉบับร่างก่อน แล้วให้ไปเพิ่มเนื้อหาในหน้าแก้ไขก่อนเผยแพร่จริง',
    },
    {
        value: 'ARCHIVED' as const,
        label: 'เก็บถาวร',
        description: 'ใช้เมื่อสร้าง placeholder หรือเตรียมข้อมูลไว้โดยยังไม่ต้องการใช้งาน',
    },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'ฉบับร่าง', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    PUBLISHED: { label: 'เป้าหมายคือเผยแพร่', className: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    ARCHIVED: { label: 'เก็บถาวร', className: 'bg-amber-50 text-amber-600 border-amber-200' },
};

const NEXT_EDIT_TASKS = [
    'เพิ่มบทเรียนจริงของคอร์ส',
    'แนบเอกสาร PDF ให้แต่ละบทเรียน',
    'กำหนด interactive ระหว่างวิดีโอ',
    'ตั้งค่า lesson quiz และ final exam',
    'ตรวจความพร้อมก่อนเผยแพร่จริง',
];

function getFriendlyErrorMessage(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
        switch (error.code) {
            case 'CATEGORY_NOT_FOUND':
                return 'ไม่พบหมวดหมู่ที่เลือก กรุณารีเฟรชหน้าแล้วลองใหม่';
            case 'VIDEO_IN_USE':
                return 'วิดีโอนี้กำลังถูกใช้งานอยู่ จึงยังไม่สามารถลบได้';
            default:
                return error.message || fallback;
        }
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
}

function getStatusMeta(status?: string) {
    switch (String(status || 'DRAFT').toUpperCase()) {
        case 'PUBLISHED':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'ARCHIVED':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        default:
            return 'bg-slate-100 text-slate-600 border-slate-200';
    }
}

function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div className="mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
    );
}

function FieldHelp({ children }: { children: ReactNode }) {
    return <p className="mb-2 text-xs text-slate-500">{children}</p>;
}

function ReviewStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-0.5 text-xs text-slate-400">{label}</p>
            <p className="font-semibold text-slate-700">{value}</p>
        </div>
    );
}

export default function AddCoursePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [currentStep, setCurrentStep] = useState<StepId>(1);
    const [stepError, setStepError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState('');
    const [isLoadingRelatedCourses, setIsLoadingRelatedCourses] = useState(true);
    const [relatedCoursesError, setRelatedCoursesError] = useState('');
    const [relatedCoursesSearch, setRelatedCoursesSearch] = useState('');
    const [thumbnailInputKey, setThumbnailInputKey] = useState(0);

    const {
        title, setTitle,
        actionError, setActionError,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        courseType, setCourseType,
        price, setPrice,
        cpeCredits, setCpeCredits,
        conferenceCode, setConferenceCode,
        language, setLanguage,
        hasCertificate, setHasCertificate,
        maxStudents, setMaxStudents,
        enrollmentDeadline, setEnrollmentDeadline,
        courseEndAt, setCourseEndAt,
        ceEnabled, setCeEnabled,
        authorName, setAuthorName,
        relatedCourseIds, setRelatedCourseIds,
        thumbnailPreview,
        thumbnailError,
        handleThumbnailSelect,
        clearThumbnail,
        settingsValidationErrors,
        hasUnsavedChanges,
        draftRestored,
        clearDraftState,
        uploadedVideos,
        handleAddVideo,
        handleDeleteVideo,
        previewVideoId,
        handleSetPreviewVideo,
        createCourse,
        status, setStatus,
    } = useCourseForm(undefined, {
        enableDraftPersistence: true,
        draftStorageKey: 'backoffice:add-course-draft',
    });

    const loadCategories = async () => {
        setIsLoadingCategories(true);
        setCategoriesError('');
        try {
            const response = await courseService.getCategories();
            setCategories(response.categories);
        } catch (error) {
            setCategoriesError(getFriendlyErrorMessage(error, 'โหลดหมวดหมู่ไม่สำเร็จ'));
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const loadRelatedCourses = async () => {
        setIsLoadingRelatedCourses(true);
        setRelatedCoursesError('');
        try {
            const response = await courseService.getCourses();
            setAvailableCourses(response.courses);
        } catch (error) {
            setRelatedCoursesError(getFriendlyErrorMessage(error, 'โหลดคอร์สที่เกี่ยวข้องไม่สำเร็จ'));
        } finally {
            setIsLoadingRelatedCourses(false);
        }
    };

    useEffect(() => {
        void loadCategories();
        void loadRelatedCourses();
    }, []);

    const selectedCategory = categories.find((item) => String(item.id) === String(categoryId));
    const selectedPreviewVideo = uploadedVideos.find((video) => video.id === previewVideoId) || null;
    const badge = STATUS_BADGE[status] || STATUS_BADGE.DRAFT;

    const requiredChecks = useMemo(
        () => [
            { label: 'ชื่อคอร์ส', done: Boolean(title.trim()) },
            { label: 'คำอธิบายโดยย่อ', done: Boolean(description.trim()) },
            { label: 'รายละเอียดคอร์ส', done: Boolean(details.trim()) },
            { label: 'หมวดหมู่หลัก', done: Boolean(categoryId) && !categoriesError },
            { label: 'ชื่อผู้สอน', done: Boolean(authorName.trim()) },
        ],
        [authorName, categoryId, categoriesError, description, details, title]
    );

    const isStep1Valid = requiredChecks.every((item) => item.done);
    const isDraftReady = Boolean(title.trim()) && Boolean(categoryId) && !categoriesError;
    const isStep2Valid = courseType === 'paid' ? price > 0 : true;
    const isStep2CPEValid = ceEnabled ? cpeCredits > 0 : true;
    const isStep3Valid = settingsValidationErrors.length === 0;

    const filteredCourseOptions = useMemo(() => {
        const search = relatedCoursesSearch.trim().toLowerCase();
        if (!search) {
            return availableCourses;
        }

        return availableCourses.filter((course) => {
            const categoryName = typeof course.category === 'string'
                ? course.category
                : course.category?.name || '';
            return [course.title, course.authorName || '', categoryName].join(' ').toLowerCase().includes(search);
        });
    }, [availableCourses, relatedCoursesSearch]);

    const canNavigateTo = (stepId: number) => {
        if (stepId === 1) return true;
        if (stepId === 2) return isStep1Valid;
        if (stepId === 3) return isStep1Valid && isStep2Valid && isStep2CPEValid;
        if (stepId === 4) return isStep1Valid && isStep2Valid && isStep2CPEValid && isStep3Valid;
        return false;
    };

    const goToStep = (stepId: number) => {
        if (stepId > currentStep && !canNavigateTo(stepId)) {
            if (!isStep1Valid) {
                setStepError('กรุณากรอกข้อมูลพื้นฐานให้ครบก่อน');
                setCurrentStep(1);
                return;
            }
            if (!isStep2Valid) {
                setStepError('กรุณากำหนดราคาคอร์สให้มากกว่า 0 บาท');
                setCurrentStep(2);
                return;
            }
            if (!isStep2CPEValid) {
                setStepError('เมื่อเปิดใช้ CPE Credit ต้องระบุจำนวนหน่วยให้มากกว่า 0');
                setCurrentStep(2);
                return;
            }
            if (!isStep3Valid) {
                setStepError(settingsValidationErrors[0] || 'กรุณาตรวจสอบข้อมูลการตั้งค่าให้ถูกต้อง');
                setCurrentStep(3);
                return;
            }
        }

        setStepError('');
        setCurrentStep(stepId as StepId);
    };

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
    };

    const finalCreateLabel = status === 'PUBLISHED'
        ? 'สร้างฉบับร่างและไปเพิ่มเนื้อหา'
        : status === 'ARCHIVED'
            ? 'สร้างคอร์สแบบเก็บถาวร'
            : 'สร้างคอร์สและไปเพิ่มเนื้อหา';

    const handleCreate = async () => {
        setActionError('');
        if (categoriesError || isLoadingCategories) {
            setCurrentStep(1);
            setStepError('ยังไม่พร้อมสร้างคอร์ส เพราะระบบยังโหลดหมวดหมู่ไม่สำเร็จ');
            return;
        }
        if (!canNavigateTo(4)) {
            setStepError('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้องก่อนสร้างคอร์ส');
            setCurrentStep(!isStep1Valid ? 1 : !isStep2Valid || !isStep2CPEValid ? 2 : 3);
            return;
        }

        setIsCreating(true);
        try {
            const result = await createCourse(status === 'PUBLISHED' ? 'DRAFT' : status);
            if (!result.id) {
                throw new Error('ไม่พบรหัสคอร์สหลังสร้าง');
            }
            clearDraftState();
            router.push(`/courses/${result.id}/edit`);
        } catch (error) {
            setStepError(`สร้างคอร์สไม่สำเร็จ: ${getFriendlyErrorMessage(error, 'เกิดข้อผิดพลาด')}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveDraft = async () => {
        setActionError('');
        if (!isDraftReady || categoriesError || isLoadingCategories) {
            setCurrentStep(1);
            setStepError('บันทึกฉบับร่างต้องมีชื่อคอร์สและหมวดหมู่หลักอย่างน้อย');
            return;
        }

        setIsCreating(true);
        try {
            const result = await createCourse('DRAFT');
            if (!result.id) {
                throw new Error('ไม่พบรหัสคอร์ส');
            }
            clearDraftState();
            router.push(`/courses/${result.id}/edit`);
        } catch (error) {
            setStepError(`บันทึกฉบับร่างไม่สำเร็จ: ${getFriendlyErrorMessage(error, 'เกิดข้อผิดพลาด')}`);
        } finally {
            setIsCreating(false);
        }
    };

    const leavePage = () => {
        if (hasUnsavedChanges && !window.confirm('มีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่')) {
            return;
        }
        clearDraftState();
        router.push('/courses');
    };

    return (
        <div className="min-h-screen pb-24">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={leavePage} className="rounded-xl p-2 transition-all hover:bg-sky-50">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">สร้างคอร์สใหม่</h1>
                        <p className="text-sm text-slate-500">ใช้หน้านี้เพื่อสร้างโครงคอร์สก่อน แล้วค่อยไปเติมบทเรียนและ assessment ในหน้าแก้ไข</p>
                    </div>
                </div>
                <span className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${badge.className}`}>{badge.label}</span>
            </div>

            <div className="mb-6 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-5">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
                        <Layers3 size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">หน้าสร้างโครงคอร์ส</h2>
                        <p className="mt-1 text-sm text-slate-600">หน้านี้ยังไม่ใช่จุดเพิ่มบทเรียน เอกสาร PDF, interactive, lesson quiz หรือ final exam</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {NEXT_EDIT_TASKS.map((task) => (
                                <span key={task} className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700">
                                    ไปทำต่อในหน้าแก้ไข: {task}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {draftRestored && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    ระบบกู้คืนข้อมูลร่างที่ยังไม่ได้บันทึกให้แล้ว
                </div>
            )}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={goToStep} canNavigateTo={canNavigateTo} />
            </div>

            {stepError && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{stepError}</div>}
            {actionError && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{actionError}</div>}

            <div className="mx-auto max-w-3xl space-y-6">
                {currentStep === 1 && (
                    <>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <SectionHeader title="ข้อมูลพื้นฐานของคอร์ส" description="กรอกข้อมูลที่ใช้แสดงบน card และหน้า Course Details ให้ครบก่อน" />
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">ชื่อคอร์ส <span className="text-red-500">*</span></label>
                                    <FieldHelp>ใช้เป็นชื่อหลักของคอร์สทั้งในหน้ารายการคอร์สและหน้า details</FieldHelp>
                                    <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="กรอกชื่อคอร์ส" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">คำอธิบายโดยย่อ <span className="text-red-500">*</span></label>
                                    <FieldHelp>ใช้แสดงบนการ์ดคอร์สหรือหน้ารวมคอร์ส ควรสั้นและบอกภาพรวมของคอร์ส</FieldHelp>
                                    <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">รายละเอียดคอร์ส <span className="text-red-500">*</span></label>
                                    <FieldHelp>ใช้แสดงในหน้า Course Details เพื่ออธิบายผู้เรียนว่าจะได้เรียนอะไรและคอร์สนี้เหมาะกับใคร</FieldHelp>
                                    <textarea rows={6} value={details} onChange={(event) => setDetails(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">หมวดหมู่หลัก <span className="text-red-500">*</span></label>
                                        <FieldHelp>ใช้จัดกลุ่มคอร์สในระบบและหน้าบ้าน</FieldHelp>
                                        <select value={categoryId} onChange={(event) => handleCategoryChange(event.target.value)} disabled={isLoadingCategories || Boolean(categoriesError)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-100">
                                            <option value="">{isLoadingCategories ? 'กำลังโหลดหมวดหมู่...' : 'เลือกหมวดหมู่'}</option>
                                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                        </select>
                                        {categoriesError && <button type="button" onClick={() => void loadCategories()} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600"><RefreshCw size={14} />{categoriesError}</button>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">ชื่อผู้สอน <span className="text-red-500">*</span></label>
                                        <FieldHelp>ใช้แสดงบนการ์ดและหน้า details ของคอร์ส</FieldHelp>
                                        <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="เช่น ภญ.สมใจ รักเรียน" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <SectionHeader title="รูปปกคอร์ส" description="รูปนี้ใช้แสดงบนการ์ดคอร์สและหน้ารายละเอียด แนะนำสัดส่วน 16:9 และขนาดไม่เกิน 5MB" />
                            {thumbnailPreview ? (
                                <div className="space-y-3">
                                    <img src={thumbnailPreview} alt="รูปปก" className="aspect-video w-full rounded-xl object-cover" />
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => (document.getElementById('thumbnail-input') as HTMLInputElement | null)?.click()} className="text-sm font-semibold text-sky-600">เปลี่ยนรูปภาพ</button>
                                        <button type="button" onClick={() => { clearThumbnail(); setThumbnailInputKey((prev) => prev + 1); }} className="text-sm font-semibold text-red-600">ลบรูปปก</button>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={() => (document.getElementById('thumbnail-input') as HTMLInputElement | null)?.click()} className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-10 text-center transition-all hover:border-sky-400 hover:bg-sky-50/30">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100"><ImageIcon size={28} className="text-slate-400" /></div>
                                    <p className="mb-1 text-sm font-semibold text-slate-700">คลิกเพื่ออัปโหลดรูปภาพ</p>
                                    <p className="text-xs text-slate-400">รองรับ JPG, PNG, WEBP</p>
                                </div>
                            )}
                            <input key={thumbnailInputKey} id="thumbnail-input" type="file" className="hidden" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleThumbnailSelect(file); }} />
                            {thumbnailError && <p className="mt-3 text-sm font-semibold text-red-600">{thumbnailError}</p>}
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <CourseVideoSection
                            videos={uploadedVideos}
                            onAddVideo={(video) => {
                                handleAddVideo(video);
                                handleSetPreviewVideo(Number(video.id));
                            }}
                            onDeleteVideo={handleDeleteVideo}
                            previewVideoId={previewVideoId}
                            onSelectPreview={handleSetPreviewVideo}
                            title="วิดีโอตัวอย่างของคอร์ส"
                            description="ใช้แสดงเป็น teaser หรือแนะนำคอร์สในหน้า Course Details"
                            helperText="วิดีโอส่วนนี้ยังไม่ใช่วิดีโอบทเรียนจริงของผู้เรียน ระบบจะนำไปใช้เป็น preview ของคอร์สเท่านั้น"
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
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        {status === 'PUBLISHED' && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        คุณเลือกเป้าหมายว่า “เผยแพร่” แต่หน้านี้จะยังสร้างเป็นฉบับร่างก่อนเสมอ หลังจากสร้างแล้วต้องไปเพิ่มบทเรียน เอกสาร และ assessment ในหน้าแก้ไขให้ครบก่อนเผยแพร่จริง
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <SectionHeader title="การตั้งค่าคอร์ส" description="ระบุเงื่อนไขการเปิดเรียน วันหมดเขตสมัคร วันสิ้นสุดคอร์ส และการแนะนำคอร์สต่อ" />
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">ภาษา</label>
                                        <FieldHelp>ใช้แสดงภาษาหลักของเนื้อหาคอร์ส เช่น Thai หรือ English</FieldHelp>
                                        <input value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="เช่น Thai, English" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">วันหมดเขตสมัคร</label>
                                        <FieldHelp>วันสุดท้ายที่ระบบจะอนุญาตให้ผู้เรียนสมัครคอร์สนี้</FieldHelp>
                                        <input type="date" value={enrollmentDeadline} onChange={(event) => setEnrollmentDeadline(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">จำนวนรับสูงสุด</label>
                                        <FieldHelp>ถ้าเว้นว่างหรือใส่ 0 ระบบจะตีความว่าไม่จำกัดจำนวนผู้เรียน</FieldHelp>
                                        <input type="number" min={0} value={maxStudents || ''} onChange={(event) => setMaxStudents(Number(event.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="เว้นว่างหรือ 0 = ไม่จำกัด" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">วันสิ้นสุดคอร์ส</label>
                                        <FieldHelp>วันที่คอร์สสิ้นสุดการเข้าถึงหรือวันสุดท้ายของช่วงเวลาเรียน</FieldHelp>
                                        <input type="date" value={courseEndAt} onChange={(event) => setCourseEndAt(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                                    </div>
                                </div>

                                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-slate-100">
                                    <div>
                                        <span className="text-sm font-semibold text-slate-700">ออกใบรับรอง</span>
                                        <p className="mt-0.5 text-xs text-slate-400">ผู้เรียนที่ผ่านเงื่อนไขของคอร์สจะได้รับใบรับรองหลังเรียนจบ</p>
                                    </div>
                                    <input type="checkbox" checked={hasCertificate} onChange={(event) => setHasCertificate(event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                </label>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700">คอร์สที่เกี่ยวข้อง</label>
                                            <FieldHelp>คอร์สที่เลือกไว้จะแสดงเป็นคำแนะนำต่อในหน้า Course Details ของคอร์สนี้</FieldHelp>
                                        </div>
                                        <div className="text-xs font-semibold text-slate-500">เลือกแล้ว {relatedCourseIds.length} รายการ</div>
                                    </div>

                                    <input
                                        type="text"
                                        value={relatedCoursesSearch}
                                        onChange={(event) => setRelatedCoursesSearch(event.target.value)}
                                        placeholder="ค้นหาชื่อคอร์ส ผู้สอน หรือหมวดหมู่"
                                        className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                                        disabled={isLoadingRelatedCourses || Boolean(relatedCoursesError)}
                                    />

                                    {relatedCoursesError ? (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                                            <p>{relatedCoursesError}</p>
                                            <p className="mt-1 text-xs text-amber-700">คุณยังสามารถสร้างคอร์สต่อได้ และค่อยกลับมาเลือกคอร์สที่เกี่ยวข้องในหน้าแก้ไขภายหลัง</p>
                                            <button type="button" onClick={() => void loadRelatedCourses()} className="mt-2 inline-flex items-center gap-2 font-semibold text-amber-800 underline-offset-2 hover:underline">
                                                <RefreshCw size={14} />
                                                ลองโหลดอีกครั้ง
                                            </button>
                                        </div>
                                    ) : isLoadingRelatedCourses ? (
                                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-500">
                                            <Loader2 size={16} className="animate-spin" />
                                            กำลังโหลดรายการคอร์สที่เกี่ยวข้อง...
                                        </div>
                                    ) : filteredCourseOptions.length === 0 ? (
                                        <p className="text-sm text-slate-400">{availableCourses.length === 0 ? 'ยังไม่มีคอร์สอื่นให้เลือกเป็นคอร์สที่เกี่ยวข้อง' : 'ไม่พบคอร์สที่ตรงกับคำค้นหา'}</p>
                                    ) : (
                                        <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto">
                                            {filteredCourseOptions.map((courseOption) => {
                                                const courseOptionId = Number(courseOption.id);
                                                const checked = relatedCourseIds.includes(courseOptionId);
                                                const categoryName = typeof courseOption.category === 'string' ? courseOption.category : courseOption.category?.name || 'ไม่ระบุหมวด';
                                                return (
                                                    <label key={courseOptionId} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-3 transition-all hover:border-sky-300">
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={(event) => {
                                                                    if (event.target.checked) {
                                                                        setRelatedCourseIds([...relatedCourseIds, courseOptionId]);
                                                                        return;
                                                                    }
                                                                    setRelatedCourseIds(relatedCourseIds.filter((id) => id !== courseOptionId));
                                                                }}
                                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <p className="truncate text-sm font-semibold text-slate-700">{courseOption.title}</p>
                                                                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusMeta(String(courseOption.status))}`}>{String(courseOption.status || 'DRAFT').toUpperCase()}</span>
                                                                </div>
                                                                <p className="mt-1 truncate text-xs text-slate-500">ผู้สอน: {courseOption.authorName || 'ไม่ระบุผู้สอน'}</p>
                                                                <p className="truncate text-xs text-slate-400">หมวดหมู่: {categoryName}</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {settingsValidationErrors.length > 0 && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <p className="font-semibold">กรุณาตรวจสอบข้อมูลการตั้งค่า</p>
                                <ul className="mt-2 list-disc pl-5">
                                    {settingsValidationErrors.map((error) => <li key={error}>{error}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <SectionHeader title="สถานะเป้าหมายของคอร์ส" description="สถานะนี้ใช้กำหนดเป้าหมายหลังสร้างคอร์ส แต่หน้า add จะยังสร้างเป็นโครงคอร์สก่อนเสมอ" />
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {STATUS_OPTIONS.map((option) => {
                                    const isSelected = status === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setStatus(option.value)}
                                            className={`rounded-xl border-2 p-4 text-left transition-all ${isSelected ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                        >
                                            <div className="mb-2 text-sm font-bold text-slate-800">{option.label}</div>
                                            <p className="text-xs text-slate-500">{option.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 4 && (
                    <>
                        {status === 'PUBLISHED' && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                                ระบบจะสร้างคอร์สนี้เป็นฉบับร่างก่อน แล้วพาไปหน้าแก้ไขเพื่อเพิ่มบทเรียน เอกสาร และ assessment ให้ครบก่อนเผยแพร่จริง
                            </div>
                        )}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="รูปปก" className="h-48 w-full object-cover" />
                            ) : (
                                <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100">
                                    <ImageIcon size={48} className="text-sky-300" />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-slate-800">{title || 'ยังไม่ได้ระบุชื่อ'}</h3>
                                    <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${badge.className}`}>{badge.label}</span>
                                </div>
                                <p className="mb-4 text-sm text-slate-500">{description || '-'}</p>
                                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                                    <ReviewStat label="ผู้สอน" value={authorName || '-'} />
                                    <ReviewStat label="หมวดหมู่" value={selectedCategory?.name || '-'} />
                                    <ReviewStat label="ราคา" value={courseType === 'free' ? 'ฟรี' : `฿${Number(price || 0).toLocaleString()}`} />
                                    <ReviewStat label="CPE Credit" value={ceEnabled ? `${cpeCredits || 0} หน่วย` : 'ไม่เปิดใช้'} />
                                    <ReviewStat label="วิดีโอตัวอย่าง" value={selectedPreviewVideo?.name || 'ยังไม่ได้เลือก'} />
                                    <ReviewStat label="รูปปกคอร์ส" value={thumbnailPreview ? 'มีรูปปกแล้ว' : 'ยังไม่ได้อัปโหลด'} />
                                    <ReviewStat label="จำนวนรับ" value={maxStudents > 0 ? `${maxStudents} คน` : 'ไม่จำกัด'} />
                                    <ReviewStat label="วันสิ้นสุดคอร์ส" value={courseEndAt || '-'} />
                                    <ReviewStat label="คอร์สที่เกี่ยวข้อง" value={`${relatedCourseIds.length} รายการ`} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <SectionHeader title="เช็กลิสต์ข้อมูลที่พร้อมสำหรับการสร้างโครงคอร์ส" description="เช็กว่าข้อมูลขั้นต่ำครบแล้วก่อนกดสร้างคอร์ส" />
                            <div className="space-y-2">
                                {requiredChecks.map((item) => (
                                    <div key={item.label} className={`flex items-center gap-3 rounded-lg p-3 ${item.done ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                        {item.done ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Circle size={18} className="text-red-300" />}
                                        <span className={`text-sm font-medium ${item.done ? 'text-emerald-700' : 'text-red-600'}`}>{item.label}</span>
                                    </div>
                                ))}
                                <div className={`flex items-center gap-3 rounded-lg p-3 ${isStep3Valid ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                    {isStep3Valid ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Circle size={18} className="text-red-300" />}
                                    <span className={`text-sm font-medium ${isStep3Valid ? 'text-emerald-700' : 'text-red-600'}`}>การตั้งค่าวันที่และจำนวนรับถูกต้อง</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <SectionHeader title="สิ่งที่ต้องทำต่อในหน้าแก้ไข" description="หลังสร้างโครงคอร์สแล้ว ให้ไปเติมเนื้อหาจริงในหน้า edit ตามรายการนี้" />
                            <div className="space-y-2">
                                {NEXT_EDIT_TASKS.map((task) => (
                                    <div key={task} className="flex items-center gap-3 rounded-lg bg-sky-50 p-3">
                                        <BookOpen size={18} className="text-sky-600" />
                                        <span className="text-sm font-medium text-sky-700">{task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-lg">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
                    <button type="button" onClick={() => goToStep(Math.max(currentStep - 1, 1))} disabled={currentStep === 1} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <ArrowLeft size={16} />
                        ย้อนกลับ
                    </button>

                    <div className="flex items-center gap-3">
                        {hasUnsavedChanges && <span className="hidden text-xs font-semibold text-amber-600 md:inline">มีข้อมูลที่ยังไม่ได้บันทึก</span>}
                        {isDraftReady && (
                            <button type="button" onClick={handleSaveDraft} disabled={isCreating || isLoadingCategories || Boolean(categoriesError)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50">
                                บันทึกฉบับร่าง
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button type="button" onClick={() => goToStep(currentStep + 1)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg">
                                <span>ถัดไป: {STEPS[currentStep]?.title}</span>
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button type="button" onClick={handleCreate} disabled={isCreating || !canNavigateTo(4) || isLoadingCategories || Boolean(categoriesError)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50">
                                {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                                <span>{isCreating ? 'กำลังสร้าง...' : finalCreateLabel}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
