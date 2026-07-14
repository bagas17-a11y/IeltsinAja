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
  WorksheetContainer,
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
    </div>
  );
}

export function TopicArticlesWorksheet1() {
  return (
    <WorksheetContainer topicName="Articles (a / an / the / Ø)">

      <WorksheetBlock
        title="Part A — Fill in the gap (a / an / the / Ø)"
        instruction='Type a, an, the, or Ø (no article) in each gap. For two-gap sentences, separate with a comma e.g. "the, Ø".'
      >
          <WorksheetQuestion id="art-a-1" number={1}
            question='"___ internet has changed ___ way people find information."'
            modelAnswer='"the" internet (specific, unique) / "the" way (the specific manner it changed)'
            accepted={["the, the", "the,the"]}
          />
          <WorksheetQuestion id="art-a-2" number={2}
            question='"___ education is one of ___ most important investments a country can make."'
            modelAnswer='Ø education (general uncountable concept) / "the" most important (superlative always takes "the")'
            accepted={["ø, the", "Ø, the", "0, the", "ø,the", "Ø,the"]}
          />
          <WorksheetQuestion id="art-a-3" number={3}
            question='"She applied for ___ job at ___ university in London."'
            modelAnswer='"a" job (any job, first mention) / "a" university ("university" starts with /juː/ consonant sound — use "a")'
            accepted={["a, a", "a,a"]}
          />
          <WorksheetQuestion id="art-a-4" number={4}
            question='"There has been ___ significant increase in ___ number of electric vehicles on the roads."'
            modelAnswer='"a" significant increase (first mention, singular countable) / "the" number (specific — the number of electric vehicles)'
            accepted={["a, the", "a,the"]}
          />
          <WorksheetQuestion id="art-a-5" number={5}
            question='"___ government should do more to support ___ renewable energy sector."'
            modelAnswer='"The" government (specific governing body) / "the" renewable energy sector (specific industry)'
            accepted={["the, the", "the,the"]}
          />
          <WorksheetQuestion id="art-a-6" number={6}
            question='"She is ___ honest person who always tells ___ truth."'
            modelAnswer='"an" honest person ("honest" starts with a vowel sound /ɒ/) / "the" truth (specific, universal concept)'
            accepted={["an, the", "an,the"]}
          />
          <WorksheetQuestion id="art-a-7" number={7}
            question='"___ Amazon River is ___ longest river in South America."'
            modelAnswer='"The" Amazon River (unique proper noun with "the") / "the" longest (superlative always takes "the")'
            accepted={["the, the", "the,the"]}
          />
          <WorksheetQuestion id="art-a-8" number={8}
            question='"___ research shows that ___ regular exercise reduces the risk of heart disease."'
            modelAnswer='Ø research (general uncountable, talking about research broadly) / Ø regular exercise (general uncountable concept)'
            accepted={["ø, ø", "Ø, Ø", "0, 0", "ø,ø", "Ø,Ø"]}
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Spot and fix the article error"
          instruction="Each sentence has one article error. Rewrite the full corrected sentence."
        >
          <WorksheetQuestion id="art-b-1" number={1} multiline
            question='"The pollution is becoming a serious problem in many cities."'
            modelAnswer='"Pollution is becoming a serious problem in many cities." — Remove "the". "Pollution" as a general uncountable concept takes no article.'
          />
          <WorksheetQuestion id="art-b-2" number={2} multiline
            question='"She is an university student studying environmental science."'
            modelAnswer='"She is a university student studying environmental science." — "university" starts with /juː/ consonant sound, so use "a", not "an".'
          />
          <WorksheetQuestion id="art-b-3" number={3} multiline
            question='"I read a interesting article about climate change yesterday."'
            modelAnswer='"I read an interesting article about climate change yesterday." — "interesting" starts with vowel sound /ɪ/, so use "an".'
          />
          <WorksheetQuestion id="art-b-4" number={4} multiline
            question='"Access to the education should be equal for all children."'
            modelAnswer='"Access to education should be equal for all children." — Remove "the". "Education" as a general concept takes no article.'
          />
          <WorksheetQuestion id="art-b-5" number={5} multiline
            question='"The government should invest in a public transport to reduce congestion."'
            modelAnswer='"The government should invest in public transport to reduce congestion." — Remove "a". "Public transport" is an uncountable concept and takes no article here.'
          />
          <WorksheetQuestion id="art-b-6" number={6} multiline
            question='"She is best student in the class."'
            modelAnswer='"She is the best student in the class." — Superlatives always require "the".'
          />
          <WorksheetQuestion id="art-b-7" number={7} multiline
            question='"An information he provided turned out to be incorrect."'
            modelAnswer='"The information he provided turned out to be incorrect." — "Information" is uncountable (never "an information"). Use "the" because it is specific — the information he gave.'
          />
          <WorksheetQuestion id="art-b-8" number={8} multiline
            question='"I need a advice from an expert before making this decision."'
            modelAnswer='"I need advice from an expert before making this decision." — "Advice" is uncountable — never use "a advice". Remove "a".'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}

export function TopicArticlesWorksheet2() {
  return (
    <WorksheetContainer topicName="Articles (a / an / the / Ø) — Worksheet 2">

        <WorksheetBlock
          title="Part A — Fill in the gap (a / an / the / Ø)"
          instruction='Type a, an, the, or Ø (no article) for each gap. For multiple gaps, separate with commas e.g. "the, Ø, a".'
        >
          <WorksheetQuestion id="art2-a-1" number={1}
            question='"___ majority of economists agree that ___ access to education is key to reducing ___ poverty."'
            modelAnswer={'"The" majority (specific group identified by "of economists") / Ø access (uncountable general concept) / Ø poverty (uncountable general concept — poverty as a phenomenon, not a specific instance)'}
            accepted={["the, ø, ø", "the, Ø, Ø", "the,ø,ø", "the,Ø,Ø"]}
          />
          <WorksheetQuestion id="art2-a-2" number={2}
            question='"It is ___ honour to receive ___ award on behalf of ___ entire research team."'
            modelAnswer={'"an" honour ("honour" starts with vowel sound /ɒ/) / "the" award (specific award being presented) / "the" entire research team (specific, identified group)'}
            accepted={["an, the, the", "an,the,the"]}
          />
          <WorksheetQuestion id="art2-a-3" number={3}
            question='"There was ___ significant rise in ___ number of people working from home, and ___ trend is likely to continue."'
            modelAnswer={'"a" significant rise (first mention, one instance) / "the" number (specific — the number of people working from home) / "the" trend (second mention — now specific, previously introduced as "a significant rise")'}
            accepted={["a, the, the", "a,the,the"]}
          />
          <WorksheetQuestion id="art2-a-4" number={4}
            question='"___ information provided in ___ report contradicted what ___ government had previously stated."'
            modelAnswer={'"The" information (specific — the information in the report) / "the" report (specific document) / "the" government (specific governing body)'}
            accepted={["the, the, the", "the,the,the"]}
          />
          <WorksheetQuestion id="art2-a-5" number={5}
            question='"She applied for ___ position at ___ international organisation and was invited to ___ interview within ___ week."'
            modelAnswer={'"a" position (first mention, any one position) / "an" international organisation ("international" starts with vowel sound /ɪ/) / "an" interview (vowel sound /ɪ/) / "a" week (first mention, one week)'}
            accepted={["a, an, an, a", "a,an,an,a"]}
          />
          <WorksheetQuestion id="art2-a-6" number={6}
            question='"___ data from ___ latest census indicates ___ steady increase in ___ average household size."'
            modelAnswer={'"The" data (specific dataset from a census) / "the" latest census (specific, most recent one) / "a" steady increase (first mention) / "the" average household size (specific measurement being referenced)'}
            accepted={["the, the, a, the", "the,the,a,the"]}
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part B — Spot and fix the article error"
          instruction="Each sentence has one article error. Rewrite the full corrected sentence, then click Check answer."
        >
          <WorksheetQuestion id="art2-b-1" number={1} multiline
            question='"Studies show that an access to quality healthcare is a key determinant of life expectancy."'
            modelAnswer='"Studies show that access to quality healthcare is a key determinant of life expectancy." — Remove "an". "Access" is an uncountable noun — it never takes an indefinite article.'
          />
          <WorksheetQuestion id="art2-b-2" number={2} multiline
            question='"The rise in a remote working has transformed corporate culture across many industries worldwide."'
            modelAnswer='"The rise in remote working has transformed corporate culture across many industries worldwide." — Remove "a". "Remote working" is a general uncountable concept and takes no article in this context.'
          />
          <WorksheetQuestion id="art2-b-3" number={3} multiline
            question='"A percentage of students who pursue postgraduate degrees immediately after finishing undergraduate study is surprisingly low."'
            modelAnswer='"The percentage of students who pursue postgraduate degrees immediately after finishing undergraduate study is surprisingly low." — Use "The", not "A". We are referring to one specific, measurable proportion — a statistic — not just any percentage.'
          />
          <WorksheetQuestion id="art2-b-4" number={4} multiline
            question='"He is the youngest person ever to receive an Nobel Prize in Literature."'
            modelAnswer='"He is the youngest person ever to receive a Nobel Prize in Literature." — Use "a", not "an". "Nobel" starts with the consonant sound /n/, so use "a".'
          />
          <WorksheetQuestion id="art2-b-5" number={5} multiline
            question={`"The government's decision to cut a funding for public transport was widely criticised by opposition parties."`}
            modelAnswer={"\"The government's decision to cut funding for public transport was widely criticised by opposition parties.\" — Remove \"a\". \"Funding\" is an uncountable noun and takes no article when used in this general sense."}
          />
          <WorksheetQuestion id="art2-b-6" number={6} multiline
            question='"An information gathered during the five-year study proved crucial to the final policy recommendations."'
            modelAnswer='"The information gathered during the five-year study proved crucial to the final policy recommendations." — Replace "An" with "The". "Information" is uncountable (never "an information"). Use "the" because the information is specific — the data gathered in this particular study.'
          />
        </WorksheetBlock>

        <WorksheetBlock
          title="Part C — Write your own sentences"
          instruction="Write full sentences using the guideline shown. Click Check answer to compare with the model."
        >
          <WorksheetQuestion id="art2-c-1" number={1} multiline
            question='Write two connected sentences: the first introduces a new issue using "a/an", and the second refers back to it specifically using "the".'
            modelAnswer='"A growing number of graduates are finding it difficult to secure employment in their chosen field. The challenge is particularly acute in regions where the local economy depends on industries that are declining." ["A growing number" = first mention / "The challenge" = second mention, now specific]'
          />
          <WorksheetQuestion id="art2-c-2" number={2} multiline
            question='Write one sentence that correctly uses all three articles (a, an, and the) in a single sentence about an academic topic.'
            modelAnswer='"The scientists published an ambitious study that proposed a novel solution to the problem of antibiotic resistance." ["the scientists" = specific group / "an ambitious" = first mention + vowel sound / "a novel" = first mention]'
          />
          <WorksheetQuestion id="art2-c-3" number={3} multiline
            question="Write a sentence about an academic topic using no article (Ø) for a general concept. Then explain in brackets why no article is needed."
            modelAnswer='"Poverty remains one of the most complex challenges facing policymakers in the 21st century. [No article before "Poverty" — it is used as a general, uncountable concept referring to poverty as a phenomenon, not a specific instance. Compare: "The poverty experienced in rural areas..." which would be specific.]"'
          />
        </WorksheetBlock>

    </WorksheetContainer>
  );
}
