import {
  DefinitionCard,
  ExaminerTip,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  MiniPractice,
  WorkedExample,
} from "./RevisionNoteContent";

export function TopicVerbTenses() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Why tenses matter" />
      <DefinitionCard>
        <p className="mb-3">
          Correct tense choice shows when something happens and how long it lasts.
        </p>
        <p>
          Band 7+ candidates use tenses consistently in Task 1, Task 2, and Speaking, with only occasional errors.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Past Tenses (Task 1 focus)" />
      <SubSectionTitle title="2.1 Past simple" />
      <DefinitionCard>
        <p className="mb-2">Use for completed actions at a specific time in the past.</p>
        <p className="text-sm text-slate-400 mb-2">Form: subject + V2</p>
        <WorkedExample>
          <>&quot;Car ownership <strong>increased</strong> significantly between 1990 and 2000.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.2 Past continuous" />
      <DefinitionCard>
        <p className="mb-2">Use for actions in progress at a particular moment in the past.</p>
        <p className="text-sm text-slate-400 mb-2">Form: was / were + V‑ing</p>
        <WorkedExample>
          <>&quot;While internet use <strong>was rising</strong>, newspaper readership <strong>was falling</strong>.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.3 Past perfect" />
      <DefinitionCard>
        <p className="mb-2">Use to show an earlier past before another past point.</p>
        <p className="text-sm text-slate-400 mb-2">Form: had + V3</p>
        <WorkedExample>
          <>&quot;By 2010, the population <strong>had doubled</strong>.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="2.4 Past perfect continuous" />
      <DefinitionCard>
        <p className="mb-2">Less common but useful to emphasise duration before a past point.</p>
        <p className="text-sm text-slate-400 mb-2">Form: had been + V‑ing</p>
        <WorkedExample>
          <>&quot;The unemployment rate <strong>had been increasing</strong> steadily before the reforms were introduced.&quot;</>
        </WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="Present Tenses (Task 1 + Task 2 + Speaking)" />
      <SubSectionTitle title="3.1 Present simple" />
      <DefinitionCard>
        <p className="mb-2">Use for facts, general truths, charts with no clear time reference, and opinions.</p>
        <p className="text-sm text-slate-400 mb-2">Form: V1 / V1+s</p>
        <WorkedExample>
          <>&quot;The chart <strong>shows</strong> the proportion of energy sources.&quot; (Task 1)</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;Education <strong>plays</strong> a vital role in economic development.&quot; (Task 2)</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="3.2 Present continuous" />
      <DefinitionCard>
        <p className="mb-2">Use for temporary actions or changing situations.</p>
        <WorkedExample>
          <>&quot;Many countries <strong>are experiencing</strong> rapid urbanisation.&quot; (Task 2)</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;I <strong>am currently studying</strong> at university.&quot; (Speaking)</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="3.3 Present perfect" />
      <DefinitionCard>
        <p className="mb-2">Use for past actions with present result or experience up to now.</p>
        <p className="text-sm text-slate-400 mb-2">Form: have / has + V3</p>
        <WorkedExample>
          <>&quot;Technology <strong>has transformed</strong> the way people communicate.&quot; (Writing)</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;I <strong>have lived</strong> in this city for ten years.&quot; (Speaking)</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="3.4 Present perfect continuous" />
      <DefinitionCard>
        <p className="mb-2">Use for actions that started in the past and continue now, emphasising duration.</p>
        <p className="text-sm text-slate-400 mb-2">Form: have / has been + V‑ing</p>
        <WorkedExample>
          <>&quot;Governments <strong>have been investing</strong> heavily in renewable energy.&quot;</>
        </WorkedExample>
      </DefinitionCard>

      <SectionTitle number={4} title="Future Tenses (projections and predictions)" />
      <SubSectionTitle title="4.1 Future simple (will)" />
      <DefinitionCard>
        <p className="mb-2">Use for predictions and projections in Task 1 and for opinions about the future in Task 2.</p>
        <WorkedExample>
          <>&quot;The number of cars <strong>will continue</strong> to rise.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="4.2 Be going to" />
      <DefinitionCard>
        <p className="mb-2">Use for plans or predictions based on present evidence.</p>
        <WorkedExample>
          <>&quot;The population <strong>is going to reach</strong> a peak before 2050.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="4.3 Future perfect" />
      <DefinitionCard>
        <p className="mb-2">Use to describe an action completed before a future time.</p>
        <p className="text-sm text-slate-400 mb-2">Form: will have + V3</p>
        <WorkedExample>
          <>&quot;By 2030, emissions <strong>will have fallen</strong> by half.&quot;</>
        </WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="4.4 Future continuous / future perfect continuous" />
      <DefinitionCard>
        <p className="mb-2">Less common but useful to show advanced range.</p>
        <WorkedExample>
          <>&quot;In 2030, many people <strong>will be working</strong> remotely.&quot;</>
        </WorkedExample>
        <WorkedExample>
          <>&quot;By next year, I <strong>will have been preparing</strong> for the exam for over twelve months.&quot;</>
        </WorkedExample>
      </DefinitionCard>

      <SectionTitle number={5} title="Tense use by IELTS task" />
      <SubSectionTitle title="5.1 Task 1 (Academic)" />
      <KeyList
        items={[
          <>Past data only → mainly past simple, sometimes past perfect.</>,
          <>Present data → present simple.</>,
          <>Predictions → future forms (will, be likely to, is expected to).</>,
        ]}
      />
      <SubSectionTitle title="5.2 Task 2" />
      <KeyList
        items={[
          <>General truths and arguments → present simple.</>,
          <>Examples of past events → past simple.</>,
          <>Future consequences → future forms (&quot;will&quot;, &quot;may&quot;, &quot;is likely to&quot;).</>,
        ]}
      />
      <SubSectionTitle title="5.3 Speaking" />
      <KeyList
        items={[
          <>Part 1 → mostly present simple + present continuous.</>,
          <>Part 2 → mixture of past simple, past continuous, and present perfect to tell stories.</>,
          <>Part 3 → present simple for opinions, future forms for predictions.</>,
        ]}
      />
      <ExaminerTip>
        High‑band candidates keep tense <strong>consistent</strong> within a paragraph. Random switching between past and present for the same data is a common Band 6 issue.
      </ExaminerTip>

      <SectionTitle number={6} title="Mini Practice (Tenses)" />
      <MiniPractice
        title="Mini Practice"
        prompt={
          <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-300">
            <li>
              <strong className="text-slate-200">Task 1 sentence (past chart)</strong>
              <br />
              Original: &quot;The number of tourists is increasing between 2000 and 2010.&quot;
            </li>
            <li>
              <strong className="text-slate-200">Task 2 sentence (general truth)</strong>
              <br />
              Original: &quot;People were depending on cars nowadays.&quot;
            </li>
            <li>
              <strong className="text-slate-200">Speaking Part 2 sentence (experience)</strong>
              <br />
              Original: &quot;I live here for ten years.&quot;
            </li>
          </ol>
        }
        modelLabel="Better"
        modelItems={[
          <>&quot;The number of tourists <strong>increased</strong> between 2000 and 2010.&quot;</>,
          <>&quot;People <strong>depend</strong> on cars nowadays.&quot;</>,
          <>&quot;I <strong>have lived</strong> here for ten years.&quot;</>,
        ]}
      />
    </div>
  );
}
