import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { GenerationProvider } from "@/hooks/useGenerationContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// ── Lazy-loaded routes ─────────────────────────────────────────────────────
// Each page is its own chunk — only downloaded when the user navigates to it.
const Index              = lazy(() => import("./pages/Index"));
const Auth               = lazy(() => import("./pages/Auth"));
const VerifyEmail        = lazy(() => import("./pages/VerifyEmail"));
const Dashboard          = lazy(() => import("./pages/Dashboard"));
const ReadingModule      = lazy(() => import("./pages/dashboard/ReadingModule"));
const ListeningModule    = lazy(() => import("./pages/dashboard/ListeningModule"));
const WritingModule      = lazy(() => import("./pages/dashboard/WritingModule"));
const SpeakingModule     = lazy(() => import("./pages/dashboard/SpeakingModule"));
const ConsultationHub    = lazy(() => import("./pages/dashboard/ConsultationHub"));
const MaterialsPage      = lazy(() => import("./pages/dashboard/MaterialsPage"));
const EliteHubPage       = lazy(() => import("./pages/dashboard/EliteHubPage"));
const RevisionNotesPage  = lazy(() => import("./pages/dashboard/RevisionNotesPage"));
const FlashcardsPage     = lazy(() => import("./pages/dashboard/FlashcardsPage"));
const FlashcardsTopicPage= lazy(() => import("./pages/dashboard/FlashcardsTopicPage"));
const StatsPage          = lazy(() => import("./pages/dashboard/StatsPage"));
const DiagnosticQuiz     = lazy(() => import("./pages/dashboard/DiagnosticQuiz"));
const StudyPlanPage      = lazy(() => import("./pages/dashboard/StudyPlanPage"));
const StudyGroupPage     = lazy(() => import("./pages/dashboard/StudyGroupPage"));
const SettingsPage       = lazy(() => import("./pages/dashboard/SettingsPage"));
const PricingSelection   = lazy(() => import("./pages/PricingSelection"));
const WaitingRoom        = lazy(() => import("./pages/WaitingRoom"));
const PrivacyPolicy      = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService     = lazy(() => import("./pages/TermsOfService"));
const DiagnosticTest     = lazy(() => import("./pages/DiagnosticTest"));
const NotFound           = lazy(() => import("./pages/NotFound"));
const AuthCallback       = lazy(() => import("./pages/AuthCallback"));
const ResetPassword      = lazy(() => import("./pages/ResetPassword"));
// Admin pages (rarely visited — biggest win from lazy-loading)
const PaymentVerification= lazy(() => import("./pages/admin/PaymentVerification"));
const ContentManager     = lazy(() => import("./pages/admin/ContentManager"));
const ListeningManager   = lazy(() => import("./pages/admin/ListeningManager"));
const SpeakingManager    = lazy(() => import("./pages/admin/SpeakingManager"));
const ReadingManager     = lazy(() => import("./pages/admin/ReadingManager"));
const AdminDashboard     = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement     = lazy(() => import("./pages/admin/UserManagement"));
const StudentProgress    = lazy(() => import("./pages/admin/StudentProgress"));
const AdminStudyPlans    = lazy(() => import("./pages/admin/AdminStudyPlans"));

// ── Full-screen spinner shown while a route chunk is downloading ───────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );
}

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
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
              <Route path="/admin/subscriptions" element={<UserManagement />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/diagnostic-test" element={<DiagnosticTest />} />
              <Route path="/admin/progress" element={<StudentProgress />} />
              <Route path="/admin/study-plans" element={<AdminStudyPlans />} />
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
              <Route path="/dashboard/group" element={<StudyGroupPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </GenerationProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
