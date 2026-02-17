# Human+AI Materials – Detailed Lesson Content

This folder contains **full lesson content** for every curriculum topic. Each lesson includes:

- **summary** – Short description of the lesson
- **body** – Main explanation (supports simple markdown)
- **keyPoints** – Bullet points to remember
- **examples** – Labeled examples
- **commonMistakes** – What to avoid
- **practiceTips** – How to practise
- **ieltsTip** – Exam-specific advice

## Structure

- **types.ts** – `LessonMaterial` and related types
- **writing/** – 13 lessons matching the PDF curriculum (parts of speech → text types)
- **listening/** – 4 lessons (format, question types, skills, vocabulary/grammar)
- **reading/** – 4 lessons (format, question types, skills, text types/vocabulary)
- **speaking/** – 5 lessons (format, Part 1, Part 2, Part 3, criteria)
- **index.ts** – Exports `getMaterial(moduleId, topicId)`, `getMaterialsByModule(moduleId)`, `getAllMaterials()`

## Usage

```ts
import { getMaterial, getMaterialsByModule } from "@/content";

const writingLesson = getMaterial("writing", "verb-tenses");
const allWriting = getMaterialsByModule("writing");
```

Each lesson’s `topicId` matches the curriculum topic `id`, so you can link from the curriculum table of contents to the full material.
