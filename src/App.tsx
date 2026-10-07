import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import StudentNavbarGuard from "./components/StudentNavbarGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import SelfAssessment from "./pages/SelfAssessment";
import CreativeCorner from "./pages/CreativeCorner";
import AssessmentHistory from "./pages/AssessmentHistory";
import AIChat from "./pages/AIChat";
import Journal from "./pages/Journal";
import StressRelief from "./pages/StressRelief";
import StressReliefVideos from "./pages/StressReliefVideos";

import FaceAnalysis from "./pages/FaceAnalysis";
import VoiceAnalysis from "./pages/VoiceAnalysis";
import FaceCombinedAnalysis from "./pages/FaceCombinedAnalysis";
import VoiceCombinedAnalysis from "./pages/VoiceCombinedAnalysis";
import CompleteAnalysis from "./pages/CompleteAnalysis";

import MoodTracker from "./pages/MoodTracker";
import RelaxingMusic from "./pages/RelaxingMusic";

import CounsellorList from "./pages/CounsellorList";
import CounsellorProfile from "./pages/CounsellorProfile";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

import InformedConsent from "./pages/InformedConsent";
import WellnessCenter from "./pages/WellnessCenter";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAssessment from "./pages/AdminAssessment";
import AdminMentalHealth from "./pages/AdminMentalHealth";
import AdminTrends from "./pages/AdminTrends";
import AdminParticipation from "./pages/AdminParticipation";
import AdminAcademicCalendar from "./pages/AdminAcademicCalendar";
import AdminExamSchedule from "./pages/AdminExamSchedule";
import AdminCommonTestResults from "./pages/AdminCommonTestResults";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <>
      <StudentNavbarGuard />

      <Routes>
        {/* =========================
            PUBLIC STUDENT ROUTES
        ========================= */}
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />

        {/* =========================
            PROTECTED STUDENT ROUTES
        ========================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Index />} />

          {/* Assessment */}
          <Route path="/assessment" element={<SelfAssessment />} />
          <Route
            path="/assessment-history"
            element={<AssessmentHistory />}
          />

          {/* Wellness */}
          <Route
            path="/informed-consent"
            element={<InformedConsent />}
          />
          <Route path="/wellness" element={<WellnessCenter />} />

          {/* AI / Support */}
          <Route path="/chat" element={<AIChat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/stress-relief" element={<StressRelief />} />
          <Route
            path="/stress-relief-videos"
            element={<StressReliefVideos />}
          />
          <Route
            path="/creative-corner"
            element={<CreativeCorner />}
          />

          {/* Analysis */}
          <Route path="/face-analysis" element={<FaceAnalysis />} />
          <Route path="/voice-analysis" element={<VoiceAnalysis />} />
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

          {/* Mood / Relaxation */}
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/relaxing-music" element={<RelaxingMusic />} />

          {/* Counselling */}
          <Route path="/counselling" element={<CounsellorList />} />
          <Route
            path="/counsellor/:id"
            element={<CounsellorProfile />}
          />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route
            path="/my-appointments"
            element={<MyAppointments />}
          />
        </Route>

        {/* =========================
            ADMIN LOGIN
        ========================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* =========================
            PROTECTED ADMIN ROUTES
        ========================= */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/assessment"
          element={
            <AdminProtectedRoute>
              <AdminAssessment />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/mental-health"
          element={
            <AdminProtectedRoute>
              <AdminMentalHealth />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/trends"
          element={
            <AdminProtectedRoute>
              <AdminTrends />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/participation"
          element={
            <AdminProtectedRoute>
              <AdminParticipation />
            </AdminProtectedRoute>
          }
        />

        {/* Curriculum */}
        <Route
          path="/admin/curriculum/academic-calendar"
          element={
            <AdminProtectedRoute>
              <AdminAcademicCalendar />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/curriculum/exam-schedule"
          element={
            <AdminProtectedRoute>
              <AdminExamSchedule />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/curriculum/common-test-results"
          element={
            <AdminProtectedRoute>
              <AdminCommonTestResults />
            </AdminProtectedRoute>
          }
        />

        {/* =========================
            404
        ========================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;