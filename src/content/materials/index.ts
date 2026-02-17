/**
 * Human+AI Materials – all detailed lesson content.
 * Use with the curriculum for the Human+AI package.
 */

import type { LessonMaterial, MaterialsByModule } from "./types";
import writingMaterials from "./writing";
import listeningMaterials from "./listening";
import readingMaterials from "./reading";
import speakingMaterials from "./speaking";

export type { LessonMaterial, MaterialExample, MaterialsByModule } from "./types";

const allMaterials: LessonMaterial[] = [
  ...writingMaterials,
  ...listeningMaterials,
  ...readingMaterials,
  ...speakingMaterials,
];

/** Get one lesson by module and topic id */
export function getMaterial(
  moduleId: LessonMaterial["moduleId"],
  topicId: string
): LessonMaterial | undefined {
  return allMaterials.find((m) => m.moduleId === moduleId && m.topicId === topicId);
}

/** Get all materials for a module */
export function getMaterialsByModule(moduleId: LessonMaterial["moduleId"]): LessonMaterial[] {
  return allMaterials.filter((m) => m.moduleId === moduleId);
}

/** All materials as a flat array */
export function getAllMaterials(): LessonMaterial[] {
  return allMaterials;
}

export {
  writingMaterials,
  listeningMaterials,
  readingMaterials,
  speakingMaterials,
};
export default allMaterials;
