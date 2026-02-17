/**
 * Human+AI IELTS Curriculum – shared types.
 * Used to structure materials for Listening, Reading, Writing, and Speaking.
 */

export type Level = "basic" | "intermediate" | "advance";

export interface CurriculumItem {
  id: string;
  title: string;
  /** Optional level for progression (basic → intermediate → advance) */
  level?: Level;
  /** Sub-topics or bullet points */
  items?: string[];
  /** Nested sub-items (e.g. conditionals: zero, first, second, third, mixed) */
  subItems?: { title: string; items: string[] }[];
  /** Instructor note or practice hint */
  notes?: string;
}

export interface CurriculumTopic {
  id: string;
  order: number;
  title: string;
  level?: Level;
  items: CurriculumItem[];
  notes?: string;
}

export interface CurriculumModule {
  id: "listening" | "reading" | "writing" | "speaking";
  title: string;
  description: string;
  topics: CurriculumTopic[];
}

export type Curriculum = CurriculumModule[];
