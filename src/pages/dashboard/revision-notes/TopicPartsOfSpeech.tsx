import { ExaminerTip } from "./RevisionNoteContent";

export function TopicPartsOfSpeech() {
  return (
    <div className="space-y-8 text-foreground/95">
      <h2 className="text-xl font-semibold text-foreground">
        What are Parts of Speech?
      </h2>
      <p className="leading-relaxed">
        Parts of speech are the categories that classify words based on their
        function in a sentence. For IELTS Writing and Speaking, understanding
        parts of speech helps you vary your language and improve your
        grammatical range — a key scoring criterion.
      </p>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Subject
        </h3>
        <p className="mb-2">
          The subject is the noun or pronoun performing the action.
        </p>
        <p className="mb-2 font-medium">
          Example: &quot;The government <strong>introduced</strong> new
          policies.&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Tip: In IELTS essays, vary subjects (it, this, such, these) to avoid
          repetition.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Verb
        </h3>
        <p className="mb-2">
          Verbs express actions, states, or occurrences.
        </p>
        <p className="mb-2 font-medium">
          Example: &quot;Researchers <strong>have found</strong> significant
          evidence.&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Tip: Use a range of reporting verbs in Task 1 (shows, illustrates,
          indicates) and opinion verbs in Task 2 (argue, suggest, claim).
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Pronouns
        </h3>
        <p className="mb-2">
          Pronouns replace nouns to avoid repetition. Types: Personal (I, he,
          they), Relative (which, who, that), Demonstrative (this, these,
          those).
        </p>
        <p className="mb-2 font-medium">
          Example: &quot;This trend has grown significantly.{" "}
          <strong>It</strong> reflects...&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Tip: Avoid starting too many sentences with &quot;I&quot; in Task 2.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Adjectives
        </h3>
        <p className="mb-2">Adjectives describe or modify nouns.</p>
        <p className="mb-2 font-medium">
          Example: &quot;There has been a <strong>significant</strong>
          increase.&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Tip: Use academic adjectives: substantial, notable, dramatic,
          marginal, steady.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Adverbs
        </h3>
        <p className="mb-2">
          Adverbs modify verbs, adjectives, or other adverbs.
        </p>
        <p className="mb-2 font-medium">
          Example: &quot;The rate <strong>steadily</strong> increased over the
          period.&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Tip: Sentence adverbs boost coherence: Furthermore, Nevertheless,
          Consequently, Notably.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
          Imperatives
        </h3>
        <p className="mb-2">
          Imperatives give commands or instructions. Less common in IELTS
          essays but appear in Speaking and informal writing.
        </p>
        <p className="mb-2 font-medium">
          Example: &quot;<strong>Consider</strong> the long-term
          consequences.&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Tip: Avoid imperatives in formal IELTS Task 2 essays — use hedging
          language instead (&quot;It is advisable to...&quot;).
        </p>
      </section>

      <ExaminerTip>
        Using a mix of noun phrases, verb forms, and modifiers in a single
        sentence demonstrates high grammatical range — this can push your score
        from Band 6 to Band 7+.
      </ExaminerTip>
    </div>
  );
}
