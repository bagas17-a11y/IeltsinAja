/**
 * Human+AI Cheatsheet & Hard Tips for IELTS Listening
 * Collapsible sections for Band 5 → 9 improvement
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lightbulb } from "lucide-react";

export function ListeningCheatsheet() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        Fast, practical system for improving IELTS Listening from Band 5 → 9 using short &quot;human drills + AI support&quot;.
      </p>

      <Accordion type="multiple" defaultValue={["checklist"]} className="w-full">
        {/* 1. Improvement Checklist */}
        <AccordionItem value="checklist" className="border rounded-lg px-4 mb-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            1. Improvement Checklist – &quot;Your Band Climb Map&quot;
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="5-6" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">5 → 6: Foundations (Decoding)</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm text-muted-foreground space-y-3">
                  <p><strong>What to fix:</strong> Hearing individual words at normal speed; recognising linking, reduced forms (&quot;gonna&quot;, &quot;wanna&quot;).</p>
                  <p><strong>Human drills:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Transcript Shadowing</strong> — Listen, read transcript, underline mis‑heard words, replay and shadow.</li>
                    <li><strong>Word Catcher</strong> — Listen once; write all numbers, names, dates; check with transcript.</li>
                  </ul>
                  <p><strong>AI support:</strong> Ask: &quot;Highlight every word I mis‑spelled and explain the sound I missed.&quot;</p>
                  <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-sm"><strong>Examiner Tip:</strong> At Band 5–6, most lost marks come from endings (-s, -ed) and basic details, not hard vocabulary. Focus on clean decoding first.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="6-7" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">6 → 7: Stamina & Logic (Strategy)</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm text-muted-foreground space-y-3">
                  <p><strong>What to fix:</strong> Wrong options in Parts 3–4; losing focus during long audios.</p>
                  <p><strong>Human drills:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>80% Time in Parts 3–4</strong> — For 1 week, do mostly Part 3 & 4; mark why each wrong option is wrong.</li>
                    <li><strong>Synonym Hunter</strong> — Underline key words in questions; use transcript to write the synonym/paraphrase used in audio.</li>
                  </ul>
                  <p><strong>AI support:</strong> Paste questions + transcript: &quot;Show me the keyword and paraphrased phrase for each item.&quot;</p>
                  <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-sm"><strong>Examiner Tip:</strong> Band 7 candidates follow meaning and recognise paraphrases — they do not wait for exact words.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="7-8" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">7 → 8: Complexity (Refinement)</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm text-muted-foreground space-y-3">
                  <p><strong>What to fix:</strong> Fast academic content; spelling/word-limit slips.</p>
                  <p><strong>Human drills:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Hard‑Mode Input</strong> — TED Talks slightly harder than IELTS; listen 5–10 mins, write 5–6 bullet summary.</li>
                    <li><strong>Macro‑Tracking</strong> — Write only topic changes: &quot;Problem → Cause → Solution&quot;.</li>
                  </ul>
                  <p><strong>AI support:</strong> Ask: &quot;Compare my summary with this transcript. Which key points did I miss?&quot;</p>
                  <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-sm"><strong>Examiner Tip:</strong> At Band 8, keep the overall argument clear — you don&apos;t need every detail.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="8-9" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">8 → 9: Precision (Psychology)</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm text-muted-foreground space-y-3">
                  <p><strong>What to fix:</strong> Tiny slips, exam‑day nerves, consistency.</p>
                  <p><strong>Human drills:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Error Log</strong> — Record every wrong answer: Part, question type, reason (spelling, distractor, speed).</li>
                    <li><strong>40‑Question Marathons</strong> — Once a week, full test with zero pauses; review only unsure questions.</li>
                  </ul>
                  <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-sm"><strong>Examiner Tip:</strong> Band 9 listeners make few skill mistakes; most errors are 1–2 careless slips. Reduce avoidable slips.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Band Comparison */}
        <AccordionItem value="bands" className="border rounded-lg px-4 mb-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            2. Band Comparison – &quot;Where You Are Now&quot;
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Parts 3–4</TableHead>
                  <TableHead>Typical (40)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>5</TableCell><TableCell>Modest — main idea & simple details; struggles when fast</TableCell><TableCell>Loses track; many guesses</TableCell><TableCell>15–19</TableCell></TableRow>
                <TableRow><TableCell>6</TableCell><TableCell>Competent — familiar topics; misses details in fast parts</TableCell><TableCell>Follows main ideas; often wrong with paraphrasing</TableCell><TableCell>23–25</TableCell></TableRow>
                <TableRow><TableCell>7</TableCell><TableCell>Good — complex language & reasoning; some overload in dense lectures</TableCell><TableCell>Generally accurate; misses difficult distractors</TableCell><TableCell>30–31</TableCell></TableRow>
                <TableRow><TableCell>8</TableCell><TableCell>Very Good — fully operational; mistakes with unfamiliar topics</TableCell><TableCell>Handles debates & lectures confidently</TableCell><TableCell>35–36</TableCell></TableRow>
                <TableRow><TableCell>9</TableCell><TableCell>Expert — audio feels slow and clear</TableCell><TableCell>Masters nuance, tone, detailed argument</TableCell><TableCell>39–40</TableCell></TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-3"><strong>Self‑Check:</strong> Compare your last 3 tests to this table and select your current band as your starting move.</p>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Test Structure */}
        <AccordionItem value="structure" className="border rounded-lg px-4 mb-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            3. Test Structure & Context – &quot;Know the Battlefield&quot;
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">IELTS Listening Scores (correct → band)</h4>
              <p className="text-sm text-muted-foreground">39–40 = 9 | 37–38 = 8.5 | 35–36 = 8 | 32–34 = 7.5 | 30–31 = 7 | 26–29 = 6.5 | 23–25 = 6 | 18–22 = 5.5 | 16–17 = 5</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead>Situation</TableHead>
                  <TableHead>Speakers</TableHead>
                  <TableHead>Skills Tested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>1</TableCell><TableCell>Everyday info exchange</TableCell><TableCell>2</TableCell><TableCell>Numbers, dates, spelling, corrections</TableCell></TableRow>
                <TableRow><TableCell>2</TableCell><TableCell>Informational talk</TableCell><TableCell>1</TableCell><TableCell>Directions, descriptions, organisation</TableCell></TableRow>
                <TableRow><TableCell>3</TableCell><TableCell>Academic discussion</TableCell><TableCell>2–4</TableCell><TableCell>Multiple opinions, agreement/disagreement</TableCell></TableRow>
                <TableRow><TableCell>4</TableCell><TableCell>Academic lecture</TableCell><TableCell>1</TableCell><TableCell>Signpost language, dense content, key points</TableCell></TableRow>
              </TableBody>
            </Table>
            <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <p className="text-sm">Each part uses different traps. Training with only one type (e.g. lectures) leaves gaps.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. One-Page Strategy by Part */}
        <AccordionItem value="strategy" className="border rounded-lg px-4 mb-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            4. &quot;One‑Page Strategy&quot; by Part
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="p1" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">Part 1 – Customer Service / Bookings</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm space-y-2">
                  <p><strong>Train:</strong> Sketch a form (Name, Date, Address, Phone); listen once, fill live; use transcript to audit corrections.</p>
                  <p><strong>Drill:</strong> Form‑Filling — play once; use short replay bursts only for tricky lines.</p>
                  <p className="text-amber-600"><strong>Trap:</strong> Spelling and numbers. Practise names from different countries.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p2" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">Part 2 – Solo Podcasts (1 speaker)</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm space-y-2">
                  <p><strong>Train:</strong> Predict 5 ideas before listening; listen once, write one keyword per idea; 3‑sentence summary from memory, then add phrases from transcript.</p>
                  <p><strong>Drill:</strong> 3‑Sentence Summary Commute — play one clip, speak/write summary without replay.</p>
                  <p className="text-amber-600"><strong>Tip:</strong> Questions test structure (beginning, middle, end). Spot signposts: &quot;Now let&apos;s move on to…&quot;, &quot;Finally…&quot;</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p3" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">Part 3 – Panel Debates (2–4 speakers)</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm space-y-2">
                  <p><strong>Train:</strong> Assign letters (H, C, S); note one keyword per speaker turn; write 1–2 sentences per person; create &quot;Who thinks X?&quot; questions.</p>
                  <p><strong>Drill:</strong> Distractor Elimination — make MCQs with 1 correct + 3 &quot;wrong but similar&quot; options; underline why wrong.</p>
                  <p className="text-amber-600"><strong>Tip:</strong> Who said what matters. Tie each opinion to a person.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p4" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm py-3">Part 4 – TED Talks / Lectures</AccordionTrigger>
                <AccordionContent className="pb-3 text-sm space-y-2">
                  <p><strong>Train:</strong> Predict structure (Intro → Main → Conclusion); after listening, bullet outline with keywords only; hunt signposts (Moving on to…, In contrast…).</p>
                  <p><strong>Drill:</strong> Marathon Method — Week 1: 5‑min talk; Week 3: 10‑min; Week 5: 15+ min. Focus on logic and structure.</p>
                  <p className="text-amber-600"><strong>Tip:</strong> Questions follow order. If you miss one, move on quickly.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Question Types & Skills */}
        <AccordionItem value="skills" className="border rounded-lg px-4 mb-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            5. Question Types & Skills Cheatsheet
          </AccordionTrigger>
          <AccordionContent className="pb-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Question Type</TableHead>
                  <TableHead>Pro Strategy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Predicting</TableCell><TableCell>Completion</TableCell><TableCell>Check word limit; think noun/verb/number before listening</TableCell></TableRow>
                <TableRow><TableCell>Signposting</TableCell><TableCell>Sentence summary</TableCell><TableCell>Listen for synonyms; don&apos;t wait for exact words</TableCell></TableRow>
                <TableRow><TableCell>Decoding</TableCell><TableCell>Multiple choice</TableCell><TableCell>Underline differences; ignore obvious distractors</TableCell></TableRow>
                <TableRow><TableCell>Paraphrasing</TableCell><TableCell>Matching</TableCell><TableCell>Use initials for speakers; note &quot;I disagree&quot; etc.</TableCell></TableRow>
                <TableRow><TableCell>Multitasking</TableCell><TableCell>Map/plan labelling</TableCell><TableCell>Mentally &quot;walk the route&quot; before recording</TableCell></TableRow>
                <TableRow><TableCell>Stamina</TableCell><TableCell>All</TableCell><TableCell>Full tests; no pausing, no checking phone</TableCell></TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-3"><strong>Mini Task:</strong> After each mock, mark which skill cost most marks. Train that skill for the next 2–3 sessions.</p>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Quick Human+AI Routine */}
        <AccordionItem value="routine" className="border rounded-lg px-4 mb-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            6. Quick Human+AI Routine (Daily 20–30 mins)
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li><strong>Warm‑up (3 mins)</strong> — Play 1–2 minutes and shadow aloud.</li>
              <li><strong>Focused Drill (12–15 mins)</strong> — Choose one part (1–4) and do one of the drills above.</li>
              <li><strong>AI Review (5–10 mins)</strong> — Paste answers + transcript. Ask: &quot;Which answers are wrong and why?&quot; / &quot;Show paraphrases for each correct answer.&quot; / &quot;Generate 3 more questions of the same type.&quot;</li>
              <li><strong>Error Log (2 mins)</strong> — Add mistakes under: Decoding / Strategy / Stamina.</li>
            </ol>
            <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <p className="text-sm"><strong>Examiner Tip:</strong> Consistency beats cramming. Daily short sessions with human practice + AI feedback move you up faster than random full tests once a week.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
