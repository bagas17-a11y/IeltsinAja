import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Check,
  X,
  Eye,
  Loader2,
  Shield,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentVerification {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  receipt_url: string;
  status: string;
  created_at: string;
  admin_notes?: string | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

const isWhatsAppRequest = (receiptUrl: string | null | undefined) =>
  !receiptUrl || receiptUrl === "whatsapp";

export default function PaymentVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingPayment, setApprovingPayment] = useState<PaymentVerification | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (error || !data) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payment_verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (paymentsError) throw paymentsError;

      // Batch-fetch related profiles in one query instead of N+1
      const userIds = Array.from(new Set((paymentsData ?? []).map((p) => p.user_id)));
      const profilesByUserId = new Map<string, { full_name: string | null; email: string | null }>();

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;
        (profilesData ?? []).forEach((p) =>
          profilesByUserId.set(p.user_id, { full_name: p.full_name, email: p.email })
        );
      }

      const paymentsWithProfiles = (paymentsData ?? []).map((payment) => ({
        ...payment,
        profiles: profilesByUserId.get(payment.user_id) ?? { full_name: null, email: null },
      }));

      setPayments(paymentsWithProfiles);
    } catch (err: any) {
      console.error("Error loading payments:", err);
      setLoadError(err?.message ?? "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payment: PaymentVerification) => {
    if (!user) return;
    setProcessingId(payment.id);

    try {
      // approve_payment now returns JSON { success, error?, code?, ... }
      const { data, error } = await supabase.rpc("approve_payment", {
        payment_id: payment.id,
        admin_id: user.id,
      });

      if (error) throw error;

      const payload = data as { success?: boolean; error?: string; code?: string } | null;
      if (payload && payload.success === false) {
        throw new Error(payload.error ?? "Approval failed");
      }

      const userEmail = payment.profiles?.email;
      const userName = payment.profiles?.full_name;
      const planName = payment.plan_type === "road_to_8" ? "elite" : "pro";

      if (userEmail) {
        try {
          const { data: emailResult, error: emailError } = await supabase.functions.invoke(
            "send-verification-email",
            {
              body: {
                email: userEmail,
                full_name: userName || "IELTS Learner",
                plan_name: planName,
              },
            }
          );

          if (emailError) throw emailError;

          // Log success
          await supabase.from("admin_logs").insert({
            action_type: "payment_approved_email_sent",
            target_user_id: payment.user_id,
            admin_id: user.id,
            status: "success",
            details: {
              payment_id: payment.id,
              plan_type: planName,
              email_sent_to: userEmail,
            },
          });

          toast.success("Payment approved & verification email sent! 🎉");
        } catch (emailError: any) {
          console.error("Email sending failed:", emailError);
          
          // Log the email error
          await supabase.from("admin_logs").insert({
            action_type: "payment_approved_email_failed",
            target_user_id: payment.user_id,
            admin_id: user.id,
            status: "error",
            details: {
              payment_id: payment.id,
              plan_type: planName,
              email_attempted: userEmail,
            },
            error_message: emailError.message || "Failed to send verification email",
          });

          toast.success("Payment approved!", { 
            description: "⚠️ But email failed to send. Check admin logs." 
          });
        }
      } else {
        toast.success("Payment approved! (No email on file)");
      }

      fetchData();
    } catch (error: any) {
      console.error("Approve error:", error);
      
      // Log the approval error
      await supabase.from("admin_logs").insert({
        action_type: "payment_approval_failed",
        target_user_id: payment.user_id,
        admin_id: user.id,
        status: "error",
        details: { payment_id: payment.id },
        error_message: error.message || "Failed to approve payment",
      });

      toast.error(error.message || "Failed to approve payment");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!user || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setProcessingId(paymentId);

    try {
      const { data, error } = await supabase.rpc("reject_payment", {
        payment_id: paymentId,
        admin_id: user.id,
        rejection_reason: rejectReason,
      });

      if (error) throw error;

      const payload = data as { success?: boolean; error?: string } | null;
      if (payload && payload.success === false) {
        throw new Error(payload.error ?? "Rejection failed");
      }

      // The RPC logs to admin_logs but doesn't persist the textual reason on
      // payment_verifications.admin_notes — mirror it for the in-app history.
      await supabase
        .from("payment_verifications")
        .update({ admin_notes: rejectReason })
        .eq("id", paymentId);

      toast.success("Payment rejected.");
      setRejectingId(null);
      setRejectReason("");
      fetchData();
    } catch (error: any) {
      console.error("Reject error:", error);
      toast.error(error.message || "Failed to reject payment");
    } finally {
      setProcessingId(null);
    }
  };

  const viewReceipt = async (receiptPath: string) => {
    if (isWhatsAppRequest(receiptPath)) {
      toast.message("Payment proof is on WhatsApp — check your chat with this user.");
      return;
    }

    const { data } = await supabase.storage
      .from("payment-receipts")
      .createSignedUrl(receiptPath, 3600);

    if (data?.signedUrl) {
      setSelectedReceipt(data.signedUrl);
    } else {
      toast.error("Could not load receipt image.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const otherPayments = payments.filter((p) => p.status !== "pending");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-foreground">Payment verification</h1>
              <p className="text-sm text-muted-foreground">
                New signups appear here after they pick Pro/Elite. Confirm payment on
                WhatsApp, then Approve to assign their plan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/users")}>
              Manage users
            </Button>
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              Back to admin
            </Button>
          </div>
        </div>

        {(() => {
          const renderTable = (rows: PaymentVerification[], showActions: boolean) => (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {payment.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.profiles?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {payment.plan_type === "road_to_8" || payment.plan_type === "elite"
                        ? "Elite"
                        : "Pro"}
                    </TableCell>
                    <TableCell>IDR {payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {isWhatsAppRequest(payment.receipt_url) ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                          WhatsApp
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Receipt upload
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!isWhatsAppRequest(payment.receipt_url) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewReceipt(payment.receipt_url)}
                            title="View receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {showActions && payment.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setApprovingPayment(payment)}
                              disabled={processingId === payment.id}
                              className="text-green-500 hover:text-green-400"
                              title="Assign plan after WhatsApp payment confirmed"
                            >
                              {processingId === payment.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRejectingId(payment.id)}
                              disabled={processingId === payment.id}
                              className="text-red-500 hover:text-red-400"
                              title="Reject payment"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {payment.status === "rejected" && payment.admin_notes && (
                          <span
                            className="text-xs text-muted-foreground max-w-[150px] truncate"
                            title={payment.admin_notes}
                          >
                            {payment.admin_notes}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );

          if (loading) {
            return (
              <Card className="glass-card">
                <CardContent className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </CardContent>
              </Card>
            );
          }

          if (loadError) {
            return (
              <Card className="glass-card border-destructive/40">
                <CardContent className="py-10 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
                  <p className="text-sm text-foreground">Couldn't load payments.</p>
                  <p className="text-xs text-muted-foreground">{loadError}</p>
                  <Button variant="outline" onClick={fetchData}>
                    Try again
                  </Button>
                </CardContent>
              </Card>
            );
          }

          return (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="glass-card">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pending ({pendingPayments.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  History ({otherPayments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-light">
                      Pending payments
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Users arrive via WhatsApp after signup. Approve once you&apos;ve
                      confirmed their transfer in chat.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {pendingPayments.length === 0 ? (
                      <div className="py-12 text-center space-y-3">
                        <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                        <p className="text-sm text-foreground">No pending payments.</p>
                        <p className="text-xs text-muted-foreground">
                          You're all caught up. New transfers will show up here.
                        </p>
                      </div>
                    ) : (
                      renderTable(pendingPayments, true)
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-light">Payment history</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Approved and rejected transfers from past pilots.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {otherPayments.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          No payments processed yet.
                        </p>
                      </div>
                    ) : (
                      renderTable(otherPayments, false)
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          );
        })()}

        {/* Receipt Preview Dialog */}
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
            </DialogHeader>
            {selectedReceipt && (
              <img
                src={selectedReceipt}
                alt="Payment receipt"
                className="w-full rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation Dialog */}
        <AlertDialog
          open={!!approvingPayment}
          onOpenChange={(open) => !open && setApprovingPayment(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Assign plan after WhatsApp payment?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2">
                  <p>Confirm you received payment on WhatsApp, then assign:</p>
                  <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-sm">
                    <p><span className="text-muted-foreground">User:</span> <span className="font-medium text-foreground">{approvingPayment?.profiles?.full_name || "Unknown"}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> {approvingPayment?.profiles?.email || "—"}</p>
                    <p><span className="text-muted-foreground">Plan:</span> {approvingPayment?.plan_type === "road_to_8" ? "Road to 8.0+" : "Pro"}</p>
                    <p><span className="text-muted-foreground">Amount:</span> IDR {approvingPayment?.amount.toLocaleString()}</p>
                  </div>
                  <p className="text-xs">
                    A verification email will be sent and the user will be unlocked
                    immediately. This action is logged and cannot be silently undone.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (approvingPayment) {
                    const payment = approvingPayment;
                    setApprovingPayment(null);
                    handleApprove(payment);
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Yes, approve & unlock
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Reason Dialog */}
        <Dialog open={!!rejectingId} onOpenChange={() => { setRejectingId(null); setRejectReason(""); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-500" />
                Reject Payment
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for rejecting this payment. The user will be notified.
              </p>
              <Textarea
                placeholder="e.g., Incomplete amount, unclear receipt, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => { setRejectingId(null); setRejectReason(""); }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => rejectingId && handleReject(rejectingId)}
                  disabled={!rejectReason.trim() || processingId === rejectingId}
                >
                  {processingId === rejectingId ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Reject Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}