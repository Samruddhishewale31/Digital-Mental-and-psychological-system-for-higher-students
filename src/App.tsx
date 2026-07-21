import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import SelfAssessment from "./pages/SelfAssessment";
import AIChat from "./pages/AIChat";
import Journal from "./pages/Journal";
import StressRelief from "./pages/StressRelief";
import CounsellingBooking from "./pages/CounsellingBooking";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FaceAnalysis from "./pages/FaceAnalysis";
import VoiceAnalysis from "./pages/VoiceAnalysis";
import FaceCombinedAnalysis from "./pages/FaceCombinedAnalysis";
import VoiceCombinedAnalysis from "./pages/VoiceCombinedAnalysis";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assessment" element={<SelfAssessment />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/stress-relief" element={<StressRelief />} />
          {<Route path="/counselling" element={<CounsellingBooking />} /> }
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/face-analysis" element={<FaceAnalysis />} />
          <Route path="/voice-analysis" element={<VoiceAnalysis />} />
          <Route path="/face-combined" element={<FaceCombinedAnalysis />} />
          <Route path="/voice-combined" element={<VoiceCombinedAnalysis />} />
          
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
