import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft, BookOpen, Headphones, Mic, PenTool,
  Loader2, RefreshCw, Search, Target, Check, Printer,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Answer key (must match DiagnosticQuiz) ─────────────────────────────────
const READING_CORRECT: Record<string, string> = {
  q1: "iv", q2: "vi", q3: "i",
  q4: "TRUE", q5: "FALSE", q6: "NOT GIVEN",
  q7: "canyon effect", q8: "trees",
  q9: "C", q10: "C",
};

interface DiagnosticRow {
  id: string;
  user_id: string;
  taken_at: string;
  overall_band: number;
  reading_band: number | null;
  reading_score: number | null;
  listening_band: number | null;
  listening_score: number | null;
  writing_band: number | null;
  writing_t1_band: number | null;
  writing_t2_band: number | null;
  writing_t1_feedback: string | null;
  writing_t2_feedback: string | null;
  speaking_band: number | null;
  speaking_feedback: string | null;
  reading_answers: Record<string, string> | null;
  task1_text: string | null;
  task2_text: string | null;
  speaking_transcripts: string[] | null;
  // joined from profiles
  email: string;
  full_name: string | null;
}

function bandColor(band: number | null) {
  if (!band) return "text-muted-foreground";
  if (band >= 7) return "text-emerald-400";
  if (band >= 5.5) return "text-amber-400";
  return "text-red-400";
}

// How stale is this score? Diagnostic results don't update themselves, so a
// score taken months ago may no longer reflect the student's current level.
function stalenessInfo(takenAt: string): { label: string; className: string } {
  const days = differenceInDays(new Date(), new Date(takenAt));
  if (days < 30) return { label: "Fresh", className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" };
  if (days < 90) return { label: `${days}d ago`, className: "text-amber-400 border-amber-400/30 bg-amber-400/10" };
  return { label: `${days}d ago — stale`, className: "text-red-400 border-red-400/30 bg-red-400/10" };
}

function BandBadge({ band }: { band: number | null }) {
  if (!band && band !== 0) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span className={cn("font-bold text-sm", bandColor(band))}>
      {band}
    </span>
  );
}

function printResult(row: DiagnosticRow) {
  const date = row.taken_at
    ? format(new Date(row.taken_at), "d MMMM yyyy")
    : "—";
  const readingAnswers = row.reading_answers ?? {};
  const readingGrid = Object.entries(READING_CORRECT).map(([q, correct]) => {
    const given = (readingAnswers[q] ?? "").trim().toLowerCase();
    const exp   = correct.toLowerCase();
    const ok = q === "q7" || q === "q8"
      ? given.includes(exp) || exp.includes(given)
      : given === exp;
    return `<div style="border:1px solid ${ok ? "#16a34a" : "#dc2626"};background:${ok ? "#f0fdf4" : "#fef2f2"};border-radius:6px;padding:6px 4px;text-align:center;">
      <div style="font-size:9px;color:#6b7280;margin-bottom:2px;">${q.toUpperCase()}</div>
      <div style="font-size:10px;font-weight:700;color:${ok ? "#16a34a" : "#dc2626"};">${ok ? "✓" : correct}</div>
    </div>`;
  }).join("");

  const tier = row.overall_band >= 7 ? "Band 7+ Polishing Plan"
    : row.overall_band >= 5.5 ? "Band 6–7 Developing Plan" : "Band 4–5 Foundation Plan";

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>IELTS Diagnostic — ${row.full_name || row.email}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#1e293b;background:#fff;padding:32px;max-width:760px;margin:0 auto}
  h1{font-size:20px;font-weight:800}
  .subtitle{font-size:12px;color:#64748b;margin-top:2px}
  .band-hero{text-align:center;border:2px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0}
  .band-hero .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600}
  .band-hero .score{font-size:56px;font-weight:900;color:#0f172a;line-height:1}
  .band-hero .rec{font-size:11px;color:#64748b;margin-top:4px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}
  .module-card{border:1px solid #e2e8f0;border-radius:10px;padding:12px}
  .mod-label{font-size:10px;font-weight:700;text-transform:uppercase;color:#64748b;margin-bottom:4px}
  .mod-band{font-size:22px;font-weight:900}
  .mod-sub{font-size:10px;color:#64748b;margin-top:2px}
  .reading-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:10px 0}
  .section{border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:12px 0}
  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
  .fb-row{display:flex;gap:10px;align-items:flex-start;margin:6px 0}
  .fb-label{font-size:10px;font-weight:700;width:44px;color:#64748b;flex-shrink:0}
  .fb-band{font-size:12px;font-weight:700;color:#0f172a}
  .fb-text{font-size:11px;color:#475569;margin-top:2px;line-height:1.45}
  .plan-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:12px 0;text-align:center}
  .plan-label{font-size:11px;color:#64748b;margin-bottom:4px}
  .plan-name{font-size:14px;font-weight:700;color:#0f172a}
  .header-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;border-bottom:1px solid #e2e8f0;padding-bottom:12px}
  .essay-block{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px;font-size:11px;line-height:1.6;margin-top:6px;white-space:pre-wrap}
  .blue{color:#2563eb}.violet{color:#7c3aed}.amber{color:#d97706}.emerald{color:#059669}
  @media print{body{padding:20px}@page{margin:1.5cm}}
</style></head><body>
<div class="header-row">
  <div>
    <h1>IELTS Diagnostic Results</h1>
    <div class="subtitle">Engvolve · ${row.full_name || ""} (${row.email}) · ${date}</div>
  </div>
  <div style="text-align:right;font-size:11px;color:#64748b">Admin Copy</div>
</div>
<div class="band-hero">
  <div class="label">Overall IELTS Band Score</div>
  <div class="score">${row.overall_band}</div>
  <div class="rec">${tier}</div>
</div>
<div class="grid-4">
  <div class="module-card"><div class="mod-label">Reading</div><div class="mod-band blue">Band ${row.reading_band ?? "—"}</div><div class="mod-sub">${row.reading_score ?? "—"}/10 correct</div></div>
  <div class="module-card"><div class="mod-label">Listening</div><div class="mod-band amber">Band ${row.listening_band ?? "—"}</div><div class="mod-sub">${row.listening_score ?? "—"}/6 correct</div></div>
  <div class="module-card"><div class="mod-label">Writing</div><div class="mod-band violet">Band ${row.writing_band ?? "—"}</div><div class="mod-sub">T1: ${row.writing_t1_band ?? "—"} · T2: ${row.writing_t2_band ?? "—"}</div></div>
  <div class="module-card"><div class="mod-label">Speaking</div><div class="mod-band emerald">Band ${row.speaking_band ?? "—"}</div><div class="mod-sub">3 questions</div></div>
</div>
<div class="section">
  <div class="section-title" style="color:#2563eb">Reading — Answer Review</div>
  <div class="reading-grid">${readingGrid}</div>
</div>
<div class="section">
  <div class="section-title" style="color:#7c3aed">Writing — AI Feedback</div>
  <div class="fb-row"><div class="fb-label">Task 1</div><div><div class="fb-band">Band ${row.writing_t1_band ?? "—"}</div>${row.writing_t1_feedback ? `<div class="fb-text">${row.writing_t1_feedback}</div>` : ""}</div></div>
  ${row.task1_text ? `<div class="fb-text" style="margin-top:6px"><strong>Task 1 Response:</strong></div><div class="essay-block">${row.task1_text}</div>` : ""}
  <div class="fb-row" style="margin-top:8px"><div class="fb-label">Task 2</div><div><div class="fb-band">Band ${row.writing_t2_band ?? "—"}</div>${row.writing_t2_feedback ? `<div class="fb-text">${row.writing_t2_feedback}</div>` : ""}</div></div>
  ${row.task2_text ? `<div class="essay-block">${row.task2_text}</div>` : ""}
</div>
<div class="section">
  <div class="section-title" style="color:#059669">Speaking — AI Feedback</div>
  <div class="fb-band">Band ${row.speaking_band ?? "—"}</div>
  ${row.speaking_feedback ? `<div class="fb-text" style="margin-top:4px">${row.speaking_feedback}</div>` : ""}
  ${row.speaking_transcripts?.map((t, i) => `<div style="margin-top:8px"><strong style="font-size:10px">Q${i + 1}:</strong><div class="essay-block">${t || "(no answer)"}</div></div>`).join("") ?? ""}
</div>
<div class="plan-box">
  <div class="plan-label">Recommended Study Plan</div>
  <div class="plan-name">${tier}</div>
</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`;

  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}

export default function AdminDiagnosticResults() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, isCheckingAdmin } = useAuth();
  const { toast } = useToast();

  const [rows, setRows] = useState<DiagnosticRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DiagnosticRow | null>(null);

  useEffect(() => {
    if (!isLoading && !user) { navigate("/auth"); return; }
    if (!isLoading && !isCheckingAdmin && user && !isAdmin) {
      navigate("/dashboard");
      toast({ title: "Access Denied", description: "Admin only.", variant: "destructive" });
    }
  }, [user, isLoading, isCheckingAdmin, isAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all diagnostic results joined with profile email/name
      const { data: results, error } = await supabase
        .from("diagnostic_results")
        .select("*, profiles(email, full_name)")
        .order("taken_at", { ascending: false });

      if (error) throw error;

      const mapped: DiagnosticRow[] = (results ?? []).map((r: Record<string, unknown>) => {
        const profile = r.profiles as { email: string; full_name: string | null } | null;
        return {
          id: r.id as string,
          user_id: r.user_id as string,
          taken_at: r.taken_at as string,
          overall_band: r.overall_band as number,
          reading_band: r.reading_band as number | null,
          reading_score: r.reading_score as number | null,
          listening_band: r.listening_band as number | null,
          listening_score: r.listening_score as number | null,
          writing_band: r.writing_band as number | null,
          writing_t1_band: r.writing_t1_band as number | null,
          writing_t2_band: r.writing_t2_band as number | null,
          writing_t1_feedback: r.writing_t1_feedback as string | null,
          writing_t2_feedback: r.writing_t2_feedback as string | null,
          speaking_band: r.speaking_band as number | null,
          speaking_feedback: r.speaking_feedback as string | null,
          reading_answers: r.reading_answers as Record<string, string> | null,
          task1_text: r.task1_text as string | null,
          task2_text: r.task2_text as string | null,
          speaking_transcripts: r.speaking_transcripts as string[] | null,
          email: profile?.email ?? "unknown",
          full_name: profile?.full_name ?? null,
        };
      });

      setRows(mapped);
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = rows.filter(r =>
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    (r.full_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Admin
          </Button>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-bold">Diagnostic Results</h1>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={loadData} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-1.5", loading && "animate-spin")} /> Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Tests", value: rows.length },
            { label: "Avg Overall", value: rows.length ? (rows.reduce((s, r) => s + r.overall_band, 0) / rows.length).toFixed(1) : "—" },
            { label: "Band 7+", value: rows.filter(r => r.overall_band >= 7).length },
            { label: "Below 5.5", value: rows.filter(r => r.overall_band < 5.5).length },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border/40 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            {rows.length === 0 ? "No diagnostic results yet." : "No results match your search."}
          </div>
        ) : (
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Overall</TableHead>
                  <TableHead className="text-center"><BookOpen className="w-3 h-3 inline mr-1 text-blue-400" />Reading</TableHead>
                  <TableHead className="text-center"><Headphones className="w-3 h-3 inline mr-1 text-amber-400" />Listening</TableHead>
                  <TableHead className="text-center"><PenTool className="w-3 h-3 inline mr-1 text-violet-400" />Writing</TableHead>
                  <TableHead className="text-center"><Mic className="w-3 h-3 inline mr-1 text-emerald-400" />Speaking</TableHead>
                  <TableHead className="text-center">Plan</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(row => {
                  const tier = row.overall_band >= 7 ? "Polishing" : row.overall_band >= 5.5 ? "Developing" : "Foundation";
                  const tierColor = row.overall_band >= 7 ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                    : row.overall_band >= 5.5 ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                    : "text-red-400 border-red-400/30 bg-red-400/10";
                  return (
                    <TableRow
                      key={row.id}
                      className="border-border/40 cursor-pointer hover:bg-secondary/40 transition-colors"
                      onClick={() => setSelected(row)}
                    >
                      <TableCell>
                        <div className="font-medium text-sm text-foreground">{row.full_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{row.email}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div>{format(new Date(row.taken_at), "d MMM yyyy")}</div>
                        <Badge variant="outline" className={cn("text-[9px] mt-1", stalenessInfo(row.taken_at).className)}>
                          {stalenessInfo(row.taken_at).label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn("text-lg font-black", bandColor(row.overall_band))}>
                          {row.overall_band}
                        </span>
                      </TableCell>
                      <TableCell className="text-center"><BandBadge band={row.reading_band} /></TableCell>
                      <TableCell className="text-center"><BandBadge band={row.listening_band} /></TableCell>
                      <TableCell className="text-center"><BandBadge band={row.writing_band} /></TableCell>
                      <TableCell className="text-center"><BandBadge band={row.speaking_band} /></TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("text-[10px]", tierColor)}>{tier}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost" size="sm"
                          onClick={e => { e.stopPropagation(); printResult(row); }}
                          className="h-7 w-7 p-0"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  Diagnostic Detail
                </SheetTitle>
                <div className="text-sm text-muted-foreground">
                  {selected.full_name && <span className="font-medium text-foreground">{selected.full_name} — </span>}
                  {selected.email}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Taken: {format(new Date(selected.taken_at), "d MMMM yyyy 'at' HH:mm")}</span>
                  <Badge variant="outline" className={cn("text-[9px]", stalenessInfo(selected.taken_at).className)}>
                    {stalenessInfo(selected.taken_at).label}
                  </Badge>
                </div>
              </SheetHeader>

              {/* Overall */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center mb-4">
                <p className="text-xs text-accent/70 uppercase tracking-widest font-semibold">Overall Band</p>
                <p className={cn("text-5xl font-black mt-1", bandColor(selected.overall_band))}>
                  {selected.overall_band}
                </p>
              </div>

              {/* Module bands */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Reading",   icon: BookOpen,   color: "text-blue-400",    band: selected.reading_band,   sub: `${selected.reading_score ?? "—"}/10 correct` },
                  { label: "Listening", icon: Headphones, color: "text-amber-400",   band: selected.listening_band, sub: `${selected.listening_score ?? "—"}/6 correct` },
                  { label: "Writing",   icon: PenTool,    color: "text-violet-400",  band: selected.writing_band,   sub: `T1: ${selected.writing_t1_band ?? "—"} · T2: ${selected.writing_t2_band ?? "—"}` },
                  { label: "Speaking",  icon: Mic,        color: "text-emerald-400", band: selected.speaking_band,  sub: "3 questions" },
                ].map(({ label, icon: Icon, color, band, sub }) => (
                  <div key={label} className="rounded-lg border border-border/40 bg-card/60 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={cn("w-3.5 h-3.5", color)} />
                      <span className="text-xs font-semibold text-foreground">{label}</span>
                    </div>
                    <p className={cn("text-xl font-black", bandColor(band))}>
                      {band != null ? `Band ${band}` : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Reading grid */}
              {selected.reading_answers && (
                <div className="rounded-xl border border-border/40 bg-card/60 p-3 mb-3">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Reading — Answer Review</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {Object.entries(READING_CORRECT).map(([q, correct]) => {
                      const given = ((selected.reading_answers ?? {})[q] ?? "").trim().toLowerCase();
                      const exp   = correct.toLowerCase();
                      const ok = q === "q7" || q === "q8"
                        ? given.includes(exp) || exp.includes(given)
                        : given === exp;
                      return (
                        <div key={q} className={cn("rounded-lg p-2 text-center border",
                          ok ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"
                        )}>
                          <p className="text-[10px] text-muted-foreground">{q.toUpperCase()}</p>
                          {ok
                            ? <Check className="w-3 h-3 text-emerald-400 mx-auto mt-0.5" />
                            : <p className="text-[9px] text-red-400 mt-0.5 leading-tight">{correct}</p>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Writing feedback */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-3 mb-3 space-y-2">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Writing — AI Feedback</p>
                {[
                  { label: "Task 1", band: selected.writing_t1_band, fb: selected.writing_t1_feedback, text: selected.task1_text },
                  { label: "Task 2", band: selected.writing_t2_band, fb: selected.writing_t2_feedback, text: selected.task2_text },
                ].map(({ label, band, fb, text }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-violet-300 w-12">{label}</span>
                      <span className="text-sm font-bold text-foreground">Band {band ?? "—"}</span>
                    </div>
                    {fb && <p className="text-xs text-muted-foreground pl-14">{fb}</p>}
                    {text && (
                      <details className="pl-14">
                        <summary className="text-xs text-accent cursor-pointer">View essay</summary>
                        <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">{text}</p>
                      </details>
                    )}
                  </div>
                ))}
              </div>

              {/* Speaking feedback */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-3 mb-3 space-y-2">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Speaking — AI Feedback</p>
                <p className="text-sm font-bold text-foreground">Band {selected.speaking_band ?? "—"}</p>
                {selected.speaking_feedback && (
                  <p className="text-xs text-muted-foreground">{selected.speaking_feedback}</p>
                )}
                {selected.speaking_transcripts?.map((t, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-foreground">Q{i + 1}</p>
                    <p className="text-xs text-muted-foreground">{t || "(no answer)"}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" onClick={() => printResult(selected)}>
                <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
