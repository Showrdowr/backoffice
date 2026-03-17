import { apiClient } from '@/services/api/client';
import type {
  PendingAttemptsResponse,
  GradingDetail,
  GradeSubmission,
} from '../types';

/**
 * ดึงรายการข้อสอบที่รอตรวจ
 */
export async function getPendingAttempts(params?: {
  courseId?: number;
  examId?: number;
  page?: number;
  limit?: number;
}): Promise<PendingAttemptsResponse> {
  const query = new URLSearchParams();
  if (params?.courseId) query.append('courseId', String(params.courseId));
  if (params?.examId) query.append('examId', String(params.examId));
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const response = await apiClient.get<PendingAttemptsResponse>(
    `/admin/exam-attempts/pending?${query.toString()}`
  );
  return response.data;
}

/**
 * ดึงรายละเอียดสำหรับตรวจข้อสอบ
 */
export async function getGradingDetail(attemptId: number): Promise<GradingDetail> {
  const response = await apiClient.get<GradingDetail>(
    `/admin/exam-attempts/${attemptId}`
  );
  return response.data;
}

/**
 * บันทึกการให้คะแนน
 */
export async function submitGrades(
  attemptId: number,
  data: GradeSubmission
): Promise<void> {
  await apiClient.post(`/admin/exam-attempts/${attemptId}/grade`, data);
}

/**
 * Grading Service Object
 */
export const gradingService = {
  getPendingAttempts,
  getGradingDetail,
  submitGrades
};
