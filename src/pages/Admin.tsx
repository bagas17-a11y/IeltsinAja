import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Bell,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  UserPlus,
  CreditCard,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookOpen
} from "lucide-react";
import { useAuth, isSuperAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PaymentVerification {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  status: string;
  receipt_url: string;
  created_at: string;
  profile?: {
    email: string;
    full_name: string;
  };
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
  is_verified: boolean;
  current_writing_score: number | null;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: "signup" | "payment";
  email: string;
  tier?: string;
  timestamp: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Check admin access
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!isLoading && user && !isSuperAdmin(user.email)) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      });
    }
  }, [user, isLoading, navigate, toast]);

  // Fetch data
  useEffect(() => {
    if (user && isSuperAdmin(user.email)) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch pending payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payment_verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (paymentsError) throw paymentsError;

      // Fetch profiles for payments
      const userIds = paymentsData?.map(p => p.user_id) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      const paymentsWithProfiles = paymentsData?.map(payment => ({
        ...payment,
        profile: profilesData?.find(p => p.user_id === payment.user_id)
      })) || [];

      setPayments(paymentsWithProfiles);

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Generate activity feed
      const activityItems: ActivityItem[] = [];
      
      // Add signups as activities
      usersData?.slice(0, 10).forEach(user => {
        activityItems.push({
          id: `signup-${user.id}`,
          type: "signup",
          email: user.email || "Unknown",
          timestamp: user.created_at,
        });
      });

      // Add payments as activities
      paymentsData?.slice(0, 10).forEach(payment => {
        const profile = profilesData?.find(p => p.user_id === payment.user_id);
        activityItems.push({
          id: `payment-${payment.id}`,
          type: "payment",
          email: profile?.email || "Unknown",
          tier: payment.plan_type,
          timestamp: payment.created_at,
        });
      });

      // Sort by timestamp
      activityItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(activityItems.slice(0, 15));

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleApprove = async (paymentId: string, userId: string) => {
    setProcessingId(paymentId);
    try {
      const { error } = await supabase.rpc("approve_payment", {
        payment_id: paymentId,
        admin_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Payment Approved",
        description: "User has been verified and notified.",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve payment",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedPaymentId) return;
    
    setProcessingId(selectedPaymentId);
    try {
      const { error } = await supabase
        .from("payment_verifications")
        .update({ 
          status: "rejected",
          admin_notes: rejectReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq("id", selectedPaymentId);

      if (error) throw error;

      toast({
        title: "Payment Rejected",
        description: "User has been notified of the rejection.",
      });
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedPaymentId(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject payment",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const viewReceipt = async (receiptPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("payment-receipts")
        .createSignedUrl(receiptPath, 300);

      if (error) throw error;
      setSelectedReceipt(data.signedUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load receipt",
        variant: "destructive",
      });
    }
  };

  const getPlanName = (planType: string) => {
    const plans: Record<string, string> = {
      pro: "Pro Plan",
      elite: "Road to 8.0+",
    };
    return plans[planType] || planType;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "elite":
        return <Badge className="bg-elite-gold/20 text-elite-gold border-elite-gold/30">Elite</Badge>;
      case "pro":
        return <Badge className="bg-accent/20 text-accent border-accent/30">Pro</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingPayments = payments.filter(p => p.status === "pending");

  if (isLoading || !user || !isSuperAdmin(user.email)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Admin Portal</h1>
              <p className="text-sm text-muted-foreground">Manage users and payments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/content")} className="gap-2">
              <BookOpen className="w-4 h-4" />
              Content Manager
            </Button>
            <Button variant="outline" onClick={fetchData} disabled={isLoadingData}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-light">{pendingPayments.length}</p>
                <p className="text-xs text-muted-foreground">Pending Verifications</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-light">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-light">{users.filter(u => u.is_verified).length}</p>
                <p className="text-xs text-muted-foreground">Verified Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-elite-gold" />
              </div>
              <div>
                <p className="text-2xl font-light">{payments.filter(p => p.status === 'approved').length}</p>
                <p className="text-xs text-muted-foreground">Approved Payments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                    {activity.type === "signup" ? (
                      <UserPlus className="w-4 h-4 text-accent mt-0.5" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-elite-gold mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {activity.type === "signup" ? (
                          <>
                            <span className="font-medium">New Sign-up:</span>{" "}
                            <span className="text-muted-foreground">{activity.email}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium">Payment Submitted:</span>{" "}
                            <span className="text-muted-foreground">{activity.email}</span>
                            {activity.tier && (
                              <span className="text-elite-gold"> - {getPlanName(activity.tier)}</span>
                            )}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="glass-card lg:col-span-2">
            <Tabs defaultValue="pending" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="pending" className="relative">
                    Verification Queue
                    {pendingPayments.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {pendingPayments.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="users">All Users</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Pending Payments Tab */}
                <TabsContent value="pending" className="mt-0">
                  {pendingPayments.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending verifications</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Receipt</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="text-sm">
                                {format(new Date(payment.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="text-sm font-medium">{payment.profile?.full_name || "—"}</p>
                                  <p className="text-xs text-muted-foreground">{payment.profile?.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>{getTierBadge(payment.plan_type)}</TableCell>
                              <TableCell className="font-medium">
                                Rp {payment.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewReceipt(payment.receipt_url)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                  onClick={() => handleApprove(payment.id, payment.user_id)}
                                  disabled={processingId === payment.id}
                                >
                                  {processingId === payment.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedPaymentId(payment.id);
                                    setRejectDialogOpen(true);
                                  }}
                                  disabled={processingId === payment.id}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* All Users Tab */}
                <TabsContent value="users" className="mt-0">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Writing Score</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">{user.full_name || "—"}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{getTierBadge(user.subscription_tier)}</TableCell>
                            <TableCell>
                              {user.is_verified ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.current_writing_score ? (
                                <span className="font-medium">{user.current_writing_score}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(user.created_at), "MMM d, yyyy")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Receipt Dialog */}
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
            </DialogHeader>
            {selectedReceipt && (
              <img src={selectedReceipt} alt="Payment Receipt" className="w-full rounded-lg" />
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for rejection. This will be sent to the user.
              </p>
              <Textarea
                placeholder="e.g., Incomplete transfer, wrong amount, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim() || processingId === selectedPaymentId}
              >
                {processingId === selectedPaymentId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}