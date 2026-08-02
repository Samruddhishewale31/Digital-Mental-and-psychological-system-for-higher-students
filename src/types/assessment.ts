export interface Question {
  id: number;
  category: "Depression" | "Anxiety";
  text: string;
}

export interface Option {
  label: string;
  value: number;
}

export interface AssessmentResult {
  depressionScore: number;
  anxietyScore: number;
  totalScore: number;

  riskLevel: "Minimal Risk" | "Mild Risk" | "Moderate Risk" | "High Risk";

  summary: string;

  pattern: string;
}

export interface Recommendation {
  title: string;
  description: string;
  icon: string;
  link: string;
}