'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gradingService } from '@/features/grading/services/gradingService';
import {
  StudentInfoCard,
  ExamInfoCard,
  GradingForm
} from '@/features/grading/components';
import type { GradingDetail } from '@/features/grading/types';

export default function GradingDetailPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params); // Unwrap the Promise
  const [data, setData] = useState<GradingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await gradingService.getGradingDetail(Number(resolvedParams.attemptId));
        setData(result);
      } catch (err) {
        console.error('Error fetching grading detail:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.attemptId]);

  const handleSubmit = async (grades: any[]) => {
    try {
      await gradingService.submitGrades(Number(resolvedParams.attemptId), {
        gradedAnswers: grades
      });
      
      alert('✅ บันทึกผลการตรวจเรียบร้อยแล้ว');
      router.push('/grading');
    } catch (err) {
      console.error('Error submitting grades:', err);
      alert('❌ เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleCancel = () => {
    if (window.confirm('ยืนยันการยกเลิก? ข้อมูลที่กรอกจะไม่ถูกบันทึก')) {
      router.push('/grading');
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">❌ {error || 'ไม่พบข้อมูล'}</p>
          <button
            onClick={() => router.push('/grading')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            กลับไปหน้ารายการ
          </button>
        </div>
      </div>
    );
  }

  // Calculate total score
  const totalScore = data.answers.reduce((sum, a) => sum + a.question.scoreWeight, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/grading')}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
        >
          ← กลับไปหน้ารายการ
        </button>
        <h1 className="text-3xl font-bold text-gray-900">ตรวจข้อสอบ</h1>
        <p className="text-gray-600 mt-2">
          ให้คะแนนและฟีดแบ็กสำหรับคำตอบอัตนัย
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StudentInfoCard
          fullName={data.user.fullName}
          email={data.user.email}
          licenseNumber={data.user.licenseNumber}
        />
        <ExamInfoCard
          title={data.exam.title}
          totalScore={totalScore}
          passingScorePercent={data.exam.passingScorePercent}
        />
      </div>

      {/* Grading Form */}
      <GradingForm
        answers={data.answers}
        passingScorePercent={data.exam.passingScorePercent}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
