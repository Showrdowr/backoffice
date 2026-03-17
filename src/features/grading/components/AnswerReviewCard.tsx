'use client';

import { useState } from 'react';
import type { GradingAnswer } from '../types';

interface AnswerReviewCardProps {
  answer: GradingAnswer;
  onGradeChange?: (answerId: number, points: number, feedback: string) => void;
}

export function AnswerReviewCard({ answer, onGradeChange }: AnswerReviewCardProps) {
  const [points, setPoints] = useState<number>(answer.pointsEarned || 0);
  const [feedback, setFeedback] = useState<string>(answer.feedback || '');

  const isAutoGraded = answer.question.questionType === 'MULTIPLE_CHOICE' || answer.question.questionType === 'TRUE_FALSE';
  const isFreeText = answer.question.questionType === 'SHORT_ANSWER';

  const handlePointsChange = (value: number) => {
    setPoints(value);
    onGradeChange?.(answer.id, value, feedback);
  };

  const handleFeedbackChange = (value: string) => {
    setFeedback(value);
    onGradeChange?.(answer.id, points, value);
  };

  const isCorrect = answer.isGraded && answer.answerText === answer.question.correctAnswer;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {isAutoGraded ? (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              📝 Multiple Choice
            </span>
          ) : (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              ✍️ Free Text
            </span>
          )}
          <span className="text-gray-500 text-sm">
            คะแนน: {answer.question.scoreWeight}
          </span>
        </div>
        {answer.isGraded && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✓ ตรวจแล้ว
          </span>
        )}
      </div>

      {/* Question */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">คำถาม:</h4>
        <p className="text-gray-700">{answer.question.questionText}</p>
      </div>

      {/* Multiple Choice Options */}
      {isAutoGraded && answer.question.options && (
        <div className="mb-4">
          <h5 className="font-semibold text-gray-700 text-sm mb-2">ตัวเลือก:</h5>
          <div className="space-y-2">
            {answer.question.options.map((option) => (
              <div
                key={option.id}
                className={`p-3 rounded border ${
                  option.id === answer.question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : option.id === answer.answerText && !isCorrect
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <span className="font-medium">{option.id}.</span> {option.text}
                {option.id === answer.question.correctAnswer && (
                  <span className="ml-2 text-green-600 text-sm">✓ เฉลย</span>
                )}
                {option.id === answer.answerText && (
                  <span className="ml-2 text-blue-600 text-sm">← คำตอบผู้เรียน</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer */}
      {isFreeText && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">คำตอบของผู้เรียน:</h4>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{answer.answerText}</p>
          </div>
        </div>
      )}

      {/* Grading Section (Free Text only, not graded yet) */}
      {isFreeText && !answer.isGraded && onGradeChange && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              ให้คะแนน (เต็ม {answer.question.scoreWeight})
            </label>
            <input
              type="number"
              min="0"
              max={answer.question.scoreWeight}
              value={points === 0 ? '' : points}
              placeholder="0"
              onChange={(e) => handlePointsChange(Number(e.target.value) || 0)}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              ฟีดแบ็ก (ไม่บังคับ)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="ให้คำแนะนำหรือข้อเสนอแนะแก่ผู้เรียน..."
            />
          </div>
        </div>
      )}

      {/* Graded Info */}
      {answer.isGraded && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">คะแนนที่ได้:</span>
            <span className="text-2xl font-bold text-green-600">
              {answer.pointsEarned}/{answer.question.scoreWeight}
            </span>
          </div>
          {answer.feedback && (
            <div className="mt-3">
              <span className="text-gray-600 text-sm">ฟีดแบ็ก:</span>
              <p className="mt-1 text-gray-700 text-sm italic">{answer.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
