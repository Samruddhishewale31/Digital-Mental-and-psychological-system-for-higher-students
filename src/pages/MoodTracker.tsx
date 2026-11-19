import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { getDailyPrompts, MoodPrompt } from "@/data/moodPrompts";
import { authenticatedRequest } from "@/auth/authService";

import {
  Smile,
  Heart,
  Meh,
  Frown,
  CloudRain,
  ArrowLeft,
  Home,
  Save,
  CheckCircle,
  CalendarDays,
  Sparkles,
  HeartHandshake,
  BookOpen,
  UserRound,
  Wind,
  ChevronLeft,
  ChevronRight,
  Activity,
  Brain,
  Battery,
  Users,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type MoodOptionIcon = {
  name: string;
  icon: React.ReactNode;
  color: string;
};

const moodIcons: Record<string, MoodOptionIcon> = {
  Happy: {
    name: "Happy",
    icon: <Smile className="h-6 w-6" />,
    color: "text-yellow-600",
  },
  Calm: {
    name: "Calm",
    icon: <Heart className="h-6 w-6" />,
    color: "text-green-600",
  },
  Neutral: {
    name: "Neutral",
    icon: <Meh className="h-6 w-6" />,
    color: "text-blue-600",
  },
  Stressed: {
    name: "Stressed",
    icon: <CloudRain className="h-6 w-6" />,
    color: "text-orange-600",
  },
  Sad: {
    name: "Sad",
    icon: <Frown className="h-6 w-6" />,
    color: "text-red-600",
  },
};

const dimensionIcons: Record<string, React.ReactNode> = {
  mood: <Smile className="h-5 w-5" />,
  stress: <Activity className="h-5 w-5" />,
  energy: <Battery className="h-5 w-5" />,
  focus: <Target className="h-5 w-5" />,
  support: <Users className="h-5 w-5" />,
  coping: <Brain className="h-5 w-5" />,
};

const MoodTracker = () => {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<string, string>>({});

const selectedMood = answers["daily-mood"] || "";

const dailyPrompts = useMemo(
  () => getDailyPrompts(new Date(), selectedMood),
  [selectedMood]
);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reflection, setReflection] = useState("");

  const [history, setHistory] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState("");

  const currentPrompt = dailyPrompts[currentQuestion];
  const allAnswered = dailyPrompts.every(
    (prompt) => Boolean(answers[prompt.id])
  );

  const progress = ((currentQuestion + 1) / dailyPrompts.length) * 100;

  const analysis = useMemo(() => {
    const scores = dailyPrompts
      .map((prompt) => {
        const selectedOption = prompt.options.find(
          (option) => option.value === answers[prompt.id]
        );

        return selectedOption?.score;
      })
      .filter((score): score is number => score !== undefined);

    if (scores.length !== dailyPrompts.length) {
      return null;
    }

    const average =
      scores.reduce((total, score) => total + score, 0) / scores.length;

    const roundedScore = Math.round(average * 10) / 10;

    let level = "Needs Attention";
    let description =
      "Some parts of your day may have felt challenging. Consider taking time to rest and seek support if needed.";

    if (average >= 4.2) {
      level = "Positive";
      description =
        "Your responses indicate a generally positive day. Continue the habits that support your wellbeing.";
    } else if (average >= 3.4) {
      level = "Balanced";
      description =
        "Your responses suggest a fairly balanced day, with some areas that may benefit from attention.";
    } else if (average >= 2.6) {
      level = "Moderate";
      description =
        "Your day may have included some challenges. Small breaks and supportive activities may help.";
    }

    return {
      score: roundedScore,
      level,
      description,
      dimensions: dailyPrompts.map((prompt) => {
        const option = prompt.options.find(
          (item) => item.value === answers[prompt.id]
        );

        return {
          name: prompt.category,
          dimension: prompt.dimension,
          answer: answers[prompt.id],
          score: option?.score ?? 0,
        };
      }),
    };
  }, [answers, dailyPrompts]);

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }, []);

  useEffect(() => {
    const loadMoodData = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const [todayResult, historyResult] = await Promise.all([
          authenticatedRequest<{
            success: boolean;
            entry: any | null;
          }>("/api/mood/today"),

          authenticatedRequest<{
            success: boolean;
            entries: any[];
          }>("/api/mood"),
        ]);

        const formattedHistory = (historyResult.entries || []).map(
          (entry: any) => {
            const storedAnswers = entry.responses?.answers || {};

            return {
              id: entry.id,
              mood: entry.mood_label,
              reflection: entry.note,
              responses: storedAnswers,
              prompts: entry.responses?.prompts || [],
              analysis: storedAnswers.__analysis || null,
              date: new Date(entry.recorded_at).toLocaleDateString(),
              time: new Date(entry.recorded_at).toLocaleTimeString(),
              timestamp: entry.recorded_at,
            };
          }
        );

        setHistory(formattedHistory);

        if (todayResult.entry) {
          const entry = todayResult.entry;
          const storedAnswers = entry.responses?.answers || {};

          const cleanAnswers = { ...storedAnswers };
          delete cleanAnswers.__analysis;

          setAnswers(cleanAnswers);
          setReflection(entry.note || "");
          setSaved(true);
        }
      } catch (error) {
        console.error("Unable to load mood data:", error);

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load your mood history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMoodData();
  }, []);

  const handleAnswer = (promptId: string, value: string) => {
  if (promptId === "daily-mood") {
    setAnswers({ "daily-mood": value });
    setCurrentQuestion(0);
  } else {
    setAnswers((previous) => ({
      ...previous,
      [promptId]: value,
    }));
  }

  setSaved(false);
};

 const handleNext = () => {
  if (!answers[currentPrompt.id]) {
    return;
  }

  if (currentQuestion < dailyPrompts.length - 1) {
    setCurrentQuestion((previous) => previous + 1);
  }
};

  const handlePrevious = () => {
  if (currentQuestion > 0) {
    setCurrentQuestion((previous) => previous - 1);
  }
};

  const saveMood = async () => {
    if (!allAnswered || !selectedMood || !analysis || saving) {
      return;
    }

    setSaving(true);

    try {
      const responsesToSave = Object.fromEntries(
  Object.entries(answers)
    .filter(([key]) => key !== "__analysis")
    .map(([key, value]) => [key, String(value)])
);

      const result = await authenticatedRequest<{
        success: boolean;
        message: string;
        entry: any;
      }>("/api/mood", {
        method: "POST",
        body: JSON.stringify({
  mood: selectedMood,
  note: reflection,
  responses: responsesToSave,
  prompts: dailyPrompts.map((prompt) => ({
    id: prompt.id,
    category: prompt.category,
    question: prompt.question,
  })),
}),
      });

      const entry = result.entry;

      const savedEntry = {
        id: entry.id,
        mood: entry.mood_label,
        reflection: entry.note,
        responses: entry.responses?.answers || responsesToSave,
        prompts: entry.responses?.prompts || dailyPrompts,
        analysis:
          entry.responses?.answers?.__analysis || analysis,
        date: new Date(entry.recorded_at).toLocaleDateString(),
        time: new Date(entry.recorded_at).toLocaleTimeString(),
        timestamp: entry.recorded_at,
      };

      setHistory((previous) => [
        savedEntry,
        ...previous.filter((item) => item.id !== savedEntry.id),
      ]);

      setSaved(true);
    } catch (error) {
      console.error("Save mood error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save your mood. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getDayLabel = () =>
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">

        {/* Navigation */}

        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Page Header */}

        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
              <Activity className="h-9 w-9" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Daily Mood Assessment
          </h1>

          <p className="mt-3 text-muted-foreground">
            Take a moment to understand how you are feeling today.
          </p>

          <p className="mt-2 text-sm font-medium text-primary">
            {getDayLabel()}
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">
              Loading your mood assessment...
            </p>
          </div>
        )}

        {/* Load Error */}

        {!loading && loadError && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {!loading && (
          <>
            {/* Assessment Card */}

            <motion.div
  key={currentPrompt.id}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.15 }}
  className="rounded-3xl border bg-card p-6 shadow-sm md:p-10"
>
              {/* Progress */}

              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    Daily Check-in
                  </span>

                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {dailyPrompts.length}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question Category */}

              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  {dimensionIcons[currentPrompt.dimension] || (
                    <Activity className="h-5 w-5" />
                  )}
                </div>

                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {currentPrompt.category}
                </span>
              </div>

              {/* Question */}

              <h2 className="mb-3 text-2xl font-bold leading-snug md:text-3xl">
                {currentPrompt.question}
              </h2>

              <p className="mb-8 text-sm text-muted-foreground">
                Select the option that best describes your experience today.
              </p>

              {/* Answer Options */}

              <div className="grid gap-3">
                {currentPrompt.options.map((option) => {
                  const isSelected =
                    answers[currentPrompt.id] === option.value;

                  const moodIcon = moodIcons[option.value];

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleAnswer(currentPrompt.id, option.value)
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all hover:border-primary hover:bg-primary/5 ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {moodIcon ? (
                          <span className={moodIcon.color}>
                            {moodIcon.icon}
                          </span>
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                            {option.score}
                          </span>
                        )}

                        <span className="font-medium">
                          {option.label}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}

              <div className="mt-10 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>

                {currentQuestion < dailyPrompts.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!answers[currentPrompt.id]}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={saveMood}
                    disabled={!allAnswered || saving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Submit Assessment"}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Optional Reflection */}

            {allAnswered && (
              <div className="mt-8 rounded-2xl border bg-card p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />

                  <div>
                    <h2 className="text-xl font-bold">
                      Additional Reflection
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Optional. Share anything else about your day.
                    </p>
                  </div>
                </div>

                <textarea
                  value={reflection}
                  onChange={(event) => {
                    setReflection(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="Is there anything else you would like to share?"
                  maxLength={1000}
                  rows={3}
                  className="w-full resize-none rounded-xl border bg-background p-4 outline-none transition focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Assessment Result */}

            {saved && analysis && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border bg-card p-6 md:p-8"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-3 text-green-700">
                    <CheckCircle className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      Your Daily Mood Analysis
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Your responses have been saved successfully.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-muted p-5">
                    <p className="text-sm text-muted-foreground">
                      Daily Wellbeing Score
                    </p>

                    <p className="mt-2 text-4xl font-bold text-primary">
                      {analysis.score}
                      <span className="text-lg font-medium text-muted-foreground">
                        {" "}/ 5
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-muted p-5">
                    <p className="text-sm text-muted-foreground">
                      Overall Indicator
                    </p>

                    <p className="mt-3 text-2xl font-bold">
                      {analysis.level}
                    </p>
                  </div>
                </div>

                <p className="mt-5 leading-7 text-muted-foreground">
                  {analysis.description}
                </p>

                <div className="mt-7">
                  <h3 className="mb-4 font-semibold">
                    Your Daily Indicators
                  </h3>

                  <div className="space-y-4">
                    {analysis.dimensions.map((item: any) => (
                      <div key={item.dimension}>
                        <div className="mb-2 flex justify-between gap-3 text-sm">
                          <span className="font-medium">
                            {item.name}
                          </span>

                          <span className="text-muted-foreground">
                            {item.answer}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${(item.score / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-xs leading-5 text-muted-foreground">
                  This score is a simple project-based wellbeing indicator
                  derived from your selected responses. It is not a clinical
                  assessment or medical diagnosis.
                </p>

                {(selectedMood === "Stressed" ||
                  selectedMood === "Sad") && (
                  <div className="mt-7 rounded-xl border p-5">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold">
                      <HeartHandshake className="h-5 w-5 text-primary" />
                      Supportive Resources
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/stress-relief")}
                      >
                        <Wind className="mr-2 h-4 w-4" />
                        Stress Relief
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => navigate("/journal")}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Journal
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => navigate("/counselling")}
                      >
                        <UserRound className="mr-2 h-4 w-4" />
                        Counselling
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Mood History */}

            {history.length > 0 && (
              <div className="mt-12">
                <div className="mb-6 flex items-center gap-3">
                  <CalendarDays className="h-7 w-7 text-primary" />

                  <div>
                    <h2 className="text-2xl font-bold">
                      Mood History
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Review your previous daily check-ins.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {history.map((item) => {
                    const icon = moodIcons[item.mood];

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border bg-card p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={icon?.color || "text-primary"}>
                              {icon?.icon || (
                                <Activity className="h-6 w-6" />
                              )}
                            </span>

                            <div>
                              <p className="font-semibold">
                                {item.mood}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {item.date} · {item.time}
                              </p>
                            </div>
                          </div>

                          {item.analysis?.score !== undefined && (
                            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                              {item.analysis.score}/5
                            </div>
                          )}
                        </div>

                        {item.prompts?.length > 0 && (
                          <div className="mt-5 space-y-3 border-t pt-4">
                            {item.prompts.map((prompt: any) => (
                              <div key={prompt.id}>
                                <p className="text-sm font-medium">
                                  {prompt.question}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                  {item.responses?.[prompt.id] ||
                                    "Not answered"}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.reflection && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-sm font-semibold">
                              Additional Reflection
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.reflection}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Wellness Reminder */}

            <div className="mt-10 rounded-2xl bg-muted p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <HeartHandshake className="h-5 w-5 text-primary" />
                A Gentle Reminder
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Your emotions can change from day to day. There are no right
                or wrong answers in this check-in. Use your results as an
                opportunity to understand your patterns, not as a judgement
                of yourself.
              </p>
            </div>

            {/* Bottom Navigation */}

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/home")}
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
