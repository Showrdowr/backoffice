import { apiClient } from "@/services/api/client";
import type {
  Exam,
  ExamQuestion,
  CreateExamInput,
  CreateExamQuestionInput,
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
      const response = await apiClient.get<any>(`/courses/${courseId}/exam`);
      const exam = response.data || null;
      return {
        exam,
        questionsCount: exam?.questions?.length || 0,
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
      const response = await apiClient.post<any>(`/courses/${data.courseId}/exam`, {
        title: data.title,
        description: data.description,
        passingScorePercent: data.passingScorePercent,
        timeLimitMinutes: data.timeLimitMinutes,
      });
      return response.data;
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
      const response = await apiClient.put<any>(`/exams/${id}`, data);
      return response.data;
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
      await apiClient.delete(`/exams/${id}`);
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
      const response = await apiClient.post<any>(`/exams/${data.examId}/questions`, {
        questionText: data.questionText,
        questionType: data.questionType,
        options: data.options,
        scoreWeight: data.scoreWeight,
        correctAnswer: data.correctAnswer,
      });
      return response.data;
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
      const response = await apiClient.put<any>(`/exam-questions/${id}`, data);
      return response.data;
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
      await apiClient.delete(`/exam-questions/${id}`);
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
        await apiClient.post(`/exams/${examId}/questions`, {
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          scoreWeight: question.scoreWeight,
          correctAnswer: question.correctAnswer,
        });
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
