/**
 * Human+AI Package – curriculum and materials.
 * Single entry point for curriculum structure and detailed lesson content.
 */

export {
  humanAiCurriculum,
  getModule,
  listeningModule,
  readingModule,
  writingModule,
  speakingModule,
} from "./curriculum";
export type { Curriculum, CurriculumModule, CurriculumTopic, CurriculumItem, Level } from "./curriculum";

export {
  getMaterial,
  getMaterialsByModule,
  getAllMaterials,
  writingMaterials,
  listeningMaterials,
  readingMaterials,
  speakingMaterials,
} from "./materials";
export type { LessonMaterial, MaterialExample, MaterialsByModule } from "./materials";
