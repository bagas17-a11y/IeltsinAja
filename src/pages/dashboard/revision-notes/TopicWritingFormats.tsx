import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  ExaminerTip,
} from "./RevisionNoteContent";
import { writingFormatsMaterial } from "@/content/materials/writing/writing-formats";

export function TopicWritingFormats() {
  const { summary, keyPoints, examples, commonMistakes, practiceTips, ieltsTip } =
    writingFormatsMaterial;

  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="IELTS Writing Formats" />
      <DefinitionCard>
        <p className="mb-3">{summary}</p>
      </DefinitionCard>

      <SectionTitle number={2} title="Task 1 – Academic report" />
      <DefinitionCard>
        <p className="mb-3">
          You describe visual information (graph, chart, table, map, diagram).
        </p>
        <SubSectionTitle title="2.1 Structure" />
        <p className="mb-2">
          Short intro (paraphrase task + overview); 1–2 body paragraphs (logical grouping);
          no conclusion required but a one-line overview is essential.
        </p>
        <p className="text-sm text-slate-400">Aim 150+ words; spend about 20 minutes.</p>
      </DefinitionCard>

      <SectionTitle number={3} title="Task 2 – Academic essay" />
      <DefinitionCard>
        <p className="mb-3">
          You respond to a point of view, argument, or problem.
        </p>
        <SubSectionTitle title="3.1 Structure" />
        <p className="mb-2">
          Intro (background + thesis/position); 2–3 body paragraphs (topic sentence +
          support + example); conclusion (restate position + summary).
        </p>
        <p className="mb-2">
          Use formal tone; support ideas with reasons and examples; address all parts of
          the question.
        </p>
        <p className="text-sm text-slate-400">Aim 250+ words; spend about 40 minutes.</p>
      </DefinitionCard>

      <SectionTitle number={4} title="Key points" />
      <DefinitionCard>
        <KeyList items={keyPoints} />
      </DefinitionCard>

      <SectionTitle number={5} title="Examples" />
      <DefinitionCard>
        {examples.map((ex, i) => (
          <WorkedExample key={i}>
            <strong className="text-slate-200">{ex.label}:</strong> &quot;{ex.content}&quot;
          </WorkedExample>
        ))}
      </DefinitionCard>

      <SectionTitle number={6} title="Common mistakes to avoid" />
      <DefinitionCard>
        <KeyList items={commonMistakes} />
      </DefinitionCard>

      <SectionTitle number={7} title="Practice tips" />
      <DefinitionCard>
        <KeyList items={practiceTips} />
      </DefinitionCard>

      <ExaminerTip>{ieltsTip}</ExaminerTip>
    </div>
  );
}
