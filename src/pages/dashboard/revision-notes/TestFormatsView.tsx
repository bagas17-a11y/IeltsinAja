/**
 * Test Format explanations – Writing, Listening, Reading, Speaking.
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
} from "./RevisionNoteContent";
import type { RevisionNoteFormatId } from "@/content/revisionNotes";

interface TestFormatsViewProps {
  activeFormat?: RevisionNoteFormatId;
}

export function TestFormatsView({ activeFormat = "writing" }: TestFormatsViewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        IELTS Test Formats
      </h1>
      <p className="text-slate-300 mb-6">
        Understand the structure, timing, and task types for each section of the IELTS test.
      </p>

      <Tabs defaultValue={activeFormat} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="listening">Listening</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="speaking">Speaking</TabsTrigger>
        </TabsList>

        <TabsContent value="writing">
          <WritingFormat />
        </TabsContent>
        <TabsContent value="listening">
          <ListeningFormat />
        </TabsContent>
        <TabsContent value="reading">
          <ReadingFormat />
        </TabsContent>
        <TabsContent value="speaking">
          <SpeakingFormat />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WritingFormat() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p>IELTS Academic Writing: Task 1 (visual report, 150+ words, ~20 mins) and Task 2 (essay, 250+ words, ~40 mins). Task 2 carries more marks.</p>
      </DefinitionCard>
      <SectionTitle number={2} title="Format" />
      <DefinitionCard>
        <SubSectionTitle title="Task 1 – Academic report" />
        <KeyList items={["Describe visual information: graph, chart, table, map, diagram", "Structure: intro (paraphrase + overview) + 1–2 body paragraphs", "Overview is required; state main trend or comparison"]} />
        <SubSectionTitle title="Task 2 – Academic essay" />
        <KeyList items={["Respond to a point of view, argument, or problem", "Structure: intro (thesis) + 2–3 body paragraphs + conclusion", "Formal tone; support with reasons and examples"]} />
      </DefinitionCard>
    </div>
  );
}

function ListeningFormat() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p>Four sections; 40 questions; ~30 minutes listening + 10 minutes transfer. Sections increase in difficulty.</p>
      </DefinitionCard>
      <SectionTitle number={2} title="Format" />
      <DefinitionCard>
        <KeyList items={["Section 1: Everyday conversation (e.g. accommodation, booking)", "Section 2: Monologue in everyday context (e.g. tour, talk)", "Section 3: Conversation in educational context (e.g. project, assignment)", "Section 4: Academic monologue (lecture or talk)"]} />
      </DefinitionCard>
      <SectionTitle number={3} title="Strategies" />
      <DefinitionCard>
        <KeyList items={["Use the example and read questions before listening", "Predict answers and key words", "Follow instructions (word limit, e.g. NO MORE THAN TWO WORDS)"]} />
      </DefinitionCard>
    </div>
  );
}

function ReadingFormat() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p>Three passages; 40 questions; 60 minutes. Texts from books, journals, magazines, newspapers (academic style).</p>
      </DefinitionCard>
      <SectionTitle number={2} title="Format" />
      <DefinitionCard>
        <KeyList items={["Three passages; increasing difficulty", "Topics: general interest, academic", "Question types: T/F/NG, matching, multiple choice, completion, short-answer"]} />
      </DefinitionCard>
      <SectionTitle number={3} title="Strategies" />
      <DefinitionCard>
        <KeyList items={["Skimming for main idea and structure", "Scanning for specific information and key words", "Manage time (~20 minutes per passage)"]} />
      </DefinitionCard>
    </div>
  );
}

function SpeakingFormat() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p>Three parts; 11–14 minutes total. Face-to-face with examiner.</p>
      </DefinitionCard>
      <SectionTitle number={2} title="Format" />
      <DefinitionCard>
        <KeyList items={["Part 1: Introduction and familiar topics (4–5 minutes)", "Part 2: Long turn – 1–2 minutes on a cue card (1 min preparation)", "Part 3: Two-way discussion on broader themes (4–5 minutes)"]} />
      </DefinitionCard>
      <SectionTitle number={3} title="Strategies" />
      <DefinitionCard>
        <KeyList items={["Answer directly, then extend with reason or example", "Use preparation time in Part 2 (notes, structure)", "Link ideas and manage hesitation naturally"]} />
      </DefinitionCard>
    </div>
  );
}
