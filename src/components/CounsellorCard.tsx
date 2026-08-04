import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Languages,
  BriefcaseBusiness,
  Star,
  Monitor,
  Building2,
  CircleCheckBig,
  CalendarPlus,
  ArrowRight,
  GraduationCap,
  Clock3,
  ShieldCheck,
  MapPinned,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Counsellor } from "@/data/counsellors";

interface Props {
  counsellor: Counsellor;
}

const CounsellorCard = ({ counsellor }: Props) => {

  const navigate = useNavigate();

  return (

    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
      }}
      className="bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all overflow-hidden"
    >

      <div className="p-7">

        {/* Top */}

        <div className="flex justify-between items-start">

          <div className="flex gap-5">

            <img
              src={counsellor.image}
              alt={counsellor.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
            />

            <div>

              <h2 className="text-2xl font-bold">

                {counsellor.name}

              </h2>

              <p className="text-purple-600 font-semibold mt-1">

                {counsellor.designation}

              </p>

              <p className="text-gray-600 mt-1">

                {counsellor.specialization}

              </p>

              <p className="text-sm text-gray-500 mt-1">

                {counsellor.qualification}

              </p>

            </div>

          </div>

          {counsellor.availableToday ? (

            <div className="rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold flex items-center gap-2">

              <CircleCheckBig size={16} />

              Available Today

            </div>

          ) : (

            <div className="rounded-full bg-orange-100 px-4 py-2 text-orange-700 font-semibold">

              Next Available

            </div>

          )}

        </div>

        {/* Info */}

        <div className="grid md:grid-cols-2 gap-4 mt-8">

          <Info
            icon={<Star size={18} />}
            label="Student Rating"
            value={`${counsellor.rating} (${counsellor.totalReviews} Reviews)`}
          />

          <Info
            icon={<BriefcaseBusiness size={18} />}
            label="Experience"
            value={`${counsellor.experience} Years`}
          />

          <Info
            icon={<Languages size={18} />}
            label="Languages"
            value={counsellor.languages.join(", ")}
          />

          <Info
            icon={<Clock3 size={18} />}
            label="Session"
            value={counsellor.sessionDuration}
          />

        </div>

        {/* Student Wellness */}

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          <Info
            icon={<GraduationCap size={18} />}
            label="Student Wellness Centre"
            value={counsellor.studentSupportCentre}
          />

          <Info
            icon={<MapPinned size={18} />}
            label="Campus Location"
            value={counsellor.campusLocation}
          />

        </div>

        {/* Consultation */}

        <div className="mt-8">

          <h3 className="font-semibold mb-3">

            Consultation Modes

          </h3>

          <div className="flex flex-wrap gap-3">

            {counsellor.mode.includes("Online") && (

              <span className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">

                <Monitor size={16} />

                Online

              </span>

            )}

            {counsellor.mode.includes("Offline") && (

              <span className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-purple-700">

                <Building2 size={16} />

                In Person

              </span>

            )}

            <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">

              <ShieldCheck size={16} />

              Free & Confidential

            </span>

          </div>

        </div>

        {/* Expertise */}

        <div className="mt-8">

          <h3 className="font-semibold mb-3">

            Areas of Support

          </h3>

          <div className="flex flex-wrap gap-2">

            {counsellor.expertise.map((item) => (

              <span
                key={item}
                className="rounded-full bg-purple-50 border border-purple-200 px-3 py-2 text-sm"
              >

                {item}

              </span>

            ))}

          </div>

        </div>

        {/* About */}

        <div className="mt-8 rounded-2xl bg-gray-50 p-5">

          <h3 className="font-semibold">

            About

          </h3>

          <p className="mt-3 leading-7 text-gray-600">

            {counsellor.about}

          </p>

        </div>

        {/* Footer */}

        <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mt-8">

          <div className="rounded-xl bg-green-50 border border-green-200 px-5 py-4">

            <p className="text-green-700 font-semibold">

              Student Counselling Service

            </p>

            <p className="text-sm text-gray-600 mt-1">

              Confidential sessions available through the college Student Wellness Centre.

            </p>

          </div>

          <div className="flex gap-3">

            <Button
              variant="outline"
              onClick={() =>
                navigate(`/counsellor/${counsellor.id}`)
              }
            >

              View Profile

              <ArrowRight className="ml-2 h-4 w-4" />

            </Button>

            <Button
              onClick={() =>
                navigate(`/book/${counsellor.id}`)
              }
            >

              <CalendarPlus className="mr-2 h-4 w-4" />

              Book Free Session

            </Button>

          </div>

        </div>

      </div>

    </motion.div>

  );

};

export default CounsellorCard;

interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Info({
  icon,
  label,
  value,
}: InfoProps) {

  return (

    <div className="flex items-center gap-3 rounded-xl border bg-gray-50 p-4">

      <div className="text-purple-600">

        {icon}

      </div>

      <div>

        <p className="text-xs text-gray-500">

          {label}

        </p>

        <p className="font-semibold">

          {value}

        </p>

      </div>

    </div>

  );

}