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
      <SubSectionTitle title="2.1 Addition" />
      <DefinitionCard>
        <p className="mb-2">Use these to add another idea: <strong className="text-white">and</strong>, <strong className="text-white">moreover</strong>, <strong className="text-white">in addition</strong>, <strong className="text-white">furthermore</strong>, <strong className="text-white">additionally</strong>.</p>
      </DefinitionCard>
      <SubSectionTitle title="2.1.1 General placement rules" />
      <DefinitionCard>
        <p className="mb-2 font-semibold text-slate-200">At the start of a new sentence — Use comma after the linking word:</p>
        <WorkedExample>
          <>
            <p className="mb-1">&quot;<strong>Furthermore,</strong> it helps people make better decisions.&quot;</p>
            <p className="mb-1">&quot;<strong>In addition,</strong> I like watching films in English.&quot;</p>
            <p>&quot;<strong>Moreover,</strong> the results were consistent.&quot;</p>
          </>
        </WorkedExample>
        <p className="text-sm text-slate-300 mb-3">Best for: essays / formal writing / clear structure</p>
        <p className="mb-2 font-semibold text-slate-200">Mid-sentence (more formal) — Usually set off with commas:</p>
        <WorkedExample>
          <>
            <p className="mb-1">&quot;Education improves job prospects and, <strong>in addition</strong>, it builds confidence.&quot;</p>
            <p className="mb-1">&quot;The plan is expensive and, <strong>moreover</strong>, it is risky.&quot;</p>
            <p>&quot;The solution is simple and, <strong>furthermore</strong>, it is fast.&quot;</p>
          </>
        </WorkedExample>
        <p className="text-sm text-slate-300 mb-3">Best for: formal tone, adding emphasis. Don&apos;t overuse &mdash; it can sound heavy.</p>
        <p className="mb-2 font-semibold text-slate-200">With semicolon (very formal) — Use when you want two connected sentences:</p>
        <WorkedExample>
          <>&quot;Education improves job prospects<strong>; furthermore,</strong> it helps people make better decisions.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.1.2 &quot;And&quot; exception rules" />
      <DefinitionCard>
        <KeyList
          items={[
            <>No comma before &quot;and&quot; when it joins two words/phrases: &quot;I like tea and coffee.&quot; / &quot;She studies at night and on weekends.&quot;</>,
            <>Use comma before &quot;and&quot; only if both sides are complete sentences: &quot;Education improves job prospects, and it helps people make better decisions.&quot;</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="2.1.3 &quot;In addition&quot; vs &quot;In addition to&quot;" />
      <DefinitionCard>
        <KeyList
          items={[
            <>&quot;In addition&quot; + comma (adds new point): &quot;In addition, I joined a club.&quot;</>,
            <>&quot;In addition to&quot; + noun/verb-ing + comma (replacement for &quot;besides&quot;): &quot;In addition to studying, I work part-time.&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="2.2 Contrast" />
      <DefinitionCard>
        <p className="mb-2">Use these to show a different idea: <strong className="text-white">however</strong>, <strong className="text-white">although</strong>, <strong className="text-white">on the other hand</strong>, <strong className="text-white">whereas</strong>, <strong className="text-white">but</strong>, <strong className="text-white">yet</strong>, <strong className="text-white">nevertheless</strong>, <strong className="text-white">in contrast</strong>.</p>
        <p className="mb-3 text-sm text-slate-300">However and although have different punctuation rules:</p>
        <p className="mb-2 font-semibold text-slate-200">However (contrast between two sentences/ideas):</p>
        <KeyList
          items={[
            <>Start of a new sentence: &quot;however&quot; + comma + main clause — &quot;Online learning is convenient. However, some students miss face-to-face contact.&quot; (the phrase before &quot;However&quot; is the first idea; the phrase after is the contrasting idea)</>,
            <>Mid-sentence (more formal): semi-colon + &quot;however&quot; + comma + main clause — &quot;Online learning is convenient; however, some students miss face-to-face contact.&quot;</>,
            <>Common mistake: Replacing semi-colon with comma when both sides are complete sentences.</>,
          ]}
        />
        <p className="mb-2 mt-4 font-semibold text-slate-200">Although (subordinate clause &rarr; main idea):</p>
        <KeyList
          items={[
            <>Start of sentence: &quot;Although&quot; + clause + comma + main clause — &quot;Although public transport is cheap, it is often crowded.&quot; (the clause before the comma is the concession; the phrase after is the main idea)</>,
            <>Mid-sentence: main clause + comma + &quot;although&quot; + secondary clause — &quot;It was a good movie, although it was long.&quot;</>,
          ]}
        />
        <p className="mb-2 mt-4 font-semibold text-slate-200">Whereas (direct comparison):</p>
        <KeyList
          items={[
            <>Mid-sentence: clause + comma + &quot;whereas&quot; + clause — &quot;Online learning is flexible, whereas in-person classes offer more interaction.&quot;</>,
            <>Often used in more formal writing. Best for comparing two clear sides.</>,
          ]}
        />
        <p className="mb-2 mt-4 font-semibold text-slate-200">On the other hand (second side of a comparison):</p>
        <KeyList
          items={[
            <>Start of second sentence: &quot;On the other hand&quot; + comma + main clause — &quot;Some students prefer studying at home. On the other hand, others focus better in a library.&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="2.3 Cause and result" />
      <DefinitionCard>
        <p className="mb-2">Use these to show cause or result: <strong className="text-white">because</strong>, <strong className="text-white">since</strong>, <strong className="text-white">as</strong>, <strong className="text-white">therefore</strong>, <strong className="text-white">as a result</strong>, <strong className="text-white">consequently</strong>.</p>
      </DefinitionCard>
      <SubSectionTitle title="2.3.1 Punctuation and placement" />
      <DefinitionCard>
        <p className="mb-2 font-semibold text-slate-200">Because / Since / As — introduce reason clause:</p>
        <KeyList
          items={[
            <>Pattern A (start of sentence): &quot;Because/Since/As&quot; + clause + comma + main clause — &quot;Since public transport is limited, many people drive.&quot;</>,
            <>Pattern B (between clauses): main clause + &quot;because/since/as&quot; + clause — &quot;People drive more since public transport is limited.&quot;</>,
          ]}
        />
        <p className="mb-2 mt-4 font-semibold text-slate-200">Therefore / Consequently — transition signal:</p>
        <WorkedExample>
          <>sentence + period/semicolon + &quot;Therefore/Consequently&quot; + comma + sentence — &quot;Traffic is getting worse. Therefore, governments must improve public transport.&quot;</>
        </WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">As a result / As a result of — result phrase:</p>
        <WorkedExample>
          <>&quot;Many factories were closed. <strong>As a result</strong>, unemployment rose sharply.&quot;</>
        </WorkedExample>
      </DefinitionCard>

      <SubSectionTitle title="2.4 Example" />
      <DefinitionCard>
        <p className="mb-2">Use these to give examples: <strong className="text-white">for example</strong>, <strong className="text-white">for instance</strong>.</p>
        <WorkedExample><>&quot;Many countries face environmental problems. <strong>For example</strong>, air pollution is a major issue in big cities.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.5 Sequence" />
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
        <SubSectionTitle title="4.1 Model paragraph" />
        <blockquote className="border-l-4 border-[#3b82f6] pl-4 py-2 my-3 text-slate-200 italic">
          &quot;Many people believe that technology has improved education. <strong className="text-white not-italic">For example</strong>, students can now access online courses from anywhere. <strong className="text-white not-italic">Furthermore</strong>, teachers can use videos and interactive tools in the classroom. <strong className="text-white not-italic">However</strong>, some argue that too much screen time harms concentration. <strong className="text-white not-italic">This</strong> debate is likely to continue for many years.&quot;
        </blockquote>
        <p className="text-sm text-slate-400">Notice: topic sentence &rarr; examples with linkers &rarr; referencing with &quot;This debate&quot;.</p>
      </DefinitionCard>

      <SectionTitle number={5} title="Mini practice (cohesion)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-300">
              <li>
                <span className="text-slate-200">Choose the best linker:</span>
                <p className="mt-1 italic">&quot;Public transport is cheap. _____, it helps reduce pollution.&quot;</p>
                <p className="mt-0.5 text-slate-400">(Moreover / However / Therefore)</p>
              </li>
              <li>
                <span className="text-slate-200">Replace the repeated noun with a pronoun:</span>
                <p className="mt-1 italic">&quot;The government introduced new laws. The new laws were unpopular.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Underline the linkers and fix any that are repeated too often:</span>
                <p className="mt-1 italic">&quot;Firstly, I think education is important. Firstly, it helps people find jobs. Firstly, it improves society.&quot;</p>
              </li>
            </ol>
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
