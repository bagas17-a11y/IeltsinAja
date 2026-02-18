import {
  DefinitionCard,
  ExaminerTip,
  WorkedExample,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  MiniPractice,
} from "./RevisionNoteContent";

export function TopicPartsOfSpeech() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p className="mb-3">
          In English, every word belongs to a <strong className="text-white">part of speech</strong>, which tells you what role it plays in a sentence.
        </p>
        <p>
          For IELTS, understanding parts of speech helps you control sentence structure, avoid repetition, and meet the <strong className="text-white">Grammatical Range &amp; Accuracy</strong> descriptors for Band 7+.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Subjects" />
      <SubSectionTitle title="2.1 What is a subject?" />
      <DefinitionCard>
        <p className="mb-3">
          The subject is the noun or pronoun that performs the action or is described in the sentence.
        </p>
        <p>
          In IELTS Writing, subjects often refer to trends, groups of people, or abstract ideas rather than just &quot;I&quot; or &quot;people&quot;.
        </p>
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2">Typical IELTS subjects</p>
      <KeyList
        items={[
          <>Abstract nouns: &quot;globalisation&quot;, &quot;climate change&quot;, &quot;urbanisation&quot;</>,
          <>Noun phrases: &quot;the proportion of elderly citizens&quot;, &quot;the number of cars on the road&quot;</>,
          <>Dummy subject &quot;It&quot;: &quot;It is widely believed that…&quot;</>,
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Examples</p>
      <WorkedExample>
        <>&quot;The percentage of students using online platforms <strong>increased</strong> between 2010 and 2020.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;It <strong>is widely accepted</strong> that education plays a vital role in economic growth.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        In high‑band answers, subjects are often long noun phrases (e.g. &quot;the rapid expansion of private vehicles&quot;) rather than simple nouns (&quot;cars&quot;). This shows advanced control of complex noun phrases.
      </ExaminerTip>

      <SectionTitle number={3} title="Verbs" />
      <SubSectionTitle title="3.1 What is a verb?" />
      <DefinitionCard>
        <p className="mb-3">
          A verb expresses an action, state, or change.
        </p>
        <p>
          For IELTS, verbs are crucial for choosing the correct tense and for accurately describing trends, opinions, and possibilities.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="3.2 Lexical vs auxiliary verbs" />
      <KeyList
        items={[
          <><strong className="text-white">Lexical verbs</strong>: carry main meaning (increase, rise, argue, suggest).</>,
          <><strong className="text-white">Auxiliary verbs</strong>: help build tenses and passive forms (be, have, do, will, can, may).</>,
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Examples in IELTS Task 1</p>
      <WorkedExample>
        <>&quot;The figure <strong>rose</strong> sharply in 2015.&quot; (lexical)</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;The population <strong>was projected to reach</strong> 10 million by 2030.&quot; (auxiliary + passive)</>
      </WorkedExample>
      <ExaminerTip>
        Band 7+ answers use a range of verbs: reporting verbs (&quot;illustrates&quot;, &quot;demonstrates&quot;), opinion verbs (&quot;contend&quot;, &quot;maintain&quot;), and modals (&quot;could lead to&quot;, &quot;may result in&quot;).
      </ExaminerTip>

      <SectionTitle number={4} title="Pronouns" />
      <SubSectionTitle title="4.1 Function" />
      <DefinitionCard>
        <p className="mb-3">
          Pronouns replace nouns to avoid repetition and maintain cohesion.
        </p>
        <p>
          Misusing pronouns (especially it / they / this / these) can cause ambiguity and reduce coherence.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="4.2 Key pronouns for IELTS" />
      <KeyList
        items={[
          <><strong className="text-white">Personal</strong>: I, we, they, it (use &quot;I&quot; mainly in Speaking and sometimes in Task 2 when asked for your opinion).</>,
          <><strong className="text-white">Demonstrative</strong>: this, that, these, those (refer clearly to the previous idea).</>,
          <><strong className="text-white">Relative</strong>: who, which, that, where (build complex sentences).</>,
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Good academic use</p>
      <WorkedExample>
        <>&quot;This <strong>trend</strong> is likely to continue.&quot; (this = the increase described before)</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;Individuals <strong>who</strong> live in cities often face higher living costs.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        Avoid starting many sentences with &quot;This leads to…&quot;, &quot;This causes…&quot;. Make sure &quot;this&quot; clearly refers to the previous clause or replace it with a full noun phrase.
      </ExaminerTip>

      <SectionTitle number={5} title="Adjectives" />
      <SubSectionTitle title="5.1 Role" />
      <DefinitionCard>
        <p className="mb-3">
          Adjectives describe or quantify nouns.
        </p>
        <p>
          In IELTS, they help you sound more precise and academic, especially when describing data or giving opinions.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="5.2 Useful IELTS adjective sets" />
      <KeyList
        items={[
          <>Trend strength: slight, moderate, significant, dramatic</>,
          <>Evaluation: beneficial, detrimental, effective, inefficient</>,
          <>Degree: considerable, marginal, minimal, substantial</>,
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Examples</p>
      <WorkedExample>
        <>&quot;There was a <strong>significant</strong> increase in internet usage.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;Fast food has a <strong>detrimental</strong> impact on public health.&quot;</>
      </WorkedExample>

      <SectionTitle number={6} title="Adverbs" />
      <SubSectionTitle title="6.1 Role" />
      <DefinitionCard>
        <p className="mb-3">
          Adverbs modify verbs, adjectives, or other adverbs and often show manner, frequency, degree, or attitude.
        </p>
        <p>
          IELTS candidates frequently use time and frequency adverbs when describing trends and behaviours.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="6.2 Common academic adverbs" />
      <KeyList
        items={[
          <>Manner: steadily, gradually, sharply, dramatically</>,
          <>Attitude (sentence adverbs): consequently, nevertheless, moreover, notably</>,
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Examples</p>
      <WorkedExample>
        <>&quot;The rate <strong>gradually</strong> increased over the period.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;Consequently, governments <strong>are increasingly</strong> investing in renewable energy.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        Overusing adverbs like &quot;very&quot; and &quot;really&quot; sounds informal. Replace them with stronger adjectives or academic adverbs (e.g. &quot;highly effective&quot;, &quot;extremely harmful&quot;).
      </ExaminerTip>

      <SectionTitle number={7} title="Imperatives" />
      <DefinitionCard>
        <p className="mb-3">
          Imperatives give commands or directions (&quot;Consider the long‑term effects&quot;).
        </p>
        <p>
          They are natural in Speaking (giving advice) but usually avoided in formal Academic Writing.
        </p>
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2">Good use in Speaking</p>
      <WorkedExample>
        <>&quot;Try to develop good study habits early.&quot;</>
      </WorkedExample>
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Better alternative in Writing</p>
      <DefinitionCard>
        <p>
          Instead of &quot;Consider banning private cars in city centres,&quot; write &quot;Governments should <strong className="text-white">consider</strong> banning private cars in city centres.&quot;
        </p>
      </DefinitionCard>

      <SectionTitle number={8} title="Mini Practice (Parts of Speech)" />
      <MiniPractice
        title="Mini Practice"
        prompt={
          <>
            <p className="mb-2">Rewrite the sentence using more advanced parts of speech:</p>
            <p className="text-slate-400 italic">&quot;People use cars a lot and this is bad.&quot;</p>
          </>
        }
        modelLabel="Model improvement"
        model={
          <>&quot;The <strong>widespread use</strong> of private vehicles <strong>significantly contributes</strong> to air pollution.&quot;</>
        }
      />
    </div>
  );
}
