import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
} from "./RevisionNoteContent";

export function TopicModalVerbs() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What are modal verbs?" />
      <DefinitionCard>
        <p className="mb-3">Modal verbs are helping verbs used with a main verb to show attitude: ability, possibility, obligation, advice, permission, and more.</p>
        <p className="mb-3">Main modals for IELTS: <strong className="text-white">can, could, will, would, should, must, have to, may, might</strong>.</p>
        <p className="mb-3">Form: modal + base verb (no &quot;to&quot;). Exceptions: <em>have to, ought to, need to</em> use &quot;to&quot;.</p>
        <WorkedExample><>&quot;Governments <strong>must</strong> address climate change.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Young people <strong>should</strong> exercise regularly.&quot;</></WorkedExample>
        <WorkedExample><>&quot;People <strong>might</strong> work from home more in the future.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={2} title="Modals for ability and possibility" />
      <DefinitionCard>
        <p className="mb-3"><strong className="text-white">can / could</strong> — ability and possibility.</p>
        <p className="mb-3"><strong className="text-white">may / might</strong> — possibility; <em>may</em> also shows permission (formal).</p>
        <SubSectionTitle title="Ability" />
        <WorkedExample><>&quot;Many people <strong>can</strong> speak English at a basic level.&quot;</></WorkedExample>
        <SubSectionTitle title="Possibility (now or future)" />
        <WorkedExample><>&quot;Online learning <strong>might</strong> replace traditional classes for some students.&quot;</></WorkedExample>
        <SubSectionTitle title="Past ability" />
        <WorkedExample><>&quot;In the past, students <strong>could</strong> find jobs more easily.&quot;</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        Use <strong>might / may / could</strong> instead of &quot;will&quot; when you are not 100% sure. This sounds more balanced and academic.
      </ExaminerTip>

      <SectionTitle number={3} title="Modals for obligation and necessity" />
      <DefinitionCard>
        <KeyList
          items={[
            <><strong>must</strong> — strong obligation (internal or speaker&apos;s opinion)</>,
            <><strong>have to</strong> — external obligation (rules, laws)</>,
            <><strong>mustn&apos;t</strong> — prohibited</>,
            <><strong>don&apos;t have to</strong> — not necessary (optional)</>,
          ]}
        />
        <WorkedExample><>&quot;Students <strong>must</strong> prepare thoroughly for IELTS.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Employees <strong>have to</strong> follow company regulations.&quot;</></WorkedExample>
        <WorkedExample><>&quot;You <strong>mustn&apos;t</strong> cheat in the exam.&quot; (prohibited)</></WorkedExample>
        <WorkedExample><>&quot;You <strong>don&apos;t have to</strong> buy new books; you can use the library.&quot; (optional)</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        In Task 2, use <strong>should</strong> for normal recommendations and <strong>must / have to</strong> for very strong arguments.
      </ExaminerTip>

      <SectionTitle number={4} title="Modals for advice and criticism" />
      <DefinitionCard>
        <KeyList
          items={[
            <><strong>should / ought to</strong> — general advice</>,
            <><strong>had better</strong> — strong advice, often with warning</>,
            <><strong>should have + V3</strong> — past advice or criticism</>,
          ]}
        />
        <WorkedExample><>&quot;Governments <strong>should</strong> invest more in public transport.&quot;</></WorkedExample>
        <WorkedExample><>&quot;You <strong>had better</strong> start preparing now.&quot;</></WorkedExample>
        <WorkedExample><>&quot;The company <strong>should have considered</strong> the environmental impact.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={5} title="Modals for academic hedging (cautious language)" />
      <DefinitionCard>
        <p className="mb-3">In academic writing we often avoid 100% certainty. Use <strong className="text-white">may, might, could, tend to, appear to</strong> to soften statements.</p>
        <WorkedExample><>&quot;This policy <strong>may lead to</strong> higher levels of unemployment.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Older people <strong>tend to</strong> prefer traditional media.&quot;</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        Avoid overusing strong modals like &quot;will&quot; and &quot;must&quot; in every sentence. Mix them with softer forms (may, might, could) to sound balanced.
      </ExaminerTip>

      <SectionTitle number={6} title="Mini practice (modals)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">1. Choose the best modal: &quot;Governments ______ invest in renewable energy to reduce pollution.&quot; (should / must / might)</p>
            <p className="mb-2">2. Rewrite using hedging: &quot;Technology will change the way we work.&quot;</p>
            <p className="mb-2">3. Choose: &quot;You ______ use your phone during the exam.&quot; (mustn&apos;t / don&apos;t have to)</p>
            <p className="mb-2">4. Fill the gap: &quot;Online education ______ become more popular in the future.&quot; (Use a cautious modal.)</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;should&quot; or &quot;must&quot; — both fit. &quot;must&quot; is stronger; &quot;should&quot; is a recommendation.</>,
          <>&quot;Technology <strong>may</strong> change the way we work.&quot; or &quot;Technology <strong>might</strong> change...&quot;</>,
          <>&quot;mustn&apos;t&quot; — it is prohibited.</>,
          <>&quot;may&quot;, &quot;might&quot;, or &quot;could&quot; — e.g. &quot;Online education may become more popular...&quot;</>,
        ]}
      />
    </div>
  );
}
