import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

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

/* ---------- NEW COUNSELLING MODULE ---------- */

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

      <Navbar />

      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={<Index />}
        />

        {/* Assessment */}

        <Route
          path="/assessment"
          element={<SelfAssessment />}
        />

        {/* AI Chat */}

        <Route
          path="/chat"
          element={<AIChat />}
        />

        {/* Journal */}

        <Route
          path="/journal"
          element={<Journal />}
        />

        {/* Stress Relief */}

        <Route
          path="/stress-relief"
          element={<StressRelief />}
        />

        {/* Face Analysis */}

        <Route
          path="/face-analysis"
          element={<FaceAnalysis />}
        />

        {/* Voice Analysis */}

        <Route
          path="/voice-analysis"
          element={<VoiceAnalysis />}
        />

        {/* Face + Assessment */}

        <Route
          path="/face-combined"
          element={<FaceCombinedAnalysis />}
        />

        {/* Voice + Assessment */}

        <Route
          path="/voice-combined"
          element={<VoiceCombinedAnalysis />}
        />

        {/* Complete Analysis */}

        <Route
          path="/complete-analysis"
          element={<CompleteAnalysis />}
        />

        {/* Relaxing Music */}

        <Route
          path="/relaxing-music"
          element={<RelaxingMusic />}
        />

        {/* Mood Tracker */}

        <Route
          path="/mood-tracker"
          element={<MoodTracker />}
        />

        {/* ==========================
            NEW COUNSELLOR MODULE
        =========================== */}

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

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </TooltipProvider>

  </QueryClientProvider>
);

export default App;