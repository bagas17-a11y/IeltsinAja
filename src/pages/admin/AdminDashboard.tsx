import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Clock,
  CreditCard,
  CheckCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  Headphones,
  UserPlus,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  FileText,
  Zap,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
}

interface ActivityItem {
  id: string;
  type: "payment_approved" | "user_registered" | "subscription_renewed" | "payment_submitted";
  email: string;
  action: string;
  status: "success" | "pending" | "info";
  timestamp: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingVerifications: 0,
    activeSubscriptions: 0,
    revenueThisMonth: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Check admin access
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!isLoading && user && !isAdmin) {
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
    if (user && isAdmin) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (usersError) throw usersError;

      // Fetch pending verifications count
      const { count: pendingVerifications, error: pendingError } = await supabase
        .from("payment_verifications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      // Fetch active subscriptions (users with subscription_tier != 'free' and is_verified)
      const { count: activeSubscriptions, error: subError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .neq("subscription_tier", "free")
        .eq("is_verified", true);

      if (subError) throw subError;

      // Fetch revenue this month (approved payments in current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyPayments, error: revenueError } = await supabase
        .from("payment_verifications")
        .select("amount")
        .eq("status", "approved")
        .gte("created_at", startOfMonth.toISOString());

      if (revenueError) throw revenueError;

      const revenueThisMonth = monthlyPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        pendingVerifications: pendingVerifications || 0,
        activeSubscriptions: activeSubscriptions || 0,
        revenueThisMonth,
      });

      // Fetch recent activity
      await fetchRecentActivity();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const activityItems: ActivityItem[] = [];

      // Fetch recent approved payments (from admin_logs)
      const { data: adminLogs } = await supabase
        .from("admin_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (adminLogs) {
        for (const log of adminLogs) {
          // Get the target user's email
          let userEmail = "Unknown";
          if (log.target_user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("email")
              .eq("user_id", log.target_user_id)
              .maybeSingle();
            userEmail = profile?.email || "Unknown";
          }

          activityItems.push({
            id: log.id,
            type: log.action_type === "payment_approval" ? "payment_approved" : "subscription_renewed",
            email: userEmail,
            action: log.action_type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
            status: log.status === "success" ? "success" : "pending",
            timestamp: log.created_at,
          });
        }
      }

      // Fetch recent user signups
      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentUsers) {
        for (const u of recentUsers) {
          activityItems.push({
            id: `signup-${u.id}`,
            type: "user_registered",
            email: u.email || "Unknown",
            action: "New User Registered",
            status: "info",
            timestamp: u.created_at,
          });
        }
      }

      // Fetch recent payment submissions
      const { data: recentPayments } = await supabase
        .from("payment_verifications")
        .select("id, user_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentPayments) {
        const userIds = recentPayments.map((p) => p.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, email")
          .in("user_id", userIds);

        for (const payment of recentPayments) {
          const profile = profiles?.find((p) => p.user_id === payment.user_id);
          activityItems.push({
            id: `payment-${payment.id}`,
            type: payment.status === "approved" ? "payment_approved" : "payment_submitted",
            email: profile?.email || "Unknown",
            action:
              payment.status === "approved"
                ? "Payment Approved"
                : payment.status === "rejected"
                ? "Payment Rejected"
                : "Payment Submitted",
            status: payment.status === "approved" ? "success" : "pending",
            timestamp: payment.created_at,
          });
        }
      }

      // Sort by timestamp and take top 10
      activityItems.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActivities(activityItems.slice(0, 10));
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: "Payment Verification",
      description: "Review and approve pending payments",
      icon: <ShieldCheck className="w-6 h-6" />,
      path: "/admin/verify",
      color: "text-green-500",
    },
    {
      title: "User Management",
      description: "Manage users, roles, and subscriptions",
      icon: <Users className="w-6 h-6" />,
      path: "/admin/users",
      color: "text-accent",
    },
    {
      title: "Content Manager",
      description: "Manage IELTS writing questions",
      icon: <BookOpen className="w-6 h-6" />,
      path: "/admin/content",
      color: "text-purple-500",
    },
    {
      title: "Listening Manager",
      description: "Manage listening tests and audio",
      icon: <Headphones className="w-6 h-6" />,
      path: "/admin/listening",
      color: "text-blue-500",
    },
    {
      title: "Subscription Management",
      description: "Manage plans and subscription status",
      icon: <CreditCard className="w-6 h-6" />,
      path: "/admin/subscriptions",
      color: "text-elite-gold",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/30"
          >
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
          >
            Pending
          </Badge>
        );
      case "info":
        return (
          <Badge
            variant="outline"
            className="bg-accent/10 text-accent border-accent/30"
          >
            Info
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment_approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "user_registered":
        return <UserPlus className="w-4 h-4 text-accent" />;
      case "subscription_renewed":
        return <Zap className="w-4 h-4 text-elite-gold" />;
      case "payment_submitted":
        return <CreditCard className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (isLoading || !user || !isAdmin) {
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
              <h1 className="text-2xl font-light">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Overview of platform activity and management
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={isLoadingData}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoadingData ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Overview - 4 Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-light">
                  {isLoadingData ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    stats.totalUsers
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-light">
                  {isLoadingData ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    stats.pendingVerifications
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Pending Verifications
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-light">
                  {isLoadingData ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    stats.activeSubscriptions
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Active Subscriptions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-elite-gold" />
              </div>
              <div>
                <p className="text-2xl font-light">
                  {isLoadingData ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    `Rp ${stats.revenueThisMonth.toLocaleString()}`
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Revenue This Month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-light mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.path}
                className="glass-card cursor-pointer hover:border-accent/30 transition-all duration-200 group"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-4 space-y-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{getActivityIcon(activity.type)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(
                            new Date(activity.timestamp),
                            "MMM d, yyyy h:mm a"
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {activity.email}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {activity.action}
                        </TableCell>
                        <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
