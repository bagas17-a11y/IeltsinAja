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
      <SubSectionTitle title="2.1 What it is (Definition + Function)" />
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
      <SubSectionTitle title="2.2 Worked Examples" />
      <WorkedExample>
        <>&quot;The percentage of students using online platforms <strong>increased</strong> between 2010 and 2020.&quot;</>
        <p className="mt-2 text-slate-300 text-sm">
          The <strong className="text-white">subject</strong> is &quot;The percentage&quot;, not &quot;students&quot;. &quot;Of students&quot; and &quot;using online platforms&quot; are <strong className="text-white">modifiers</strong> of the noun &quot;percentage&quot;: <em>of students</em> (prepositional phrase), <em>using online platforms</em> (participial phrase).
        </p>
      </WorkedExample>
      <WorkedExample>
        <>&quot;It <strong>is widely accepted</strong> that education plays a vital role in economic growth.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        In Task 1, the subject is often a <strong>measurement word</strong> (percentage, number, amount, proportion), not the people themselves.
      </ExaminerTip>
      <p className="text-sm font-semibold text-slate-300 mt-4 mb-2">Common IELTS Mistakes &amp; Fixes</p>
      <KeyList
        items={[
          <>Mistake: Using &quot;students&quot; as the subject when the real subject is &quot;the percentage of students&quot;.</>,
          <>Fix: Ensure the verb agrees with the head noun (&quot;percentage … increased&quot;, not &quot;students … increased&quot;).</>,
        ]}
      />
      <SubSectionTitle title="2.3 Mini Practice" />
      <MiniPractice
        title="Identify the subject"
        prompt={<>In &quot;The number of visitors to museums rose steadily,&quot; what is the subject?</>}
        modelLabel="Answer"
        model={<>The subject is <strong>&quot;The number&quot;</strong> (of visitors to museums is a modifier).</>}
      />

      <SectionTitle number={3} title="Verbs" />
      <SubSectionTitle title="3.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          A verb expresses an action, state, or change.
        </p>
        <p>
          For IELTS, verbs are crucial for choosing the correct tense and for accurately describing trends, opinions, and possibilities.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="3.2 Worked Examples" />
      <KeyList
        items={[
          <><strong className="text-white">Lexical verbs</strong>: carry main meaning (increase, rise, argue, suggest).</>,
          <><strong className="text-white">Auxiliary verbs</strong>: help build tenses and passive forms (be, have, do, will, can, may).</>,
        ]}
      />
      <WorkedExample>
        <>&quot;The figure <strong>rose</strong> sharply in 2015.&quot; (lexical)</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;The population <strong>was projected to reach</strong> 10 million by 2030.&quot; (auxiliary + passive)</>
      </WorkedExample>
      <ExaminerTip>
        Band 7+ answers use a range of verbs: reporting verbs (&quot;illustrates&quot;, &quot;demonstrates&quot;), opinion verbs (&quot;contend&quot;, &quot;maintain&quot;), and modals (&quot;could lead to&quot;, &quot;may result in&quot;).
      </ExaminerTip>
      <SubSectionTitle title="3.3 Mini Practice" />
      <MiniPractice
        title="Choose the verb"
        prompt={<>Replace &quot;went up&quot; with a more academic verb in: &quot;Sales went up between 2010 and 2015.&quot;</>}
        modelLabel="Possible example"
        model={<>Sales <strong>increased</strong> between 2010 and 2015. (or rose, grew)</>}
      />

      <SectionTitle number={4} title="Pronouns" />
      <SubSectionTitle title="4.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Pronouns replace nouns to avoid repetition and maintain cohesion.
        </p>
        <p>
          Misusing pronouns (especially it / they / this / these) can cause ambiguity and reduce coherence.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="4.2 Worked Examples" />
      <KeyList
        items={[
          <><strong className="text-white">Personal</strong>: I, we, they, it (use &quot;I&quot; mainly in Speaking and sometimes in Task 2 when asked for your opinion).</>,
          <><strong className="text-white">Demonstrative</strong>: this, that, these, those (refer clearly to the previous idea).</>,
          <><strong className="text-white">Relative</strong>: who, which, that, where (build complex sentences).</>,
        ]}
      />
      <WorkedExample>
        <>&quot;<strong>This trend</strong> is likely to continue.&quot; — The <strong className="text-white">pronoun</strong> is &quot;This&quot;; the <strong className="text-white">noun</strong> it refers to is &quot;trend&quot;. &quot;Trend&quot; is a noun; &quot;this&quot; is a demonstrative pronoun. In later sentences, you can use &quot;this&quot; + noun to refer back clearly.</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;Individuals <strong>who</strong> live in cities often face higher living costs.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        Avoid starting <strong>many</strong> sentences with vague &quot;this&quot; + verb (e.g. &quot;This leads to…&quot;, &quot;This causes…&quot;) when the reference is unclear. It is fine to use &quot;This + noun&quot; when the noun is explicit (e.g. &quot;This trend is likely to continue.&quot;). Make sure the reader always knows exactly what &quot;this&quot; refers to.
      </ExaminerTip>
      <p className="text-sm font-semibold text-amber-200 mt-2 mb-1">Warning</p>
      <p className="text-sm text-slate-300">
        Make sure &quot;this&quot; clearly refers to the previous idea. If it feels unclear, repeat the full noun phrase (e.g. &quot;this trend in online study…&quot;).
      </p>
      <SubSectionTitle title="4.3 Mini Practice" />
      <MiniPractice
        title="Improve pronoun use"
        prompt={<>Rewrite to make the reference clear: &quot;This is bad for the environment.&quot; (referring to car use)</>}
        modelLabel="Possible example"
        model={<>&quot;<strong>This increase in car use</strong> is harmful to the environment.&quot;</>}
      />

      <SectionTitle number={5} title="Adjectives" />
      <SubSectionTitle title="5.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Adjectives describe or quantify nouns.
        </p>
        <p>
          In IELTS, they help you sound more precise and academic, especially when describing data or giving opinions.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="5.2 Worked Examples" />
      <KeyList
        items={[
          <>Trend strength: slight, moderate, significant, dramatic</>,
          <>Evaluation: beneficial, detrimental, effective, inefficient</>,
          <>Degree: considerable, marginal, minimal, substantial</>,
        ]}
      />
      <WorkedExample>
        <>&quot;There was a <strong>significant</strong> increase in internet usage.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;Fast food has a <strong>detrimental</strong> impact on public health.&quot;</>
      </WorkedExample>
      <SubSectionTitle title="5.3 Mini Practice" />
      <MiniPractice
        title="Replace informal adjectives"
        prompt={<>Replace &quot;very bad&quot; with an academic adjective in: &quot;Smoking has a very bad effect.&quot;</>}
        modelLabel="Possible example"
        model={<>Smoking has a <strong>detrimental</strong> effect. (or harmful, adverse)</>}
      />

      <SectionTitle number={6} title="Adverbs" />
      <SubSectionTitle title="6.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Adverbs modify verbs, adjectives, or other adverbs and often show manner, frequency, degree, or attitude.
        </p>
        <p>
          IELTS candidates frequently use time and frequency adverbs when describing trends and behaviours.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="6.2 Worked Examples" />
      <KeyList
        items={[
          <>Manner: steadily, gradually, sharply, dramatically</>,
          <>Attitude (sentence adverbs): consequently, nevertheless, moreover, notably</>,
        ]}
      />
      <WorkedExample>
        <>&quot;The rate <strong>gradually</strong> increased over the period.&quot;</>
      </WorkedExample>
      <WorkedExample>
        <>&quot;Consequently, governments <strong>are increasingly</strong> investing in renewable energy.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        Overusing adverbs like &quot;very&quot; and &quot;really&quot; sounds informal. Replace them with stronger adjectives or academic adverbs (e.g. &quot;highly effective&quot;, &quot;extremely harmful&quot;).
      </ExaminerTip>
      <SubSectionTitle title="6.3 Mini Practice" />
      <MiniPractice
        title="Replace informal adverbs"
        prompt={<>Replace &quot;really went up&quot; with academic phrasing.</>}
        modelLabel="Possible example"
        model={<>increased <strong>significantly</strong> / <strong>rose dramatically</strong></>}
      />

      <SectionTitle number={7} title="Imperatives" />
      <SubSectionTitle title="7.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Imperatives give commands or directions (&quot;Consider the long‑term effects&quot;).
        </p>
        <p>
          They are natural in Speaking (giving advice) and in instructions, but in <strong className="text-white">formal IELTS Writing Task 2</strong> we usually prefer a declarative sentence instead of a direct imperative.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="7.2 Worked Examples" />
      <p className="text-sm font-semibold text-slate-300 mb-2">Imperative (more speaking / informal writing)</p>
      <WorkedExample>
        <>&quot;Consider banning private cars in city centres.&quot;</>
      </WorkedExample>
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Better Academic Writing alternative (declarative clause)</p>
      <WorkedExample>
        <>&quot;Governments <strong>should consider banning</strong> private cars in city centres to reduce congestion.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        We teach imperatives because they appear in instructions and Speaking, but in Academic Writing you normally change them into a declarative sentence with a subject + modal (&quot;governments should…&quot;).
      </ExaminerTip>
      <SubSectionTitle title="7.3 Mini Practice" />
      <MiniPractice
        title="Convert imperative to academic"
        prompt={<>Convert &quot;Think about the long-term consequences&quot; into an academic-style sentence.</>}
        modelLabel="Possible example"
        model={<>&quot;Policy makers <strong>should consider</strong> the long-term consequences.&quot;</>}
      />

      <SectionTitle number={8} title="Mini Practice (Parts of Speech)" />
      <MiniPractice
        title="Rewrite with advanced parts of speech"
        prompt={
          <>
            <p className="mb-2">Rewrite the sentence using more advanced parts of speech:</p>
            <p className="text-slate-400 italic">&quot;People use cars a lot and this is bad.&quot;</p>
          </>
        }
        modelLabel="Improved sentence (possible example)"
        model={
          <>&quot;The <strong>widespread use</strong> of private vehicles <strong>significantly contributes</strong> to air pollution.&quot;</>
        }
      />

      <SubSectionTitle title="8.1 Identify Parts of Speech in a Passage" />
      <MiniPractice
        title="Mini Practice – Identify Parts of Speech in a Passage"
        prompt={
          <>
            <p className="mb-3">Read this IELTS-style paragraph and underline one example each of: subject, main verb, pronoun, adjective, adverb, and imperative (if present).</p>
            <div className="p-4 rounded-lg bg-[#1e293b]/60 border border-[#334155] text-slate-200 italic">
              &quot;Many students now study online instead of attending traditional classes. This change has created new opportunities, but it also requires learners to be highly disciplined. As a result, they must carefully manage their time to succeed.&quot;
            </div>
          </>
        }
        modelLabel="Answer key"
        modelItems={[
          <>Subject: &quot;<strong className="text-blue-300">Many students</strong>&quot;, &quot;<strong className="text-blue-300">This change</strong>&quot;</>,
          <>Main verbs: &quot;<strong className="text-emerald-300">study</strong>&quot;, &quot;<strong className="text-emerald-300">has created</strong>&quot;, &quot;<strong className="text-emerald-300">requires</strong>&quot;, &quot;<strong className="text-emerald-300">must manage</strong>&quot;</>,
          <>Pronoun: &quot;<strong className="text-amber-300">This</strong> change&quot; (refers to online study)</>,
          <>Adjective: &quot;<strong className="text-purple-300">traditional</strong> classes&quot;, &quot;<strong className="text-purple-300">new</strong> opportunities&quot;, &quot;<strong className="text-purple-300">highly</strong> disciplined&quot; (adverb + adjective)</>,
          <>Adverb: &quot;<strong className="text-cyan-300">carefully</strong> manage their time&quot;</>,
          <>Imperative: none in this passage</>,
        ]}
      />
    </div>
  );
}
