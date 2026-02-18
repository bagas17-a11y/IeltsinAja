import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lightbulb, PenLine, BookOpen } from "lucide-react";
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
        "flex items-baseline gap-3 mt-10 mb-4 text-lg font-bold text-white border-b border-[#334155] pb-2 first:mt-0",
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

/** Save My Exams style: sub-section (e.g. "2.1 What is a subject?") */
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
        "text-sm font-semibold text-slate-200 mt-5 mb-2 tracking-tight",
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

/** Mini Practice block: prompt + model answer (Save My Exams style) */
export function MiniPractice({
  title,
  prompt,
  modelLabel = "Model improvement",
  model,
  modelItems,
  className,
}: {
  title: string;
  prompt: ReactNode;
  modelLabel?: string;
  model?: ReactNode;
  modelItems?: ReactNode[];
  className?: string;
}) {
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
        {(model || (modelItems && modelItems.length > 0)) && (
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
    </div>
  );
}

/** Definition / content card - Bento style */
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
        "rounded-xl border border-[#334155] bg-[#1e293b]/80 p-5 text-white",
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

/** Examiner Tip with glow border and lightbulb */
export function ExaminerTip({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-6 rounded-xl border-2 p-4 relative overflow-hidden"
      style={{
        borderColor: "rgba(34, 197, 94, 0.5)",
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        boxShadow: "0 0 20px rgba(34, 197, 94, 0.15)",
      }}
    >
      <div className="flex gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            boxShadow: "0 0 12px rgba(34, 197, 94, 0.3)",
          }}
        >
          <Lightbulb className="h-4 w-4 text-emerald-400" />
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

/** Worked Example - blue accent */
export function WorkedExample({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-4 rounded-r-xl border-l-4 pl-4 py-3 pr-4"
      style={{
        borderLeftColor: PRIMARY_GLOW,
        backgroundColor: "rgba(59, 130, 246, 0.08)",
      }}
    >
      <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-2 flex items-center gap-2">
        <PenLine className="h-3.5 w-3.5" />
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
