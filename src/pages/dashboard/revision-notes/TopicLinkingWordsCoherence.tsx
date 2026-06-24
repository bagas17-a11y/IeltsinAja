import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  RevisionTable,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  WorksheetBlock,
  WorksheetQuestion,
} from "./RevisionNoteContent";

export function TopicLinkingWordsCoherence() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Coordinating Conjunctions" />
      <DefinitionCard>
        <p className="mb-3">Connecting words that join phrases or independent clauses that are <strong className="text-white">grammatically equal</strong>.</p>
        <KeyList
          items={[
            "They join two complete thoughts without making one depend on the other.",
            <>Punctuation Rule: When joining two independent clauses (complete sentences), always place a <strong className="text-white">comma before</strong> the coordinating conjunction.</>,
            <>Useful Acronym: <strong className="text-white">FANBOYS</strong> (For, And, Nor, But, Or, Yet, So)</>,
          ]}
        />
      </DefinitionCard>
      <RevisionTable
        headers={["Conjunction", "When to Use It", "Quick Example"]}
        rows={[
          ["For", "To show a reason or cause (similar to \"because\")", "We stayed inside, for it was storming."],
          ["And", "To add information or connect similar ideas", "She loves writing, and he loves reading."],
          ["Nor", "To present a second negative alternative", "They don't eat meat, nor do they eat dairy."],
          ["But", "To show contrast or an exception", "The shoes are pretty but uncomfortable."],
          ["Or", "To offer a choice between options", "You can have the soup or the salad."],
          ["Yet", "To introduce a surprising or contrasting fact", "It was freezing outside, yet she wore a t-shirt."],
          ["So", "To show a result or consequence", "I forgot my keys, so I had to call home."],
        ]}
      />

      <SectionTitle number={2} title="Subordinating Conjunctions" />
      <DefinitionCard>
        <p className="mb-3">Connecting words that introduce a <strong className="text-white">dependent clause</strong> (a fragment that cannot stand alone) and join it to an independent clause.</p>
        <KeyList
          items={[
            "Used to establish a relationship of time, cause, condition, or contrast, making one part of the sentence less important than the main part.",
            <>Punctuation Rules:
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>If the subordinating conjunction <strong className="text-white">starts</strong> the sentence, use a comma after the dependent clause.</li>
                <li>If it falls <strong className="text-white">in the middle</strong>, you generally do not need a comma.</li>
              </ul>
            </>,
            <>Examples: <em>Because, although, since, if, while, until, unless, though.</em></>,
          ]}
        />
      </DefinitionCard>
      <RevisionTable
        headers={["Conjunction", "When to Use It", "Quick Example"]}
        rows={[
          ["Because / Since", "To explain the cause or reason for something", "We paused the game because it started raining."],
          ["Although / Though", "To show a concession, contrast, or unexpected obstacle", "Although she practiced hard, she missed the shot."],
          ["If / Unless", "To state a condition required for something to happen", "You won't pass unless you study the notes."],
          ["While / As", "To show two actions happening at the same time", "I listened to music while I cleaned my room."],
          ["Until", "To indicate the point in time when an action stops", "Wait here until the bus arrives."],
          ["Before / After", "To establish a specific chronological order of events", "Wash your hands before you eat dinner."],
        ]}
      />

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
      <SectionTitle number={6} title="Worksheet — Conjunctions Practice" />

      <WorksheetBlock
        title="Part A — Join the sentences using the conjunction shown"
        instruction="Rewrite the two sentences as one, using the conjunction given. Pay attention to comma placement."
      >
        <WorksheetQuestion number={1}
          question='Join with "and": "Public transport is cheap." + "It helps reduce traffic."'
          modelAnswer='"Public transport is cheap, and it helps reduce traffic." — Comma before "and" when joining two independent clauses.'
          multiline
        />
        <WorksheetQuestion number={2}
          question='Join with "whereas": "Some students prefer online learning." + "Others focus better in a classroom."'
          modelAnswer='"Some students prefer online learning, whereas others focus better in a classroom." — Comma before "whereas" mid-sentence.'
          multiline
        />
        <WorksheetQuestion number={3}
          question='Join with "although" (start the sentence with "Although"): "She studied hard." + "She did not pass the exam."'
          modelAnswer='"Although she studied hard, she did not pass the exam." — Comma after the dependent clause when "although" starts the sentence.'
          multiline
        />
        <WorksheetQuestion number={4}
          question='Join with "so": "The city invested in clean energy." + "Air quality improved."'
          modelAnswer='"The city invested in clean energy, so air quality improved." — Comma before "so" when joining two independent clauses.'
          multiline
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part B — Find and fix the conjunction error"
        instruction="Each sentence has one error (wrong conjunction, duplicate words, or punctuation). Rewrite the corrected sentence."
      >
        <WorksheetQuestion number={1}
          question='"She loves travelling, but however, she rarely has time."'
          modelAnswer='"She loves travelling; however, she rarely has time." OR "She loves travelling, but she rarely has time." — "but" and "however" cannot be used together; they both show contrast.'
          multiline
        />
        <WorksheetQuestion number={2}
          question='"Although the report was long but it was very clear."'
          modelAnswer='"Although the report was long, it was very clear." — Remove "but". "Although" already expresses contrast; adding "but" creates a double conjunction error.'
          multiline
        />
        <WorksheetQuestion number={3}
          question='"I forgot my keys so, I had to call home."'
          modelAnswer='"I forgot my keys, so I had to call home." — The comma goes before "so", not after it.'
          multiline
        />
        <WorksheetQuestion number={4}
          question='"Because of she was tired, she went home early."'
          modelAnswer='"Because she was tired, she went home early." — "Because" is followed by a clause (subject + verb), not "because of" which is followed by a noun/noun phrase.'
          multiline
        />
      </WorksheetBlock>
    </div>
  );
}
