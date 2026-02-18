import { DefinitionCard, ExaminerTip, WorkedExample } from "./RevisionNoteContent";

export function TopicPartsOfSpeech() {
  return (
    <div className="space-y-6">
      <DefinitionCard title="Definition">
        Words categorized by function. Crucial for &quot;Grammatical Range&quot;
        (25% of your Writing score).
      </DefinitionCard>

      <DefinitionCard title="Subjects & Verbs">
        <WorkedExample>
          &quot;The government <strong>(S)</strong> enacted <strong>(V)</strong> laws.&quot;
        </WorkedExample>
        <p className="mt-2 text-slate-300">
          Tip: Vary subjects to avoid repetition (e.g. it, this, these).
        </p>
      </DefinitionCard>

      <DefinitionCard title="Adjectives & Adverbs">
        Use <strong>&quot;significant&quot;</strong> or{" "}
        <strong>&quot;dramatically&quot;</strong> to boost Writing Task 1
        scores.
      </DefinitionCard>

      <ExaminerTip>
        Mixing noun phrases and modifiers is the key to moving from Band 6 to
        7+.
      </ExaminerTip>
    </div>
  );
}
