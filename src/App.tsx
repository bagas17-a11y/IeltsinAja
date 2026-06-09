import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { GenerationProvider } from "@/hooks/useGenerationContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ReadingModule from "./pages/dashboard/ReadingModule";
import ListeningModule from "./pages/dashboard/ListeningModule";
import WritingModule from "./pages/dashboard/WritingModule";
import SpeakingModule from "./pages/dashboard/SpeakingModule";
import ConsultationHub from "./pages/dashboard/ConsultationHub";
import MaterialsPage from "./pages/dashboard/MaterialsPage";
import EliteHubPage from "./pages/dashboard/EliteHubPage";
import RevisionNotesPage from "./pages/dashboard/RevisionNotesPage";
import FlashcardsPage from "./pages/dashboard/FlashcardsPage";
import FlashcardsTopicPage from "./pages/dashboard/FlashcardsTopicPage";
import StatsPage from "./pages/dashboard/StatsPage";
import DiagnosticQuiz from "./pages/dashboard/DiagnosticQuiz";
import StudyPlanPage from "./pages/dashboard/StudyPlanPage";
import PricingSelection from "./pages/PricingSelection";
import PaymentVerification from "./pages/admin/PaymentVerification";
import ContentManager from "./pages/admin/ContentManager";
import ListeningManager from "./pages/admin/ListeningManager";
import SpeakingManager from "./pages/admin/SpeakingManager";
import ReadingManager from "./pages/admin/ReadingManager";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import WaitingRoom from "./pages/WaitingRoom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DiagnosticTest from "./pages/DiagnosticTest";
import SettingsPage from "./pages/dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <GenerationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/pricing-selection" element={<PricingSelection />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin/payments" element={<PaymentVerification />} />
            <Route path="/admin/verify" element={<PaymentVerification />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/content-manager" element={<ContentManager />} />
            <Route path="/admin/listening" element={<ListeningManager />} />
            <Route path="/admin/listening-manager" element={<ListeningManager />} />
            <Route path="/admin/speaking" element={<SpeakingManager />} />
            <Route path="/admin/reading" element={<ReadingManager />} />
            <Route path="/admin/users" element={<UserManagement />} />
            {/* /admin/subscriptions is an alias for /admin/users (kept for old links) */}
            <Route path="/admin/subscriptions" element={<UserManagement />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/diagnostic-test" element={<DiagnosticTest />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/reading" element={<ReadingModule />} />
            <Route path="/dashboard/listening" element={<ListeningModule />} />
            <Route path="/dashboard/writing" element={<WritingModule />} />
            <Route path="/dashboard/speaking" element={<SpeakingModule />} />
            <Route path="/dashboard/stats" element={<StatsPage />} />
            <Route path="/dashboard/diagnostic" element={<DiagnosticQuiz />} />
            <Route path="/dashboard/study-plan" element={<StudyPlanPage />} />
            <Route path="/dashboard/consultation" element={<ConsultationHub />} />
            <Route path="/dashboard/materials" element={<MaterialsPage />} />
            <Route path="/dashboard/elite" element={<EliteHubPage />} />
            <Route path="/dashboard/revision-notes" element={<RevisionNotesPage />} />
            <Route path="/dashboard/flashcards" element={<FlashcardsPage />} />
            <Route path="/dashboard/flashcards/topic" element={<FlashcardsTopicPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </GenerationProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
