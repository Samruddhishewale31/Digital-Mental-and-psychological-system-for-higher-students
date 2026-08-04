import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  CalendarPlus,
  CircleCheckBig,
  CircleX,
  Timer,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Counsellor } from "@/data/counsellors";

interface Props {
  counsellor: Counsellor;
}

const weeklySchedule = [
  {
    day: "Monday",
    available: true,
    slots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:00 PM"],
  },
  {
    day: "Tuesday",
    available: true,
    slots: ["10:00 AM", "11:30 AM", "03:00 PM"],
  },
  {
    day: "Wednesday",
    available: true,
    slots: ["09:30 AM", "12:00 PM", "02:30 PM"],
  },
  {
    day: "Thursday",
    available: false,
    slots: [],
  },
  {
    day: "Friday",
    available: true,
    slots: ["10:00 AM", "01:00 PM", "04:30 PM"],
  },
  {
    day: "Saturday",
    available: true,
    slots: ["09:00 AM", "11:00 AM", "01:00 PM"],
  },
  {
    day: "Sunday",
    available: false,
    slots: [],
  },
];

export default function AvailabilitySection({
  counsellor,
}: Props) {

  const navigate = useNavigate();

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mt-8 rounded-3xl bg-white border shadow-sm p-8"
    >

      {/* Heading */}

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

          <CalendarDays className="text-purple-700" />

        </div>

        <div>

          <h2 className="text-3xl font-bold">

            Availability & Scheduling

          </h2>

          <p className="text-gray-500 mt-1">

            View available counselling slots offered through the Student Wellness Centre.

          </p>

        </div>

      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <SummaryCard
          icon={<Timer className="text-purple-700" />}
          title="Session Duration"
          value={counsellor.sessionDuration}
        />

        <SummaryCard
          icon={<ShieldCheck className="text-green-700" />}
          title="Confidentiality"
          value="100% Private"
        />

        <SummaryCard
          icon={<Clock3 className="text-blue-700" />}
          title="Confirmation"
          value="Within 24 Hours"
        />

      </div>

      {/* Weekly Schedule */}

      <div className="mt-12">

        <h3 className="text-2xl font-bold mb-6">

          Weekly Availability

        </h3>

        <div className="space-y-5">

          {weeklySchedule.map((schedule) => (

            <div
              key={schedule.day}
              className="rounded-2xl border p-5"
            >

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

                <div>

                  <h3 className="text-lg font-bold">

                    {schedule.day}

                  </h3>

                  {schedule.available ? (

                    <div className="flex items-center gap-2 mt-2 text-green-600">

                      <CircleCheckBig size={18} />

                      Available

                    </div>

                  ) : (

                    <div className="flex items-center gap-2 mt-2 text-red-600">

                      <CircleX size={18} />

                      Not Available

                    </div>

                  )}

                </div>

                <div className="flex flex-wrap gap-3">

                  {schedule.available ? (

                    schedule.slots.map((slot) => (

                      <button
                        key={slot}
                        className="rounded-xl border bg-purple-50 hover:bg-purple-600 hover:text-white transition-all px-4 py-2 text-sm font-medium"
                      >
                        {slot}
                      </button>

                    ))

                  ) : (

                    <span className="text-gray-500">

                      No slots available

                    </span>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Guidelines */}

      <div className="mt-10 rounded-2xl bg-purple-50 p-6">

        <h3 className="text-xl font-bold text-purple-700">

          Student Counselling Guidelines

        </h3>

        <ul className="mt-5 space-y-3 text-gray-700 leading-7">

          <li>
            • All counselling sessions are confidential.
          </li>

          <li>
            • Students should join or arrive approximately 10 minutes before the scheduled session.
          </li>

          <li>
            • Online meeting details will be shared after appointment confirmation.
          </li>

          <li>
            • Appointments may be rescheduled or cancelled before the scheduled time.
          </li>

          <li>
            • This platform is intended to provide emotional support and guidance and is not an emergency service.
          </li>

        </ul>

      </div>

      {/* Button */}

      <div className="mt-10 text-center">

        <Button
          size="lg"
          className="px-10"
          onClick={() =>
            navigate(`/book/${counsellor.id}`)
          }
        >

          <CalendarPlus className="mr-2 h-5 w-5" />

          Schedule Counselling Session

        </Button>

      </div>

    </motion.div>

  );

}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function SummaryCard({
  icon,
  title,
  value,
}: SummaryCardProps) {

  return (

    <div className="rounded-2xl border bg-gray-50 p-6">

      <div className="flex items-center gap-3">

        {icon}

        <span className="font-semibold">

          {title}

        </span>

      </div>

      <h3 className="text-2xl font-bold mt-5">

        {value}

      </h3>

    </div>

  );

}