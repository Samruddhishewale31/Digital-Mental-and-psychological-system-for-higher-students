
export interface MoodOption {
  label: string;
  value: string;
  score: number;
}

export interface MoodPrompt {
  id: string;
  category: string;
  dimension: string;
  question: string;
  options: MoodOption[];
}

const moodOptions: MoodOption[] = [
  { label: "Happy", value: "Happy", score: 5 },
  { label: "Calm", value: "Calm", score: 4 },
  { label: "Neutral", value: "Neutral", score: 3 },
  { label: "Stressed", value: "Stressed", score: 2 },
  { label: "Sad", value: "Sad", score: 1 },
];

const positiveOptions: MoodOption[] = [
  { label: "Very well", value: "Very well", score: 5 },
  { label: "Well", value: "Well", score: 4 },
  { label: "Somewhat", value: "Somewhat", score: 3 },
  { label: "Not very well", value: "Not very well", score: 2 },
  { label: "Not at all", value: "Not at all", score: 1 },
];

const stressOptions: MoodOption[] = [
  { label: "Not at all", value: "Not at all", score: 5 },
  { label: "A little", value: "A little", score: 4 },
  { label: "Moderately", value: "Moderately", score: 3 },
  { label: "Quite a lot", value: "Quite a lot", score: 2 },
  { label: "Extremely", value: "Extremely", score: 1 },
];

const energyOptions: MoodOption[] = [
  { label: "Very energetic", value: "Very energetic", score: 5 },
  { label: "Energetic", value: "Energetic", score: 4 },
  { label: "Average", value: "Average", score: 3 },
  { label: "Low energy", value: "Low energy", score: 2 },
  { label: "Exhausted", value: "Exhausted", score: 1 },
];

const supportOptions: MoodOption[] = [
  { label: "Definitely", value: "Definitely", score: 5 },
  { label: "Mostly", value: "Mostly", score: 4 },
  { label: "Sometimes", value: "Sometimes", score: 3 },
  { label: "Rarely", value: "Rarely", score: 2 },
  { label: "Not at all", value: "Not at all", score: 1 },
];

const createQuestion = (
  id: string,
  category: string,
  dimension: string,
  question: string,
  options: MoodOption[]
): MoodPrompt => ({
  id,
  category,
  dimension,
  question,
  options,
});

type FollowUpQuestion = {
  category: string;
  dimension: string;
  question: string;
  options: MoodOption[];
};

const questionBanks: Record<string, FollowUpQuestion[]> = {
  Happy: [
    {
      category: "College Experience",
      dimension: "focus",
      question: "Did you enjoy any of your lectures, practicals or college activities today?",
      options: positiveOptions,
    },
    {
      category: "Achievements",
      dimension: "coping",
      question: "Did you accomplish something today that made you feel proud of yourself?",
      options: positiveOptions,
    },
    {
      category: "Friendships",
      dimension: "support",
      question: "Did you get to spend meaningful time with your friends or classmates?",
      options: supportOptions,
    },
    {
      category: "Academic Confidence",
      dimension: "focus",
      question: "How confident did you feel about your academic work today?",
      options: positiveOptions,
    },
    {
      category: "Personal Growth",
      dimension: "coping",
      question: "Did you do something today that helped you grow or learn something new?",
      options: positiveOptions,
    },
    {
      category: "Motivation",
      dimension: "energy",
      question: "Did you feel motivated to work towards your personal or academic goals?",
      options: positiveOptions,
    },
    {
      category: "Positive Moments",
      dimension: "mood",
      question: "Did you have a moment today that you would like to remember?",
      options: positiveOptions,
    },
  ],

  Calm: [
    {
      category: "Academic Balance",
      dimension: "stress",
      question: "How manageable did your lectures, assignments and deadlines feel today?",
      options: stressOptions,
    },
    {
      category: "Rest & Sleep",
      dimension: "energy",
      question: "Did you get enough rest to feel refreshed today?",
      options: energyOptions,
    },
    {
      category: "Concentration",
      dimension: "focus",
      question: "How easily could you concentrate during your classes or study time?",
      options: positiveOptions,
    },
    {
      category: "Personal Time",
      dimension: "coping",
      question: "Were you able to make time for yourself apart from college responsibilities?",
      options: positiveOptions,
    },
    {
      category: "Social Connection",
      dimension: "support",
      question: "Did you feel comfortable and connected with the people around you?",
      options: supportOptions,
    },
    {
      category: "Daily Routine",
      dimension: "coping",
      question: "How well did your daily routine work for you today?",
      options: positiveOptions,
    },
    {
      category: "Emotional Balance",
      dimension: "mood",
      question: "Were you able to maintain your sense of calm when something unexpected happened?",
      options: positiveOptions,
    },
  ],

  Neutral: [
    {
      category: "Academic Workload",
      dimension: "stress",
      question: "How manageable was your academic workload today?",
      options: stressOptions,
    },
    {
      category: "Classroom Experience",
      dimension: "focus",
      question: "How engaged did you feel during lectures, labs or study sessions?",
      options: positiveOptions,
    },
    {
      category: "Energy",
      dimension: "energy",
      question: "How would you describe your energy throughout the college day?",
      options: energyOptions,
    },
    {
      category: "Social Connection",
      dimension: "support",
      question: "Did you have a chance to interact with friends or classmates today?",
      options: supportOptions,
    },
    {
      category: "Motivation",
      dimension: "focus",
      question: "How motivated did you feel to complete your planned tasks?",
      options: positiveOptions,
    },
    {
      category: "Personal Wellbeing",
      dimension: "coping",
      question: "Did you get a chance to do something you personally enjoy today?",
      options: positiveOptions,
    },
    {
      category: "Daily Reflection",
      dimension: "mood",
      question: "Did anything happen today that affected your mood, even slightly?",
      options: positiveOptions,
    },
  ],

  Stressed: [
    {
      category: "Academic Pressure",
      dimension: "stress",
      question: "How much pressure did assignments, submissions or upcoming exams put on you today?",
      options: stressOptions,
    },
    {
      category: "Future Concerns",
      dimension: "stress",
      question: "How much have worries about placements, career decisions or your future affected you?",
      options: stressOptions,
    },
    {
      category: "Study Concentration",
      dimension: "focus",
      question: "How difficult was it to concentrate on your studies because of stress?",
      options: stressOptions,
    },
    {
      category: "Rest & Recovery",
      dimension: "energy",
      question: "How much has stress affected your sleep or energy levels?",
      options: stressOptions,
    },
    {
      category: "Support System",
      dimension: "support",
      question: "Did you have someone you felt comfortable talking to about what was bothering you?",
      options: supportOptions,
    },
    {
      category: "Managing Responsibilities",
      dimension: "coping",
      question: "How manageable did your college and personal responsibilities feel today?",
      options: stressOptions,
    },
    {
      category: "Taking a Break",
      dimension: "coping",
      question: "Were you able to take a break or do something relaxing when you needed it?",
      options: positiveOptions,
    },
  ],

  Sad: [
    {
      category: "Emotional Wellbeing",
      dimension: "mood",
      question: "Did something related to college, friendships or personal life make you feel low today?",
      options: positiveOptions,
    },
    {
      category: "Feeling Connected",
      dimension: "support",
      question: "Did you feel included and connected with your friends or classmates today?",
      options: supportOptions,
    },
    {
      category: "Academic Motivation",
      dimension: "focus",
      question: "How difficult was it to find the motivation to attend classes or complete your work?",
      options: stressOptions,
    },
    {
      category: "Energy & Rest",
      dimension: "energy",
      question: "How much did your mood affect your energy or willingness to do everyday activities?",
      options: stressOptions,
    },
    {
      category: "Support System",
      dimension: "support",
      question: "Was there someone you could openly share your feelings with today?",
      options: supportOptions,
    },
    {
      category: "Self-care",
      dimension: "coping",
      question: "Were you able to do at least one small thing to take care of yourself today?",
      options: positiveOptions,
    },
    {
      category: "Daily Challenges",
      dimension: "stress",
      question: "How difficult did today's responsibilities feel while you were feeling low?",
      options: stressOptions,
    },
  ],
};

const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function getDailyPrompts(
  date: Date = new Date(),
  selectedMood: string = ""
): MoodPrompt[] {
  const dayIndex = date.getDay();
  const day = dayNames[dayIndex];

  const firstQuestion = createQuestion(
    "daily-mood",
    "Overall Mood",
    "mood",
    "How are you feeling today?",
    moodOptions
  );

  if (!selectedMood || !questionBanks[selectedMood]) {
    return [firstQuestion];
  }

  const bank = questionBanks[selectedMood];

  // Rotate the follow-up questions across the week.
  const rotatedQuestions = [
    ...bank.slice(dayIndex),
    ...bank.slice(0, dayIndex),
  ];

  const followUps = rotatedQuestions.slice(0, 5).map((item, index) =>
    createQuestion(
      `${day}-${selectedMood.toLowerCase()}-${index + 1}`,
      item.category,
      item.dimension,
      item.question,
      item.options
    )
  );

  return [firstQuestion, ...followUps];
}
