import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recommendations } from "@/data/recommendations";
import { AssessmentResult } from "@/types/assessment";

interface ResultCardProps {
  result: AssessmentResult;
}

const ResultCard = ({ result }: ResultCardProps) => {

  const supportRecommendations =
    recommendations[result.riskLevel];

  const riskColor = (() => {
    switch (result.riskLevel) {
      case "Minimal Risk":
        return "bg-green-100 text-green-700";

      case "Mild Risk":
        return "bg-yellow-100 text-yellow-700";

      case "Moderate Risk":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-red-100 text-red-700";
    }
  })();

  return (

    <div className="max-w-4xl mx-auto bg-card rounded-3xl shadow-lg p-10">

      {/* Header */}

      <div className="text-center">

        <CheckCircle
          className="mx-auto w-16 h-16 text-green-600 mb-5"
        />

        <h1 className="text-3xl font-bold">

          🧠 Mental Wellness Screening Report

        </h1>

        <p className="text-muted-foreground mt-2">

          Thank you for completing the assessment.

        </p>

      </div>

      {/* Overall Risk */}

      <div className="mt-10 text-center">

        <h2 className="text-lg font-semibold">

          Overall Screening Result

        </h2>

        <div
          className={`inline-block mt-4 px-8 py-3 rounded-full font-bold text-lg ${riskColor}`}
        >

          {result.riskLevel}

        </div>

      </div>

      {/* Score */}

      <div className="mt-8 bg-muted rounded-2xl p-6">

        <p className="text-lg">

          <strong>Screening Score:</strong>

          {" "}

          {result.totalScore}/30

        </p>

        <div className="mt-5">

          <h3 className="font-semibold">

            Assessment Summary

          </h3>

          <p className="mt-2 text-muted-foreground">

            {result.summary}

          </p>

        </div>

      </div>

      {/* Symptom Severity */}

      <div className="mt-10">

        <h2 className="text-xl font-bold mb-6">

          Symptom Severity

        </h2>

        <p className="mb-2">

          Depression Symptoms

        </p>

        <div className="h-3 bg-gray-200 rounded-full">

          <div
            className="h-3 bg-red-500 rounded-full"
            style={{
              width: `${(result.depressionScore / 18) * 100}%`
            }}
          />

        </div>

        <p className="mt-6 mb-2">

          Anxiety Symptoms

        </p>

        <div className="h-3 bg-gray-200 rounded-full">

          <div
            className="h-3 bg-blue-500 rounded-full"
            style={{
              width: `${(result.anxietyScore / 12) * 100}%`
            }}
          />

        </div>

      </div>

      {/* Pattern */}

      <div className="mt-10">

        <h2 className="text-xl font-bold">

          Primary Emotional Pattern

        </h2>

        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-5">

          {result.pattern}

        </div>

      </div>

      {/* High Risk */}

      {result.riskLevel === "High Risk" && (

        <div className="mt-8 p-5 rounded-xl bg-red-50 border border-red-300">

          <h3 className="font-bold text-red-700">

            Professional Support Recommended

          </h3>

          <p className="mt-3 text-red-700">

            Your responses suggest a higher level of emotional distress.
            This assessment is not a diagnosis.
            Please consider speaking with a qualified mental health
            professional or someone you trust.

          </p>

        </div>

      )}

      {/* Recommendations */}

      <div className="mt-10">

        <h2 className="font-bold text-xl mb-5">

          Recommended Support

        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {supportRecommendations.map((item) => (

            <button
              key={item.title}
              onClick={() => window.location.href = item.link}
              className={`p-5 rounded-2xl border text-left hover:shadow transition ${
                item.title === "Professional Counselling"
                  ? "border-red-400 bg-red-50"
                  : ""
              }`}
            >

              <div className="text-4xl mb-3">

                {item.icon}

              </div>

              <h3 className="font-bold">

                {item.title}

              </h3>

              <p className="mt-2 text-sm text-muted-foreground">

                {item.description}

              </p>

            </button>

          ))}

        </div>

      </div>

      {/* Disclaimer */}

      <div className="mt-10 p-5 bg-muted rounded-xl text-sm">

        ⚠️ This assessment is intended for screening purposes only.
        It is not a medical diagnosis.

      </div>

      <div className="flex justify-center mt-10">

        <Button
          onClick={() => window.location.href = "/"}
        >

          Back To Home

        </Button>

      </div>

    </div>

  );

};

export default ResultCard;