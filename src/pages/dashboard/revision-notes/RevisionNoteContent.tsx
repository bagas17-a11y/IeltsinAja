import { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lightbulb, PenLine, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD_BG = "bg-[#1e293b]/80";
const PRIMARY_GLOW = "#3b82f6";

/** Save My Exams style: numbered section heading (e.g. "1. Overview") */
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
        "flex items-baseline gap-3 mt-8 mb-3 text-lg font-bold text-white border-b border-[#334155] pb-2 first:mt-0",
        className
      )}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
        style={{
          backgroundColor: "rgba(59, 130, 246, 0.25)",
          color: "#93c5fd",
          boxShadow: "0 0 12px rgba(59, 130, 246, 0.2)",
        }}
      >
        {number}
      </span>
      {title}
    </h2>
  );
}

/** Save My Exams style: sub-section (e.g. "2.1 What is a subject?") – prominent so headings lead, not boxes */
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
        "text-base font-semibold text-slate-100 mt-4 mb-2 tracking-tight",
        className
      )}
    >
      {title}
    </h3>
  );
}

/** Key points / bullet list with optional bold terms - clean list style */
export function KeyList({
  items,
  className,
}: {
  items: (ReactNode | string)[];
  className?: string;
}) {
  return (
    <ul className={cn("list-disc pl-5 space-y-1.5 text-sm text-slate-300", className)}>
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {typeof item === "string" ? item : item}
        </li>
      ))}
    </ul>
  );
}

/** Mini Practice block: prompt + collapsible model answer, optional free input */
export function MiniPractice({
  title,
  prompt,
  modelLabel = "Model answer",
  model,
  modelItems,
  collapsibleModel = true,
  defaultModelVisible = false,
  inputMode = "none",
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
        "rounded-xl border border-[#334155] overflow-hidden",
        CARD_BG,
        className
      )}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-[#334155]"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.12)" }}
      >
        <BookOpen className="h-4 w-4 text-blue-300" />
        <span className="text-sm font-semibold text-blue-200">{title}</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="text-sm text-slate-300">{prompt}</div>
        {inputMode === "free" && (
          <div>
            <textarea
              placeholder="Type your answer here…"
              className="w-full min-h-[80px] rounded-lg border border-[#334155] bg-[#0f172a]/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
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
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
                Reveal {modelLabel.toLowerCase()}
              </button>
            ) : collapsibleModel ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowModel(false)}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 mb-2"
                >
                  <ChevronUp className="h-3 w-3" />
                  Hide answer
                </button>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-2">
                    {modelLabel}
                  </p>
                  {model && <p className="text-sm text-slate-200">{model}</p>}
                  {modelItems && (
                    <ol className="list-decimal pl-4 space-y-1.5 text-sm text-slate-200">
                      {modelItems.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-2">
                  {modelLabel}
                </p>
                {model && <p className="text-sm text-slate-200">{model}</p>}
                {modelItems && (
                  <ol className="list-decimal pl-4 space-y-1.5 text-sm text-slate-200">
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

/** Definition / content card – understated so headings stand out */
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
        "rounded-lg border border-[#334155]/80 bg-[#1e293b]/60 p-4 text-white",
        className
      )}
    >
      {title && (
        <h3 className="text-base font-semibold text-white mb-3">{title}</h3>
      )}
      <div className="text-sm text-slate-200 leading-relaxed">{children}</div>
    </div>
  );
}

/** Examiner Tip – subtle border, reduced glow */
export function ExaminerTip({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-4 rounded-lg border p-3.5 relative overflow-hidden"
      style={{
        borderColor: "rgba(34, 197, 94, 0.4)",
        backgroundColor: "rgba(34, 197, 94, 0.06)",
        boxShadow: "0 0 12px rgba(34, 197, 94, 0.08)",
      }}
    >
      <div className="flex gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            boxShadow: "0 0 8px rgba(34, 197, 94, 0.2)",
          }}
        >
          <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-200 mb-1">
            Examiner Tip
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}

/** Worked Example – subtle blue accent, lighter so headings lead */
export function WorkedExample({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-3 rounded-r-lg border-l-2 pl-3 py-2 pr-3"
      style={{
        borderLeftColor: PRIMARY_GLOW,
        backgroundColor: "rgba(59, 130, 246, 0.06)",
      }}
    >
      <p className="text-xs font-medium text-blue-300/90 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <PenLine className="h-3 w-3" />
        Worked Example
      </p>
      <div className="text-sm text-slate-200">{children}</div>
    </div>
  );
}

/** Sleek dark table - no vertical lines, Admin Dashboard style */
export function RevisionTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div
      className={cn(
        "my-6 overflow-x-auto rounded-xl border border-[#334155]",
        CARD_BG
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-[#334155] hover:bg-transparent">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="h-11 px-4 text-left text-sm font-medium text-slate-400 border-b border-[#334155] bg-[#1e293b]"
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
              className="border-b border-[#334155] border-l-0 border-r-0 hover:bg-white/[0.03] transition-colors"
            >
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  className="px-4 py-3 text-sm text-slate-200 border-0"
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

/** Mistake row: wrong (red) → correct (green) */
export function MistakeRow({
  wrong,
  correct,
}: {
  wrong: string;
  correct: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1.5 text-sm">
      <span className="text-red-400/90">✗</span>
      <span className="text-slate-400">&quot;{wrong}&quot;</span>
      <span className="text-slate-500">→</span>
      <span className="text-emerald-400">✓ &quot;{correct}&quot;</span>
    </div>
  );
}
