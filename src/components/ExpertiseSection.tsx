import { motion } from "framer-motion";

import {
  Brain,
  HeartHandshake,
  BadgeCheck,
  Users,
  Languages,
  Sparkles,
} from "lucide-react";

import { Counsellor } from "@/data/counsellors";

interface Props {
  counsellor: Counsellor;
}

const therapyMethods = [
  "Cognitive Behaviour Therapy (CBT)",
  "Mindfulness-Based Therapy",
  "Solution Focused Counselling",
  "Stress Management",
  "Emotion Regulation",
  "Positive Psychology",
];

const ageGroups = [
  "College Students",
  "Young Adults",
  "Adults",
];

export default function ExpertiseSection({
  counsellor,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.4,
      }}
      className="mt-8 rounded-3xl bg-white border shadow-sm p-8"
    >
      {/* Heading */}

      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">

          <Brain className="text-purple-700" />

        </div>

        <div>

          <h2 className="text-2xl font-bold">

            Areas of Expertise

          </h2>

          <p className="text-gray-500">

            Specialized counselling services and therapy areas

          </p>

        </div>

      </div>

      {/* Expertise */}

      <div className="mt-8">

        <h3 className="font-semibold text-lg mb-5">

          Expertise

        </h3>

        <div className="flex flex-wrap gap-3">

          {counsellor.expertise.map((item) => (

            <div
              key={item}
              className="rounded-full bg-purple-100 text-purple-700 px-5 py-2 font-medium"
            >
              {item}
            </div>

          ))}

        </div>

      </div>

      {/* Therapy */}

      <div className="mt-10">

        <div className="flex items-center gap-3 mb-5">

          <HeartHandshake className="text-purple-700" />

          <h3 className="text-xl font-semibold">

            Therapy Techniques

          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {therapyMethods.map((therapy) => (

            <div
              key={therapy}
              className="rounded-2xl border bg-gray-50 p-5"
            >

              <div className="flex items-center gap-3">

                <BadgeCheck
                  size={18}
                  className="text-green-600"
                />

                <span className="font-medium">

                  {therapy}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Languages */}

      <div className="mt-10">

        <div className="flex items-center gap-3 mb-5">

          <Languages className="text-purple-700" />

          <h3 className="text-xl font-semibold">

            Consultation Languages

          </h3>

        </div>

        <div className="flex flex-wrap gap-3">

          {counsellor.languages.map((language) => (

            <div
              key={language}
              className="rounded-full bg-blue-100 text-blue-700 px-5 py-2 font-medium"
            >
              {language}
            </div>

          ))}

        </div>

      </div>

      {/* Age Groups */}

      <div className="mt-10">

        <div className="flex items-center gap-3 mb-5">

          <Users className="text-purple-700" />

          <h3 className="text-xl font-semibold">

            Age Groups Served

          </h3>

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          {ageGroups.map((group) => (

            <div
              key={group}
              className="rounded-2xl border bg-gray-50 p-5 text-center"
            >

              <p className="font-semibold">

                {group}

              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Session Includes */}

      <div className="mt-10 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">

        <div className="flex items-center gap-3">

          <Sparkles />

          <h3 className="text-2xl font-bold">

            Session Focus Areas

          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <FocusCard title="Stress & Anxiety Management" />

          <FocusCard title="Emotional Wellbeing" />

          <FocusCard title="Academic Performance Support" />

          <FocusCard title="Self Confidence Building" />

          <FocusCard title="Healthy Coping Strategies" />

          <FocusCard title="Lifestyle & Mental Wellness" />

        </div>

      </div>

    </motion.div>
  );
}

function FocusCard({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/20">

      <h4 className="font-semibold">

        {title}

      </h4>

    </div>
  );
}