import { ReactNode, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lightbulb, PenLine, BookOpen, ChevronDown, ChevronUp, CheckCircle2, XCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_GLOW = "#3b82f6";

export function SectionTitle({
  number,
  title,
  className,
}: {
  number: number;
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "flex items-baseline gap-3 mt-8 mb-3 text-lg font-bold text-foreground border-b border-border pb-2 first:mt-0",
        className
      )}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold bg-blue-500/20 text-blue-500"
        style={{ boxShadow: "0 0 12px rgba(59, 130, 246, 0.2)" }}
      >
        {number}
      </span>
      {title}
    </h2>
  );
}

export function SubSectionTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-base font-semibold text-foreground mt-4 mb-2 tracking-tight",
        className
      )}
    >
      {title}
    </h3>
  );
}

export function KeyList({
  items,
  className,
}: {
  items: (ReactNode | string)[];
  className?: string;
}) {
  return (
    <ul className={cn("list-disc pl-5 space-y-1.5 text-sm text-foreground/80", className)}>
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {typeof item === "string" ? item : item}
        </li>
      ))}
    </ul>
  );
}

export function MiniPractice({
  title,
  prompt,
  modelLabel = "Model answer",
  model,
  modelItems,
  collapsibleModel = true,
  defaultModelVisible = false,
  inputMode = "free",
  className,
}: {
  title: string;
  prompt: ReactNode;
  modelLabel?: string;
  model?: ReactNode;
  modelItems?: ReactNode[];
  collapsibleModel?: boolean;
  defaultModelVisible?: boolean;
  inputMode?: "none" | "free";
  className?: string;
}) {
  const [showModel, setShowModel] = useState(defaultModelVisible);
  const hasModel = model || (modelItems && modelItems.length > 0);
  const isRevealed = !collapsibleModel || showModel;

  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden bg-secondary/60",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-blue-500/10">
        <BookOpen className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-semibold text-blue-600">{title}</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="text-sm text-foreground/80">{prompt}</div>
        {inputMode === "free" && (
          <div>
            <textarea
              placeholder="Type your answer here…"
              className="w-full min-h-[80px] rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              rows={3}
            />
          </div>
        )}
        {hasModel && (
          <div>
            {collapsibleModel && !isRevealed ? (
              <button
                type="button"
                onClick={() => setShowModel(true)}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
                Reveal {modelLabel.toLowerCase()}
              </button>
            ) : collapsibleModel ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowModel(false)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-2"
                >
                  <ChevronUp className="h-3 w-3" />
                  Hide answer
                </button>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                    {modelLabel}
                  </p>
                  {model && <p className="text-sm text-foreground/90">{model}</p>}
                  {modelItems && (
                    <ol className="list-decimal pl-4 space-y-1.5 text-sm text-foreground/90">
                      {modelItems.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                  {modelLabel}
                </p>
                {model && <p className="text-sm text-foreground/90">{model}</p>}
                {modelItems && (
                  <ol className="list-decimal pl-4 space-y-1.5 text-sm text-foreground/90">
                    {modelItems.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DefinitionCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/80 bg-secondary/50 p-4 text-foreground",
        className
      )}
    >
      {title && (
        <h3 className="text-base font-semibold text-foreground mb-3">{title}</h3>
      )}
      <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}

export function ExaminerTip({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-emerald-500/40 bg-emerald-500/6 p-3.5 relative overflow-hidden">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
          <Lightbulb className="h-3.5 w-3.5 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-600 mb-1">
            Examiner Tip
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}

export function WorkedExample({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-3 rounded-r-lg border-l-2 pl-3 py-2 pr-3"
      style={{
        borderLeftColor: PRIMARY_GLOW,
        backgroundColor: "rgba(59, 130, 246, 0.06)",
      }}
    >
      <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <PenLine className="h-3 w-3" />
        Worked Example
      </p>
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  );
}

export function RevisionTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border bg-secondary/60">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="h-11 px-4 text-left text-sm font-medium text-muted-foreground border-b border-border bg-secondary/80"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              className="border-b border-border border-l-0 border-r-0 hover:bg-secondary/30 transition-colors"
            >
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  className="px-4 py-3 text-sm text-foreground/90 border-0"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function MistakeRow({
  wrong,
  correct,
}: {
  wrong: string;
  correct: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1.5 text-sm">
      <span className="text-red-500">✗</span>
      <span className="text-foreground/70">&quot;{wrong}&quot;</span>
      <span className="text-muted-foreground">→</span>
      <span className="text-emerald-500">✓ &quot;{correct}&quot;</span>
    </div>
  );
}

// WorksheetQuestion — single question with input + check
export function WorksheetQuestion({
  number,
  question,
  modelAnswer,
  accepted,
  multiline = false,
}: {
  number: number;
  question: string;
  modelAnswer: string;
  accepted?: string[];   // if provided, auto-checks the student's answer
  multiline?: boolean;
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  const isAutoCheck = accepted && accepted.length > 0;
  const normalise = (s: string) => s.trim().toLowerCase().replace(/[""]/g, '"').replace(/['']/g, "'");
  const isCorrect = isAutoCheck
    ? accepted!.some(a => normalise(a) === normalise(value))
    : null;

  const handleCheck = () => {
    if (!value.trim()) return;
    setChecked(true);
  };

  const handleReset = () => {
    setValue("");
    setChecked(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground/90 leading-relaxed">
        <span className="font-semibold text-muted-foreground mr-1.5">{number}.</span>
        {question}
      </p>
      {!checked ? (
        <div className="flex gap-2 items-start">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={e => setValue(e.target.value)}
              rows={2}
              placeholder="Type your answer here…"
              className="flex-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="Type your answer…"
              className="flex-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          )}
          <button
            onClick={handleCheck}
            disabled={!value.trim()}
            className="shrink-0 rounded-lg bg-blue-500/15 border border-blue-500/30 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check
          </button>
        </div>
      ) : (
        <div className={cn(
          "rounded-lg border px-3 py-2.5 space-y-1.5",
          isAutoCheck
            ? isCorrect
              ? "border-emerald-500/30 bg-emerald-500/8"
              : "border-red-500/30 bg-red-500/8"
            : "border-blue-500/30 bg-blue-500/8"
        )}>
          {isAutoCheck && (
            <div className="flex items-center gap-1.5">
              {isCorrect
                ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-xs font-semibold text-emerald-400">Correct!</span></>
                : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-xs font-semibold text-red-400">Not quite — see the answer below.</span></>
              }
            </div>
          )}
          {(!isAutoCheck || !isCorrect) && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Model answer</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{modelAnswer}</p>
            </>
          )}
          <button onClick={handleReset} className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// WorksheetBlock — groups questions under a title + instruction
export function WorksheetBlock({
  title,
  instruction,
  children,
}: {
  title: string;
  instruction: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-secondary/60">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-blue-500/10">
        <ClipboardList className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-semibold text-blue-600">{title}</span>
      </div>
      <div className="p-4 space-y-1">
        <p className="text-xs text-muted-foreground mb-4">{instruction}</p>
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
