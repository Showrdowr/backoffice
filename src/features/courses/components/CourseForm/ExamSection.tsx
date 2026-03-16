import { Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import type { Question, ExamSettings, CreateExamQuestionInput, CreateVideoQuestionInput } from '../../types';
import { QuestionList } from './QuestionList';
import { CSVImportModal } from './CSVImportModal';
import { examService } from '../../services/examService';

interface ExamSectionProps {
    questions: Question[];
    examSettings: ExamSettings;
    examId?: number; // Required for CSV import
    onAddClick: () => void;
    onEdit: (question: Question) => void;
    onDelete: (question: Question) => void;
    onSettingsChange: (settings: ExamSettings) => void;
    onQuestionsImported?: () => void; // Callback to refresh questions after import
}

export function ExamSection({
    questions,
    examSettings,
    examId,
    onAddClick,
    onEdit,
    onDelete,
    onSettingsChange,
    onQuestionsImported,
}: ExamSectionProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // We only support 'post-lesson' (Final Exam) in this section now
    const examQuestions = questions.filter(q => q.examType === 'final-exam');

    const handleImportQuestions = async (
        importedQuestions: CreateExamQuestionInput[] | CreateVideoQuestionInput[]
    ) => {
        if (!examId) {
            throw new Error('กรุณาบันทึกข้อมูล Exam ก่อนทำการ Import');
        }

        // Cast to CreateExamQuestionInput[] since we're in exam mode
        const result = await examService.bulkAddExamQuestions(
            examId,
            importedQuestions as CreateExamQuestionInput[]
        );

        if (result.failed > 0) {
            console.warn('Some questions failed to import:', result.errors);
        }

        // Refresh the questions list
        if (onQuestionsImported) {
            onQuestionsImported();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">แบบทดสอบท้ายคอร์ส (Final Exam)</h2>
                        <p className="text-sm text-slate-500 mt-1">ตั้งค่าและจัดการคำถามสำหรับวัดผลผู้เรียนหลังจบคอร์ส</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* CSV Import Button */}
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="flex items-center gap-2 border border-violet-300 text-violet-600 px-4 py-2.5 rounded-xl hover:bg-violet-50 transition-all text-sm font-semibold"
                            title="Import จาก CSV"
                        >
                            <Upload size={18} />
                            <span className="hidden sm:inline">Import CSV</span>
                        </button>
                        {/* Add Question Button */}
                        <button
                            onClick={onAddClick}
                            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                        >
                            <Plus size={18} />
                            <span>เพิ่มคำถาม</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-b border-violet-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">การตั้งค่า Exam</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            คะแนนผ่านขั้นต่ำ (%)
                        </label>
                        <input
                            type="number"
                            value={examSettings.minPassingScore}
                            onChange={(e) =>
                                onSettingsChange({ ...examSettings, minPassingScore: Number(e.target.value) })
                            }
                            min={0}
                            max={100}
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            จำนวนครั้งที่ทำได้
                        </label>
                        <select
                            value={examSettings.maxAttempts}
                            onChange={(e) =>
                                onSettingsChange({
                                    ...examSettings,
                                    maxAttempts: e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value),
                                })
                            }
                            className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all bg-white"
                        >
                            <option value="unlimited">ไม่จำกัด</option>
                            <option value="1">1 ครั้ง</option>
                            <option value="2">2 ครั้ง</option>
                            <option value="3">3 ครั้ง</option>
                            <option value="5">5 ครั้ง</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Question List */}
            <div className="p-6">
                {examQuestions.length === 0 ? (
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-200 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Plus size={32} className="text-violet-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มีคำถาม</h3>
                        <p className="text-sm text-slate-500 mb-4">เพิ่มคำถามสำหรับแบบทดสอบวัดผล หรือ Import จาก CSV</p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center gap-2 border border-violet-300 text-violet-600 px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-all text-sm font-semibold"
                            >
                                <Upload size={18} />
                                Import CSV
                            </button>
                            <button
                                onClick={onAddClick}
                                className="inline-flex items-center gap-2 bg-violet-500 text-white px-5 py-2.5 rounded-xl hover:bg-violet-600 transition-all text-sm font-semibold"
                            >
                                <Plus size={18} />
                                เพิ่มคำถามแรก
                            </button>
                        </div>
                    </div>
                ) : (
                    <QuestionList
                        questions={questions}
                        examType="final-exam"
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
            </div>

            {/* CSV Import Modal */}
            <CSVImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                type="exam"
                targetId={examId || 0}
                onImport={handleImportQuestions}
            />
        </div>
    );
}

