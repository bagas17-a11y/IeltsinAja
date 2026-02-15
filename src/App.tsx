import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AIChatbot } from "@/components/AIChatbot";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ReadingModule from "./pages/dashboard/ReadingModule";
import ListeningModule from "./pages/dashboard/ListeningModule";
import WritingModule from "./pages/dashboard/WritingModule";
import SpeakingModule from "./pages/dashboard/SpeakingModule";
import ConsultationHub from "./pages/dashboard/ConsultationHub";
import StatsPage from "./pages/dashboard/StatsPage";
import DiagnosticQuiz from "./pages/dashboard/DiagnosticQuiz";
import PricingSelection from "./pages/PricingSelection";
import PaymentVerification from "./pages/admin/PaymentVerification";
import AdminVerify from "./pages/admin/AdminVerify";
import ContentManager from "./pages/admin/ContentManager";
import ListeningManager from "./pages/admin/ListeningManager";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Admin from "./pages/Admin";
import WaitingRoom from "./pages/WaitingRoom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/pricing-selection" element={<PricingSelection />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin/payments" element={<PaymentVerification />} />
            <Route path="/admin/verify" element={<AdminVerify />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/content-manager" element={<ContentManager />} />
            <Route path="/admin/listening" element={<ListeningManager />} />
            <Route path="/admin/listening-manager" element={<ListeningManager />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/subscriptions" element={<UserManagement />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/reading" element={<ReadingModule />} />
            <Route path="/dashboard/listening" element={<ListeningModule />} />
            <Route path="/dashboard/writing" element={<WritingModule />} />
            <Route path="/dashboard/speaking" element={<SpeakingModule />} />
            <Route path="/dashboard/stats" element={<StatsPage />} />
            <Route path="/dashboard/diagnostic" element={<DiagnosticQuiz />} />
            <Route path="/dashboard/consultation" element={<ConsultationHub />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
