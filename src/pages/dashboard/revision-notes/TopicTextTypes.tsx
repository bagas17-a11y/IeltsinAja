import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  ExaminerTip,
} from "./RevisionNoteContent";
import { textTypesMaterial } from "@/content/materials/writing/text-types";

export function TopicTextTypes() {
  const { summary, keyPoints, examples, commonMistakes, practiceTips, ieltsTip } =
    textTypesMaterial;

  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Text types for IELTS" />
      <DefinitionCard>
        <p>{summary}</p>
      </DefinitionCard>

      <SectionTitle number={2} title="Books and journals" />
      <DefinitionCard>
        <p className="mb-2">
          Books and journals use formal language, citations, and sustained argument.
          Academic journals publish research: abstract, introduction, method, results,
          discussion, references.
        </p>
        <p className="text-sm text-slate-400">
          IELTS Reading passages often come from or resemble journal articles; your
          Writing should be formal and evidence-based.
        </p>
      </DefinitionCard>

      <SectionTitle number={3} title="Articles and newspapers" />
      <DefinitionCard>
        <p className="mb-2">
          Magazine or online articles can be informative, opinion-based, or explanatory.
          Newspaper pieces (news reports, editorials, features) vary in formality.
        </p>
        <p className="text-sm text-slate-400">
          In IELTS Writing, aim for a formal article/essay style rather than casual or
          tabloid tone.
        </p>
      </DefinitionCard>

      <SectionTitle number={4} title="Key points" />
      <DefinitionCard>
        <KeyList items={keyPoints} />
      </DefinitionCard>

      <SectionTitle number={5} title="Examples of formal style" />
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
