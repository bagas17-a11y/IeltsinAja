# Human+AI IELTS Curriculum

This folder contains the **curriculum and materials** for the **Human+AI Package**. The curriculum defines what students learn across the four IELTS modules.

## Structure

- **`types.ts`** – Shared types: `CurriculumModule`, `CurriculumTopic`, `CurriculumItem`, `Level`.
- **`modules/`** – One file per module:
  - **`listening.ts`** – Listening test format, question types, skills, vocabulary/grammar for listening.
  - **`reading.ts`** – Reading test format, question types, skills, text types and vocabulary.
  - **`writing.ts`** – Sourced from the IELTS Curriculum PDF: grammar (parts of speech, tenses, agreement, punctuation, sentence structure), IELTS wordlist, transition words, countable/uncountable nouns, clauses, synonyms & paraphrasing, writing formats (Task 1 report, Task 2 essay), text types.
  - **`speaking.ts`** – Speaking Parts 1–3, topic areas, structure, assessment criteria.
- **`index.ts`** – Exports `humanAiCurriculum` (all 4 modules) and `getModule(id)`.

## Usage

```ts
import { humanAiCurriculum, getModule } from "@/content/curriculum";

// All modules
const all = humanAiCurriculum;

// One module
const writing = getModule("writing");
```

## Curriculum note (from PDF)

- **Find practice questions for each part of the syllabus** – Each topic is intended to be supported by practice tasks; those can be stored in the app or in the IELTS library and linked by topic/module.

## Four modules

| Module    | Focus |
|----------|--------|
| Listening | Sections 1–4, question types, strategies, spelling/accents |
| Reading   | Three passages, question types, skimming/scanning, paraphrase, inference |
| Writing   | Grammar, vocabulary, Task 1 (report), Task 2 (essay), text types |
| Speaking  | Part 1–3 format, familiar & abstract topics, fluency, vocabulary, criteria |
