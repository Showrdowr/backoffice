import { apiClient } from "@/services/api/client";
import type {
  Lesson,
  CreateLessonInput,
  VideoQuestion,
  CreateVideoQuestionInput,
  UpdateVideoQuestionInput,
  LessonDocument,
  CreateLessonDocumentInput,
  LessonQuiz,
  CreateLessonQuizInput,
  CreateLessonQuizQuestionInput,
  LessonQuizQuestion,
} from "@/features/courses/types";

export interface LessonsData {
  lessons: Lesson[];
  totalVideoQuestions: number;
}

export const lessonService = {
  async getLessons(courseId: number): Promise<LessonsData> {
    try {
      const response = await apiClient.get<Lesson[]>(`/courses/${courseId}/lessons`);
      const lessons = Array.isArray(response.data) ? response.data : [];
      const totalVideoQuestions = lessons.reduce(
        (acc: number, lesson: Lesson) => acc + (lesson.videoQuestions?.length || 0),
        0
      );
      return { lessons, totalVideoQuestions };
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      throw error;
    }
  },

  async createLesson(data: CreateLessonInput): Promise<Lesson> {
    try {
      const response = await apiClient.post<Lesson>(`/courses/${data.courseId}/lessons`, {
        title: data.title,
        videoId: data.videoId,
        sequenceOrder: data.sequenceOrder || 1,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create lesson:", error);
      throw error;
    }
  },

  async updateLesson(
    id: number,
    data: Partial<CreateLessonInput>
  ): Promise<Lesson> {
    try {
      const response = await apiClient.put<Lesson>(`/lessons/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update lesson:", error);
      throw error;
    }
  },

  async deleteLesson(id: number): Promise<void> {
    try {
      await apiClient.delete(`/lessons/${id}`);
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      throw error;
    }
  },

  async addLessonDocument(data: CreateLessonDocumentInput): Promise<LessonDocument> {
    try {
      const response = await apiClient.post<LessonDocument>(`/lessons/${data.lessonId}/documents`, {
        fileName: data.fileName,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        fileUrl: data.fileUrl,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add lesson document:", error);
      throw error;
    }
  },

  async getLessonDocument(id: number): Promise<LessonDocument> {
    try {
      const response = await apiClient.get<LessonDocument>(`/lesson-documents/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch lesson document:", error);
      throw error;
    }
  },

  async deleteLessonDocument(id: number): Promise<void> {
    try {
      await apiClient.delete(`/lesson-documents/${id}`);
    } catch (error) {
      console.error("Failed to delete lesson document:", error);
      throw error;
    }
  },

  async addVideoQuestion(
    data: CreateVideoQuestionInput
  ): Promise<VideoQuestion> {
    try {
      const response = await apiClient.post<VideoQuestion>(`/lessons/${data.lessonId}/video-questions`, {
        questionText: data.questionText,
        displayAtSeconds: data.displayAtSeconds,
        sortOrder: data.sortOrder,
        questionType: data.questionType,
        options: data.options,
        correctAnswer: data.correctAnswer,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add video question:", error);
      throw error;
    }
  },

  async deleteVideoQuestion(id: number): Promise<void> {
    try {
      await apiClient.delete(`/video-questions/${id}`);
    } catch (error) {
      console.error("Failed to delete video question:", error);
      throw error;
    }
  },

  async updateVideoQuestion(
    id: number,
    data: Partial<UpdateVideoQuestionInput>
  ): Promise<VideoQuestion> {
    try {
      const response = await apiClient.put<VideoQuestion>(`/video-questions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update video question:", error);
      throw error;
    }
  },

  async refreshLesson(courseId: number, lessonId: number): Promise<Lesson | null> {
    const data = await this.getLessons(courseId);
    return data.lessons.find((lesson) => Number(lesson.id) === lessonId) || null;
  },

  async bulkAddVideoQuestions(
    lessonId: number,
    questions: CreateVideoQuestionInput[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const response = await apiClient.post<VideoQuestion[]>(`/lessons/${lessonId}/video-questions/bulk`, {
        questions: questions.map((question) => ({
          questionText: question.questionText,
          displayAtSeconds: question.displayAtSeconds,
          sortOrder: question.sortOrder,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
        })),
      });

      return {
        success: Array.isArray(response.data) ? response.data.length : questions.length,
        failed: 0,
        errors: [],
      };
    } catch (error) {
      console.error("Failed to bulk add video questions:", error);
      throw error;
    }
  },

  async getLessonQuiz(lessonId: number): Promise<LessonQuiz | null> {
    try {
      const response = await apiClient.get<LessonQuiz | null>(`/lessons/${lessonId}/quiz`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch lesson quiz:", error);
      throw error;
    }
  },

  async saveLessonQuiz(data: CreateLessonQuizInput): Promise<LessonQuiz | null> {
    try {
      const response = await apiClient.put<LessonQuiz | null>(`/lessons/${data.lessonId}/quiz`, {
        passingScorePercent: data.passingScorePercent,
        maxAttempts: data.maxAttempts,
        questions: data.questions,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to save lesson quiz:", error);
      throw error;
    }
  },

  async addLessonQuizQuestion(quizId: number, data: CreateLessonQuizQuestionInput): Promise<LessonQuizQuestion> {
    try {
      const response = await apiClient.post<LessonQuizQuestion>(`/lesson-quizzes/${quizId}/questions`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to add lesson quiz question:", error);
      throw error;
    }
  },

  async updateLessonQuizQuestion(questionId: number, data: Partial<CreateLessonQuizQuestionInput>): Promise<LessonQuizQuestion> {
    try {
      const response = await apiClient.put<LessonQuizQuestion>(`/lesson-quiz-questions/${questionId}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update lesson quiz question:", error);
      throw error;
    }
  },

  async deleteLessonQuizQuestion(questionId: number): Promise<void> {
    try {
      await apiClient.delete(`/lesson-quiz-questions/${questionId}`);
    } catch (error) {
      console.error("Failed to delete lesson quiz question:", error);
      throw error;
    }
  },
};
