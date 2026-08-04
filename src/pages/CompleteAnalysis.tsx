import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type Result = {
  questionnaire: number;
  face: number;
  voice: number;
  overall: number;
  risk: string;
};

export default function CompleteAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  console.log("===== SELF ASSESSMENT =====");
  console.log("location.state =", location.state);
  console.log(
    "assessmentSubmitted =",
    localStorage.getItem("assessmentSubmitted")
  );
  console.log(
    "questionnaire_score =",
    localStorage.getItem("questionnaire_score")
  );

  // ...your existing code...
}, [location]);
  useEffect(() => {

  const questionnaire = localStorage.getItem("questionnaire_score");
  const face = localStorage.getItem("face_score");
  const voice = localStorage.getItem("voice_score");

  // First visit from Home
  if (!location.state?.generateReport) {

    if (!questionnaire) {

      navigate("/assessment", {
        state: {
          fromComplete: true,
        },
      });

      return;
    }

    if (!face) {

      navigate("/face-analysis", {
        state: {
          fromComplete: true,
        },
      });

      return;
    }

    if (!voice) {

      navigate("/voice-analysis", {
        state: {
          fromComplete: true,
        },
      });

      return;
    }

  }

  generateReport();

}, [location.state, navigate]);

  const generateReport = async () => {
    const questionnaireValue = localStorage.getItem("questionnaire_score");
    const faceValue = localStorage.getItem("face_score");
    const voiceValue = localStorage.getItem("voice_score");

    

    const questionnaire = Number(questionnaireValue);
    const face = Number(faceValue);
    const voice = Number(voiceValue);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/final-risk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionnaire_score: questionnaire,
            face_score: face,
            voice_score: voice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend not running");
      }

      const data = await response.json();

      setResult({
        questionnaire,
        face,
        voice,
        overall: data.overall_score,
        risk: data.risk_level,
      });
    } catch (error) {
      console.error(error);

      alert(
        "Unable to generate the final report.\n\nPlease make sure the Flask backend is running."
      );

      alert(
  "Unable to generate the report.\nPlease make sure the backend is running."
);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Brain
          size={60}
          className="text-purple-600 animate-pulse"
        />

        <h2 className="ml-5 text-xl">
          Generating Complete Analysis...
        </h2>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#f8f6ff] px-6 py-12">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10">

        <div className="text-center">

          <CheckCircle
            size={70}
            className="mx-auto text-green-600"
          />

          <h1 className="text-4xl font-bold mt-5">
            Complete Wellness Analysis
          </h1>

          <p className="mt-3 text-gray-600">
            Combined AI analysis using Self Assessment,
            Facial Emotion Analysis and Voice Analysis.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <Card
            title="Self Assessment"
            value={result.questionnaire}
          />

          <Card
            title="Face Analysis"
            value={result.face}
          />

          <Card
            title="Voice Analysis"
            value={result.voice}
          />

        </div>

        <div className="mt-10 rounded-2xl bg-purple-50 p-8 text-center">

          <h2 className="text-xl font-bold">
            Overall Mental Wellness Level
          </h2>

          <p className="text-4xl font-bold text-purple-700 mt-5">
            {result.risk}
          </p>

          <p className="mt-4 text-lg">
            Overall Score:
            <b> {result.overall}%</b>
          </p>

        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6 flex gap-4">

          <AlertTriangle className="text-yellow-600" />

          <p>
            This AI-generated report provides supportive wellbeing indicators
            only and should not be considered a medical or psychological
            diagnosis. Please consult a qualified mental health professional if
            you have ongoing concerns.
          </p>

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-6 text-center">

      <h3 className="font-bold text-lg">
        {title}
      </h3>

      <p className="text-4xl font-bold text-purple-700 mt-5">
        {value}
      </p>

      <p className="text-gray-500 mt-2">
        AI Score
      </p>

    </div>
  );
}