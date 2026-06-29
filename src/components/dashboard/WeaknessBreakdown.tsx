import { Link } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";

export interface WeaknessItem {
  label: string;
  detail: string;
  noteSlug?: string;
  noteLabel?: string;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
  tfng: "True / False / Not Given",
  ynng: "Yes / No / Not Given",
  multiple_choice: "Multiple Choice",
  matching_headings: "Matching Headings",
  matching_features: "Matching Features",
  matching_information: "Matching Information",
  note_completion: "Note Completion",
  summary_completion: "Summary Completion",
  sentence_completion: "Sentence Completion",
  short_answer: "Short Answer",
  map_labeling: "Map Labelling",
  plan_labeling: "Plan Labelling",
  form_completion: "Form Completion",
  table_completion: "Table Completion",
  flow_chart_completion: "Flow-chart Completion",
  matching: "Matching",
  multiple_choice_multiple: "Multiple Choice (Multiple Answers)",
};

const READING_NOTE_MAP: Record<string, { slug: string; label: string }> = {
  tfng:                   { slug: "vocabulary-passages",       label: "Reading for Detail" },
  ynng:                   { slug: "vocabulary-passages",       label: "Reading for Detail" },
  multiple_choice:        { slug: "vocabulary-passages",       label: "Vocabulary in Context" },
  matching_headings:      { slug: "paragraph-structuring",     label: "Paragraph Structure" },
  matching_features:      { slug: "collocations-paraphrasing", label: "Paraphrasing" },
  matching_information:   { slug: "collocations-paraphrasing", label: "Paraphrasing" },
  note_completion:        { slug: "sentence-structure",        label: "Sentence Structure" },
  summary_completion:     { slug: "sentence-structure",        label: "Sentence Structure" },
  sentence_completion:    { slug: "sentence-structure",        label: "Sentence Structure" },
  short_answer:           { slug: "vocabulary-passages",       label: "Vocabulary in Context" },
  table_completion:       { slug: "sentence-structure",        label: "Sentence Structure" },
  flow_chart_completion:  { slug: "linking-words-coherence",   label: "Linking Words" },
};

const LISTENING_NOTE_MAP: Record<string, { slug: string; label: string }> = {
  multiple_choice:              { slug: "vocabulary-passages",       label: "Vocabulary in Context" },
  multiple_choice_multiple:     { slug: "vocabulary-passages",       label: "Vocabulary in Context" },
  note_completion:              { slug: "sentence-structure",        label: "Sentence Structure" },
  form_completion:              { slug: "sentence-structure",        label: "Sentence Structure" },
  table_completion:             { slug: "sentence-structure",        label: "Sentence Structure" },
  summary_completion:           { slug: "sentence-structure",        label: "Sentence Structure" },
  flow_chart_completion:        { slug: "linking-words-coherence",   label: "Linking Words" },
  matching:                     { slug: "collocations-paraphrasing", label: "Paraphrasing" },
  map_labeling:                 { slug: "text-types",                label: "Spatial Language" },
  plan_labeling:                { slug: "text-types",                label: "Spatial Language" },
};

const WRITING_NOTE_MAP: Record<string, { slug: string; label: string }> = {
  taskResponse:       { slug: "paragraph-structuring",   label: "PEEL Paragraph Structure" },
  coherenceCohesion:  { slug: "linking-words-coherence", label: "Linking Words & Coherence" },
  lexicalResource:    { slug: "vocabulary-passages",     label: "Vocabulary Range" },
  grammaticalRange:   { slug: "sentence-structure",      label: "Sentence Structure" },
};

const SPEAKING_NOTE_MAP: Record<string, { slug: string; label: string }> = {
  fluencyCoherence:  { slug: "linking-words-coherence",   label: "Linking Words & Coherence" },
  lexicalResource:   { slug: "collocations-paraphrasing", label: "Collocations & Vocabulary" },
  grammaticalRange:  { slug: "sentence-structure",        label: "Sentence Structure" },
  taskResponse:      { slug: "paragraph-structuring",     label: "PEEL Paragraph Structure" },
};

export type NoteMap = "reading" | "listening" | "writing" | "speaking";

interface Props {
  items: Array<{ type: string; count: number }>;
  noteMap: NoteMap;
  max?: number;
}

function getMap(nm: NoteMap) {
  if (nm === "reading")  return READING_NOTE_MAP;
  if (nm === "listening") return LISTENING_NOTE_MAP;
  if (nm === "writing")  return WRITING_NOTE_MAP;
  return SPEAKING_NOTE_MAP;
}

export function WeaknessBreakdown({ items, noteMap, max = 2 }: Props) {
  const map = getMap(noteMap);

  const ranked = [...items]
    .filter((i) => i.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, max);

  if (ranked.length === 0) return null;

  return (
    <div className="glass-card p-4 border border-destructive/20 bg-destructive/5 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-foreground">Focus areas</span>
      </div>
      <div className="space-y-2">
        {ranked.map((item) => {
          const typeLabel = QUESTION_TYPE_LABELS[item.type] ?? item.type;
          const note = map[item.type];
          return (
            <div key={item.type} className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive font-medium">{item.count}</span> missed{" "}
                {typeLabel} question{item.count !== 1 ? "s" : ""}
              </p>
              {note && (
                <Link
                  to={`/dashboard/revision-notes?topic=${note.slug}`}
                  className="flex items-center gap-1 text-xs text-accent hover:underline shrink-0"
                >
                  Review: {note.label}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface WritingWeaknessProps {
  scoringGrid?: {
    taskResponse?: { score: number };
    coherenceCohesion?: { score: number };
    lexicalResource?: { score: number };
    grammaticalRange?: { score: number };
  };
  max?: number;
}

export function WritingWeaknessBreakdown({ scoringGrid, max = 2 }: WritingWeaknessProps) {
  if (!scoringGrid) return null;

  const criteria = [
    { type: "taskResponse",      score: scoringGrid.taskResponse?.score },
    { type: "coherenceCohesion", score: scoringGrid.coherenceCohesion?.score },
    { type: "lexicalResource",   score: scoringGrid.lexicalResource?.score },
    { type: "grammaticalRange",  score: scoringGrid.grammaticalRange?.score },
  ]
    .filter((c) => c.score !== undefined)
    .sort((a, b) => (a.score ?? 9) - (b.score ?? 9))
    .slice(0, max);

  if (criteria.length === 0) return null;

  const CRITERION_LABELS: Record<string, string> = {
    taskResponse:      "Task Achievement",
    coherenceCohesion: "Coherence & Cohesion",
    lexicalResource:   "Lexical Resource",
    grammaticalRange:  "Grammatical Range",
  };

  return (
    <div className="glass-card p-4 border border-destructive/20 bg-destructive/5 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-foreground">Weakest criteria</span>
      </div>
      <div className="space-y-2">
        {criteria.map((c) => {
          const note = WRITING_NOTE_MAP[c.type];
          return (
            <div key={c.type} className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive font-medium">Band {c.score?.toFixed(1)}</span>{" "}
                {CRITERION_LABELS[c.type]}
              </p>
              {note && (
                <Link
                  to={`/dashboard/revision-notes?topic=${note.slug}`}
                  className="flex items-center gap-1 text-xs text-accent hover:underline shrink-0"
                >
                  Review: {note.label}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SpeakingWeaknessProps {
  feedback: {
    fluencyCoherence?: { score?: number };
    lexicalResource?: { score?: number };
    grammaticalRange?: { score?: number };
    taskResponse?: { score?: number };
  };
}

export function SpeakingWeaknessBreakdown({ feedback }: SpeakingWeaknessProps) {
  const criteria = [
    { type: "fluencyCoherence", score: feedback.fluencyCoherence?.score },
    { type: "lexicalResource",  score: feedback.lexicalResource?.score },
    { type: "grammaticalRange", score: feedback.grammaticalRange?.score },
    { type: "taskResponse",     score: feedback.taskResponse?.score },
  ]
    .filter((c) => c.score !== undefined)
    .sort((a, b) => (a.score ?? 9) - (b.score ?? 9))
    .slice(0, 1);

  if (criteria.length === 0) return null;

  const CRITERION_LABELS: Record<string, string> = {
    fluencyCoherence: "Fluency & Coherence",
    lexicalResource:  "Lexical Resource",
    grammaticalRange: "Grammatical Range & Accuracy",
    taskResponse:     "Task Response",
  };

  return (
    <div className="glass-card p-4 border border-destructive/20 bg-destructive/5">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-foreground">Biggest gap</span>
      </div>
      <div className="space-y-2">
        {criteria.map((c) => {
          const note = SPEAKING_NOTE_MAP[c.type];
          return (
            <div key={c.type} className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive font-medium">Band {c.score?.toFixed(1)}</span>{" "}
                {CRITERION_LABELS[c.type]}
              </p>
              {note && (
                <Link
                  to={`/dashboard/revision-notes?topic=${note.slug}`}
                  className="flex items-center gap-1 text-xs text-accent hover:underline shrink-0"
                >
                  Review: {note.label}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
