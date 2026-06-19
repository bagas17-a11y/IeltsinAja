import {
  DefinitionCard,
  ExaminerTip,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MistakeRow,
  MiniPractice,
} from "./RevisionNoteContent";

export function TopicSubjectVerbAgreement() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What is Subject-Verb Agreement? (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Subject–verb agreement means the <strong className="text-white">subject</strong> and the <strong className="text-white">verb</strong> must match:
        </p>
        <KeyList
          items={[
            <>Singular subject → singular verb</>,
            <>Plural subject → plural verb</>,
          ]}
        />
        <p className="mt-3 text-slate-300">
          In IELTS Writing, basic agreement errors such as &quot;People <em>likes</em>&quot; or &quot;Governments <em>is</em>&quot; lower your Grammar score and can stop you reaching Band 7.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Singular subjects" />
      <DefinitionCard>
        <p className="mb-3">
          Use a verb with <strong className="text-white">s</strong> (present simple) for one person or one thing.
        </p>
        <p className="text-sm font-semibold text-slate-300 mb-2">Forms</p>
        <KeyList
          items={[
            <>he / she / it + verb‑s</>,
            <>singular noun + verb‑s</>,
          ]}
        />
        <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Examples</p>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Present simple:</p>
            <p>&quot;The <strong>company</strong> <em>invests</em> heavily in renewable energy to reduce its environmental impact.&quot;</p>
          </>
        </WorkedExample>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Present perfect:</p>
            <p>&quot;The <strong>government</strong> <em>has implemented</em> several policies to address the issue of unemployment.&quot;</p>
          </>
        </WorkedExample>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Verb &apos;to be&apos; Present (&apos;is&apos;):</p>
            <p>&quot;The <strong>impact</strong> of climate change on coastal communities <em>is</em> becoming increasingly severe.&quot;</p>
          </>
        </WorkedExample>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Verb &apos;to be&apos; Past (&apos;was&apos;):</p>
            <p>&quot;The overall <strong>performance</strong> of the students in last year&apos;s examination <em>was</em> significantly better than expected.&quot;</p>
          </>
        </WorkedExample>
        <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Common IELTS mistakes</p>
        <MistakeRow wrong="The government play an important role." correct="The government plays an important role." />
      </DefinitionCard>

      <SectionTitle number={3} title="Plural subjects" />
      <DefinitionCard>
        <p className="mb-3">
          Use the <strong className="text-white">base verb (no s)</strong> for plural subjects in the present simple.
        </p>
        <p className="text-sm font-semibold text-slate-300 mb-2">Forms</p>
        <KeyList
          items={[
            <>I / you / we / they + verb</>,
            <>plural noun + verb</>,
          ]}
        />
        <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Examples</p>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Present simple:</p>
            <p>&quot;The <strong>companies</strong> <em>invest</em> heavily in renewable energy to reduce their environmental impact.&quot;</p>
          </>
        </WorkedExample>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Present perfect:</p>
            <p>&quot;The <strong>governments</strong> <em>have implemented</em> several policies to address the issue of unemployment.&quot;</p>
          </>
        </WorkedExample>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Verb &apos;to be&apos; Present (&apos;are&apos;):</p>
            <p>&quot;The <strong>impacts</strong> of climate change on coastal communities <em>are</em> becoming increasingly severe.&quot;</p>
          </>
        </WorkedExample>
        <WorkedExample>
          <>
            <p className="mb-1 font-semibold text-slate-300">Verb &apos;to be&apos; Past (&apos;were&apos;):</p>
            <p>&quot;The overall <strong>performances</strong> of the students in last year&apos;s examinations <em>were</em> significantly better than expected.&quot;</p>
          </>
        </WorkedExample>
        <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Common IELTS mistakes</p>
        <MistakeRow wrong="Many students prefers to study abroad." correct="Many students prefer to study abroad." />
      </DefinitionCard>
      <ExaminerTip>
        For the present simple, a good trick is to &quot;balance out the s&quot;. If the subject already ends with an &quot;s&quot;, the verb shouldn&apos;t, and vice versa. Plural subjects usually end in &quot;s&quot;, so the verb shouldn&apos;t. The opposite is true for singular subjects.
      </ExaminerTip>

      <SectionTitle number={4} title="Special patterns" />
      <SubSectionTitle title="4.1 Subjects joined by &quot;and&quot;" />
      <DefinitionCard>
        <p className="mb-2">Usually <strong className="text-white">plural</strong> → use plural verb.</p>
        <WorkedExample>
          <>&quot;The internet <strong>and</strong> mobile phones <em>have</em> changed communication.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="4.2 There is / There are" />
      <DefinitionCard>
        <p className="mb-2">Singular noun → &quot;There <strong>is</strong> one main reason for this problem.&quot;</p>
        <p>Plural noun → &quot;There <strong>are</strong> several reasons for this problem.&quot;</p>
      </DefinitionCard>

      <SectionTitle number={5} title="Overview of conditionals" />
      <DefinitionCard>
        <p className="mb-4">
          Conditionals are &quot;if&quot; sentences. They are very common in IELTS Writing Task 2 (essay) and Speaking when you talk about causes, results, and imaginary situations.
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">Zero conditional – facts and habits</p>
            <p className="text-slate-400 text-sm mb-1">Structure: <strong className="text-slate-300">If + present simple, present simple</strong></p>
            <p className="text-sm mb-1">Use: General truth, result is always or usually true.</p>
            <WorkedExample><>&quot;If people <strong>eat</strong> too much fast food, they <strong>gain</strong> weight.&quot;</></WorkedExample>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">First conditional – real future possibility</p>
            <p className="text-slate-400 text-sm mb-1">Structure: <strong className="text-slate-300">If + present simple, will + verb</strong></p>
            <p className="text-sm mb-1">Use: A real situation in the future, possible result.</p>
            <WorkedExample><>&quot;If governments <strong>invest</strong> in public transport, traffic jams <strong>will decrease</strong>.&quot;</></WorkedExample>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">Second conditional – unreal / unlikely now</p>
            <p className="text-slate-400 text-sm mb-1">Structure: <strong className="text-slate-300">If + past simple, would + verb</strong></p>
            <p className="text-sm mb-1">Use: Imaginary or unlikely present/future situation.</p>
            <WorkedExample><>&quot;If I <strong>had</strong> more free time, I <strong>would study</strong> English every day.&quot;</></WorkedExample>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">Third conditional – unreal past (regret)</p>
            <p className="text-slate-400 text-sm mb-1">Structure: <strong className="text-slate-300">If + had + V3, would have + V3</strong></p>
            <p className="text-sm mb-1">Use: Imaginary past situation and its different result.</p>
            <WorkedExample><>&quot;If the government <strong>had invested</strong> earlier, unemployment <strong>would have fallen</strong>.&quot;</></WorkedExample>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">Mixed conditional – past cause, present result</p>
            <WorkedExample><>&quot;If I <strong>had studied</strong> harder at school, I <strong>would have</strong> a better job now.&quot;</></WorkedExample>
          </div>
        </div>
      </DefinitionCard>

      <SectionTitle number={6} title="Word order: sentences and questions" />
      <DefinitionCard>
        <p className="mb-4">English word order is more fixed than many other languages.</p>
        <SubSectionTitle title="6.1 Statements" />
        <p className="mb-2">Basic pattern: <strong className="text-white">Subject + Verb + Object + (Place) + (Time)</strong></p>
        <WorkedExample><>&quot;I <strong>went</strong> to campus yesterday.&quot;</></WorkedExample>
        <WorkedExample><>&quot;She <strong>studies</strong> English at night.&quot;</></WorkedExample>
        <p className="mt-3 text-sm text-slate-400">Avoid changing the order, for example:</p>
        <MistakeRow wrong="Went I yesterday to campus." correct="I went to campus yesterday." />
        <SubSectionTitle title="6.2 Yes/No questions" />
        <p className="mb-2">Pattern: <strong className="text-white">Auxiliary + Subject + Verb…?</strong></p>
        <WorkedExample><>&quot;Do you <strong>live</strong> in Jakarta?&quot;</></WorkedExample>
        <WorkedExample><>&quot;Have you <strong>finished</strong> your homework?&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={7} title="Mini practice – subject-verb agreement" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-300">
              <li>
                <span className="text-slate-200">Choose the correct verb form:</span>
                <p className="mt-1 italic">&quot;The number of students who study abroad _____ (has / have) increased significantly in recent years.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Choose the correct verb form:</span>
                <p className="mt-1 italic">&quot;Many people in the city _____ (believe / believes) that public transport should be improved.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Fix the subject-verb agreement error:</span>
                <p className="mt-1 italic">&quot;The government have introduced new policies to reduce pollution.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Fix the error:</span>
                <p className="mt-1 italic">&quot;There is several reasons why people prefer working from home.&quot;</p>
              </li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;has&quot; — the subject is &quot;the number&quot; (singular), not &quot;students&quot;. The prepositional phrase &quot;of students&quot; does not change the subject.</>,
          <>&quot;believe&quot; — &quot;many people&quot; is plural, so no &quot;s&quot; on the verb.</>,
          <>&quot;The government <strong>has</strong> introduced new policies to reduce pollution.&quot; — &quot;government&quot; is a singular collective noun.</>,
          <>&quot;There <strong>are</strong> several reasons why people prefer working from home.&quot; — &quot;several reasons&quot; is plural, so use &quot;are&quot;.</>,
        ]}
      />
    </div>
  );
}
