import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  MistakeRow,
} from "./RevisionNoteContent";

export function TopicPunctuation() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Why punctuation matters in IELTS" />
      <DefinitionCard>
        <p className="mb-3">
          Punctuation shows where ideas start and end and how they connect.
        </p>
        <p>
          Incorrect punctuation can make your writing hard to understand and may reduce your Coherence and Cohesion as well as Grammar scores.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Commas (,)" />
      <SubSectionTitle title="a) Lists" />
      <DefinitionCard>
        <p className="mb-3">Use commas to separate three or more items.</p>
        <WorkedExample>
          <>&quot;Students need <strong>time, motivation, and good resources</strong> to succeed.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="b) After linking words at the beginning" />
      <DefinitionCard>
        <WorkedExample><>&quot;<strong>Firstly,</strong> governments should invest more in education.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>However,</strong> this solution may be too expensive.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="c) Before “and / but / so / yet” when joining two sentences" />
      <DefinitionCard>
        <WorkedExample>
          <>&quot;Public transport is cheap, <strong>but</strong> it is often crowded.&quot;</>
        </WorkedExample>
        <p className="mt-3 text-sm text-slate-400">
          Avoid very long sentences with no commas or too many commas in random places.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="d) Common comma mistakes" />
      <DefinitionCard>
        <p className="mb-2 font-semibold text-slate-200">Comma splice</p>
        <p className="mb-2 text-sm">Using only a comma to join two complete sentences (wrong). Use a full stop, semicolon, or conjunction instead.</p>
        <MistakeRow wrong="Many people drive to work, it causes traffic." correct="Many people drive to work. It causes traffic." />
        <p className="mb-2 mt-4 font-semibold text-slate-200">Subject/verb separation</p>
        <p className="mb-2 text-sm">Do not put a comma between the subject and verb.</p>
        <MistakeRow wrong="The number of students, using online platforms increased." correct="The number of students using online platforms increased." />
      </DefinitionCard>

      <SectionTitle number={3} title="Colons (:) and semicolons (;)" />
      <SubSectionTitle title="Colons (:)" />
      <DefinitionCard>
        <p className="mb-3">A colon introduces lists, explanations, or quotations after an independent clause — like an equal sign connecting a main idea to what clarifies it.</p>
        <KeyList
          items={[
            <>List: &quot;The government should prioritise three areas: education, healthcare, and public transport.&quot;</>,
            <>Explanation: &quot;There is one main reason: cost.&quot;</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="Semicolons (;)" />
      <DefinitionCard>
        <p className="mb-3">A semicolon joins two closely related independent clauses without a conjunction. Both sides must be complete sentences.</p>
        <WorkedExample>
          <>&quot;Traffic is a serious problem; many people spend hours commuting every day.&quot;</>
        </WorkedExample>
        <p className="mt-3 text-sm text-slate-400">
          Using colons and semicolons correctly is not required for a good score, but correct use can show a wider grammatical range.
        </p>
      </DefinitionCard>

      <SectionTitle number={4} title="Quotation marks" />
      <DefinitionCard>
        <p className="mb-3">Use quotation marks when:</p>
        <KeyList
          items={[
            <>You give someone&apos;s exact words — use double quotes for the main quote, single quotes for nested quotes inside.</>,
            <>You mention a special term — e.g. the so‑called &quot;sharing economy&quot; has changed tourism.</>,
          ]}
        />
        <p className="mt-3 mb-2 font-semibold text-slate-200">Difference between single (&apos;...&apos;) and double (&quot;...&quot;)</p>
        <KeyList
          items={[
            <><strong className="text-white">Double quotes</strong> — standard for direct speech and quoted terms in British English.</>,
            <><strong className="text-white">Single quotes</strong> — used for quotes inside quotes (nested), or in some styles for emphasis.</>,
            <>In IELTS, either style is fine as long as you are consistent.</>,
          ]}
        />
        <p className="mt-3 text-sm text-slate-400">
          In IELTS Writing Task 2, you usually use quotation marks only occasionally.
        </p>
      </DefinitionCard>

      <SectionTitle number={5} title="Dashes (—)" />
      <DefinitionCard>
        <p className="mb-3">A dash shows a strong pause or adds extra information.</p>
        <WorkedExample>
          <>&quot;The results were surprising — almost 80% of participants preferred online learning.&quot;</>
        </WorkedExample>
        <p className="mt-3 text-sm text-slate-400">
          Dashes are optional. If you are not confident, use a full stop or a comma instead.
        </p>
      </DefinitionCard>

      <SectionTitle number={6} title="Mini practice – punctuation" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">Correct the punctuation:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-300">
              <li>&quot;Firstly governments should invest more in public transport but many politicians ignore this.&quot;</li>
              <li>&quot;The graph shows three main trends education health care and housing costs.&quot;</li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;Firstly, governments should invest more in public transport, but many politicians ignore this.&quot;</>,
          <>&quot;The graph shows three main trends: education, healthcare, and housing costs.&quot;</>,
        ]}
      />
    </div>
  );
}
