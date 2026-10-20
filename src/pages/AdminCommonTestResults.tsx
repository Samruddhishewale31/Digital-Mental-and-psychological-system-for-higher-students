import {
  BarChart3,
  Users,
  Brain,
  HeartPulse,
  Activity,
} from "lucide-react";
import { useState } from "react";

const AdminCommonTestResults = () => {
  const [selectedExamination, setSelectedExamination] = useState("");

  const results = {
    studentsAssessed: 84,
    averageStress: 42,
    averageAnxiety: 38,
    participation: 78,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Common Test Results
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aggregate mental-health assessment results collected one week
            before examinations.
          </p>
        </div>

        {/* Examination Selection */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">
                Select Examination
              </h2>
              <p className="text-sm text-muted-foreground">
                View the common assessment results collected before the
                selected examination period.
              </p>
            </div>
          </div>

          <select
            value={selectedExamination}
            onChange={(e) => setSelectedExamination(e.target.value)}
            className="w-full max-w-md rounded-md border bg-background px-4 py-3 text-sm"
          >
            <option value="">
              Select examination period
            </option>

            <option value="before-mid-semester">
              Before Mid-Semester Exam
            </option>

            <option value="before-end-semester">
              Before End-Semester Exam
            </option>
          </select>
        </div>

        {!selectedExamination ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">
              Select an Examination Period
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select Mid-Semester or End-Semester to view the
              corresponding aggregate assessment results.
            </p>
          </div>
        ) : (
          <>
            {/* Selected Examination */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-xl font-semibold">
                {selectedExamination === "before-mid-semester"
                  ? "Before Mid-Semester Exam"
                  : "Before End-Semester Exam"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Mental-health assessments collected during the
                one-week period before the examination.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Students Assessed
                  </p>
                  <Users className="h-5 w-5" />
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {results.studentsAssessed}
                </p>
              </div>

              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Average Stress
                  </p>
                  <Brain className="h-5 w-5" />
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {results.averageStress}%
                </p>
              </div>

              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Average Anxiety
                  </p>
                  <HeartPulse className="h-5 w-5" />
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {results.averageAnxiety}%
                </p>
              </div>

              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Participation
                  </p>
                  <Activity className="h-5 w-5" />
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {results.participation}%
                </p>
              </div>
            </div>

            {/* Aggregate Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                  Stress Distribution
                </h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Low</span>
                      <span>35%</span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-green-500"
                        style={{ width: "35%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Moderate</span>
                      <span>45%</span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-yellow-500"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>High</span>
                      <span>20%</span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-red-500"
                        style={{ width: "20%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                  Anxiety Distribution
                </h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Low</span>
                      <span>40%</span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-green-500"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Moderate</span>
                      <span>42%</span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-yellow-500"
                        style={{ width: "42%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>High</span>
                      <span>18%</span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-red-500"
                        style={{ width: "18%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="rounded-xl border bg-muted/30 p-5">
              <p className="text-sm">
                <strong>Privacy:</strong> These results contain only
                aggregate statistics. Individual student names, MindEase
                IDs, answers, and personal assessment records are not
                displayed to administrators.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCommonTestResults;
