import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Search,
  Users,
  Brain,
  CircleCheckBig,
  Filter,
  Sparkles,
  GraduationCap,
  CalendarRange,
} from "lucide-react";

import CounsellorCard from "@/components/CounsellorCard";
import { counsellors } from "@/data/counsellors";
import { Button } from "@/components/ui/button";

const specializations = [
  "All",
  "Academic Stress & Anxiety",
  "Depression & Emotional Wellbeing",
  "Exam Anxiety & Career Guidance",
  "Burnout & Lifestyle Management",
  "Career Planning",
  "Stress & Anxiety",
  "Relationships & Self Esteem",
  "Sleep & Emotional Wellness",
];

export default function CounsellorList() {
    const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const risk =
    localStorage.getItem("questionnaire_risk") ||
    "Moderate Risk";

  const recommended = useMemo(() => {

    if (risk === "High Risk") {

      return counsellors.find((c) =>
        c.specialization.includes("Depression")
      );

    }

    if (risk === "Moderate Risk") {

      return counsellors.find((c) =>
        c.specialization.includes("Academic")
      );

    }

    return counsellors.find((c) =>
      c.specialization.includes("Career")
    );

  }, [risk]);

  const filteredCounsellors = counsellors.filter((c) => {

    const text =
      (
        c.name +
        c.specialization +
        c.designation +
        c.studentSupportCentre
      ).toLowerCase();

    const matchesSearch =
      text.includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      c.specialization === filter;

    return matchesSearch && matchesFilter;

  });

  return (

    <div className="min-h-screen bg-[#F8F6FF]">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >

          <Brain
            size={64}
            className="mx-auto text-purple-600"
          />

          <h1 className="text-5xl font-bold mt-6">

            Student Counselling & Wellness Centre

          </h1>

          <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-8 text-lg">

            Connect with trained campus counsellors for
            confidential support, emotional wellbeing,
            academic stress, relationships, career guidance
            and personal growth.

          </p>

        </motion.div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <StatCard
            icon={<Users />}
            title="Campus Counsellors"
            value={String(counsellors.length)}
          />

          <StatCard
            icon={<CircleCheckBig />}
            title="Available Today"
            value={String(
              counsellors.filter(
                (c) => c.availableToday
              ).length
            )}
          />

          <StatCard
            icon={<GraduationCap />}
            title="Student Support Centres"
            value="4"
          />

        </div>

        {/* AI Recommendation */}

        {recommended && (

          <div className="mt-12 rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-600 p-8 text-white">

            <div className="flex items-center gap-3">

              <Sparkles />

              <h2 className="text-2xl font-bold">

                AI Recommended Counsellor

              </h2>

            </div>

            <p className="mt-4 text-purple-100 leading-7">

              Based on your mental wellness screening,
              this counsellor may be most suitable for
              your current wellbeing needs.

            </p>

            <div className="mt-6 rounded-2xl bg-white p-6 text-black">

              <h3 className="text-2xl font-bold">

                {recommended.name}

              </h3>

              <p className="text-purple-700 mt-2">

                {recommended.designation}

              </p>

              <p className="mt-1">

                {recommended.specialization}

              </p>

              <p className="mt-4 text-gray-600 leading-7">

                {recommended.about}

              </p>

            </div>

          </div>

        )} 
        {/* Top Action Buttons */}

{/* <div className="mt-8 flex justify-center">

  <div
    onClick={() => navigate("/my-appointments")}
    className="cursor-pointer rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-5 shadow-xl hover:scale-105 transition-all flex items-center gap-4"
  >
    <CalendarRange size={28} />

    <div>
      <h3 className="text-lg font-bold">
        My Appointments
      </h3>

      <p className="text-sm text-purple-100">
        View • Reschedule • Cancel
      </p>
    </div>

  </div>

</div> */}

        {/* Header Actions */}

<div className="flex items-center justify-between mt-12 mb-6">

  <div>

    <h2 className="text-2xl font-bold">
      Student Counsellors
    </h2>

    <p className="text-gray-500 mt-1">
      Browse and book sessions with campus counsellors.
    </p>

  </div>

  <Button
    onClick={() => navigate("/my-appointments")}
  >
    <CalendarRange className="mr-2 h-5 w-5" />
    My Appointments
  </Button>

</div>

{/* Search */}

<div className="mt-6">

  <div className="relative">

            <Search
              className="absolute left-5 top-4 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search counsellor, specialization or support area..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-2xl border bg-white pl-14 py-4 pr-5 outline-none focus:ring-2 focus:ring-purple-600"
            />

          </div>

        </div>

        {/* Filters */}

        <div className="mt-10">

          <div className="flex items-center gap-2 mb-4">

            <Filter size={18} />

            <h2 className="font-semibold">

              Filter by Specialization

            </h2>

          </div>

          <div className="flex flex-wrap gap-3">

            {specializations.map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-5 py-3 rounded-full border transition-all ${
                  filter === item
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white hover:border-purple-500"
                }`}
              >

                {item}

              </button>

            ))}

          </div>

        </div>

        {/* Count */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold">

            {filteredCounsellors.length} Counsellors Available

          </h2>

          <p className="text-gray-500 mt-2">

            Confidential support through the Student Wellness Centre.

          </p>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">

          {filteredCounsellors.map((counsellor) => (

            <CounsellorCard
              key={counsellor.id}
              counsellor={counsellor}
            />

          ))}

        </div>

      </div>

    </div>

  );

}

interface StatProps {

  icon: React.ReactNode;

  title: string;

  value: string;

}

function StatCard({

  icon,

  title,

  value,

}: StatProps) {

  return (

    <div className="rounded-3xl bg-white border p-6 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">

          {icon}

        </div>

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-3xl font-bold">

            {value}

          </h2>

        </div>

      </div>

    </div>

  );

}