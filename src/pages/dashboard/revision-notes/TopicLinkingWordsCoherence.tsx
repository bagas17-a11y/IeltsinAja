import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
} from "./RevisionNoteContent";

export function TopicLinkingWordsCoherence() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Why cohesion is important" />
      <DefinitionCard>
        <p className="mb-3"><strong className="text-white">Coherence</strong> = your ideas are logical and easy to follow.</p>
        <p className="mb-3"><strong className="text-white">Cohesion</strong> = your sentences are connected with linking words and referencing (pronouns, this/that, etc.).</p>
        <p>Coherence and Cohesion is 25% of your Writing band score. Using linkers and referencing correctly helps the examiner follow your argument.</p>
      </DefinitionCard>

      <SectionTitle number={2} title="Linking words (categories and examples)" />
      <SubSectionTitle title="Addition" />
      <DefinitionCard>
        <p className="mb-2">Use these to add another idea: <strong className="text-white">and</strong>, <strong className="text-white">moreover</strong>, <strong className="text-white">in addition</strong>, <strong className="text-white">furthermore</strong>.</p>
        <WorkedExample><>&quot;Education improves job prospects. <strong>Furthermore</strong>, it helps people make better decisions.&quot;</></WorkedExample>
        <WorkedExample><>&quot;I enjoy studying English. <strong>In addition</strong>, I like watching films in English.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Contrast" />
      <DefinitionCard>
        <p className="mb-2">Use these to show a different idea: <strong className="text-white">however</strong>, <strong className="text-white">on the other hand</strong>, <strong className="text-white">although</strong>, <strong className="text-white">whereas</strong>.</p>
        <WorkedExample><>&quot;Online learning is convenient. <strong>However</strong>, some students miss face-to-face contact.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>Although</strong> public transport is cheap, it is often crowded.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Cause and result" />
      <DefinitionCard>
        <p className="mb-2">Use these to show cause or result: <strong className="text-white">because</strong>, <strong className="text-white">since</strong>, <strong className="text-white">therefore</strong>, <strong className="text-white">as a result</strong>, <strong className="text-white">consequently</strong>.</p>
        <WorkedExample><>&quot;Many cities have traffic problems. <strong>Therefore</strong>, governments should invest in public transport.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>Because</strong> housing costs are high, many young people live with their parents.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Example" />
      <DefinitionCard>
        <p className="mb-2">Use these to give examples: <strong className="text-white">for example</strong>, <strong className="text-white">for instance</strong>.</p>
        <WorkedExample><>&quot;Many countries face environmental problems. <strong>For example</strong>, air pollution is a major issue in big cities.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Sequence" />
      <DefinitionCard>
        <p className="mb-2">Use these to show order: <strong className="text-white">firstly</strong>, <strong className="text-white">secondly</strong>, <strong className="text-white">finally</strong>.</p>
        <WorkedExample><>&quot;<strong>Firstly</strong>, I will discuss the benefits. <strong>Secondly</strong>, I will look at the disadvantages. <strong>Finally</strong>, I will give my opinion.&quot;</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        Do not start every sentence with &quot;And&quot;, &quot;But&quot;, or &quot;So&quot;. Vary your linkers. Also avoid informal linkers like &quot;plus&quot; or &quot;and so on&quot; in Academic Writing.
      </ExaminerTip>

      <SectionTitle number={3} title="Referencing: pronouns, this/that, substitution" />
      <DefinitionCard>
        <p className="mb-3">Referencing means referring back to earlier ideas using <strong className="text-white">pronouns</strong> or <strong className="text-white">reference words</strong> instead of repeating the noun.</p>
        <KeyList
          items={[
            <>Pronouns: <em>it, they, them, this, these, those</em></>,
            <>Substitution: <em>one, ones, do so, such</em></>,
          ]}
        />
        <WorkedExample><>&quot;The university is large. <strong>It</strong> has many students.&quot;</></WorkedExample>
        <WorkedExample><>&quot;The shops closed early. <strong>This</strong> made it difficult to buy food.&quot;</></WorkedExample>
        <WorkedExample><>&quot;I prefer the blue jacket, but my friend likes the red <strong>one</strong>.&quot;</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        Every pronoun must clearly refer to one noun or idea. If the reader cannot tell what &quot;it&quot; or &quot;this&quot; refers to, your coherence score may drop.
      </ExaminerTip>

      <SectionTitle number={4} title="Paragraph flow and style" />
      <DefinitionCard>
        <p className="mb-3">Each paragraph needs:</p>
        <KeyList
          items={[
            "A topic sentence (main idea)",
            "Supporting ideas with linkers",
            "A short conclusion or linking sentence",
          ]}
        />
        <p className="mt-3 mb-3">Keep a formal style: no slang, no contractions (e.g. use &quot;do not&quot; not &quot;don&apos;t&quot;) in Academic Writing.</p>
        <SubSectionTitle title="Model paragraph" />
        <blockquote className="border-l-4 border-[#3b82f6] pl-4 py-2 my-3 text-slate-200 italic">
          &quot;Many people believe that technology has improved education. <strong className="text-white not-italic">For example</strong>, students can now access online courses from anywhere. <strong className="text-white not-italic">Furthermore</strong>, teachers can use videos and interactive tools in the classroom. <strong className="text-white not-italic">However</strong>, some argue that too much screen time harms concentration. <strong className="text-white not-italic">This</strong> debate is likely to continue for many years.&quot;
        </blockquote>
        <p className="text-sm text-slate-400">Notice: topic sentence → examples with linkers → referencing with &quot;This debate&quot;.</p>
      </DefinitionCard>

      <SectionTitle number={5} title="Mini practice (cohesion)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">1. Choose the best linker: &quot;Public transport is cheap. _____, it helps reduce pollution.&quot; (Moreover / However / Therefore)</p>
            <p className="mb-2">2. Replace the repeated noun with a pronoun: &quot;The government introduced new laws. The new laws were unpopular.&quot;</p>
            <p className="mb-2">3. Underline the linkers in this sentence and check if any are repeated too often: &quot;Firstly, I think education is important. Firstly, it helps people find jobs. Firstly, it improves society.&quot;</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;Moreover&quot; — we are adding another benefit, not contrasting or showing result.</>,
          <>&quot;The government introduced new laws. <strong>These</strong> were unpopular.&quot;</>,
          <>Wrong — &quot;Firstly&quot; is repeated three times. Use &quot;Firstly&quot;, &quot;Secondly&quot;, &quot;Finally&quot; or other linkers like &quot;Furthermore&quot;, &quot;In addition&quot;.</>,
        ]}
      />
    </div>
  );
}
