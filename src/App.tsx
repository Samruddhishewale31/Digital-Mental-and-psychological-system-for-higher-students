import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Navbar from "./components/Navbar";

import Index from "./pages/Index";
import SelfAssessment from "./pages/SelfAssessment";
import AIChat from "./pages/AIChat";
import Journal from "./pages/Journal";
import StressRelief from "./pages/StressRelief";
import NotFound from "./pages/NotFound";

import FaceAnalysis from "./pages/FaceAnalysis";
import VoiceAnalysis from "./pages/VoiceAnalysis";
import FaceCombinedAnalysis from "./pages/FaceCombinedAnalysis";
import VoiceCombinedAnalysis from "./pages/VoiceCombinedAnalysis";

import RelaxingMusic from "./pages/RelaxingMusic";
import MoodTracker from "./pages/MoodTracker";
import CompleteAnalysis from "./pages/CompleteAnalysis";

import StressReliefVideos from "./pages/StressReliefVideos";
import AssessmentHistory from "./pages/AssessmentHistory";

import CounsellorList from "./pages/CounsellorList";
import CounsellorProfile from "./pages/CounsellorProfile";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

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

          <Route
            path="/assessment"
            element={<SelfAssessment />}
          />

          <Route
            path="/assessment-history"
            element={<AssessmentHistory />}
          />

          <Route
            path="/chat"
            element={<AIChat />}
          />

          <Route
            path="/journal"
            element={<Journal />}
          />

          <Route
            path="/stress-relief"
            element={<StressRelief />}
          />

          <Route
            path="/face-analysis"
            element={<FaceAnalysis />}
          />

          <Route
            path="/voice-analysis"
            element={<VoiceAnalysis />}
          />

          <Route
            path="/face-combined"
            element={<FaceCombinedAnalysis />}
          />

          <Route
            path="/voice-combined"
            element={<VoiceCombinedAnalysis />}
          />

          <Route
            path="/complete-analysis"
            element={<CompleteAnalysis />}
          />

          <Route
            path="/mood-tracker"
            element={<MoodTracker />}
          />

          <Route
            path="/relaxing-music"
            element={<RelaxingMusic />}
          />

          <Route
            path="/stress-relief-videos"
            element={<StressReliefVideos />}
          />

          {/* Counselling Module */}

          <Route
            path="/counselling"
            element={<CounsellorList />}
          />

          <Route
            path="/counsellor/:id"
            element={<CounsellorProfile />}
          />

          <Route
            path="/book/:id"
            element={<BookAppointment />}
          />

          <Route
            path="/my-appointments"
            element={<MyAppointments />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;