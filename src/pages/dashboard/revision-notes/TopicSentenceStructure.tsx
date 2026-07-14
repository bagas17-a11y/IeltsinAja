import { Link } from "react-router-dom";
import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  WorkedExample,
  MiniPractice,
  WorksheetContainer,
  WorksheetBlock,
  WorksheetQuestion,
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
          Passive voice is useful in IELTS Writing Task 1 (visual report) when the action is more important than the person or thing that does it, for example in process diagrams or reports.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Simple, compound, and basic complex sentences" />
      <DefinitionCard>
        <p className="mb-4">
          Using only simple sentences makes your writing clear but basic. For Band 7 and above, you should show a mix of simple, compound, and complex sentences.
        </p>
        <SubSectionTitle title="2.1 Simple sentences" />
        <p className="mb-2">One independent clause (one complete idea).</p>
        <WorkedExample><>&quot;Many students study abroad.&quot;</></WorkedExample>

        <SubSectionTitle title="2.2 Compound sentences" />
        <p className="mb-2">Two independent clauses joined with <strong className="text-white">and, but, so, or, yet, for</strong>.</p>
        <WorkedExample><>&quot;Many students study abroad, <strong>but</strong> studying overseas can be expensive.&quot;</></WorkedExample>
        <p className="text-sm text-slate-400 mt-2">Pattern: Clause 1 + , + coordinating conjunction + Clause 2</p>
        <Link
          to="?topic=linking-words-coherence"
          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
        >
          See: Coordinating Conjunctions &rarr;
        </Link>

        <SubSectionTitle title="2.3 Basic complex sentences" />
        <p className="mb-2">One main clause + one dependent clause introduced by <strong className="text-white">because, although, while, if, when, since</strong>, etc.</p>
        <WorkedExample><>&quot;<strong>Although</strong> studying abroad is expensive, many students believe it is worth the cost.&quot;</></WorkedExample>
        <WorkedExample><>&quot;People are healthier <strong>because</strong> they have better access to medical care.&quot;</></WorkedExample>
        <Link
          to="?topic=linking-words-coherence"
          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
        >
          See: Subordinating Conjunctions &rarr;
        </Link>
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

export function TopicSentenceStructureWorksheet1() {
  return (
    <WorksheetContainer topicName="Sentence Structure & Conjunctions">

        <WorksheetBlock
          title="Part A — Identify and correct the error"
          instruction="Each sentence contains a sentence structure or conjunction error. Rewrite the corrected version, then click Check answer."
        >
          <WorksheetQuestion id="ss-a-1" number={1} multiline
            question='Many people drive to work, it causes heavy traffic in most major cities.'
            modelAnswer='Many people drive to work, so it causes heavy traffic in most major cities. OR: Many people drive to work. It causes heavy traffic in most major cities. (Comma splice — two independent clauses cannot be joined with only a comma. Use a conjunction or a full stop.)'
          />
          <WorksheetQuestion id="ss-a-2" number={2} multiline
            question='Although many students study hard but they still struggle to achieve a high band score.'
            modelAnswer='Although many students study hard, they still struggle to achieve a high band score. OR: Many students study hard, but they still struggle to achieve a high band score. ("Although" and "but" cannot both be used in the same sentence — choose one subordinating or one coordinating conjunction.)'
          />
          <WorksheetQuestion id="ss-a-3" number={3} multiline
            question='Because the government invested heavily in education, so the literacy rate improved significantly.'
            modelAnswer='Because the government invested heavily in education, the literacy rate improved significantly. OR: The government invested heavily in education, so the literacy rate improved significantly. ("Because" and "so" both signal a cause-effect link — using both creates a redundant, incorrect structure.)'
          />
          <WorksheetQuestion id="ss-a-4" number={4} multiline
            question='The policy was introduced in 2015. And it reduced crime rates by 20% within three years.'
            modelAnswer='The policy was introduced in 2015, and it reduced crime rates by 20% within three years. (In formal academic writing, sentences should not begin with "And". Join the clauses with a comma + coordinating conjunction instead.)'
          />
          <WorksheetQuestion id="ss-a-5" number={5} multiline
            question='Taxes were increased by the government. The reason was to fund public services.'
            modelAnswer='The government increased taxes to fund public services. (Combine into one active sentence. A clear subject + purpose clause is more concise and shows better grammatical control.)'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Choose the correct conjunction or structure"
          instruction="Select the correct word or phrase to complete the sentence, then click Check answer."
        >
          <WorksheetQuestion id="ss-b-1" number={1}
            question='"Many students study abroad ___ they want access to better facilities." Which conjunction is correct?'
            choices={["because", "although", "however", "therefore"]}
            accepted={["because"]}
            modelAnswer='"because" — introduces a dependent clause explaining the reason. "Although" shows contrast; "however" and "therefore" are adverbs, not conjunctions, and cannot directly join two clauses without a full stop before them.'
          />
          <WorksheetQuestion id="ss-b-2" number={2}
            question='"Public transport is cheap ___ it is often crowded." Which conjunction best shows contrast?'
            choices={["but", "and", "so", "because"]}
            accepted={["but"]}
            modelAnswer='"but" — a coordinating conjunction showing contrast between two independent clauses. "And" adds information, "so" shows result, and "because" shows reason.'
          />
          <WorksheetQuestion id="ss-b-3" number={3}
            question='"The government launched a new policy. ___, it was not effective." Which transition is correct?'
            choices={["However", "Furthermore", "Therefore", "Similarly"]}
            accepted={["However"]}
            modelAnswer='"However" — signals a contrast between the policy being launched and it being ineffective. The others add (Furthermore), conclude (Therefore), or compare (Similarly) rather than contrast.'
          />
          <WorksheetQuestion id="ss-b-4" number={4}
            question='"_____ the cost is high, many families still prioritise education." Which word is correct?'
            choices={["Although", "Because", "So", "And"]}
            accepted={["Although"]}
            modelAnswer='"Although" — a subordinating conjunction showing concession. It introduces the dependent clause and goes at the start when the dependent clause comes first, followed by a comma before the main clause.'
          />
          <WorksheetQuestion id="ss-b-5" number={5}
            question='Which sentence correctly uses a semicolon?'
            choices={["Traffic is terrible; many people are late every day.", "Traffic is terrible; and many people are late.", "Traffic; is terrible many people are late.", "Traffic is terrible, many; people are late."]}
            accepted={["Traffic is terrible; many people are late every day."]}
            modelAnswer='A semicolon joins two closely related independent clauses without a conjunction. "Traffic is terrible" and "many people are late every day" are both complete sentences. Never place a semicolon before "and" or in the middle of a clause.'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write full sentences using the structure described. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="ss-c-1" number={1} multiline
            question="Write a compound sentence about technology or education using a coordinating conjunction (and, but, so, yet, or)."
            modelAnswer='Example: "Online education has become increasingly accessible, yet many students still prefer face-to-face learning for its social benefits." (Two independent clauses joined by "yet" showing contrast.)'
          />
          <WorksheetQuestion id="ss-c-2" number={2} multiline
            question="Write a complex sentence about urbanisation or the environment using a subordinating conjunction (although, because, while, when, since, or if)."
            modelAnswer='Example: "Although urbanisation has brought economic opportunities to many developing nations, it has also increased pressure on housing, transport, and natural resources." (Dependent clause with "Although" + main clause — complex sentence.)'
          />
          <WorksheetQuestion id="ss-c-3" number={3} multiline
            question='Combine these two simple sentences into one improved sentence: "Cities are growing rapidly. This is causing serious environmental problems."'
            modelAnswer='Example: "Cities are growing so rapidly that they are causing serious environmental problems." OR: "The rapid growth of cities is causing serious environmental problems." (Combine using a conjunction or by restructuring into a single clause.)'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}

export function TopicSentenceStructureWorksheet2() {
  return (
    <WorksheetContainer topicName="Sentence Structure & Conjunctions — Worksheet 2">

        <WorksheetBlock
          title="Part A — Identify and correct the error"
          instruction="Each sentence has a structural or conjunction error. Rewrite the corrected version, then click Check answer."
        >
          <WorksheetQuestion id="ss2-a-1" number={1} multiline
            question='Because of the government failed to act early, the crisis became far more severe than it needed to be.'
            modelAnswer={`"Because the government failed to act early, the crisis became far more severe than it needed to be." OR "Because of the government's failure to act early, the crisis became far more severe." ("Because of" must be followed by a noun/noun phrase. To use a full clause, use "because" alone.)`}
          />
          <WorksheetQuestion id="ss2-a-2" number={2} multiline
            question='The policy was effective; however but it proved too costly for most developing nations to adopt.'
            modelAnswer='"The policy was effective; however, it proved too costly for most developing nations to adopt." — Remove "but". "However" and "but" both show contrast and cannot be used together.'
          />
          <WorksheetQuestion id="ss2-a-3" number={3} multiline
            question='Whilst technological advancement has accelerated, but few governments have implemented meaningful policy responses.'
            modelAnswer='"Whilst technological advancement has accelerated, few governments have implemented meaningful policy responses." — Remove "but". "Whilst" (= although/while) already expresses contrast; adding "but" creates a double conjunction error.'
          />
          <WorksheetQuestion id="ss2-a-4" number={4} multiline
            question='The reason why inequality has widened is because of neoliberal policies have prioritised profit over social welfare.'
            modelAnswer='"The reason why inequality has widened is that neoliberal policies have prioritised profit over social welfare." ("The reason is because" is grammatically incorrect in formal writing. Use "the reason is that" + subject + verb. Also, "because of" requires a noun phrase, not a clause.)'
          />
          <WorksheetQuestion id="ss2-a-5" number={5} multiline
            question='There have been built many new schools across the region during this sustained period of government investment.'
            modelAnswer='"Many new schools have been built across the region during this sustained period of government investment." (In passive voice, the subject comes first. "There have been built" is incorrect word order — the passive subject "many new schools" must precede the verb.)'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Choose the correct structure"
          instruction="Select the correct or most appropriate option, then click Check answer."
        >
          <WorksheetQuestion id="ss2-b-1" number={1}
            question='Which sentence correctly uses "despite" followed by a noun phrase?'
            choices={["Despite it was expensive, the results justified the investment.", "Despite of the high cost, the results justified the investment.", "Despite the high cost, the results justified the investment.", "Despite being expensive cost, the results justified the investment."]}
            accepted={["Despite the high cost, the results justified the investment."]}
            modelAnswer={'"Despite" must be followed by a noun or noun phrase — not a clause. "Despite the high cost" is correct (noun phrase). "Despite it was expensive" uses a clause. "Despite of" does not exist. "Despite being expensive cost" is grammatically garbled.'}
          />
          <WorksheetQuestion id="ss2-b-2" number={2}
            question='Which sentence shows a grammatically correct contrast structure?'
            choices={["Although the evidence is compelling, however policymakers remain unconvinced.", "The evidence is compelling; although policymakers remain unconvinced.", "Although the evidence is compelling, policymakers remain unconvinced.", "Policymakers remain unconvinced, although however the evidence is compelling."]}
            accepted={["Although the evidence is compelling, policymakers remain unconvinced."]}
            modelAnswer={'"Although" is a subordinating conjunction introducing a dependent clause. It is followed by a comma, then the main clause. You cannot combine "although" with "however" in the same sentence.'}
          />
          <WorksheetQuestion id="ss2-b-3" number={3}
            question='Which sentence correctly uses passive voice?'
            choices={["The study was conducted by researchers over a three-year period.", "Researchers was conducted the study over a three-year period.", "The study conducted by researchers over a three-year period.", "Researchers have been conducted the study over three years."]}
            accepted={["The study was conducted by researchers over a three-year period."]}
            modelAnswer={'"The study was conducted by researchers over a three-year period." — Passive: was + past participle. The subject ("the study") receives the action. The other options have verb agreement errors, are missing the auxiliary, or incorrectly use passive with an active-voice agent structure.'}
          />
          <WorksheetQuestion id="ss2-b-4" number={4}
            question='Which sentence best demonstrates sophisticated sentence variety appropriate for IELTS Band 7+?'
            choices={["Technology is changing things a lot and it is very fast.", "Technology changes things and it is happening very quickly.", "Rapid advances in technology are transforming industries, creating both economic opportunities and social challenges that require careful policy responses.", "Technology is advancing rapidly and it is creating opportunities and challenges for everyone."]}
            accepted={["Rapid advances in technology are transforming industries, creating both economic opportunities and social challenges that require careful policy responses."]}
            modelAnswer={'This sentence demonstrates complex sentence structure: a noun phrase subject, present continuous verb, participial phrase ("creating..."), parallel structure ("both...and"), and an embedded relative clause ("that require..."). It shows the range of structures valued at Band 7+.'}
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write full sentences using the structure described. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="ss2-c-1" number={1} multiline
            question="Write a passive sentence describing a data trend or process that is appropriate for IELTS Task 1 (where the action is more important than who performed it)."
            modelAnswer='"Between 1990 and 2020, global average temperatures were estimated to have risen by approximately 0.5°C, a trend that has since been confirmed by multiple independent studies." [Passive: "were estimated" + passive infinitive "to have risen"; this focuses on the trend rather than the scientists doing the estimating.]'
          />
          <WorksheetQuestion id="ss2-c-2" number={2} multiline
            question='Combine these three ideas into one complex sentence using at least two different conjunctions or connectors: "Many young people cannot afford housing." + "Wages have stagnated." + "Living costs have risen sharply."'
            modelAnswer='"Because wages have stagnated while living costs have risen sharply, many young people find themselves unable to afford adequate housing, despite working full-time." [Uses "because" (cause), "while" (simultaneous contrast), and "despite" (concession) — three different connectors.]'
          />
          <WorksheetQuestion id="ss2-c-3" number={3} multiline
            question='Write one sentence using "despite" + noun phrase, then write the same idea using "although" + clause. Both should express the same concession.'
            modelAnswer='"Despite significant investment in renewable energy, global carbon emissions have continued to rise. / Although governments have invested significantly in renewable energy, global carbon emissions have continued to rise." ["Despite" + noun phrase vs "Although" + subject + verb — same meaning, different grammatical structure]'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}
