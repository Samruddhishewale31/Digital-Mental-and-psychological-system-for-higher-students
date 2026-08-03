import {
  Wind,
  BookOpen,
  Smile,
  Music,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export const recommendations = {

  "Minimal Risk": [

    {
      title: "Calming Music",
      description:
        "Listen to calming music or nature sounds to maintain emotional wellbeing.",
      icon: <Music size={40} className="text-blue-500" />,
      link: "/relaxing-music",
    },

    {
      title: "Mood Tracker",
      description:
        "Track your mood regularly to stay aware of emotional changes.",
      icon: <Smile size={40} className="text-green-500" />,
      link: "/mood-tracker",
    },

    {
      title: "Stress Relief Exercises",
      description:
        "Watch guided breathing and relaxation exercises to stay calm and focused.",
      icon: <Wind size={40} className="text-cyan-500" />,
      link: "/stress-relief-videos",
    },

  ],

  "Mild Risk": [

    {
      title: "Stress Relief Exercises",
      description:
        "Watch guided breathing and relaxation exercises to reduce stress.",
      icon: <Wind size={40} className="text-cyan-500" />,
      link: "/stress-relief-videos",
    },

    {
      title: "Journal",
      description:
        "Write about your thoughts and emotions to improve self-awareness.",
      icon: <BookOpen size={40} className="text-orange-500" />,
      link: "/journal",
    },

    {
      title: "Mood Tracker",
      description:
        "Monitor your emotions daily and identify patterns.",
      icon: <Smile size={40} className="text-green-500" />,
      link: "/mood-tracker",
    },

    {
      title: "Calming Music",
      description:
        "Spend a few minutes listening to calming music.",
      icon: <Music size={40} className="text-blue-500" />,
      link: "/relaxing-music",
    },

  ],

  "Moderate Risk": [

    {
      title: "Guided Stress Relief Videos",
      description:
        "Watch guided breathing and relaxation videos to help reduce stress.",
      icon: <Wind size={40} className="text-cyan-500" />,
      link: "/stress-relief-videos",
    },

    {
      title: "AI Support Chat",
      description:
        "Talk to our AI assistant for emotional support and coping suggestions.",
      icon: <MessageCircle size={40} className="text-purple-500" />,
      link: "/chatbot",
    },

    {
      title: "Journal",
      description:
        "Express your feelings and organize your thoughts.",
      icon: <BookOpen size={40} className="text-orange-500" />,
      link: "/journal",
    },

    {
      title: "Mood Tracker",
      description:
        "Track emotional changes over time.",
      icon: <Smile size={40} className="text-green-500" />,
      link: "/mood-tracker",
    },

  ],

  "High Risk": [

    {
      title: "Professional Counselling",
      description:
        "We strongly recommend speaking with a qualified mental health professional.",
      icon: <ShieldCheck size={40} className="text-red-600" />,
      link: "/counselling",
    },

    {
      title: "AI Support Chat",
      description:
        "Talk with our AI assistant whenever you need immediate emotional support.",
      icon: <MessageCircle size={40} className="text-purple-500" />,
      link: "/chatbot",
    },

    {
      title: "Guided Stress Relief Videos",
      description:
        "Watch guided breathing and relaxation videos whenever you feel overwhelmed.",
      icon: <Wind size={40} className="text-cyan-500" />,
      link: "/stress-relief-videos",
    },

    {
      title: "Journal",
      description:
        "Write down your thoughts and emotions to help process your feelings.",
      icon: <BookOpen size={40} className="text-orange-500" />,
      link: "/journal",
    },

    {
      title: "Calming Music",
      description:
        "Listen to calming music to help reduce stress and anxiety.",
      icon: <Music size={40} className="text-blue-500" />,
      link: "/relaxing-music",
    },

  ],

};