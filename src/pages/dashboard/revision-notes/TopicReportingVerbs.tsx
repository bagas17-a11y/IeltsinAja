import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  MistakeRow,
} from "./RevisionNoteContent";

export function TopicReportingVerbs() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What are reporting verbs?" />
      <DefinitionCard>
        <p className="mb-3">Reporting verbs show what people think, say, or believe: <strong className="text-white">say, think, believe, claim, suggest, argue, report, expect</strong>.</p>
        <p className="mb-3">In IELTS, they help you present opinions in a more formal and objective way.</p>
        <WorkedExample><>&quot;Many experts <strong>argue</strong> that public transport should be free.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Some people <strong>claim</strong> that online learning is less effective.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={2} title="Simple reporting structures" />
      <DefinitionCard>
        <p className="mb-3">Patterns: <strong>People say that…</strong> / <strong>Experts believe that…</strong> / <strong>Research suggests that…</strong></p>
        <p className="mb-3">Use these in introductions and body paragraphs.</p>
        <WorkedExample><>&quot;<strong>Research suggests that</strong> regular exercise improves mental health.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>Many people believe that</strong> university education should be free.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="Passive reporting structures – &quot;It is said that…&quot; etc." />
      <DefinitionCard>
        <SubSectionTitle title="Form: It + passive reporting verb + that-clause" />
        <KeyList
          items={[
            "It is said that…",
            "It is believed that…",
            "It has been suggested that…",
          ]}
        />
        <p className="mb-3 mt-3">Used when the action or idea is more important than who said it, or when the source is general or unknown.</p>
        <WorkedExample><>&quot;<strong>It is believed that</strong> technology will create new types of jobs.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>It has been reported that</strong> pollution levels are rising in many cities.&quot;</></WorkedExample>
        <SubSectionTitle title="Alternative pattern" />
        <p className="mb-2">Noun phrase + be + past participle + to + infinitive</p>
        <WorkedExample><>&quot;Young people <strong>are thought to</strong> spend too much time online.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={4} title="Why passive reporting is useful for IELTS" />
      <DefinitionCard>
        <p className="mb-3">Adds formality and distance. Helps you avoid phrases like &quot;I think&quot; or &quot;many people think&quot; in every sentence.</p>
        <SubSectionTitle title="Comparison" />
        <p className="text-slate-400 mb-1">Informal:</p>
        <WorkedExample><>&quot;People say that fast food is unhealthy.&quot;</></WorkedExample>
        <p className="text-slate-400 mb-1 mt-2">More academic:</p>
        <WorkedExample><>&quot;<strong>It is widely accepted that</strong> fast food is unhealthy.&quot;</></WorkedExample>
        <SubSectionTitle title="Common errors" />
        <MistakeRow wrong="It is say that" correct="It is said that" />
        <MistakeRow wrong="is believed improve" correct="is believed to improve" />
      </DefinitionCard>

      <SectionTitle number={5} title="Mini practice (reporting verbs)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">1. Transform: &quot;People think that climate change is a serious threat.&quot; (Use passive reporting.)</p>
            <p className="mb-2">2. Choose the best verb: &quot;Some experts ______ that homework helps students learn.&quot; (say / argue / suggest / claim)</p>
            <p className="mb-2">3. Correct: &quot;It is believe that education reduces poverty.&quot;</p>
            <p className="mb-2">4. Transform: &quot;Experts expect that prices will rise.&quot; (Use passive form with &quot;to&quot;.)</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;It is thought that climate change is a serious threat.&quot; or &quot;Climate change is thought to be a serious threat.&quot;</>,
          <>&quot;suggest&quot; or &quot;argue&quot; — both fit. &quot;Suggest&quot; is cautious; &quot;argue&quot; is stronger.</>,
          <>&quot;It is believed that education reduces poverty.&quot; — passive: &quot;is&quot; + past participle &quot;believed&quot;.</>,
          <>&quot;Prices are expected to rise.&quot; — noun + be + past participle + to + infinitive.</>,
        ]}
      />
    </div>
  );
}
