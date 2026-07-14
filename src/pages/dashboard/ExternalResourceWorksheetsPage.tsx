import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { HumanPlusAILockScreen } from "@/components/HumanPlusAILockScreen";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  ClipboardList,
  Mic,
  Square,
  ArrowLeft,
  FileText,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Worksheet answer context (collects all answers for PDF export) ────────────

interface ExtAnswer { questionText: string; answer: string; section: string; }

const ExtWsCtx = createContext<{
  register: (id: string, q: string, section: string) => void;
  report: (id: string, answer: string) => void;
} | null>(null);

const ExtSectionCtx = createContext<string>("");

function ExtWorksheetContainer({
  title,
  children,
  onBack,
}: {
  title: string;
  children: ReactNode;
  onBack: () => void;
}) {
  const answersRef = useRef<Map<string, ExtAnswer>>(new Map());
  const orderRef = useRef<string[]>([]);

  const register = useCallback((id: string, q: string, section: string) => {
    if (!answersRef.current.has(id)) orderRef.current.push(id);
    answersRef.current.set(id, {
      questionText: q,
      answer: answersRef.current.get(id)?.answer ?? "",
      section,
    });
  }, []);

  const report = useCallback((id: string, answer: string) => {
    const prev = answersRef.current.get(id);
    if (prev) answersRef.current.set(id, { ...prev, answer });
  }, []);

  const handleDownload = () => {
    const rows = orderRef.current
      .map(id => answersRef.current.get(id)!)
      .filter(Boolean);
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const sections: { title: string; items: (ExtAnswer & { idx: number })[] }[] = [];
    let idx = 1;
    rows.forEach(r => {
      let sec = sections.find(s => s.title === r.section);
      if (!sec) { sec = { title: r.section, items: [] }; sections.push(sec); }
      sec.items.push({ ...r, idx: idx++ });
    });

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${esc(title)}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:28px;color:#1e293b}
  h1{font-size:20px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px;margin-bottom:4px}
  .meta{color:#64748b;font-size:12px;margin-bottom:24px}
  .section{margin-bottom:28px}
  .sec-title{font-size:13px;font-weight:700;color:#1e40af;background:#eff6ff;padding:7px 12px;border-radius:6px;margin-bottom:12px;border-left:3px solid #3b82f6}
  .qblock{margin-bottom:14px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid}
  .qnum{font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:3px}
  .qtext{font-size:14px;margin-bottom:8px;line-height:1.5}
  .ans{padding:8px 12px;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;font-size:14px;min-height:36px;white-space:pre-wrap;line-height:1.6}
  @media print{button{display:none!important}}
</style></head><body>
<h1>${esc(title)}</h1>
<div class="meta">Completed: ${date} &nbsp;|&nbsp; External Resource Worksheet — Engvolve</div>
${sections.map(s => `
<div class="section">
  <div class="sec-title">${esc(s.title)}</div>
  ${s.items.map(r => `
  <div class="qblock">
    <div class="qnum">Question ${r.idx}</div>
    <div class="qtext">${esc(r.questionText)}</div>
    <div class="ans">${r.answer ? esc(r.answer) : '<span style="color:#94a3b8;font-style:italic">No answer given</span>'}</div>
  </div>`).join("")}
</div>`).join("")}
</body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 400);
    }
  };

  return (
    <ExtWsCtx.Provider value={{ register, report }}>
      <div className="space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to worksheets
        </button>
        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">{title}</h2>
        <div className="space-y-4">{children}</div>
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          <ClipboardList className="w-4 h-4" />
          Download worksheet as PDF (for answer key and submit)
        </button>
      </div>
    </ExtWsCtx.Provider>
  );
}

function ExtWorksheetBlock({
  title,
  instruction,
  children,
}: {
  title: string;
  instruction: string;
  children: ReactNode;
}) {
  return (
    <ExtSectionCtx.Provider value={title}>
      <div className="rounded-xl border border-border overflow-hidden bg-secondary/60">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-blue-500/10">
          <ClipboardList className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{title}</span>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{instruction}</p>
          <div className="space-y-5">{children}</div>
        </div>
      </div>
    </ExtSectionCtx.Provider>
  );
}

function ExtQ({
  id,
  n,
  q,
  rows = 4,
}: {
  id: string;
  n: number;
  q: string;
  rows?: number;
}) {
  const ctx = useContext(ExtWsCtx);
  const section = useContext(ExtSectionCtx);
  const [value, setValue] = useState("");

  useEffect(() => {
    ctx?.register(id, q, section);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground/90 leading-relaxed">
        <span className="font-semibold text-muted-foreground mr-1.5">{n}.</span>
        {q}
      </p>
      <textarea
        value={value}
        onChange={e => { setValue(e.target.value); ctx?.report(id, e.target.value); }}
        rows={rows}
        placeholder="Type your response here…"
        className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y"
      />
    </div>
  );
}

function ExtWordCountQ({
  id,
  n,
  q,
  target,
}: {
  id: string;
  n: number;
  q: string;
  target: string;
}) {
  const ctx = useContext(ExtWsCtx);
  const section = useContext(ExtSectionCtx);
  const [value, setValue] = useState("");
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  useEffect(() => {
    ctx?.register(id, q, section);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground/90 leading-relaxed">
        <span className="font-semibold text-muted-foreground mr-1.5">{n}.</span>
        {q}
      </p>
      <textarea
        value={value}
        onChange={e => { setValue(e.target.value); ctx?.report(id, e.target.value); }}
        rows={9}
        placeholder="Type your response here…"
        className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y"
      />
      <p className={cn(
        "text-xs text-right",
        wordCount === 0 ? "text-muted-foreground" : "text-blue-400",
      )}>
        {wordCount} {wordCount === 1 ? "word" : "words"} &nbsp;|&nbsp; target: {target}
      </p>
    </div>
  );
}

function ExtPairedQ({
  id,
  n,
  labelA,
  labelB,
  placeholderA,
  placeholderB,
}: {
  id: string;
  n: number;
  labelA: string;
  labelB: string;
  placeholderA?: string;
  placeholderB?: string;
}) {
  const ctx = useContext(ExtWsCtx);
  const section = useContext(ExtSectionCtx);
  const [valA, setValA] = useState("");
  const [valB, setValB] = useState("");

  useEffect(() => {
    ctx?.register(`${id}-a`, `${labelA} (row ${n})`, section);
    ctx?.register(`${id}-b`, `${labelB} (row ${n})`, section);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Row {n}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-blue-400">{labelA}</p>
          <textarea
            value={valA}
            onChange={e => { setValA(e.target.value); ctx?.report(`${id}-a`, e.target.value); }}
            rows={3}
            placeholder={placeholderA ?? "Type here…"}
            className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-blue-400">{labelB}</p>
          <textarea
            value={valB}
            onChange={e => { setValB(e.target.value); ctx?.report(`${id}-b`, e.target.value); }}
            rows={3}
            placeholder={placeholderB ?? "Type here…"}
            className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function VoiceRecorder({ id, n, q }: { id: string; n: number; q: string }) {
  const ctx = useContext(ExtWsCtx);
  const section = useContext(ExtSectionCtx);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [srSupported] = useState(
    () => !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
  );
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    ctx?.register(`${id}-transcript`, `${q} — Voice Transcript`, section);
    ctx?.register(`${id}-notes`, `${q} — Written Notes (pre-recording)`, section);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startRecording = async () => {
    try {
      finalTranscriptRef.current = "";
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;

      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        rec.onresult = (event: any) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += event.results[i][0].transcript + " ";
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const full = finalTranscriptRef.current + interim;
          setTranscript(full);
          ctx?.report(`${id}-transcript`, full);
        };
        rec.start();
        recognitionRef.current = rec;
      }

      setElapsedSecs(0);
      timerRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000);
      setIsRecording(true);
    } catch {
      alert("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recognitionRef.current?.stop();
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/90 leading-relaxed">
        <span className="font-semibold text-muted-foreground mr-1.5">{n}.</span>
        {q}
      </p>

      <div className="rounded-lg border border-border bg-background/60 p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {isRecording ? (
            <>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Stop Recording
              </button>
              <span className="font-mono text-sm text-red-400">{fmt(elapsedSecs)}</span>
              <span className="flex items-center gap-1.5 text-xs text-red-400/70">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Recording
              </span>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-semibold hover:bg-blue-500/30 transition-colors"
            >
              <Mic className="w-3.5 h-3.5" />
              Start Recording
            </button>
          )}
          {audioUrl && !isRecording && (
            <audio src={audioUrl} controls className="h-8 flex-1 min-w-0" />
          )}
        </div>

        {!srSupported && (
          <p className="text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            Your browser does not support live speech transcription. Please use Chrome or Edge for automatic transcription. You can still record audio and type your transcript manually below.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          Live transcript{isRecording ? " (transcribing now…)" : " — edit to correct any errors or filler words"}
        </p>
        <textarea
          value={transcript}
          onChange={e => { setTranscript(e.target.value); ctx?.report(`${id}-transcript`, e.target.value); }}
          rows={5}
          placeholder="Transcript will appear here as you speak. You can also type directly here…"
          className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          Written notes — jot key points here before you record
        </p>
        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); ctx?.report(`${id}-notes`, e.target.value); }}
          rows={4}
          placeholder="e.g. Main argument: … | Evidence: … | My opinion: …"
          className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y"
        />
      </div>
    </div>
  );
}

// ── Band 4–5 worksheets ───────────────────────────────────────────────────────

function WsBand45Week1({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 4–5 — Week 1 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Part A — Vocabulary Building"
        instruction="Read through the resource for this week. Write down every new word you come across — any word you did not know immediately or were not fully sure of — along with its definition."
      >
        <ExtQ id="b45w1-a1" n={1} q="Write down all the new words you found in the resource and their definitions." rows={8} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part B — Using New Vocabulary"
        instruction="Choose words from your list above and write new sentences using them. Try to show that you understand the meaning, not just copy the original sentence."
      >
        <ExtQ id="b45w1-b1" n={1} q="Use the words you listed above in different sentences. Write at least one sentence per new word." rows={8} />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand45Week2({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 4–5 — Week 2 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Part A — Main Points"
        instruction="Go through the resource and identify the key ideas or arguments. Write one main point per line."
      >
        <ExtQ id="b45w2-a1" n={1} q="Write down the main points of each resource." rows={6} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part B — Vocabulary Building"
        instruction="Write down every new word you encounter and look up or determine its definition."
      >
        <ExtQ id="b45w2-b1" n={1} q="Write down all the new words you found in the resource and their definitions." rows={6} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part C — Using New Vocabulary"
        instruction="Now combine multiple words from your list above into new, original sentences. Each sentence should use more than one of your new words if possible."
      >
        <ExtQ id="b45w2-c1" n={1} q="Use a combination of the words you listed above to form new sentences." rows={6} />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand45Week3({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 4–5 — Week 3 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Part A — Summarising"
        instruction="Write 3–5 sentences that summarize the resource. Use this guide: include the main point of the resource, an example or piece of evidence used, and explain the point in your own words."
      >
        <ExtQ id="b45w3-a1" n={1} q="Write 3–5 sentences that summarize each resource. Include: the main point, evidence or example used, and your own explanation of the point." rows={8} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part B — Vocabulary Building"
        instruction="Write down every new word and its definition."
      >
        <ExtQ id="b45w3-b1" n={1} q="Write down all the new words you found in the resource and their definitions." rows={6} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part C — Using New Vocabulary"
        instruction="Combine multiple vocabulary words from Part B into new, original sentences."
      >
        <ExtQ id="b45w3-c1" n={1} q="Use a combination of the words you listed above to form new sentences." rows={6} />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

// ── Band 6–7 worksheets ───────────────────────────────────────────────────────

function WsBand67Week1({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 6–7 — Week 1 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Part A — Central Argument"
        instruction="After reading or watching the source, identify the core message the author is communicating."
      >
        <ExtQ id="b67w1-a1" n={1} q="In 1–2 sentences, what is the author's central argument or the main idea of this source?" rows={3} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part B — Evidence and Support"
        instruction="Locate the key evidence, statistics, or examples the author uses to back up their argument."
      >
        <ExtQ id="b67w1-b1" n={1} q="What evidence, statistics, or examples does the author use to support the argument?" rows={5} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part C — Collocations and Academic Phrases"
        instruction="A collocation is a pair or group of words that commonly appear together (e.g. 'growing concern', 'raise awareness', 'provide evidence'). Find one in this source, write it down, then use it in your own sentence about a completely different topic."
      >
        <ExtQ id="b67w1-c1" n={1} q="Write down one new collocation or academic phrase you found in this source." rows={2} />
        <ExtQ id="b67w1-c2" n={2} q="Use that collocation or phrase in your own sentence about a different topic." rows={3} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part D — Your Opinion"
        instruction="This section develops your ability to form and express a reasoned academic opinion — a key IELTS Task 2 skill."
      >
        <ExtQ id="b67w1-d1" n={1} q="Do you agree or disagree with the main argument? Write 2–3 sentences explaining your position and giving at least one reason." rows={5} />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand67Week2({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 6–7 — Week 2 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Part A — Voice Recording (2 minutes)"
        instruction="Make a 2-minute voice recording that includes: (1) Summary of the main argument, (2) Evidence used, (3) Your personal opinion. Use the notes space below to jot key points before you start. The transcript is captured live — you can edit it afterwards to fix any errors."
      >
        <VoiceRecorder
          id="b67w2-a"
          n={1}
          q="Record a 2-minute spoken response covering: the main argument, evidence used, and your personal opinion on the source."
        />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part B — Concepts and Paraphrasing"
        instruction="Select 3 central concepts from the material. For each row: copy the exact phrase or sentence as it appeared in the source, then restate the same idea in a different way using synonyms or paraphrasing."
      >
        <ExtPairedQ id="b67w2-b1" n={1} labelA="Original (exact text from source)" labelB="Your paraphrase" placeholderA="Copy the exact phrase from the source…" placeholderB="Rewrite it in your own words using synonyms…" />
        <ExtPairedQ id="b67w2-b2" n={2} labelA="Original (exact text from source)" labelB="Your paraphrase" placeholderA="Copy the exact phrase from the source…" placeholderB="Rewrite it in your own words using synonyms…" />
        <ExtPairedQ id="b67w2-b3" n={3} labelA="Original (exact text from source)" labelB="Your paraphrase" placeholderA="Copy the exact phrase from the source…" placeholderB="Rewrite it in your own words using synonyms…" />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part C — Vocabulary in Context"
        instruction="Find 3 words whose definition you did not know immediately. Based only on the surrounding context clues — not a dictionary — write your best guess of each word's meaning."
      >
        <ExtPairedQ id="b67w2-c1" n={1} labelA="Word (write it + the sentence it came from)" labelB="Your best guess at its definition" placeholderA="e.g. 'ubiquitous' — 'Technology has become ubiquitous in modern classrooms.'" placeholderB="Based on context clues, I think this means…" />
        <ExtPairedQ id="b67w2-c2" n={2} labelA="Word (write it + the sentence it came from)" labelB="Your best guess at its definition" placeholderA="e.g. 'ubiquitous' — 'Technology has become ubiquitous in modern classrooms.'" placeholderB="Based on context clues, I think this means…" />
        <ExtPairedQ id="b67w2-c3" n={3} labelA="Word (write it + the sentence it came from)" labelB="Your best guess at its definition" placeholderA="e.g. 'ubiquitous' — 'Technology has become ubiquitous in modern classrooms.'" placeholderB="Based on context clues, I think this means…" />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part D — Relative Pronouns"
        instruction="Find 3 instances where a relative pronoun ('that', 'which', 'who', 'whose', 'where', 'when', 'those', etc.) is used. Write the full sentence containing it, then identify the noun or idea the pronoun refers back to."
      >
        <ExtPairedQ id="b67w2-d1" n={1} labelA="Sentence containing the relative pronoun" labelB="The noun or idea it refers to" placeholderA="Copy the full sentence from the source…" placeholderB="The word 'that/which/who…' refers to: …" />
        <ExtPairedQ id="b67w2-d2" n={2} labelA="Sentence containing the relative pronoun" labelB="The noun or idea it refers to" placeholderA="Copy the full sentence from the source…" placeholderB="The word 'that/which/who…' refers to: …" />
        <ExtPairedQ id="b67w2-d3" n={3} labelA="Sentence containing the relative pronoun" labelB="The noun or idea it refers to" placeholderA="Copy the full sentence from the source…" placeholderB="The word 'that/which/who…' refers to: …" />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand67Week3({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 6–7 — Week 3 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Part A — Extended Written Response"
        instruction="Write a structured response including: (a) a summary of the main argument, (b) evidence used by the author, and (c) your personal opinion and reason. Aim for 150–200 words."
      >
        <ExtWordCountQ
          id="b67w3-a1"
          n={1}
          q="Write a 150–200 word response: (a) Summary of the main argument. (b) Evidence used. (c) Your personal opinion on the argument, with a reason."
          target="150–200 words"
        />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part B — Counter-Argument (PEEL Structure)"
        instruction="Pick one argument from the source and write a paragraph defending the opposite side. Use the PEEL structure: Point (state your position), Evidence (give a supporting example), Explanation (analyse why), Link (connect back or wrap up)."
      >
        <ExtWordCountQ
          id="b67w3-b1"
          n={1}
          q="Write a ~100-word paragraph defending the opposite side of one argument from the source. Use PEEL: Point, Evidence, Explanation, Link."
          target="~100 words"
        />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part C — Author's Stance"
        instruction="Look beyond the surface level: is the author fully committed to their position, or are they hedging or presenting it with reservations?"
      >
        <ExtQ id="b67w3-c1" n={1} q="What is the author's exact stance? Are they entirely supporting the idea or are they presenting it with reservations? Explain how you can tell." rows={4} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part D — Cohesive Devices"
        instruction="Transition words and cohesive devices signal how ideas connect (e.g. 'however', 'as a result', 'in contrast', 'furthermore'). Find 3 that the author used."
      >
        <ExtQ id="b67w3-d1" n={1} q="List 3 transition words or cohesive devices the author used to move between ideas. For each, note the two ideas it connects." rows={5} />
      </ExtWorksheetBlock>
      <ExtWorksheetBlock
        title="Part E — Collocations in Context"
        instruction="Find 3 complex phrases or collocations from the source. Use each one in a different sentence about the weekly theme. Not sure what a collocation is? See the link below."
      >
        <div className="mb-4">
          <a
            href="/dashboard/revision-notes?topic=collocations-paraphrasing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open Collocations &amp; Paraphrasing revision note
          </a>
        </div>
        <ExtQ id="b67w3-e1" n={1} q="Collocation or complex phrase 1 (copy it from the source):" rows={2} />
        <ExtQ id="b67w3-e2" n={2} q="Write a sentence about the weekly theme using collocation / phrase 1:" rows={3} />
        <ExtQ id="b67w3-e3" n={3} q="Collocation or complex phrase 2 (copy it from the source):" rows={2} />
        <ExtQ id="b67w3-e4" n={4} q="Write a sentence about the weekly theme using collocation / phrase 2:" rows={3} />
        <ExtQ id="b67w3-e5" n={5} q="Collocation or complex phrase 3 (copy it from the source):" rows={2} />
        <ExtQ id="b67w3-e6" n={6} q="Write a sentence about the weekly theme using collocation / phrase 3:" rows={3} />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

// ── Band 7+ worksheets ────────────────────────────────────────────────────────

function WsBand7PlusWeek1({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 7+ — Week 1 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Data Vocabulary Upgrade"
        instruction="Choose any source from this week. Select 2 facts, trends, or statistics. For each, quote or paraphrase the original, then rewrite it in a new sentence using a Band 8 synonym from the Data Descriptors section of the Vocabulary Bank — replace vague phrases like 'went up a lot' with precise vocabulary like 'surged' or 'escalated sharply'."
      >
        <ExtQ id="b7pw1-a1" n={1} q="Fact, trend, or statistic 1 — quote or paraphrase it from the source:" rows={2} />
        <ExtQ id="b7pw1-a2" n={2} q="Rewrite Fact 1 in a new sentence using a Band 8 Data Descriptor synonym from the Vocabulary Bank:" rows={3} />
        <ExtQ id="b7pw1-b1" n={3} q="Fact, trend, or statistic 2 — quote or paraphrase it from the source:" rows={2} />
        <ExtQ id="b7pw1-b2" n={4} q="Rewrite Fact 2 in a new sentence using a Band 8 Data Descriptor synonym from the Vocabulary Bank:" rows={3} />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand7PlusWeek2A({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 7+ — Week 2: Worksheet A — Idiomatic Expressions" onBack={onBack}>
      <ExtWorksheetBlock
        title="Worksheet A — Idiomatic Expressions in Context"
        instruction="Using the Idiomatic Expressions from the Vocabulary Bank, formulate 3 different spoken sentences that draw on information from the source. Each sentence must use a different idiom and reference a specific idea from what you read or watched."
      >
        <ExtPairedQ
          id="b7pw2a-1"
          n={1}
          labelA="Idiom used (from Vocabulary Bank)"
          labelB="Your spoken sentence (references a specific idea from the source)"
          placeholderA="Write the idiom here…"
          placeholderB="Write your full spoken sentence here…"
        />
        <ExtPairedQ
          id="b7pw2a-2"
          n={2}
          labelA="Idiom used (from Vocabulary Bank)"
          labelB="Your spoken sentence (references a specific idea from the source)"
          placeholderA="Write the idiom here…"
          placeholderB="Write your full spoken sentence here…"
        />
        <ExtPairedQ
          id="b7pw2a-3"
          n={3}
          labelA="Idiom used (from Vocabulary Bank)"
          labelB="Your spoken sentence (references a specific idea from the source)"
          placeholderA="Write the idiom here…"
          placeholderB="Write your full spoken sentence here…"
        />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand7PlusWeek2B({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 7+ — Week 2: Worksheet B — Transitory Phrases" onBack={onBack}>
      <ExtWorksheetBlock
        title="Worksheet B — Transitory Phrases"
        instruction="Identify 2 paragraphs or points in the source where a Transitory Phrase from the Vocabulary Bank would strengthen the transition between ideas. For each: write the original idea or transition, then write a new sentence or sentence pair using the transitory phrase."
      >
        <ExtPairedQ
          id="b7pw2b-1"
          n={1}
          labelA="Original idea or transition (from the source)"
          labelB="Rewritten using a Transitory Phrase from the Vocabulary Bank"
          placeholderA="Copy the original text or describe the transition being made…"
          placeholderB="Rewrite the transition using a transitory phrase from the Vocabulary Bank…"
        />
        <ExtPairedQ
          id="b7pw2b-2"
          n={2}
          labelA="Original idea or transition (from the source)"
          labelB="Rewritten using a Transitory Phrase from the Vocabulary Bank"
          placeholderA="Copy the original text or describe the transition being made…"
          placeholderB="Rewrite the transition using a transitory phrase from the Vocabulary Bank…"
        />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

function WsBand7PlusWeek4({ onBack }: { onBack: () => void }) {
  return (
    <ExtWorksheetContainer title="Band 7+ — Week 4 Worksheet" onBack={onBack}>
      <ExtWorksheetBlock
        title="Band 8 Collocations in Context"
        instruction="Select 3 facts or claims from the source. Using the topic-specific collocations from Section 2 of the Collocations & Paraphrasing revision note, rewrite each fact with at least one Band 8 collocation that fits the topic naturally."
      >
        <ExtPairedQ
          id="b7pw4-1"
          n={1}
          labelA="Original fact or claim from the source"
          labelB="Rewrite using a Band 8 collocation"
          placeholderA="Quote or paraphrase the fact…"
          placeholderB="Rewrite it with at least one Band 8 collocation from the revision note…"
        />
        <ExtPairedQ
          id="b7pw4-2"
          n={2}
          labelA="Original fact or claim from the source"
          labelB="Rewrite using a Band 8 collocation"
          placeholderA="Quote or paraphrase the fact…"
          placeholderB="Rewrite it with at least one Band 8 collocation from the revision note…"
        />
        <ExtPairedQ
          id="b7pw4-3"
          n={3}
          labelA="Original fact or claim from the source"
          labelB="Rewrite using a Band 8 collocation"
          placeholderA="Quote or paraphrase the fact…"
          placeholderB="Rewrite it with at least one Band 8 collocation from the revision note…"
        />
      </ExtWorksheetBlock>
    </ExtWorksheetContainer>
  );
}

// ── Navigation data ───────────────────────────────────────────────────────────

const BANDS = [
  {
    id: "4-5",
    label: "Band 4–5",
    weeks: [
      { id: "1", label: "Week 1" },
      { id: "2", label: "Week 2" },
      { id: "3", label: "Week 3" },
    ],
  },
  {
    id: "6-7",
    label: "Band 6–7",
    weeks: [
      { id: "1", label: "Week 1" },
      { id: "2", label: "Week 2" },
      { id: "3", label: "Week 3" },
    ],
  },
  {
    id: "7plus",
    label: "Band 7+",
    weeks: [
      { id: "1", label: "Week 1" },
      { id: "2", label: "Week 2" },
      { id: "4", label: "Week 4" },
    ],
  },
];

interface WsEntry {
  id: string;
  label: string;
  description: string;
  Component: React.ComponentType<{ onBack: () => void }>;
}

const WORKSHEET_CATALOG: Record<string, WsEntry[]> = {
  "4-5-1": [{
    id: "main",
    label: "Band 4–5 Week 1 Worksheet",
    description: "Vocabulary building: list all new words with definitions, then use them in your own sentences.",
    Component: WsBand45Week1,
  }],
  "4-5-2": [{
    id: "main",
    label: "Band 4–5 Week 2 Worksheet",
    description: "Write the main points of the resource, list new vocabulary, and form sentences combining new words.",
    Component: WsBand45Week2,
  }],
  "4-5-3": [{
    id: "main",
    label: "Band 4–5 Week 3 Worksheet",
    description: "Write 3–5 sentences summarising the resource (main point + evidence + explanation), new vocabulary, and sentence formation.",
    Component: WsBand45Week3,
  }],
  "6-7-1": [{
    id: "main",
    label: "Band 6–7 Week 1 Worksheet",
    description: "Identify the central argument, evidence used, find one collocation, and express your own opinion in 2–3 sentences.",
    Component: WsBand67Week1,
  }],
  "6-7-2": [{
    id: "main",
    label: "Band 6–7 Week 2 Worksheet",
    description: "2-minute voice recording (with live transcription), concept paraphrasing, vocabulary from context, and relative pronoun analysis. Includes audio recording.",
    Component: WsBand67Week2,
  }],
  "6-7-3": [{
    id: "main",
    label: "Band 6–7 Week 3 Worksheet",
    description: "150–200 word written response, ~100-word PEEL counter-argument, author's stance analysis, cohesive devices, and collocations in context.",
    Component: WsBand67Week3,
  }],
  "7plus-1": [{
    id: "main",
    label: "Band 7+ Week 1 Worksheet",
    description: "Select 2 facts or statistics from the source and rewrite each using a Band 8 Data Descriptor synonym from the Vocabulary Bank.",
    Component: WsBand7PlusWeek1,
  }],
  "7plus-2": [
    {
      id: "a",
      label: "Band 7+ Week 2 — Worksheet A: Idiomatic Expressions",
      description: "Form 3 spoken sentences, each using a different idiom from the Vocabulary Bank and referencing a specific idea from the source.",
      Component: WsBand7PlusWeek2A,
    },
    {
      id: "b",
      label: "Band 7+ Week 2 — Worksheet B: Transitory Phrases",
      description: "Identify 2 transitions in the source and rewrite each using a Transitory Phrase from the Vocabulary Bank.",
      Component: WsBand7PlusWeek2B,
    },
  ],
  "7plus-4": [{
    id: "main",
    label: "Band 7+ Week 4 Worksheet",
    description: "Rewrite 3 facts or claims from the source with Band 8 collocations from Section 2 of the Collocations & Paraphrasing revision note.",
    Component: WsBand7PlusWeek4,
  }],
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ExternalResourceWorksheetsPage() {
  const { profile } = useAuth();
  const hasAccess =
    profile?.subscription_tier === "pro" || profile?.subscription_tier === "elite";

  const [searchParams, setSearchParams] = useSearchParams();
  const bandParam = searchParams.get("band") ?? "4-5";
  const weekParam = searchParams.get("week") ?? "1";
  const wsParam = searchParams.get("ws");

  const [expandedBands, setExpandedBands] = useState<string[]>(["4-5", "6-7", "7plus"]);
  const [dialogEntry, setDialogEntry] = useState<WsEntry | null>(null);

  const catalogKey = `${bandParam}-${weekParam}`;
  const worksheets = WORKSHEET_CATALOG[catalogKey] ?? [];
  const activeWs = wsParam ? worksheets.find(w => w.id === wsParam) ?? null : null;

  const currentBand = BANDS.find(b => b.id === bandParam);
  const currentWeek = currentBand?.weeks.find(w => w.id === weekParam);

  const navigate = (band: string, week: string, ws?: string) => {
    const p: Record<string, string> = { band, week };
    if (ws) p.ws = ws;
    setSearchParams(p);
  };

  const goBack = () => setSearchParams({ band: bandParam, week: weekParam });

  const openWorksheet = (entry: WsEntry) => {
    setDialogEntry(null);
    setSearchParams({ band: bandParam, week: weekParam, ws: entry.id });
  };

  if (!hasAccess) {
    return (
      <HumanPlusAILockScreen
        title="External Resource Worksheets"
        description="Structured worksheets for the weekly external resources, organised by band score. Available on Pro and Elite plans."
        features={[
          "Band 4–5 worksheets: vocabulary building and summarising",
          "Band 6–7 worksheets: argumentation, paraphrasing, voice recording",
          "Band 7+ worksheets: Band 8 collocations and idiomatic expressions",
          "Fillable and downloadable as PDF",
        ]}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-6 flex h-[calc(100dvh-3rem)] min-h-0 bg-background">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-background overflow-hidden">
          <div className="px-4 py-3 border-b border-border shrink-0">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              External Resource Worksheets
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {BANDS.map(band => {
                const isExpanded = expandedBands.includes(band.id);
                return (
                  <div key={band.id}>
                    <button
                      onClick={() =>
                        setExpandedBands(prev =>
                          prev.includes(band.id)
                            ? prev.filter(b => b !== band.id)
                            : [...prev, band.id]
                        )
                      }
                      className={cn(
                        "flex w-full items-center gap-1.5 py-1.5 text-left text-xs font-semibold uppercase tracking-wider",
                        isExpanded ? "text-foreground/80" : "text-muted-foreground/60",
                      )}
                    >
                      {isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5" />
                        : <ChevronRight className="h-3.5 w-3.5" />}
                      {band.label}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {band.weeks.map(week => {
                          const isActive =
                            bandParam === band.id && weekParam === week.id;
                          return (
                            <button
                              key={week.id}
                              onClick={() => navigate(band.id, week.id)}
                              className={cn(
                                "flex w-full rounded px-2 py-1.5 text-sm text-left transition-all border",
                                isActive
                                  ? "bg-[#3b82f6]/20 text-foreground border-[#3b82f6]/50"
                                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground/80 border-transparent",
                              )}
                            >
                              {week.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="px-6 py-3 border-b border-border shrink-0">
            <p className="text-xs text-muted-foreground">External Resource Worksheets</p>
            <h1 className="text-base font-semibold text-foreground mt-0.5">
              {activeWs
                ? activeWs.label
                : currentBand && currentWeek
                  ? `${currentBand.label} — ${currentWeek.label}`
                  : "Worksheets"}
            </h1>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 max-w-3xl">
              {activeWs ? (
                <activeWs.Component onBack={goBack} />
              ) : worksheets.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-5">
                    Select a worksheet below. Your answers are saved as you type and can be downloaded as a PDF when complete.
                  </p>
                  {worksheets.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => setDialogEntry(ws)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/70 hover:border-blue-500/30 transition-all text-left group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 shrink-0">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{ws.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ws.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No worksheets found for this selection.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Open Worksheet confirmation dialog */}
      <Dialog open={!!dialogEntry} onOpenChange={() => setDialogEntry(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base leading-snug">{dialogEntry?.label}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {dialogEntry?.description}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogEntry(null)}>Cancel</Button>
            <Button onClick={() => dialogEntry && openWorksheet(dialogEntry)}>
              Open Worksheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
