import {
  DefinitionCard,
  ExaminerTip,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  MiniPractice,
  MistakeRow,
  RevisionTable,
} from "./RevisionNoteContent";

export function TopicApostrophes() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p className="mb-3">
          Apostrophes are used for <strong className="text-white">possession</strong> and <strong className="text-white">contractions</strong>.
        </p>
        <p>
          Accurate apostrophe use is a small but important part of grammatical accuracy for higher bands.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Possessive Apostrophes" />
      <SubSectionTitle title="2.1 Singular possession" />
      <DefinitionCard>
        <p className="mb-2">Form: noun + &apos;s.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
          <li>&quot;the government<strong className="text-white">&apos;s</strong> responsibility&quot;</li>
          <li>&quot;the country<strong className="text-white">&apos;s</strong> economy&quot;</li>
        </ul>
      </DefinitionCard>
      <SubSectionTitle title="2.2 Plural possession" />
      <KeyList
        items={[
          <>Plural ending in s: s + &apos; → &quot;workers<strong className="text-white">&apos;</strong> rights&quot;, &quot;students<strong className="text-white">&apos;</strong> performance&quot;</>,
          <>Irregular plural: &apos;s → &quot;children<strong className="text-white">&apos;s</strong> education&quot;, &quot;people<strong className="text-white">&apos;s</strong> lifestyles&quot;</>,
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Common IELTS contexts</p>
      <DefinitionCard>
        <p className="text-slate-300">
          &quot;governments&apos; policies&quot;, &quot;students&apos; motivation&quot;, &quot;citizens&apos; safety&quot;
        </p>
      </DefinitionCard>
      <ExaminerTip>
        Placing the apostrophe in the wrong place (&quot;student&apos;s&quot; instead of &quot;students&apos;&quot;) is a typical Band 6 error.
      </ExaminerTip>

      <SectionTitle number={3} title="Contraction Apostrophes" />
      <SubSectionTitle title="3.1 Form" />
      <DefinitionCard>
        <p className="mb-3">
          Contractions show missing letters: it&apos;s, don&apos;t, can&apos;t, won&apos;t.
        </p>
        <p>
          They are natural in Speaking but too informal for Academic Writing.
        </p>
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2">Rules</p>
      <RevisionTable
        headers={["Form", "Meaning"]}
        rows={[
          ["it's", "it is / it has"],
          ["its", "possessive adjective (no apostrophe)"],
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Good use in Speaking</p>
      <DefinitionCard>
        <p>&quot;It&apos;s important to manage stress during exams.&quot;</p>
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Better in Writing</p>
      <DefinitionCard>
        <p>&quot;It is important to manage stress during exams.&quot;</p>
      </DefinitionCard>

      <SectionTitle number={4} title="Typical IELTS Mistakes with Apostrophes" />
      <DefinitionCard>
        <MistakeRow wrong="The government released it's report." correct="its report" />
        <MistakeRow wrong="Researcher's have found a link…" correct="Researchers have found a link…" />
        <MistakeRow wrong="The 1990's saw rapid growth." correct="The 1990s saw rapid growth." />
      </DefinitionCard>
      <ExaminerTip>
        Avoid apostrophes in plurals like &quot;IELT&apos;S&quot;, &quot;car&apos;s&quot;, &quot;issue&apos;s&quot;. These are considered basic errors and reduce the impression of control.
      </ExaminerTip>

      <SectionTitle number={5} title="Mini Practice (Apostrophes)" />
      <MiniPractice
        title="Mini Practice"
        prompt={
          <>
            <p className="mb-2">Correct the apostrophes:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-300">
              <li>&quot;Peoples lifestyle&apos;s have changed.&quot;</li>
              <li>&quot;It&apos;s education system is improving.&quot;</li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;People&apos;s lifestyles have changed.&quot;</>,
          <>&quot;Its education system is improving.&quot;</>,
        ]}
      />
    </div>
  );
}
