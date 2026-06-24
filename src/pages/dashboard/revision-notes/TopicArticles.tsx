import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  WorkedExample,
  MiniPractice,
  ExaminerTip,
  MistakeRow,
  WorksheetBlock,
  WorksheetQuestion,
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
        <p className="mb-2 font-semibold text-slate-200">Use <strong>a</strong> before consonant sounds.</p>
        <WorkedExample><>&quot;Many students dream of studying at <strong>a</strong> university abroad.&quot; (sound: /juː/ = consonant)</></WorkedExample>
        <WorkedExample><>&quot;There was <strong>a</strong> useful book in the library.&quot;</></WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">Use <strong>an</strong> before vowel sounds.</p>
        <WorkedExample><>&quot;Living in <strong>an</strong> urban area can be very expensive.&quot;</></WorkedExample>
        <WorkedExample><>&quot;It took <strong>an</strong> hour to complete.&quot;</></WorkedExample>
      </DefinitionCard>

      <SectionTitle number={3} title="The – definite article" />
      <DefinitionCard>
        <p className="mb-3">Use <strong className="text-white">the</strong> when both writer and reader know which specific person or thing you mean.</p>
        <p className="mb-2 font-semibold text-slate-200">First mention vs second mention — &quot;a&quot; → &quot;the&quot;</p>
        <WorkedExample><>&quot;There is <strong>a</strong> problem with traffic in cities. <strong>The</strong> problem is getting worse.&quot;</></WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">Superlatives</p>
        <WorkedExample><>&quot;<strong>The</strong> most important reason is cost.&quot;</></WorkedExample>
        <p className="mb-2 mt-4 font-semibold text-slate-200">Unique things</p>
        <WorkedExample><>&quot;<strong>The</strong> government should focus on improving public transport.&quot;</></WorkedExample>
        <WorkedExample><>&quot;<strong>The</strong> internet has changed how we communicate.&quot;</></WorkedExample>
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
        <p className="text-sm text-slate-400">— Correct: &quot;I believe that education should be free.&quot; — &quot;Education&quot; (uncountable, general) takes no article.</p>
      </DefinitionCard>

      <SectionTitle number={6} title="Mini practice (articles)" />
      <MiniPractice
        title="Mini practice"
        prompt={
          <>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-300">
              <li>
                <span className="text-slate-200">Fill in the gaps (a / an / the / Ø):</span>
                <p className="mt-1 italic">&quot;___ government should address ___ problem of traffic congestion.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Fill in the gap (the / Ø):</span>
                <p className="mt-1 italic">&quot;Technology has changed ___ way people communicate.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">There is one article error — find and fix it:</span>
                <p className="mt-1 italic">&quot;Students need an access to good resources.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Fill in the gaps (a / an / the / Ø):</span>
                <p className="mt-1 italic">&quot;There was ___ significant increase in ___ number of online learners last year.&quot;</p>
              </li>
              <li>
                <span className="text-slate-200">Choose the correct sentence:</span>
                <p className="mt-1 italic">A. &quot;The education is important for economic growth.&quot;</p>
                <p className="mt-1 italic">B. &quot;Education is important for economic growth.&quot;</p>
              </li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <><strong className="text-white">The</strong> government / <strong className="text-white">the</strong> problem — both are specific. &quot;The government&quot; refers to a known authority; &quot;the problem of traffic congestion&quot; is a specific identified problem.</>,
          <><strong className="text-white">the</strong> way — &quot;the way people communicate&quot; refers to a specific manner, not ways in general. Always use &quot;the&quot; before &quot;way&quot; when followed by a clause.</>,
          <>&quot;Students need <strong className="text-white">Ø</strong> access to good resources.&quot; — &quot;access&quot; is an uncountable noun here, so no article is used. &quot;An access&quot; is incorrect.</>,
          <><strong className="text-white">a</strong> significant increase (first mention, one of possibly many) / <strong className="text-white">the</strong> number (specific — the number of online learners in particular).</>,
          <>Sentence <strong className="text-white">B</strong> is correct. &quot;Education&quot; used as a general uncountable concept takes no article. &quot;The education&quot; would only be correct if referring to a specific education system already mentioned.</>,
        ]}
      />
      <SectionTitle number={7} title="Worksheet — Articles Practice" />

      <WorksheetBlock
        title="Part A — Fill in the gap (a / an / the / Ø)"
        instruction='Type a, an, the, or Ø (the symbol for no article) in each gap. For sentences with two gaps, separate your answers with a comma (e.g. "the, Ø").'
      >
        <WorksheetQuestion number={1}
          question='"___ internet has changed ___ way people find information."'
          modelAnswer='"the" internet (specific, unique thing everyone knows) / "the" way (referring to a specific manner)'
          accepted={["the, the", "the,the"]}
        />
        <WorksheetQuestion number={2}
          question='"___ education is one of ___ most important investments a country can make."'
          modelAnswer='Ø education (general uncountable concept, no article) / "the" most important (superlative always takes "the")'
          accepted={["ø, the", "Ø, the", "0, the", "ø,the", "Ø,the"]}
        />
        <WorksheetQuestion number={3}
          question='"She applied for ___ job at ___ university in London."'
          modelAnswer='"a" job (any job, first mention) / "a" university (starts with /juː/ consonant sound — use "a", not "an")'
          accepted={["a, a", "a,a"]}
        />
        <WorksheetQuestion number={4}
          question='"There has been ___ significant increase in ___ number of electric vehicles."'
          modelAnswer='"a" significant increase (first mention, singular countable) / "the" number (specific — the number of electric vehicles in particular)'
          accepted={["a, the", "a,the"]}
        />
        <WorksheetQuestion number={5}
          question='"___ government should do more to support ___ renewable energy sector."'
          modelAnswer='"The" government (specific governing body) / "the" renewable energy sector (specific industry)'
          accepted={["the, the", "the,the"]}
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part B — Spot and fix the article error"
        instruction="Each sentence has one article error. Rewrite the corrected version of the sentence."
      >
        <WorksheetQuestion number={1}
          question='"The pollution is becoming a serious problem in many cities."'
          modelAnswer='"Pollution is becoming a serious problem in many cities." — Remove "the". "Pollution" as a general uncountable concept needs no article.'
          multiline
        />
        <WorksheetQuestion number={2}
          question='"She is an university student studying environmental science."'
          modelAnswer='"She is a university student studying environmental science." — "university" starts with a /juː/ consonant sound, so use "a", not "an".'
          multiline
        />
        <WorksheetQuestion number={3}
          question='"I read a interesting article about climate change yesterday."'
          modelAnswer='"I read an interesting article about climate change yesterday." — "interesting" starts with a vowel sound /ɪ/, so use "an".'
          multiline
        />
        <WorksheetQuestion number={4}
          question='"Access to the education should be equal for all children."'
          modelAnswer='"Access to education should be equal for all children." — Remove "the". "Education" as a general concept takes no article.'
          multiline
        />
      </WorksheetBlock>
    </div>
  );
}
