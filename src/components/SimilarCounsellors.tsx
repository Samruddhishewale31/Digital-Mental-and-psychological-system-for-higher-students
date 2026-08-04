import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Star,
  BadgeCheck,
  CircleCheckBig,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { counsellors } from "@/data/counsellors";

interface Props {
  currentId: number;
}

export default function SimilarCounsellors({
  currentId,
}: Props) {
  const navigate = useNavigate();

  const similar = counsellors
    .filter((c) => c.id !== currentId)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mt-12"
    >
      <h2 className="text-3xl font-bold">
        Other Student Counsellors
      </h2>

      <p className="text-gray-600 mt-2">
        Explore other counsellors available through the
        Student Wellness Centre.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {similar.map((counsellor) => (
          <div
            key={counsellor.id}
            className="bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Image */}

            <img
              src={counsellor.image}
              alt={counsellor.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-bold">
                {counsellor.name}
              </h3>

              <p className="text-purple-600 mt-2">
                {counsellor.specialization}
              </p>

              <div className="flex items-center gap-2 mt-3 text-green-700">
                <BadgeCheck size={18} />
                Student Wellness Centre
              </div>

              <div className="space-y-3 mt-6">

                <div className="flex items-center gap-2">
                  <Star
                    size={18}
                    className="text-yellow-500"
                  />
                  <span>
                    {counsellor.rating} ({counsellor.totalReviews} Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BriefcaseBusiness
                    size={18}
                    className="text-purple-600"
                  />
                  <span>
                    {counsellor.experience} Years Experience
                  </span>
                </div>

                <div className="flex items-center gap-2">
  <MapPin
    size={18}
    className="text-red-500"
  />
  <span>Student Wellness Centre</span>
</div>

                <div className="flex items-center gap-2">
                  <CircleCheckBig
                    size={18}
                    className={
                      counsellor.availableToday
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  />

                  <span>
                    {counsellor.availableToday
                      ? "Available Today"
                      : "Available Tomorrow"}
                  </span>
                </div>

              </div>

              <Button
                className="w-full mt-8"
                onClick={() =>
                  navigate(`/counsellor/${counsellor.id}`)
                }
              >
                View Profile

                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}