import type {
  PendingAttempt,
  PendingAttemptsResponse,
  GradingDetail,
  GradeSubmission,
  ExamAttemptStatus
} from '../types';

// ==========================================
// Mock Data
// ==========================================

const MOCK_PENDING_ATTEMPTS: PendingAttempt[] = [
  {
    id: 1,
    user: {
      id: 101,
      fullName: 'ภก.สมชาย ใจดี',
      email: 'somchai@example.com',
      licenseNumber: 'PH-12345'
    },
    exam: {
      id: 1,
      title: 'แบบทดสอบหลังเรียน',
      courseTitle: 'การดูแลผู้ป่วยโรคเรื้อรัง'
    },
    submittedAt: '2026-01-07T08:00:00Z',
    freeTextQuestionsCount: 2
  },
  {
    id: 2,
    user: {
      id: 102,
      fullName: 'ภก.สมหญิง รักเรียน',
      email: 'somying@example.com',
      licenseNumber: 'PH-67890'
    },
    exam: {
      id: 2,
      title: 'แบบทดสอบท้ายบท',
      courseTitle: 'เภสัชกรรมคลินิกขั้นสูง'
    },
    submittedAt: '2026-01-06T15:30:00Z',
    freeTextQuestionsCount: 3
  },
  {
    id: 3,
    user: {
      id: 103,
      fullName: 'นายทดสอบ ระบบ',
      email: 'test@example.com'
    },
    exam: {
      id: 1,
      title: 'แบบทดสอบหลังเรียน',
      courseTitle: 'การดูแลผู้ป่วยโรคเรื้อรัง'
    },
    submittedAt: '2026-01-06T10:00:00Z',
    freeTextQuestionsCount: 1
  }
];

const MOCK_GRADING_DETAIL: GradingDetail = {
  attempt: {
    id: 1,
    status: 'SUBMITTED' as ExamAttemptStatus,
    startedAt: '2026-01-07T07:45:00Z',
    finishedAt: '2026-01-07T08:00:00Z'
  },
  user: {
    fullName: 'ภก.สมชาย ใจดี',
    email: 'somchai@example.com',
    licenseNumber: 'PH-12345'
  },
  exam: {
    title: 'แบบทดสอบหลังเรียน - การดูแลผู้ป่วยโรคเรื้อรัง',
    passingScorePercent: 80
  },
  answers: [
    {
      id: 1,
      question: {
        id: 1,
        questionText: 'ข้อใดคือหลักการสำคัญที่สุดในการให้คำปรึกษาผู้ป่วยเบาหวาน?',
        questionType: 'MULTIPLE_CHOICE',
        scoreWeight: 5,
        correctAnswer: 'A',
        options: [
          { id: 'A', text: 'ให้ความรู้เรื่องการควบคุมระดับน้ำตาล' },
          { id: 'B', text: 'แนะนำให้ออกกำลังกายทุกวัน' },
          { id: 'C', text: 'ตรวจสอบการใช้ยาสม่ำเสมอ' },
          { id: 'D', text: 'ทั้งหมดข้างต้น' }
        ]
      },
      answerText: 'D',
      pointsEarned: 5,
      isGraded: true
    },
    {
      id: 2,
      question: {
        id: 2,
        questionText: 'อธิบายขั้นตอนการดูแลผู้ป่วยโรคเรื้อรังที่บ้านอย่างละเอียด',
        questionType: 'FREE_TEXT',
        scoreWeight: 10
      },
      answerText: 'การดูแลผู้ป่วยโรคเรื้อรังที่บ้านควรเริ่มจากการประเมินอาการและความต้องการของผู้ป่วย จากนั้นวางแผนการรักษาร่วมกับผู้ป่วยและครอบครัว ติดตามผลการรักษาอย่างสม่ำเสมอ และปรับแผนตามความเหมาะสม นอกจากนี้ยังต้องให้ความรู้แก่ผู้ดูแลเรื่องการสังเกตอาการและการป้องกันภาวะแทรกซ้อน',
      isGraded: false
    },
    {
      id: 3,
      question: {
        id: 3,
        questionText: 'ข้อใดไม่ใช่ภาวะแทรกซ้อนของโรคความดันโลหิตสูง?',
        questionType: 'MULTIPLE_CHOICE',
        scoreWeight: 5,
        correctAnswer: 'C',
        options: [
          { id: 'A', text: 'โรคหัวใจ' },
          { id: 'B', text: 'โรคไต' },
          { id: 'C', text: 'โรคตับ' },
          { id: 'D', text: 'โรคหลอดเลือดสมอง' }
        ]
      },
      answerText: 'C',
      pointsEarned: 5,
      isGraded: true
    },
    {
      id: 4,
      question: {
        id: 4,
        questionText: 'ให้ยกตัวอย่างและอธิบายวิธีการให้คำปรึกษาผู้ป่วยเกี่ยวกับการใช้ยาอย่างถูกต้อง',
        questionType: 'FREE_TEXT',
        scoreWeight: 15
      },
      answerText: 'ตัวอย่างเช่น ยาลดความดัน ควรอธิบายให้ผู้ป่วยทราบว่าต้องรับประทานยาสม่ำเสมอทุกวันตามเวลาที่กำหนด ไม่ควรหยุดยาเองแม้อาการจะดีขึ้น และควรหลีกเลี่ยงอาหารเค็ม ออกกำลังกายสม่ำเสมอ และมาตรวจติดตามอาการตามนัด หากมีอาการข้างเคียงควรแจ้งเภสัชกรหรือแพทย์ทันที',
      isGraded: false
    }
  ]
};

// ==========================================
// Mock Service Functions
// ==========================================

/**
 * Mock: ดึงรายการข้อสอบที่รอตรวจ
 */
export async function getPendingAttempts(params?: {
  courseId?: number;
  examId?: number;
  page?: number;
  limit?: number;
}): Promise<PendingAttemptsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  
  return {
    attempts: MOCK_PENDING_ATTEMPTS,
    total: MOCK_PENDING_ATTEMPTS.length,
    page,
    totalPages: 1
  };
}

/**
 * Mock: ดึงรายละเอียดสำหรับตรวจข้อสอบ
 */
export async function getGradingDetail(attemptId: number): Promise<GradingDetail> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data (in real app, would fetch based on attemptId)
  return {
    ...MOCK_GRADING_DETAIL,
    attempt: {
      ...MOCK_GRADING_DETAIL.attempt,
      id: attemptId
    }
  };
}

/**
 * Mock: บันทึกการให้คะแนน
 */
export async function submitGrades(
  attemptId: number,
  data: GradeSubmission
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('📝 Mock: บันทึกการตรวจข้อสอบ');
  console.log('Attempt ID:', attemptId);
  console.log('Graded Answers:', data.gradedAnswers);
  
  // In real implementation, would call API
  // await apiClient.post(`/admin/exam-attempts/${attemptId}/grade`, data);
}

/**
 * Grading Service Object
 */
export const gradingService = {
  getPendingAttempts,
  getGradingDetail,
  submitGrades
};
