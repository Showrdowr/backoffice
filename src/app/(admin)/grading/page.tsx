import { gradingService } from '@/features/grading/services/gradingService';
import { GradingQueue } from '@/features/grading/components';

export default async function GradingPage() {
  const data = await gradingService.getPendingAttempts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ตรวจข้อสอบ</h1>
        <p className="text-gray-600 mt-2">
          จัดการและตรวจข้อสอบที่รอการพิจารณา
        </p>
      </div>

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">รายการรอตรวจทั้งหมด</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{data.total}</p>
          </div>
          <div className="text-blue-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <GradingQueue attempts={data.attempts} />
    </div>
  );
}
