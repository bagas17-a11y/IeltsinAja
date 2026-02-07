import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Download,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Clock,
  CalendarPlus,
  ArrowLeft,
  UserCog,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { useAuth, isSuperAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays, isPast } from "date-fns";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  subscription_tier: string;
  subscription_status: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  subscription_expires_at: string | null;
  auto_renew: boolean;
  last_payment_date: string | null;
  is_verified: boolean;
  target_band_score: number | null;
  current_reading_score: number | null;
  current_listening_score: number | null;
  current_writing_score: number | null;
  current_speaking_score: number | null;
  created_at: string;
  updated_at: string;
}

interface PaymentRecord {
  id: string;
  plan_type: string;
  amount: number;
  status: string;
  receipt_url: string;
  created_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
}

interface AdminLogRecord {
  id: string;
  action_type: string;
  status: string;
  details: any;
  created_at: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [adminUserIds, setAdminUserIds] = useState<Set<string>>(new Set());
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  // Detail drawer state
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userPayments, setUserPayments] = useState<PaymentRecord[]>([]);
  const [userAdminLogs, setUserAdminLogs] = useState<AdminLogRecord[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Extend subscription dialog state
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendUserId, setExtendUserId] = useState<string | null>(null);
  const [extendDays, setExtendDays] = useState("30");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      fetchUsers();
      fetchAdminUserIds();
    }
  }, [user]);

  const fetchUsers = async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers((data as UserProfile[]) || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchAdminUserIds = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (error) throw error;
      setAdminUserIds(new Set(data?.map((r) => r.user_id) || []));
    } catch (error) {
      console.error("Error fetching admin roles:", error);
    }
  };

  const getEffectiveSubStatus = useCallback((u: UserProfile): string => {
    // Use subscription_end_date or subscription_expires_at to determine status
    const endDate = u.subscription_end_date || u.subscription_expires_at;
    if (u.subscription_tier === "free" && !u.is_verified) return "none";
    if (u.subscription_tier === "free") return "none";
    if (endDate && isPast(new Date(endDate))) return "expired";
    if (u.subscription_status === "active" || (u.is_verified && u.subscription_tier !== "free"))
      return "active";
    if (u.subscription_status === "trial") return "trial";
    return u.subscription_status || "none";
  }, []);

  const getDaysLeft = useCallback((u: UserProfile): number | null => {
    const endDate = u.subscription_end_date || u.subscription_expires_at;
    if (!endDate) return null;
    const days = differenceInDays(new Date(endDate), new Date());
    return days < 0 ? 0 : days;
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchesSearch =
          u.email?.toLowerCase().includes(q) ||
          u.full_name?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Subscription status filter
      if (subscriptionFilter !== "all") {
        const status = getEffectiveSubStatus(u);
        if (subscriptionFilter !== status) return false;
      }

      // Verification filter
      if (verificationFilter !== "all") {
        if (verificationFilter === "verified" && !u.is_verified) return false;
        if (verificationFilter === "not_verified" && u.is_verified) return false;
      }

      // Role filter
      if (roleFilter !== "all") {
        const isAdmin = adminUserIds.has(u.user_id);
        if (roleFilter === "admin" && !isAdmin) return false;
        if (roleFilter === "user" && isAdmin) return false;
      }

      return true;
    });
  }, [users, debouncedSearch, subscriptionFilter, verificationFilter, roleFilter, adminUserIds, getEffectiveSubStatus]);

  const handleToggleAdmin = async (targetUserId: string) => {
    if (!user) return;
    setProcessingUserId(targetUserId);

    try {
      const { data, error } = await supabase.rpc("toggle_admin_role", {
        target_user_id: targetUserId,
        admin_id: user.id,
      });

      if (error) throw error;

      const isNowAdmin = data as boolean;
      toast({
        title: isNowAdmin ? "Admin Role Granted" : "Admin Role Revoked",
        description: isNowAdmin
          ? "User now has admin privileges."
          : "Admin privileges have been removed.",
      });

      // Update local state
      if (isNowAdmin) {
        setAdminUserIds((prev) => new Set([...prev, targetUserId]));
      } else {
        setAdminUserIds((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle admin role",
        variant: "destructive",
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleExtendSubscription = async () => {
    if (!user || !extendUserId) return;
    setProcessingUserId(extendUserId);

    try {
      const { error } = await supabase.rpc("extend_subscription", {
        target_user_id: extendUserId,
        days_to_add: parseInt(extendDays, 10),
        admin_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Subscription Extended",
        description: `Added ${extendDays} days to subscription.`,
      });

      setExtendDialogOpen(false);
      setExtendUserId(null);
      setExtendDays("30");
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to extend subscription",
        variant: "destructive",
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleVerifyUser = async (targetUserId: string) => {
    if (!user) return;
    setProcessingUserId(targetUserId);

    try {
      const { error } = await supabase.rpc("unlock_user", {
        target_user_id: targetUserId,
        admin_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "User Verified",
        description: "User has been manually verified.",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify user",
        variant: "destructive",
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  const openUserDetail = async (u: UserProfile) => {
    setSelectedUser(u);
    setDrawerOpen(true);
    setLoadingDetails(true);

    try {
      // Fetch payment history
      const { data: payments } = await supabase
        .from("payment_verifications")
        .select("*")
        .eq("user_id", u.user_id)
        .order("created_at", { ascending: false });

      setUserPayments((payments as PaymentRecord[]) || []);

      // Fetch admin logs for this user
      const { data: logs } = await supabase
        .from("admin_logs")
        .select("*")
        .eq("target_user_id", u.user_id)
        .order("created_at", { ascending: false })
        .limit(20);

      setUserAdminLogs((logs as AdminLogRecord[]) || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const exportToCsv = () => {
    const headers = [
      "Full Name",
      "Email",
      "Plan Type",
      "Subscription Status",
      "Days Left",
      "Verified",
      "Is Admin",
      "Created At",
    ];
    const rows = filteredUsers.map((u) => [
      u.full_name || "",
      u.email || "",
      u.subscription_tier,
      getEffectiveSubStatus(u),
      getDaysLeft(u)?.toString() || "N/A",
      u.is_verified ? "Yes" : "No",
      adminUserIds.has(u.user_id) ? "Yes" : "No",
      format(new Date(u.created_at), "yyyy-MM-dd"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSubStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/30"
          >
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/30"
          >
            Expired
          </Badge>
        );
      case "trial":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/30"
          >
            Trial
          </Badge>
        );
      case "none":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            None
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "elite":
        return (
          <Badge className="bg-elite-gold/20 text-elite-gold border-elite-gold/30">
            Road to 8
          </Badge>
        );
      case "pro":
        return (
          <Badge className="bg-accent/20 text-accent border-accent/30">
            Pro
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            None
          </Badge>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
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
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
          >
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading || !user || !isSuperAdmin(user.email)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light">User Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage users, roles, and subscriptions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchUsers} disabled={isLoadingData}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoadingData ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Subscription Status filter */}
              <Select
                value={subscriptionFilter}
                onValueChange={setSubscriptionFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>

              {/* Verification filter */}
              <Select
                value={verificationFilter}
                onValueChange={setVerificationFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="not_verified">Not Verified</SelectItem>
                </SelectContent>
              </Select>

              {/* Role filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              {/* Export button */}
              <Button variant="outline" onClick={exportToCsv}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass-card">
          <CardContent className="p-0">
            {isLoadingData ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan Type</TableHead>
                      <TableHead>Sub Status</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Is Admin</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => {
                      const status = getEffectiveSubStatus(u);
                      const daysLeft = getDaysLeft(u);
                      const isAdmin = adminUserIds.has(u.user_id);

                      return (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.full_name || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {u.email || "—"}
                          </TableCell>
                          <TableCell>{getTierBadge(u.subscription_tier)}</TableCell>
                          <TableCell>{getSubStatusBadge(status)}</TableCell>
                          <TableCell>
                            {daysLeft !== null ? (
                              <span
                                className={
                                  daysLeft <= 7
                                    ? "text-red-500 font-medium"
                                    : daysLeft <= 14
                                    ? "text-yellow-500"
                                    : "text-muted-foreground"
                                }
                              >
                                {daysLeft} days
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {u.is_verified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={isAdmin}
                              onCheckedChange={() => handleToggleAdmin(u.user_id)}
                              disabled={processingUserId === u.user_id}
                            />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {format(new Date(u.updated_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* View Details */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openUserDetail(u)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              {/* Extend Subscription */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setExtendUserId(u.user_id);
                                  setExtendDialogOpen(true);
                                }}
                                title="Extend Subscription"
                              >
                                <CalendarPlus className="w-4 h-4" />
                              </Button>

                              {/* Verify User */}
                              {!u.is_verified && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerifyUser(u.user_id)}
                                  disabled={processingUserId === u.user_id}
                                  title="Verify User"
                                  className="text-green-500 hover:text-green-400"
                                >
                                  {processingUserId === u.user_id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Shield className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Detail Sheet/Drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-accent" />
                User Details
              </SheetTitle>
            </SheetHeader>

            {selectedUser && (
              <div className="space-y-6 mt-6">
                {/* Profile Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Profile
                  </h3>
                  <div className="space-y-2 bg-secondary/30 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium">
                        {selectedUser.full_name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-medium">
                        {selectedUser.email || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Registered
                      </span>
                      <span className="text-sm">
                        {format(
                          new Date(selectedUser.created_at),
                          "MMM d, yyyy h:mm a"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Verified
                      </span>
                      <span>
                        {selectedUser.is_verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Admin
                      </span>
                      <span className="text-sm">
                        {adminUserIds.has(selectedUser.user_id) ? (
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            User
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Subscription
                  </h3>
                  <div className="space-y-2 bg-secondary/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      {getTierBadge(selectedUser.subscription_tier)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getSubStatusBadge(getEffectiveSubStatus(selectedUser))}
                    </div>
                    {(selectedUser.subscription_start_date ||
                      selectedUser.subscription_expires_at) && (
                      <>
                        {selectedUser.subscription_start_date && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Start Date
                            </span>
                            <span className="text-sm">
                              {format(
                                new Date(selectedUser.subscription_start_date),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            End Date
                          </span>
                          <span className="text-sm">
                            {format(
                              new Date(
                                selectedUser.subscription_end_date ||
                                  selectedUser.subscription_expires_at ||
                                  ""
                              ),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Days Left
                      </span>
                      <span className="text-sm font-medium">
                        {getDaysLeft(selectedUser) !== null
                          ? `${getDaysLeft(selectedUser)} days`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Auto Renew
                      </span>
                      <span className="text-sm">
                        {selectedUser.auto_renew ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Current Scores
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Reading</p>
                      <p className="text-lg font-light">
                        {selectedUser.current_reading_score ?? "—"}
                      </p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Listening</p>
                      <p className="text-lg font-light">
                        {selectedUser.current_listening_score ?? "—"}
                      </p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Writing</p>
                      <p className="text-lg font-light">
                        {selectedUser.current_writing_score ?? "—"}
                      </p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Speaking</p>
                      <p className="text-lg font-light">
                        {selectedUser.current_speaking_score ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment History
                  </h3>
                  {loadingDetails ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    </div>
                  ) : userPayments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 bg-secondary/30 rounded-lg">
                      No payment records
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userPayments.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="text-sm whitespace-nowrap">
                                {format(
                                  new Date(p.created_at),
                                  "MMM d, yyyy"
                                )}
                              </TableCell>
                              <TableCell className="text-sm">
                                {p.plan_type === "road_to_8"
                                  ? "Road to 8"
                                  : "Pro"}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                Rp {p.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {getPaymentStatusBadge(p.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Admin Action Log */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Action Log
                  </h3>
                  {loadingDetails ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    </div>
                  ) : userAdminLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 bg-secondary/30 rounded-lg">
                      No admin actions recorded
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {userAdminLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {log.action_type
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l: string) =>
                                  l.toUpperCase()
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(
                                new Date(log.created_at),
                                "MMM d, yyyy h:mm a"
                              )}
                            </p>
                            {log.details && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {JSON.stringify(log.details)}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              log.status === "success"
                                ? "bg-green-500/10 text-green-500 border-green-500/30"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                            }
                          >
                            {log.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Extend Subscription Dialog */}
        <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-accent" />
                Extend Subscription
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will add days to the user's current subscription end date.
                If they have no active subscription, it starts from today.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Days to add</label>
                <Input
                  type="number"
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  min="1"
                  max="365"
                  placeholder="30"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setExtendDialogOpen(false);
                  setExtendUserId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExtendSubscription}
                disabled={
                  !extendDays ||
                  parseInt(extendDays, 10) <= 0 ||
                  processingUserId === extendUserId
                }
              >
                {processingUserId === extendUserId ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CalendarPlus className="w-4 h-4 mr-2" />
                )}
                Extend by {extendDays} days
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
