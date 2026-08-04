import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Eye,
  Zap,
  X,
  ArrowLeft,
  Music,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: Wind,
    title: "Guided Breathing Exercise",
    desc: "A simple 4-7-8 breathing technique to calm your nervous system in minutes.",
    duration: "2 minutes",
    instructions: [
      "Find a comfortable position and close your eyes.",
      "Breathe in slowly through your nose for 4 seconds.",
      "Hold your breath gently for 7 seconds.",
      "Exhale slowly through your mouth for 8 seconds.",
      "Repeat this cycle 4 times.",
      "Notice how your body feels more relaxed with each breath.",
    ],
  },

  {
    icon: Eye,
    title: "2-Minute Mindfulness",
    desc: "Ground yourself in the present moment with this quick body scan.",
    duration: "2 minutes",
    instructions: [
      "Sit comfortably and take a deep breath.",
      "Notice 5 things you can see around you.",
      "Notice 4 things you can physically feel.",
      "Notice 3 things you can hear.",
      "Notice 2 things you can smell.",
      "Notice 1 thing you can taste.",
      "Take a final deep breath. You're here. You're present.",
    ],
  },

  {
    icon: Zap,
    title: "Focus Reset Activity",
    desc: "Quick mental reset to regain clarity before studying.",
    duration: "3 minutes",
    instructions: [
      "Stand up and stretch your arms overhead for 10 seconds.",
      "Roll your shoulders backward 5 times, then forward 5 times.",
      "Close your eyes and take 5 slow, deep breaths.",
      "Write down the ONE thing you want to accomplish next.",
      "Set a timer for 25 minutes and begin — just one focused block.",
      "You've got this. One step at a time.",
    ],
  },
];

  const StressRelief = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">

      {/* Top Buttons */}

      <div className="flex justify-between items-center flex-wrap gap-4 mb-12">

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

        <Button
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Back Home
        </Button>

      </div>

      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >

        <h1 className="text-4xl font-bold mb-4">
          Stress Relief Exercises
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Practice quick breathing, mindfulness and focus exercises to
          relax your mind and improve concentration.
        </p>

      </motion.div>

      {/* Exercise Cards */}

     <div className="grid md:grid-cols-3 gap-8 mb-16">

  

        {tools.map((tool, i) => (

          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-card rounded-[28px] shadow-soft hover:shadow-float transition-all border hover:border-primary/20 p-8 text-center"
          >

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">

              <tool.icon className="w-8 h-8 text-primary" />

            </div>

            <h3 className="text-xl font-semibold mb-3">
              {tool.title}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-4">
              {tool.desc}
            </p>

            <p className="text-primary text-sm font-medium mb-6">
              {tool.duration}
            </p>

            <Button
              className="w-full"
              onClick={() => setActiveIndex(i)}
            >
              Start Exercise
            </Button>

          </motion.div>

        ))}

      </div>

      <hr className="my-14 border-border" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <h2 className="text-3xl font-bold text-center mb-4">
Additional Wellness Resources
</h2>

       <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
Need more support? Explore guided relaxation videos and peaceful music to help reduce stress and improve focus.
</p>

        <div className="grid md:grid-cols-2 gap-8">

  {/* Stress Relief Videos Card */}

  <motion.div
            whileHover={{ y: -5 }}
            className="bg-card rounded-[28px] shadow-soft hover:shadow-float transition-all border hover:border-primary/20 p-8 text-center"
          >

            <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6">
              <Wind className="w-10 h-10 text-cyan-600" />
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Guided Stress Relief Videos
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Watch guided breathing, meditation and relaxation exercises
              whenever you feel stressed or overwhelmed.
            </p>

            <Button
              className="w-full py-6"
              onClick={() => navigate("/stress-relief-videos")}
            >
              Open Videos
            </Button>

          </motion.div>

          {/* Calming Music Card */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-card rounded-[28px] shadow-soft border p-8 text-center"
          >

            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Calming Music
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Relax with peaceful instrumental music and soothing nature
              sounds whenever you need a break.
            </p>

            <Button
  className="w-full py-6"
  onClick={() => navigate("/relaxing-music")}
>
  Open Music
</Button>

          </motion.div>

        </div>

      </motion.div>


      {/* Exercise Modal */}

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-[32px] shadow-float max-w-lg w-full p-10 relative"
            >
              <button
                onClick={() => setActiveIndex(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                {(() => {
                  const Icon = tools[activeIndex].icon;
                  return <Icon className="w-8 h-8 text-primary" />;
                })()}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {tools[activeIndex].title}
              </h2>

              <p className="text-primary text-sm font-medium mb-6">
                {tools[activeIndex].duration}
              </p>

              <ol className="space-y-4">
                {tools[activeIndex].instructions.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-foreground leading-relaxed"
                  >
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </span>

                    {step}
                  </li>
                ))}
              </ol>

              <Button
                className="w-full mt-8"
                onClick={() => setActiveIndex(null)}
              >
                Done — I Feel Better
              </Button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StressRelief;