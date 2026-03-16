'use client';

import { use, useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCourseForm } from '@/features/courses/hooks/useCourseForm';
import { ContentSection } from '@/features/courses/components/CourseForm/ContentSection';
import { PricingSection } from '@/features/courses/components/CourseForm/PricingSection';
import { CECreditsSection } from '@/features/courses/components/CourseForm/CECreditsSection';
import { ExamSection } from '@/features/courses/components/CourseForm/ExamSection';
import { InteractiveQuestionSection } from '@/features/courses/components/CourseForm/InteractiveQuestionSection';
import { CourseVideoSection } from '@/features/courses/components/CourseForm/CourseVideoSection';
import { AddLessonModal } from '@/features/courses/components/CourseForm/AddLessonModal';
import { EditLessonModal } from '@/features/courses/components/CourseForm/EditLessonModal';
import { DeleteLessonModal } from '@/features/courses/components/CourseForm/DeleteLessonModal';
import { AddQuestionModal } from '@/features/courses/components/CourseForm/AddQuestionModal';
import { DeleteQuestionModal } from '@/features/courses/components/CourseForm/DeleteQuestionModal';
import { Image as ImageIcon, BookOpen } from 'lucide-react';
import { categoryService } from '@/features/courses/services/categoryService';
import type { Category } from '@/features/courses/types/categories';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState('basic'); // basic, curriculum, assessment, settings
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    // Destructure useCourseForm
    const {
        // Basic Info
        title, setTitle,
        description, setDescription,
        details, setDetails,
        categoryId, setCategoryId,
        subcategories, setSubcategories,
        saveCourse,

        // Videos
        uploadedVideos,
        handleAddVideo,
        handleDeleteVideo,
        // Lessons
        lessons,
        newLesson,
        currentLesson,
        setNewLesson,
        setCurrentLesson,
        courseType,
        setCourseType,
        ceEnabled,
        setCeEnabled,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,
        handleAddLesson,
        handleEditLesson,
        handleDeleteLesson,
        openEditModal,
        openDeleteModal,
        // Exam
        questions,
        examSettings,
        setExamSettings,
        showAddQuestionModal,
        setShowAddQuestionModal,
        showDeleteQuestionModal,
        setShowDeleteQuestionModal,
        handleAddQuestion,
        handleDeleteQuestion,
        openDeleteQuestionModal,
        // Preview Video
        previewVideoId,
        handleSetPreviewVideo,
        status, setStatus,
    } = useCourseForm(id);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const cats = await categoryService.getCategories();
        setCategories(cats);
    };

    const handleCategoryChange = (catId: string) => {
        setCategoryId(catId);
        setSubcategories([]); // Reset subcategories when category changes
    };

    const toggleSubcategory = (subId: string) => {
        setSubcategories(prev =>
            prev.includes(subId)
                ? prev.filter(id => id !== subId)
                : [...prev, subId]
        );
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveCourse();
            alert('บันทึกข้อมูลเรียบร้อย');
        } catch (error) {
            console.error('Failed to save course:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'ข้อมูลทั่วไป' },
        { id: 'curriculum', label: 'หลักสูตร' },
        { id: 'assessment', label: 'แบบทดสอบ' },
        { id: 'settings', label: 'ตั้งค่า' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/courses/${id}`} className="p-2 hover:bg-sky-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">แก้ไขคอร์ส</h1>
                        <p className="text-slate-500">จัดการข้อมูลและเนื้อหาของคอร์สเรียน</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/courses/${id}`}
                        className="px-5 py-2.5 border border-sky-200 rounded-xl hover:bg-sky-50 text-sm font-semibold transition-all"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>กำลังบันทึก...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>บันทึกการเปลี่ยนแปลง</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id
                            ? 'text-sky-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {/* 1. Basic Info Tab */}
                {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
                                    <h2 className="text-xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Existing inputs... */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            ชื่อคอร์ส <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
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
                                    {/* Subcategories... */}
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
                        </div>
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

                            {/* Preview Video Widget */}
                            <CourseVideoSection
                                videos={uploadedVideos.filter(v => v.id === previewVideoId)}
                                onAddVideo={(video) => {
                                    handleAddVideo(video);
                                    handleSetPreviewVideo(video.id);
                                }}
                                onDeleteVideo={handleDeleteVideo}
                                previewVideoId={previewVideoId}
                                onSelectPreview={handleSetPreviewVideo}
                                title="วิดีโอตัวอย่าง"
                                description="วิดีโอแนะนำคอร์ส (Teaser)"
                                showPreviewAsBadge={true}
                            />
                        </div>
                    </div>
                )}

                {/* 2. Curriculum Tab */}
                {activeTab === 'curriculum' && (
                    <div className="space-y-6">
                        <CourseVideoSection
                            videos={uploadedVideos}
                            onAddVideo={handleAddVideo}
                            onDeleteVideo={handleDeleteVideo}
                            previewVideoId={previewVideoId}
                            onSelectPreview={handleSetPreviewVideo}
                        />
                        <ContentSection
                            lessons={lessons}
                            onAddClick={() => setShowAddModal(true)}
                            onEdit={(lesson) => openEditModal({ ...lesson, videoQuestions: lesson.videoQuestions || [] })}
                            onDelete={(lesson) => openDeleteModal({ ...lesson, videoQuestions: lesson.videoQuestions || [] })}
                        />
                    </div>
                )}

                {/* 3. Assessment Tab */}
                {activeTab === 'assessment' && (
                    <div className="space-y-8 max-w-4xl">
                        {/* Interactive Questions Section */}
                        <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <BookOpen size={22} className="text-orange-500" />
                                            คำถาม Interactive ระหว่างเรียน
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-1">
                                            คำถามที่แสดงระหว่างดูวิดีโอ (เลือกบทเรียนที่ต้องการจัดการ)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {/* Lesson Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        เลือกบทเรียน
                                    </label>
                                    <select
                                        value={selectedLessonId || ''}
                                        onChange={(e) => setSelectedLessonId(e.target.value || null)}
                                        className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all bg-white"
                                    >
                                        <option value="">-- เลือกบทเรียน --</option>
                                        {lessons.map((lesson) => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.title} ({lesson.videoQuestions?.length || 0} คำถาม)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Interactive Question Section for selected lesson */}
                                {selectedLessonId && lessons.find(l => String(l.id) === selectedLessonId) ? (
                                    <InteractiveQuestionSection
                                        lesson={lessons.find(l => String(l.id) === selectedLessonId)!}
                                        onLessonChange={(updatedLesson) => {
                                            // Update the lesson in the lessons array
                                            const lessonIndex = lessons.findIndex(l => l.id === updatedLesson.id);
                                            if (lessonIndex !== -1) {
                                                const updatedLessons = [...lessons];
                                                updatedLessons[lessonIndex] = { ...updatedLesson, videoQuestions: updatedLesson.videoQuestions || [] };
                                                // Note: Need to update lessons state via hook
                                                openEditModal({ ...updatedLesson, videoQuestions: updatedLesson.videoQuestions || [] });
                                                handleEditLesson();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                                        <p>กรุณาเลือกบทเรียนเพื่อจัดการคำถาม Interactive</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Final Exam Section */}
                        <ExamSection
                            questions={questions}
                            examSettings={examSettings}
                            onAddClick={() => setShowAddQuestionModal(true)}
                            onEdit={() => { }}
                            onDelete={openDeleteQuestionModal}
                            onSettingsChange={setExamSettings}
                        />
                    </div>
                )}

                {/* 4. Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PricingSection courseType={courseType} onCourseTypeChange={setCourseType} />
                        <CECreditsSection ceEnabled={ceEnabled} onCeEnabledChange={setCeEnabled} />

                        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
                            <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 rounded-t-2xl">
                                <h2 className="text-xl font-bold text-slate-800">สถานะคอร์ส</h2>
                            </div>
                            <div className="p-6">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all bg-white"
                                >
                                    <option value="DRAFT">ฉบับร่าง (Draft)</option>
                                    <option value="PUBLISHED">เผยแพร่ (Published)</option>
                                    <option value="ARCHIVED">เก็บถาวร (Archived)</option>
                                </select>
                                <p className="mt-2 text-sm text-slate-500">
                                    * สถานะ &quot;เผยแพร่&quot; จะทำให้ผู้เรียนสามารถมองเห็นและสมัครเรียนคอร์สนี้ได้
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals placed outside tabs to work globally */}
            <AddLessonModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddLesson}
                lessonData={newLesson}
                onChange={setNewLesson}
                availableVideos={uploadedVideos}
                onVideoUpload={handleAddVideo}
            />

            <EditLessonModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setCurrentLesson(null);
                }}
                onSave={handleEditLesson}
                lesson={currentLesson}
                onChange={(lesson) => setCurrentLesson({ ...lesson, videoQuestions: lesson.videoQuestions || [] })}
                availableVideos={uploadedVideos}
                onVideoUpload={handleAddVideo}
            />

            <DeleteLessonModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setCurrentLesson(null);
                }}
                onConfirm={handleDeleteLesson}
                lesson={currentLesson}
            />

            <AddQuestionModal
                isOpen={showAddQuestionModal}
                onClose={() => setShowAddQuestionModal(false)}
                onAdd={handleAddQuestion}
            />

            <DeleteQuestionModal
                isOpen={showDeleteQuestionModal}
                onClose={() => setShowDeleteQuestionModal(false)}
                onConfirm={handleDeleteQuestion}
                question={null}
            />
        </div >
    );
}
