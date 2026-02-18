import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  WorkedExample,
  MiniPractice,
} from "./RevisionNoteContent";

export function TopicSentenceStructure() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Active and passive voice" />
      <SubSectionTitle title="Active voice" />
      <DefinitionCard>
        <p className="mb-2">The subject <strong className="text-white">does</strong> the action.</p>
        <WorkedExample><>&quot;The government <strong>increased</strong> taxes.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Passive voice" />
      <DefinitionCard>
        <p className="mb-2">The subject <strong className="text-white">receives</strong> the action.</p>
        <WorkedExample><>&quot;Taxes <strong>were increased</strong> by the government.&quot;</></WorkedExample>
        <p className="mt-3 text-slate-300">
          Passive voice is useful in Task 1 when the action is more important than the person or thing that does it, for example in process diagrams or reports.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Simple, compound, and basic complex sentences" />
      <DefinitionCard>
        <p className="mb-4">
          Using only simple sentences makes your writing clear but basic. For Band 7 and above, you should show a mix of simple, compound, and complex sentences.
        </p>
        <SubSectionTitle title="a) Simple sentences" />
        <p className="mb-2">One independent clause (one complete idea).</p>
        <WorkedExample><>&quot;Many students study abroad.&quot;</></WorkedExample>

        <SubSectionTitle title="b) Compound sentences" />
        <p className="mb-2">Two independent clauses joined with <strong className="text-white">and, but, so, or, yet, for</strong>.</p>
        <WorkedExample><>&quot;Many students study abroad, <strong>but</strong> studying overseas can be expensive.&quot;</></WorkedExample>
        <p className="text-sm text-slate-400 mt-2">Pattern: Clause 1 + , + coordinating conjunction + Clause 2</p>

        <SubSectionTitle title="c) Basic complex sentences" />
        <p className="mb-2">One main clause + one dependent clause introduced by <strong className="text-white">because, although, while, if, when, since</strong>, etc.</p>
        <WorkedExample><>&quot;<strong>Although</strong> studying abroad is expensive, many students believe it is worth the cost.&quot;</></WorkedExample>
        <WorkedExample><>&quot;People are healthier <strong>because</strong> they have better access to medical care.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="Example paragraph with mixed structures" />
      <DefinitionCard>
        <blockquote className="border-l-4 border-[#3b82f6] pl-4 py-2 my-0 text-slate-200 italic">
          &quot;Many young people choose to study abroad because overseas universities often provide better facilities. <strong className="text-white not-italic">However,</strong> studying in another country can be very expensive, and some students struggle with homesickness. <strong className="text-white not-italic">Although</strong> there are clear disadvantages, I believe the overall experience is beneficial.&quot;
        </blockquote>
        <p className="mt-3 text-sm text-slate-400">
          This paragraph includes simple, compound, and complex sentences and uses linking words clearly.
        </p>
      </DefinitionCard>

      <SectionTitle number={4} title="Mini practice – sentence structure" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">Join the ideas into better sentences:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-300">
              <li>&quot;People use cars. Cities are crowded.&quot;</li>
              <li>&quot;Education is important. Many children cannot go to school.&quot;</li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;People use cars more than public transport, <strong>so</strong> many cities are crowded.&quot;</>,
          <>&quot;Education is important, <strong>but</strong> many children cannot go to school <strong>because</strong> their families are poor.&quot;</>,
        ]}
      />
    </div>
  );
}
