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
  },

  // INDIVIDUAL FACE
  {
    icon: Camera,
    title: "Face Analysis",
    desc: "Analyze facial emotional cues and generate a wellbeing support score.",
    link: "/face-analysis",
  },

  // COMBINED FACE
  {
    icon: Camera,
    title: "Face + Self Assessment",
    desc: "Analyze facial emotional cues and combine them with self-assessment for final emotional wellbeing analysis.",
    link: "/face-combined",
  },

  // INDIVIDUAL VOICE
  {
    icon: AudioLines,
    title: "Voice Analysis",
    desc: "Analyze vocal emotional cues and generate a wellbeing support score.",
    link: "/voice-analysis",
  },

  // COMBINED VOICE
  {
    icon: AudioLines,
    title: "Voice + Self Assessment",
    desc: "Analyze vocal emotional cues and combine them with self-assessment for final emotional wellbeing analysis.",
    link: "/voice-combined",
  },

    // COMPLETE ANALYSIS
  {
    icon: Brain,
    title: "Complete Wellness Analysis",
    desc: "Generate an overall emotional wellbeing report by combining self assessment, facial emotional cues and voice analysis.",
    link: "/complete-analysis",
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
              <Link to="/assessment">
                <Button variant="hero" size="lg">
                  Start Self Assessment
                </Button>
              </Link>

              <Link to="/face-analysis">
                <Button variant="hero-outline" size="lg">
                  <Camera className="w-5 h-5" />
                  Face Analysis
                </Button>
              </Link>

              <Link to="/voice-analysis">
                <Button variant="hero-outline" size="lg">
                  <AudioLines className="w-5 h-5" />
                  Voice Analysis
                </Button>
              </Link>

              <Link to="/face-combined">
                <Button variant="hero-outline" size="lg">
                  <Camera className="w-5 h-5" />
                  Face + Self
                </Button>
              </Link>

             <Link to="/voice-combined">
  <Button variant="hero-outline" size="lg">
    <AudioLines className="w-5 h-5" />
    Voice + Self
  </Button>
</Link>


<Button
  variant="hero-outline"
  size="lg"
  onClick={() => {

    // Remove previous Complete Analysis data
    localStorage.removeItem("questionnaire_score");
    localStorage.removeItem("face_score");
    localStorage.removeItem("voice_score");

    localStorage.removeItem("assessmentSubmitted");
    localStorage.removeItem("assessmentResult");

    navigate("/complete-analysis");
  }}
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

      {/* FEATURE CARDS */}
      <section className="container mx-auto px-4 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: "-100px",
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link
                to={f.link}
                className="group block p-8 bg-card rounded-[24px] border border-transparent hover:border-primary/10 transition-all shadow-soft hover:shadow-float h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {f.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {f.desc}
                </p>

                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                  Explore <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* INFO SECTION */}
      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-[32px] bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">
            AI-Assisted Emotional Wellbeing Support
          </h2>

          <p className="text-muted-foreground leading-relaxed text-lg">
            Our platform combines self-assessment, facial emotional
            cues, vocal emotional cues, AI-based support chat, and
            journaling to provide a stigma-free emotional wellbeing
            support system for higher education students.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-5 border">
              <h3 className="font-semibold text-lg mb-2">
                Face Analysis
              </h3>

              <p className="text-sm text-muted-foreground">
                Detects facial emotional cues and provides emotional
                wellbeing support indicators.
              </p>
            </div>

            <div className="rounded-2xl bg-white/70 p-5 border">
              <h3 className="font-semibold text-lg mb-2">
                Voice Analysis
              </h3>

              <p className="text-sm text-muted-foreground">
                Detects vocal emotional cues and provides emotional
                wellbeing support indicators.
              </p>
            </div>

            <div className="rounded-2xl bg-white/70 p-5 border">
              <h3 className="font-semibold text-lg mb-2">
                Combined Wellbeing Analysis
              </h3>

              <p className="text-sm text-muted-foreground">
                Combines AI emotional cues with self-assessment for
                improved emotional wellbeing analysis.
              </p>
            </div>
          </div>
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