import { Question, Option } from "@/types/assessment";

export const questions: Question[] = [
  // ------------------------------
  // Depression (Inspired by CES-D)
  // ------------------------------

  {
    id: 1,
    category: "Depression",
    text: "Over the past two weeks, how often have you had little interest or pleasure in doing things?"
  },

  {
    id: 2,
    category: "Depression",
    text: "How often have you felt sad, down, or hopeless?"
  },

  {
    id: 3,
    category: "Depression",
    text: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?"
  },

  {
    id: 4,
    category: "Depression",
    text: "How often have you felt tired or had very little energy?"
  },

  {
    id: 5,
    category: "Depression",
    text: "How often have you felt bad about yourself or felt like a failure?"
  },

  {
    id: 6,
    category: "Depression",
    text: "How often have you had difficulty concentrating on your studies or daily activities?"
  },

  // ------------------------------
  // Anxiety (Inspired by GAD-7)
  // ------------------------------

  {
    id: 7,
    category: "Anxiety",
    text: "How often have you felt nervous, anxious, or on edge?"
  },

  {
    id: 8,
    category: "Anxiety",
    text: "How often have you been unable to stop or control worrying?"
  },

  {
    id: 9,
    category: "Anxiety",
    text: "How often have you found it difficult to relax?"
  },

  {
    id: 10,
    category: "Anxiety",
    text: "How often have academic workload or deadlines made you feel overwhelmed?"
  }
];

export const options: Option[] = [
  {
    label: "Not at all",
    value: 0
  },

  {
    label: "Several days",
    value: 1
  },

  {
    label: "More than half the days",
    value: 2
  },

  {
    label: "Nearly every day",
    value: 3
  }
];