interface AcademicTipsProps {
  riskLevel:
    | "Minimal Risk"
    | "Mild Risk"
    | "Moderate Risk"
    | "High Risk";
}

const AcademicTips = ({ riskLevel }: AcademicTipsProps) => {

  const tips = {

    "Minimal Risk": [
      "Maintain a regular sleep schedule (7–9 hours).",
      "Take short study breaks using the Pomodoro Technique (25–30 minutes).",
      "Stay physically active through regular exercise or walking.",
      "Continue participating in hobbies and social activities.",
      "Track your mood weekly to maintain emotional wellbeing."
    ],

    "Mild Risk": [
      "Break large assignments into smaller, manageable tasks.",
      "Practice 5–10 minutes of deep breathing or mindfulness daily.",
      "Avoid studying continuously for long hours without breaks.",
      "Maintain a healthy diet and consistent sleep routine.",
      "Share your concerns with a trusted friend or family member."
    ],

    "Moderate Risk": [
      "Create a realistic daily study schedule with achievable goals.",
      "Use relaxation techniques before exams or presentations.",
      "Avoid procrastination by prioritizing important tasks first.",
      "Use the journal and mood tracker regularly to monitor your wellbeing.",
      "Consider speaking with a college counsellor if stress persists."
    ],

    "High Risk": [
      "Reach out to a qualified mental health professional or college counsellor.",
      "Talk to someone you trust instead of dealing with stress alone.",
      "Reduce unnecessary academic pressure by prioritizing essential tasks.",
      "Continue using breathing exercises, journaling, and mood tracking.",
      "Seek immediate professional support if emotional distress becomes overwhelming."
    ]

  };

  return (

    <div className="mt-10 rounded-3xl border bg-card shadow p-6">

      <h2 className="text-2xl font-bold mb-2">

        📚 Academic & Wellbeing Tips

      </h2>

      <p className="text-muted-foreground mb-6">

        Based on your screening result, these suggestions may help improve
        your academic performance and overall emotional wellbeing.

      </p>

      <ul className="space-y-4">

        {tips[riskLevel].map((tip, index) => (

          <li
            key={index}
            className="flex items-start gap-3"
          >

            <span className="text-green-600 font-bold">
              ✓
            </span>

            <span>
              {tip}
            </span>

          </li>

        ))}

      </ul>

    </div>

  );

};

export default AcademicTips;