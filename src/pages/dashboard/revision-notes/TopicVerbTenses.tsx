import {
  DefinitionCard,
  ExaminerTip,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  MiniPractice,
  WorkedExample,
  RevisionTable,
} from "./RevisionNoteContent";

export function TopicVerbTenses() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Tense Overview & V1/V2/V3" />
      <DefinitionCard>
        <p className="mb-3">
          Correct tense choice shows when something happens and how long it lasts.
        </p>
        <p>
          Band 7+ candidates use tenses consistently in IELTS Writing Task 1 (visual report), Task 2 (essay), and Speaking, with only occasional errors.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="V1/V2/V3 Legend" />
      <KeyList
        items={[
          <><strong className="text-white">V1</strong> = base form (work, go, increase)</>,
          <><strong className="text-white">V2</strong> = past simple (worked, went, increased)</>,
          <><strong className="text-white">V3</strong> = past participle (worked, gone, increased)</>,
        ]}
      />
      <RevisionTable
        headers={["Tense", "Form (using V1/V2/V3)", "Basic use"]}
        rows={[
          ["Past simple", "V2", "Finished actions at a specific past time"],
          ["Present simple", "V1 / V1+s", "Facts, habits, general truths"],
          ["Future with will", "will + V1", "Predictions, decisions at moment of speaking"],
        ]}
      />

      <SectionTitle number={2} title="Past Tenses" />
      <SubSectionTitle title="2.1 Past simple" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> V2 (increased, fell, rose, was/were)</p>
        <p className="mb-2"><strong>Use:</strong> Completed actions or changes in the past.</p>
      </DefinitionCard>
      <WorkedExample>
        <>IELTS Writing Task 1: &quot;Car ownership <strong>increased</strong> significantly between 1990 and 2000.&quot; — Why: the chart shows a past period that is finished.</>
      </WorkedExample>
      <WorkedExample>
        <>IELTS Writing Task 2: &quot;In the past, people <strong>relied</strong> more on local communities.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>Speaking: &quot;I <strong>studied</strong> English at school.&quot;</>
      </WorkedExample>

      <SubSectionTitle title="2.2 Past continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> was/were + V‑ing</p>
        <p className="mb-2"><strong>Use:</strong> Action in progress at a specific time in the past.</p>
      </DefinitionCard>
      <WorkedExample>
        <>&quot;While internet use <strong>was rising</strong>, newspaper readership <strong>was falling</strong>.&quot; — Why: describes two actions happening at the same time in a past period.</>
      </WorkedExample>

      <SubSectionTitle title="2.3 Past perfect" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> had + V3</p>
        <p className="mb-2"><strong>Use:</strong> Earlier past before another past point.</p>
      </DefinitionCard>
      <WorkedExample>
        <>IELTS Writing Task 1: &quot;By 2010, the population <strong>had doubled</strong>.&quot; — Why: &quot;doubling&quot; happened before 2010, which is another past reference point.</>
      </WorkedExample>

      <SubSectionTitle title="2.4 Past perfect continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> had been + V‑ing</p>
        <p className="mb-2"><strong>Use:</strong> To stress <strong>duration</strong> before another past event.</p>
      </DefinitionCard>
      <WorkedExample>
        <>&quot;Unemployment <strong>had been increasing</strong> steadily before the reforms were introduced.&quot;</>
      </WorkedExample>

      <SectionTitle number={3} title="Present Tenses" />
      <SubSectionTitle title="3.1 Present simple" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> V1 / V1+s</p>
        <p className="mb-2"><strong>Use:</strong> Facts, general truths, descriptions of charts with no clear past/future, and opinions.</p>
      </DefinitionCard>
      <WorkedExample>
        <>IELTS Writing Task 1: &quot;The chart <strong>shows</strong> the proportion of energy sources.&quot; — Why: the chart exists now; description is factual.</>
      </WorkedExample>
      <WorkedExample>
        <>IELTS Writing Task 2: &quot;Education <strong>plays</strong> a vital role in economic development.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>Speaking: &quot;I <strong>live</strong> in Jakarta.&quot;</>
      </WorkedExample>

      <SubSectionTitle title="3.2 Present continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> am/is/are + V‑ing</p>
        <p className="mb-2"><strong>Use:</strong> Temporary actions and current trends.</p>
      </DefinitionCard>
      <WorkedExample>
        <>&quot;Many cities <strong>are experiencing</strong> rapid urbanisation.&quot; — Why: emphasises change happening around now; useful in IELTS Writing Task 2 and Speaking.</>
      </WorkedExample>

      <SubSectionTitle title="3.3 Present perfect" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> have/has + V3</p>
        <p className="mb-2"><strong>Use:</strong> Past action with result now / life experience / change up to now.</p>
      </DefinitionCard>
      <WorkedExample>
        <>IELTS Writing Task 2: &quot;Technology <strong>has transformed</strong> the way people communicate.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>Speaking: &quot;I <strong>have lived</strong> here for ten years.&quot; — Why: action started in the past and continues to now.</>
      </WorkedExample>

      <SubSectionTitle title="3.4 Present perfect continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> have/has been + V‑ing</p>
        <p className="mb-2"><strong>Use:</strong> Emphasise ongoing activity from past until now.</p>
      </DefinitionCard>
      <WorkedExample>
        <>&quot;Governments <strong>have been investing</strong> heavily in renewable energy.&quot;</>
      </WorkedExample>

      <SectionTitle number={4} title="Future Forms" />
      <SubSectionTitle title="4.1 Will + V1" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> will + V1</p>
        <p className="mb-2"><strong>Use:</strong> Predictions and future projections (especially when chart includes future data).</p>
      </DefinitionCard>
      <WorkedExample>
        <>IELTS Writing Task 1: &quot;The number of car users <strong>will continue</strong> to rise after 2020.&quot; — Why: describes prediction shown in the chart.</>
      </WorkedExample>

      <SubSectionTitle title="4.2 Be going to + V1" />
      <DefinitionCard>
        <p className="mb-2"><strong>Use:</strong> Plans/intentions or predictions with strong present evidence.</p>
      </DefinitionCard>
      <WorkedExample>
        <>&quot;The population <strong>is going to reach</strong> a peak before 2050.&quot;</>
      </WorkedExample>

      <SubSectionTitle title="4.3 Future perfect" />
      <DefinitionCard>
        <p className="mb-2"><strong>Form:</strong> will have + V3</p>
        <p className="mb-2"><strong>Use:</strong> Action completed before a specific future time.</p>
      </DefinitionCard>
      <WorkedExample>
        <>&quot;By 2030, emissions <strong>will have fallen</strong> by half.&quot; — Why: used when the graph shows a future point and an earlier future change.</>
      </WorkedExample>

      <SectionTitle number={5} title="Which Tense for IELTS Writing Task 1 vs Task 2 vs Speaking?" />
      <RevisionTable
        headers={["Situation", "Best tense(s)", "Example"]}
        rows={[
          ["Task 1: past‑only chart", "Past simple (+ occasional past perfect)", "Sales fell steadily between 2000 and 2010."],
          ["Task 1: present‑only / no time", "Present simple", "The chart shows three types of energy use."],
          ["Task 1: includes future projections", "Present simple + future forms", "The chart predicts that sales will rise after 2025."],
          ["Task 2: general statements", "Present simple", "People depend on cars nowadays."],
          ["Task 2: giving examples from the past", "Past simple", "In many cities, authorities introduced congestion charges."],
          ["Speaking: life experience", "Present perfect", "I have taken the IELTS once."],
          ["Speaking: past story", "Past simple / past continuous", "I was travelling when I lost my passport."],
        ]}
      />
      <ExaminerTip>
        Mixing past and present for the same chart (&quot;was increased&quot; / &quot;is decreasing&quot;) is a common Band 5–6 error. Stick to one logical tense based on the time in the question.
      </ExaminerTip>

      <SectionTitle number={6} title="Mini Practice with Answer Explanations" />
      <div className="space-y-6">
        <MiniPractice
          title="Q1 – Task 1 (past chart)"
          prompt={
            <>
              <p className="mb-2">Original: &quot;From 2000 to 2010, the number of tourists <strong className="text-red-400">is increasing</strong> steadily.&quot;</p>
              <p className="text-sm text-slate-400 mb-2">Correct answer: &quot;From 2000 to 2010, the number of tourists <strong className="text-emerald-400">increased</strong> steadily.&quot;</p>
              <p className="text-xs text-slate-400">
                <strong>Wrong:</strong> uses present continuous (is increasing) for a period that finished in the past. <strong>Correct:</strong> past simple (increased) matches a completed time period.
              </p>
            </>
          }
        />
        <MiniPractice
          title="Q2 – Task 1 (future projection)"
          prompt={
            <>
              <p className="mb-2">Original: &quot;By 2030, the population <strong className="text-red-400">increases</strong> to ten million.&quot;</p>
              <p className="text-sm text-slate-400 mb-2">Correct answer: &quot;By 2030, the population <strong className="text-emerald-400">will have increased</strong> to ten million.&quot;</p>
              <p className="text-xs text-slate-400">
                <strong>Wrong:</strong> present simple does not show that the change will be complete before 2030. <strong>Correct:</strong> future perfect (will have increased) clearly shows completion before that future time.
              </p>
            </>
          }
        />
        <MiniPractice
          title="Q3 – Task 2 (general truth)"
          prompt={
            <>
              <p className="mb-2">Original: &quot;People <strong className="text-red-400">are depending</strong> on cars nowadays.&quot;</p>
              <p className="text-sm text-slate-400 mb-2">Correct answer: &quot;People <strong className="text-emerald-400">depend</strong> on cars nowadays.&quot;</p>
              <p className="text-xs text-slate-400">
                <strong>Wrong:</strong> present continuous suggests a temporary action; here we talk about a general situation. <strong>Correct:</strong> present simple (depend) is used for general truths and habits, typical for Task 2 topic sentences.
              </p>
            </>
          }
        />
        <MiniPractice
          title="Q4 – Speaking (life experience)"
          prompt={
            <>
              <p className="mb-2">Original: &quot;I <strong className="text-red-400">live</strong> here for ten years.&quot;</p>
              <p className="text-sm text-slate-400 mb-2">Correct answer: &quot;I <strong className="text-emerald-400">have lived</strong> here for ten years.&quot;</p>
              <p className="text-xs text-slate-400">
                <strong>Wrong:</strong> present simple with &quot;for ten years&quot; does not show a period from past until now. <strong>Correct:</strong> present perfect (have lived) expresses an action that began in the past and continues to now, which is what the time phrase shows.
              </p>
            </>
          }
        />
        <MiniPractice
          title="Q5 – Task 1 (mixed tenses)"
          prompt={
            <>
              <p className="mb-2">Original: &quot;The chart shows that car use <strong className="text-red-400">was increasing</strong> between 1990 and 2000 and <strong className="text-red-400">increase</strong> again after 2010.&quot;</p>
              <p className="text-sm text-slate-400 mb-2">Correct answer: &quot;The chart shows that car use <strong className="text-emerald-400">increased</strong> between 1990 and 2000 and <strong className="text-emerald-400">increased</strong> again after 2010.&quot;</p>
              <p className="text-xs text-slate-400">
                <strong>Wrong:</strong> switches between was increasing and increase with no reason and uses wrong form (increase instead of increased). <strong>Correct:</strong> uses past simple consistently (increased … increased), matching two completed past periods.
              </p>
            </>
          }
        />
      </div>
    </div>
  );
}
