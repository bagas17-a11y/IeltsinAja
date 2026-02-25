import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  MistakeRow,
} from "./RevisionNoteContent";

export function TopicCollocationsParaphrasing() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What are collocations?" />
      <DefinitionCard>
        <p className="mb-3">Collocations are natural word combinations that commonly go together. Native speakers use them without thinking.</p>
        <p className="mb-3">Examples: <strong className="text-white">make a decision</strong>, <strong className="text-white">play a vital role</strong>, <strong className="text-white">conduct research</strong>.</p>
        <p className="mb-3">They affect your <strong className="text-white">Lexical Resource</strong> score. Correct collocations make your writing sound natural.</p>
        <p className="text-sm text-slate-300">Wrong examples: *do a decision* → correct: <strong>make a decision</strong>; *achieve a conclusion* → correct: <strong>reach a conclusion</strong>. These sound unnatural even if your grammar is correct.</p>
      </DefinitionCard>

      <SectionTitle number={2} title="Useful collocation types for IELTS" />
      <SubSectionTitle title="Verb + noun" />
      <DefinitionCard>
        <KeyList
          items={[
            "raise awareness",
            "address a problem",
            "pose a challenge",
            "have an impact",
            "reach a conclusion",
          ]}
        />
        <MistakeRow wrong="do a decision" correct="make a decision" />
        <MistakeRow wrong="achieve a conclusion" correct="reach a conclusion" />
        <WorkedExample><>&quot;Governments should <strong>raise awareness</strong> about climate change.&quot;</></WorkedExample>
        <WorkedExample><>&quot;The study <strong>reached the conclusion</strong> that exercise improves mental health.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Noun + noun" />
      <DefinitionCard>
        <KeyList
          items={[
            "traffic congestion",
            "population growth",
            "income inequality",
          ]}
        />
        <WorkedExample><>&quot;<strong>Traffic congestion</strong> is a major problem in many cities.&quot;</></WorkedExample>
      </DefinitionCard>
      <SubSectionTitle title="Adjective + noun" />
      <DefinitionCard>
        <KeyList
          items={[
            "significant increase",
            "growing concern",
            "long-term impact",
            "negative effect",
          ]}
        />
        <WorkedExample><>&quot;The chart shows a <strong>significant increase</strong> in online sales.&quot;</></WorkedExample>
        <WorkedExample><>&quot;There is <strong>growing concern</strong> about pollution.&quot;</></WorkedExample>
      </DefinitionCard>
      <p className="text-sm text-slate-400">Use these in Task 1 (describing data) and Task 2 (essays) to sound more natural.</p>

      <SectionTitle number={3} title="What is paraphrasing?" />
      <DefinitionCard>
        <p className="mb-3">Paraphrasing = expressing the same meaning with different words or structure. It is important for:</p>
        <KeyList
          items={[
            "Your introduction in Task 2 (rephrase the question)",
            "Avoiding repetition in your essay",
            "Reading questions that use synonyms of the passage",
          ]}
        />
        <SubSectionTitle title="Three basic techniques — how to implement in sentences" />
        <KeyList
          items={[
            <>Use synonyms — &quot;The chart <strong>shows</strong>&quot; → &quot;The graph <strong>illustrates</strong>&quot;</>,
            <>Change word form — verb → noun: &quot;Many people <strong>own</strong> cars&quot; → &quot;car <strong>ownership</strong> has increased&quot;</>,
            <>Change sentence structure — active → passive: &quot;The government introduced new laws&quot; → &quot;New laws were introduced by the government&quot;</>,
          ]}
        />
        <WorkedExample>
          <>Original: &quot;The chart shows the number of car owners.&quot;</>
          <br />
          Paraphrase: &quot;The graph <strong>illustrates</strong> how many people <strong>own cars</strong>.&quot; (synonym + structure change)
        </WorkedExample>
        <WorkedExample>
          <>Original: &quot;Pollution harms health.&quot;</>
          <br />
          Paraphrase: &quot;There is a <strong>negative impact</strong> on health <strong>caused by</strong> pollution.&quot; (collocation + structure)
        </WorkedExample>
      </DefinitionCard>

      <SectionTitle number={4} title="Safe paraphrasing strategies" />
      <DefinitionCard>
        <KeyList
          items={[
            "Keep the same meaning — do not make it stronger or weaker",
            "Change only some words, not every word",
            "Use collocations you are sure are correct; avoid strange combinations",
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="Good vs bad paraphrases" />
      <DefinitionCard>
        <MistakeRow wrong="The graph presents the quantity of vehicles." correct="The graph shows the number of vehicles." />
        <MistakeRow wrong="Technology has a big effect on society." correct="Technology has a significant impact on society." />
        <MistakeRow wrong="The number went up a lot." correct="The number increased significantly." />
        <p className="mt-3 text-sm text-slate-400">
          &quot;Presents the quantity&quot; is unnatural; &quot;shows the number of&quot; is a common, safe collocation for Task 1. Use natural collocations and formal word choices.
        </p>
      </DefinitionCard>

      <SectionTitle number={5} title="Mini practice (collocations & paraphrasing)" />
      <MiniPractice
        title="Match the collocations"
        prompt={
          <>
            <p className="mb-2">Match the halves:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
              <li>play ... &nbsp;&nbsp;&nbsp; — &nbsp;&nbsp;&nbsp; a vital role</li>
              <li>make ... &nbsp;&nbsp;&nbsp; — &nbsp;&nbsp;&nbsp; a decision</li>
              <li>conduct ... &nbsp;&nbsp;&nbsp; — &nbsp;&nbsp;&nbsp; research</li>
            </ul>
            <p className="mt-3 mb-2">Correct the wrong collocation:</p>
            <p className="text-slate-300">&quot;The government must do a decision about traffic.&quot;</p>
            <p className="mt-3 mb-2">Paraphrase this Task 2 sentence using one synonym and a change from active to passive:</p>
            <p className="text-slate-300">&quot;Many people believe that technology improves education.&quot;</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>play <strong>a vital role</strong> | make <strong>a decision</strong> | conduct <strong>research</strong></>,
          <>&quot;The government must <strong>make</strong> a decision about traffic.&quot;</>,
          <>&quot;Education is <strong>believed by many</strong> to be improved by technology.&quot; (passive) — or: &quot;Many people <strong>argue that</strong> technology improves education.&quot; (synonym)</>,
        ]}
      />
    </div>
  );
}
