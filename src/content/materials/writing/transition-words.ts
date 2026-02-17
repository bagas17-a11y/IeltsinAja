import type { LessonMaterial } from "../types";

export const transitionWordsMaterial: LessonMaterial = {
  topicId: "transition-words",
  moduleId: "writing",
  title: "Transition Words",
  summary:
    "Use linking words for addition, contrast, cause/effect, examples, sequence, emphasis, and summary/conclusion so your essays are coherent and easy to follow.",
  body: `**Addition**  
*Furthermore, Moreover, In addition, Additionally, Also* – add another point. Use at the start of a new sentence or after a comma (Furthermore, the data show...). Do not overuse; one per paragraph is often enough.

**Contrast**  
*However, Nevertheless, On the other hand, Although, While, Whereas* – show difference or opposition. However/Nevertheless usually start a new sentence (However, some argue that...). Although/While introduce a clause (Although costs rose, profits increased).

**Cause/effect**  
*Therefore, Thus, As a result, Consequently, Because of this, Due to* – show result or reason. Therefore/Thus/Consequently often start the sentence that states the result (The demand fell. Therefore, prices decreased.).

**Examples**  
*For example, For instance, Such as, Including* – introduce an example. For example/For instance can start a sentence or follow a comma (Many countries, for example France and Germany, have...).

**Sequence**  
*First, Second, Finally, Firstly, Secondly, Then, Next* – order ideas or steps. Use consistently (First,... Second,... Finally,...).

**Emphasis**  
*Indeed, In fact, Particularly, Especially, Clearly* – stress a point (Indeed, this is the main reason. In fact, the opposite is true.).

**Summary/conclusion**  
*In conclusion, To sum up, Overall, In summary* – signal the closing paragraph. Use once at the start of your conclusion (In conclusion, both views have merit.).`,
  keyPoints: [
    "Use one or two logical links per paragraph; avoid starting every sentence with a linker.",
    "However = contrast; Therefore = result; For example = example; In conclusion = end.",
    "Although + clause (Although X, Y). Despite/In spite of + noun phrase (Despite the cost, ...).",
    "Vary linkers; do not repeat the same one (e.g. 'Furthermore' in every paragraph).",
  ],
  examples: [
    { label: "Addition", content: "Furthermore, the study found a link. In addition, costs have fallen." },
    { label: "Contrast", content: "However, not everyone agrees. Although demand rose, supply did not." },
    { label: "Cause/effect", content: "Therefore, action is needed. As a result, emissions have fallen." },
    { label: "Example", content: "For example, in Japan and South Korea, the figure is higher." },
    { label: "Conclusion", content: "In conclusion, the advantages outweigh the disadvantages." },
  ],
  commonMistakes: [
    "Using 'However' with a comma to join two sentences (However, X. Y. ✓ ... However, X, Y. ✗ – use full stop or semicolon before However.).",
    "Mixing up despite/in spite of (they need a noun or -ing: Despite the rise ✓; Despite prices rose ✗ → Although prices rose.).",
    "Overusing 'Moreover' and 'Furthermore'; vary with 'In addition', 'Also', or no linker.",
  ],
  practiceTips: [
    "Plan linkers per paragraph: one for first body (e.g. First/Furthermore), one for second (However/On the other hand), one for conclusion (In conclusion).",
    "Check that each linker matches the logic (contrast vs cause vs addition).",
  ],
  ieltsTip: "Coherence and Cohesion is partly assessed on logical linking. Use a range of linkers correctly and place them so the reader can follow your argument without confusion.",
};
