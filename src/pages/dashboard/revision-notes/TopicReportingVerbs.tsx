import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  MistakeRow,
  WorksheetContainer,
  WorksheetBlock,
  WorksheetQuestion,
} from "./RevisionNoteContent";

export function TopicReportingVerbs() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What are reporting verbs?" />
      <DefinitionCard>
        <p className="mb-3">Reporting verbs show what people think, say, or believe: <strong className="text-white">say, think, believe, claim, suggest, argue, report, expect</strong>.</p>
        <p className="mb-3">In IELTS, they help you present opinions in a more formal and objective way.</p>
        <WorkedExample><>&quot;Many experts <strong>argue</strong> that public transport should be free.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Some people <strong>claim</strong> that online learning is less effective.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={2} title="Simple reporting structures" />
      <DefinitionCard>
        <p className="mb-3">Patterns: <strong>People say that…</strong> / <strong>Experts believe that…</strong> / <strong>Research suggests that…</strong></p>
        <p className="mb-3">Use these in introductions and body paragraphs.</p>
        <WorkedExample><>&quot;<strong>Research suggests that</strong> regular exercise improves mental health.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>Many people believe that</strong> university education should be free.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="Passive reporting structures – &quot;It is said that…&quot; etc." />
      <DefinitionCard>
        <SubSectionTitle title="Form: It + passive reporting verb + that-clause" />
        <KeyList
          items={[
            "It is said that…",
            "It is believed that…",
            "It has been suggested that…",
          ]}
        />
        <p className="mb-3 mt-3">Used when the action or idea is more important than who said it, or when the source is general or unknown.</p>
        <WorkedExample><>&quot;<strong>It is believed that</strong> technology will create new types of jobs.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>It has been reported that</strong> pollution levels are rising in many cities.&quot;</></WorkedExample>
        <SubSectionTitle title="Alternative pattern" />
        <p className="mb-2">Noun phrase + be + past participle + to + infinitive</p>
        <WorkedExample><>&quot;Young people <strong>are thought to</strong> spend too much time online.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={4} title="Why passive reporting is useful for IELTS" />
      <DefinitionCard>
        <p className="mb-3">Adds formality and distance. Helps you avoid phrases like &quot;I think&quot; or &quot;many people think&quot; in every sentence.</p>
        <SubSectionTitle title="Comparison" />
        <p className="text-slate-400 mb-1">Informal:</p>
        <WorkedExample><>&quot;People say that fast food is unhealthy.&quot;</></WorkedExample>
        <p className="text-slate-400 mb-1 mt-2">More academic:</p>
        <WorkedExample><>&quot;<strong>It is widely accepted that</strong> fast food is unhealthy.&quot;</></WorkedExample>
        <SubSectionTitle title="Common errors" />
        <MistakeRow wrong="It is say that" correct="It is said that" />
        <MistakeRow wrong="is believed improve" correct="is believed to improve" />
      </DefinitionCard>

      <SectionTitle number={5} title="Mini practice (reporting verbs)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">1. Transform: &quot;People think that climate change is a serious threat.&quot; (Use passive reporting.)</p>
            <p className="mb-2">2. Choose the best verb: &quot;Some experts ______ that homework helps students learn.&quot; (say / argue / suggest / claim)</p>
            <p className="mb-2">3. Correct: &quot;It is believe that education reduces poverty.&quot;</p>
            <p className="mb-2">4. Transform: &quot;Experts expect that prices will rise.&quot; (Use passive form with &quot;to&quot;.)</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;It is thought that climate change is a serious threat.&quot; or &quot;Climate change is thought to be a serious threat.&quot;</>,
          <>&quot;suggest&quot; or &quot;argue&quot; — both fit. &quot;Suggest&quot; is cautious; &quot;argue&quot; is stronger.</>,
          <>&quot;It is believed that education reduces poverty.&quot; — passive: &quot;is&quot; + past participle &quot;believed&quot;.</>,
          <>&quot;Prices are expected to rise.&quot; — noun + be + past participle + to + infinitive.</>,
        ]}
      />
    </div>
  );
}

export function TopicReportingVerbsWorksheet2() {
  return (
    <WorksheetContainer topicName="Reporting Verbs &amp; Passive Reporting — Worksheet 2">

      <WorksheetBlock
        title="Part A — Identify and correct the error"
        instruction="Each sentence contains a reporting verb or passive reporting error. Rewrite the corrected version, then click Check answer."
      >
        <WorksheetQuestion id="rv2-a-1" number={1} multiline
          question={`It is say that climate change poses an existential threat to coastal cities around the world.`}
          modelAnswer={`"It is said that climate change poses an existential threat to coastal cities around the world." (Passive reporting structure: "It is + past participle + that". Use "said" — the past participle of "say" — not the base form "say".)`}
        />
        <WorksheetQuestion id="rv2-a-2" number={2} multiline
          question={`Many researchers argue that technology is believed benefit society in ways that are not yet fully understood.`}
          modelAnswer={`"Many researchers argue that technology is believed to benefit society in ways that are not yet fully understood." (The pattern "be + past participle + to + infinitive" requires "to": "is believed to benefit". Without "to", the structure is grammatically incomplete.)`}
        />
        <WorksheetQuestion id="rv2-a-3" number={3} multiline
          question={`Experts are said that the current global economic model is fundamentally unsustainable in the long term.`}
          modelAnswer={`"Experts are said to believe that the current global economic model is fundamentally unsustainable in the long term." OR "It is said that experts believe the current global economic model is fundamentally unsustainable." (The "noun + be + said + that" pattern is incorrect. Use either "It is said that experts believe..." or "Experts are said to believe...")`}
        />
        <WorksheetQuestion id="rv2-a-4" number={4} multiline
          question={`It has been reporting that air pollution levels have fallen by 15% since the introduction of the new transport regulations.`}
          modelAnswer={`"It has been reported that air pollution levels have fallen by 15% since the introduction of the new transport regulations." (Passive reporting: "has been + past participle". Use "reported" — the past participle — not "reporting" — the present participle.)`}
        />
        <WorksheetQuestion id="rv2-a-5" number={5} multiline
          question={`The new medication has been proven being effective in reducing symptoms in over 80% of clinical trial participants.`}
          modelAnswer={`"The new medication has been proven to be effective in reducing symptoms in over 80% of clinical trial participants." ("Proven + to be" — the pattern is "be + past participle + to + infinitive". Use "to be", not "being".)`}
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part B — Choose the correct option"
        instruction="Select the correct word or sentence, then click Check answer."
      >
        <WorksheetQuestion id="rv2-b-1" number={1}
          question={`Which sentence uses passive reporting correctly?`}
          choices={[
            "It is widely believe that early childhood education has lasting benefits.",
            "It is widely believed that early childhood education has lasting benefits.",
            "It is widely believing that early childhood education has lasting benefits.",
            "It widely believed that early childhood education has lasting benefits.",
          ]}
          accepted={["It is widely believed that early childhood education has lasting benefits."]}
          modelAnswer={`"It is widely believed that..." — passive reporting: "is" + past participle "believed". The adverb "widely" goes between the auxiliary and the participle. "Believe" (base form) and "believing" (present participle) cannot follow "is" in this passive pattern.`}
        />
        <WorksheetQuestion id="rv2-b-2" number={2}
          question={`"She ___ that early intervention was the most effective approach." Which reporting verb is most cautious and academic?`}
          choices={["claimed", "insisted", "suggested", "demanded"]}
          accepted={["suggested"]}
          modelAnswer={`"suggested" — the most cautious option. It presents the idea tentatively, without strong assertion. "Claimed" implies the view might be disputed; "insisted" implies pressure; "demanded" implies a requirement. In IELTS academic writing, hedged reporting verbs like "suggested" and "argued" are preferred.`}
        />
        <WorksheetQuestion id="rv2-b-3" number={3}
          question={`Which sentence correctly uses the "noun + be + past participle + to" structure?`}
          choices={[
            "Renewable energy is expected becoming more affordable within the next decade.",
            "Renewable energy is expected to become more affordable within the next decade.",
            "Renewable energy is expected that it will become more affordable within the next decade.",
            "Renewable energy expected to become more affordable within the next decade.",
          ]}
          accepted={["Renewable energy is expected to become more affordable within the next decade."]}
          modelAnswer={`"is expected to become" — the correct structure is: noun + be + past participle + to + base verb. "Becoming" (gerund) is incorrect here; "that it will" changes the structure entirely; the fourth option is missing the auxiliary "is".`}
        />
        <WorksheetQuestion id="rv2-b-4" number={4}
          question={`Which sentence is the most formal and appropriate for IELTS Task 2?`}
          choices={[
            "People say that social media is bad for teenagers.",
            "Many people think that social media harms teenagers.",
            "It is widely argued that excessive social media use has detrimental effects on adolescent mental health.",
            "Experts are saying social media can be harmful to young people.",
          ]}
          accepted={["It is widely argued that excessive social media use has detrimental effects on adolescent mental health."]}
          modelAnswer={`"It is widely argued that..." uses passive reporting to convey formality and academic distance. "People say" and "Many people think" are too informal. "Experts are saying" uses present continuous, which implies an ongoing conversation rather than an established viewpoint.`}
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part C — Write your own sentences"
        instruction="Write sentences using the structure shown. Click Check answer to compare with the model."
      >
        <WorksheetQuestion id="rv2-c-1" number={1} multiline
          question={`Transform: "Many economists believe that interest rates will fall next year." Use the passive reporting structure beginning "It is..."`}
          modelAnswer={`"It is believed by many economists that interest rates will fall next year." OR more naturally: "It is widely believed that interest rates will fall next year." [Passive reporting: "It is believed that..." removes the personal subject and creates academic distance.]`}
        />
        <WorksheetQuestion id="rv2-c-2" number={2} multiline
          question={`Rewrite using the "noun + be + past participle + to" structure: "People think that renewable energy will replace fossil fuels within 30 years."`}
          modelAnswer={`"Renewable energy is thought to replace fossil fuels within 30 years." OR "Renewable energy is predicted to replace fossil fuels within 30 years." [Structure: subject + is/are + past participle + to + base verb. The that-clause becomes a to-infinitive.]`}
        />
        <WorksheetQuestion id="rv2-c-3" number={3} multiline
          question={`Write one IELTS Task 2 sentence using a reporting verb other than "say" or "think" to attribute a view to researchers, experts, or studies.`}
          modelAnswer={`Example: "Numerous studies suggest that the long-term economic benefits of investing in early childhood education far outweigh the initial costs." [Reporting verb: "suggest" — cautious, academic, attributes to studies. Other strong options: "argue", "demonstrate", "indicate", "reveal", "contend".]`}
        />
      </WorksheetBlock>

    </WorksheetContainer>
  );
}
