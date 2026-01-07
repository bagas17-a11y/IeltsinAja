import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ReadingModule from "./pages/dashboard/ReadingModule";
import ListeningModule from "./pages/dashboard/ListeningModule";
import WritingModule from "./pages/dashboard/WritingModule";
import SpeakingModule from "./pages/dashboard/SpeakingModule";
import ConsultationHub from "./pages/dashboard/ConsultationHub";
import StatsPage from "./pages/dashboard/StatsPage";
import PricingSelection from "./pages/PricingSelection";
import PaymentVerification from "./pages/admin/PaymentVerification";
import AdminVerify from "./pages/admin/AdminVerify";
import ContentManager from "./pages/admin/ContentManager";
import ListeningManager from "./pages/admin/ListeningManager";
import Admin from "./pages/Admin";
import WaitingRoom from "./pages/WaitingRoom";
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
            <Route path="/pricing-selection" element={<PricingSelection />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/admin/payments" element={<PaymentVerification />} />
            <Route path="/admin/verify" element={<AdminVerify />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/listening" element={<ListeningManager />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/reading" element={<ReadingModule />} />
            <Route path="/dashboard/listening" element={<ListeningModule />} />
            <Route path="/dashboard/writing" element={<WritingModule />} />
            <Route path="/dashboard/speaking" element={<SpeakingModule />} />
            <Route path="/dashboard/stats" element={<StatsPage />} />
            <Route path="/dashboard/consultation" element={<ConsultationHub />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
