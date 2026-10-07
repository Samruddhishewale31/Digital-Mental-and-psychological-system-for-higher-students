import { useEffect, useState } from "react";
import {
  ClipboardList,
  Brain,
  Camera,
  AudioLines,
  CalendarDays,
  Trash2,
} from "lucide-react";

import {
  getWellnessReports,
  deleteWellnessReport,
  WellnessReportItem,
} from "@/utils/historyStorage";

const AssessmentHistory = () => {
  const [reports, setReports] = useState<WellnessReportItem[]>([]);

  const loadReports = () => {
    setReports(getWellnessReports());
  };

  useEffect(() => {
    loadReports();

    window.addEventListener(
      "wellness-report-updated",
      loadReports
    );

    return () => {
      window.removeEventListener(
        "wellness-report-updated",
        loadReports
      );
    };
  }, []);

  const handleDelete = (id: string) => {
    deleteWellnessReport(id);
    loadReports();
  };

  /* =====================================================
     EMPTY HISTORY
  ===================================================== */

  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <ClipboardList className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

        <h3 className="text-xl font-semibold">
          No Assessment History
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Your completed assessments will appear here
          once you start using the wellness tools.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h2 className="text-2xl font-bold">
          Assessment History
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          View your previous wellbeing assessments and
          track changes in anxiety, depression and overall risk.
        </p>
      </div>

      {/* =====================================================
          HISTORY TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border bg-card">

        {/* TABLE HEADER */}

        <div className="hidden grid-cols-5 gap-4 border-b bg-muted/50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">

          <div>
            Date
          </div>

          <div>
            Anxiety
          </div>

          <div>
            Depression
          </div>

          <div>
            Risk
          </div>

          <div className="text-right">
            Action
          </div>

        </div>

        {/* HISTORY RECORDS */}

        <div className="divide-y">

          {reports.map((report) => {

            const hasSelf =
              report.questionnaireScore !== undefined ||
              report.questionnairePercentage !== undefined ||
              report.anxietyScore !== undefined ||
              report.depressionScore !== undefined;

            const hasFace =
              report.faceScore !== undefined ||
              report.faceEmotion !== undefined;

            const hasVoice =
              report.voiceScore !== undefined ||
              report.voiceEmotion !== undefined;

            /*
              Prefer the assessment LEVELS because the
              required history format is:

              Mild / Moderate / Severe
              Minimal / Mild / Moderate
              Low / Moderate / High
            */

            const anxiety =
              report.anxietyLevel ||
              (
                report.anxietyScore !== undefined
                  ? `Score: ${report.anxietyScore}`
                  : "—"
              );

            const depression =
              report.depressionLevel ||
              (
                report.depressionScore !== undefined
                  ? `Score: ${report.depressionScore}`
                  : "—"
              );

            const risk =
              report.riskLevel || "—";

            return (
              <div
                key={report.id}
                className="px-5 py-5 transition-colors hover:bg-muted/20"
              >

                {/* =================================================
                    DESKTOP ROW
                ================================================= */}

                <div className="hidden items-center md:grid md:grid-cols-5 md:gap-4">

                  {/* DATE */}

                  <div className="flex items-center gap-2">

                    <CalendarDays className="h-4 w-4 text-primary" />

                    <div>
                      <p className="font-medium">
                        {new Date(
                          report.date
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {report.assessmentType}
                      </p>
                    </div>

                  </div>

                  {/* ANXIETY */}

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        anxiety.toLowerCase().includes("severe")
                          ? "bg-red-100 text-red-700"
                          : anxiety.toLowerCase().includes("moderate")
                          ? "bg-orange-100 text-orange-700"
                          : anxiety.toLowerCase().includes("mild")
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {anxiety}
                    </span>
                  </div>

                  {/* DEPRESSION */}

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        depression.toLowerCase().includes("severe")
                          ? "bg-red-100 text-red-700"
                          : depression.toLowerCase().includes("moderate")
                          ? "bg-orange-100 text-orange-700"
                          : depression.toLowerCase().includes("mild")
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {depression}
                    </span>
                  </div>

                  {/* RISK */}

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        risk.toLowerCase().includes("high")
                          ? "bg-red-100 text-red-700"
                          : risk.toLowerCase().includes("moderate")
                          ? "bg-orange-100 text-orange-700"
                          : risk.toLowerCase().includes("mild")
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {risk}
                    </span>
                  </div>

                  {/* DELETE */}

                  <div className="flex justify-end">

                    <button
                      onClick={() =>
                        handleDelete(report.id)
                      }
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete assessment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>

                {/* =================================================
                    MOBILE CARD
                ================================================= */}

                <div className="space-y-4 md:hidden">

                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">

                        {hasSelf && !hasFace && !hasVoice ? (
                          <Brain className="h-5 w-5 text-primary" />
                        ) : hasFace && !hasVoice ? (
                          <Camera className="h-5 w-5 text-primary" />
                        ) : hasVoice && !hasFace ? (
                          <AudioLines className="h-5 w-5 text-primary" />
                        ) : (
                          <ClipboardList className="h-5 w-5 text-primary" />
                        )}

                      </div>

                      <div>

                        <p className="font-semibold">
                          {report.assessmentType}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">

                          <CalendarDays className="h-3.5 w-3.5" />

                          {new Date(
                            report.date
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        handleDelete(report.id)
                      }
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete assessment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                  {/* MOBILE RESULTS */}

                  <div className="grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-muted/50 p-3">

                      <p className="text-xs text-muted-foreground">
                        Anxiety
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {anxiety}
                      </p>

                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">

                      <p className="text-xs text-muted-foreground">
                        Depression
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {depression}
                      </p>

                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">

                      <p className="text-xs text-muted-foreground">
                        Risk
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {risk}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* =====================================================
          NOTE
      ===================================================== */}

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">

        <p className="text-xs leading-relaxed text-muted-foreground">

          <strong>Note:</strong>{" "}
          Every completed wellness assessment is stored
          locally in your browser. The history displays
          the assessment date, anxiety level, depression
          level and overall risk level. These results are
          intended for wellbeing support and are not a
          medical diagnosis.

        </p>

      </div>

    </div>
  );
};

export default AssessmentHistory;