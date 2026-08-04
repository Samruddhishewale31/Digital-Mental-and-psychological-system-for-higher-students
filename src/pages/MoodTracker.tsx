import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Smile,
  Heart,
  Meh,
  Frown,
  CloudRain,
  Wind,
  BookOpen,
  UserRound,
  ArrowLeft,
  Home,
  Save,
  CheckCircle,
  CalendarDays,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const moods = [
  {
    name: "Happy",
    icon: <Smile className="w-8 h-8 text-yellow-500" />,
    color: "bg-yellow-50 border-yellow-300",
    message:
      "Wonderful! You're feeling happy today. Keep spreading positivity and celebrate even the small wins.",
    quote: "Happiness grows when it is shared.",
    activities: [
      "Spend time outdoors",
      "Listen to your favourite music",
      "Write 3 things you're grateful for",
      "Capture today's best moment",
    ],
  },

  {
    name: "Calm",
    icon: <Heart className="w-8 h-8 text-green-500" />,
    color: "bg-green-50 border-green-300",
    message:
      "You're feeling calm and balanced. Continue the habits that help you stay peaceful.",
    quote: "Peace begins with a deep breath.",
    activities: [
      "Practice meditation",
      "Read a book",
      "Enjoy a peaceful break",
      "Go for a nature walk",
    ],
  },

  {
    name: "Neutral",
    icon: <Meh className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-50 border-blue-300",
    message:
      "You're feeling neutral today. Small positive actions can improve your mood.",
    quote: "Every day is a fresh beginning.",
    activities: [
      "Listen to relaxing music",
      "Take a short walk",
      "Drink enough water",
      "Talk with a friend",
    ],
  },

  {
    name: "Stressed",
    icon: <CloudRain className="w-8 h-8 text-orange-500" />,
    color: "bg-orange-50 border-orange-300",
    message:
      "Academic pressure can feel overwhelming. Take one step at a time—you don't have to do everything at once.",
    quote: "Slow progress is still progress.",
    activities: [
      "Try the breathing exercise",
      "Take a 10-minute break",
      "Stretch your body",
      "Journal your thoughts",
    ],
  },

  {
    name: "Sad",
    icon: <Frown className="w-8 h-8 text-red-500" />,
    color: "bg-red-50 border-red-300",
    message:
      "It's okay to have difficult days. Your feelings are valid, and you don't have to face them alone.",
    quote: "One small step today is enough.",
    activities: [
      "Practice deep breathing",
      "Write how you're feeling",
      "Talk to someone you trust",
      "Go outside for fresh air",
    ],
  },
];
const MoodTracker = () => {
  const navigate = useNavigate();
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}, []);

  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [reflection, setReflection] = useState("");

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("moodHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [saved, setSaved] = useState(false);

  const saveMood = () => {
    if (!selectedMood) return;

    const entry = {
      mood: selectedMood.name,
      reflection,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const updated = [entry, ...history];

    setHistory(updated);

    localStorage.setItem(
      "moodHistory",
      JSON.stringify(updated)
    );

    setReflection("");
    setSaved(true);
  };

  return (
    <div className="container mx-auto px-5 py-12 flex justify-center">
      <div className="max-w-4xl w-full bg-card rounded-3xl shadow-lg p-10">

        {/* Back Button */}

        <div className="mb-8">
          <Button
  variant="outline"
  onClick={() =>
    navigate("/assessment", {
      state: {
        fromAssessment: true,
      },
    })
  }
>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Back to Assessment
</Button>
        </div>

        {/* Header */}

        <div className="text-center">

          <div className="flex justify-center mb-4">
            <Smile className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-bold">
            Daily Mood Tracker
          </h1>

          <p className="mt-3 text-muted-foreground">
            Take a moment to check in with yourself.
            Your emotions matter.
          </p>

        </div>

        {/* Mood Selection */}

        <div className="mt-10">

          <h2 className="text-xl font-semibold text-center mb-5">
            How are you feeling today?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

            {moods.map((mood) => (

              <button
                key={mood.name}
                onClick={() => {
                  setSelectedMood(mood);
                  setSaved(false);
                }}
                className={`border rounded-2xl p-5 transition-all hover:shadow-md ${
                  selectedMood?.name === mood.name
                    ? mood.color
                    : "bg-white"
                }`}
              >

                <div className="flex justify-center">
                  {mood.icon}
                </div>

                <h3 className="mt-3 font-semibold">
                  {mood.name}
                </h3>

              </button>

            ))}

          </div>

        </div>
                {selectedMood && (

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl bg-muted p-8"
          >

            <h2 className="text-2xl font-bold flex items-center gap-3">

              {selectedMood.icon}

              {selectedMood.name}

            </h2>

            <p className="mt-4 leading-7">

              {selectedMood.message}

            </p>

            {/* Quote */}

            <div className="mt-8">

              <h3 className="font-semibold text-lg flex items-center">

                <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />

                Daily Quote

              </h3>

              <p className="italic mt-3">

                "{selectedMood.quote}"

              </p>

            </div>

            {/* Activities */}

            <div className="mt-8">

              <h3 className="font-semibold text-lg flex items-center">

                <Wind className="mr-2 h-5 w-5 text-cyan-500" />

                Recommended Activities

              </h3>

              <ul className="list-disc pl-6 mt-4 space-y-2">

                {selectedMood.activities.map(
                  (activity: string, index: number) => (

                    <li key={index}>

                      {activity}

                    </li>

                  )
                )}

              </ul>

            </div>

            {/* Quick Support */}

            {(selectedMood.name === "Stressed" ||
              selectedMood.name === "Sad") && (

              <div className="mt-10">

                <h3 className="font-semibold text-lg mb-4">

                  Need a little support?

                </h3>

                <div className="grid md:grid-cols-3 gap-4">

                  <Button
                    onClick={() => navigate("/stress-relief")}
                  >

                    <Wind className="mr-2 h-4 w-4" />

                    Stress Relief

                  </Button>

                  <Button
                    onClick={() => navigate("/journal")}
                  >

                    <BookOpen className="mr-2 h-4 w-4" />

                    Journal

                  </Button>

                  <Button
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
                {/* Reflection */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold flex items-center">

            <BookOpen className="mr-2 h-6 w-6 text-primary" />

            Today's Reflection

          </h2>

          <p className="text-muted-foreground mt-2">

            Write a few words about how your day went.

          </p>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="How was your day today?"
            className="w-full mt-4 h-36 rounded-xl border p-4 resize-none"
          />

        </div>

        {/* Save Button */}

        <div className="mt-8">

          <Button
            disabled={!selectedMood}
            onClick={saveMood}
          >

            <Save className="mr-2 h-4 w-4" />

            Save Today's Mood

          </Button>

        </div>

        {/* Success Message */}

        {saved && (

          <div className="mt-6 rounded-xl border border-green-300 bg-green-100 p-5">

            <h3 className="font-bold text-green-700 flex items-center">

              <CheckCircle className="mr-2 h-5 w-5" />

              Mood Saved Successfully

            </h3>

            <p className="mt-2">

              Thank you for checking in today. Every mood matters and
              tracking them helps you understand your emotional wellbeing.

            </p>

          </div>

        )}

        {/* Mood History */}

        {history.length > 0 && (

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5 flex items-center">

              <CalendarDays className="mr-2 h-6 w-6 text-primary" />

              Mood History

            </h2>

            <div className="space-y-4">

              {history.map((item, index) => (

                <div
                  key={index}
                  className="rounded-2xl border p-5"
                >

                  <div className="flex justify-between">

                    <strong>{item.mood}</strong>

                    <span>{item.date}</span>

                  </div>

                  <p className="text-sm text-muted-foreground">

                    {item.time}

                  </p>

                  <p className="mt-3">

                    {item.reflection || "No reflection written."}

                  </p>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* Reminder */}

        <div className="mt-10 rounded-2xl bg-muted p-6">

          <h2 className="text-xl font-bold flex items-center">

            <HeartHandshake className="mr-2 h-6 w-6 text-primary" />

            Mental Wellness Reminder

          </h2>

          <p className="mt-3 leading-7">

            Emotional ups and downs are a normal part of life.
            Regularly checking in with your emotions helps you identify
            patterns and take care of your mental wellbeing.

            If you're feeling overwhelmed for a prolonged period,
            don't hesitate to seek support from someone you trust
            or a mental health professional.

          </p>

        </div>

        {/* Bottom Buttons */}

        <div className="mt-10 flex justify-center gap-4">

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >

            <ArrowLeft className="mr-2 h-4 w-4" />

            Back to Assessment

          </Button>

          <Button
            onClick={() => navigate("/")}
          >

            <Home className="mr-2 h-4 w-4" />

            Back Home

          </Button>

        </div>

      </div>

    </div>

  );

};

export default MoodTracker;
