import {
  DefinitionCard,
  ExaminerTip,
  WorkedExample,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  MiniPractice,
  RevisionTable,
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
          The subject is the noun or pronoun that performs the action; i.e. the &apos;thing&apos; described in the sentence.
        </p>
        <p className="mb-3">
          Every clause has its own subject. Since complex sentences can have multiple clauses, one sentence can have more than one subject. It is important to always identify what you are being asked in the exam.
        </p>
        <p>
          In IELTS Writing, subjects often refer to trends, groups of people, or abstract ideas rather than just &quot;I&quot; or &quot;people&quot;.
        </p>
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2">Typical IELTS subjects</p>
      <KeyList
        items={[
          <><strong className="text-white">Abstract noun:</strong> describes an idea, state, or quality instead of a concrete object — E.g. globalisation, urbanisation</>,
          <><strong className="text-white">Noun phrases:</strong> a main noun complemented by modifiers that specify it — E.g. &quot;the proportion of elderly citizens&quot;</>,
          <><strong className="text-white">Dummy subject:</strong> used to fill in the subject role in a sentence without adding meaning — E.g. &quot;It is widely believed that&quot;</>,
        ]}
      />
      <SubSectionTitle title="2.2 Worked Examples" />
      <WorkedExample>
        <>&quot;<strong>The percentage</strong> of students using online platforms increased between 2010 and 2020.&quot;</>
        <p className="mt-2 text-slate-300 text-sm">
          The <strong className="text-white">subject</strong> is &quot;The percentage&quot;, not &quot;students&quot;. &quot;Of students&quot; and &quot;using online platforms&quot; are <strong className="text-white">modifiers</strong> of the noun &quot;percentage&quot;: <em>of students</em> (prepositional phrase), <em>using online platforms</em> (participial phrase).
        </p>
      </WorkedExample>
      <WorkedExample>
        <>&quot;It <strong>is widely accepted</strong> that education plays a vital role in economic growth.&quot;</>
      </WorkedExample>
      <ExaminerTip>
        In IELTS Writing Task 1 (describing data), the subject is often a <strong>measurement word</strong> (percentage, number, amount, proportion), not the people themselves.
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
        <p className="mb-3">
          For IELTS, verbs are crucial for choosing the correct tense and for accurately describing trends, opinions, and possibilities.
        </p>
        <KeyList
          items={[
            <><strong className="text-white">Lexical (main verb):</strong> Tells you the main action. E.g. run, cook, rise, etc. Important in IELTS to know synonyms of common verbs.</>,
            <><strong className="text-white">Auxiliary (helping verb):</strong> Works with a lexical verb to show: Tense (past/present/future), Ask questions, Add emphasis, Express possibility/ability/permission. Important in IELTS to form more complex sentence structures.</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="3.2 Worked Examples" />
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Lexical verb:</p>
          <p>&quot;The figure <strong>rose</strong> sharply in 2015.&quot; — &apos;Rose&apos; is the main verb telling us the action.</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-2 font-semibold text-slate-200">Auxiliary verb — Tense:</p>
          <p className="mb-2">&quot;The population <strong>was projected</strong> to reach 10 million by 2030.&quot;</p>
          <p className="mb-2 font-semibold text-slate-200">Auxiliary verb — Questions:</p>
          <p className="mb-2">&quot;<strong>Has</strong> the government introduced new policies?&quot;</p>
          <p className="mb-2 font-semibold text-slate-200">Auxiliary verb — Emphasis:</p>
          <p className="mb-2">&quot;The results <strong>do</strong> suggest a significant change.&quot;</p>
          <p className="mb-2 font-semibold text-slate-200">Auxiliary verb — Possibility:</p>
          <p>&quot;Urbanisation <strong>could</strong> lead to increased inequality.&quot;</p>
        </>
      </WorkedExample>
      <ExaminerTip>
        Band 7+ answers use a range of verbs: reporting verbs (&quot;illustrates&quot;, &quot;demonstrates&quot;), opinion verbs (&quot;contend&quot;, &quot;maintain&quot;), and modals (&quot;could lead to&quot;, &quot;may result in&quot;).
      </ExaminerTip>
      <SubSectionTitle title="3.3 Mini Practice" />
      <MiniPractice
        title="Verbs practice"
        prompt={
          <>
            Some people believe that technology has made learning easier, while others think it has created more problems. Discuss both views and give your own opinion. In your answer, use different tenses, lexical, and auxiliary verbs.
          </>
        }
        modelLabel="Model answer"
        model={
          <>
            <p className="mb-2">Technology <strong>has transformed</strong> (present perfect — lexical) the way people learn. While some <strong>argue</strong> (present simple — lexical) that digital tools <strong>have made</strong> study more accessible, others <strong>contend</strong> that they <strong>have created</strong> distractions. I <strong>believe</strong> that both views <strong>can be</strong> valid depending on how technology <strong>is used</strong> (passive — auxiliary).</p>
            <p className="text-xs text-slate-400">Look for: at least one past tense, one present tense, a modal, a lexical verb, and an auxiliary verb.</p>
          </>
        }
      />

      <SectionTitle number={4} title="Pronouns" />
      <SubSectionTitle title="4.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Pronouns replace nouns to avoid repetition and maintain cohesion.
        </p>
        <p className="mb-3">
          Misusing pronouns (especially it / they / this / these) can cause ambiguity and reduce coherence.
        </p>
        <KeyList
          items={[
            <><strong className="text-white">Personal:</strong> refer to people or things — E.g. I, we, they, it (use &quot;I&quot; mainly in Speaking and sometimes in IELTS Writing Task 2 when asked for your opinion)</>,
            <><strong className="text-white">Demonstrative:</strong> point to specific things — This (singular near), That (singular far), These (plural near), Those (plural far)</>,
            <><strong className="text-white">Relative:</strong> introduce extra information about a noun — Who (people), Which (things), That (people/things), Where (place), When (time)</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="4.2 Worked Examples" />
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Demonstrative:</p>
          <p className="mb-2">&quot;In recent years, the use of A.I. companionships to alleviate loneliness has seen a staggering 45% increase. <strong>This trend</strong> is likely to continue growing over the next 10 years.&quot;</p>
          <p className="text-slate-300 text-sm">The &apos;trend&apos; being described is the increasing use of A.I. companionships. Instead of repeating the phrase, the demonstrative pronoun &apos;this&apos; is used to refer to it.</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Relative:</p>
          <p className="mb-2">&quot;Individuals <strong>who</strong> live in cities often face higher living costs.&quot;</p>
          <p className="text-slate-300 text-sm">The relative pronoun &apos;who&apos; specifies the type of individuals we are learning about; in this case, those who live in cities.</p>
        </>
      </WorkedExample>
      <ExaminerTip>
        Avoid starting <strong>many</strong> sentences with vague &quot;this&quot; + verb (e.g. &quot;This leads to…&quot;, &quot;This causes…&quot;) when the reference is unclear. It is fine to use &quot;This + noun&quot; when the noun is explicit (e.g. &quot;This trend is likely to continue.&quot;). Make sure the reader always knows exactly what &quot;this&quot; refers to. If it feels unclear, repeat the full noun phrase (e.g. &quot;this trend in online study…&quot;).
      </ExaminerTip>
      <SubSectionTitle title="4.3 Mini Practice" />
      <MiniPractice
        title="Pronoun practice"
        prompt={
          <>
            <p className="mb-2">Rewrite the sentences using better pronouns to improve coherence and grammar:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-300">
              <li>Technology is important. Technology helps students learn faster.</li>
              <li>Many people live in cities. Many people face pollution problems.</li>
              <li>Some solutions are ineffective. The solutions should be avoided.</li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>Technology is important. <strong>It</strong> helps students learn faster.</>,
          <>Many people live in cities. <strong>They</strong> face pollution problems.</>,
          <>Some solutions are ineffective. <strong>They</strong> should be avoided.</>,
        ]}
      />

      <SectionTitle number={5} title="Adjectives" />
      <SubSectionTitle title="5.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Answers the questions what kind, which one, and how many.
        </p>
        <p>
          In IELTS, they help you sound more precise and academic, especially when describing data or giving opinions.
        </p>
      </DefinitionCard>
      <SubSectionTitle title="5.2 Worked Examples" />
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Trend strength:</p>
          <p>&quot;There was a <strong>significant</strong> increase in internet usage.&quot;</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Evaluation:</p>
          <p>&quot;Fast food has a <strong>detrimental</strong> impact on public health.&quot;</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Degree:</p>
          <p>&quot;The company made <strong>considerable</strong> progress this year.&quot;</p>
        </>
      </WorkedExample>
      <SubSectionTitle title="5.3 Mini Practice" />
      <MiniPractice
        title="Adjective practice"
        prompt={
          <>
            Write 3-5 sentences describing the chart below. In your answer, try to include as many precise adjectives as possible, avoiding the use of common descriptors.
          </>
        }
        modelLabel="Model answer"
        model={
          <>
            <p className="mb-2">Example: &quot;The chart shows a <strong>gradual</strong> rise in renewable energy output between 2010 and 2020. The most <strong>notable</strong> increase occurred in solar energy, which saw a <strong>dramatic</strong> surge in 2018. By contrast, fossil fuel usage experienced a <strong>marginal</strong> decline over the same period.&quot;</p>
            <p className="text-xs text-slate-400">Look for: precise adjectives (gradual, notable, dramatic, marginal) rather than vague ones (big, small, good).</p>
          </>
        }
      />

      <SectionTitle number={6} title="Adverbs" />
      <SubSectionTitle title="6.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Answer the questions how, when, where, and to what extent?
        </p>
        <p>
          IELTS candidates frequently use time and frequency adverbs when describing trends and behaviours.
        </p>
        <KeyList
          items={[
            <><strong className="text-white">Modifying verbs:</strong> adverbs are used to describe how an action is done — Manner adverbs: steadily, gradually, dramatically, sharply</>,
            <><strong className="text-white">Modifying adjectives and/or other adverbs:</strong> adverbs are used to describe the degree or extent of adjectives and adverbs — Degree adverbs: very, quite, highly, significantly, extremely</>,
            <><strong className="text-white">Sentence adverbs:</strong> show speakers&apos; attitudes, opinions, or viewpoint — Starting adverbs: honestly, personally, obviously, etc.</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="6.2 Worked Examples" />
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Modifying Verbs:</p>
          <p>&quot;The rate <strong>gradually</strong> increased over the period.&quot;</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Modifying Adjectives:</p>
          <p>&quot;The policy was <strong>highly</strong> effective in reducing emissions.&quot;</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Modifying Other Adverbs:</p>
          <p>&quot;The population grew <strong>extremely</strong> rapidly in the last decade.&quot;</p>
        </>
      </WorkedExample>
      <WorkedExample>
        <>
          <p className="mb-1 font-semibold text-slate-200">Sentence Adverbs:</p>
          <p>&quot;<strong>Obviously</strong>, governments must take action to address climate change.&quot;</p>
        </>
      </WorkedExample>
      <ExaminerTip>
        Overusing adverbs like &quot;very&quot; and &quot;really&quot; sounds informal. Replace them with stronger adjectives or academic adverbs (e.g. &quot;highly effective&quot;, &quot;extremely harmful&quot;).
      </ExaminerTip>
      <SubSectionTitle title="6.3 Mini Practice" />
      <MiniPractice
        title="Adverb practice"
        prompt={
          <>
            In many countries, governments provide public housing to help people who cannot afford private housing. To what extent do you think public housing is an effective solution to housing problems? What are the main advantages and disadvantages? In your answer, try to include at least one of each type of adverb described above.
          </>
        }
        modelLabel="Model answer"
        model={
          <>
            <p className="mb-2">&quot;<strong>Obviously</strong> [sentence adverb], housing affordability is a <strong>highly</strong> [modifying adjective] complex issue. Public housing programmes have <strong>significantly</strong> [modifying verb] reduced homelessness in countries like Singapore. However, these schemes are <strong>extremely</strong> [modifying adjective] costly and can <strong>rapidly</strong> [modifying verb] become overcrowded if not managed well.&quot;</p>
            <p className="text-xs text-slate-400">Check you have: one sentence adverb, one degree adverb modifying an adjective, and one manner adverb modifying a verb.</p>
          </>
        }
      />

      <SectionTitle number={7} title="Imperatives" />
      <SubSectionTitle title="7.1 What it is (Definition + Function)" />
      <DefinitionCard>
        <p className="mb-3">
          Imperatives give commands or directions (&quot;Consider the long‑term effects&quot;).
        </p>
        <p className="mb-3">
          They are natural in Speaking (giving advice) and in instructions, but in <strong className="text-white">formal IELTS Writing Task 2 (essay)</strong> we usually prefer a declarative sentence instead of a direct imperative.
        </p>
        <p className="mb-3">
          While imperatives are an important part of speech, they can sound condescending if used too frequently. Techniques to make them sound more friendly and natural:
        </p>
        <KeyList
          items={[
            <>Add softeners: try to, please, modal questions (would you mind, could you), maybe, etc.</>,
            <>Use inclusive language like &apos;Let&apos;s&apos;</>,
            <>Add context or reason for the command</>,
          ]}
        />
      </DefinitionCard>
      <SubSectionTitle title="7.2 Worked Examples" />
      <WorkedExample>
        <>
          <p className="mb-2 font-semibold text-slate-200">Imperative vs Declarative</p>
          <p className="mb-1 font-semibold text-slate-300">Adding softeners:</p>
          <p className="mb-2">&quot;Try to study every day.&quot;</p>
          <p className="mb-1 font-semibold text-slate-300">Using inclusive language:</p>
          <p className="mb-2">&quot;Let&apos;s look at this example.&quot;</p>
          <p className="mb-1 font-semibold text-slate-300">Adding context:</p>
          <p>&quot;Focus on pronunciation so you can easily be understood.&quot;</p>
        </>
      </WorkedExample>
      <ExaminerTip>
        We teach imperatives because they appear in instructions and Speaking, but in Academic Writing you normally change them into a declarative sentence with a subject + modal (&quot;governments should…&quot;).
      </ExaminerTip>
      <SubSectionTitle title="7.3 Mini Practice" />
      <MiniPractice
        title="Imperative practice"
        prompt={
          <>
            Imagine that a friend wants to improve their English speaking skills. Give advice on what they should do. In your monologue, try to use the techniques discussed to make your instructions sound more friendly and natural.
          </>
        }
        modelLabel="Model answer"
        model={
          <>
            <p className="mb-2">&quot;Let&apos;s think about a few simple habits you could build. <strong>Try to</strong> listen to English podcasts every morning — even 10 minutes helps. <strong>Consider</strong> joining a speaking club so you can practise with others. <strong>Focus on</strong> pronunciation first, so people can understand you clearly.&quot;</p>
            <p className="text-xs text-slate-400">Look for: "Let's" (inclusive), "try to" / "consider" (softeners), and a reason clause (e.g. "so you can…").</p>
          </>
        }
      />

      <SectionTitle number={8} title="Mini Practice (Parts of Speech)" />
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
      <MiniPractice
        title="Mini Practice – Extended Writing"
        prompt={
          <>
            Some people believe that studying abroad is the best way to learn a language. To what extent do you agree? Answer in 5-6 sentences, including at least 1 of each of the parts of speech discussed in this section.
          </>
        }
        modelLabel="Model answer"
        model={
          <>
            <p className="mb-2">&quot;[Subject] Studying abroad offers significant exposure to a language in its natural context. [Lexical verb] Many learners acquire fluency more quickly because [relative pronoun] they are constantly surrounded by native speakers. [Adjective] This immersive environment is particularly beneficial for pronunciation. [Adverb] Nevertheless, it is not the only path — online resources have dramatically improved in recent years. [Imperative softened] Try to supplement any study abroad experience with structured grammar practice for best results.&quot;</p>
            <p className="text-xs text-slate-400">Check: subject ✓ verb ✓ pronoun ✓ adjective ✓ adverb ✓ imperative (softened) ✓</p>
          </>
        }
      />
    </div>
  );
}
