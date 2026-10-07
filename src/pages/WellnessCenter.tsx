import MentalWellnessReport from "@/components/MentalWellnessReport";
import AssessmentHistory from "@/components/AssessmentHistory";
import ProgressDashboard from "@/components/ProgressDashboard";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  ClipboardList,
  BarChart3,
} from "lucide-react";

const WellnessCenter = () => {
  const [activeSection, setActiveSection] = useState("report");

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            My Wellness
          </h1>

          <p className="mt-2 text-muted-foreground">
            Your personal emotional wellbeing overview
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-6 py-8">

        {/* THREE OPTIONS */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* REPORT */}
          <button
            onClick={() => setActiveSection("report")}
            className={`rounded-2xl border p-6 text-left transition-all hover:shadow-md ${
              activeSection === "report"
                ? "border-primary bg-primary/5 shadow-sm"
                : "bg-card"
            }`}
          >
            <Brain className="mb-4 h-7 w-7 text-primary" />

            <h2 className="text-lg font-semibold">
              Mental Wellness Report
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              View your latest wellbeing assessment report.
            </p>
          </button>

          {/* HISTORY */}
          <button
            onClick={() => setActiveSection("history")}
            className={`rounded-2xl border p-6 text-left transition-all hover:shadow-md ${
              activeSection === "history"
                ? "border-primary bg-primary/5 shadow-sm"
                : "bg-card"
            }`}
          >
            <ClipboardList className="mb-4 h-7 w-7 text-primary" />

            <h2 className="text-lg font-semibold">
              Assessment History
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              View your previous assessments and results.
            </p>
          </button>

          {/* PROGRESS */}
          <button
            onClick={() => setActiveSection("progress")}
            className={`rounded-2xl border p-6 text-left transition-all hover:shadow-md ${
              activeSection === "progress"
                ? "border-primary bg-primary/5 shadow-sm"
                : "bg-card"
            }`}
          >
            <BarChart3 className="mb-4 h-7 w-7 text-primary" />

            <h2 className="text-lg font-semibold">
              Progress Dashboard
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Track your wellbeing trends and improvement.
            </p>
          </button>
        </div>

       {/* SELECTED SECTION */}
<div className="mt-8 rounded-2xl border bg-card p-8 shadow-sm">

  {activeSection === "report" && (
    <MentalWellnessReport />
  )}

  {activeSection === "history" && (
    <AssessmentHistory />
  )}

  {activeSection === "progress" && (
  <ProgressDashboard />
)}

</div>
      </main>
    </div>
  );
};

export default WellnessCenter;