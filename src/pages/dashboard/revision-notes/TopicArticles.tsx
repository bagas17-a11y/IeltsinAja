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

export function TopicArticles() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="What are articles?" />
      <DefinitionCard>
        <p className="mb-3">Articles come before nouns: <strong className="text-white">a, an, the</strong>, or <strong className="text-white">no article (Ø)</strong>.</p>
        <p>They show if a noun is general or specific, and if the listener already knows which one you mean.</p>
      </DefinitionCard>

      <SectionTitle number={2} title="A / An – indefinite articles" />
      <DefinitionCard>
        <p className="mb-3">Use <strong className="text-white">a / an</strong> when the noun is singular, countable, and not specific (any one of many).</p>
        <p className="mb-3"><strong>a</strong> before consonant sounds; <strong>an</strong> before vowel sounds. Focus on <em>sound</em>, not spelling.</p>
        <WorkedExample><>&quot;Many students dream of studying at <strong>a</strong> university abroad.&quot; (sound: /juː/ = consonant)</></WorkedExample>
        <WorkedExample><>&quot;Living in <strong>an</strong> urban area can be very expensive.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="The – definite article" />
      <DefinitionCard>
        <p className="mb-3">Use <strong className="text-white">the</strong> when both writer and reader know which specific person or thing you mean.</p>
        <p className="mb-2">Often used with:</p>
        <KeyList
          items={[
            "First mention vs second mention — &quot;a problem&quot; → &quot;the problem&quot;",
            "Superlatives — &quot;the most important reason&quot;",
            "Unique things — &quot;the government&quot;, &quot;the internet&quot;",
          ]}
        />
        <WorkedExample><>&quot;There is <strong>a</strong> problem with traffic in cities. <strong>The</strong> problem is getting worse.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>The</strong> government should focus on improving public transport.&quot;</></WorkedExample>
      </DefinitionCard>
      <ExaminerTip>
        Do not use &quot;the&quot; before a noun that has not been introduced yet.
      </ExaminerTip>

      <SectionTitle number={4} title="No article (Ø)" />
      <DefinitionCard>
        <p className="mb-2">No article with:</p>
        <KeyList
          items={[
            "Plural nouns in general: &quot;Cars cause pollution.&quot;",
            "Uncountable nouns in general: &quot;Education is important.&quot;",
          ]}
        />
        <SubSectionTitle title="Contrast" />
        <WorkedExample><>&quot;I want to go to <strong>a</strong> good school.&quot; (any school)</></WorkedExample>
        <WorkedExample><>&quot;I want to go to <strong>the</strong> school near my house.&quot; (specific)</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={5} title="Articles in IELTS writing" />
      <DefinitionCard>
        <p className="mb-3">Common problems for learners:</p>
        <MistakeRow wrong="The pollution is a serious problem." correct="Pollution is a serious problem." />
        <p className="text-sm text-slate-400 mb-2">— &quot;Pollution&quot; as a general idea does not need &quot;the&quot;.</p>
        <MistakeRow wrong="Government should invest in education." correct="The government should invest in education." />
        <p className="text-sm text-slate-400 mb-2">— Singular countable noun needs an article. Use &quot;the&quot; for the government in general.</p>
        <MistakeRow wrong="I believe that education should be free." correct="I believe that education should be free." />
        <p className="text-sm text-slate-400">— &quot;Education&quot; (uncountable, general) = no article. This is correct.</p>
      </DefinitionCard>

      <SectionTitle number={6} title="Mini practice (articles)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <p className="mb-2">1. Fill the gap: &quot;___ government should address ___ problem of traffic congestion.&quot;</p>
            <p className="mb-2">2. Is &quot;the&quot; needed? &quot;Technology has changed ___ way people communicate.&quot;</p>
            <p className="mb-2">3. Correct: &quot;Students need a access to good resources.&quot;</p>
            <p className="mb-2">4. Fill: &quot;There was ___ significant increase in ___ number of online learners.&quot;</p>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;The government&quot; and &quot;the problem&quot; — both specific. &quot;The problem of traffic congestion&quot; is a known issue.</>,
          <>&quot;the&quot; — we mean the specific way (technology has changed it). Correct: &quot;Technology has changed the way people communicate.&quot;</>,
          <>&quot;Students need access...&quot; — &quot;access&quot; is uncountable here; use no article, or &quot;access to&quot;.</>,
          <>&quot;a significant increase&quot; (first mention), &quot;the number&quot; (we refer to a specific group — online learners).</>,
        ]}
      />
    </div>
  );
}
