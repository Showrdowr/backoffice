import { HelpCircle, Clock, CheckCircle } from 'lucide-react';
import type { Question } from '../../types';

interface CourseExamTabProps {
    questions: Question[];
    examSettings: {
        minPassingScore: number;
        maxAttempts: number | 'unlimited';
    };
}

export function CourseExamTab({ questions, examSettings }: CourseExamTabProps) {
    const postLessonQuestions = questions.filter(q => q.examType === 'final-exam');
    const interactiveQuestions = questions.filter(q => q.examType === 'interactive');

    return (
        <div className="space-y-6">
            {/* Exam Settings */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">การตั้งค่าแบบทดสอบ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">คะแนนผ่านขั้นต่ำ</p>
                        <p className="text-2xl font-bold text-violet-600">{examSettings.minPassingScore}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">จำนวนครั้งที่ทำได้</p>
                        <p className="text-2xl font-bold text-violet-600">
                            {examSettings.maxAttempts === 'unlimited' ? 'ไม่จำกัด' : `${examSettings.maxAttempts} ครั้ง`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Post-Lesson Questions */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle size={20} className="text-violet-500" />
                        แบบทดสอบหลังเรียน
                        <span className="text-sm font-normal text-slate-500">({postLessonQuestions.length} คำถาม)</span>
                    </h3>
                </div>

                {postLessonQuestions.length === 0 ? (
                    <div className="bg-violet-50 rounded-xl border border-violet-200 p-8 text-center">
                        <p className="text-slate-600">ยังไม่มีคำถามแบบทดสอบหลังเรียน</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {postLessonQuestions.map((question, index) => (
                            <div key={question.id} className="bg-white border border-violet-100 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm font-bold text-violet-600">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800 mb-2">{question.question}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${question.type === 'multiple-choice'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {question.type === 'multiple-choice' ? 'ตัวเลือก' : 'เขียนตอบ'}
                                            </span>
                                            {question.points && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                                                    {question.points} คะแนน
                                                </span>
                                            )}
                                        </div>
                                        {question.type === 'multiple-choice' && question.options && (
                                            <div className="mt-3 space-y-1.5">
                                                {question.options.map((opt, i) => (
                                                    <div key={opt.id} className={`text-sm px-3 py-2 rounded-lg ${opt.isCorrect
                                                            ? 'bg-green-50 text-green-700 font-medium border border-green-200'
                                                            : 'bg-slate-50 text-slate-600'
                                                        }`}>
                                                        {String.fromCharCode(65 + i)}. {opt.text}
                                                        {opt.isCorrect && <span className="ml-2">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Interactive Questions */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle size={20} className="text-orange-500" />
                        คำถาม Interactive ระหว่างเรียน
                        <span className="text-sm font-normal text-slate-500">({interactiveQuestions.length} คำถาม)</span>
                    </h3>
                </div>

                {interactiveQuestions.length === 0 ? (
                    <div className="bg-orange-50 rounded-xl border border-orange-200 p-8 text-center">
                        <p className="text-slate-600">ยังไม่มีคำถาม Interactive</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {interactiveQuestions.map((question, index) => (
                            <div key={question.id} className="bg-white border border-orange-100 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800 mb-2">{question.question}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {question.timestamp && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {question.timestamp}
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${question.type === 'multiple-choice'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {question.type === 'multiple-choice' ? 'ตัวเลือก' : 'เขียนตอบ'}
                                            </span>
                                        </div>
                                        {question.type === 'multiple-choice' && question.options && (
                                            <div className="mt-3 space-y-1.5">
                                                {question.options.map((opt, i) => (
                                                    <div key={opt.id} className={`text-sm px-3 py-2 rounded-lg ${opt.isCorrect
                                                            ? 'bg-green-50 text-green-700 font-medium border border-green-200'
                                                            : 'bg-slate-50 text-slate-600'
                                                        }`}>
                                                        {String.fromCharCode(65 + i)}. {opt.text}
                                                        {opt.isCorrect && <span className="ml-2">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
