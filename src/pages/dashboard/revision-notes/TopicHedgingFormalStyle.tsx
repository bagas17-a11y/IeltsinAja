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

export function TopicHedgingFormalStyle() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What is hedging?" />
      <DefinitionCard>
        <p className="mb-3">Hedging = using cautious language to avoid sounding too strong or too certain.</p>
        <p className="mb-3">Important in academic writing because many statements are opinions or general trends, not facts.</p>
        <SubSectionTitle title="Example" />
        <p className="text-slate-400 mb-1">Very strong:</p>
        <WorkedExample><>&quot;Fast food causes obesity.&quot;</></WorkedExample>
        <p className="text-slate-400 mb-1 mt-2">Hedged:</p>
        <WorkedExample><>&quot;Fast food <strong>can contribute to</strong> obesity.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Fast food <strong>is likely to</strong> contribute to obesity for some people.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={2} title="Hedging with modal verbs" />
      <DefinitionCard>
        <p className="mb-3">Use <strong className="text-white">may, might, could, can</strong> to show possibility.</p>
        <WorkedExample><>&quot;This policy <strong>may lead to</strong> higher taxes.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Improved public transport <strong>could reduce</strong> traffic congestion.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="Hedging with adverbs and adjectives" />
      <DefinitionCard>
        <p className="mb-2">Adverbs: <strong className="text-white">probably, possibly, generally, largely, partly</strong>.</p>
        <p className="mb-3">Adjectives: <strong className="text-white">possible, likely, unlikely, main, general</strong>.</p>
        <WorkedExample><>&quot;This trend is <strong>likely</strong> to continue in the future.&quot;</></WorkedExample>
        <WorkedExample><>&quot;The increase was <strong>partly</strong> caused by higher fuel prices.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={4} title="Other academic style features" />
      <DefinitionCard>
        <KeyList
          items={[
            "Avoid contractions in Academic Writing — don't → do not",
            "Avoid very informal words — kids, lots of, a bunch of",
            "Prefer neutral academic verbs — increase, decrease, result in, lead to, contribute to",
          ]}
        />
        <SubSectionTitle title="Before / After" />
        <p className="text-slate-400 mb-1">Informal:</p>
        <WorkedExample><>&quot;Kids spend lots of time on their phones.&quot;</></WorkedExample>
        <p className="text-slate-400 mb-1 mt-2">Academic:</p>
        <WorkedExample><>&quot;Children <strong>spend a great deal of time</strong> on their phones.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={5} title="Mini practice (hedging & style)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">1. Rewrite with hedging: &quot;Technology destroys traditional jobs.&quot;</p>
            <p className="mb-2">2. Replace informal words: &quot;Lots of people think that governments should do something about pollution.&quot;</p>
            <p className="mb-2">3. Rewrite: &quot;Online learning will replace face-to-face classes.&quot;</p>
            <p className="mb-2">4. Formal version: &quot;Kids don&apos;t get enough exercise these days.&quot;</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;Technology <strong>may</strong> destroy traditional jobs.&quot; or &quot;Technology <strong>can contribute to</strong> the decline of traditional jobs.&quot;</>,
          <>&quot;<strong>Many</strong> people believe that governments should <strong>address</strong> pollution.&quot; or &quot;...take action on pollution.&quot;</>,
          <>&quot;Online learning <strong>may</strong> replace face-to-face classes.&quot; or &quot;...<strong>could</strong> replace...&quot;</>,
          <>&quot;Children <strong>do not</strong> get enough exercise these days.&quot; — expand contraction; avoid &quot;kids&quot;.</>,
        ]}
      />
    </div>
  );
}
