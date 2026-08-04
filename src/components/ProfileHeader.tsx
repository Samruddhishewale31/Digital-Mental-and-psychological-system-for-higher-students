import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Star,
  BriefcaseBusiness,
  Languages,
  Building2,
  Monitor,
  CircleCheckBig,
  CalendarPlus,
  BadgeCheck,
  Clock3,
  GraduationCap,
  MapPinned,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Counsellor } from "@/data/counsellors";

interface Props {
  counsellor: Counsellor;
}

export default function ProfileHeader({
  counsellor,
}: Props) {

  const navigate = useNavigate();

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 rounded-3xl bg-white shadow-lg border overflow-hidden"
    >

      {/* Top Banner */}

      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-600 p-10">

        <div className="flex flex-col lg:flex-row justify-between gap-8">

          {/* Left */}

          <div className="flex gap-6">

            <img
              src={counsellor.image}
              alt={counsellor.name}
              className="w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl"
            />

            <div className="text-white">

              <h1 className="text-4xl font-bold">

                {counsellor.name}

              </h1>

              <p className="mt-3 text-xl text-purple-100">

                {counsellor.designation}

              </p>

              <p className="mt-2 text-lg">

                {counsellor.specialization}

              </p>

              <p className="mt-2">

                {counsellor.qualification}

              </p>

              <div className="flex items-center gap-3 mt-6">

                <BadgeCheck />

                <span>

                  Verified Campus Mental Health Professional

                </span>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="bg-white rounded-3xl p-6 lg:w-96">

            <h2 className="text-2xl font-bold text-purple-700">

              Student Counselling

            </h2>

            <p className="mt-3 text-gray-600 leading-7">

              Confidential counselling sessions are provided
              through the Student Wellness Centre. Students
              can schedule appointments free of cost.

            </p>

            <Button
              className="w-full mt-8"
              size="lg"
              onClick={() =>
                navigate(`/book/${counsellor.id}`)
              }
            >
              <CalendarPlus className="mr-2 h-5 w-5" />

              Book Free Session

            </Button>

          </div>

        </div>

      </div>

      {/* Information */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 p-8">

        <InfoCard
          icon={<Star className="text-yellow-500" />}
          title="Rating"
          value={`${counsellor.rating}/5`}
          subtitle={`${counsellor.totalReviews} Student Reviews`}
        />

        <InfoCard
          icon={<BriefcaseBusiness className="text-purple-600" />}
          title="Experience"
          value={`${counsellor.experience} Years`}
          subtitle="Counselling Experience"
        />

        <InfoCard
          icon={<Languages className="text-blue-600" />}
          title="Languages"
          value={counsellor.languages.join(", ")}
          subtitle="Available Languages"
        />

        <InfoCard
          icon={<Clock3 className="text-green-600" />}
          title="Session Duration"
          value={counsellor.sessionDuration}
          subtitle="Per Session"
        />

      </div>

      {/* Campus Information */}

      <div className="grid md:grid-cols-2 gap-5 px-8">

        <InfoCard
          icon={<GraduationCap className="text-purple-600" />}
          title="Student Support Centre"
          value={counsellor.studentSupportCentre}
          subtitle="College Wellness Services"
        />

        <InfoCard
          icon={<MapPinned className="text-red-500" />}
          title="Campus Location"
          value={counsellor.campusLocation}
          subtitle="Student Access Point"
        />

      </div>

      {/* Consultation */}

      <div className="px-8 py-8">

        <h3 className="font-semibold text-lg mb-4">

          Consultation Modes

        </h3>

        <div className="flex flex-wrap gap-4">

          {counsellor.mode.includes("Online") && (

            <div className="flex items-center gap-2 rounded-xl bg-blue-100 px-5 py-3 text-blue-700 font-medium">

              <Monitor size={18} />

              Online Counselling

            </div>

          )}

          {counsellor.mode.includes("Offline") && (

            <div className="flex items-center gap-2 rounded-xl bg-purple-100 px-5 py-3 text-purple-700 font-medium">

              <Building2 size={18} />

              In-Person Counselling

            </div>

          )}

          {counsellor.availableToday ? (

            <div className="flex items-center gap-2 rounded-xl bg-green-100 px-5 py-3 text-green-700 font-medium">

              <CircleCheckBig size={18} />

              Available Today

            </div>

          ) : (

            <div className="flex items-center gap-2 rounded-xl bg-orange-100 px-5 py-3 text-orange-700 font-medium">

              <CircleCheckBig size={18} />

              Next Available Tomorrow

            </div>

          )}

        </div>

      </div>

    </motion.div>

  );

}

interface InfoCardProps {

  icon: React.ReactNode;

  title: string;

  value: string;

  subtitle: string;

}

function InfoCard({

  icon,

  title,

  value,

  subtitle,

}: InfoCardProps) {

  return (

    <div className="rounded-2xl border bg-gray-50 p-5">

      <div className="flex items-center gap-3">

        {icon}

        <span className="font-semibold">

          {title}

        </span>

      </div>

      <h3 className="text-xl font-bold mt-4">

        {value}

      </h3>

      <p className="text-gray-500 mt-2 text-sm">

        {subtitle}

      </p>

    </div>

  );

}