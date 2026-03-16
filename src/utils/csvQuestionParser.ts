import Papa from "papaparse";
import type {
  CreateVideoQuestionInput,
  CreateExamQuestionInput,
  QuestionOption,
  QuestionType,
} from "@/features/courses/types";

// ==========================================
// Types
// ==========================================

export interface VideoQuestionCSVRow {
  questionText: string;
  questionType: string;
  displayAtSeconds: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer?: string;
}

export interface ExamQuestionCSVRow {
  questionText: string;
  questionType: string;
  scoreWeight?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer?: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ParseResult<T> {
  success: boolean;
  data: T[];
  errors: ValidationError[];
  totalRows: number;
  validRows: number;
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Convert option columns to QuestionOption array
 */
function convertOptionsToJSON(
  option1?: string,
  option2?: string,
  option3?: string,
  option4?: string
): QuestionOption[] {
  const options: QuestionOption[] = [];
  const optionTexts = [option1, option2, option3, option4];
  const optionIds = ["A", "B", "C", "D"];

  optionTexts.forEach((text, index) => {
    if (text && text.trim()) {
      options.push({
        id: optionIds[index],
        text: text.trim(),
        isCorrect: false,
      });
    }
  });

  return options;
}

/**
 * Map correct answer letter (A, B, C, D) to option text
 * and mark the correct option
 */
function mapCorrectAnswer(
  letter: string | undefined,
  options: QuestionOption[]
): { options: QuestionOption[]; correctAnswer: string | undefined } {
  if (!letter || !letter.trim()) {
    return { options, correctAnswer: undefined };
  }

  const normalizedLetter = letter.trim().toUpperCase();
  const updatedOptions = options.map((opt) => ({
    ...opt,
    isCorrect: opt.id === normalizedLetter,
  }));

  const correctOption = updatedOptions.find((opt) => opt.isCorrect);
  return {
    options: updatedOptions,
    correctAnswer: correctOption?.text,
  };
}

/**
 * Normalize question type to schema enum value
 */
function normalizeQuestionType(type: string): QuestionType {
  const normalized = type.trim().toUpperCase();
  if (normalized === "MULTIPLE_CHOICE" || normalized === "MULTIPLE-CHOICE") {
    return "MULTIPLE_CHOICE";
  }
  if (
    normalized === "FREE_TEXT" ||
    normalized === "FREE-TEXT" ||
    normalized === "TEXT"
  ) {
    return "FREE_TEXT";
  }
  return "MULTIPLE_CHOICE"; // default
}

// ==========================================
// Validation Functions
// ==========================================

function validateVideoQuestionRow(
  row: VideoQuestionCSVRow,
  rowIndex: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required: questionText
  if (!row.questionText || !row.questionText.trim()) {
    errors.push({
      row: rowIndex,
      field: "questionText",
      message: "กรุณาระบุข้อความคำถาม",
    });
  }

  // Required: questionType
  if (!row.questionType || !row.questionType.trim()) {
    errors.push({
      row: rowIndex,
      field: "questionType",
      message: "กรุณาระบุประเภทคำถาม (MULTIPLE_CHOICE หรือ FREE_TEXT)",
    });
  } else {
    const type = row.questionType.trim().toUpperCase();
    if (
      ![
        "MULTIPLE_CHOICE",
        "MULTIPLE-CHOICE",
        "FREE_TEXT",
        "FREE-TEXT",
        "TEXT",
      ].includes(type)
    ) {
      errors.push({
        row: rowIndex,
        field: "questionType",
        message: "ประเภทคำถามไม่ถูกต้อง (ใช้ MULTIPLE_CHOICE หรือ FREE_TEXT)",
      });
    }
  }

  // Required: displayAtSeconds
  if (!row.displayAtSeconds) {
    errors.push({
      row: rowIndex,
      field: "displayAtSeconds",
      message: "กรุณาระบุเวลาที่จะแสดงคำถาม (วินาที)",
    });
  } else {
    const seconds = parseInt(row.displayAtSeconds, 10);
    if (isNaN(seconds) || seconds < 0) {
      errors.push({
        row: rowIndex,
        field: "displayAtSeconds",
        message: "เวลาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0",
      });
    }
  }

  // For MULTIPLE_CHOICE, at least 2 options required
  const type = normalizeQuestionType(row.questionType || "");
  if (type === "MULTIPLE_CHOICE") {
    const optionCount = [
      row.option1,
      row.option2,
      row.option3,
      row.option4,
    ].filter((opt) => opt && opt.trim()).length;
    if (optionCount < 2) {
      errors.push({
        row: rowIndex,
        field: "options",
        message: "คำถามแบบ Multiple Choice ต้องมีอย่างน้อย 2 ตัวเลือก",
      });
    }
  }

  return errors;
}

function validateExamQuestionRow(
  row: ExamQuestionCSVRow,
  rowIndex: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required: questionText
  if (!row.questionText || !row.questionText.trim()) {
    errors.push({
      row: rowIndex,
      field: "questionText",
      message: "กรุณาระบุข้อความคำถาม",
    });
  }

  // Required: questionType
  if (!row.questionType || !row.questionType.trim()) {
    errors.push({
      row: rowIndex,
      field: "questionType",
      message: "กรุณาระบุประเภทคำถาม (MULTIPLE_CHOICE หรือ FREE_TEXT)",
    });
  } else {
    const type = row.questionType.trim().toUpperCase();
    if (
      ![
        "MULTIPLE_CHOICE",
        "MULTIPLE-CHOICE",
        "FREE_TEXT",
        "FREE-TEXT",
        "TEXT",
      ].includes(type)
    ) {
      errors.push({
        row: rowIndex,
        field: "questionType",
        message: "ประเภทคำถามไม่ถูกต้อง (ใช้ MULTIPLE_CHOICE หรือ FREE_TEXT)",
      });
    }
  }

  // scoreWeight must be positive number if provided
  if (row.scoreWeight) {
    const score = parseInt(row.scoreWeight, 10);
    if (isNaN(score) || score < 1) {
      errors.push({
        row: rowIndex,
        field: "scoreWeight",
        message: "คะแนนต้องเป็นตัวเลขที่มากกว่า 0",
      });
    }
  }

  // For MULTIPLE_CHOICE, at least 2 options required
  const type = normalizeQuestionType(row.questionType || "");
  if (type === "MULTIPLE_CHOICE") {
    const optionCount = [
      row.option1,
      row.option2,
      row.option3,
      row.option4,
    ].filter((opt) => opt && opt.trim()).length;
    if (optionCount < 2) {
      errors.push({
        row: rowIndex,
        field: "options",
        message: "คำถามแบบ Multiple Choice ต้องมีอย่างน้อย 2 ตัวเลือก",
      });
    }
  }

  return errors;
}

// ==========================================
// Parse Functions
// ==========================================

/**
 * Parse CSV file for VideoQuestion
 */
export function parseVideoQuestionCSV(
  file: File,
  lessonId: number
): Promise<ParseResult<CreateVideoQuestionInput>> {
  return new Promise((resolve) => {
    Papa.parse<VideoQuestionCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const allErrors: ValidationError[] = [];
        const validData: CreateVideoQuestionInput[] = [];

        results.data.forEach((row, index) => {
          const rowIndex = index + 2; // +2 because: +1 for 0-index, +1 for header row
          const errors = validateVideoQuestionRow(row, rowIndex);

          if (errors.length > 0) {
            allErrors.push(...errors);
          } else {
            const questionType = normalizeQuestionType(row.questionType);
            const options = convertOptionsToJSON(
              row.option1,
              row.option2,
              row.option3,
              row.option4
            );
            const { options: updatedOptions, correctAnswer } = mapCorrectAnswer(
              row.correctAnswer,
              options
            );

            validData.push({
              lessonId,
              questionText: row.questionText.trim(),
              displayAtSeconds: parseInt(row.displayAtSeconds, 10),
              questionType,
              options:
                questionType === "MULTIPLE_CHOICE" ? updatedOptions : undefined,
              correctAnswer,
            });
          }
        });

        resolve({
          success: allErrors.length === 0,
          data: validData,
          errors: allErrors,
          totalRows: results.data.length,
          validRows: validData.length,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [
            {
              row: 0,
              field: "file",
              message: `ไม่สามารถอ่านไฟล์ได้: ${error.message}`,
            },
          ],
          totalRows: 0,
          validRows: 0,
        });
      },
    });
  });
}

/**
 * Parse CSV file for ExamQuestion
 */
export function parseExamQuestionCSV(
  file: File,
  examId: number
): Promise<ParseResult<CreateExamQuestionInput>> {
  return new Promise((resolve) => {
    Papa.parse<ExamQuestionCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const allErrors: ValidationError[] = [];
        const validData: CreateExamQuestionInput[] = [];

        results.data.forEach((row, index) => {
          const rowIndex = index + 2;
          const errors = validateExamQuestionRow(row, rowIndex);

          if (errors.length > 0) {
            allErrors.push(...errors);
          } else {
            const questionType = normalizeQuestionType(row.questionType);
            const options = convertOptionsToJSON(
              row.option1,
              row.option2,
              row.option3,
              row.option4
            );
            const { options: updatedOptions, correctAnswer } = mapCorrectAnswer(
              row.correctAnswer,
              options
            );

            validData.push({
              examId,
              questionText: row.questionText.trim(),
              questionType,
              options:
                questionType === "MULTIPLE_CHOICE" ? updatedOptions : undefined,
              scoreWeight: row.scoreWeight ? parseInt(row.scoreWeight, 10) : 1,
              correctAnswer,
            });
          }
        });

        resolve({
          success: allErrors.length === 0,
          data: validData,
          errors: allErrors,
          totalRows: results.data.length,
          validRows: validData.length,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [
            {
              row: 0,
              field: "file",
              message: `ไม่สามารถอ่านไฟล์ได้: ${error.message}`,
            },
          ],
          totalRows: 0,
          validRows: 0,
        });
      },
    });
  });
}

// ==========================================
// Template Generation
// ==========================================

export const VIDEO_QUESTION_CSV_TEMPLATE = `questionText,questionType,displayAtSeconds,option1,option2,option3,option4,correctAnswer
"ตัวอย่างคำถาม 1 - Multiple Choice",MULTIPLE_CHOICE,300,"ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D",A
"ตัวอย่างคำถาม 2 - Free Text",FREE_TEXT,600,,,,,`;

export const EXAM_QUESTION_CSV_TEMPLATE = `questionText,questionType,scoreWeight,option1,option2,option3,option4,correctAnswer
"ตัวอย่างคำถาม 1 - Multiple Choice",MULTIPLE_CHOICE,5,"ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D",A
"ตัวอย่างคำถาม 2 - Free Text",FREE_TEXT,10,,,,,`;

/**
 * Download CSV template
 */
export function downloadCSVTemplate(
  type: "video" | "exam",
  filename?: string
): void {
  const template =
    type === "video" ? VIDEO_QUESTION_CSV_TEMPLATE : EXAM_QUESTION_CSV_TEMPLATE;

  const defaultFilename =
    type === "video"
      ? "video_questions_template.csv"
      : "exam_questions_template.csv";

  const blob = new Blob(["\ufeff" + template], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
