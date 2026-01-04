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
import { Check, X, Eye, Loader2, Shield, Users, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentVerification {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  receipt_url: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  subscription_tier: string;
  current_reading_score: number | null;
  current_listening_score: number | null;
  current_writing_score: number | null;
  current_speaking_score: number | null;
}

export default function PaymentVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
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
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch pending payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payment_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError);
    } else {
      // Fetch user profiles for each payment
      const paymentsWithProfiles = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("user_id", payment.user_id)
            .single();
          
          return {
            ...payment,
            profiles: profileData || { full_name: null, email: null },
          };
        })
      );
      setPayments(paymentsWithProfiles);
    }

    // Fetch all users
    const { data: usersData, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("Error fetching users:", usersError);
    } else {
      setUsers(usersData || []);
    }

    setLoading(false);
  };

  const handleApprove = async (payment: PaymentVerification) => {
    if (!user) return;
    setProcessingId(payment.id);

    try {
      const { error } = await supabase.rpc("approve_payment", {
        payment_id: payment.id,
        admin_id: user.id,
      });

      if (error) throw error;

      toast.success("Payment approved! User tier updated.");
      fetchData();
    } catch (error: any) {
      console.error("Approve error:", error);
      toast.error(error.message || "Failed to approve payment");
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
      fetchData();
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
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "free":
        return <Badge variant="outline">Free</Badge>;
      case "pro":
        return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">Pro</Badge>;
      case "elite":
        return <Badge variant="outline" className="bg-elite-gold/10 text-elite-gold border-elite-gold/30">Elite</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Payment verification & user management</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-light">Payment Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No payment requests found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.profiles?.full_name || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{payment.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {payment.plan_type === "road_to_8" ? "Road to 8.0+" : "Pro"}
                          </TableCell>
                          <TableCell>IDR {payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewReceipt(payment.receipt_url)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {payment.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApprove(payment)}
                                    disabled={processingId === payment.id}
                                    className="text-green-500 hover:text-green-400"
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
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-light">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No users found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Reading</TableHead>
                        <TableHead>Listening</TableHead>
                        <TableHead>Writing</TableHead>
                        <TableHead>Speaking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.full_name || "—"}
                          </TableCell>
                          <TableCell>{u.email || "—"}</TableCell>
                          <TableCell>{getTierBadge(u.subscription_tier)}</TableCell>
                          <TableCell>{u.current_reading_score ?? "—"}</TableCell>
                          <TableCell>{u.current_listening_score ?? "—"}</TableCell>
                          <TableCell>{u.current_writing_score ?? "—"}</TableCell>
                          <TableCell>{u.current_speaking_score ?? "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
      </div>
    </div>
  );
}