import type { LessonMaterial } from "../types";

const speakingMaterials: LessonMaterial[] = [
  {
    topicId: "speaking-overview",
    moduleId: "speaking",
    title: "Test Format and Strategies",
    summary:
      "Understand the three parts of IELTS Speaking (intro, long turn, discussion) and strategies for answering, preparing, and linking ideas.",
    body: `**Format**  
- **Part 1** (4–5 minutes): Introduction and familiar topics. The examiner asks about you: work, studies, hometown, hobbies, daily life, etc. Short, direct answers; you can extend with a reason or example.  
- **Part 2** (3–4 minutes): **Long turn**. You get a **cue card** with a topic and bullet points. You have **1 minute to prepare** (you can take notes). Then you speak for **1–2 minutes** without interruption. The examiner may ask one short follow-up question.  
- **Part 3** (4–5 minutes): **Discussion**. The examiner asks broader questions linked to the Part 2 topic. More abstract ideas, opinions, comparisons, causes and effects. You need to give longer, developed answers with reasons and examples.

**Strategies**  
1. **Part 1**: Answer the question directly, then add one or two sentences (reason, example, or detail). Avoid one-word answers.  
2. **Part 2**: Use the **1-minute preparation** well: read the bullet points, decide 2–3 things to say, note key words (not full sentences). Structure: short intro (what the topic is) → 2–3 main points → brief conclusion or opinion.  
3. **Part 3**: Treat it like a short essay: state your view, give a reason, give an example. Use linking words (However, For example, On the other hand).  
4. **Fluency**: Speak at a natural pace; short pauses to think are fine. Use fillers sparingly (Well..., That’s a good question...); avoid long silence or excessive repetition.`,
    keyPoints: [
      "Part 1: short answers + extension (reason/example). Part 2: 1 min prep, 1–2 min talk. Part 3: developed answers with reasons and examples.",
      "Use the 1-minute prep in Part 2 to plan 2–3 points and key words.",
      "In Part 3, structure your answer: view → reason → example.",
      "Natural pace and some linking words help fluency and coherence.",
    ],
    practiceTips: [
      "Practise Part 1 with a list of common topics; time yourself (20–30 seconds per answer).",
      "Practise Part 2 with past cue cards; always use the 1-minute prep and speak for at least 1 minute.",
    ],
    ieltsTip: "The examiner will not interrupt you in Part 2 even if you go over 2 minutes. Keep going until the examiner stops you; use the bullet points on the card to stay on track.",
  },
  {
    topicId: "speaking-part1",
    moduleId: "speaking",
    title: "Part 1 – Familiar Topics",
    summary:
      "Prepare for common Part 1 topics (personal info, work, home, family, education, health, likes/dislikes, hobbies, travel) and extend answers with simple grammar and fluency.",
    body: `**Topic areas**  
Part 1 covers **personal information, work, home, family, education, health, likes and dislikes**, plus **hobbies, daily routine, hometown, studies, and travel**. Questions are simple but you must show you can speak at length. Example: 'Do you like reading?' → 'Yes, I do. I especially enjoy non-fiction and news articles. I try to read for at least 20 minutes before bed.' Not: 'Yes.' or 'Yes, I like reading.' (too short).

**Grammar and fluency**  
Use **present and past** tenses naturally (e.g. 'I work in...' / 'I used to live in...'). **Extend** with because, for example, so, and: 'I like it because...', 'For example, last week I...'. Avoid one-word or very short answers. Speak at a **natural pace**; pausing to think is acceptable. Don’t memorise long answers; sound natural and flexible.`,
    keyPoints: [
      "Topics: personal info, work, home, family, education, health, likes, hobbies, routine, hometown, studies, travel.",
      "Answer + extend (reason or example) in 2–4 sentences.",
      "Use present and past tenses; natural pace.",
    ],
    examples: [
      { label: "Short → Better", content: "Do you like music? — Short: 'Yes.' Better: 'Yes, I do. I listen to a lot of pop and sometimes jazz. I find it helps me relax after work.'" },
    ],
    practiceTips: [
      "List 5–10 questions per topic (work, home, hobbies, etc.) and practise answering in 20–40 seconds each.",
      "Record yourself and check: Did I give a direct answer? Did I add a reason or example?",
    ],
    ieltsTip: "Part 1 is about warming up and showing you can communicate. Focus on clear pronunciation, relevant answers, and natural extension—not on complex vocabulary or grammar.",
  },
  {
    topicId: "speaking-part2",
    moduleId: "speaking",
    title: "Part 2 – Long Turn (Cue Card)",
    summary:
      "Structure your 1–2 minute talk using the cue card bullet points, with a clear intro, 2–3 main points, and a brief conclusion or opinion.",
    body: `**Structure**  
Use the **bullet points** on the card to organise your talk. A simple structure:  
1. **Intro** (10–15 sec): Say what the topic is and perhaps a general line (e.g. 'I’m going to talk about... It’s something that’s important to me because...').  
2. **Main points** (1–1.5 min): Cover 2–3 bullet points. For each, give 2–3 sentences: what it is, why it matters, or an example.  
3. **Conclusion** (5–10 sec): Short summary or opinion (e.g. 'So overall, I’d say it was a very positive experience.').

**Topic types**  
Cue cards ask you to **describe** a person, place, object, event, or experience; **explain** why something is important or what you liked; **compare** (e.g. then and now). Typical verbs: describe, explain, say why, when, how often. Use the 1-minute prep to decide what you’ll say for each bullet; write **key words** only (not full sentences).`,
    keyPoints: [
      "Use the bullet points: intro → 2–3 points (one per bullet) → brief conclusion.",
      "Prep: note key words for each bullet; don’t write full sentences.",
      "Describe + explain + example: e.g. 'It’s a place I visited... I liked it because... For example...'",
    ],
    commonMistakes: [
      "Speaking for only 30–40 seconds; aim for at least 1 minute, ideally 1.5.",
      "Ignoring one or two bullet points; cover all of them.",
      "Preparing a script and then reading it; notes are for ideas only, speak naturally.",
    ],
    practiceTips: [
      "Practise with 5–10 different cue cards; time yourself (1 min prep, then 1–2 min speaking).",
      "Record and listen: Did I cover all bullets? Did I have a clear intro and end?",
    ],
    ieltsTip: "If you finish before 2 minutes, the examiner may say 'Can you tell me more about...?' Use that to add another point or example. It’s fine to have a bit more to say.",
  },
  {
    topicId: "speaking-part3",
    moduleId: "speaking",
    title: "Part 3 – Discussion",
    summary:
      "Give developed answers on abstract and general topics (technology, society, environment, etc.) with opinions, reasons, examples, and linking words.",
    body: `**Abstract and general ideas**  
Part 3 goes beyond your personal experience. You might discuss **reasons** (Why do people...?), **comparisons** (How is X different from Y?), **trends** (How has ... changed?), **opinions** (Do you think...?), **future** (What might happen...?). Topics often link to Part 2: e.g. if Part 2 was 'a place you visited', Part 3 might be tourism, travel, culture, environment. Prepare to use **present, past, and future** (will, might, could) and **comparative** language (more than, less than, similar to).

**Vocabulary and coherence**  
Use **linking words** (However, For example, On the other hand, In addition, So) to structure your answer. **Paraphrase** the question if useful ('So you’re asking about...'). **Idioms and phrasal verbs** can help if they fit naturally (e.g. play a role, in the long run). Give a **clear view**, then **reason**, then **example** so the examiner can follow.`,
    keyPoints: [
      "Part 3 = opinions, reasons, examples, comparisons, causes, future.",
      "Structure: view → reason → example; use linking words.",
      "Topics: technology, environment, society, education, culture, global issues—often linked to Part 2.",
    ],
    practiceTips: [
      "List Part 3-style questions (Why do you think...? How has... changed? What might happen?) and practise 1–2 minute answers.",
      "Practise with a partner or recorder; aim for 3–5 sentences per answer with a clear point.",
    ],
    ieltsTip: "There is no single 'correct' opinion. The examiner is assessing how well you express and support your ideas, not whether they agree with you. Focus on clarity and development.",
  },
  {
    topicId: "speaking-criteria",
    moduleId: "speaking",
    title: "Assessment Criteria (Overview)",
    summary:
      "Understand how Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation are scored so you can focus your practice.",
    body: `**Fluency and Coherence**  
**Fluency**: ability to keep going without too many long pauses, repetition, or self-correction. Speak at a natural pace; use fillers (Well, I mean) sparingly. **Coherence**: answers are relevant, logical, and easy to follow. Use linking words and structure (first, for example, so) so the listener can follow your ideas.

**Lexical Resource**  
**Range**: use a variety of words; don’t repeat the same word (use synonyms: important → significant, key). **Accuracy**: use words in the right context and with the right collocation. **Paraphrase** when you don’t know a word. Idioms can help if used naturally.

**Grammatical Range and Accuracy**  
**Range**: use a mix of simple and complex structures (e.g. conditionals, relative clauses, present perfect). **Accuracy**: avoid frequent errors in tense, agreement, word order. It’s better to speak with some complex sentences and a few errors than to use only very simple sentences.

**Pronunciation**  
**Clarity**: the examiner must understand you. **Stress and intonation**: emphasise key words; use rising/falling intonation for questions and statements. **Ease of understanding**: accent is fine as long as it doesn’t get in the way of clarity. Practise difficult sounds and word stress if they affect meaning.`,
    keyPoints: [
      "Fluency: keep going; coherence: relevant, logical, linked ideas.",
      "Lexical: range (variety) + accuracy (right word, right context).",
      "Grammar: mix simple and complex; minimise basic errors.",
      "Pronunciation: clear; stress and intonation help meaning.",
    ],
    practiceTips: [
      "Record yourself and score each criterion (1–9) with the public band descriptors; focus on the lowest criterion.",
      "Practise with a partner or teacher who can give feedback on coherence and pronunciation.",
    ],
    ieltsTip: "All four criteria are equally weighted. A weakness in one (e.g. pronunciation or grammar) can pull the overall score down. Work on the area that is currently weakest while maintaining the others.",
  },
];

export default speakingMaterials;
export { speakingMaterials };
