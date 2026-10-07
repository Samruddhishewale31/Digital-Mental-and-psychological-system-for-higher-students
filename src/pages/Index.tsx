import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  MessageCircle,
  BookOpen,
  Wind,
  CalendarCheck,
  ArrowRight,
  Camera,
  AudioLines,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

const features = [

  {
    icon: ClipboardCheck,
    title: "Self Assessment",
    desc: "Understand your stress levels with clinically-inspired screening tools.",
    link: "/assessment",
    assessmentType: "self",
  },

  {
    icon: Camera,
    title: "Face Analysis",
    desc: "Analyze facial emotional cues and generate a wellbeing support score.",
    link: "/face-analysis",
    assessmentType: "face",
  },
  
  {
    icon: Camera,
    title: "Face + Self Assessment",
    desc: "Analyze facial emotional cues and combine them with self-assessment for final emotional wellbeing analysis.",
    link: "/face-combined",
    assessmentType: "face-self",
  },
  {
    icon: AudioLines,
    title: "Voice Analysis",
    desc: "Analyze vocal emotional cues and generate a wellbeing support score.",
    link: "/voice-analysis",
    assessmentType: "voice",
  },
  {
    icon: AudioLines,
    title: "Voice + Self Assessment",
    desc: "Analyze vocal emotional cues and combine them with self-assessment for final emotional wellbeing analysis.",
    link: "/voice-combined",
    assessmentType: "voice-self",
  },
  {
    icon: Brain,
    title: "Complete Wellness Analysis",
    desc: "Generate an overall emotional wellbeing report by combining self assessment, facial emotional cues and voice analysis.",
    link: "/complete-analysis",
    assessmentType: "complete",
  },
  {
    icon: MessageCircle,
    title: "AI Chat Support",
    desc: "Immediate, anonymous guidance whenever you need it.",
    link: "/chat",
  },
  {
    icon: BookOpen,
    title: "Personal Journal",
    desc: "A quiet space for your thoughts. Write whenever you're ready.",
    link: "/journal",
  },
  {
    icon: Wind,
    title: "Stress Relief",
    desc: "Breathing exercises and mindfulness activities to reset your focus.",
    link: "/stress-relief",
  },
  {
    icon: CalendarCheck,
    title: "Counselling",
    desc: "Book confidential sessions with campus counsellors.",
    link: "/counselling",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1] as [
        number,
        number,
        number,
        number
      ],
    },
  },
};

const Index = () => {
  
  const navigate = useNavigate();

  const handleAssessmentSelect = (assessmentType: string) => {
    navigate("/informed-consent", {
      state: {
        assessmentType: assessmentType,
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
            <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <p className="text-primary font-semibold mb-4 text-sm tracking-wide uppercase">
              Student Wellness Platform
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-balance mb-6">
              Your safe space for{" "}
              <span className="text-gradient">
                student wellness.
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Manage stress, track emotions, analyze emotional
              wellbeing cues, and get the support you need during
              your academic journey.
            </p>

            <div className="flex flex-wrap gap-4">

              {/* SELF ASSESSMENT */}
              <Button
                variant="hero"
                size="lg"
                onClick={() => handleAssessmentSelect("self")}
              >
                Start Self Assessment
              </Button>
                
               <Button
  variant="hero-outline"
  size="lg"
  onClick={() => navigate("/wellness")}
>
  <Brain className="w-5 h-5" />
  My Wellness
</Button>

              {/* FACE ANALYSIS */}
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => handleAssessmentSelect("face")}
              >
                <Camera className="w-5 h-5" />
                Face Analysis
              </Button>

              {/* VOICE ANALYSIS */}
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => handleAssessmentSelect("voice")}
              >
                <AudioLines className="w-5 h-5" />
                Voice Analysis
              </Button>

              {/* FACE + SELF */}
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => handleAssessmentSelect("face-self")}
              >
                <Camera className="w-5 h-5" />
                Face + Self
              </Button>

              {/* VOICE + SELF */}
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => handleAssessmentSelect("voice-self")}
              >
                <AudioLines className="w-5 h-5" />
                Voice + Self
              </Button>

              {/* COMPLETE ANALYSIS */}
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => handleAssessmentSelect("complete")}
              >
                <Brain className="w-5 h-5" />
                Complete Analysis
              </Button>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-[32px] blur-3xl" />

            <img
              src={heroImage}
              alt="Students relaxing and meditating in a peaceful setting"
              className="relative rounded-[32px] shadow-float w-full"
            />
          </motion.div>

        </div>
              </section>

      

      {/* FOOTER QUOTE */}
      <section className="container mx-auto px-4 pb-24 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-lg italic"
        >
          "Take a deep breath, you're doing great." 🌿
        </motion.p>
      </section>

    </div>
  );
};

export default Index;