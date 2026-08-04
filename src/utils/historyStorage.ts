import { AssessmentResult } from "@/types/assessment";

export interface AssessmentHistoryItem extends AssessmentResult {
  id: string;
  date: string;
}

const STORAGE_KEY = "mental-health-assessment-history";

/**
 * Save a completed assessment
 */
export const saveAssessment = (
  result: AssessmentResult
) => {

  console.log("saveAssessment called");

  const history = getAssessmentHistory();

  console.log("Current History:", history);

  const newAssessment: AssessmentHistoryItem = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toLocaleString(),
  };

  console.log("Saving:", newAssessment);

  history.unshift(newAssessment);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );

  console.log(
    "After Save:",
    localStorage.getItem(STORAGE_KEY)
  );
};

/**
 * Get all saved assessments
 */
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

/**
 * Delete all history
 */
export const clearAssessmentHistory = () => {

  localStorage.removeItem(STORAGE_KEY);

};

/**
 * Delete one assessment
 */
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