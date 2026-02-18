import { DefinitionCard, ExaminerTip, RevisionTable } from "./RevisionNoteContent";

export function TopicVerbTenses() {
  return (
    <div className="space-y-6">
      <DefinitionCard title="Tense grid">
        <RevisionTable
          headers={["Tense", "Use", "Example"]}
          rows={[
            ["Present Simple", "Facts, general truth", "The chart shows..."],
            ["Past Simple", "Finished data, dates", "Sales fell in 1990."],
            ["Present Perfect", "Past to now", "Emissions have risen since 2000."],
          ]}
        />
      </DefinitionCard>

      <DefinitionCard title="IELTS context">
        <p className="text-slate-300">
          <strong className="text-white">Task 1:</strong> Use Past Simple for
          dates (e.g. 1990) and Future forms for projections (e.g. 2050).
        </p>
      </DefinitionCard>

      <ExaminerTip>
        Tense inconsistency is a common Band 5 trap. Stay consistent in your
        timeline throughout the essay.
      </ExaminerTip>
    </div>
  );
}
