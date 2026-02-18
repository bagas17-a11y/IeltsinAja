import { ExaminerTip, RevisionTable } from "./RevisionNoteContent";

export function TopicApostrophes() {
  return (
    <div className="space-y-8 text-foreground/95">
      <h2 className="text-xl font-semibold text-foreground">
        What are Apostrophes?
      </h2>
      <p className="leading-relaxed">
        Apostrophes are punctuation marks (&apos;) used in two main ways in
        English writing. Correct apostrophe use in IELTS Writing demonstrates
        attention to grammatical accuracy.
      </p>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Types of Apostrophes
        </h3>
        <p className="mb-2 font-semibold">1. Possessive Apostrophes</p>
        <p className="mb-2">Show ownership or belonging.</p>
        <ul className="list-disc list-inside space-y-1 text-sm mb-4">
          <li>
            Singular noun: country&apos;s economy, the government&apos;s
            policy
          </li>
          <li>
            Irregular plural: people&apos;s attitudes, children&apos;s rights
          </li>
          <li>
            Regular plural (no apostrophe after -s): workers&apos; rights,
            countries&apos; cultures
          </li>
        </ul>
        <p className="mb-2 font-semibold">2. Contraction Apostrophes</p>
        <p className="mb-2">
          Indicate missing letters in contracted forms.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>it&apos;s = it is / it has (NOT ownership — &quot;its&quot; = possessive)</li>
          <li>don&apos;t = do not, can&apos;t = cannot, they&apos;re = they are</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Functions
        </h3>
        <RevisionTable
          headers={["Apostrophe Type", "Function", "Example"]}
          rows={[
            ["Possessive ('s)", "Shows ownership", "the country's GDP"],
            ["Possessive (s')", "Plural ownership", "workers' rights"],
            ["Contraction", "Replaces letters", "it's (= it is)"],
          ]}
        />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Common IELTS Mistakes
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-destructive">❌</span>
            <span>&quot;The government released it&apos;s report.&quot;</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-green-400">✅ &quot;its report&quot;</span>
          </li>
          <li className="flex gap-2 flex-wrap">
            <span className="text-destructive">❌</span>
            <span>&quot;Researcher&apos;s have found...&quot;</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-green-400">✅ &quot;Researchers have found...&quot;</span>
          </li>
          <li className="flex gap-2 flex-wrap">
            <span className="text-destructive">❌</span>
            <span>&quot;The 1990&apos;s saw growth.&quot;</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-green-400">✅ &quot;The 1990s saw growth.&quot;</span>
          </li>
        </ul>
      </section>

      <ExaminerTip>
        Contractions (don&apos;t, it&apos;s) are generally avoided in IELTS
        Academic Writing. Use full forms: do not, it is. However, contractions
        are natural and acceptable in IELTS Speaking.
      </ExaminerTip>
    </div>
  );
}
