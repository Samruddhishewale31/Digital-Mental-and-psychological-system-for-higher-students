import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Navbar from "./components/Navbar";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InformedConsent from "./pages/InformedConsent";

import SelfAssessment from "./pages/SelfAssessment";
import AssessmentHistory from "./pages/AssessmentHistory";



import FaceAnalysis from "./pages/FaceAnalysis";
import VoiceAnalysis from "./pages/VoiceAnalysis";
import FaceCombinedAnalysis from "./pages/FaceCombinedAnalysis";
import VoiceCombinedAnalysis from "./pages/VoiceCombinedAnalysis";
import CompleteAnalysis from "./pages/CompleteAnalysis";

import AIChat from "./pages/AIChat";
import Journal from "./pages/Journal";

import StressRelief from "./pages/StressRelief";
import StressReliefVideos from "./pages/StressReliefVideos";

import MoodTracker from "./pages/MoodTracker";
import RelaxingMusic from "./pages/RelaxingMusic";

import CounsellorList from "./pages/CounsellorList";
import CounsellorProfile from "./pages/CounsellorProfile";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import WellnessCenter from "./pages/WellnessCenter";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      {/* Toast Notifications */}
      <Toaster />
      <Sonner />

      {/* Navigation Bar */}
      <Navbar />

      <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<Index />}
        />


        {/* =====================================================
            SELF ASSESSMENT
        ===================================================== */}

        <Route
          path="/assessment"
          element={<SelfAssessment />}
        />

        <Route
          path="/assessment-history"
          element={<AssessmentHistory />}
        />


        {/* =====================================================
            WELLNESS REPORT
        ===================================================== */}

        


        {/* =====================================================
            PROGRESS DASHBOARD
        ===================================================== */}

        


        {/* =====================================================
            AI CHAT
        ===================================================== */}

        <Route
          path="/chat"
          element={<AIChat />}
        />


        {/* =====================================================
            JOURNAL
        ===================================================== */}

        <Route
          path="/journal"
          element={<Journal />}
        />


        {/* =====================================================
            STRESS RELIEF
        ===================================================== */}

        <Route
          path="/stress-relief"
          element={<StressRelief />}
        />

        <Route
          path="/stress-relief-videos"
          element={<StressReliefVideos />}
        />


        {/* =====================================================
            FACE ANALYSIS
        ===================================================== */}

        <Route
          path="/face-analysis"
          element={<FaceAnalysis />}
        />


        {/* =====================================================
            VOICE ANALYSIS
        ===================================================== */}

        <Route
          path="/voice-analysis"
          element={<VoiceAnalysis />}
        />


        {/* =====================================================
            COMBINED ANALYSIS
        ===================================================== */}

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


        {/* =====================================================
            MOOD & MUSIC
        ===================================================== */}

        <Route
          path="/mood-tracker"
          element={<MoodTracker />}
        />

        <Route
          path="/relaxing-music"
          element={<RelaxingMusic />}
        />


        {/* =====================================================
            COUNSELLING
        ===================================================== */}

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


        {/* =====================================================
            INFORMED CONSENT
        ===================================================== */}

        <Route
          path="/informed-consent"
          element={<InformedConsent />}
        />

     <Route path="/wellness" element={<WellnessCenter />} />
        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </TooltipProvider>

  </QueryClientProvider>
);


export default App;