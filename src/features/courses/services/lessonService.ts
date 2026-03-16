import { apiClient } from "@/services/api/client";
import type {
  Lesson,
  CreateLessonInput,
  VideoQuestion,
  CreateVideoQuestionInput,
  QuestionType,
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
      // In production: const response = await apiClient.get<LessonsData>(`/courses/${courseId}/lessons`);

      // Mock data
      return {
        lessons: [
          {
            id: 1,
            courseId,
            title: "บทที่ 1: บทนำและแนวคิดพื้นฐาน",
            sequenceOrder: 1,
            duration: "30:00",
            videoId: 1,
            videoQuestions: [
              {
                id: 1,
                lessonId: 1,
                questionText:
                  "จากที่กล่าวมา เภสัชกรควรให้ความสำคัญกับอะไรมากที่สุด?",
                displayAtSeconds: 900,
                questionType: "MULTIPLE_CHOICE" as QuestionType,
              },
              {
                id: 2,
                lessonId: 1,
                questionText: "ข้อใดไม่ใช่หลักการพื้นฐาน?",
                displayAtSeconds: 1500,
                questionType: "MULTIPLE_CHOICE" as QuestionType,
              },
            ],
          },
          {
            id: 2,
            courseId,
            title: "บทที่ 2: เนื้อหาหลัก",
            sequenceOrder: 2,
            duration: "45:00",
            videoId: 2,
            videoQuestions: [
              {
                id: 3,
                lessonId: 2,
                questionText: "อธิบายขั้นตอนการให้คำปรึกษา",
                displayAtSeconds: 1200,
                questionType: "FREE_TEXT" as QuestionType,
              },
            ],
          },
          {
            id: 3,
            courseId,
            title: "บทที่ 3: Case Study",
            sequenceOrder: 3,
            duration: "25:00",
            videoId: 3,
            videoQuestions: [],
          },
        ],
        totalVideoQuestions: 3,
      };
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
      // In production: const response = await apiClient.post<Lesson>(`/courses/${data.courseId}/lessons`, data);
      console.log("Create lesson:", data);
      return {
        id: Date.now(),
        courseId: data.courseId,
        title: data.title,
        sequenceOrder: data.sequenceOrder,
        videoId: data.videoId,
        videoQuestions: [],
      };
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
      // In production: const response = await apiClient.put<Lesson>(`/lessons/${id}`, data);
      console.log("Update lesson:", id, data);
      return {
        id,
        title: data.title || "",
        sequenceOrder: data.sequenceOrder,
        videoId: data.videoId,
      };
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
      // In production: await apiClient.delete(`/lessons/${id}`);
      console.log("Delete lesson:", id);
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
      // In production: const response = await apiClient.post<VideoQuestion>(`/lessons/${data.lessonId}/questions`, data);
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
      // In production: await apiClient.delete(`/video-questions/${id}`);
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
        // In production: await apiClient.post(`/lessons/${lessonId}/questions`, question);
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
