
import MentalWellnessReport from "@/components/MentalWellnessReport";
import AssessmentHistory from "@/components/AssessmentHistory";
import ProgressDashboard from "@/components/ProgressDashboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Brain,
  ClipboardList,
  BarChart3,
} from "lucide-react";

type WellnessSection = "report" | "history" | "progress";

const WellnessCenter = () => {
  const [activeSection, setActiveSection] =
    useState<WellnessSection>("report");

  const navigate = useNavigate();

  const handleSectionChange = (section: WellnessSection) => {
    setActiveSection(section);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">

          {/* NAVIGATION BUTTONS */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() =>
                navigate("/assessment", {
                  state: { fromAssessment: true },
                })
              }
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Results
            </button>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>

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

          {/* MENTAL WELLNESS REPORT */}
          <button
            type="button"
            onClick={() => handleSectionChange("report")}
            aria-pressed={activeSection === "report"}
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

          {/* ASSESSMENT HISTORY */}
          <button
            type="button"
            onClick={() => handleSectionChange("history")}
            aria-pressed={activeSection === "history"}
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

          {/* PROGRESS DASHBOARD */}
          <button
            type="button"
            onClick={() => handleSectionChange("progress")}
            aria-pressed={activeSection === "progress"}
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
        <section
          className="mt-8 rounded-2xl border bg-card p-4 shadow-sm sm:p-8"
          aria-live="polite"
        >
          {activeSection === "report" && (
            <MentalWellnessReport />
          )}

          {activeSection === "history" && (
            <AssessmentHistory />
          )}

          {activeSection === "progress" && (
            <ProgressDashboard />
          )}
        </section>
      </main>
    </div>
  );
};

export default WellnessCenter;
