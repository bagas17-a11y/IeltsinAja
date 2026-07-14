import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  MistakeRow,
  WorksheetContainer,
  WorksheetBlock,
  WorksheetQuestion,
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
      <SubSectionTitle title="2.1 Lists" />
      <DefinitionCard>
        <p className="mb-3">Use commas to separate three or more items.</p>
        <WorkedExample>
          <>&quot;Students need <strong>time, motivation, and good resources</strong> to succeed.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.2 After linking words at the beginning" />
      <DefinitionCard>
        <WorkedExample><>&quot;<strong>Firstly,</strong> governments should invest more in education.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>However,</strong> this solution may be too expensive.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.3 Before &quot;and / but / so / yet&quot; when joining two sentences" />
      <DefinitionCard>
        <WorkedExample>
          <>&quot;Public transport is cheap, <strong>but</strong> it is often crowded.&quot;</>
        </WorkedExample>
        <p className="mt-3 text-sm text-slate-400">
          Avoid very long sentences with no commas or too many commas in random places.
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Do NOT use a comma when connecting one independent and one dependent clause without a conjunction.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="2.4 Common comma mistakes" />
      <DefinitionCard>
        <p className="mb-2 font-semibold text-slate-200">Comma splice</p>
        <p className="mb-2 text-sm">Using only a comma to join two complete sentences (wrong). Use a full stop, semicolon, or conjunction instead.</p>
        <MistakeRow wrong="Many people drive to work, it causes traffic." correct="Many people drive to work. It causes traffic." />
        <p className="mb-2 mt-4 font-semibold text-slate-200">Subject/verb separation</p>
        <p className="mb-2 text-sm">Do not put a comma between the subject and verb.</p>
        <MistakeRow wrong="The number of students, using online platforms increased." correct="The number of students using online platforms increased." />
      </DefinitionCard>

      <SectionTitle number={3} title="Colons (:) and semicolons (;)" />
      <SubSectionTitle title="3.1 Colons (:)" />
      <DefinitionCard>
        <p className="mb-3">A colon introduces lists, explanations, or quotations after an independent clause — like an equal sign connecting a main idea to what clarifies it.</p>
        <KeyList
          items={[
            <>List: &quot;The government should prioritise three areas: education, healthcare, and public transport.&quot;</>,
            <>Explanation: &quot;There is one main reason: cost.&quot;</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="3.2 Semicolons (;)" />
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
        <p className="mb-3">A dash shows a strong pause or adds extra information. Use cases:</p>
        <KeyList
          items={[
            <><strong className="text-white">Independent + Independent:</strong> Works like a semicolon, joining two separate but related independent clauses — E.g. &quot;The results were conclusive — the policy had failed.&quot;</>,
            <><strong className="text-white">Independent + Dependent:</strong> When the dependent clause is a descriptor of the independent, adding emphasis (independent clause MUST come first) — E.g. &quot;Indonesia faces a major challenge — a sinking capital.&quot;</>,
            <><strong className="text-white">Interruptor:</strong> Similar to parentheses, to insert additional information in the middle of the sentence — E.g. &quot;The participants—all of whom were over 60—reported better health.&quot; (The inserted information is just extra information; the sentence works fine without it.)</>,
          ]}
        />
      </DefinitionCard>

      <SectionTitle number={6} title="Mini practice – punctuation" />
      <SubSectionTitle title="6.1 Identify the mistakes" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-3">Identify the 7 punctuation mistakes in the following paragraph and rewrite it with the corrections:</p>
            <div className="p-4 rounded-lg bg-[#1e293b]/60 border border-[#334155] text-slate-200 italic text-sm">
              &quot;Modern technology has revolutionized the way we communicate yet it has also created a sense of digital isolation. Many experts believe that social media—despite its name—actually distances individuals from real-life interaction. If a person spends all day online they may lose the ability to read body language. Furthermore, some studies show that constant notifications are harmful, they can lead to decreased focus and higher stress levels. Many teenagers use multiple apps at once; and this constant switching prevents deep concentration. There is one major consequence to this lifestyle—a decline in mental well-being. Ultimately, everyone should try to unplug occasionally, because a healthy balance is essential for a productive life.&quot;
            </div>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <><strong>Mistake 1:</strong> &quot;communicate yet&quot; — missing comma before coordinating conjunction joining two independent clauses. Fix: &quot;communicate, yet&quot;</>,
          <><strong>Mistake 2:</strong> &quot;online they&quot; — missing comma after dependent clause at the start. Fix: &quot;online, they&quot;</>,
          <><strong>Mistake 3:</strong> &quot;are harmful, they&quot; — comma splice (two independent clauses joined only by a comma). Fix: &quot;are harmful; they&quot; or &quot;are harmful. They&quot;</>,
          <><strong>Mistake 4:</strong> &quot;at once; and&quot; — semicolon before a coordinating conjunction is incorrect. Fix: &quot;at once, and&quot;</>,
          <><strong>Mistake 5:</strong> Check the paragraph for any remaining punctuation issues and correct them.</>,
        ]}
      />
    </div>
  );
}

export function TopicPunctuationWorksheet1() {
  return (
    <WorksheetContainer topicName="Punctuation">

        <WorksheetBlock
          title="Part A — Identify and correct the punctuation error"
          instruction="Each sentence contains one or more punctuation errors. Rewrite the corrected version, then click Check answer."
        >
          <WorksheetQuestion id="punc-a-1" number={1} multiline
            question='Many students struggle with time management, however they can improve with consistent daily practice.'
            modelAnswer='Many students struggle with time management; however, they can improve with consistent daily practice. OR: Many students struggle with time management. However, they can improve with consistent daily practice. ("However" is an adverb, not a conjunction. A comma alone cannot join two independent clauses — use a semicolon, then a comma after "however".)'
          />
          <WorksheetQuestion id="punc-a-2" number={2} multiline
            question='The report identified three key problems education funding healthcare and transport infrastructure.'
            modelAnswer='The report identified three key problems: education funding, healthcare, and transport infrastructure. (A colon introduces the list after a complete clause. Commas separate the three items in the list.)'
          />
          <WorksheetQuestion id="punc-a-3" number={3} multiline
            question='Furthermore governments should invest more heavily in renewable energy sources.'
            modelAnswer='Furthermore, governments should invest more heavily in renewable energy sources. (A comma is required after a sentence adverb or linking word that appears at the start of a sentence.)'
          />
          <WorksheetQuestion id="punc-a-4" number={4} multiline
            question='Many teenagers use multiple social media apps at once; and this constant switching prevents deep concentration.'
            modelAnswer='Many teenagers use multiple social media apps at once, and this constant switching prevents deep concentration. (A semicolon should not be placed before a coordinating conjunction like "and". Use a comma before "and" instead.)'
          />
          <WorksheetQuestion id="punc-a-5" number={5} multiline
            question='The number of students, using online platforms increased significantly last year.'
            modelAnswer='The number of students using online platforms increased significantly last year. (Do not place a comma between a subject and its verb. "Using online platforms" is a participial phrase modifying "students", not a parenthetical that requires commas.)'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Choose the correct punctuation"
          instruction="Select the correctly punctuated sentence, then click Check answer."
        >
          <WorksheetQuestion id="punc-b-1" number={1}
            question='Which sentence uses a comma correctly after a linking word?'
            choices={["However, this solution may be too costly.", "However this solution may be too costly.", "This solution, however may be too costly.", "This solution however, may be too costly."]}
            accepted={["However, this solution may be too costly."]}
            modelAnswer='"However, this solution may be too costly." — When a linking word appears at the start of a sentence, a comma must follow it. When it appears mid-sentence, it needs commas on both sides: "This solution, however, may be too costly."'
          />
          <WorksheetQuestion id="punc-b-2" number={2}
            question='Which option correctly joins these two ideas: "Traffic is a serious problem" + "many people are late every day"?'
            choices={["Traffic is a serious problem; many people are late every day.", "Traffic is a serious problem, many people are late every day.", "Traffic is a serious problem, and; many people are late.", "Traffic is a serious problem. And many people are late every day."]}
            accepted={["Traffic is a serious problem; many people are late every day."]}
            modelAnswer='A semicolon correctly joins two closely related independent clauses without a conjunction. Option B is a comma splice. Option C has incorrect mixed punctuation. Option D begins a sentence with "And", which is informal.'
          />
          <WorksheetQuestion id="punc-b-3" number={3}
            question='Which sentence correctly uses a colon?'
            choices={["There is one clear solution: more investment in public transport.", "Governments should focus on: education and healthcare.", "The reason: is that costs are too high.", "Public transport: is the solution."]}
            accepted={["There is one clear solution: more investment in public transport."]}
            modelAnswer='A colon must follow a complete independent clause ("There is one clear solution" is complete). The colon then introduces the explanation. In Options B, C, and D, the colon incorrectly breaks the sentence structure mid-clause.'
          />
          <WorksheetQuestion id="punc-b-4" number={4}
            question='Which sentence correctly uses a dash?'
            choices={["The results were clear — the policy had failed.", "The results — were clear the policy had failed.", "The results were — clear the policy had failed.", "The — results were clear the policy had failed."]}
            accepted={["The results were clear — the policy had failed."]}
            modelAnswer='"The results were clear — the policy had failed." — The dash joins two related independent clauses with a strong pause, similar to a semicolon. A complete clause must appear before the dash.'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write original sentences using the punctuation mark shown. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="punc-c-1" number={1} multiline
            question="Write a sentence that lists at least three items. Use a colon to introduce the list and commas to separate the items."
            modelAnswer='Example: "Developing nations face several overlapping challenges: poverty, inadequate infrastructure, and limited access to quality education." (Colon after a complete clause; commas between three or more list items.)'
          />
          <WorksheetQuestion id="punc-c-2" number={2} multiline
            question="Write a sentence using a semicolon to join two closely related independent clauses (no conjunction needed)."
            modelAnswer='Example: "Air pollution is a growing concern in many cities; governments must act now to reduce harmful emissions." (Both sides are complete sentences closely linked in meaning — ideal for a semicolon.)'
          />
          <WorksheetQuestion id="punc-c-3" number={3} multiline
            question="Write a sentence using a dash to add extra information or emphasis. Make sure the main clause is complete before the dash."
            modelAnswer='Example: "Indonesia faces a unique urban challenge — a capital city that is gradually sinking into the sea." (Complete independent clause before the dash, then the explanation or extra detail after.)'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}

export function TopicPunctuationWorksheet2() {
  return (
    <WorksheetContainer topicName="Punctuation — Worksheet 2">

        <WorksheetBlock
          title="Part A — Identify and correct the punctuation error(s)"
          instruction="Each sentence contains one or more punctuation errors. Rewrite the fully corrected version, then click Check answer."
        >
          <WorksheetQuestion id="punc2-a-1" number={1} multiline
            question='The government introduced three new initiatives education healthcare and housing however none of them received adequate long-term funding.'
            modelAnswer='"The government introduced three new initiatives: education, healthcare, and housing; however, none of them received adequate long-term funding." [Colon introduces the list after a complete clause; commas separate list items; semicolon + comma frame "however" between two independent clauses.]'
          />
          <WorksheetQuestion id="punc2-a-2" number={2} multiline
            question='The study which was conducted over five years found strong evidence linking levels of air pollution to increased rates of respiratory disease.'
            modelAnswer='"The study, which was conducted over five years, found strong evidence linking levels of air pollution to increased rates of respiratory disease." [Non-defining relative clause: commas required on both sides. Without the commas, "which was conducted over five years" reads as a defining clause, implying there are other studies not conducted over five years.]'
          />
          <WorksheetQuestion id="punc2-a-3" number={3} multiline
            question='Therefore the researchers concluded, that further investigation was necessary before any policy changes could be responsibly recommended.'
            modelAnswer='"Therefore, the researchers concluded that further investigation was necessary before any policy changes could be responsibly recommended." [Comma after "Therefore" (sentence adverb); no comma before "that" (it introduces a complement clause, not a non-essential phrase).]'
          />
          <WorksheetQuestion id="punc2-a-4" number={4} multiline
            question='The new law — introduced after years of public debate has received mixed reviews from both industry groups and consumer advocates.'
            modelAnswer='"The new law — introduced after years of public debate — has received mixed reviews from both industry groups and consumer advocates." [The parenthetical phrase "introduced after years of public debate" must be closed with a second dash before the main verb "has received".]'
          />
          <WorksheetQuestion id="punc2-a-5" number={5} multiline
            question='Scientists agree that the solution requires: international cooperation sustained investment and political will from governments at every level.'
            modelAnswer='"Scientists agree that the solution requires international cooperation, sustained investment, and political will from governments at every level." [Remove the colon — it incorrectly interrupts "requires" + its objects. A colon must follow a grammatically complete clause. Add commas to separate the three items in the list.]'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Choose the correctly punctuated sentence"
          instruction="Select the sentence with correct punctuation, then click Check answer."
        >
          <WorksheetQuestion id="punc2-b-1" number={1}
            question='Which sentence uses dashes as a parenthetical interruptor correctly?'
            choices={["The findings — which challenged existing theory — prompted widespread debate among scholars.", "The findings — which challenged existing theory prompted widespread debate among scholars.", "The findings, which challenged existing theory — prompted widespread debate among scholars.", "The findings — which challenged existing theory, prompted widespread debate among scholars."]}
            accepted={["The findings — which challenged existing theory — prompted widespread debate among scholars."]}
            modelAnswer={'A parenthetical interruptor must be enclosed with a dash on BOTH sides. The sentence must read correctly if the dashed phrase is removed: "The findings prompted widespread debate among scholars." Options B, C, and D are missing or misplacing the closing dash.'}
          />
          <WorksheetQuestion id="punc2-b-2" number={2}
            question='Which sentence correctly uses a colon?'
            choices={["The researcher concluded: that more data was needed.", "Three issues were identified: funding, staffing, and access.", "The main obstacle is: a lack of political will.", "Scientists have shown: that pollution is linked to disease."]}
            accepted={["Three issues were identified: funding, staffing, and access."]}
            modelAnswer={'A colon must follow a grammatically complete independent clause. "Three issues were identified" is a complete sentence. The other options all have colons interrupting the sentence structure mid-clause (after "concluded", "is", and "shown"), which is incorrect.'}
          />
          <WorksheetQuestion id="punc2-b-3" number={3}
            question='Which sentence handles "however" with correct punctuation?'
            choices={["The results were promising, however the sample size was too small.", "The results were promising however the sample size was too small.", "The results were promising; however, the sample size was too small.", "The results were promising; however the sample size was too small."]}
            accepted={["The results were promising; however, the sample size was too small."]}
            modelAnswer={'"However" is an adverb, not a conjunction. It cannot join two independent clauses with only a comma (comma splice). Correct structure: semicolon before "however" (joining the clauses) + comma after "however" (separating it from the rest of the clause).'}
          />
          <WorksheetQuestion id="punc2-b-4" number={4}
            question='Which sentence uses a semicolon correctly?'
            choices={["The data was clear; and the policy needed to change.", "The data was clear; the policy needed to change.", "The data; was clear and the policy needed to change.", "The data was; clear and the policy needed to change."]}
            accepted={["The data was clear; the policy needed to change."]}
            modelAnswer={'A semicolon joins two complete, closely related independent clauses without a conjunction. "The data was clear" and "the policy needed to change" are both complete sentences. Never place a semicolon before "and", "but", or "so", or in the middle of a clause.'}
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write sentences using the punctuation mark shown. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="punc2-c-1" number={1} multiline
            question="Write a sentence with a parenthetical interruptor using dashes. The main clause must remain complete and grammatically correct if the dashed phrase is removed."
            modelAnswer={`"The government's new infrastructure plan — designed to address decades of underinvestment in public transport — has been broadly welcomed by business leaders and commuters alike." [Remove the dashed phrase: "The government's new infrastructure plan has been broadly welcomed by business leaders and commuters alike." ✓]`}
          />
          <WorksheetQuestion id="punc2-c-2" number={2} multiline
            question="Write a sentence using a colon to introduce an explanation or elaboration. Make sure the clause before the colon is grammatically complete."
            modelAnswer='"The consequences of inaction are clear: rising sea levels, more frequent extreme weather events, and the irreversible loss of biodiversity across the planet." ["The consequences of inaction are clear" is a complete clause. The colon then introduces the elaboration.]'
          />
          <WorksheetQuestion id="punc2-c-3" number={3} multiline
            question="Write a short paragraph of 2–3 sentences that uses each of the following correctly: a comma, a semicolon, a colon, and a dash."
            modelAnswer='"Addressing climate change requires action at multiple levels: local, national, and international. [colon] Individuals can reduce their carbon footprint through small daily choices; however, systemic change is far more impactful. [semicolon] The real obstacle — political short-termism — must be overcome if any meaningful progress is to be made. [dash] Commas appear throughout to separate clauses and list items."'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}
