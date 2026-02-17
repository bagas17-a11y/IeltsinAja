/**
 * Human+AI IELTS Curriculum – all 4 modules.
 * Use this for the Human+AI Package: curriculum-led materials for
 * Listening, Reading, Writing, and Speaking.
 */

import type { Curriculum, CurriculumModule } from "./types";
import { listeningModule } from "./modules/listening";
import { readingModule } from "./modules/reading";
import { writingModule } from "./modules/writing";
import { speakingModule } from "./modules/speaking";

export type { Curriculum, CurriculumModule, CurriculumTopic, CurriculumItem, Level } from "./types";

/** All four modules in order: Listening, Reading, Writing, Speaking */
export const humanAiCurriculum: Curriculum = [
  listeningModule,
  readingModule,
  writingModule,
  speakingModule,
];

/** Get a single module by id */
export function getModule(id: CurriculumModule["id"]): CurriculumModule {
  const m = humanAiCurriculum.find((mod) => mod.id === id);
  if (!m) throw new Error(`Unknown curriculum module: ${id}`);
  return m;
}

export { listeningModule, readingModule, writingModule, speakingModule };
