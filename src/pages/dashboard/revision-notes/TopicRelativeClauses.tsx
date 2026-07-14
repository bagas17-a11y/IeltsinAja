import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  RevisionTable,
  WorksheetContainer,
  WorksheetBlock,
  WorksheetQuestion,
} from "./RevisionNoteContent";

export function TopicRelativeClauses() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What are relative clauses?" />
      <DefinitionCard>
        <p className="mb-3">A relative clause gives extra information about a noun. It starts with a relative word: <strong className="text-white">who</strong>, <strong className="text-white">which</strong>, <strong className="text-white">that</strong>, <strong className="text-white">whose</strong>, <strong className="text-white">where</strong>, <strong className="text-white">when</strong>.</p>
        <p className="mb-3">It helps you combine ideas instead of using two short sentences. This makes your writing more natural and shows a wider range of grammar — which helps your IELTS band score.</p>
        <SubSectionTitle title="Before (two sentences)" />
        <WorkedExample><>&quot;Many students study abroad. They want better facilities.&quot;</></WorkedExample>
        <SubSectionTitle title="After (with relative clause)" />
        <WorkedExample><>&quot;Many students <strong>who want better facilities</strong> study abroad.&quot;</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        Using relative clauses correctly is a way to show complex sentences in Writing and Speaking. Examiners look for a mix of simple and complex structures. One or two well-placed relative clauses can improve your Grammatical Range and Accuracy score.
      </ExaminerTip>

      <SectionTitle number={2} title="Defining relative clauses" />
      <DefinitionCard>
        <p className="mb-3">Defining clauses give <strong className="text-white">essential</strong> information. Without them, the reader cannot tell which person or thing you mean. Usually there are <strong className="text-white">no commas</strong>.</p>
        <p className="mb-2 text-sm text-slate-300">What counts as essential? Information that limits or identifies the noun — e.g. which specific students, which specific city.</p>
        <p className="mb-2 font-semibold text-slate-200">Essential sentences:</p>
        <KeyList
          items={[
            <>&quot;Students <strong>who study regularly</strong> often get higher scores.&quot; (identifies which type of students)</>,
            <>&quot;The city <strong>that I live in</strong> has very heavy traffic.&quot; (identifies which city)</>,
          ]}
        />
        <p className="mb-2 mt-3 font-semibold text-slate-200">Non-essential sentences:</p>
        <KeyList
          items={[
            <>&quot;The students, <strong>who study regularly</strong>, often get higher scores.&quot; (adds extra info about all students, sentence still makes sense without the clause)</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="Subject position" />
      <DefinitionCard>
        <p className="mb-2">The relative pronoun is the subject of the clause.</p>
        <WorkedExample><>&quot;The teacher <strong>who teaches us IELTS</strong> is very experienced.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Object position (you can omit &quot;that&quot;)" />
      <DefinitionCard>
        <p className="mb-2">When the relative pronoun is the object, you can leave out &quot;that&quot;.</p>
        <WorkedExample><>&quot;The course <strong>(that)</strong> I took was very helpful.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="Non-defining relative clauses" />
      <DefinitionCard>
        <p className="mb-3">Non-defining clauses add extra information only — they don&apos;t identify which person or thing. We use <strong className="text-white">commas</strong> around them.</p>
        <p className="mb-2 text-sm text-slate-300">What counts as non‑essential? Information that describes but doesn&apos;t narrow down which one — e.g. extra facts about someone or something already identified.</p>
        <WorkedExample><>&quot;My brother, <strong>who lives in Australia</strong>, is preparing for IELTS.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Public transport, <strong>which is often crowded</strong>, is still cheaper than driving.&quot;</></WorkedExample>
        <p className="mt-3 text-sm text-slate-300"><strong className="text-white">We cannot use &quot;that&quot; in non-defining clauses.</strong> Use <em>who</em>, <em>which</em>, <em>whose</em>, <em>where</em>, or <em>when</em> instead.</p>
      </DefinitionCard>
      <ExaminerTip>
        Do not over-use long, non-defining clauses. One or two per essay is enough. Too many can make your writing hard to follow.
      </ExaminerTip>

      <SectionTitle number={4} title="Relative pronouns and where / when / why" />
      <RevisionTable
        headers={["Word", "Use"]}
        rows={[
          ["who", "People (subject)"],
          ["whom", "People (object, more formal)"],
          ["whose", "Possession"],
          ["that", "People or things (defining only)"],
          ["which", "Things"],
          ["where", "Places"],
          ["when", "Times"],
          ["why", "Reasons"],
        ]}
      />

      <SubSectionTitle title="Who vs whom vs whose vs that vs which vs where vs when vs why" />
      <DefinitionCard>
        <p className="mb-2 font-semibold text-slate-200">who — subject of the clause:</p>
        <WorkedExample><>&quot;He <strong>who</strong> spoke first got the highest mark.&quot; — Subject: does the action (he/she/they/&quot;the person&quot;)</>
        </WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">whom — object (formal):</p>
        <WorkedExample><>&quot;The person to <strong>whom</strong> I spoke was very helpful.&quot; — Object: receives the action (him/her/them/follows a preposition like &quot;to&quot;, &quot;with&quot;, &quot;for&quot;)</>
        </WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">whose — possessive:</p>
        <WorkedExample><>&quot;The student <strong>whose</strong> essay won the prize is from Indonesia.&quot;</>
        </WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">that — people or things (defining only):</p>
        <KeyList
          items={[
            <>People: &quot;The man <strong>that</strong> I saw yesterday left.&quot;</>,
            <>Things: &quot;The city <strong>that</strong> I visited is beautiful.&quot;</>,
          ]}
        />
        <p className="mb-2 mt-4 font-semibold text-slate-200">which — things (defining and non-defining) and reasoning:</p>
        <KeyList
          items={[
            <>Defining: &quot;The laptop <strong>which</strong> I bought last year broke.&quot;</>,
            <>Non-defining: &quot;My laptop, <strong>which</strong> I bought last year, broke.&quot;</>,
            <>Reasoning: &quot;I missed the bus, <strong>which</strong> made me late.&quot;</>,
          ]}
        />
        <p className="mb-2 mt-4 font-semibold text-slate-200">where — places:</p>
        <WorkedExample><>&quot;The university <strong>where</strong> I study has a large library.&quot;</>
        </WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">when — times:</p>
        <WorkedExample><>&quot;The day <strong>when</strong> the exam results came out was stressful.&quot;</>
        </WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">why — reasons (formal):</p>
        <WorkedExample><>&quot;The reason <strong>why</strong> I applied was the scholarship.&quot;</>
        </WorkedExample>
      </DefinitionCard>

      <SectionTitle number={5} title="IELTS tips and mini-practice" />
      <SubSectionTitle title="Common mistakes to avoid" />
      <DefinitionCard>
        <KeyList
          items={[
            <>Do not repeat the noun inside the clause. Wrong: &quot;the city that the city is large&quot; → correct: &quot;the city that is large&quot;</>,
            <>Keep the clause immediately after the noun it describes. Avoid splitting them with other words.</>,
          ]}
        />
      </DefinitionCard>
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-300">
              <li>
                <span className="text-slate-200">Join the two sentences with a relative clause:</span>
                <p className="mt-1 italic">&quot;The university is famous. I graduated from it last year.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Add commas if needed:</span>
                <p className="mt-1 italic">&quot;Jakarta which is the capital of Indonesia has very bad traffic.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Correct the mistake:</span>
                <p className="mt-1 italic">&quot;The country that the country I want to study in is Australia.&quot;</p>
              </li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;The university (that) I graduated from last year is famous.&quot;</>,
          <>&quot;Jakarta, which is the capital of Indonesia, has very bad traffic.&quot; (commas needed — non-defining)</>,
          <>&quot;The country that I want to study in is Australia.&quot; (remove the repeated &quot;the country&quot;)</>,
        ]}
      />
      <SectionTitle number={6} title="Worksheet 1 — Relative Clauses Practice" />
      <WorksheetContainer topicName="Relative Clauses">

        <WorksheetBlock
          title="Part A — Identify and correct the error"
          instruction="Each sentence contains a relative clause error. Rewrite the corrected sentence, then click Check answer."
        >
          <WorksheetQuestion id="rc-a-1" number={1} multiline
            question='The country that the country has the highest GDP per capita is Luxembourg.'
            modelAnswer='The country that has the highest GDP per capita is Luxembourg. (Remove the repeated subject "the country" inside the relative clause — the relative pronoun "that" already serves as the subject.)'
          />
          <WorksheetQuestion id="rc-a-2" number={2} multiline
            question='My sister, that lives in Singapore, is a software engineer.'
            modelAnswer='My sister, who lives in Singapore, is a software engineer. ("That" cannot be used in non-defining relative clauses (those with commas). Use "who" for people.)'
          />
          <WorksheetQuestion id="rc-a-3" number={3} multiline
            question='The reason which I decided to study abroad was the scholarship opportunity.'
            modelAnswer='The reason why I decided to study abroad was the scholarship opportunity. (Use "why" after "reason", not "which". "Which" is used for things; "why" introduces a reason clause.)'
          />
          <WorksheetQuestion id="rc-a-4" number={4} multiline
            question='The students which study the hardest usually achieve the highest band scores.'
            modelAnswer='The students who study the hardest usually achieve the highest band scores. ("Which" refers to things, not people. Use "who" or "that" when referring to people.)'
          />
          <WorksheetQuestion id="rc-a-5" number={5} multiline
            question='The city where I grew up it has changed dramatically over the past twenty years.'
            modelAnswer='The city where I grew up has changed dramatically over the past twenty years. (Remove "it" — the relative clause "where I grew up" already connects back to "the city". Adding "it" creates a double subject error.)'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Choose the correct relative word"
          instruction="Select the correct relative pronoun or adverb, then click Check answer."
        >
          <WorksheetQuestion id="rc-b-1" number={1}
            question='"The student ___ essay won the competition is from Indonesia." Which word is correct?'
            choices={["whose", "who", "which", "where"]}
            accepted={["whose"]}
            modelAnswer='"whose" — shows possession (the essay belongs to the student). "Who" is for subject position; "which" is for things; "where" is for places.'
          />
          <WorksheetQuestion id="rc-b-2" number={2}
            question='"The school ___ I attended for six years was in the city centre." Which word is correct?'
            choices={["where", "which", "who", "when"]}
            accepted={["where"]}
            modelAnswer='Both "where" and "which" are correct. "Where" = the place at which; "which" = the school that I attended. Either is grammatically valid here.'
          />
          <WorksheetQuestion id="rc-b-3" number={3}
            question='"The day ___ the exam results were announced was extremely stressful." Which word is correct?'
            choices={["when", "where", "which", "who"]}
            accepted={["when"]}
            modelAnswer='"when" — used after time nouns (day, year, time, moment) to introduce a relative clause about that time period.'
          />
          <WorksheetQuestion id="rc-b-4" number={4}
            question='"People ___ are disciplined tend to achieve better academic results." Which word is correct?'
            choices={["who", "which", "whose", "where"]}
            accepted={["who"]}
            modelAnswer='"who" — refers to people in subject position (the people do the action of being disciplined). "Which" is for things; "whose" shows possession; "where" is for places.'
          />
          <WorksheetQuestion id="rc-b-5" number={5}
            question='Which sentence uses non-defining relative clause punctuation correctly?'
            choices={["Jakarta, which is the capital of Indonesia, has terrible traffic.", "Jakarta which is the capital of Indonesia has terrible traffic.", "Jakarta, that is the capital of Indonesia, has terrible traffic.", "Jakarta which, is the capital of Indonesia has terrible traffic."]}
            accepted={["Jakarta, which is the capital of Indonesia, has terrible traffic."]}
            modelAnswer='Non-defining relative clauses require commas on both sides. "That" cannot be used in non-defining clauses — only "who", "which", "whose", "where", or "when".'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write full sentences using the structure shown. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="rc-c-1" number={1} multiline
            question='Combine using a defining relative clause: "The university is famous for its research. I graduated from it last year."'
            modelAnswer='"The university (that/which) I graduated from last year is famous for its research." (Defining clause — no commas needed. "That" can be omitted when the relative pronoun is in object position.)'
          />
          <WorksheetQuestion id="rc-c-2" number={2} multiline
            question='Combine using a non-defining relative clause: "Public transport is usually cheaper than driving. It is often crowded."'
            modelAnswer='"Public transport, which is often crowded, is usually cheaper than driving." (Non-defining clause — commas required on both sides. "That" cannot be used here; "which" is correct for things.)'
          />
          <WorksheetQuestion id="rc-c-3" number={3} multiline
            question='Write one original IELTS-style sentence using "whose" to show possession (about a person, group, or country).'
            modelAnswer='Example: "Countries whose economies depend heavily on tourism were among the hardest hit by the global pandemic." ("Whose" shows possession — the economies belong to the countries.)'
          />
        </WorksheetBlock>

      </WorksheetContainer>
    </div>
  );
}
