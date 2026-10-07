import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Brain,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import {
  saveCompleteAssessment,
  saveWellnessReport,
} from "@/utils/historyStorage";

type Result = {
  questionnaire: number;
  questionnairePercentage: number;
  face: number;
  voice: number;
  overall: number;
  risk: string;
};

export default function CompleteAnalysis() {

  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] =
    useState<Result | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const questionnaire =
      localStorage.getItem(
        "questionnaire_score"
      );

    const face =
      localStorage.getItem(
        "face_score"
      );

    const voice =
      localStorage.getItem(
        "voice_score"
      );

    /*
      Complete Analysis intentionally
      requires all three components.
    */

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

    generateReport();

  }, [location.state, navigate]);

  const generateReport = () => {

    const questionnaire =
      Number(
        localStorage.getItem(
          "questionnaire_score"
        )
      );

    const face =
      Number(
        localStorage.getItem(
          "face_score"
        )
      );

    const voice =
      Number(
        localStorage.getItem(
          "voice_score"
        )
      );

    /*
      Questionnaire = 0–30
      Face = 0–100
      Voice = 0–100
    */

    const questionnairePercentage =
      (questionnaire / 30) * 100;

    /*
      Weightage
      Self = 60%
      Face = 20%
      Voice = 20%
    */

    const questionnaireWeighted =
      questionnairePercentage * 0.60;

    const faceWeighted =
      face * 0.20;

    const voiceWeighted =
      voice * 0.20;

    const overall =
      Number(
        (
          questionnaireWeighted +
          faceWeighted +
          voiceWeighted
        ).toFixed(2)
      );

    let risk = "";

    if (overall < 30) {

      risk = "Low Risk";

    } else if (overall < 60) {

      risk = "Moderate Risk";

    } else {

      risk = "High Risk";

    }

    /*
      SAVE COMPLETE HISTORY
    */

    saveCompleteAssessment({

      questionnaireScore:
        questionnaire,

      questionnairePercentage:
        Number(
          questionnairePercentage.toFixed(2)
        ),

      faceScore:
        face,

      voiceScore:
        voice,

      overallScore:
        overall,

      riskLevel:
        risk,

      faceEmotion:
        localStorage.getItem(
          "face_emotion"
        ) || "",

      faceObservation:
        localStorage.getItem(
          "face_observation"
        ) || "",

      voiceEmotion:
        localStorage.getItem(
          "voice_emotion"
        ) || "",

      voiceCue:
        localStorage.getItem(
          "wellbeing_cue"
        ) ||
        localStorage.getItem(
          "voice_cue"
        ) ||
        "",
    });

    /*
      SAVE TO UNIVERSAL PROGRESS HISTORY
    */

    saveWellnessReport({

      assessmentType:
        "Complete Analysis",

      questionnaireScore:
        questionnaire,

      questionnairePercentage:
        Number(
          questionnairePercentage.toFixed(2)
        ),

      faceScore:
        face,

      faceEmotion:
        localStorage.getItem(
          "face_emotion"
        ) || "",

      faceConfidence:
        Number(
          localStorage.getItem(
            "face_confidence"
          ) || 0
        ),

      faceObservation:
        localStorage.getItem(
          "face_observation"
        ) || "",

      voiceScore:
        voice,

      voiceEmotion:
        localStorage.getItem(
          "voice_emotion"
        ) || "",

      voiceConfidence:
        Number(
          localStorage.getItem(
            "voice_confidence"
          ) || 0
        ),

      voiceCue:
        localStorage.getItem(
          "wellbeing_cue"
        ) ||
        localStorage.getItem(
          "voice_cue"
        ) ||
        "",

      overallScore:
        overall,

      riskLevel:
        risk,
    });

    setResult({

      questionnaire,

      questionnairePercentage:
        Number(
          questionnairePercentage.toFixed(2)
        ),

      face,

      voice,

      overall,

      risk,
    });

    setLoading(false);

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

  if (!result) {
    return null;
  }

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
            Combined analysis using Self Assessment,
            Facial Emotion Analysis and Voice Analysis.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <Card
            title="Self Assessment"
            value={
              result.questionnairePercentage
            }
            subtitle={`${result.questionnaire}/30`}
          />

          <Card
            title="Face Analysis"
            value={result.face}
            subtitle="AI Score"
          />

          <Card
            title="Voice Analysis"
            value={result.voice}
            subtitle="AI Score"
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

        <div className="mt-8 rounded-2xl border bg-gray-50 p-6">

          <h2 className="text-xl font-bold mb-5">
            Analysis Weightage
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="text-center">

              <p className="text-gray-500">
                Self Assessment
              </p>

              <p className="text-2xl font-bold mt-2">
                60%
              </p>

            </div>

            <div className="text-center">

              <p className="text-gray-500">
                Face Analysis
              </p>

              <p className="text-2xl font-bold mt-2">
                20%
              </p>

            </div>

            <div className="text-center">

              <p className="text-gray-500">
                Voice Analysis
              </p>

              <p className="text-2xl font-bold mt-2">
                20%
              </p>

            </div>

          </div>

        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6 flex gap-4">

          <AlertTriangle
            className="text-yellow-600 flex-shrink-0"
          />

          <p>
            This AI-generated report provides
            supportive wellbeing indicators only
            and should not be considered a medical
            or psychological diagnosis.
          </p>

        </div>

        <div className="flex justify-center mt-8">

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:opacity-90"
          >
            Back To Home
          </button>

        </div>

      </div>

    </div>

  );
}

function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {

  return (

    <div className="rounded-2xl border bg-gray-50 p-6 text-center">

      <h3 className="font-bold text-lg">
        {title}
      </h3>

      <p className="text-4xl font-bold text-purple-700 mt-5">
        {value.toFixed(2)}
      </p>

      <p className="text-gray-500 mt-2">
        {subtitle}
      </p>

    </div>

  );
}