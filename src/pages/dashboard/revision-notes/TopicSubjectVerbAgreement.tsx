import {
  DefinitionCard,
  ExaminerTip,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MistakeRow,
  MiniPractice,
  WorksheetBlock,
  WorksheetQuestion,
  WorksheetContainer,
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

export function TopicSubjectVerbAgreementWorksheet1() {
  return (
    <WorksheetContainer topicName="Subject-Verb Agreement">

      <WorksheetBlock
        title="Part A — Fix the SVA error"
        instruction="Each sentence has one subject-verb agreement error. Rewrite the full corrected sentence, then click Check answer."
      >
        <WorksheetQuestion id="sva-a-1" number={1} multiline
          question='The number of students who study abroad have increased significantly.'
          modelAnswer='The number of students who study abroad has increased significantly. (Subject is "the number" — singular. "Of students" is a prepositional phrase.)'
        />
        <WorksheetQuestion id="sva-a-2" number={2} multiline
          question='Many people in the city believes that public transport should be free.'
          modelAnswer='Many people in the city believe that public transport should be free. ("Many people" is plural — no "s" on the verb.)'
        />
        <WorksheetQuestion id="sva-a-3" number={3} multiline
          question='The government have introduced stricter laws on pollution.'
          modelAnswer='The government has introduced stricter laws on pollution. ("Government" is a singular collective noun in formal writing.)'
        />
        <WorksheetQuestion id="sva-a-4" number={4} multiline
          question='There is several reasons why renewable energy is gaining popularity.'
          modelAnswer='There are several reasons why renewable energy is gaining popularity. ("Several reasons" is plural — use "are".)'
        />
        <WorksheetQuestion id="sva-a-5" number={5} multiline
          question='Each of the countries have their own approach to healthcare.'
          modelAnswer='Each of the countries has its own approach to healthcare. ("Each" is always singular, even followed by "of + plural noun".)'
        />
        <WorksheetQuestion id="sva-a-6" number={6} multiline
          question='The quality of the essays submitted this year are very impressive.'
          modelAnswer='The quality of the essays submitted this year is very impressive. (Subject is "the quality" — singular. "Of the essays" is a prepositional phrase.)'
        />
        <WorksheetQuestion id="sva-a-7" number={7} multiline
          question='Everyone in the classrooms agree that the new policy is unfair.'
          modelAnswer='Everyone in the classrooms agrees that the new policy is unfair. ("Everyone" is always singular — it takes a singular verb.)'
        />
        <WorksheetQuestion id="sva-a-8" number={8} multiline
          question='Neither the teacher nor the students was aware of the schedule change.'
          modelAnswer='Neither the teacher nor the students were aware of the schedule change. (With "neither…nor", the verb agrees with the closer subject — "students" is plural, so use "were".)'
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part B — Choose the correct verb form"
        instruction="Click the correct option from the two boxes, then click Check answer."
      >
        <WorksheetQuestion id="sva-b-1" number={1}
          question='The quality of the reports ___ improved significantly this year.'
          choices={["has", "have"]}
          accepted={["has"]}
          modelAnswer='"has" — the subject is "the quality" (singular), not "reports".'
        />
        <WorksheetQuestion id="sva-b-2" number={2}
          question='Both the teacher and the students ___ agreed on the new schedule.'
          choices={["has", "have"]}
          accepted={["have"]}
          modelAnswer='"have" — subjects joined by "and" are always plural.'
        />
        <WorksheetQuestion id="sva-b-3" number={3}
          question='Each of the countries ___ its own approach to healthcare policy.'
          choices={["has", "have"]}
          accepted={["has"]}
          modelAnswer='"has" — "each" is always singular, even when followed by "of + plural noun".'
        />
        <WorksheetQuestion id="sva-b-4" number={4}
          question='The data clearly ___ that pollution levels are rising.'
          choices={["shows", "show"]}
          accepted={["shows"]}
          modelAnswer='"shows" — "data" used as an uncountable mass noun is treated as singular in formal academic English.'
        />
        <WorksheetQuestion id="sva-b-5" number={5}
          question='A number of students ___ already submitted their final assignments.'
          choices={["has", "have"]}
          accepted={["have"]}
          modelAnswer='"have" — "a number of" (meaning several) is always plural. Note: "the number of" (referring to a count) is singular.'
        />
        <WorksheetQuestion id="sva-b-6" number={6}
          question='The committee ___ meeting tomorrow to discuss the annual budget.'
          choices={["is", "are"]}
          accepted={["is"]}
          modelAnswer='"is" — "committee" is a singular collective noun in formal British/academic English.'
        />
        <WorksheetQuestion id="sva-b-7" number={7}
          question='Neither the manager nor his colleagues ___ available for comment.'
          choices={["was", "were"]}
          accepted={["were"]}
          modelAnswer='"were" — with "neither…nor", the verb agrees with the closer subject. "Colleagues" is plural, so use "were".'
        />
        <WorksheetQuestion id="sva-b-8" number={8}
          question='The news about the new policies ___ spread quickly across the country.'
          choices={["has", "have"]}
          accepted={["has"]}
          modelAnswer='"has" — "news" is an uncountable noun and always takes a singular verb.'
        />
      </WorksheetBlock>

    </WorksheetContainer>
  );
}

export function TopicSubjectVerbAgreementWorksheet2() {
  return (
    <WorksheetContainer topicName="Subject-Verb Agreement — Worksheet 2">

      <WorksheetBlock
        title="Part A — Fix the SVA error"
        instruction="Each sentence has one subject-verb agreement error. Rewrite the full corrected sentence, then click Check answer."
      >
        <WorksheetQuestion id="sva2-a-1" number={1} multiline
          question='The quality of public services provided in rural areas are significantly lower than in most urban centres.'
          modelAnswer='"The quality of public services provided in rural areas is significantly lower than in most urban centres." (The subject is "the quality" — singular. "Of public services provided in rural areas" is a prepositional phrase modifying "quality"; it does not change the number of the verb.)'
        />
        <WorksheetQuestion id="sva2-a-2" number={2} multiline
          question='A number of studies has shown a clear and consistent link between poor diet and long-term health outcomes.'
          modelAnswer='"A number of studies have shown a clear and consistent link between poor diet and long-term health outcomes." ("A number of" means several/many and is always treated as plural. Compare: "The number of studies has shown..." — "the number of" is singular.)'
        />
        <WorksheetQuestion id="sva2-a-3" number={3} multiline
          question='The percentage of adults who own smartphones have risen to over 80% in most developed countries.'
          modelAnswer='"The percentage of adults who own smartphones has risen to over 80% in most developed countries." (The subject is "the percentage" — singular. "Of adults who own smartphones" is a relative clause modifying "percentage".)'
        />
        <WorksheetQuestion id="sva2-a-4" number={4} multiline
          question='Not only the economy but also social inequality were highlighted as major concerns in the annual report.'
          modelAnswer='"Not only the economy but also social inequality was highlighted as a major concern in the annual report." (With "not only...but also", the verb agrees with the closer subject — "social inequality" is singular, so use "was".)'
        />
        <WorksheetQuestion id="sva2-a-5" number={5} multiline
          question='The committee, along with several external advisers, have decided to postpone the decision until further notice.'
          modelAnswer='"The committee, along with several external advisers, has decided to postpone the decision until further notice." ("Along with" does not change the subject. The subject remains "the committee" — singular collective noun — so use "has".)'
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part B — Choose the correct verb form"
        instruction="Select the correct option, then click Check answer."
      >
        <WorksheetQuestion id="sva2-b-1" number={1}
          question='Statistics on climate change ___ that average temperatures are rising at an unprecedented rate.'
          choices={["proves", "prove", "has proven", "is proving"]}
          accepted={["prove"]}
          modelAnswer={'"prove" — "Statistics" ends in -s but is plural (multiple data points). It takes a plural verb. Compare with "data" which is also treated as plural in modern academic English.'}
        />
        <WorksheetQuestion id="sva2-b-2" number={2}
          question='The committee ___ reached a unanimous decision after three days of deliberations.'
          choices={["have", "has", "having", "are having"]}
          accepted={["has"]}
          modelAnswer={'"has" — "committee" is a singular collective noun in formal British and academic English. It takes singular verbs: "the committee has", "the team has", "the government has".'}
        />
        <WorksheetQuestion id="sva2-b-3" number={3}
          question='Neither the minister nor her advisers ___ willing to comment on the contents of the leaked documents.'
          choices={["was", "were", "is", "are"]}
          accepted={["were"]}
          modelAnswer={'"were" — With "neither...nor", the verb agrees with the subject closest to it. The closer subject is "advisers" (plural), so use "were". If it were "neither the advisers nor the minister", you would use "was".'}
        />
        <WorksheetQuestion id="sva2-b-4" number={4}
          question='The news that oil prices have fallen dramatically ___ surprised many senior analysts across the industry.'
          choices={["have", "has", "were", "are"]}
          accepted={["has"]}
          modelAnswer={'"has" — "news" is an uncountable noun and always takes a singular verb, regardless of the content of the relative clause that follows ("that oil prices have fallen"). The subject of the main clause is "the news" — singular.'}
        />
        <WorksheetQuestion id="sva2-b-5" number={5}
          question='Forty percent of the student body ___ expected to graduate with first-class honours this academic year.'
          choices={["is", "are", "has been", "have been"]}
          accepted={["is"]}
          modelAnswer={'"is" — when a percentage is followed by a collective or singular noun ("student body" treated as a single unit), use a singular verb. Compare: "Forty percent of the students are expected..." where "students" is countable plural.'}
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part C — Write your own sentences"
        instruction="Write full sentences using the guideline shown. Click Check answer to compare with the model."
      >
        <WorksheetQuestion id="sva2-c-1" number={1} multiline
          question='Write two sentences — one using "a number of" and one using "the number of" — with the correct verb form for each. Explain your choices briefly.'
          modelAnswer='"A number of researchers have questioned the validity of the methodology. The number of studies supporting the original findings, however, remains impressively large." ["A number of" = several/many → plural verb "have" | "The number of" = a specific count → singular verb "remains"]'
        />
        <WorksheetQuestion id="sva2-c-2" number={2} multiline
          question='Write a sentence using "neither...nor" with correct subject-verb agreement, about a social, environmental, or political issue.'
          modelAnswer='"Neither the proposed tax reforms nor the new investment incentive has been sufficient to address the structural causes of long-term unemployment." [Verb agrees with the closer subject: "incentive" (singular) → "has been". If "reforms" were closer: "have been".]'
        />
        <WorksheetQuestion id="sva2-c-3" number={3} multiline
          question='Write a first or second conditional sentence where both clauses demonstrate correct subject-verb agreement, about a global challenge.'
          modelAnswer='"If the number of countries committing to zero-carbon targets increases significantly, global warming will slow more quickly than current projections suggest." [Subject: "the number of countries" (singular) → "increases" | "global warming" (singular) → "will slow" | "projections" (plural) → "suggest"]'
        />
      </WorksheetBlock>

    </WorksheetContainer>
  );
}
