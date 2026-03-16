'use client';

import { useRouter } from 'next/navigation';
import type { PendingAttempt } from '../types';

interface GradingQueueProps {
  attempts: PendingAttempt[];
}

export function GradingQueue({ attempts }: GradingQueueProps) {
  const router = useRouter();

  if (attempts.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
        <p className="text-gray-500 text-lg">✓ ไม่มีรายการรอตรวจ</p>
        <p className="text-gray-400 text-sm mt-2">ข้อสอบทั้งหมดได้รับการตรวจเรียบร้อยแล้ว</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ผู้เรียน
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                คอร์ส
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ข้อสอบ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                วันที่ส่ง
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                จำนวนข้อรอตรวจ
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                การกระทำ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{attempt.user.fullName}</div>
                    <div className="text-sm text-gray-500">{attempt.user.email}</div>
                    {attempt.user.licenseNumber && (
                      <div className="text-xs text-blue-600">{attempt.user.licenseNumber}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{attempt.exam.courseTitle}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{attempt.exam.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(attempt.submittedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {attempt.freeTextQuestionsCount} ข้อ
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => router.push(`/grading/${attempt.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    ตรวจให้คะแนน
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
