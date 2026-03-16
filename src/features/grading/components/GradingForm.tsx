'use client';

import { useState, useMemo } from 'react';
import type { GradingAnswer } from '../types';
import { AnswerReviewCard } from './AnswerReviewCard';
import { ScoreSummaryCard } from './ScoreSummaryCard';

interface GradingFormProps {
  answers: GradingAnswer[];
  passingScorePercent: number;
  onSubmit: (grades: { answerId: number; pointsEarned: number; feedback?: string }[]) => void;
  onCancel?: () => void;
}

export function GradingForm({ answers, passingScorePercent, onSubmit, onCancel }: GradingFormProps) {
  const [grades, setGrades] = useState<Map<number, { points: number; feedback: string }>>(
    new Map()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // คำนวณคะแนนรวม
  const { currentScore, totalScore } = useMemo(() => {
    let current = 0;
    let total = 0;

    answers.forEach(answer => {
      total += answer.question.scoreWeight;
      
      if (answer.isGraded) {
        // ข้อที่ตรวจแล้ว (Multiple Choice)
        current += answer.pointsEarned || 0;
      } else {
        // ข้อที่กำลังตรวจ (Free Text)
        const grade = grades.get(answer.id);
        current += grade?.points || 0;
      }
    });

    return { currentScore: current, totalScore: total };
  }, [answers, grades]);

  // จำนวนข้อที่ยังไม่ได้ตรวจ
  const ungradedCount = useMemo(() => {
    return answers.filter(a => !a.isGraded && !grades.has(a.id)).length;
  }, [answers, grades]);

  const handleGradeChange = (answerId: number, points: number, feedback: string) => {
    setGrades(new Map(grades.set(answerId, { points, feedback })));
  };

  const handleSubmit = async () => {
    // Validation: ต้องให้คะแนนครบทุกข้อ Free Text
    const ungradedFreeText = answers.filter(a => !a.isGraded && !grades.has(a.id));
    
    if (ungradedFreeText.length > 0) {
      alert(`กรุณาให้คะแนนครบทุกข้อ (เหลืออีก ${ungradedFreeText.length} ข้อ)`);
      return;
    }

    // Confirm
    const confirmed = window.confirm(
      `ยืนยันการบันทึกผลการตรวจ?\n\nคะแนนรวม: ${currentScore}/${totalScore}\nสถานะ: ${currentScore >= (totalScore * passingScorePercent / 100) ? 'ผ่าน' : 'ไม่ผ่าน'}`
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const gradedAnswers = Array.from(grades.entries()).map(([answerId, data]) => ({
        answerId,
        pointsEarned: data.points,
        feedback: data.feedback || undefined
      }));

      await onSubmit(gradedAnswers);
    } catch (error) {
      console.error('Error submitting grades:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Answers List */}
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <div key={answer.id}>
            <div className="text-sm text-gray-500 mb-2 font-medium">
              ข้อที่ {index + 1}
            </div>
            <AnswerReviewCard
              answer={answer}
              onGradeChange={handleGradeChange}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <ScoreSummaryCard
        currentScore={currentScore}
        totalScore={totalScore}
        passingScorePercent={passingScorePercent}
      />

      {/* Warning if not all graded */}
      {ungradedCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            ⚠️ ยังมีข้อที่ยังไม่ได้ให้คะแนน: {ungradedCount} ข้อ
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || ungradedCount > 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลการตรวจ'}
        </button>
      </div>
    </div>
  );
}
