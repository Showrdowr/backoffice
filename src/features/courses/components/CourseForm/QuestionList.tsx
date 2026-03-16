import { Trash2, Edit2, Clock } from 'lucide-react';
import type { Question } from '../../types';

interface QuestionListProps {
    questions: Question[];
    examType: 'final-exam' | 'interactive';
    onEdit: (question: Question) => void;
    onDelete: (question: Question) => void;
}

export function QuestionList({ questions, examType, onEdit, onDelete }: QuestionListProps) {
    const filteredQuestions = questions.filter(q => q.examType === examType);

    if (filteredQuestions.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p className="text-sm">ยังไม่มีคำถาม</p>
            </div>
        );
    }

    const getTypeLabel = (type: string) => {
        return type === 'multiple-choice' ? 'ตัวเลือก' : 'เขียนตอบ';
    };

    const getTypeBadgeColor = (type: string) => {
        return type === 'multiple-choice'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-green-100 text-green-700';
    };

    return (
        <div className="space-y-3">
            {filteredQuestions.map((question, index) => (
                <div
                    key={question.id}
                    className="group flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-violet-200 transition-all"
                >
                    <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-violet-600">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 mb-2 line-clamp-2">
                            {question.question}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadgeColor(question.type)}`}>
                                {getTypeLabel(question.type)}
                            </span>
                            {question.timestamp && (
                                <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700 flex items-center gap-1">
                                    <Clock size={12} />
                                    {question.timestamp}
                                </span>
                            )}
                            {question.points && (
                                <span className="text-xs text-slate-500">
                                    {question.points} คะแนน
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(question)}
                            className="p-2 hover:bg-violet-50 rounded-lg transition-colors"
                            title="แก้ไข"
                        >
                            <Edit2 size={16} className="text-violet-600" />
                        </button>
                        <button
                            onClick={() => onDelete(question)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบ"
                        >
                            <Trash2 size={16} className="text-red-500" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
