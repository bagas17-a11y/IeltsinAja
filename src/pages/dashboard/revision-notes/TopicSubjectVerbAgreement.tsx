import {
  DefinitionCard,
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
      <SectionTitle number={1} title="Why SVA is important in IELTS" />
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
          <>&quot;The <strong>government</strong> <em>plays</em> an important role.&quot;</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;This <strong>chart</strong> <em>shows</em> changes in population.&quot;</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;He <em>works</em> part‑time while studying.&quot;</>
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
          <>&quot;Many <strong>students</strong> <em>prefer</em> studying abroad.&quot;</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;Cars <em>cause</em> serious pollution in big cities.&quot;</>
        </WorkedExample>
        <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Common IELTS mistakes</p>
        <MistakeRow wrong="Many students prefers to study abroad." correct="Many students prefer to study abroad." />
      </DefinitionCard>

      <SectionTitle number={4} title="Special patterns" />
      <SubSectionTitle title="4.1 Subjects joined by &quot;and&quot;" />
      <DefinitionCard>
        <p className="mb-2">Usually <strong className="text-white">plural</strong> → use plural verb.</p>
        <WorkedExample>
          <>&quot;The internet <strong>and</strong> mobile phones <em>have</em> changed communication.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="4.2 Subjects joined by &quot;or / nor&quot;" />
      <DefinitionCard>
        <p className="mb-2">Verb agrees with the <strong className="text-white">closest</strong> subject.</p>
        <WorkedExample>
          <>&quot;Either the <strong>teacher</strong> or the <strong>students</strong> <em>are</em> responsible.&quot;</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;Either the <strong>students</strong> or the <strong>teacher</strong> <em>is</em> responsible.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="4.3 There is / There are" />
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
    </div>
  );
}
