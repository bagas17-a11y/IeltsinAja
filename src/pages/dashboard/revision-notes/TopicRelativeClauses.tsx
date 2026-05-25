import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  RevisionTable,
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
    </div>
  );
}
