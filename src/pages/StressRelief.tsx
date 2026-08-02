import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Eye,
  Zap,
  X,
  ArrowLeft
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

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">

  <Button
    variant="outline"
    onClick={() => navigate(-1)}
  >

    <ArrowLeft className="mr-2 h-4 w-4" />

    Back to Assessment

  </Button>

</div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Stress Relief Tools</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Quick exercises to help you breathe, reset, and refocus.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-card rounded-[24px] shadow-soft hover:shadow-float transition-all border border-transparent hover:border-primary/10 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <tool.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
            <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{tool.desc}</p>
            <p className="text-xs text-primary font-medium mb-6">{tool.duration}</p>
            <Button variant="soft" onClick={() => setActiveIndex(i)} className="w-full">
              Start Exercise
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-[32px] shadow-float max-w-lg w-full p-10 relative"
            >
              <button onClick={() => setActiveIndex(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                {(() => { const Icon = tools[activeIndex].icon; return <Icon className="w-7 h-7 text-primary" />; })()}
              </div>
              <h2 className="text-2xl font-bold mb-2">{tools[activeIndex].title}</h2>
              <p className="text-primary text-sm font-medium mb-6">{tools[activeIndex].duration}</p>
              <ol className="space-y-4">
                {tools[activeIndex].instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 text-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Button className="w-full mt-8" onClick={() => setActiveIndex(null)}>
                Done — I feel better
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StressRelief;
