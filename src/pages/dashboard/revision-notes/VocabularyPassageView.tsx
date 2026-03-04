/**
 * Vocabulary passage with pop-up definitions and practice.
 * Phase 1: passage + pop-up definitions + free-type practice (self-check).
 */

import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DefinitionCard,
  SectionTitle,
  SubSectionTitle,
  MiniPractice,
} from "./RevisionNoteContent";
import { VOCABULARY_PASSAGES, type VocabularyPassage } from "@/content/vocabulary/passages";

export function VocabularyPassageView() {
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    VOCABULARY_PASSAGES[0]?.id ?? ""
  );
  const passage = useMemo(
    () => VOCABULARY_PASSAGES.find((p) => p.id === selectedPassageId) ?? VOCABULARY_PASSAGES[0],
    [selectedPassageId]
  );

  if (!passage) return null;

  return (
    <div className="space-y-6">
      <SectionTitle number={1} title="Vocabulary passages" />
      <DefinitionCard>
        <p className="mb-3">
          Read short passages with difficult words. Click or hover on highlighted words
          to see definitions. Then practise using them in your own sentences.
        </p>
      </DefinitionCard>

      <SectionTitle number={2} title="Passage" />
      <div className="space-y-4">
        {VOCABULARY_PASSAGES.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {VOCABULARY_PASSAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPassageId(p.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedPassageId === p.id
                    ? "bg-[#3b82f6]/20 text-blue-300 border border-[#3b82f6]/50"
                    : "bg-[#1e293b]/60 text-slate-400 border border-[#334155] hover:text-slate-300"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}
        <PassageWithDefinitions passage={passage} />
      </div>

      <SectionTitle number={3} title="Practise using the words" />
      <PracticeWords passage={passage} />
    </div>
  );
}

function PassageWithDefinitions({ passage }: { passage: VocabularyPassage }) {
  const parts = useMemo(() => {
    const result: { text: string; word?: { word: string; definition: string } }[] = [];
    let remaining = passage.passage;

    for (const w of passage.words) {
      const idx = remaining.indexOf(w.word);
      if (idx >= 0) {
        if (idx > 0) {
          result.push({ text: remaining.slice(0, idx) });
        }
        result.push({ text: w.word, word: { word: w.word, definition: w.definition } });
        remaining = remaining.slice(idx + w.word.length);
      }
    }
    if (remaining) result.push({ text: remaining });
    return result;
  }, [passage.passage, passage.words]);

  return (
    <div className="rounded-lg border border-[#334155] bg-[#1e293b]/60 p-5 text-slate-200 leading-relaxed">
      <p className="text-base">
        {parts.map((part, i) =>
          part.word ? (
            <Popover key={i}>
              <PopoverTrigger asChild>
                <span
                  className="cursor-help border-b border-dashed border-blue-400/60 text-blue-200 hover:border-blue-400 hover:bg-blue-500/10 px-0.5 rounded"
                  tabIndex={0}
                  role="button"
                >
                  {part.word.word}
                </span>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="max-w-xs bg-[#1e293b] border-[#334155] text-slate-200"
              >
                <p className="font-medium text-blue-200 mb-1">{part.word.word}</p>
                <p className="text-sm text-slate-300">{part.word.definition}</p>
              </PopoverContent>
            </Popover>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </p>
    </div>
  );
}

function PracticeWords({ passage }: { passage: VocabularyPassage }) {
  const practiceWords = passage.words.filter((w) => w.practice !== false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const activeWord = practiceWords[activeWordIndex] ?? practiceWords[0];

  if (practiceWords.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Use the word &quot;{activeWord?.word}&quot; in your own sentence. Compare with the
        definition and check your usage.
      </p>
      <div className="flex gap-2 flex-wrap mb-2">
        {practiceWords.map((w, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveWordIndex(i)}
            className={`px-2 py-1 rounded text-sm ${
              activeWordIndex === i
                ? "bg-blue-500/20 text-blue-300"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {w.word}
          </button>
        ))}
      </div>
      <MiniPractice
        title={`Use &quot;${activeWord?.word}&quot; in a sentence`}
        prompt={
          <>
            <p className="mb-2">Type a sentence using this word, then reveal the definition to check your usage.</p>
            <textarea
              placeholder="Type your sentence here…"
              className="w-full min-h-[80px] rounded-lg border border-[#334155] bg-[#0f172a]/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              rows={3}
            />
          </>
        }
        modelLabel="Definition"
        model={<span>{activeWord?.definition}</span>}
        collapsibleModel={true}
        defaultModelVisible={false}
      />
    </div>
  );
}
