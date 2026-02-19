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
        <p className="mb-3">Defining clauses give <strong className="text-white">essential</strong> information. We need them to understand which person or thing we mean. Usually there are <strong className="text-white">no commas</strong>.</p>
        <WorkedExample><>&quot;Students <strong>who study regularly</strong> often get higher scores.&quot;</></WorkedExample>
        <WorkedExample><>&quot;The city <strong>that I live in</strong> has very heavy traffic.&quot;</></WorkedExample>
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
        <p className="mb-3">Non-defining clauses add extra information only. We use <strong className="text-white">commas</strong> around them. We <strong className="text-white">cannot</strong> use &quot;that&quot; in non-defining clauses.</p>
        <WorkedExample><>&quot;My brother, <strong>who lives in Australia</strong>, is preparing for IELTS.&quot;</></WorkedExample>
        <WorkedExample><>&quot;Public transport, <strong>which is often crowded</strong>, is still cheaper than driving.&quot;</></WorkedExample>
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
          ["which", "Things"],
          ["that", "People or things (defining only)"],
          ["whose", "Possession"],
          ["where", "Places"],
          ["when", "Times"],
        ]}
      />
      <DefinitionCard>
        <p className="mb-2">Examples:</p>
        <KeyList
          items={[
            <>who — &quot;The student <strong>who</strong> spoke first got the highest mark.&quot;</>,
            <>whom — &quot;The person <strong>whom</strong> I met yesterday is a teacher.&quot;</>,
            <>which — &quot;The book <strong>which</strong> I bought is very useful.&quot;</>,
            <>that — &quot;The city <strong>that</strong> I visited is beautiful.&quot;</>,
            <>whose — &quot;The student <strong>whose</strong> essay won the prize is from Indonesia.&quot;</>,
            <>where — &quot;The university <strong>where</strong> I study has a large library.&quot;</>,
            <>when — &quot;The day <strong>when</strong> the exam results came out was stressful.&quot;</>,
          ]}
        />
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
            <p className="mb-2">1. Join the two sentences with a relative clause:</p>
            <p className="mb-2 text-slate-300">&quot;The university is famous. I graduated from it last year.&quot;</p>
            <p className="mb-3">2. Add commas if needed:</p>
            <p className="mb-2 text-slate-300">&quot;Jakarta which is the capital of Indonesia has very bad traffic.&quot;</p>
            <p className="mb-2">3. Correct the mistake:</p>
            <p className="text-slate-300">&quot;The country that the country I want to study in is Australia.&quot;</p>
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
