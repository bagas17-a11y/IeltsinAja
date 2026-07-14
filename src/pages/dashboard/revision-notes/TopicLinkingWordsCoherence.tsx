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
  WorksheetContainer,
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
    </div>
  );
}

export function TopicLinkingWordsCoherenceWorksheet1() {
  return (
    <WorksheetContainer topicName="Linking Words & Conjunctions">

        <WorksheetBlock
          title="Part A — Join the sentences using the conjunction shown"
          instruction="Rewrite the two sentences as one, using the conjunction given. Pay attention to comma placement."
        >
          <WorksheetQuestion id="lw-a-1" number={1} multiline
            question='Join with "and": "Public transport is cheap." + "It helps reduce traffic."'
            modelAnswer='"Public transport is cheap, and it helps reduce traffic." — Comma before "and" when joining two independent clauses.'
          />
          <WorksheetQuestion id="lw-a-2" number={2} multiline
            question='Join with "whereas": "Some students prefer online learning." + "Others focus better in a classroom."'
            modelAnswer='"Some students prefer online learning, whereas others focus better in a classroom." — Comma before "whereas" mid-sentence.'
          />
          <WorksheetQuestion id="lw-a-3" number={3} multiline
            question='Join with "although" (start with "Although"): "She studied hard." + "She did not pass the exam."'
            modelAnswer='"Although she studied hard, she did not pass the exam." — Comma after the dependent clause when "although" starts the sentence.'
          />
          <WorksheetQuestion id="lw-a-4" number={4} multiline
            question='Join with "so": "The city invested in clean energy." + "Air quality improved."'
            modelAnswer='"The city invested in clean energy, so air quality improved." — Comma before "so" when joining two independent clauses.'
          />
          <WorksheetQuestion id="lw-a-5" number={5} multiline
            question='Join with "but": "The policy was expensive." + "It produced excellent results."'
            modelAnswer='"The policy was expensive, but it produced excellent results." — Comma before "but" when joining two independent clauses showing contrast.'
          />
          <WorksheetQuestion id="lw-a-6" number={6} multiline
            question='Join with "because" (start with "Because"): "He missed the bus." + "He arrived late to work."'
            modelAnswer='"Because he missed the bus, he arrived late to work." — Comma after the dependent clause when "because" starts the sentence.'
          />
          <WorksheetQuestion id="lw-a-7" number={7} multiline
            question='Join with "nor": "The team did not prepare well." + "The team did not perform well."'
            modelAnswer='"The team did not prepare well, nor did they perform well." — Invert subject and auxiliary after "nor". Comma before "nor".'
          />
          <WorksheetQuestion id="lw-a-8" number={8} multiline
            question='Join with "unless": "You submit the form." + "Your application will not be processed."'
            modelAnswer='"Your application will not be processed unless you submit the form." — No comma needed when "unless" comes in the middle of the sentence.'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Find and fix the conjunction error"
          instruction="Each sentence has one error (wrong conjunction, duplicate conjunctions, or punctuation). Rewrite the corrected sentence."
        >
          <WorksheetQuestion id="lw-b-1" number={1} multiline
            question='"She loves travelling, but however, she rarely has time."'
            modelAnswer='"She loves travelling; however, she rarely has time." OR "She loves travelling, but she rarely has time." — "but" and "however" cannot be used together; they both show contrast.'
          />
          <WorksheetQuestion id="lw-b-2" number={2} multiline
            question='"Although the report was long but it was very clear."'
            modelAnswer='"Although the report was long, it was very clear." — Remove "but". "Although" already expresses contrast; adding "but" creates a double conjunction error.'
          />
          <WorksheetQuestion id="lw-b-3" number={3} multiline
            question='"I forgot my keys so, I had to call home."'
            modelAnswer='"I forgot my keys, so I had to call home." — The comma goes before "so", not after it.'
          />
          <WorksheetQuestion id="lw-b-4" number={4} multiline
            question='"Because of she was tired, she went home early."'
            modelAnswer='"Because she was tired, she went home early." — "Because" is followed by a clause (subject + verb). "Because of" is followed by a noun/noun phrase only.'
          />
          <WorksheetQuestion id="lw-b-5" number={5} multiline
            question='"Despite he worked hard, he did not get promoted."'
            modelAnswer='"Despite working hard, he did not get promoted." OR "Although he worked hard, he did not get promoted." — "Despite" is followed by a noun or gerund (-ing), not a subject + verb clause.'
          />
          <WorksheetQuestion id="lw-b-6" number={6} multiline
            question='"The government introduced new taxes, yet so the deficit remained high."'
            modelAnswer='"The government introduced new taxes, yet the deficit remained high." — Remove "so". "Yet" and "so" cannot be used together; they express different relationships (contrast vs. result).'
          />
          <WorksheetQuestion id="lw-b-7" number={7} multiline
            question='"While she prefers tea but her husband prefers coffee."'
            modelAnswer='"While she prefers tea, her husband prefers coffee." — Remove "but". "While" already expresses contrast. Comma after the dependent clause.'
          />
          <WorksheetQuestion id="lw-b-8" number={8} multiline
            question='"He studied every night since two weeks, and he finally passed the exam."'
            modelAnswer='"He studied every night for two weeks, and he finally passed the exam." — Use "for" (duration of time), not "since" (a point in time). "Since" requires a specific starting point: "since Monday".'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}

export function TopicLinkingWordsCoherenceWorksheet2() {
  return (
    <WorksheetContainer topicName="Linking Words, Referencing & Coherence — Worksheet 2">

        <WorksheetBlock
          title="Part A — Find and fix the error"
          instruction="Each sentence contains a linking word or referencing error. Rewrite the corrected version, then click Check answer."
        >
          <WorksheetQuestion id="lw2-a-1" number={1} multiline
            question='The results were positive, despite the funding was insufficient for the full scope of the project.'
            modelAnswer='"The results were positive, despite the insufficient funding for the full scope of the project." OR "The results were positive, despite the fact that the funding was insufficient." OR "The results were positive, although the funding was insufficient." ("Despite" must be followed by a noun/gerund — not a subject + verb clause. Use "despite the fact that" or switch to "although" if you need a clause.)'
          />
          <WorksheetQuestion id="lw2-a-2" number={2} multiline
            question='The study revealed several important findings; in addition, the methodology had significant flaws that undermined the conclusions.'
            modelAnswer='"The study revealed several important findings; however, the methodology had significant flaws that undermined the conclusions." ("In addition" signals that you are adding more of the same — but "having significant flaws" contradicts "important findings". "However" correctly signals the contrast.)'
          />
          <WorksheetQuestion id="lw2-a-3" number={3} multiline
            question='She worked diligently for three months in order to she could qualify for the highly competitive scholarship.'
            modelAnswer='"She worked diligently for three months in order to qualify for the highly competitive scholarship." ("In order to" is followed directly by a base verb — not subject + modal. Remove "she could".)'
          />
          <WorksheetQuestion id="lw2-a-4" number={4} multiline
            question='The government introduced stricter environmental laws. On the other hand, air quality improved significantly within two years.'
            modelAnswer='"The government introduced stricter environmental laws. As a result, air quality improved significantly within two years." OR "...Consequently, air quality improved..." ("On the other hand" signals contrast, but improved air quality is a positive result of the new laws — not a contrasting fact. Use a result linker.)'
          />
          <WorksheetQuestion id="lw2-a-5" number={5} multiline
            question='She excelled in all four IELTS modules, due to she had practised consistently throughout the entire academic year.'
            modelAnswer='"She excelled in all four IELTS modules due to her consistent practice throughout the entire academic year." OR "...because she had practised consistently..." ("Due to" must be followed by a noun/noun phrase — not a clause. Use "due to + noun" or "because + clause".)'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Choose the correct linking word"
          instruction="Select the best option, then click Check answer."
        >
          <WorksheetQuestion id="lw2-b-1" number={1}
            question='"The proposal has faced significant opposition from industry groups. ___, many analysts believe it represents the only viable long-term solution."'
            choices={["Furthermore", "Nevertheless", "As a result", "Similarly"]}
            accepted={["Nevertheless"]}
            modelAnswer={'"Nevertheless" — shows that despite the opposition (stated in the first sentence), the proposal is still seen as viable. It signals an unexpected or contrasting continuation. "Furthermore" adds, "As a result" shows consequence, "Similarly" compares.'}
          />
          <WorksheetQuestion id="lw2-b-2" number={2}
            question='"We must act immediately. ___ inaction will lead to consequences that cannot be reversed."'
            choices={["Although", "For instance", "Otherwise", "Similarly"]}
            accepted={["Otherwise"]}
            modelAnswer={'"Otherwise" — signals a conditional negative consequence: "if we do not act immediately, then inaction will lead to irreversible consequences." It is the only option that logically connects the call to action with its failure case.'}
          />
          <WorksheetQuestion id="lw2-b-3" number={3}
            question='Which sentence uses referencing correctly to maintain cohesion?'
            choices={["The government announced reforms. They changed society significantly.", "Urbanisation has accelerated globally. This phenomenon is now studied by urban planners worldwide.", "The scientists found new data. This are changing how we understand the issue.", "Climate change is a serious threat. They require urgent international action."]}
            accepted={["Urbanisation has accelerated globally. This phenomenon is now studied by urban planners worldwide."]}
            modelAnswer={'"This phenomenon" clearly identifies what "this" refers to (the global acceleration of urbanisation). "They changed society" — who is "they"? "This are" has SVA error. "They require" — climate change is singular, not plural.'}
          />
          <WorksheetQuestion id="lw2-b-4" number={4}
            question='"___ technological unemployment is a serious concern, history suggests that new industries have always created replacement jobs."'
            choices={["Although", "Furthermore", "Consequently", "Due to"]}
            accepted={["Although"]}
            modelAnswer={'"Although" — introduces a concession (acknowledging the concern) before the main contrasting claim (that new jobs are always created). It is a subordinating conjunction and takes a full clause. "Due to" requires a noun phrase; "Furthermore" adds information; "Consequently" shows result.'}
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write sentences or a short paragraph using the structure shown. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="lw2-c-1" number={1} multiline
            question="Write a 3-sentence academic paragraph using: (1) one coordinating conjunction, (2) one subordinating conjunction, and (3) one referencing device (e.g., this, these, it, such). The paragraph should flow logically."
            modelAnswer='"Many countries have invested heavily in renewable energy, yet the transition away from fossil fuels remains frustratingly slow. Although public support for clean energy is growing, powerful economic interests continue to delay meaningful policy change. This tension between public demand and political will represents one of the defining challenges of the coming decades." [Coordinating: "yet" | Subordinating: "Although" | Referencing: "This tension"]'
          />
          <WorksheetQuestion id="lw2-c-2" number={2} multiline
            question='Express the same idea twice — once using "despite" + noun phrase, and once using "although" + clause: "Many nations pledged to cut emissions. Carbon output has continued to rise."'
            modelAnswer='"Despite pledging to cut emissions, many nations have seen their carbon output continue to rise. / Although many nations pledged to cut emissions, their carbon output has continued to rise." ["Despite" + gerund phrase (no subject + verb) vs "Although" + subject + verb — same meaning, different grammatical structure.]'
          />
          <WorksheetQuestion id="lw2-c-3" number={3} multiline
            question='Write a sentence linking cause and effect using a formal academic phrase such as "as a consequence of", "which has resulted in", "thereby", or "consequently".'
            modelAnswer='"The rapid expansion of digital platforms has fundamentally transformed the media landscape, consequently reducing the influence of traditional print journalism and reshaping how public opinion is formed." [Formal cause-effect linker "consequently" + participial phrase to show the result.]'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}
