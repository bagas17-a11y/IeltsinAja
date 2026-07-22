import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft, Loader2, RefreshCw, Search, UserPlus, GraduationCap, Pencil, X, Save,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MentorRow {
  user_id: string;
  name: string;
  title: string;
  bio: string | null;
  ielts_score_display: string | null;
  focus_areas: string[];
  whatsapp_number: string;
  is_active: boolean;
}

interface StudentRow {
  user_id: string;
  email: string;
  full_name: string | null;
  assignedMentorId: string | null;
}

const UNASSIGNED = "__unassigned__";

const emptyNewMentor = { user_id: "", name: "", title: "IELTS Coach", bio: "", ielts_score_display: "", focus_areas: "", whatsapp_number: "" };

export default function MentorManagement() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, isCheckingAdmin } = useAuth();
  const { toast } = useToast();

  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [adminCandidates, setAdminCandidates] = useState<{ user_id: string; email: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [newMentor, setNewMentor] = useState(emptyNewMentor);
  const [editingMentorId, setEditingMentorId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string; title: string; bio: string; ielts_score_display: string; focusAreasText: string; whatsapp_number: string; is_active: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) { navigate("/auth"); return; }
    if (!isLoading && !isCheckingAdmin && user && !isAdmin) {
      navigate("/dashboard");
      toast({ title: "Access Denied", description: "Admin only.", variant: "destructive" });
    }
  }, [user, isLoading, isCheckingAdmin, isAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) fetchData();
  }, [user, isAdmin]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [{ data: mentorRows }, { data: profileRows }, { data: assignmentRows }, { data: adminRoleRows }] = await Promise.all([
        supabase.from("mentors").select("*").order("created_at", { ascending: true }),
        supabase.from("profiles").select("user_id, email, full_name").order("created_at", { ascending: false }),
        supabase.from("mentor_assignments").select("student_id, mentor_user_id"),
        supabase.from("user_roles").select("user_id").eq("role", "admin"),
      ]);

      setMentors(mentorRows ?? []);

      const assignMap: Record<string, string> = {};
      (assignmentRows ?? []).forEach((a) => { assignMap[a.student_id] = a.mentor_user_id; });

      const emailByUserId: Record<string, string> = {};
      (profileRows ?? []).forEach((p) => { emailByUserId[p.user_id] = p.email ?? p.user_id; });

      setStudents((profileRows ?? []).map((p) => ({
        user_id: p.user_id,
        email: p.email ?? "(no email)",
        full_name: p.full_name,
        assignedMentorId: assignMap[p.user_id] ?? null,
      })));

      const mentorIds = new Set((mentorRows ?? []).map((m) => m.user_id));
      const adminIds = (adminRoleRows ?? []).map((r) => r.user_id);
      setAdminCandidates(
        adminIds
          .filter((id) => !mentorIds.has(id))
          .map((id) => ({ user_id: id, email: emailByUserId[id] ?? id }))
      );
    } catch (err) {
      console.error("Failed to load mentor data:", err);
      toast({ title: "Failed to load mentor data", variant: "destructive" });
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredStudents = useMemo(
    () => students.filter((s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.full_name ?? "").toLowerCase().includes(search.toLowerCase())
    ),
    [students, search]
  );

  const mentorName = (mentorUserId: string | null) => {
    if (!mentorUserId) return null;
    return mentors.find((m) => m.user_id === mentorUserId)?.name ?? "Unknown mentor";
  };

  const assignMentor = async (studentId: string, mentorUserId: string | null) => {
    // Optimistic update, reverted on failure.
    const prevStudents = students;
    setStudents((prev) => prev.map((s) => (s.user_id === studentId ? { ...s, assignedMentorId: mentorUserId } : s)));
    try {
      if (!mentorUserId) {
        const { error } = await supabase.from("mentor_assignments").delete().eq("student_id", studentId);
        if (error) throw error;
        toast({ title: "Mentor unassigned" });
      } else {
        const { error } = await supabase.from("mentor_assignments").upsert(
          { student_id: studentId, mentor_user_id: mentorUserId, assigned_by: user!.id, assigned_at: new Date().toISOString() },
          { onConflict: "student_id" }
        );
        if (error) throw error;
        toast({ title: "Mentor assigned" });
      }
    } catch (err) {
      console.error("Failed to update assignment:", err);
      setStudents(prevStudents);
      toast({ title: "Failed to update assignment", variant: "destructive" });
    }
  };

  const addMentor = async () => {
    if (!newMentor.user_id || !newMentor.name.trim() || !newMentor.whatsapp_number.trim()) {
      toast({ title: "Admin user, name, and WhatsApp number are required", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from("mentors").insert({
        user_id: newMentor.user_id,
        name: newMentor.name.trim(),
        title: newMentor.title.trim() || "IELTS Coach",
        bio: newMentor.bio.trim() || null,
        ielts_score_display: newMentor.ielts_score_display.trim() || null,
        focus_areas: newMentor.focus_areas.split(",").map((s) => s.trim()).filter(Boolean),
        whatsapp_number: newMentor.whatsapp_number.replace(/[^0-9]/g, ""),
      });
      if (error) throw error;
      toast({ title: "Mentor added" });
      setShowAddMentor(false);
      setNewMentor(emptyNewMentor);
      fetchData();
    } catch (err) {
      console.error("Failed to add mentor:", err);
      toast({ title: "Failed to add mentor", variant: "destructive" });
    }
  };

  const startEdit = (m: MentorRow) => {
    setEditingMentorId(m.user_id);
    setEditForm({
      name: m.name, title: m.title, bio: m.bio ?? "",
      ielts_score_display: m.ielts_score_display ?? "",
      focusAreasText: m.focus_areas.join(", "),
      whatsapp_number: m.whatsapp_number,
      is_active: m.is_active,
    });
  };

  const saveEdit = async () => {
    if (!editingMentorId || !editForm) return;
    try {
      const { error } = await supabase.from("mentors").update({
        name: editForm.name.trim(),
        title: editForm.title.trim() || "IELTS Coach",
        bio: editForm.bio.trim() || null,
        ielts_score_display: editForm.ielts_score_display.trim() || null,
        focus_areas: editForm.focusAreasText.split(",").map((s) => s.trim()).filter(Boolean),
        whatsapp_number: editForm.whatsapp_number.replace(/[^0-9]/g, ""),
        is_active: editForm.is_active,
        updated_at: new Date().toISOString(),
      }).eq("user_id", editingMentorId);
      if (error) throw error;
      toast({ title: "Mentor updated" });
      setEditingMentorId(null);
      setEditForm(null);
      fetchData();
    } catch (err) {
      console.error("Failed to update mentor:", err);
      toast({ title: "Failed to update mentor", variant: "destructive" });
    }
  };

  if (isLoading || isCheckingAdmin) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Mentor Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage mentor profiles and assign students to a mentor
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={isLoadingData}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Mentors section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light">Mentors ({mentors.length})</h2>
            <Button size="sm" onClick={() => setShowAddMentor((v) => !v)}>
              <UserPlus className="w-4 h-4 mr-2" />
              {showAddMentor ? "Cancel" : "Add Mentor"}
            </Button>
          </div>

          {showAddMentor && (
            <Card className="glass-card">
              <CardContent className="p-5 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs text-muted-foreground">Admin user (must already have the admin role)</label>
                    <Select value={newMentor.user_id} onValueChange={(v) => setNewMentor((m) => ({ ...m, user_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select an admin user" /></SelectTrigger>
                      <SelectContent>
                        {adminCandidates.length === 0 && (
                          <div className="px-3 py-2 text-xs text-muted-foreground">No admins available — every admin already has a mentor profile.</div>
                        )}
                        {adminCandidates.map((a) => (
                          <SelectItem key={a.user_id} value={a.user_id}>{a.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Name</label>
                    <Input value={newMentor.name} onChange={(e) => setNewMentor((m) => ({ ...m, name: e.target.value }))} placeholder="e.g. Bagas H. Wicaksono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Title</label>
                    <Input value={newMentor.title} onChange={(e) => setNewMentor((m) => ({ ...m, title: e.target.value }))} placeholder="e.g. Founder & lead coach" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">IELTS score display</label>
                    <Input value={newMentor.ielts_score_display} onChange={(e) => setNewMentor((m) => ({ ...m, ielts_score_display: e.target.value }))} placeholder="e.g. IELTS 8.5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">WhatsApp number (country code, no +)</label>
                    <Input value={newMentor.whatsapp_number} onChange={(e) => setNewMentor((m) => ({ ...m, whatsapp_number: e.target.value }))} placeholder="e.g. 6281234567890" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs text-muted-foreground">Focus areas (comma-separated)</label>
                    <Input value={newMentor.focus_areas} onChange={(e) => setNewMentor((m) => ({ ...m, focus_areas: e.target.value }))} placeholder="e.g. Writing, Speaking" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs text-muted-foreground">Bio</label>
                    <Textarea value={newMentor.bio} onChange={(e) => setNewMentor((m) => ({ ...m, bio: e.target.value }))} rows={2} placeholder="Short bio shown to their assigned students" />
                  </div>
                </div>
                <Button onClick={addMentor}>
                  <Save className="w-4 h-4 mr-2" /> Save Mentor
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {mentors.map((m) => (
              <Card key={m.user_id} className="glass-card">
                <CardContent className="p-5">
                  {editingMentorId === m.user_id && editForm ? (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                        <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                        <Input value={editForm.ielts_score_display} onChange={(e) => setEditForm({ ...editForm, ielts_score_display: e.target.value })} placeholder="IELTS score display" />
                        <Input value={editForm.whatsapp_number} onChange={(e) => setEditForm({ ...editForm, whatsapp_number: e.target.value })} placeholder="WhatsApp number" />
                        <Input className="sm:col-span-2" value={editForm.focusAreasText} onChange={(e) => setEditForm({ ...editForm, focusAreasText: e.target.value })} placeholder="Focus areas (comma-separated)" />
                        <Textarea className="sm:col-span-2" rows={2} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Bio" />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={editForm.is_active} onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })} />
                        Active (visible for new student assignments)
                      </label>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}><Save className="w-3.5 h-3.5 mr-1.5" />Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingMentorId(null); setEditForm(null); }}>
                          <X className="w-3.5 h-3.5 mr-1.5" />Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{m.name}</h3>
                            {m.ielts_score_display && (
                              <Badge variant="outline" className="text-elite-gold border-elite-gold/30 bg-elite-gold/10 text-xs">
                                {m.ielts_score_display}
                              </Badge>
                            )}
                            {!m.is_active && <Badge variant="outline" className="text-xs text-muted-foreground">Inactive</Badge>}
                          </div>
                          <p className="text-sm text-elite-gold">{m.title}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(m)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                      {m.bio && <p className="text-sm text-muted-foreground mt-2">{m.bio}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {m.focus_areas.map((f) => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">WhatsApp: {m.whatsapp_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {students.filter((s) => s.assignedMentorId === m.user_id).length} student(s) assigned
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
            {mentors.length === 0 && !isLoadingData && (
              <p className="text-sm text-muted-foreground col-span-2 text-center py-8">
                No mentors yet — add one above.
              </p>
            )}
          </div>
        </div>

        {/* Student assignments section */}
        <div className="space-y-4">
          <h2 className="text-lg font-light">Student Assignments</h2>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by email or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          <Card className="glass-card">
            <CardContent className="p-0">
              {isLoadingData ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-16">No students found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Current Mentor</TableHead>
                        <TableHead className="w-64">Assign To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => (
                        <TableRow key={s.user_id}>
                          <TableCell>
                            <div className="font-medium text-sm">{s.full_name || "—"}</div>
                            <div className="text-xs text-muted-foreground">{s.email}</div>
                          </TableCell>
                          <TableCell>
                            {mentorName(s.assignedMentorId) ?? <span className="text-muted-foreground text-sm">Unassigned</span>}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={s.assignedMentorId ?? UNASSIGNED}
                              onValueChange={(v) => assignMentor(s.user_id, v === UNASSIGNED ? null : v)}
                            >
                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                                {mentors.map((m) => (
                                  <SelectItem key={m.user_id} value={m.user_id}>{m.name}{!m.is_active ? " (inactive)" : ""}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
