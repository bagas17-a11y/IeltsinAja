import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
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

function buildFeedbackSummary(feedback: any): string {
  if (!feedback) return "";
  const lines: string[] = [`Overall Band: ${feedback.overallBand}`];
  if (feedback.scoringGrid) {
    const g = feedback.scoringGrid;
    if (g.taskResponse)      lines.push(`Task Response: ${g.taskResponse.score} — ${Array.isArray(g.taskResponse.justification) ? g.taskResponse.justification.join(" ") : g.taskResponse.justification ?? ""}`);
    if (g.coherenceCohesion) lines.push(`Coherence & Cohesion: ${g.coherenceCohesion.score} — ${Array.isArray(g.coherenceCohesion.justification) ? g.coherenceCohesion.justification.join(" ") : g.coherenceCohesion.justification ?? ""}`);
    if (g.lexicalResource)   lines.push(`Lexical Resource: ${g.lexicalResource.score} — ${Array.isArray(g.lexicalResource.justification) ? g.lexicalResource.justification.join(" ") : g.lexicalResource.justification ?? ""}`);
    if (g.grammaticalRange)  lines.push(`Grammatical Range: ${g.grammaticalRange.score} — ${Array.isArray(g.grammaticalRange.justification) ? g.grammaticalRange.justification.join(" ") : g.grammaticalRange.justification ?? ""}`);
  }
  if (feedback.criticalFixes?.length) {
    lines.push("Critical fixes: " + feedback.criticalFixes.slice(0, 3).join(" | "));
  }
  return lines.join("\n");
}

function getWelcomeMessage(hasEssay: boolean, hasFeedback: boolean, taskType: string): string {
  if (hasFeedback) {
    return `I've read your essay and the full feedback report. Ask me anything — "why did I lose marks on coherence?", "how do I fix my introduction?", or "show me a better version of that sentence."`;
  }
  if (hasEssay) {
    return `I can see your draft. Want me to review it before you submit, suggest improvements, or explain what the examiner is looking for in this ${taskType} question?`;
  }
  return `I know this ${taskType} question inside out. Ask me how to structure your answer, what vocabulary to use, what the examiner expects — anything to help you before you start writing.`;
}

export const WritingAIChat = ({ taskType, questionPrompt, userEssay, feedback }: Props) => {
  const hasFeedback = !!feedback;
  const hasEssay = !!(userEssay?.trim());

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeMessage(hasEssay, hasFeedback, taskType),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset welcome message when context changes (essay submitted, feedback received)
  const prevContextKey = useRef(`${hasEssay}-${hasFeedback}`);
  useEffect(() => {
    const key = `${hasEssay}-${hasFeedback}`;
    if (key !== prevContextKey.current) {
      prevContextKey.current = key;
      setMessages([{
        role: "assistant",
        content: getWelcomeMessage(hasEssay, hasFeedback, taskType),
      }]);
    }
  }, [hasEssay, hasFeedback, taskType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("writing-tutor", {
        body: {
          messages: updatedMessages,
          taskType,
          questionPrompt,
          userEssay: userEssay ?? "",
          feedbackSummary: buildFeedbackSummary(feedback),
        },
      });

      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
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
    <div className="glass-card flex flex-col" style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/30 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-none">IELTS Writing Tutor</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {hasFeedback ? "Feedback mode — ask about your score" : hasEssay ? "Draft mode — reviewing your essay" : "Planning mode — ask before you write"}
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
        <span className="text-[10px] text-accent/80">{taskType} question</span>
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
            <div className={`rounded-xl px-3 py-2 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "assistant"
                ? "bg-secondary/40 text-foreground/90"
                : "bg-accent/15 text-foreground"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

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
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/30 shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about structure, vocabulary, feedback..."
            className="resize-none text-sm bg-secondary/30 border-border/30 min-h-[40px] max-h-[100px]"
            rows={1}
          />
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="shrink-0 h-10 w-10 p-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/40 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
};
