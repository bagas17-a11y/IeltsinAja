import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lightbulb, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD_BG = "bg-[#1e293b]/80";
const PRIMARY_GLOW = "#3b82f6";

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
