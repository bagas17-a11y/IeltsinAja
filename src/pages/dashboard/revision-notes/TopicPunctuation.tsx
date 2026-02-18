import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
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

      <SectionTitle number={3} title="Colons (:) and semicolons (;)" />
      <SubSectionTitle title="Colons (:)" />
      <DefinitionCard>
        <p className="mb-3">Use a colon before an explanation or list.</p>
        <WorkedExample>
          <>&quot;The government should prioritise three areas: <strong>education, healthcare, and public transport</strong>.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Semicolons (;)" />
      <DefinitionCard>
        <p className="mb-3">Use a semicolon to join two closely related sentences when they are both complete.</p>
        <WorkedExample>
          <>&quot;Traffic is a serious problem; many people spend hours commuting every day.&quot;</>
        </WorkedExample>
        <p className="mt-3 text-sm text-slate-400">
          Using colons and semicolons correctly is not required for a good score, but correct use can show a wider grammatical range.
        </p>
      </DefinitionCard>

      <SectionTitle number={4} title="Quotation marks (“ ”)" />
      <DefinitionCard>
        <p className="mb-3">Use quotation marks when:</p>
        <KeyList
          items={[
            <>You give someone&apos;s exact words: &quot;Some experts argue that &apos;education is the key to success&apos;.&quot;</>,
            <>You mention a special term: &quot;The so‑called &quot;sharing economy&quot; has changed tourism.&quot;</>,
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
