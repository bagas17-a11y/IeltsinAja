import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function ExaminerTip({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <p className="text-sm font-semibold text-amber-200 mb-2">Examiner Tip</p>
      <p className="text-sm text-foreground/95 leading-relaxed">{children}</p>
    </div>
  );
}

export function WorkedExample({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 border-l-4 border-[#3b5bdb] bg-[#3b5bdb]/10 pl-4 py-2 rounded-r">
      <p className="text-xs font-semibold text-[#93c5fd] uppercase tracking-wide mb-1">
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
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="bg-muted/50 text-foreground font-semibold"
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
              className={cn(
                "border-border",
                i % 2 === 1 && "bg-muted/20"
              )}
            >
              {row.map((cell, j) => (
                <TableCell key={j} className="text-foreground/90">
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
