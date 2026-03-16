// ==========================================
// Grading Feature - TypeScript Types
// ==========================================

/**
 * สถานะของการทำข้อสอบ
 */
export enum ExamAttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',  // กำลังทำอยู่
  SUBMITTED = 'SUBMITTED',      // ส่งแล้ว รอตรวจ
  GRADED = 'GRADED'             // ตรวจเสร็จแล้ว
}

/**
 * ข้อมูลรายการรอตรวจ (ใช้ใน Grading Queue)
 */
export interface PendingAttempt {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    licenseNumber?: string;
  };
  exam: {
    id: number;
    title: string;
    courseTitle: string;
  };
  submittedAt: string;
  freeTextQuestionsCount: number;
}

/**
 * ข้อมูลคำตอบแต่ละข้อ (สำหรับตรวจ)
 */
export interface GradingAnswer {
  id: number;
  question: {
    id: number;
    questionText: string;
    questionType: 'MULTIPLE_CHOICE' | 'FREE_TEXT';
    scoreWeight: number;
    correctAnswer?: string;
    options?: { id: string; text: string }[];
  };
  answerText: string;
  pointsEarned?: number;
  feedback?: string;
  isGraded: boolean;
}

/**
 * ข้อมูลทั้งหมดสำหรับหน้าตรวจข้อสอบ
 */
export interface GradingDetail {
  attempt: {
    id: number;
    status: ExamAttemptStatus;
    startedAt: string;
    finishedAt?: string;
  };
  user: {
    fullName: string;
    email: string;
    licenseNumber?: string;
  };
  exam: {
    title: string;
    passingScorePercent: number;
  };
  answers: GradingAnswer[];
}

/**
 * ข้อมูลที่ส่งไปบันทึกการให้คะแนน
 */
export interface GradeSubmission {
  gradedAnswers: {
    answerId: number;
    pointsEarned: number;
    feedback?: string;
  }[];
}

/**
 * Response สำหรับรายการรอตรวจ (with pagination)
 */
export interface PendingAttemptsResponse {
  attempts: PendingAttempt[];
  total: number;
  page: number;
  totalPages: number;
}
