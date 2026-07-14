import {
  DefinitionCard,
  ExaminerTip,
  SectionTitle,
  SubSectionTitle,
  KeyList,
  MiniPractice,
  MistakeRow,
  RevisionTable,
  WorksheetContainer,
  WorksheetBlock,
  WorksheetQuestion,
} from "./RevisionNoteContent";

export function TopicApostrophes() {
  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Overview" />
      <DefinitionCard>
        <p className="mb-3">
          Apostrophes are used for <strong className="text-white">possession</strong> and <strong className="text-white">contractions</strong>.
        </p>
        <p>
          Accurate apostrophe use is a small but important part of grammatical accuracy for higher bands.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Possessive Apostrophes" />
      <SubSectionTitle title="2.1 Singular possession" />
      <DefinitionCard>
        <p className="mb-2">Form: noun + &apos;s.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
          <li>&quot;the government<strong className="text-white">&apos;s</strong> responsibility&quot;</li>
          <li>&quot;the country<strong className="text-white">&apos;s</strong> economy&quot;</li>
        </ul>
      </DefinitionCard>
      <SubSectionTitle title="2.2 Plural possession" />
      <DefinitionCard>
        <p className="mb-3">For plural nouns that already end in &apos;s&apos;, add only an apostrophe after the &apos;s&apos;:</p>
        <RevisionTable
          headers={["Plural noun", "Possessive form", "Example"]}
          rows={[
            ["workers", "workers'", "\"workers' rights\""],
            ["students", "students'", "\"students' performance\""],
            ["governments", "governments'", "\"governments' policies\""],
          ]}
        />
        <p className="mb-2 mt-4">For irregular plurals (not ending in &apos;s&apos;), add &apos;s:</p>
        <KeyList
          items={[
            <>&quot;children<strong className="text-white">&apos;s</strong> education&quot;</>,
            <>&quot;people<strong className="text-white">&apos;s</strong> lifestyles&quot;</>,
          ]}
        />
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Common IELTS contexts</p>
      <DefinitionCard>
        <p className="text-slate-300">
          &quot;governments&apos; policies&quot;, &quot;students&apos; motivation&quot;, &quot;citizens&apos; safety&quot;
        </p>
      </DefinitionCard>
      <ExaminerTip>
        Placing the apostrophe in the wrong place (&quot;student&apos;s&quot; instead of &quot;students&apos;&quot;) is a typical Band 6 error.
      </ExaminerTip>

      <SectionTitle number={3} title="Contraction Apostrophes" />
      <SubSectionTitle title="3.1 Form" />
      <DefinitionCard>
        <p className="mb-3">
          Contractions show missing letters: it&apos;s, don&apos;t, can&apos;t, won&apos;t.
        </p>
        <p className="mb-3">
          They are encouraged in the Speaking portion to sound natural, but NOT in the Writing section as they are too informal.
        </p>
        <p className="mb-2 font-semibold text-slate-200">Subject + &quot;to be&quot; contractions:</p>
        <KeyList
          items={[
            <>I&apos;m, You&apos;re / We&apos;re / They&apos;re, He&apos;s / She&apos;s / It&apos;s, There&apos;s</>,
          ]}
        />
        <p className="mb-2 mt-3 font-semibold text-slate-200">Negative contractions:</p>
        <KeyList
          items={[
            <>Don&apos;t / Doesn&apos;t / Didn&apos;t</>,
            <>Can&apos;t (note: &quot;cannot&quot; is one word in full form)</>,
            <>Won&apos;t</>,
            <>Isn&apos;t / Aren&apos;t / Wasn&apos;t / Weren&apos;t</>,
            <>Shouldn&apos;t / Wouldn&apos;t / Couldn&apos;t</>,
            <>Hasn&apos;t / Haven&apos;t / Hadn&apos;t</>,
          ]}
        />
        <p className="mb-2 mt-3 font-semibold text-slate-200">Subject + Modal/Auxiliary:</p>
        <KeyList
          items={[
            <>I&apos;ll / You&apos;ll / He&apos;ll (will)</>,
            <>I&apos;ve / You&apos;ve / We&apos;ve (have)</>,
            <>I&apos;d / You&apos;d / He&apos;d (&apos;Would&apos; when followed by V1; &apos;Had&apos; when followed by V3)</>,
          ]}
        />
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Rules</p>
      <RevisionTable
        headers={["Form", "Meaning"]}
        rows={[
          ["it's", "it is / it has"],
          ["its", "possessive adjective (no apostrophe)"],
        ]}
      />
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Good use in Speaking</p>
      <DefinitionCard>
        <p>&quot;It&apos;s important to manage stress during exams.&quot;</p>
      </DefinitionCard>
      <p className="text-sm font-semibold text-slate-300 mb-2 mt-4">Better in Writing</p>
      <DefinitionCard>
        <p>&quot;It is important to manage stress during exams.&quot;</p>
      </DefinitionCard>

      <SectionTitle number={4} title="Typical IELTS Mistakes with Apostrophes" />
      <SubSectionTitle title="Its vs It&apos;s" />
      <DefinitionCard>
        <KeyList
          items={[
            <><strong className="text-white">Its (no apostrophe):</strong> possessive — E.g. &quot;The local council decided to close the library because its maintenance costs were too high.&quot;</>,
            <><strong className="text-white">It&apos;s (apostrophe):</strong> contraction, &quot;it is&quot; or &quot;it has&quot; — E.g. &quot;It&apos;s widely believed that urbanization leads to higher standards of living.&quot;</>,
          ]}
        />
      </DefinitionCard>
      <DefinitionCard>
        <MistakeRow wrong="The government released it's report." correct="its report" />
        <MistakeRow wrong="Researcher's have found a link…" correct="Researchers have found a link…" />
        <MistakeRow wrong="The 1990's saw rapid growth." correct="The 1990s saw rapid growth." />
      </DefinitionCard>
      <ExaminerTip>
        Avoid apostrophes in plurals like &quot;IELT&apos;S&quot;, &quot;car&apos;s&quot;, &quot;issue&apos;s&quot;. These are considered basic errors and reduce the impression of control.
      </ExaminerTip>

      <SectionTitle number={5} title="Mini Practice (Apostrophes)" />
      <MiniPractice
        title="Apostrophe error practice"
        prompt={
          <>
            <p className="mb-2">Identify and fix the apostrophe errors in the following sentences:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-300">
              <li>In recent year&apos;s, the nations workforce has struggled to adapt to AI&apos;s rapid integration into the office.</li>
              <li>A graduates ability to find work often depends on others recommendations and the universities reputation.</li>
              <li>Its often argued that a masters degree is necessary for career advancement in today&apos;s competitive market.</li>
              <li>The professors lectures (referring to all professors in the department) were compiled into a single digital resource for the student&apos;s benefit.</li>
              <li>While the government claims to support education, it&apos;s funding for vocational training has actually decreased.</li>
              <li>Most employee&apos;s believe that their rights are protected by the company&apos;s HR policies.</li>
              <li>Many university&apos;s have increased their tuition fees to cover the rising cost of education.</li>
            </ol>
          </>
        }
        modelLabel="Model answers"
        modelItems={[
          <>&quot;years&quot; (no apostrophe — it is a plural, not possessive); &quot;nation&apos;s&quot; (singular possessive) and &quot;AI&apos;s&quot; is correct.</>,
          <>&quot;graduate&apos;s ability&quot;; &quot;others&apos; recommendations&quot; (plural possessive); &quot;university&apos;s reputation&quot; (singular possessive)</>,
          <>&quot;It&apos;s&quot; should be &quot;It is&quot; or kept as &quot;It&apos;s&quot; (contraction is correct but informal — better to write &quot;It is&quot;); &quot;master&apos;s degree&quot; (possessive)</>,
          <>&quot;professors&apos; lectures&quot; (plural possessive — all professors in the department); &quot;students&apos;&quot; (plural possessive, referring to all students)</>,
          <>&quot;it&apos;s&quot; should be &quot;its&quot; (possessive, not a contraction)</>,
          <>&quot;employees&quot; (plural, no apostrophe — the sentence is about what employees believe, not something they possess)</>,
          <>&quot;universities&quot; (plural, no apostrophe)</>,
        ]}
      />
    </div>
  );
}

export function TopicApostrophesWorksheet2() {
  return (
    <WorksheetContainer topicName="Apostrophes — Worksheet 2">

      <WorksheetBlock
        title="Part A — Identify and correct the apostrophe error"
        instruction="Each sentence contains one apostrophe error. Rewrite the full corrected sentence, then click Check answer."
      >
        <WorksheetQuestion id="apos2-a-1" number={1} multiline
          question={`The 1990's witnessed unprecedented economic growth across the Asian tiger economies.`}
          modelAnswer={`"The 1990s witnessed unprecedented economic growth across the Asian tiger economies." (No apostrophe for plurals of decades. "1990s" = the decade, not a possessive.)`}
        />
        <WorksheetQuestion id="apos2-a-2" number={2} multiline
          question={`The students' progress reports were distributed to each of they're parents before the end of the school term.`}
          modelAnswer={`"The students' progress reports were distributed to each of their parents before the end of the school term." ("they're" = "they are" — a contraction. "their" = possessive adjective, meaning "belonging to them". The sentence needs the possessive.)`}
        />
        <WorksheetQuestion id="apos2-a-3" number={3} multiline
          question={`The governments decision to prioritise renewable energy over fossil fuels has been broadly welcomed by environmental campaigners.`}
          modelAnswer={`"The government's decision to prioritise renewable energy over fossil fuels has been broadly welcomed by environmental campaigners." (Singular possessive: the decision belongs to the government — add 's.)`}
        />
        <WorksheetQuestion id="apos2-a-4" number={4} multiline
          question={`It's key features include affordability, accessibility, and low maintenance costs.`}
          modelAnswer={`"Its key features include affordability, accessibility, and low maintenance costs." ("It's" = "it is" or "it has" — a contraction. "Its" (no apostrophe) = possessive. The sentence needs the possessive adjective "its".)`}
        />
        <WorksheetQuestion id="apos2-a-5" number={5} multiline
          question={`Both childrens' performances at the national competition were widely praised by teachers and community members alike.`}
          modelAnswer={`"Both children's performances at the national competition were widely praised by teachers and community members alike." ("Children" is an irregular plural — it does not end in -s. Add 's directly: children's, not childrens'.)`}
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part B — Choose the correct option"
        instruction="Select the correct form, then click Check answer."
      >
        <WorksheetQuestion id="apos2-b-1" number={1}
          question={`Which form is correct in an academic sentence?`}
          choices={["The committee's decision was final.", "The committees decision was final.", "The committee's' decision was final.", "The committees' decision was final."]}
          accepted={["The committee's decision was final."]}
          modelAnswer={`"The committee's decision" — singular possessive: add 's to "committee". "Committees'" would be correct only if referring to multiple committees' shared decision.`}
        />
        <WorksheetQuestion id="apos2-b-2" number={2}
          question={`Which sentence uses "its" correctly?`}
          choices={["The research lost it's credibility after the data was questioned.", "It's widely agreed that education is a public good.", "The organisation changed it's priorities following the review.", "The policy achieved its stated objectives within two years."]}
          accepted={["The policy achieved its stated objectives within two years."]}
          modelAnswer={`"its" (no apostrophe) is the possessive adjective — "the objectives belonging to the policy". The other options all incorrectly use "it's" (= "it is") where a possessive is needed, or correctly use "It's" as a contraction but in those sentences it is the subject, not a possessive.`}
        />
        <WorksheetQuestion id="apos2-b-3" number={3}
          question={`Which plural is correctly formed?`}
          choices={["CEO's of major corporations attended the summit.", "CEOs' of major corporations attended the summit.", "CEOs of major corporations attended the summit.", "CEO's' of major corporations attended the summit."]}
          accepted={["CEOs of major corporations attended the summit."]}
          modelAnswer={`"CEOs" — no apostrophe for simple plurals, even for abbreviations. "CEO's" would mean something belonging to one CEO. "CEOs'" would mean something belonging to multiple CEOs.`}
        />
        <WorksheetQuestion id="apos2-b-4" number={4}
          question={`Which contraction correctly replaces "it has"?`}
          choices={["Its", "Its'", "It's", "It`s"]}
          accepted={["It's"]}
          modelAnswer={`"It's" — this contraction can mean either "it is" or "it has". The apostrophe replaces the missing letters: "it ha_s" → "it's". "Its" (no apostrophe) is always possessive, never a contraction.`}
        />
      </WorksheetBlock>

      <WorksheetBlock
        title="Part C — Write your own sentences"
        instruction="Write sentences using the apostrophe rule shown. Click Check answer to compare with the model."
      >
        <WorksheetQuestion id="apos2-c-1" number={1} multiline
          question={`Write a sentence about education that uses both a singular possessive apostrophe (e.g., the university's) AND a plural possessive apostrophe (e.g., the students').`}
          modelAnswer={`Example: "The university's decision to increase tuition fees has sparked protests among students' unions across the country." [Singular possessive: "university's" — the decision belongs to one university | Plural possessive: "students'" — the unions belong to multiple students]`}
        />
        <WorksheetQuestion id="apos2-c-2" number={2} multiline
          question={`Rewrite this informal sentence in formal IELTS Writing style, removing any contractions: "It's clear that the government doesn't understand the workers' concerns."`}
          modelAnswer={`"It is clear that the government does not understand the workers' concerns." [Remove contractions for formal writing: "It's" → "It is", "doesn't" → "does not". The possessive "workers'" stays — it is not a contraction, it shows ownership.]`}
        />
        <WorksheetQuestion id="apos2-c-3" number={3} multiline
          question={`Write a sentence about a company, institution, or country using "its" as a possessive adjective (not "it's"). Make sure the sentence clearly shows that "its" refers to something belonging to the subject.`}
          modelAnswer={`Example: "The organisation revised its annual report after the initial data was found to be inaccurate." ["its annual report" = the report belonging to the organisation — possessive adjective, no apostrophe. Compare: "It's important to revise the report" — here "It's" = "It is", a contraction.]`}
        />
      </WorksheetBlock>

    </WorksheetContainer>
  );
}
