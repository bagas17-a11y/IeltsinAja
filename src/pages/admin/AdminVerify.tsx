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
import { Check, X, Eye, Loader2, Shield, Unlock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentWithProfile {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  receipt_url: string;
  status: string;
  created_at: string;
  user_email: string | null;
  user_name: string | null;
  is_verified: boolean;
}

export default function AdminVerify() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    fetchPayments();
  };

  const fetchPayments = async () => {
    setLoading(true);

    // Fetch all payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payment_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError);
      setLoading(false);
      return;
    }

    // Fetch associated profiles
    const paymentsWithProfiles = await Promise.all(
      (paymentsData || []).map(async (payment) => {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email, is_verified")
          .eq("user_id", payment.user_id)
          .single();

        return {
          ...payment,
          user_email: profileData?.email || null,
          user_name: profileData?.full_name || null,
          is_verified: profileData?.is_verified || false,
        };
      })
    );

    setPayments(paymentsWithProfiles);
    setLoading(false);
  };

  const handleApproveAndUnlock = async (payment: PaymentWithProfile) => {
    if (!user) return;
    setProcessingId(payment.id);

    try {
      // Approve the payment first
      const { error: approveError } = await supabase.rpc("approve_payment", {
        payment_id: payment.id,
        admin_id: user.id,
      });

      if (approveError) throw approveError;

      // Unlock the user (set is_verified to true)
      const { error: unlockError } = await supabase.rpc("unlock_user", {
        target_user_id: payment.user_id,
        admin_id: user.id,
      });

      if (unlockError) throw unlockError;

      toast.success("Payment approved & user unlocked!");
      fetchPayments();
    } catch (error: any) {
      console.error("Approve error:", error);
      toast.error(error.message || "Failed to approve and unlock");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!user) return;
    setProcessingId(paymentId);

    try {
      const { error } = await supabase
        .from("payment_verifications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", paymentId);

      if (error) throw error;

      toast.success("Payment rejected.");
      fetchPayments();
    } catch (error: any) {
      console.error("Reject error:", error);
      toast.error(error.message || "Failed to reject payment");
    } finally {
      setProcessingId(null);
    }
  };

  const viewReceipt = async (receiptPath: string) => {
    const { data } = await supabase.storage
      .from("payment-receipts")
      .createSignedUrl(receiptPath, 3600);

    if (data?.signedUrl) {
      setSelectedReceipt(data.signedUrl);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/30"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/30"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanName = (planType: string) => {
    return planType === "road_to_8" ? "Road to 8.0+" : "Pro";
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-foreground">
                Payment Verification
              </h1>
              <p className="text-sm text-muted-foreground">
                Verify payments and unlock user access
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Payments Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-light flex items-center gap-2">
              <Unlock className="w-5 h-5" />
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No payment requests found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Plan Selected</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {payment.user_name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.user_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanName(payment.plan_type)}</TableCell>
                      <TableCell>IDR {payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.is_verified ? (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500 border-green-500/30"
                          >
                            Yes
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-muted/50 text-muted-foreground"
                          >
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewReceipt(payment.receipt_url)}
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payment.status === "pending" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveAndUnlock(payment)}
                                disabled={processingId === payment.id}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {processingId === payment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    Approve & Unlock
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(payment.id)}
                                disabled={processingId === payment.id}
                                className="text-red-500 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Receipt Preview Dialog */}
        <Dialog
          open={!!selectedReceipt}
          onOpenChange={() => setSelectedReceipt(null)}
        >
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
      </div>
    </div>
  );
}
