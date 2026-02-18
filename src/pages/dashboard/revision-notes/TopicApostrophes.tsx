import {
  DefinitionCard,
  ExaminerTip,
  RevisionTable,
  MistakeRow,
} from "./RevisionNoteContent";

export function TopicApostrophes() {
  return (
    <div className="space-y-6">
      <DefinitionCard title="Possession">
        <p className="mb-2">
          <strong>Singular:</strong> (&apos;s) — &quot;The student&apos;s book&quot;
        </p>
        <p>
          <strong>Plural:</strong> (s&apos;) — &quot;The students&apos; results&quot;
        </p>
      </DefinitionCard>

      <DefinitionCard title="Contractions">
        <p className="text-slate-300">
          <strong className="text-white">NEVER</strong> use &quot;don&apos;t&quot;
          or &quot;it&apos;s&quot; in Academic Writing. Use &quot;do not&quot; and
          &quot;it is&quot;.
        </p>
      </DefinitionCard>

      <DefinitionCard title="Mistake table: it&apos;s vs its">
        <RevisionTable
          headers={["Form", "Meaning", "Example"]}
          rows={[
            ["it's", "it is / it has", "It's clear that..."],
            ["its", "possessive", "The report has its limits."],
          ]}
        />
      </DefinitionCard>

      <DefinitionCard title="Common mistakes">
        <MistakeRow wrong="The government released it's report." correct="its report" />
        <MistakeRow wrong="Researcher's have found..." correct="Researchers have found..." />
        <MistakeRow wrong="The 1990's saw growth." correct="The 1990s saw growth." />
      </DefinitionCard>

      <ExaminerTip>
        Contractions are natural in IELTS Speaking. In Academic Writing, always
        use full forms.
      </ExaminerTip>
    </div>
  );
}
