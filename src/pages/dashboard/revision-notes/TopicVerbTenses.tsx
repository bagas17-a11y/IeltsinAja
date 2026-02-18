import { ExaminerTip, RevisionTable } from "./RevisionNoteContent";

export function TopicVerbTenses() {
  return (
    <div className="space-y-8 text-foreground/95">
      <h2 className="text-xl font-semibold text-foreground">
        Why Verb Tenses Matter in IELTS
      </h2>
      <p className="leading-relaxed">
        Verb tenses communicate timing and duration of events. In IELTS Task 1
        (Academic), you describe data over time — so tense accuracy is
        essential. Task 2 requires consistent tense use throughout.
      </p>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Past Tenses
        </h3>
        <RevisionTable
          headers={["Aspect", "Form", "Example"]}
          rows={[
            ["Simple", "V2", "Sales fell in 2010."],
            ["Continuous", "was/were + V-ing", "Prices were rising sharply."],
            ["Perfect", "had + V3", "The rate had doubled by 2005."],
            [
              "Perfect Continuous",
              "had been + V-ing",
              "It had been declining for years.",
            ],
          ]}
        />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Present Tenses
        </h3>
        <RevisionTable
          headers={["Aspect", "Form", "Example"]}
          rows={[
            ["Simple", "V1 / V1+s", "The chart shows a clear trend."],
            ["Continuous", "am/is/are + V-ing", "Rates are increasing."],
            ["Perfect", "have/has + V3", "Emissions have risen since 2000."],
            [
              "Perfect Continuous",
              "have/has been + V-ing",
              "It has been growing steadily.",
            ],
          ]}
        />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Future Tenses
        </h3>
        <RevisionTable
          headers={["Aspect", "Form", "Example"]}
          rows={[
            ["Simple", "will + V1", "It will continue to rise."],
            ["Continuous", "will be + V-ing", "More people will be using AI."],
            ["Perfect", "will have + V3", "It will have doubled by 2030."],
            [
              "Perfect Continuous",
              "will have been + V-ing",
              "They will have been studying for years.",
            ],
          ]}
        />
      </section>

      <ExaminerTip>
        In IELTS Task 1, use present simple for describing the chart
        (&quot;The graph shows...&quot;), past simple for past data, and
        future forms when the data includes projections. Mixing tenses
        incorrectly is a Band 5–6 mistake.
      </ExaminerTip>
    </div>
  );
}
