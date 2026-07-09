import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Bot, User, Sparkles, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  taskType: string;
  questionPrompt: string;
  userEssay?: string;
  feedback?: any;
}

// Renders **bold**, *italic*, `code` inline
function InlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      parts.push(<strong key={key++} className="font-semibold text-foreground">{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<em key={key++}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      parts.push(<code key={key++} className="bg-secondary/70 px-1 rounded text-[11px] font-mono">{match[3]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

function MessageContent({ content, showCursor }: { content: string; showCursor?: boolean }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-0.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        if (line === "") return <div key={i} className="h-1.5" />;
        if (line.startsWith("> ")) {
          return (
            <div key={i} className="border-l-2 border-accent/40 pl-2 italic text-foreground/70">
              <InlineText text={line.slice(2)} />{isLast && showCursor && <Cursor />}
            </div>
          );
        }
        if (/^[-*•] /.test(line)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-accent/60 shrink-0 mt-0.5">•</span>
              <span><InlineText text={line.replace(/^[-*•] /, "")} />{isLast && showCursor && <Cursor />}</span>
            </div>
          );
        }
        if (/^\d+\. /.test(line)) {
          const dotIdx = line.indexOf(". ");
          return (
            <div key={i} className="flex gap-2">
              <span className="text-accent/60 shrink-0">{line.slice(0, dotIdx + 1)}</span>
              <span><InlineText text={line.slice(dotIdx + 2)} />{isLast && showCursor && <Cursor />}</span>
            </div>
          );
        }
        return <div key={i}><InlineText text={line} />{isLast && showCursor && <Cursor />}</div>;
      })}
    </div>
  );
}

function Cursor() {
  return <span className="inline-block w-0.5 h-[1em] bg-accent/70 animate-pulse ml-px align-middle" />;
}

function buildFeedbackSummary(feedback: any): string {
  if (!feedback) return "";
  const lines: string[] = [`Overall Band: ${feedback.overallBand}`];
  if (feedback.scoringGrid) {
    const g = feedback.scoringGrid;
    const fmt = (j: any) => Array.isArray(j) ? j.join(" ") : j ?? "";
    if (g.taskResponse)      lines.push(`Task Response: ${g.taskResponse.score} — ${fmt(g.taskResponse.justification)}`);
    if (g.coherenceCohesion) lines.push(`Coherence & Cohesion: ${g.coherenceCohesion.score} — ${fmt(g.coherenceCohesion.justification)}`);
    if (g.lexicalResource)   lines.push(`Lexical Resource: ${g.lexicalResource.score} — ${fmt(g.lexicalResource.justification)}`);
    if (g.grammaticalRange)  lines.push(`Grammatical Range: ${g.grammaticalRange.score} — ${fmt(g.grammaticalRange.justification)}`);
  }
  if (feedback.criticalFixes?.length) {
    lines.push("Critical fixes: " + feedback.criticalFixes.slice(0, 3).join(" | "));
  }
  return lines.join("\n");
}

function buildSystemContext(
  taskType: string,
  questionPrompt: string,
  userEssay?: string,
  feedbackSummary?: string,
): string {
  const hasEssay = !!userEssay?.trim();
  const hasFeedback = !!feedbackSummary?.trim();

  return `You are an expert IELTS writing tutor embedded inside Engvolve. You know IELTS band descriptors, task requirements, grammar, and academic vocabulary deeply.

You can answer ANY question about IELTS, English writing, grammar, vocabulary, essay structure, exam strategy, or English language learning. You use official IELTS guidelines and logic to guide the student.

You have full context of what the student is working on right now:

TASK TYPE: ${taskType}

QUESTION:
"""
${questionPrompt.trim()}
"""
${hasEssay ? `\nSTUDENT'S ESSAY:\n"""\n${userEssay!.trim()}\n"""` : "\nThe student has not written their essay yet."}
${hasFeedback ? `\nFEEDBACK ALREADY GIVEN:\n${feedbackSummary}` : ""}

HOW TO RESPOND:
- Answer the student's question directly and helpfully using your IELTS expertise
- When useful, tie your answer back to the specific question or essay above
- Be concise: 2–4 short paragraphs or a clear bullet list. Never write a wall of text
- Be honest about band-level realities — don't inflate expectations
- If the student writes in Bahasa Indonesia, reply in Bahasa Indonesia
- For completely off-topic questions (nothing to do with IELTS, English, or studying), politely redirect

CRITICAL — NEVER WRITE THEIR ESSAY FOR THEM:
- Do NOT produce full example sentences, model paragraphs, or complete answers unprompted
- When a student asks "how do I start?" or "what should I write?", give them the STRATEGY and STRUCTURE only (e.g. what to include, in what order, what vocabulary type to use), then end with "Now give it a go — write your opening sentence/paragraph and I'll give you feedback on it."
- If they share a sentence or paragraph they wrote, THEN you can analyse it, point out weaknesses, and suggest a targeted improvement to that specific sentence
- The only time you may write an example sentence is to CORRECT a specific sentence the student has already written — and even then, keep it to one sentence, not a whole paragraph
- Your goal is to build their thinking skills, not give them something to copy. Always push them to write first.

${!hasEssay
  ? "The student is planning their response. Give structural guidance and what examiners want — then ask them to write their first sentence/paragraph before going further."
  : !hasFeedback
  ? "The student has a draft. Analyse what they have written and give targeted feedback on it. Do not rewrite it for them — ask them to revise specific parts themselves."
  : "The student has received feedback. Explain the scores and help them understand WHY they lost marks. Ask them to attempt a rewrite of weak sections before you comment further."}`;
}

function getWelcomeMessage(hasEssay: boolean, hasFeedback: boolean, taskType: string): string {
  if (hasFeedback) {
    return `I've read your essay and the full feedback. Ask me anything — "why did coherence drop?", "rewrite this sentence", "what's a Band 8 version of my intro?" — I'll walk you through it.`;
  }
  if (hasEssay) {
    return `I can see your draft. Ask me to review it, spot weak sentences, suggest better vocabulary, or explain what the examiner is looking for before you submit.`;
  }
  return `I know this ${taskType} question inside out. Ask me how to structure your answer, what vocabulary scores well, how to write an overview, or anything else before you start.`;
}

export const WritingAIChat = ({ taskType, questionPrompt, userEssay, feedback }: Props) => {
  const hasFeedback = !!feedback;
  const hasEssay = !!(userEssay?.trim());

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: getWelcomeMessage(hasEssay, hasFeedback, taskType) },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);

  // Drag-to-resize
  const [width, setWidth] = useState(380);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // When context changes (essay starts, feedback arrives), append a note instead of clearing history
  const prevKey = useRef(`${hasEssay}-${hasFeedback}`);
  useEffect(() => {
    const key = `${hasEssay}-${hasFeedback}`;
    if (key === prevKey.current) return;
    const [prevEssayStr] = prevKey.current.split("-");
    const prevHasEssay = prevEssayStr === "true";
    prevKey.current = key;

    if (!prevHasEssay && hasEssay && !hasFeedback) {
      setMessages(m => [...m, {
        role: "assistant",
        content: "I can see you've started writing. Keep going — share what you have and I'll give you targeted feedback on it.",
      }]);
    } else if (hasFeedback) {
      setMessages(m => [...m, {
        role: "assistant",
        content: "Your feedback is in. Ask me to explain any score, or share a sentence you want to improve.",
      }]);
    }
  }, [hasEssay, hasFeedback, taskType]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streamingContent]);

  // Cleanup typewriter on unmount
  useEffect(() => () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
  }, []);

  const startTypewriter = useCallback((text: string) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    let pos = 0;
    setStreamingContent("");
    streamTimerRef.current = setInterval(() => {
      pos = Math.min(pos + 6, text.length);
      setStreamingContent(text.slice(0, pos));
      if (pos >= text.length) {
        clearInterval(streamTimerRef.current!);
        streamTimerRef.current = null;
        setMessages(prev => [...prev, { role: "assistant", content: text }]);
        setStreamingContent(null);
      }
    }, 18);
  }, []);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = width;

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - ev.clientX;
      const maxW = Math.min(640, Math.floor(window.innerWidth * 0.45));
      setWidth(Math.min(maxW, Math.max(280, dragStartWidth.current + delta)));
    };
    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [width]);

  const isBusy = isLoading || streamingContent !== null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isBusy) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Claude API requires the first message to be role "user"
      const firstUserIdx = updatedMessages.findIndex(m => m.role === "user");
      const apiMessages = firstUserIdx >= 0 ? updatedMessages.slice(firstUserIdx) : updatedMessages;

      const { data, error } = await supabase.functions.invoke("writing-tutor", {
        body: {
          messages: apiMessages,
          taskType,
          questionPrompt,
          userEssay,
          feedbackSummary: buildFeedbackSummary(feedback),
        },
      });

      if (error) throw error;
      const reply = data?.data?.reply ?? data?.reply;
      if (!reply) throw new Error("Empty response from tutor");
      startTypewriter(reply);
    } catch (err) {
      console.error("Writing tutor error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ width }} className="relative flex shrink-0">
      {/* Drag handle */}
      <div
        onMouseDown={onDragStart}
        className="absolute left-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-col-resize group z-10 select-none"
        title="Drag to resize"
      >
        <div className="w-0.5 h-12 rounded-full bg-border/40 group-hover:bg-accent/60 transition-colors" />
        <GripVertical className="absolute w-3 h-3 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
      </div>

      {/* Chat panel */}
      <div className="glass-card flex flex-col ml-3 w-full" style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}>
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/30 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-none">IELTS Writing Tutor</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {hasFeedback ? "Feedback mode" : hasEssay ? "Draft review mode" : "Planning mode"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Context pill */}
        <div className="px-4 py-2 border-b border-border/20 shrink-0">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Context: </span>
          <span className="text-[10px] text-accent/80">{taskType}</span>
          {hasEssay && <span className="text-[10px] text-foreground/40"> · essay loaded</span>}
          {hasFeedback && <span className="text-[10px] text-green-400/60"> · feedback loaded</span>}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                msg.role === "assistant" ? "bg-accent/15" : "bg-secondary"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-3 h-3 text-accent" />
                  : <User className="w-3 h-3 text-muted-foreground" />}
              </div>
              <div className={`rounded-xl px-3 py-2 max-w-[85%] ${
                msg.role === "assistant"
                  ? "bg-secondary/40 text-foreground/90"
                  : "bg-accent/15 text-foreground text-sm leading-relaxed"
              }`}>
                {msg.role === "assistant"
                  ? <MessageContent content={msg.content} />
                  : msg.content}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-accent/15 shrink-0 flex items-center justify-center mt-0.5">
                <Bot className="w-3 h-3 text-accent" />
              </div>
              <div className="bg-secondary/40 rounded-xl px-3 py-2.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Typewriter streaming message */}
          {streamingContent !== null && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-accent/15 shrink-0 flex items-center justify-center mt-0.5">
                <Bot className="w-3 h-3 text-accent" />
              </div>
              <div className="bg-secondary/40 text-foreground/90 rounded-xl px-3 py-2 max-w-[85%]">
                <MessageContent content={streamingContent} showCursor />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border/30 shrink-0">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about IELTS writing..."
              className="resize-none text-sm bg-secondary/30 border-border/30 min-h-[40px] max-h-[100px]"
              rows={1}
            />
            <Button
              size="sm"
              onClick={sendMessage}
              disabled={isBusy || !input.trim()}
              className="shrink-0 h-10 w-10 p-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};
