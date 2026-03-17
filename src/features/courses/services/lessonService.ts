import { apiClient } from "@/services/api/client";
import type {
  Lesson,
  CreateLessonInput,
  VideoQuestion,
  CreateVideoQuestionInput,
} from "@/features/courses/types";

export interface LessonsData {
  lessons: Lesson[];
  totalVideoQuestions: number;
}

export const lessonService = {
  /**
   * Fetch lessons for a course
   */
  async getLessons(courseId: number): Promise<LessonsData> {
    try {
      const response = await apiClient.get<any[]>(`/courses/${courseId}/lessons`);
      const lessons = response.data || [];
      const totalVideoQuestions = lessons.reduce(
        (acc: number, l: any) => acc + (l.videoQuestions?.length || 0),
        0
      );
      return { lessons, totalVideoQuestions };
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      throw error;
    }
  },

  /**
   * Create a new lesson
   */
  async createLesson(data: CreateLessonInput): Promise<Lesson> {
    try {
      const response = await apiClient.post<any>(`/courses/${data.courseId}/lessons`, {
        title: data.title,
        videoId: data.videoId || null,
        sequenceOrder: data.sequenceOrder || 1,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create lesson:", error);
      throw error;
    }
  },

  /**
   * Update a lesson
   */
  async updateLesson(
    id: number,
    data: Partial<CreateLessonInput>
  ): Promise<Lesson> {
    try {
      const response = await apiClient.put<any>(`/lessons/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update lesson:", error);
      throw error;
    }
  },

  /**
   * Delete a lesson
   */
  async deleteLesson(id: number): Promise<void> {
    try {
      await apiClient.delete(`/lessons/${id}`);
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      throw error;
    }
  },

  /**
   * Add VideoQuestion to a lesson
   */
  async addVideoQuestion(
    data: CreateVideoQuestionInput
  ): Promise<VideoQuestion> {
    try {
      // TODO: Connect when video-questions backend API is ready
      console.log("Add video question:", data);
      return {
        id: Date.now(),
        lessonId: data.lessonId,
        questionText: data.questionText,
        displayAtSeconds: data.displayAtSeconds,
        questionType: data.questionType,
        options: data.options,
      };
    } catch (error) {
      console.error("Failed to add video question:", error);
      throw error;
    }
  },

  /**
   * Delete VideoQuestion
   */
  async deleteVideoQuestion(id: number): Promise<void> {
    try {
      // TODO: Connect when video-questions backend API is ready
      console.log("Delete video question:", id);
    } catch (error) {
      console.error("Failed to delete video question:", error);
      throw error;
    }
  },

  /**
   * Bulk add VideoQuestions to a lesson (for CSV import)
   */
  async bulkAddVideoQuestions(
    lessonId: number,
    questions: CreateVideoQuestionInput[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const result = { success: 0, failed: 0, errors: [] as string[] };

    for (const question of questions) {
      try {
        // TODO: Connect when video-questions backend API is ready
        console.log("Bulk add video question:", question);
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
