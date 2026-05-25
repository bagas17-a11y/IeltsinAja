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
          <><strong className="text-white">V1 (Base Form/Present)</strong>: The root form of the verb, used in the present tense, future tense, and with modals.</>,
          <><strong className="text-white">V2 (Past Simple)</strong>: Used for actions that were completed in the past.</>,
          <><strong className="text-white">V3 (Past Participle)</strong>: Used in perfect tenses (with &apos;have/has/had&apos;) and the passive voice.</>,
          <>Regular verbs: form V2 and V3 by adding -ed or -d to V1</>,
          <>Irregular verbs: do not follow the regular rule, often changing spelling of V2/V3 completely from V1</>,
        ]}
      />
      <RevisionTable
        headers={["Type", "V1 (Base)", "V2 (Past Simple)", "V3 (Past Participle)"]}
        rows={[
          ["Regular", "walk", "walked", "walked"],
          ["Regular", "increase", "increased", "increased"],
          ["Regular", "study", "studied", "studied"],
          ["Irregular", "go", "went", "gone"],
          ["Irregular", "rise", "rose", "risen"],
          ["Irregular", "write", "wrote", "written"],
          ["Irregular", "fall", "fell", "fallen"],
          ["Irregular", "begin", "began", "begun"],
        ]}
      />

      <SectionTitle number={2} title="Past Tenses" />
      <SubSectionTitle title="2.1 Past Simple" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions completed in the past.</p>
        <p className="mb-2 text-sm text-slate-300">Uses <strong className="text-white">was</strong> for singular subject / <strong className="text-white">were</strong> for plural subject</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + V2 + object + modifiers — E.g. &quot;Car ownership increased significantly between 1990 and 2000.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + did not + V1 + object + modifiers — E.g. &quot;In the past, people did not rely on technology.&quot;</>,
            <><strong className="text-white">Question:</strong> Did + subject + V1 + object + modifiers? — E.g. &quot;Did the education system improve in the last 20 years?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="2.2 Past Continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that were in progress at a specific time in the past.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + was/were + V1-ing + object + modifiers — &quot;I was conducting research on climate change when the data became available.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + was/were + not + V1-ing — &quot;They were not considering alternative solutions during the discussion.&quot;</>,
            <><strong className="text-white">Question:</strong> Was/Were + subject + V1-ing? — &quot;Were they negotiating the contract when the market was unstable?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="2.3 Past Perfect" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that happened before another past event.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + had + V3 — &quot;She had studied English for years before she moved to Canada.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + had not + V3 — &quot;I had not anticipated such a significant increase in demand before the policy changed.&quot;</>,
            <><strong className="text-white">Question:</strong> Had + subject + V3? — &quot;Had the organization considered alternative solutions before making the final decision?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="2.4 Past Perfect Continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that started in the past, was ongoing, then stopped before another past action.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + had + been + V1-ing — &quot;The team had been preparing for the competition before it was postponed.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + had not + been + V1-ing — &quot;They had not been living in that city for long before they decided to move.&quot;</>,
            <><strong className="text-white">Question:</strong> Had + subject + been + V1-ing? — &quot;Had the students been preparing for the exam before the syllabus changed?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SectionTitle number={3} title="Present Tenses" />
      <SubSectionTitle title="3.1 Present Simple" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes habits, general truths, and permanent situations.</p>
        <p className="mb-2 text-sm text-slate-300">Uses <strong className="text-white">s/es</strong> for singular noun or third-person singular (he/she/it) / DO NOT use s/es for: I, you, plural nouns</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + V1 (+s/es) + object + modifiers — &quot;Global demand for renewable energy increases steadily as governments adopt stricter environmental policies.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + do/does not + V1 — &quot;Certain regions do not implement sustainable practices despite clear environmental concerns.&quot;</>,
            <><strong className="text-white">Question:</strong> Do/Does + subject + V1? — &quot;Does technological advancement always lead to improved living standards?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="3.2 Present Continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions happening at the moment or temporary situations.</p>
        <p className="mb-2 text-sm text-slate-300">Uses: <strong className="text-white">am</strong> for I; <strong className="text-white">is</strong> for he/she/it; <strong className="text-white">are</strong> for you/we/they</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + am/is/are + V1-ing — &quot;Governments are implementing comprehensive reforms to address economic instability.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + am/is/are + not + V1-ing — &quot;Many organizations are not prioritizing long-term sustainability at present.&quot;</>,
            <><strong className="text-white">Question:</strong> Am/Is/Are + subject + V1-ing? — &quot;Are policymakers adopting effective measures to combat inflation?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="3.3 Present Perfect" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that happened in the past but are relevant to the present.</p>
        <p className="mb-2 text-sm text-slate-300">Uses: <strong className="text-white">HAS</strong> for singular/he/she/it; <strong className="text-white">HAVE</strong> for plural/I/you/we/they</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + have/has + V3 — &quot;The government has introduced several policies aimed at reducing carbon emissions.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + have/has not + V3 — &quot;Many developing countries have not achieved adequate healthcare standards.&quot;</>,
            <><strong className="text-white">Question:</strong> Have/Has + subject + V3? — &quot;Have recent technological advancements improved global communication?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="3.4 Present Perfect Continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that started in the past and are still continuing, or have recently stopped with a focus on duration.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + have/has + been + V1-ing — &quot;Economists have been analyzing market fluctuations to understand long-term trends.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + have/has not + been + V1-ing — &quot;Experts have not been observing significant progress in this sector.&quot;</>,
            <><strong className="text-white">Question:</strong> Have/Has + subject + been + V1-ing? — &quot;Has the population been experiencing steady growth in recent decades?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SectionTitle number={4} title="Future Tenses" />
      <SubSectionTitle title="4.1 Future Simple (will)" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes spontaneous decisions, predictions, and promises.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + will + V1 — &quot;Governments will introduce stricter regulations to combat environmental degradation.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + will not (won&apos;t) + V1 — &quot;The policy will not resolve the issue entirely without further intervention.&quot;</>,
            <><strong className="text-white">Question:</strong> Will + subject + V1? — &quot;Will these reforms improve social equality in the long term?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="4.2 Future Continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that will be in progress at a specific time in the future.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + will be + V1-ing — &quot;Next year, researchers will be examining the long-term effects of climate change.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + will not be + V1-ing — &quot;The organizations will not be implementing major changes during the upcoming quarter.&quot;</>,
            <><strong className="text-white">Question:</strong> Will + subject + be + V1-ing? — &quot;Will policymakers be addressing this issue during the next summit?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="4.3 Future Perfect" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that will be completed before a specific time in the future.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + will have + V3 — &quot;By the end of the decade, many countries will have achieved significant reductions in carbon emissions.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + will not have + V3 — &quot;The company will not have resolved the issue by the proposed deadline.&quot;</>,
            <><strong className="text-white">Question:</strong> Will + subject + have + V3? — &quot;Will they have finalized the agreement by next month?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SubSectionTitle title="4.4 Future Perfect Continuous" />
      <DefinitionCard>
        <p className="mb-2"><strong>Definition:</strong> Describes actions that will have been happening for a duration up to a specific point in the future.</p>
        <p className="mb-2 font-semibold text-slate-200 mt-3">Structures:</p>
        <KeyList
          items={[
            <><strong className="text-white">Positive:</strong> Subject + will have been + V1-ing — &quot;By 2030, the team will have been working on this initiative for over a decade.&quot;</>,
            <><strong className="text-white">Negative:</strong> Subject + will not have been + V1-ing — &quot;They will not have been waiting very long by the time the government passes the bill.&quot;</>,
            <><strong className="text-white">Question:</strong> Will + subject + have been + V1-ing? — &quot;Will the company have been investing in this technology for many years by 2030?&quot;</>,
          ]}
        />
      </DefinitionCard>

      <SectionTitle number={5} title="Active and Passive Voice" />
      <DefinitionCard>
        <p className="mb-3">
          <strong className="text-white">Active voice:</strong> The subject does the action. Sentence structure uses normal tense formulas.
        </p>
        <p className="mb-3">
          <strong className="text-white">Passive voice:</strong> The subject receives the action. Structure: Object + form of &apos;to be&apos; + V3 + (by + subject)
        </p>
        <p className="mb-2 font-semibold text-slate-200">Form of &apos;to be&apos; depends on tense:</p>
        <KeyList
          items={[
            <><strong className="text-white">Present simple:</strong> am/is/are + V3</>,
            <><strong className="text-white">Past simple:</strong> was/were + V3</>,
            <><strong className="text-white">Future simple:</strong> will be + V3</>,
            <><strong className="text-white">Present continuous:</strong> am/is/are + being + V3</>,
            <><strong className="text-white">Present perfect:</strong> has/have + been + V3</>,
            <><strong className="text-white">Past perfect:</strong> had + been + V3</>,
            <><strong className="text-white">Future perfect:</strong> will have been + V3</>,
          ]}
        />
      </DefinitionCard>
      <RevisionTable
        headers={["Tense", "Active", "Passive"]}
        rows={[
          ["Past", "The committee approved the new regulations last year.", "The new regulations were approved by the committee last year."],
          ["Present", "Governments implement new environmental policies to reduce carbon emissions.", "New environmental policies are implemented by governments to reduce carbon emissions."],
          ["Future", "The government will introduce stricter laws next year.", "Stricter laws will be introduced by the government next year."],
        ]}
      />

      <SectionTitle number={6} title="Which Tense for IELTS Writing Task 1 vs Task 2 vs Speaking?" />
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

      <SectionTitle number={7} title="Mini Practice with Answer Explanations" />
      <div className="space-y-6">
        <MiniPractice
          title="Q1 – Task 1 (past chart)"\n          inputMode="none"
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
