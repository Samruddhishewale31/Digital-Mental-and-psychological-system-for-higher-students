import { AssessmentResult } from "@/types/assessment";

export function calculateAssessment(
  answers: number[]
): AssessmentResult {

  // Depression (Questions 1–6)
  const depressionScore = answers
    .slice(0, 6)
    .reduce((sum, value) => sum + Math.max(value, 0), 0);

  // Anxiety (Questions 7–10)
  const anxietyScore = answers
    .slice(6, 10)
    .reduce((sum, value) => sum + Math.max(value, 0), 0);

  const totalScore = depressionScore + anxietyScore;

  // -----------------------------
  // Overall Risk
  // -----------------------------

  let riskLevel:
    | "Minimal Risk"
    | "Mild Risk"
    | "Moderate Risk"
    | "High Risk";

  if (totalScore <= 7) {
    riskLevel = "Minimal Risk";
  } else if (totalScore <= 14) {
    riskLevel = "Mild Risk";
  } else if (totalScore <= 21) {
    riskLevel = "Moderate Risk";
  } else {
    riskLevel = "High Risk";
  }

  // -----------------------------
  // Assessment Summary
  // -----------------------------

  let summary = "";

  switch (riskLevel) {

    case "Minimal Risk":
      summary =
        "Your responses indicate a generally healthy level of emotional wellbeing. Continue maintaining healthy habits, staying connected with others, and checking in with your emotions regularly.";
      break;

    case "Mild Risk":
      summary =
        "Your responses suggest occasional emotional stress. Practising self-care activities such as relaxation, journaling, and maintaining a healthy routine may help improve your wellbeing.";
      break;

    case "Moderate Risk":
      summary =
        "Your responses indicate moderate emotional distress related to stress, anxiety, or low mood. Using the available wellbeing resources may be beneficial. If these feelings continue, consider speaking with a trusted person or counsellor.";
      break;

    case "High Risk":
      summary =
        "Your responses suggest a high level of emotional distress. This assessment is only a screening tool and not a diagnosis. We strongly encourage you to seek support from a qualified mental health professional or someone you trust.";
      break;
  }

  // -----------------------------
  // Emotional Pattern
  // -----------------------------

  let pattern = "";

  if (depressionScore >= anxietyScore + 3) {
    pattern = "Low Mood & Emotional Fatigue";
  }

  else if (anxietyScore >= depressionScore + 3) {
    pattern = "Anxiety & Academic Stress";
  }

  else {
    pattern = "Mixed Emotional Stress";
  }

  return {
    depressionScore,
    anxietyScore,
    totalScore,
    riskLevel,
    summary,
    pattern
  };

}