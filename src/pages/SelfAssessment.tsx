import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
  "How often have you felt down, depressed, or hopeless?",
  "How often have you had trouble falling or staying asleep, or sleeping too much?",
  "How often have you felt tired or had little energy?",
  "How often have you had poor appetite or been overeating?",
  "How often have you felt bad about yourself — or that you are a failure?",
  "How often have you had trouble concentrating on academic work?",
  "How often have you felt nervous, anxious, or on edge?",
  "How often have you been unable to stop or control worrying?",
  "How often have you felt overwhelmed by academic pressure or expectations?",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const getResult = (score: number) => {
  if (score <= 10) {
    return {
      level: "Low Emotional Distress",
      color: "text-green-600 bg-green-100",
      message:
        "Your responses indicate low emotional distress. Continue maintaining a healthy routine and regular self-care.",
      suggestions: [
        "Maintain a proper sleep schedule",
        "Continue journaling or mood tracking",
        "Practice short breathing exercises",
        "Stay connected with friends, mentors, or family",
      ],
    };
  }

  if (score <= 20) {
    return {
      level: "Moderate Emotional Distress",
      color: "text-yellow-700 bg-yellow-100",
      message:
        "Your responses indicate moderate emotional distress. You may benefit from stress management, journaling, and regular monitoring.",
      suggestions: [
        "Practice breathing or meditation daily",
        "Use journaling to express thoughts clearly",
        "Break study tasks into smaller goals",
        "Use stress-relief activities regularly",
        "Consider talking to a mentor or counselor if symptoms continue",
      ],
    };
  }

  return {
    level: "High Emotional Distress",
    color: "text-red-600 bg-red-100",
    message:
      "Your responses indicate high emotional distress. It is recommended to seek support from a counselor, trusted person, or mental health professional.",
    suggestions: [
      "Speak with a counselor or trusted person",
      "Avoid handling everything alone",
      "Use grounding and breathing exercises",
      "Take breaks from academic pressure where possible",
      "Seek professional counseling support",
    ],
  };
};

const SelfAssessment = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const questionnaireScore = answers.reduce((a, b) => a + Math.max(b, 0), 0);

  const analysisType = localStorage.getItem("analysis_type");

  const faceScore = Number(localStorage.getItem("face_score") || 0);
  const faceEmotion = localStorage.getItem("face_emotion");

  const voiceScore = Number(localStorage.getItem("voice_score") || 0);
  const voiceEmotion = localStorage.getItem("voice_emotion");
  const voiceCue = localStorage.getItem("voice_cue");

  let finalScore = questionnaireScore;
  let combinedMode = false;

  if (analysisType === "face") {
    finalScore = Math.round(0.75 * questionnaireScore + 0.25 * (faceScore * 7.5));
    combinedMode = true;
  }

  if (analysisType === "voice") {
    finalScore = Math.round(0.75 * questionnaireScore + 0.25 * (voiceScore * 7.5));
    combinedMode = true;
  }

  const result = getResult(finalScore);

  const clearCombinedData = () => {
    localStorage.removeItem("analysis_type");
    localStorage.removeItem("face_score");
    localStorage.removeItem("face_emotion");
    localStorage.removeItem("voice_score");
    localStorage.removeItem("voice_emotion");
    localStorage.removeItem("voice_cue");
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full p-12 bg-card rounded-[32px] shadow text-center"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />

          <h2 className="text-3xl font-bold mb-4">
            {combinedMode ? "Combined Wellbeing Result" : "Your Results"}
          </h2>

          <div
            className={`inline-block px-6 py-2 rounded-full font-semibold text-lg mb-6 ${result.color}`}
          >
            {result.level}
          </div>

          <div className="text-left bg-muted/60 rounded-2xl p-5 mb-6 space-y-2">
            <p>
              <strong>Self Assessment Score:</strong> {questionnaireScore}/30
            </p>

            {analysisType === "face" && (
              <>
                <p>
                  <strong>Detected Face Emotion:</strong> {faceEmotion}
                </p>
                <p>
                  <strong>Face Cue Score:</strong> {faceScore}/4
                </p>
              </>
            )}

            {analysisType === "voice" && (
              <>
                <p>
                  <strong>Detected Voice Emotion:</strong> {voiceEmotion}
                </p>
                <p>
                  <strong>Voice Wellbeing Cue:</strong> {voiceCue}
                </p>
                <p>
                  <strong>Voice Cue Score:</strong> {voiceScore}/4
                </p>
              </>
            )}

            <p>
              <strong>Final Combined Score:</strong> {finalScore}/30
            </p>
          </div>

          <p className="text-muted-foreground text-lg mb-6">
            {result.message}
          </p>

          <div className="text-left mb-8">
            <p className="text-sm font-medium mb-3 text-muted-foreground">
              Recommended Actions:
            </p>

            <ul className="list-disc list-inside space-y-2">
              {result.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground bg-muted/60 rounded-xl px-4 py-3 mb-6 leading-relaxed">
            This system does not diagnose depression. Face and voice outputs are
            used only as supporting emotional cues. The self-assessment score is
            given higher importance for safer interpretation.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="soft"
              onClick={() => alert("Try deep breathing for 5 minutes")}
            >
              Breathing Exercise
            </Button>

            <Button
              variant="soft"
              onClick={() => alert("Write your thoughts in a journal")}
            >
              Journaling
            </Button>

            <Button
              variant="soft"
              onClick={() => alert("Consult a counselor")}
            >
              Counselling
            </Button>

            <Button
              variant="soft"
              onClick={() => {
                clearCombinedData();
                window.location.href = "/";
              }}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Self Assessment
          </h1>

          {analysisType === "face" && (
            <p className="text-muted-foreground">
              Face analysis is completed. Now answer this self-assessment to
              generate your combined wellbeing result.
            </p>
          )}

          {analysisType === "voice" && (
            <p className="text-muted-foreground">
              Voice analysis is completed. Now answer this self-assessment to
              generate your combined wellbeing result.
            </p>
          )}

          {!analysisType && (
            <p className="text-muted-foreground">
              Answer honestly — there are no wrong answers.
            </p>
          )}
        </motion.div>

        {combinedMode && (
          <div className="mb-6 rounded-2xl bg-primary/10 p-4 text-sm">
            {analysisType === "face" && (
              <p>
                Face cue detected: <strong>{faceEmotion}</strong>. This will be
                combined with your self-assessment.
              </p>
            )}

            {analysisType === "voice" && (
              <p>
                Voice cue detected: <strong>{voiceCue}</strong>. This will be
                combined with your self-assessment.
              </p>
            )}
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {current + 1} of {questions.length}
            </span>
            <span>
              {Math.round(((current + 1) / questions.length) * 100)}%
            </span>
          </div>

          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 bg-card rounded-[32px]"
          >
            <p className="text-lg font-medium mb-6">{questions[current]}</p>

            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full text-left px-5 py-3 mb-2 rounded-xl border ${
                  answers[current] === opt.value
                    ? "bg-primary/10 border-primary"
                    : "border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
          >
            <ArrowLeft /> Back
          </Button>

          {current < questions.length - 1 ? (
            <Button
              onClick={() => setCurrent(current + 1)}
              disabled={answers[current] === -1}
            >
              Next <ArrowRight />
            </Button>
          ) : (
            <Button
              onClick={() => setSubmitted(true)}
              disabled={answers.some((a) => a === -1)}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfAssessment;