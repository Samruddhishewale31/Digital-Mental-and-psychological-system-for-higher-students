import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Mic,
  Printer,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  getLatestWellnessReport,
  WellnessReportItem,
} from "@/utils/historyStorage";

/* =========================================================
   RECOMMENDATIONS
   ========================================================= */

const FALLBACK_RECOMMENDATIONS: Record<string, string[]> = {
  "Minimal Risk": [
    "Continue regular mood tracking to understand your emotional patterns.",
    "Maintain healthy sleep, study, exercise, and social routines.",
    "Use calming activities such as breathing exercises or relaxing music.",
    "Continue journaling or reflective activities when needed.",
  ],

  "Low Risk": [
    "Continue regular mood tracking to understand your emotional patterns.",
    "Maintain healthy sleep, study, exercise, and social routines.",
    "Use calming activities such as breathing exercises or relaxing music.",
    "Continue journaling or reflective activities when needed.",
  ],

  "Mild Risk": [
    "Track your mood regularly and observe changes over time.",
    "Use stress-relief and relaxation activities when feeling overwhelmed.",
    "Try journaling to identify situations that may be affecting your wellbeing.",
    "Use AI support or wellness resources when additional guidance is needed.",
  ],

  "Moderate Risk": [
    "Monitor your mood and emotional patterns more frequently.",
    "Use stress-relief, breathing, and relaxation activities regularly.",
    "Maintain a consistent sleep and daily routine.",
    "Consider using counselling or professional support if difficulties continue.",
  ],

  "High Risk": [
    "Consider seeking support from a qualified mental-health professional.",
    "Use the counselling-support feature available in the application.",
    "Continue monitoring your wellbeing and avoid ignoring persistent concerns.",
    "Reach out to a trusted person if you feel you need additional support.",
  ],
};

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeRisk = (risk?: string) => {
  if (!risk) return "";

  if (risk.toLowerCase() === "low risk") {
    return "Minimal Risk";
  }

  return risk;
};

const getRiskClass = (risk?: string) => {
  const normalized = normalizeRisk(risk);

  switch (normalized) {
    case "Minimal Risk":
      return "risk-low";

    case "Mild Risk":
      return "risk-mild";

    case "Moderate Risk":
      return "risk-moderate";

    case "High Risk":
      return "risk-high";

    default:
      return "risk-neutral";
  }
};

const getRiskDescription = (risk?: string) => {
  const normalized = normalizeRisk(risk);

  switch (normalized) {
    case "Minimal Risk":
      return "The assessment indicates relatively low-level wellbeing concerns.";

    case "Mild Risk":
      return "The assessment indicates some wellbeing concerns that may benefit from monitoring and self-care.";

    case "Moderate Risk":
      return "The assessment indicates notable wellbeing concerns that should be monitored and supported.";

    case "High Risk":
      return "The assessment indicates elevated wellbeing concerns. Additional professional support may be appropriate.";

    default:
      return "The available analysis provides supportive wellbeing indicators.";
  }
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) {
    return "—";
  }

  return Number(value).toFixed(2);
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function MentalWellnessReport() {
  const navigate = useNavigate();

  const [report, setReport] =
    useState<WellnessReportItem | null>(null);

  useEffect(() => {
    const loadReport = () => {
      setReport(getLatestWellnessReport());
    };

    loadReport();

    window.addEventListener(
      "wellness-report-updated",
      loadReport
    );

    return () => {
      window.removeEventListener(
        "wellness-report-updated",
        loadReport
      );
    };
  }, []);

  /* =======================================================
     NO REPORT
     ======================================================= */

  if (!report) {
    return (
      <div className="min-h-screen bg-[#f6f4fb] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center">
            <FileText
              size={32}
              className="text-purple-600"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            No Wellness Report Available
          </h1>

          <p className="text-gray-600 mt-3 leading-relaxed">
            Complete an assessment or analysis first to
            generate your mental wellness report.
          </p>

          <button
            onClick={() => navigate("/assessment")}
            className="mt-7 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     DETECT AVAILABLE DATA
     ======================================================= */

  const hasSelf =
    report.questionnaireScore !== undefined ||
    report.questionnairePercentage !== undefined ||
    report.depressionScore !== undefined ||
    report.anxietyScore !== undefined ||
    !!report.depressionLevel ||
    !!report.anxietyLevel;

  const hasFace =
    report.faceScore !== undefined ||
    !!report.faceEmotion ||
    !!report.faceObservation;

  const hasVoice =
    report.voiceScore !== undefined ||
    !!report.voiceEmotion ||
    !!report.voiceCue;

  const hasOverall =
    report.overallScore !== undefined ||
    !!report.riskLevel;

  const normalizedRisk =
    normalizeRisk(report.riskLevel);

  /* =======================================================
     RECOMMENDATIONS
     ======================================================= */

  const storedRecommendations =
    (report as WellnessReportItem & {
      recommendations?: string[];
    }).recommendations;

  const recommendations =
    storedRecommendations &&
    storedRecommendations.length > 0
      ? storedRecommendations
      : normalizedRisk
      ? FALLBACK_RECOMMENDATIONS[normalizedRisk] || []
      : [];

  /* =======================================================
     REPORT TYPE
     ======================================================= */

  const reportType = report.assessmentType;

  const isComplete =
    reportType === "Complete Analysis";

  return (
    <>
      {/* ===================================================
          SCREEN VERSION
          =================================================== */}

      <div className="min-h-screen bg-[#f5f3fa] py-8 px-4 print:hidden">
        <div className="max-w-5xl mx-auto">

          {/* =================================================
              TOP BUTTONS
              Back stays visible on screen.
              Both buttons are hidden while printing.
              ================================================= */}

          <div className="flex justify-between items-center mb-5">

            <button
              onClick={() => navigate(-1)}
              className="print-hide px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>

            <button
              onClick={() => window.print()}
              className="print-hide flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              <Printer size={18} />
              Print / Save PDF
            </button>

          </div>

          <ReportContent
            report={report}
            reportType={reportType}
            hasSelf={hasSelf}
            hasFace={hasFace}
            hasVoice={hasVoice}
            hasOverall={hasOverall}
            isComplete={isComplete}
            normalizedRisk={normalizedRisk}
            recommendations={recommendations}
          />

        </div>
      </div>

      {/* ===================================================
          PRINT VERSION
          =================================================== */}

      <div className="print-only-report">

        <div className="print-document">

          <ReportHeader
            report={report}
            reportType={reportType}
          />

          <main className="print-document-body">

            {/* ============================================
                REPORT INFORMATION
                ============================================ */}

            <section className="print-section">

              <div className="section-title">
                <ClipboardCheck size={16} />
                <span>Report Information</span>
              </div>

              <div className="info-grid">

                <InfoBox
                  icon={<ClipboardCheck size={16} />}
                  label="Assessment Type"
                  value={reportType}
                />

                <InfoBox
                  icon={<Activity size={16} />}
                  label="Assessment Date"
                  value={formatDate(report.date)}
                />

                <InfoBox
                  icon={<ShieldCheck size={16} />}
                  label="Report Status"
                  value="Generated"
                />

              </div>

            </section>

            {/* ============================================
                OVERALL ASSESSMENT
                ============================================ */}

            {hasOverall && (
              <section
                className={`overall-box ${getRiskClass(
                  normalizedRisk
                )}`}
              >

                <div className="overall-left">

                  {normalizedRisk === "High Risk" ? (
                    <AlertTriangle size={25} />
                  ) : normalizedRisk ? (
                    <CheckCircle2 size={25} />
                  ) : (
                    <Activity size={25} />
                  )}

                  <div>

                    <p className="small-label">
                      OVERALL ASSESSMENT
                    </p>

                    <h2>
                      {normalizedRisk ||
                        "Supportive Indicator"}
                    </h2>

                    <p className="description">
                      {getRiskDescription(
                        normalizedRisk
                      )}
                    </p>

                  </div>

                </div>

                {report.overallScore !== undefined && (
                  <div className="overall-score">

                    <p className="small-label">
                      OVERALL SCORE
                    </p>

                    <strong>
                      {formatNumber(
                        report.overallScore
                      )}

                      <span>%</span>
                    </strong>

                  </div>
                )}

              </section>
            )}

            {/* ============================================
                ANALYSIS SUMMARY
                ============================================ */}

            {(hasSelf || hasFace || hasVoice) && (
              <section className="print-section">

                <div className="section-title">
                  <Activity size={16} />
                  <span>Analysis Summary</span>
                </div>

                <div className="analysis-grid">

                  {hasSelf && (
                    <AnalysisCard
                      icon={<UserRound size={19} />}
                      title="Self Assessment"
                      score={
                        report.questionnairePercentage
                      }
                      scoreSuffix="%"
                      secondary={
                        report.questionnaireScore !==
                        undefined
                          ? `${formatNumber(
                              report.questionnaireScore
                            )} / 30`
                          : undefined
                      }
                    />
                  )}

                  {hasFace && (
                    <AnalysisCard
                      icon={<Sparkles size={19} />}
                      title="Face Analysis"
                      score={report.faceScore}
                      scoreSuffix=""
                      secondary={
                        report.faceEmotion
                          ? `Emotion: ${report.faceEmotion}`
                          : undefined
                      }
                    />
                  )}

                  {hasVoice && (
                    <AnalysisCard
                      icon={<Mic size={19} />}
                      title="Voice Analysis"
                      score={report.voiceScore}
                      scoreSuffix=""
                      secondary={
                        report.voiceEmotion
                          ? `Emotion: ${report.voiceEmotion}`
                          : undefined
                      }
                    />
                  )}

                </div>

              </section>
            )}

            {/* ============================================
                SELF ASSESSMENT FINDINGS
                ============================================ */}

            {hasSelf && (
              <section className="print-section">

                <div className="section-title">
                  <HeartPulse size={17} />
                  <span>Self-Assessment Findings</span>
                </div>

                <div className="findings-table">

                  <div className="table-header">
                    <div>Measure</div>
                    <div>Score</div>
                    <div>Interpretation</div>
                  </div>

                  <div className="table-row">

                    <div className="bold">
                      Questionnaire
                    </div>

                    <div>
                      {report.questionnaireScore !==
                      undefined
                        ? `${formatNumber(
                            report.questionnaireScore
                          )} / 30`
                        : "—"}
                    </div>

                    <div>
                      {report.questionnairePercentage !==
                      undefined
                        ? `${formatNumber(
                            report.questionnairePercentage
                          )}% recorded`
                        : "Available data recorded"}
                    </div>

                  </div>

                  {(report.depressionScore !==
                    undefined ||
                    report.depressionLevel) && (

                    <div className="table-row">

                      <div className="bold">
                        Depression Indicator
                      </div>

                      <div>
                        {report.depressionScore !==
                        undefined
                          ? formatNumber(
                              report.depressionScore
                            )
                          : "—"}
                      </div>

                      <div>
                        {report.depressionLevel ||
                          "Recorded indicator"}
                      </div>

                    </div>
                  )}

                  {(report.anxietyScore !==
                    undefined ||
                    report.anxietyLevel) && (

                    <div className="table-row">

                      <div className="bold">
                        Anxiety Indicator
                      </div>

                      <div>
                        {report.anxietyScore !==
                        undefined
                          ? formatNumber(
                              report.anxietyScore
                            )
                          : "—"}
                      </div>

                      <div>
                        {report.anxietyLevel ||
                          "Recorded indicator"}
                      </div>

                    </div>
                  )}

                </div>

              </section>
            )}

            {/* ============================================
                ADDITIONAL ANALYSIS
                ============================================ */}

            {(hasFace || hasVoice) && (
              <section className="print-section">

                <div className="section-title">
                  <Activity size={17} />
                  <span>Additional Analysis</span>
                </div>

                <div
                  className={
                    hasFace && hasVoice
                      ? "indicator-grid two"
                      : "indicator-grid one"
                  }
                >

                  {hasFace && (
                    <IndicatorPanel
                      type="Face Analysis"
                      icon={<Sparkles size={17} />}
                      score={report.faceScore}
                      emotion={report.faceEmotion}
                      confidence={
                        report.faceConfidence
                      }
                      observation={
                        report.faceObservation
                      }
                    />
                  )}

                  {hasVoice && (
                    <IndicatorPanel
                      type="Voice Analysis"
                      icon={<Mic size={17} />}
                      score={report.voiceScore}
                      emotion={report.voiceEmotion}
                      confidence={
                        report.voiceConfidence
                      }
                      observation={
                        report.voiceCue
                      }
                    />
                  )}

                </div>

              </section>
            )}

            {/* ============================================
                COMPLETE ANALYSIS WEIGHTAGE
                ============================================ */}

            {isComplete && (
              <section className="print-section">

                <div className="section-title">
                  <Activity size={17} />
                  <span>
                    Complete Analysis Weightage
                  </span>
                </div>

                <div className="weight-grid">

                  <WeightBox
                    title="Self Assessment"
                    value="60%"
                  />

                  <WeightBox
                    title="Face Analysis"
                    value="20%"
                  />

                  <WeightBox
                    title="Voice Analysis"
                    value="20%"
                  />

                </div>

              </section>
            )}

            {/* ============================================
                RECOMMENDATIONS
                ============================================ */}

            {recommendations.length > 0 && (
              <section className="print-section">

                <div className="section-title">
                  <CheckCircle2 size={17} />
                  <span>
                    Personalized Wellness Recommendations
                  </span>
                </div>

                <div className="recommendation-list">

                  {recommendations
                    .slice(0, 6)
                    .map(
                      (
                        recommendation,
                        index
                      ) => (

                        <div
                          key={`${recommendation}-${index}`}
                          className="recommendation-item"
                        >

                          <span className="number-circle">
                            {index + 1}
                          </span>

                          <span>
                            {recommendation}
                          </span>

                        </div>

                      )
                    )}

                </div>

              </section>
            )}

            {/* ============================================
                DISCLAIMER
                ============================================ */}

            <section className="disclaimer">

              <AlertTriangle
                size={18}
                className="disclaimer-icon"
              />

              <div>

                <p className="disclaimer-title">
                  Important Disclaimer
                </p>

                <p className="disclaimer-text">
                  This report provides supportive wellbeing
                  indicators generated from the available
                  assessment data. It is not a medical or
                  psychological diagnosis and should not replace
                  evaluation or advice from a qualified
                  professional.
                </p>

              </div>

            </section>

          </main>

          <PrintFooter />

        </div>

      </div>

      {/* ===================================================
          STYLES
          =================================================== */}

      <style>{`

        /* ==================================================
           GENERAL
           ================================================== */

        .report-font {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .risk-low {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .risk-mild {
          background: #fffbeb;
          border-color: #fde68a;
          color: #b45309;
        }

        .risk-moderate {
          background: #fff7ed;
          border-color: #fed7aa;
          color: #c2410c;
        }

        .risk-high {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .risk-neutral {
          background: #f5f3ff;
          border-color: #ddd6fe;
          color: #6d28d9;
        }

        /* ==================================================
           PRINT VERSION HIDDEN BY DEFAULT
           ================================================== */

        .print-only-report {
          display: none;
        }

        /* ==================================================
           PRINT STYLES
           ================================================== */

        @media print {

          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box !important;
          }

          /* ==================================================
             HIDE SCREEN VERSION
             ================================================== */

          .print\\:hidden {
            display: none !important;
          }

          /* ==================================================
             IMPORTANT:
             BACK BUTTON AND PRINT BUTTON ARE NEVER PRINTED
             ================================================== */

          .print-hide {
            display: none !important;
          }

          button {
            display: none !important;
          }

          /* ==================================================
             SHOW PRINT VERSION
             ================================================== */

          .print-only-report {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          .print-document {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #111827 !important;

            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif !important;

            font-size: 7pt !important;

            break-after: auto !important;
            page-break-after: auto !important;
          }

          /* ==================================================
             HEADER
             ================================================== */

          .print-header {
            width: 100% !important;
            min-height: 31mm !important;
            height: auto !important;
            max-height: none !important;
            padding: 5mm 7mm !important;
            margin: 0 !important;

            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;

            background:
              linear-gradient(
                90deg,
                #6b21a8,
                #4338ca
              ) !important;

            color: #ffffff !important;

            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .print-header-left {
            display: flex !important;
            align-items: center !important;
            gap: 4mm !important;
          }

          .print-header-icon {
            width: 11mm !important;
            height: 11mm !important;
            min-width: 11mm !important;
            border-radius: 3mm !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .print-header-icon svg {
            width: 7mm !important;
            height: 7mm !important;
          }

          .print-header-small {
            font-size: 6pt !important;
            line-height: 1.1 !important;
          }

          .print-header-title {
            font-size: 17pt !important;
            line-height: 1.05 !important;
            margin-top: 1mm !important;
          }

          .print-header-subtitle {
            font-size: 6.5pt !important;
            line-height: 1.1 !important;
            margin-top: 1mm !important;
          }

          .print-header-right {
            font-size: 6.5pt !important;
            line-height: 1.35 !important;
            text-align: right !important;
          }

          .print-header-right strong {
            display: block !important;
            font-size: 7.5pt !important;
          }

          /* ==================================================
             BODY
             ================================================== */

          .print-document-body {
            width: 100% !important;
            padding: 5mm 0 4mm !important;
            margin: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .print-section {
            margin: 0 0 4mm 0 !important;
            padding: 0 !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .overall-box {
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .disclaimer {
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          /* ==================================================
             SECTION TITLE
             ================================================== */

          .section-title {
            display: flex !important;
            align-items: center !important;
            gap: 2mm !important;
            font-size: 8.5pt !important;
            line-height: 1 !important;
            margin: 0 0 1.7mm 0 !important;
            padding: 0 !important;
            break-after: avoid !important;
            page-break-after: avoid !important;
          }

          .section-title svg {
            width: 4mm !important;
            height: 4mm !important;
          }

          /* ==================================================
             INFO GRID
             ================================================== */

          .info-grid {
            display: grid !important;
            grid-template-columns:
              repeat(3, minmax(0, 1fr)) !important;
            gap: 2mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .info-box {
            min-height: 14mm !important;
            padding: 2.2mm !important;
            border-radius: 2mm !important;
            gap: 2mm !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .info-icon {
            width: 6mm !important;
            height: 6mm !important;
            min-width: 6mm !important;
            border-radius: 1.5mm !important;
          }

          .info-icon svg {
            width: 3.5mm !important;
            height: 3.5mm !important;
          }

          .info-label {
            font-size: 5pt !important;
            line-height: 1 !important;
          }

          .info-value {
            font-size: 6.5pt !important;
            line-height: 1.1 !important;
            margin-top: 0.7mm !important;
          }

          /* ==================================================
             OVERALL ASSESSMENT
             ================================================== */

          .overall-box {
            padding: 3mm !important;
            margin: 0 0 4mm 0 !important;
            border-radius: 2.5mm !important;
            gap: 3mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .overall-left {
            display: flex !important;
            align-items: center !important;
            gap: 2.5mm !important;
          }

          .overall-left > svg {
            width: 5mm !important;
            height: 5mm !important;
            min-width: 5mm !important;
          }

          .small-label {
            font-size: 5pt !important;
            line-height: 1 !important;
          }

          .overall-box h2 {
            font-size: 11pt !important;
            line-height: 1.05 !important;
            margin: 0.5mm 0 0 !important;
          }

          .description {
            font-size: 6pt !important;
            line-height: 1.2 !important;
            margin-top: 0.7mm !important;
          }

          .overall-score {
            text-align: right !important;
            flex-shrink: 0 !important;
          }

          .overall-score strong {
            display: block !important;
            font-size: 16pt !important;
            line-height: 1 !important;
          }

          .overall-score strong span {
            font-size: 6pt !important;
            margin-left: 0.5mm !important;
          }

          /* ==================================================
             ANALYSIS SUMMARY
             ================================================== */

          .analysis-grid {
            display: grid !important;
            grid-template-columns:
              repeat(3, minmax(0, 1fr)) !important;
            gap: 2mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .analysis-card {
            min-height: 19mm !important;
            padding: 2.5mm !important;
            border-radius: 2mm !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .analysis-card-header {
            display: flex !important;
            align-items: center !important;
            gap: 1.5mm !important;
          }

          .analysis-icon {
            width: 6mm !important;
            height: 6mm !important;
            min-width: 6mm !important;
            border-radius: 1.5mm !important;
          }

          .analysis-icon svg {
            width: 3.5mm !important;
            height: 3.5mm !important;
          }

          .analysis-title {
            font-size: 6.2pt !important;
            line-height: 1.1 !important;
          }

          .analysis-score {
            font-size: 12pt !important;
            line-height: 1 !important;
            margin-top: 1.5mm !important;
          }

          .analysis-secondary {
            font-size: 5.5pt !important;
            line-height: 1.1 !important;
            margin-top: 0.5mm !important;
          }

          /* ==================================================
             FINDINGS TABLE
             ================================================== */

          .findings-table {
            width: 100% !important;
            border-radius: 2mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
            overflow: visible !important;
          }

          .table-header,
          .table-row {
            display: grid !important;
            grid-template-columns:
              1fr 0.75fr 1.55fr !important;
          }

          .table-header > div,
          .table-row > div {
            padding: 1.8mm !important;
          }

          .table-header {
            min-height: 6mm !important;
            font-size: 5.2pt !important;
            line-height: 1 !important;
          }

          .table-row {
            min-height: 7.5mm !important;
            font-size: 5.8pt !important;
            line-height: 1.15 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* ==================================================
             INDICATOR PANELS
             ================================================== */

          .indicator-grid {
            display: grid !important;
            gap: 2mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .indicator-grid.two {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
          }

          .indicator-grid.one {
            grid-template-columns: 1fr !important;
          }

          .indicator-panel {
            padding: 2.5mm !important;
            border-radius: 2.2mm !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .indicator-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }

          .indicator-title-wrap {
            display: flex !important;
            align-items: center !important;
            gap: 1.8mm !important;
          }

          .indicator-icon {
            width: 6mm !important;
            height: 6mm !important;
            min-width: 6mm !important;
            border-radius: 1.5mm !important;
          }

          .indicator-icon svg {
            width: 3.5mm !important;
            height: 3.5mm !important;
          }

          .indicator-title {
            font-size: 6.5pt !important;
            line-height: 1 !important;
          }

          .indicator-score {
            font-size: 8pt !important;
          }

          .indicator-details {
            margin-top: 1.7mm !important;
            gap: 0.8mm !important;
          }

          .indicator-detail {
            font-size: 5.5pt !important;
            line-height: 1.2 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* ==================================================
             WEIGHTAGE
             ================================================== */

          .weight-grid {
            display: grid !important;
            grid-template-columns:
              repeat(3, minmax(0, 1fr)) !important;
            gap: 2mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .weight-box {
            padding: 2.5mm !important;
            border-radius: 2mm !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .weight-title {
            font-size: 5.3pt !important;
            line-height: 1.1 !important;
          }

          .weight-value {
            font-size: 11pt !important;
            line-height: 1 !important;
            margin-top: 0.7mm !important;
          }

          /* ==================================================
             RECOMMENDATIONS
             ================================================== */

          .recommendation-list {
            display: grid !important;
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
            column-gap: 5mm !important;
            row-gap: 1.5mm !important;
          }

          .recommendation-item {
            display: flex !important;
            align-items: flex-start !important;
            font-size: 5.7pt !important;
            line-height: 1.25 !important;
            gap: 1.7mm !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .number-circle {
            width: 4.2mm !important;
            height: 4.2mm !important;
            min-width: 4.2mm !important;
            border-radius: 50% !important;
            font-size: 5pt !important;
          }

          /* ==================================================
             DISCLAIMER
             ================================================== */

          .disclaimer {
            display: flex !important;
            align-items: flex-start !important;
            gap: 2.5mm !important;
            padding: 2.5mm !important;
            margin: 2mm 0 0 !important;
            border-radius: 2mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }

          .disclaimer-icon {
            width: 4.5mm !important;
            height: 4.5mm !important;
            min-width: 4.5mm !important;
          }

          .disclaimer-title {
            font-size: 5.8pt !important;
            line-height: 1 !important;
          }

          .disclaimer-text {
            font-size: 5.2pt !important;
            line-height: 1.25 !important;
            margin-top: 0.7mm !important;
          }

          /* ==================================================
             FOOTER
             ================================================== */

          .print-footer {
            display: flex !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 7mm !important;
            margin: 2mm 0 0 !important;
            padding: 2mm 0 !important;
            border-top: 1px solid #e5e7eb !important;
            background: #ffffff !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 4mm !important;
            font-size: 4.8pt !important;
            color: #6b7280 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* ==================================================
             LINKS
             ================================================== */

          a {
            color: inherit !important;
            text-decoration: none !important;
          }

          /* ==================================================
             ORPHANS / WIDOWS
             ================================================== */

          h1,
          h2,
          h3,
          p {
            orphans: 2 !important;
            widows: 2 !important;
          }

          /* ==================================================
             DO NOT FORCE SINGLE PAGE
             ================================================== */

        }

        /* ==================================================
           SCREEN / NORMAL REPORT STYLES
           ================================================== */

        .print-header {
          background:
            linear-gradient(
              90deg,
              #6b21a8,
              #4338ca
            );

          color: white;

          padding: 9mm 12mm;

          display: flex;

          align-items: center;
          justify-content: space-between;

          break-inside: avoid;
          page-break-inside: avoid;
        }

        .print-header-left {
          display: flex;

          align-items: center;

          gap: 5mm;
        }

        .print-header-icon {
          width: 14mm;
          height: 14mm;

          border-radius: 4mm;

          background:
            rgba(255,255,255,0.15);

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .print-header-small {
          font-size: 8pt;

          text-transform: uppercase;

          letter-spacing: 0.12em;

          font-weight: 600;

          color: #ede9fe;
        }

        .print-header-title {
          font-size: 21pt;

          font-weight: 800;

          margin-top: 1mm;
        }

        .print-header-subtitle {
          font-size: 8pt;

          color: #ede9fe;

          margin-top: 1mm;
        }

        .print-header-right {
          text-align: right;

          font-size: 8pt;

          color: #ede9fe;
        }

        .print-header-right strong {
          display: block;

          color: white;

          font-size: 9pt;
        }

        .print-document-body {
          padding: 10mm 12mm;
        }

        .print-section {
          margin-bottom: 7mm;
        }

        .print-keep-together {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* ==================================================
           SECTION TITLE
           ================================================== */

        .section-title {
          display: flex;

          align-items: center;

          gap: 3mm;

          font-size: 12pt;

          font-weight: 800;

          color: #111827;

          margin-bottom: 4mm;
        }

        .section-title svg {
          color: #7c3aed;
        }

        /* ==================================================
           INFORMATION GRID
           ================================================== */

        .info-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 3mm;
        }

        .info-box {
          border: 1px solid #e5e7eb;

          border-radius: 3mm;

          background: #f9fafb;

          padding: 3.5mm;

          display: flex;

          align-items: center;

          gap: 3mm;
        }

        .info-icon {
          width: 8mm;
          height: 8mm;

          border-radius: 2mm;

          background: #ede9fe;

          color: #7c3aed;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .info-label {
          font-size: 6.5pt;

          text-transform: uppercase;

          letter-spacing: 0.05em;

          color: #9ca3af;

          font-weight: 800;
        }

        .info-value {
          font-size: 8pt;

          font-weight: 700;

          color: #1f2937;

          margin-top: 1mm;
        }

        /* ==================================================
           OVERALL BOX
           ================================================== */

        .overall-box {
          border: 1px solid;

          border-radius: 4mm;

          padding: 5mm;

          margin-bottom: 7mm;

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 5mm;
        }

        .overall-left {
          display: flex;

          align-items: center;

          gap: 4mm;
        }

        .small-label {
          font-size: 6.5pt;

          text-transform: uppercase;

          letter-spacing: 0.08em;

          font-weight: 800;

          opacity: 0.7;
        }

        .overall-box h2 {
          font-size: 16pt;

          font-weight: 800;

          margin-top: 0.5mm;
        }

        .description {
          font-size: 8pt;

          margin-top: 1mm;

          opacity: 0.8;
        }

        .overall-score {
          text-align: right;

          flex-shrink: 0;
        }

        .overall-score strong {
          display: block;

          font-size: 23pt;

          font-weight: 800;
        }

        .overall-score strong span {
          font-size: 9pt;

          margin-left: 1mm;
        }

        /* ==================================================
           ANALYSIS CARDS
           ================================================== */

        .analysis-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 3mm;
        }

        .analysis-card {
          border: 1px solid #e5e7eb;

          border-radius: 3mm;

          padding: 4mm;

          background: white;
        }

        .analysis-card-header {
          display: flex;

          align-items: center;

          gap: 2.5mm;
        }

        .analysis-icon {
          width: 8mm;
          height: 8mm;

          border-radius: 2mm;

          background: #ede9fe;

          color: #7c3aed;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .analysis-title {
          font-size: 8pt;

          font-weight: 800;
        }

        .analysis-score {
          font-size: 18pt;

          font-weight: 800;

          color: #6d28d9;

          margin-top: 3mm;
        }

        .analysis-secondary {
          font-size: 7pt;

          color: #6b7280;

          margin-top: 0.5mm;
        }

        /* ==================================================
           FINDINGS TABLE
           ================================================== */

        .findings-table {
          border: 1px solid #e5e7eb;

          border-radius: 3mm;

          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;

          grid-template-columns:
            1fr 0.8fr 1.5fr;
        }

        .table-header {
          background: #f3f4f6;

          font-size: 7pt;

          text-transform: uppercase;

          letter-spacing: 0.06em;

          font-weight: 800;

          color: #6b7280;
        }

        .table-header > div,
        .table-row > div {
          padding: 4mm;
        }

        .table-row {
          border-top: 1px solid #e5e7eb;

          font-size: 8pt;

          color: #4b5563;

          min-height: 16mm;

          align-items: center;
        }

        .table-row .bold {
          font-weight: 800;

          color: #1f2937;
        }

        /* ==================================================
           INDICATOR PANELS
           ================================================== */

        .indicator-grid {
          display: grid;

          gap: 4mm;
        }

        .indicator-grid.two {
          grid-template-columns:
            repeat(2, 1fr);
        }

        .indicator-grid.one {
          grid-template-columns: 1fr;
        }

        .indicator-panel {
          border: 1px solid #e5e7eb;

          border-radius: 4mm;

          padding: 5mm;

          background: #f9fafb;
        }

        .indicator-header {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .indicator-title-wrap {
          display: flex;

          align-items: center;

          gap: 3mm;
        }

        .indicator-icon {
          width: 8mm;
          height: 8mm;

          border-radius: 2mm;

          background: white;

          color: #7c3aed;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .indicator-title {
          font-size: 9pt;

          font-weight: 800;

          color: #111827;
        }

        .indicator-score {
          font-size: 11pt;

          font-weight: 800;

          color: #6d28d9;
        }

        .indicator-details {
          margin-top: 4mm;

          display: flex;

          flex-direction: column;

          gap: 2mm;
        }

        .indicator-detail {
          font-size: 7.5pt;

          color: #4b5563;

          line-height: 1.5;
        }

        .indicator-detail strong {
          color: #374151;
        }

        /* ==================================================
           WEIGHTAGE
           ================================================== */

        .weight-section {
          margin-top: 0;
        }

        .weight-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 4mm;
        }

        .weight-box {
          border: 1px solid #e5e7eb;

          border-radius: 3mm;

          background: #f9fafb;

          text-align: center;

          padding: 5mm;
        }

        .weight-title {
          font-size: 7pt;

          color: #6b7280;

          font-weight: 600;
        }

        .weight-value {
          font-size: 16pt;

          color: #6d28d9;

          font-weight: 800;

          margin-top: 1mm;
        }

        /* ==================================================
           RECOMMENDATIONS
           ================================================== */

        .recommendation-list {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          column-gap: 8mm;

          row-gap: 5mm;
        }

        .recommendation-item {
          display: flex;

          align-items: flex-start;

          gap: 3mm;

          font-size: 8.5pt;

          line-height: 1.55;

          color: #374151;
        }

        .number-circle {
          width: 6mm;
          height: 6mm;

          min-width: 6mm;

          border-radius: 50%;

          background: #ede9fe;

          color: #6d28d9;

          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 7pt;

          font-weight: 800;
        }

        /* ==================================================
           DISCLAIMER
           ================================================== */

        .disclaimer {
          display: flex;

          align-items: flex-start;

          gap: 4mm;

          border: 1px solid #fde68a;

          border-radius: 3mm;

          background: #fffbeb;

          padding: 5mm;

          margin-top: 5mm;
        }

        .disclaimer-icon {
          color: #d97706;

          flex-shrink: 0;
        }

        .disclaimer-title {
          font-size: 8pt;

          font-weight: 800;

          color: #92400e;
        }

        .disclaimer-text {
          font-size: 7pt;

          line-height: 1.5;

          color: #92400e;

          margin-top: 1.5mm;
        }

        /* ==================================================
           FOOTER
           ================================================== */

        .print-footer {
          display: none;

          position: absolute;
        }

        /* ==================================================
           SCREEN COMPONENT STYLES
           ================================================== */

        .screen-analysis-card {
          border: 1px solid #e5e7eb;

          border-radius: 0.75rem;

          padding: 0.875rem;

          background: white;
        }

      `}</style>
    </>
  );
}

/* =========================================================
   SCREEN REPORT CONTENT
   ========================================================= */

function ReportContent({
  report,
  reportType,
  hasSelf,
  hasFace,
  hasVoice,
  hasOverall,
  isComplete,
  normalizedRisk,
  recommendations,
}: {
  report: WellnessReportItem;
  reportType: string;
  hasSelf: boolean;
  hasFace: boolean;
  hasVoice: boolean;
  hasOverall: boolean;
  isComplete: boolean;
  normalizedRisk: string;
  recommendations: string[];
}) {
  return (
    <div
      className="
        report-font
        bg-white
        max-w-[900px]
        mx-auto
        shadow-xl
        rounded-2xl
        overflow-hidden
      "
    >

      {/* HEADER */}

      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-8 py-6">

        <div className="flex items-center justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Brain size={27} />
            </div>

            <div>

              <h1 className="text-2xl font-bold mt-1">
                Mental Wellness Report
              </h1>

              <p className="text-xs text-purple-100 mt-1">
                Supportive wellbeing assessment summary
              </p>

            </div>

          </div>

          <div className="text-right text-xs text-purple-100">

            <p className="font-semibold text-white">
              {reportType}
            </p>

            <p className="mt-1">
              {formatDate(report.date)}
            </p>

            <p>
              {formatTime(report.date)}
            </p>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="px-8 py-6">

        {/* INFO */}

        <div className="grid grid-cols-3 gap-3 mb-4">

          <InfoBox
            icon={<ClipboardCheck size={16} />}
            label="Assessment Type"
            value={reportType}
          />

          <InfoBox
            icon={<Activity size={16} />}
            label="Assessment Date"
            value={formatDate(report.date)}
          />

          <InfoBox
            icon={<ShieldCheck size={16} />}
            label="Report Status"
            value="Generated"
          />

        </div>

        {/* OVERALL */}

        {hasOverall && (
          <div
            className={`
              rounded-xl
              border
              p-4
              mb-4
              ${getRiskClass(normalizedRisk)}
            `}
          >

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                {normalizedRisk === "High Risk" ? (
                  <AlertTriangle size={25} />
                ) : normalizedRisk ? (
                  <CheckCircle2 size={25} />
                ) : (
                  <Activity size={25} />
                )}

                <div>

                  <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                    Overall Assessment
                  </p>

                  <h2 className="text-xl font-bold mt-0.5">
                    {normalizedRisk ||
                      "Supportive Indicator"}
                  </h2>

                  <p className="text-xs mt-1 opacity-80">
                    {getRiskDescription(
                      normalizedRisk
                    )}
                  </p>

                </div>

              </div>

              {report.overallScore !== undefined && (
                <div className="text-right">

                  <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                    Overall Score
                  </p>

                  <p className="text-3xl font-bold">

                    {formatNumber(
                      report.overallScore
                    )}

                    <span className="text-sm">
                      %
                    </span>

                  </p>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ANALYSIS CARDS */}

        <div className="grid grid-cols-3 gap-3 mb-4">

          {hasSelf && (
            <AnalysisCard
              icon={<UserRound size={19} />}
              title="Self Assessment"
              score={
                report.questionnairePercentage
              }
              scoreSuffix="%"
              secondary={
                report.questionnaireScore !==
                undefined
                  ? `${formatNumber(
                      report.questionnaireScore
                    )} / 30`
                  : undefined
              }
            />
          )}

          {hasFace && (
            <AnalysisCard
              icon={<Sparkles size={19} />}
              title="Face Analysis"
              score={report.faceScore}
              scoreSuffix=""
              secondary={
                report.faceEmotion
                  ? `Emotion: ${report.faceEmotion}`
                  : undefined
              }
            />
          )}

          {hasVoice && (
            <AnalysisCard
              icon={<Mic size={19} />}
              title="Voice Analysis"
              score={report.voiceScore}
              scoreSuffix=""
              secondary={
                report.voiceEmotion
                  ? `Emotion: ${report.voiceEmotion}`
                  : undefined
              }
            />
          )}

        </div>

        {/* SELF ASSESSMENT */}

        {hasSelf && (
          <div className="mb-4">

            <SectionHeading
              icon={<HeartPulse size={17} />}
              title="Self-Assessment Findings"
            />

            <div className="border border-gray-200 rounded-xl overflow-hidden">

              <div className="grid grid-cols-3 bg-gray-50 text-[10px] uppercase tracking-wide font-bold text-gray-500">

                <div className="px-4 py-2.5">
                  Measure
                </div>

                <div className="px-4 py-2.5">
                  Score
                </div>

                <div className="px-4 py-2.5">
                  Interpretation
                </div>

              </div>

              <div className="grid grid-cols-3 text-xs border-t border-gray-200">

                <div className="px-4 py-2.5 font-semibold text-gray-800">
                  Questionnaire
                </div>

                <div className="px-4 py-2.5 text-gray-700">

                  {report.questionnaireScore !==
                  undefined
                    ? `${formatNumber(
                        report.questionnaireScore
                      )} / 30`
                    : "—"}

                </div>

                <div className="px-4 py-2.5 text-gray-600">

                  {report.questionnairePercentage !==
                  undefined
                    ? `${formatNumber(
                        report.questionnairePercentage
                      )}% recorded`
                    : "Available data recorded"}

                </div>

              </div>

              {(report.depressionScore !==
                undefined ||
                report.depressionLevel) && (

                <div className="grid grid-cols-3 text-xs border-t border-gray-200">

                  <div className="px-4 py-2.5 font-semibold text-gray-800">
                    Depression Indicator
                  </div>

                  <div className="px-4 py-2.5 text-gray-700">

                    {report.depressionScore !==
                    undefined
                      ? formatNumber(
                          report.depressionScore
                        )
                      : "—"}

                  </div>

                  <div className="px-4 py-2.5 text-gray-600">

                    {report.depressionLevel ||
                      "Recorded indicator"}

                  </div>

                </div>
              )}

              {(report.anxietyScore !==
                undefined ||
                report.anxietyLevel) && (

                <div className="grid grid-cols-3 text-xs border-t border-gray-200">

                  <div className="px-4 py-2.5 font-semibold text-gray-800">
                    Anxiety Indicator
                  </div>

                  <div className="px-4 py-2.5 text-gray-700">

                    {report.anxietyScore !==
                    undefined
                      ? formatNumber(
                          report.anxietyScore
                        )
                      : "—"}

                  </div>

                  <div className="px-4 py-2.5 text-gray-600">

                    {report.anxietyLevel ||
                      "Recorded indicator"}

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* FACE + VOICE */}

        {(hasFace || hasVoice) && (
          <div className="grid grid-cols-2 gap-3 mb-4">

            {hasFace && (
              <IndicatorPanel
                type="Face Analysis"
                icon={<Sparkles size={17} />}
                score={report.faceScore}
                emotion={report.faceEmotion}
                confidence={
                  report.faceConfidence
                }
                observation={
                  report.faceObservation
                }
              />
            )}

            {hasVoice && (
              <IndicatorPanel
                type="Voice Analysis"
                icon={<Mic size={17} />}
                score={report.voiceScore}
                emotion={report.voiceEmotion}
                confidence={
                  report.voiceConfidence
                }
                observation={
                  report.voiceCue
                }
              />
            )}

          </div>
        )}

        {/* WEIGHTAGE */}

        {isComplete && (
          <div className="mb-4">

            <SectionHeading
              icon={<Activity size={17} />}
              title="Complete Analysis Weightage"
            />

            <div className="grid grid-cols-3 gap-3">

              <WeightBox
                title="Self Assessment"
                value="60%"
              />

              <WeightBox
                title="Face Analysis"
                value="20%"
              />

              <WeightBox
                title="Voice Analysis"
                value="20%"
              />

            </div>

          </div>
        )}

        {/* RECOMMENDATIONS */}

        {recommendations.length > 0 && (
          <div className="mb-4">

            <SectionHeading
              icon={<CheckCircle2 size={17} />}
              title="Personalized Wellness Recommendations"
            />

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">

              {recommendations
                .slice(0, 6)
                .map(
                  (
                    recommendation,
                    index
                  ) => (

                    <div
                      key={`${recommendation}-${index}`}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >

                      <span className="mt-[2px] flex-shrink-0 w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] font-bold">
                        {index + 1}
                      </span>

                      <span className="leading-relaxed">
                        {recommendation}
                      </span>

                    </div>

                  )
                )}

            </div>

          </div>
        )}

        {/* DISCLAIMER */}

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

          <div className="flex items-start gap-3">

            <AlertTriangle
              size={18}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />

            <div>

              <p className="text-xs font-bold text-amber-800">
                Important Disclaimer
              </p>

              <p className="text-[10px] leading-relaxed text-amber-800 mt-1">
                This report provides supportive wellbeing
                indicators generated from the available
                assessment data. It is not a medical or
                psychological diagnosis and should not replace
                evaluation or advice from a qualified
                professional.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="border-t border-gray-200 bg-gray-50 px-8 py-3">

        <div className="flex items-center justify-between text-[9px] text-gray-500">

          <div className="font-semibold">
            Confidential • Educational Use
          </div>

          <div>
            K. J. Somaiya School of Engineering
          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PRINT HEADER
   ========================================================= */

function ReportHeader({
  report,
  reportType,
  compact = false,
}: {
  report: WellnessReportItem;
  reportType: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`print-header ${
        compact ? "compact-header" : ""
      }`}
    >

      <div className="print-header-left">

        <div className="print-header-icon">

          <Brain size={27} />

        </div>

        <div>

          <div className="print-header-small">
            Digital Mental Wellness System
          </div>

          <div className="print-header-title">
            Mental Wellness Report
          </div>

          <div className="print-header-subtitle">
            Supportive wellbeing assessment summary
          </div>

        </div>

      </div>

      <div className="print-header-right">

        <strong>
          {reportType}
        </strong>

        <div>
          {formatDate(report.date)}
        </div>

        <div>
          {formatTime(report.date)}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PRINT FOOTER
   ========================================================= */

function PrintFooter() {
  return (
    <div className="print-footer">

      <div>
        Digital Mental Wellness System for Higher Students
      </div>

      <strong>
        Confidential • Educational Use
      </strong>

      <div>
        K. J. Somaiya School of Engineering
      </div>

    </div>
  );
}

/* =========================================================
   INFO BOX
   ========================================================= */

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="info-box">

      <div className="info-icon">
        {icon}
      </div>

      <div>

        <div className="info-label">
          {label}
        </div>

        <div className="info-value">
          {value}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">

      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
        {icon}
      </div>

      <h2 className="text-sm font-bold text-gray-900">
        {title}
      </h2>

    </div>
  );
}

/* =========================================================
   ANALYSIS CARD
   ========================================================= */

function AnalysisCard({
  icon,
  title,
  score,
  scoreSuffix,
  secondary,
}: {
  icon: React.ReactNode;
  title: string;
  score?: number;
  scoreSuffix?: string;
  secondary?: string;
}) {
  return (
    <div className="analysis-card">

      <div className="analysis-card-header">

        <div className="analysis-icon">
          {icon}
        </div>

        <p className="analysis-title">
          {title}
        </p>

      </div>

      <div className="analysis-score">

        {score !== undefined
          ? formatNumber(score)
          : "—"}

        {score !== undefined &&
          scoreSuffix && (
            <span className="text-xs ml-1">
              {scoreSuffix}
            </span>
          )}

      </div>

      {secondary && (
        <p className="analysis-secondary">
          {secondary}
        </p>
      )}

    </div>
  );
}

/* =========================================================
   INDICATOR PANEL
   ========================================================= */

function IndicatorPanel({
  type,
  icon,
  score,
  emotion,
  confidence,
  observation,
}: {
  type: string;
  icon: React.ReactNode;
  score?: number;
  emotion?: string;
  confidence?: number;
  observation?: string;
}) {
  return (
    <div className="indicator-panel">

      <div className="indicator-header">

        <div className="indicator-title-wrap">

          <div className="indicator-icon">
            {icon}
          </div>

          <h3 className="indicator-title">
            {type}
          </h3>

        </div>

        {score !== undefined && (
          <span className="indicator-score">
            {formatNumber(score)}
          </span>
        )}

      </div>

      <div className="indicator-details">

        {emotion && (
          <p className="indicator-detail">

            <strong>
              Detected emotion:
            </strong>{" "}

            {emotion}

          </p>
        )}

        {confidence !== undefined &&
          confidence > 0 && (
            <p className="indicator-detail">

              <strong>
                Confidence:
              </strong>{" "}

              {formatNumber(confidence)}%

            </p>
          )}

        {observation && (
          <p className="indicator-detail">

            <strong>
              Observation:
            </strong>{" "}

            {observation}

          </p>
        )}

        {!emotion &&
          !observation &&
          score === undefined && (
            <p className="indicator-detail">
              Supportive indicator data recorded.
            </p>
          )}

      </div>

    </div>
  );
}

/* =========================================================
   WEIGHT BOX
   ========================================================= */

function WeightBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="weight-box">

      <p className="weight-title">
        {title}
      </p>

      <p className="weight-value">
        {value}
      </p>

    </div>
  );
}