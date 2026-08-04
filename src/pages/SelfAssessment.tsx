import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Brain,
  RotateCcw,
  Home
} from "lucide-react";

import { Button } from "@/components/ui/button";

import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";

import { questions, options } from "@/data/questions";

import { calculateAssessment } from "@/utils/assessmentCalculator";

import {
  saveAssessment
} from "@/utils/historyStorage";

import { recommendations } from "@/data/recommendations";

const SelfAssessment = () => {
const navigate = useNavigate();
const location = useLocation();
  const [start, setStart] = useState(() => {
  return localStorage.getItem("assessmentSubmitted") === "true";
});

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1)
  );

  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
  const savedSubmitted = localStorage.getItem("assessmentSubmitted");

  if (
    location.state?.fromAssessment ||
    savedSubmitted === "true"
  ) {
    setSubmitted(true);
    setStart(true);
  }
}, [location]);

  const selectAnswer = (value: number) => {

    const updated = [...answers];

    updated[current] = value;

    setAnswers(updated);

  };

  const savedResult = localStorage.getItem("assessmentResult");

const result =
  submitted && savedResult
    ? JSON.parse(savedResult)
    : calculateAssessment(answers);

  const supportRecommendations =
    recommendations[result.riskLevel];

  const progress =
    ((current + 1) / questions.length) * 100;

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

  const restartAssessment = () => {

    setAnswers(
      Array(questions.length).fill(-1)
    );

    setCurrent(0);
localStorage.removeItem("assessmentSubmitted");
localStorage.removeItem("assessmentResult");
    setSubmitted(false);

    setStart(false);

  };

  // =====================================
  // RESULT PAGE
  // =====================================

  if (submitted) {
const previousHistory = JSON.parse(
 localStorage.getItem(
 "mental-health-assessment-history"
 ) || "[]"
);


const elevatedCount = previousHistory.filter(
(item:any)=>
 item.riskLevel === "High Risk" ||
 item.riskLevel === "Moderate Risk"
).length;
    return (
      <div className="container mx-auto px-5 py-12 flex justify-center">

  <div className="max-w-5xl w-full bg-card rounded-3xl shadow-lg p-10">

    {/* Header */}

    <div className="text-center">

      <CheckCircle
        className="mx-auto text-green-600 mb-5"
        size={70}
      />

      <h1 className="text-4xl font-bold">

        Mental Wellness Screening Report

      </h1>

      <p className="mt-3 text-muted-foreground">

        Thank you for completing the assessment.

      </p>

    </div>

    {/* Overall Risk */}

    <div className="mt-10 text-center">

      <h2 className="text-xl font-semibold">

        Overall Screening Result

      </h2>

      <div
        className={`inline-block mt-5 px-8 py-3 rounded-full text-lg font-bold ${riskColor}`}
      >

        {result.riskLevel}

      </div>

    </div>

    {/* Summary */}

    <div className="mt-10 rounded-2xl bg-muted p-6">

      <h3 className="font-bold text-lg">

        Assessment Summary

      </h3>

      <p className="mt-4 leading-7 text-muted-foreground">

        {result.summary}

      </p>

      <div className="mt-6 flex justify-between">

        <span className="font-medium">

          Overall Score

        </span>

        <span className="font-bold">

          {result.totalScore}/30

        </span>

      </div>

    </div>

    {/* Emotional Indicators */}

    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-6">

        Emotional Wellbeing Indicators

      </h2>

      <ProgressBar

        label="Low Mood Indicators"

        value={result.depressionScore}

        max={18}

        color="bg-red-500"

      />

      <div className="mt-6">

        <ProgressBar

          label="Stress & Anxiety Indicators"

          value={result.anxietyScore}

          max={12}

          color="bg-blue-500"

        />

      </div>

    </div>

    {/* Pattern */}

    <div className="mt-10">

      <h2 className="text-xl font-bold">

        Primary Emotional Pattern

      </h2>

      <div className="mt-4 rounded-xl border bg-blue-50 border-blue-200 p-5">

        <p>

          {result.pattern}

        </p>

      </div>

    </div>
        {/* High Risk Alert */}

{(result.riskLevel === "High Risk" ||
 result.riskLevel === "Moderate Risk") && (

  <div className="mt-10 rounded-2xl border border-red-300 bg-red-50 p-6">

    <h2 className="text-xl font-bold text-red-700">
      Professional Support Recommended
    </h2>

    <p className="mt-4 leading-7 text-red-700">
      Your responses suggest a higher level of emotional distress.
      This assessment is a screening tool only and is not a diagnosis.
    </p>

  </div>

)}


{/* Repeated Elevated Scores */}

{elevatedCount >= 3 && (

<div className="mt-10 rounded-2xl border border-red-300 bg-red-50 p-6">

<h2 className="text-xl font-bold text-red-700">

Repeated Elevated Scores

</h2>


<p className="mt-4 text-red-700 leading-7">

Your assessment scores have remained elevated over multiple assessments.
We recommend scheduling a consultation with a qualified mental health professional.

</p>

</div>

)}

    {/* Recommendations */}

    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-6">

        Recommended Support

      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {supportRecommendations.map((item) => (

    <button
  key={item.title}
  onClick={() =>
    navigate(item.link, {
      state: {
        fromAssessment: true,
      },
    })
  }
  className={`
    p-5
    rounded-2xl
    border
    text-left
    transition-all
    duration-300
    hover:shadow-lg
    hover:-translate-y-1
    ${
      item.title === "Professional Counselling"
        ? "border-red-400 bg-red-50"
        : ""
    }
  `}
>

            <div className="text-4xl">

              {item.icon}

            </div>

            <h3 className="font-bold text-lg mt-4">

              {item.title}

            </h3>

            <p className="mt-3 text-muted-foreground leading-6">

              {item.description}

            </p>

          </button>

        ))}

      </div>

    </div>

    {/* Motivation */}

    <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6">

      <h3 className="font-bold text-blue-700">

        Remember

      </h3>

      <p className="mt-4 leading-7 text-blue-700">

        Mental wellbeing changes over time.

        Taking small steps like maintaining healthy routines,
        talking to trusted people, practicing relaxation,
        and monitoring your emotions can positively
        impact your wellbeing.

      </p>

    </div>

    {/* Disclaimer */}

    <div className="mt-10 rounded-xl bg-muted p-5 text-sm leading-7">

      <strong>Disclaimer</strong>

      <br /><br />

      This assessment is intended for educational and screening
      purposes only.

      It does not diagnose depression, anxiety or any other
      mental health condition.

      If your emotional distress becomes severe or persists,
      please consult a qualified mental health professional.

    </div>

    {/* Buttons */}

    <div className="flex justify-center gap-4 mt-10">

      <Button
        variant="outline"
        onClick={restartAssessment}
      >

        <RotateCcw className="mr-2 h-4 w-4" />

        Retake Assessment

      </Button>

      <Button
  onClick={() => navigate("/")}
>
  <Home className="mr-2 h-4 w-4" />
  Back To Home
</Button>

    </div>

  </div>

</div>

  );

}
// =====================================
// INTRODUCTION PAGE
// =====================================

if (!start) {

  return (

    <div className="container mx-auto py-20 flex justify-center">

      <div className="max-w-3xl w-full bg-card rounded-3xl shadow-lg p-12 text-center">

        <Brain
          className="mx-auto text-primary mb-6"
          size={70}
        />

        <h1 className="text-4xl font-bold">

          Student Mental Health Assessment

        </h1>

        <p className="mt-6 text-muted-foreground leading-8">

          This mental wellness screening is designed for college
          students and is inspired by validated mental health
          screening questionnaires.

          It helps identify possible emotional wellbeing concerns
          related to stress, low mood, anxiety and academic pressure.

        </p>

        

        <Button

          size="lg"

          className="mt-10"

          onClick={() => setStart(true)}

        >

          Start Assessment

        </Button>

      </div>

    </div>

  );

}
// =====================================
// QUESTION SCREEN
// =====================================

return (

  <div className="container mx-auto py-16 flex justify-center">

    <div className="max-w-2xl w-full">

      {/* Progress */}

      <div className="flex justify-between items-center mb-3">

        <span className="font-medium">

          Question {current + 1} of {questions.length}

        </span>

        <span className="font-semibold text-primary">

          {Math.round(progress)}%

        </span>

      </div>

      <ProgressBar

        value={current + 1}

        max={questions.length}

        color="bg-primary"

        showScore={false}

      />

      {/* Question Card */}

      <div className="mt-8">

        <QuestionCard

          question={questions[current].text}

          options={options}

          selectedAnswer={answers[current]}

          onSelect={selectAnswer}

        />

      </div>

      {/* Navigation Buttons */}

      <div className="flex justify-between mt-8">

        <Button

          variant="outline"

          disabled={current === 0}

          onClick={() => setCurrent(current - 1)}

        >

          <ArrowLeft className="mr-2 h-4 w-4" />

          Back

        </Button>

        {current < questions.length - 1 ? (

          <Button

            disabled={answers[current] === -1}

            onClick={() => setCurrent(current + 1)}

          >

            Next

            <ArrowRight className="ml-2 h-4 w-4" />

          </Button>

        ) : (

          <Button
  disabled={answers.includes(-1)}
  onClick={() => {
    const finalResult = calculateAssessment(answers);

    saveAssessment(finalResult);

    localStorage.setItem(
      "assessmentResult",
      JSON.stringify(finalResult)
    );

    localStorage.setItem(
      "assessmentSubmitted",
      "true"
    );

    localStorage.setItem(
      "questionnaire_score",
      String(finalResult.totalScore)
    );

    localStorage.setItem(
      "questionnaire_risk",
      finalResult.riskLevel
    );

    setStart(true);
    setSubmitted(true);
  }}
>
  Submit Assessment
</Button>

        )}

      </div>

      {/* Progress Text */}

      <div className="mt-8 text-center text-sm text-muted-foreground">

        {answers.filter((answer) => answer !== -1).length} of{" "}
        {questions.length} questions completed

      </div>

    </div>

  </div>

);
};

export default SelfAssessment;