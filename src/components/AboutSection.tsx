import { motion } from "framer-motion";
import {
  UserRound,
  GraduationCap,
  Award,
  HeartHandshake,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

import { Counsellor } from "@/data/counsellors";

interface Props {
  counsellor: Counsellor;
}

export default function AboutSection({
  counsellor,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
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

          <UserRound className="text-purple-700" />

        </div>

        <div>

          <h2 className="text-2xl font-bold">

            About Counsellor

          </h2>

          <p className="text-gray-500">

            Professional background and counselling approach

          </p>

        </div>

      </div>

      {/* About */}

      <div className="mt-8">

        <p className="leading-8 text-gray-600">

          {counsellor.about}

        </p>

      </div>

      {/* Qualification */}

      <div className="grid md:grid-cols-2 gap-6 mt-10">

        <InfoCard
          icon={<GraduationCap />}
          title="Qualification"
          description={counsellor.qualification}
        />

        <InfoCard
          icon={<Award />}
          title="Professional Experience"
          description={`${counsellor.experience} Years of Clinical Practice`}
        />

      </div>

      {/* Counselling Approach */}

      <div className="mt-10 rounded-2xl bg-purple-50 p-6">

        <div className="flex items-center gap-3">

          <HeartHandshake className="text-purple-700" />

          <h3 className="text-xl font-semibold">

            Counselling Approach

          </h3>

        </div>

        <p className="mt-4 leading-8 text-gray-700">

          Every individual experiences emotional challenges
          differently. Sessions are conducted in a confidential,
          empathetic and non-judgmental environment where students
          are encouraged to openly discuss their concerns and work
          towards healthier coping strategies and emotional wellbeing.

        </p>

      </div>

      {/* Philosophy */}

      <div className="mt-8 rounded-2xl bg-green-50 p-6">

        <div className="flex items-center gap-3">

          <ShieldCheck className="text-green-700" />

          <h3 className="text-xl font-semibold">

            Professional Philosophy

          </h3>

        </div>

        <p className="mt-4 leading-8 text-gray-700">

          Mental health support should be accessible, respectful and
          personalized. The primary goal is to empower students to
          develop resilience, improve emotional wellbeing and build
          practical strategies to manage academic, personal and social
          challenges.

        </p>

      </div>

      {/* Session Includes */}

      <div className="mt-8 rounded-2xl bg-blue-50 p-6">

        <div className="flex items-center gap-3">

          <BookOpen className="text-blue-700" />

          <h3 className="text-xl font-semibold">

            What to Expect During a Session

          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">

          <FeatureCard text="Confidential one-to-one discussion" />

          <FeatureCard text="Understanding emotional concerns" />

          <FeatureCard text="Stress & anxiety management strategies" />

          <FeatureCard text="Academic wellbeing support" />

          <FeatureCard text="Goal setting and coping techniques" />

          <FeatureCard text="Personalized wellness guidance" />

        </div>

      </div>

    </motion.div>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function InfoCard({
  icon,
  title,
  description,
}: InfoProps) {
  return (
    <div className="rounded-2xl border p-6">

      <div className="flex items-center gap-3">

        <div className="text-purple-700">

          {icon}

        </div>

        <h3 className="font-semibold">

          {title}

        </h3>

      </div>

      <p className="mt-4 text-gray-600 leading-7">

        {description}

      </p>

    </div>
  );
}

function FeatureCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-white border p-4">

      <p className="font-medium">

        {text}

      </p>

    </div>
  );
}