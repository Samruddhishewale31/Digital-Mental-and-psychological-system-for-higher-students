import { AssessmentResult } from "@/types/assessment";

/* =====================================================
   COMMON DATE HELPERS
===================================================== */

const createTimestamp = () => new Date().toISOString();

/* =====================================================
   SELF ASSESSMENT HISTORY
===================================================== */

export interface AssessmentHistoryItem extends AssessmentResult {
  id: string;
  date: string;
}

const STORAGE_KEY = "mental-health-assessment-history";

export const saveAssessment = (result: AssessmentResult) => {
  const history = getAssessmentHistory();

  const newAssessment: AssessmentHistoryItem = {
    ...result,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: createTimestamp(),
  };

  history.unshift(newAssessment);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );
};
export const getAssessmentHistory =
  (): AssessmentHistoryItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

export const clearAssessmentHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteAssessment = (id: string) => {
  const history = getAssessmentHistory();

  const updated = history.filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};

/* =====================================================
   COMPLETE ASSESSMENT HISTORY
===================================================== */

export interface CompleteAssessmentHistoryItem {
  id: string;
  date: string;

  questionnaireScore: number;
  questionnairePercentage: number;

  faceScore: number;
  voiceScore: number;

  overallScore: number;
  riskLevel: string;

  faceEmotion?: string;
  faceObservation?: string;

  voiceEmotion?: string;
  voiceCue?: string;
}

const COMPLETE_HISTORY_KEY =
  "complete-assessment-history";

export const saveCompleteAssessment = (
  item: Omit<
    CompleteAssessmentHistoryItem,
    "id" | "date"
  >
) => {
  const history =
    getCompleteAssessmentHistory();

  const newItem: CompleteAssessmentHistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: createTimestamp(),
  };

  history.unshift(newItem);

  localStorage.setItem(
    COMPLETE_HISTORY_KEY,
    JSON.stringify(history)
  );
};

export const getCompleteAssessmentHistory =
  (): CompleteAssessmentHistoryItem[] => {
    const data = localStorage.getItem(
      COMPLETE_HISTORY_KEY
    );

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

/* =====================================================
   UNIVERSAL WELLNESS REPORT
===================================================== */

export type WellnessAssessmentType =
  | "Self Assessment"
  | "Face Analysis"
  | "Voice Analysis"
  | "Face + Self"
  | "Voice + Self"
  | "Face + Voice"
  | "Complete Analysis";

export interface WellnessReportItem {
  id: string;
  date: string;

  assessmentType: WellnessAssessmentType;

  /* ===================================================
     SELF ASSESSMENT
  =================================================== */

  questionnaireScore?: number;
  questionnairePercentage?: number;

  depressionScore?: number;
  anxietyScore?: number;

  depressionLevel?: string;
  anxietyLevel?: string;

  summary?: string;
  pattern?: string;

  /* ===================================================
     FACE ANALYSIS
  =================================================== */

  faceScore?: number;
  faceEmotion?: string;
  faceConfidence?: number;
  faceObservation?: string;

  /* ===================================================
     VOICE ANALYSIS
  =================================================== */

  voiceScore?: number;
  voiceEmotion?: string;
  voiceConfidence?: number;
  voiceCue?: string;

  /* ===================================================
     COMPLETE / COMBINED ANALYSIS
  =================================================== */

  overallScore?: number;
  riskLevel?: string;

  recommendations?: string[];
}

const WELLNESS_REPORT_KEY =
  "wellness-report-history";

/* =====================================================
   SAVE UNIVERSAL REPORT
===================================================== */

export const saveWellnessReport = (
  report: Omit<
    WellnessReportItem,
    "id" | "date"
  >
) => {
  const history = getWellnessReports();

  const newReport: WellnessReportItem = {
    ...report,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: createTimestamp(),
  };

  history.unshift(newReport);

  localStorage.setItem(
    WELLNESS_REPORT_KEY,
    JSON.stringify(history)
  );

  window.dispatchEvent(
    new CustomEvent("wellness-report-updated")
  );
};

/* =====================================================
   GET ALL WELLNESS REPORTS
===================================================== */

export const getWellnessReports =
  (): WellnessReportItem[] => {
    const data = localStorage.getItem(
      WELLNESS_REPORT_KEY
    );

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

/* =====================================================
   GET LATEST WELLNESS REPORT
===================================================== */

export const getLatestWellnessReport =
  (): WellnessReportItem | null => {
    const reports = getWellnessReports();

    if (!reports.length) return null;

    return reports[0];
  };

/* =====================================================
   DELETE WELLNESS REPORT
===================================================== */

export const deleteWellnessReport = (
  id: string
) => {
  const reports = getWellnessReports();

  const updated = reports.filter(
    (report) => report.id !== id
  );

  localStorage.setItem(
    WELLNESS_REPORT_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new CustomEvent("wellness-report-updated")
  );
};

/* =====================================================
   PROGRESS DASHBOARD
===================================================== */

export interface ProgressRecord {
  id: string;
  date: string;
  assessmentType: string;

  moodScore?: number;
  anxietyScore?: number;
  depressionScore?: number;
  wellnessScore?: number;
}

export const getProgressRecords =
  (): ProgressRecord[] => {
    const records: ProgressRecord[] = [];

    /* =================================================
       READ ONLY FROM UNIVERSAL WELLNESS REPORTS

       This prevents Self Assessment from appearing
       twice in the Progress Dashboard.
    ================================================= */

    const wellnessReports =
      getWellnessReports();

    wellnessReports.forEach((item) => {
      let wellnessScore: number | undefined;

      /*
       * Overall score is treated as a risk score.
       * Lower risk = higher wellness.
       */

      if (
        item.overallScore !== undefined
      ) {
        wellnessScore =
          100 - Number(item.overallScore);
      } else if (
        item.faceScore !== undefined
      ) {
        wellnessScore =
          100 - Number(item.faceScore);
      } else if (
        item.voiceScore !== undefined
      ) {
        wellnessScore =
          100 - Number(item.voiceScore);
      } else if (
        item.questionnairePercentage !== undefined
      ) {
        wellnessScore =
          100 -
          Number(
            item.questionnairePercentage
          );
      }

      records.push({
        id: `wellness-${item.id}`,

        date: item.date,

        assessmentType:
          item.assessmentType,

        /*
         * Mood / wellbeing is available when
         * the assessment produces a wellness score.
         */

        moodScore:
          wellnessScore,

        /*
         * Anxiety is only shown when the actual
         * assessment contains anxiety data.
         */

        anxietyScore:
          item.anxietyScore !== undefined
            ? Number(item.anxietyScore)
            : undefined,

        /*
         * Depression is only shown when the actual
         * assessment contains depression data.
         */

        depressionScore:
          item.depressionScore !== undefined
            ? Number(item.depressionScore)
            : undefined,

        wellnessScore,
      });
    });

    /* =================================================
       SORT — OLDEST TO NEWEST
    ================================================= */

    return records
      .filter(
        (record) => record.date
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );
  };

/* =====================================================
   CLEAR ALL WELLNESS REPORTS
===================================================== */

export const clearWellnessReports = () => {
  localStorage.removeItem(
    WELLNESS_REPORT_KEY
  );

  window.dispatchEvent(
    new CustomEvent("wellness-report-updated")
  );
};