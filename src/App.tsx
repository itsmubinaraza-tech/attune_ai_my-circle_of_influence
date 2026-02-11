import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { InstallPrompt, OfflineIndicator, UpdatePrompt } from "@/components/attune/InstallPrompt";
import Index from "./pages/Index";
import Circle from "./pages/Circle";
import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CrisisResources from "./pages/legal/CrisisResources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OfflineIndicator />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/legal/terms" element={<TermsOfService />} />
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            <Route path="/legal/crisis" element={<CrisisResources />} />
            <Route
              path="/"
              element={<Index />}
            />
            <Route
              path="/circle"
              element={
                <ProtectedRoute>
                  <Circle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </OnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
      {/* PWA Install & Update Prompts */}
      <InstallPrompt delay={60000} />
      <UpdatePrompt />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
