import { apiClient } from "@/services/api/client";
import type {
  Exam,
  ExamQuestion,
  CreateExamInput,
  CreateExamQuestionInput,
  QuestionType,
} from "@/features/courses/types";

export interface ExamData {
  exam: Exam | null;
  questionsCount: number;
}

export const examService = {
  /**
   * Fetch exam for a course (1 course = 1 exam)
   */
  async getExam(courseId: number): Promise<ExamData> {
    try {
      // In production: const response = await apiClient.get<ExamData>(`/courses/${courseId}/exam`);

      // Mock data
      return {
        exam: {
          id: 1,
          courseId,
          title: "แบบทดสอบหลังเรียน",
          description: "กรุณาทำแบบทดสอบเพื่อรับใบประกาศนียบัตร",
          passingScorePercent: 80,
          timeLimitMinutes: 30,
          questions: [
            {
              id: 1,
              examId: 1,
              questionText: "ข้อใดคือหลักการสำคัญที่สุดในการให้คำปรึกษา?",
              questionType: "MULTIPLE_CHOICE" as QuestionType,
              scoreWeight: 5,
            },
            {
              id: 2,
              examId: 1,
              questionText: "อธิบายขั้นตอนการดูแลผู้ป่วยโรคเรื้อรัง",
              questionType: "FREE_TEXT" as QuestionType,
              scoreWeight: 10,
            },
            {
              id: 3,
              examId: 1,
              questionText: "ข้อใดไม่ถูกต้องเกี่ยวกับกฎหมายเภสัชกรรม?",
              questionType: "MULTIPLE_CHOICE" as QuestionType,
              scoreWeight: 5,
            },
          ],
        },
        questionsCount: 3,
      };
    } catch (error) {
      console.error("Failed to fetch exam:", error);
      throw error;
    }
  },

  /**
   * Create or update exam for a course
   */
  async saveExam(data: CreateExamInput): Promise<Exam> {
    try {
      // In production: const response = await apiClient.post<Exam>(`/courses/${data.courseId}/exam`, data);
      console.log("Save exam:", data);
      return {
        id: Date.now(),
        courseId: data.courseId,
        title: data.title,
        description: data.description,
        passingScorePercent: data.passingScorePercent,
        timeLimitMinutes: data.timeLimitMinutes,
        questions: [],
      };
    } catch (error) {
      console.error("Failed to save exam:", error);
      throw error;
    }
  },

  /**
   * Update exam settings
   */
  async updateExam(id: number, data: Partial<CreateExamInput>): Promise<Exam> {
    try {
      // In production: const response = await apiClient.put<Exam>(`/exams/${id}`, data);
      console.log("Update exam:", id, data);
      return {
        id,
        courseId: data.courseId || 0,
        title: data.title || "",
        description: data.description,
        passingScorePercent: data.passingScorePercent,
        timeLimitMinutes: data.timeLimitMinutes,
      };
    } catch (error) {
      console.error("Failed to update exam:", error);
      throw error;
    }
  },

  /**
   * Delete exam
   */
  async deleteExam(id: number): Promise<void> {
    try {
      // In production: await apiClient.delete(`/exams/${id}`);
      console.log("Delete exam:", id);
    } catch (error) {
      console.error("Failed to delete exam:", error);
      throw error;
    }
  },

  /**
   * Add ExamQuestion
   */
  async addExamQuestion(data: CreateExamQuestionInput): Promise<ExamQuestion> {
    try {
      // In production: const response = await apiClient.post<ExamQuestion>(`/exams/${data.examId}/questions`, data);
      console.log("Add exam question:", data);
      return {
        id: Date.now(),
        examId: data.examId,
        questionText: data.questionText,
        questionType: data.questionType,
        options: data.options,
        scoreWeight: data.scoreWeight,
        correctAnswer: data.correctAnswer,
      };
    } catch (error) {
      console.error("Failed to add exam question:", error);
      throw error;
    }
  },

  /**
   * Update ExamQuestion
   */
  async updateExamQuestion(
    id: number,
    data: Partial<CreateExamQuestionInput>
  ): Promise<ExamQuestion> {
    try {
      // In production: const response = await apiClient.put<ExamQuestion>(`/exam-questions/${id}`, data);
      console.log("Update exam question:", id, data);
      return {
        id,
        examId: 0,
        questionText: data.questionText,
        questionType: data.questionType || "MULTIPLE_CHOICE",
        options: data.options,
        scoreWeight: data.scoreWeight,
      };
    } catch (error) {
      console.error("Failed to update exam question:", error);
      throw error;
    }
  },

  /**
   * Delete ExamQuestion
   */
  async deleteExamQuestion(id: number): Promise<void> {
    try {
      // In production: await apiClient.delete(`/exam-questions/${id}`);
      console.log("Delete exam question:", id);
    } catch (error) {
      console.error("Failed to delete exam question:", error);
      throw error;
    }
  },

  /**
   * Bulk add ExamQuestions to an exam (for CSV import)
   */
  async bulkAddExamQuestions(
    examId: number,
    questions: CreateExamQuestionInput[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const result = { success: 0, failed: 0, errors: [] as string[] };

    for (const question of questions) {
      try {
        // In production: await apiClient.post(`/exams/${examId}/questions`, question);
        console.log("Bulk add exam question:", question);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(
          `Failed to add question "${question.questionText?.substring(
            0,
            30
          )}...": ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return result;
  },
};
