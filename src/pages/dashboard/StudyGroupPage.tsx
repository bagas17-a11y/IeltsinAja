import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Trophy, Copy, Check, LogIn, Plus, CalendarDays } from "lucide-react";

interface StudyGroup {
  id: string;
  name: string;
  join_code: string;
  exam_target_date: string | null;
  created_by: string;
  created_at: string;
}

interface GroupMember {
  user_id: string;
  joined_at: string;
  full_name: string | null;
  avg_band: number;
  practice_count: number;
}

type View = "landing" | "group";

function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function StudyGroupPage() {
  const { user } = useAuth();
  const { progress } = useUserProgress();
  const { toast } = useToast();

  const [view, setView] = useState<View>("landing");
  const [myGroup, setMyGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Create group form
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDate, setNewGroupDate] = useState("");
  const [creating, setCreating] = useState(false);

  // Join group form
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  const loadGroup = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Find any group the user belongs to
      const { data: memberRows } = await (supabase as any)
        .from("study_group_members")
        .select("group_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!memberRows?.group_id) {
        setLoading(false);
        return;
      }

      const { data: group } = await (supabase as any)
        .from("study_groups")
        .select("*")
        .eq("id", memberRows.group_id)
        .maybeSingle();

      if (!group) { setLoading(false); return; }
      setMyGroup(group);

      // Load all members with their profiles + progress summary
      const { data: allMembers } = await (supabase as any)
        .from("study_group_members")
        .select("user_id, joined_at")
        .eq("group_id", group.id);

      if (!allMembers?.length) { setLoading(false); setView("group"); return; }

      const memberIds: string[] = allMembers.map((m: { user_id: string }) => m.user_id);

      const [profilesRes, progressRes] = await Promise.all([
        (supabase as any).from("profiles").select("user_id, full_name").in("user_id", memberIds),
        (supabase as any)
          .from("user_progress")
          .select("user_id, band_score, completed_at")
          .in("user_id", memberIds)
          .neq("exam_type", "diagnostic"),
      ]);

      const profileMap: Record<string, string> = {};
      (profilesRes.data ?? []).forEach((p: { user_id: string; full_name: string | null }) => {
        profileMap[p.user_id] = p.full_name ?? "Anonymous";
      });

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const builtMembers: GroupMember[] = allMembers.map((m: { user_id: string; joined_at: string }) => {
        const memberProgress = (progressRes.data ?? []).filter(
          (p: { user_id: string }) => p.user_id === m.user_id
        );
        const withScores = memberProgress.filter((p: { band_score: number | null }) => p.band_score);
        const avgBand = withScores.length
          ? withScores.reduce((s: number, p: { band_score: number }) => s + p.band_score, 0) / withScores.length
          : 0;
        const practiceCount = memberProgress.filter(
          (p: { completed_at: string }) => new Date(p.completed_at).getTime() >= weekAgo
        ).length;

        return {
          user_id: m.user_id,
          joined_at: m.joined_at,
          full_name: profileMap[m.user_id] ?? "Anonymous",
          avg_band: avgBand,
          practice_count: practiceCount,
        };
      });

      builtMembers.sort((a, b) => b.avg_band - a.avg_band);
      setMembers(builtMembers);
      setView("group");
    } catch (err) {
      console.error("loadGroup error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadGroup(); }, [loadGroup]);

  async function handleCreate() {
    if (!user || !newGroupName.trim()) return;
    setCreating(true);
    try {
      const code = generateJoinCode();
      const { data: group, error } = await (supabase as any)
        .from("study_groups")
        .insert({
          name: newGroupName.trim(),
          created_by: user.id,
          join_code: code,
          exam_target_date: newGroupDate || null,
        })
        .select()
        .single();

      if (error) throw error;

      await (supabase as any)
        .from("study_group_members")
        .insert({ group_id: group.id, user_id: user.id });

      toast({ title: "Group created!", description: `Join code: ${code}` });
      await loadGroup();
    } catch (err: any) {
      toast({ title: "Error creating group", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin() {
    if (!user || !joinCode.trim()) return;
    setJoining(true);
    try {
      const { data: group, error } = await (supabase as any)
        .from("study_groups")
        .select("id, name")
        .eq("join_code", joinCode.trim().toUpperCase())
        .maybeSingle();

      if (error || !group) {
        toast({ title: "Group not found", description: "Check the join code and try again.", variant: "destructive" });
        setJoining(false);
        return;
      }

      // Check not already a member
      const { data: existing } = await (supabase as any)
        .from("study_group_members")
        .select("user_id")
        .eq("group_id", group.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        toast({ title: "Already in this group" });
        setJoining(false);
        return;
      }

      await (supabase as any)
        .from("study_group_members")
        .insert({ group_id: group.id, user_id: user.id });

      toast({ title: `Joined "${group.name}"!` });
      await loadGroup();
    } catch (err: any) {
      toast({ title: "Error joining group", description: err.message, variant: "destructive" });
    } finally {
      setJoining(false);
    }
  }

  function copyJoinCode() {
    if (!myGroup) return;
    navigator.clipboard.writeText(myGroup.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // My own avg band from local progress
  const myAvgBand = (() => {
    const withScores = progress.filter((p) => p.band_score && p.exam_type !== "diagnostic");
    if (!withScores.length) return null;
    return withScores.reduce((s, p) => s + (p.band_score ?? 0), 0) / withScores.length;
  })();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (view === "group" && myGroup) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light">{myGroup.name}</h1>
              {myGroup.exam_target_date && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Exam target: {new Date(myGroup.exam_target_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              )}
            </div>
            <button
              onClick={copyJoinCode}
              className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded px-2.5 py-1.5 hover:border-accent hover:text-accent transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {myGroup.join_code}
            </button>
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Leaderboard</span>
              <span className="text-xs text-muted-foreground ml-auto">Sessions this week</span>
            </div>
            <div className="divide-y divide-border">
              {members.map((m, i) => (
                <div key={m.user_id} className={`flex items-center gap-3 px-4 py-3 ${m.user_id === user?.id ? "bg-accent/5" : ""}`}>
                  <span className={`text-sm font-mono w-5 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {m.full_name}
                    {m.user_id === user?.id && <span className="text-xs text-accent ml-1.5">(you)</span>}
                  </span>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {m.practice_count} session{m.practice_count !== 1 ? "s" : ""}
                  </span>
                  <span className={`text-sm font-medium w-16 text-right ${m.avg_band >= 7 ? "text-green-400" : m.avg_band >= 6 ? "text-yellow-400" : "text-muted-foreground"}`}>
                    {m.avg_band > 0 ? `Band ${m.avg_band.toFixed(1)}` : "No data"}
                  </span>
                </div>
              ))}
              {members.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No members yet — share the join code!
                </div>
              )}
            </div>
          </div>

          {/* Share your score */}
          {myAvgBand !== null && (
            <div className="rounded-xl border border-border p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Share your progress</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your current average: Band {myAvgBand.toFixed(1)}</p>
              </div>
              <button
                onClick={() => {
                  const text = `I'm averaging Band ${myAvgBand!.toFixed(1)} on Mumpune! Join my study group "${myGroup.name}" with code ${myGroup.join_code} 🎯`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                    toast({ title: "Copied to clipboard!" });
                  }
                }}
                className="text-xs border border-accent text-accent rounded px-3 py-1.5 hover:bg-accent/10 transition-colors"
              >
                Share score
              </button>
            </div>
          )}

          {/* Activity feed placeholder */}
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-medium mb-3">Recent activity</p>
            <div className="space-y-2">
              {members
                .flatMap((m) => [] as { label: string; time: string }[])
                .length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Activity shows here as members complete practice sessions.
                </p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Landing: create or join
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-lg mx-auto">
        <div>
          <h1 className="text-2xl font-light">Study Groups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Practice together, stay accountable, and track each other's progress.
          </p>
        </div>

        <div className="rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="w-4 h-4 text-accent" />
            <p className="text-sm font-medium">Create a group</p>
          </div>
          <Input
            placeholder="Group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="bg-background"
          />
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="date"
              value={newGroupDate}
              onChange={(e) => setNewGroupDate(e.target.value)}
              className="flex-1 text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Exam target date (optional)"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={creating || !newGroupName.trim()}
            className="w-full"
            size="sm"
          >
            {creating ? "Creating..." : "Create group"}
          </Button>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <LogIn className="w-4 h-4 text-accent" />
            <p className="text-sm font-medium">Join with a code</p>
          </div>
          <Input
            placeholder="6-character code (e.g. ABC123)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="bg-background font-mono tracking-widest"
          />
          <Button
            onClick={handleJoin}
            disabled={joining || joinCode.length !== 6}
            className="w-full"
            size="sm"
            variant="outline"
          >
            {joining ? "Joining..." : "Join group"}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <Users className="w-3.5 h-3.5 flex-shrink-0" />
          Groups show a leaderboard by avg band score and weekly session count.
        </div>
      </div>
    </DashboardLayout>
  );
}
