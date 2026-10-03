import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import SelfAssessment from "./pages/SelfAssessment";
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

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route path="/" element={<Welcome />} />

      <Route path="/auth" element={<Auth />} />

      {/* PROTECTED ROUTES */}

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Index />} />

        <Route path="/assessment" element={<SelfAssessment />} />

        <Route
          path="/assessment-history"
          element={<AssessmentHistory />}
        />

        <Route path="/chat" element={<AIChat />} />

        <Route path="/journal" element={<Journal />} />

        <Route
          path="/stress-relief"
          element={<StressRelief />}
        />

        <Route
          path="/stress-relief-videos"
          element={<StressReliefVideos />}
        />

        <Route
          path="/relaxing-music"
          element={<RelaxingMusic />}
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
      </Route>

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;