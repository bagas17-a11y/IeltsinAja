/**
 * Human+AI Materials – detailed lesson content types.
 * Each material corresponds to a curriculum topic and provides
 * full explanatory content, examples, and practice guidance.
 */

import type { Level } from "../curriculum/types";

export interface MaterialExample {
  label?: string;
  content: string;
}

export interface LessonMaterial {
  /** Matches CurriculumTopic.id */
  topicId: string;
  /** Module id for filtering */
  moduleId: "listening" | "reading" | "writing" | "speaking";
  title: string;
  level?: Level;
  /** One or two sentences: what this lesson covers */
  summary: string;
  /** Main explanation (supports simple markdown: **bold**, lists) */
  body: string;
  /** Bullet points to remember */
  keyPoints: string[];
  examples?: MaterialExample[];
  commonMistakes?: string[];
  practiceTips?: string[];
  /** IELTS-specific tip for the exam */
  ieltsTip?: string;
}

export type MaterialsByModule = Record<string, LessonMaterial>;
